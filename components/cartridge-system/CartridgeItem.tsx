'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE ITEM — Interactive 3D Cartridge Instance
//
// One cartridge in the stack with full interaction:
// - Hover: lift + slight tilt
// - Pick up: follows pointer, rotates with drag
// - Aim: magnetic snap toward slot when near
// - Insert: animate into slot, hide when complete
//
// Uses a single shared GLTF asset, cloned per instance.
// Label and holo decals projected onto the body mesh.
//
// TWEAK POINTS:
// - LABEL_DECAL_POSITION/ROTATION/SCALE: Label placement on cartridge
// - HOLO_DECAL_POSITION/ROTATION/SCALE: Holographic sticker placement
// - Various animation constants
// ═══════════════════════════════════════════════════════════════════════════════

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import type {
  CartridgeDef,
  CartridgeMachineState,
  CartridgeMachineAction,
  Pose,
} from './types';
import {
  HOVER_LIFT,
  SLOT_SNAP_DISTANCE,
  HELD_Z_DEPTH,
  MAX_DRAG_ROTATION,
} from './types';
import { isHeld, isHovered, isSelected, canPickUp } from './state/machine';
import { dampVector3, dampQuaternion, rayPlaneIntersect, isNear, clampAngle } from './utils/math';
import { HoloStickerMaterial } from './decals/HoloStickerMaterial';

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS — TWEAK THESE
// ─────────────────────────────────────────────────────────────────────────────────

// GLB model path
const MODEL_PATH = '/models/cartridge.glb';

// Animation damping factors (higher = faster)
const POSITION_DAMPING = 12;
const ROTATION_DAMPING = 8;

// Label decal placement
// TWEAK: Adjust these based on your GLB's label plate region
const LABEL_DECAL_POSITION: [number, number, number] = [0, 0.15, 0.035];
const LABEL_DECAL_ROTATION: [number, number, number] = [0, 0, 0];
const LABEL_DECAL_SCALE: [number, number, number] = [0.35, 0.2, 0.1];

// Holo sticker placement
// TWEAK: Adjust for corner placement on your GLB
const HOLO_DECAL_POSITION: [number, number, number] = [0.12, 0.22, 0.036];
const HOLO_DECAL_ROTATION: [number, number, number] = [0, 0, 0.1];
const HOLO_DECAL_SCALE: [number, number, number] = [0.08, 0.08, 0.05];

// Breathing motion for idle cartridges
const BREATHING_AMPLITUDE = 0.003;
const BREATHING_SPEED = 0.0008;

// Insert animation
const INSERT_OFFSET = new THREE.Vector3(0, 0.05, -0.15);

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeItemProps {
  def: CartridgeDef;
  homePose: Pose;
  stackIndex: number;
  machineState: CartridgeMachineState;
  dispatch: React.Dispatch<CartridgeMachineAction>;
  slotPose: Pose;
  onAimChange: (isAiming: boolean) => void;
}

export interface CartridgeItemHandle {
  resetPosition: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRELOAD MODEL
// ─────────────────────────────────────────────────────────────────────────────────

useGLTF.preload(MODEL_PATH);

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export const CartridgeItem = forwardRef<CartridgeItemHandle, CartridgeItemProps>(
  function CartridgeItem(
    { def, homePose, stackIndex, machineState, dispatch, slotPose, onAimChange },
    ref
  ) {
    const { camera, gl } = useThree();
    const groupRef = useRef<THREE.Group>(null);

    // Load and clone the GLB
    const { scene } = useGLTF(MODEL_PATH);
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Load label texture (handles missing files gracefully)
    const [labelTexture, setLabelTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
      const loader = new THREE.TextureLoader();
      loader.load(
        def.labelSrc,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.flipY = false; // GLB convention
          setLabelTexture(tex);
        },
        undefined,
        () => {
          // Texture not found - that's okay, cartridge will have no label
          console.warn(`[CartridgeItem] Label texture not found: ${def.labelSrc}`);
          setLabelTexture(null);
        }
      );
    }, [def.labelSrc]);

    // Holo sticker texture (optional - falls back to solid color)
    const [holoTexture, setHoloTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
      const loader = new THREE.TextureLoader();
      loader.load(
        '/decals/stickers/holo.png',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.flipY = false; // GLB convention
          setHoloTexture(tex);
        },
        undefined,
        () => {
          // Texture not found - that's okay, we'll use solid color
          setHoloTexture(null);
        }
      );
    }, []);

    // Create holo material
    const holoMaterial = useMemo(() => {
      return new HoloStickerMaterial({
        map: holoTexture,
        tint: def.holoTint,
      });
    }, [holoTexture, def.holoTint]);

    // ═══════════════════════════════════════════════════════════════════════════
    // POSITION & ROTATION STATE
    // ═══════════════════════════════════════════════════════════════════════════

    // Current animated values (refs for performance)
    const currentPosition = useRef(homePose.position.clone());
    const currentQuaternion = useRef(homePose.quaternion.clone());
    const targetPosition = useRef(homePose.position.clone());
    const targetQuaternion = useRef(homePose.quaternion.clone());

    // Drag state
    const dragStartPointer = useRef(new THREE.Vector2());
    const dragStartPosition = useRef(new THREE.Vector3());
    const dragRotation = useRef({ yaw: 0, pitch: 0 });
    const pointerRef = useRef(new THREE.Vector2());
    const isPointerDown = useRef(false);

    // Visibility (hidden after insert completes)
    const [isVisible, setIsVisible] = useState(true);

    // ═══════════════════════════════════════════════════════════════════════════
    // DERIVED STATE
    // ═══════════════════════════════════════════════════════════════════════════

    const isThisHeld = isHeld(machineState, def.id);
    const isThisHovered = isHovered(machineState, def.id);
    const isThisSelected = isSelected(machineState, def.id);
    const isAiming = machineState.mode === 'AIMING' && machineState.heldId === def.id;
    const isInserting = machineState.mode === 'INSERTING' && isThisSelected;
    const isInteractable = canPickUp(machineState) || isThisHeld;

    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLE VISIBILITY FOR INSERTED CARTRIDGES
    // ═══════════════════════════════════════════════════════════════════════════

    useEffect(() => {
      if (machineState.mode === 'BOOTING' && isThisSelected) {
        // Hide cartridge after insert animation
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 400);
        return () => clearTimeout(timer);
      }
    }, [machineState.mode, isThisSelected]);

    // ═══════════════════════════════════════════════════════════════════════════
    // EXPOSE HANDLE
    // ═══════════════════════════════════════════════════════════════════════════

    useImperativeHandle(ref, () => ({
      resetPosition: () => {
        currentPosition.current.copy(homePose.position);
        currentQuaternion.current.copy(homePose.quaternion);
        targetPosition.current.copy(homePose.position);
        targetQuaternion.current.copy(homePose.quaternion);
        setIsVisible(true);
      },
    }));

    // ═══════════════════════════════════════════════════════════════════════════
    // POINTER EVENTS
    // ═══════════════════════════════════════════════════════════════════════════

    const handlePointerOver = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        if (!canPickUp(machineState)) return;
        e.stopPropagation();
        dispatch({ type: 'HOVER_IN', id: def.id });
        document.body.style.cursor = 'grab';
      },
      [machineState, dispatch, def.id]
    );

    const handlePointerOut = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        if (!isThisHovered) return;
        e.stopPropagation();
        dispatch({ type: 'HOVER_OUT', id: def.id });
        document.body.style.cursor = 'auto';
      },
      [isThisHovered, dispatch, def.id]
    );

    const handlePointerDown = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        if (!canPickUp(machineState)) return;
        e.stopPropagation();

        // Capture pointer for drag tracking
        (e.nativeEvent.target as Element)?.setPointerCapture?.(e.nativeEvent.pointerId);

        // Store drag start state
        isPointerDown.current = true;
        dragStartPointer.current.set(e.nativeEvent.clientX, e.nativeEvent.clientY);
        dragStartPosition.current.copy(currentPosition.current);
        dragRotation.current = { yaw: 0, pitch: 0 };

        dispatch({ type: 'PICK_UP', id: def.id });
        document.body.style.cursor = 'grabbing';
      },
      [machineState, dispatch, def.id]
    );

    const handlePointerUp = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        if (!isThisHeld) return;
        e.stopPropagation();

        isPointerDown.current = false;
        (e.nativeEvent.target as Element)?.releasePointerCapture?.(e.nativeEvent.pointerId);

        dispatch({ type: 'DROP' });
        document.body.style.cursor = isThisHovered ? 'grab' : 'auto';
      },
      [isThisHeld, isThisHovered, dispatch]
    );

    const handlePointerMove = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        if (!isThisHeld || !isPointerDown.current) return;

        // Update pointer position for drag plane intersection
        const rect = gl.domElement.getBoundingClientRect();
        pointerRef.current.set(
          ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1
        );

        // Calculate drag delta for rotation
        const deltaX = (e.nativeEvent.clientX - dragStartPointer.current.x) / rect.width;
        const deltaY = (e.nativeEvent.clientY - dragStartPointer.current.y) / rect.height;

        dragRotation.current.yaw = clampAngle(deltaX * 2, MAX_DRAG_ROTATION);
        dragRotation.current.pitch = clampAngle(-deltaY * 1.5, MAX_DRAG_ROTATION * 0.5);
      },
      [isThisHeld, gl.domElement]
    );

    // Global pointer up listener (in case pointer leaves canvas)
    useEffect(() => {
      const handleGlobalPointerUp = () => {
        if (isThisHeld && isPointerDown.current) {
          isPointerDown.current = false;
          dispatch({ type: 'DROP' });
          document.body.style.cursor = 'auto';
        }
      };

      window.addEventListener('pointerup', handleGlobalPointerUp);
      return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
    }, [isThisHeld, dispatch]);

    // ═══════════════════════════════════════════════════════════════════════════
    // FRAME UPDATE — Animation
    // ═══════════════════════════════════════════════════════════════════════════

    useFrame((state, delta) => {
      if (!groupRef.current || !isVisible) return;

      const mode = machineState.mode;
      const time = state.clock.elapsedTime;

      // ─────────────────────────────────────────────────────────────────────────
      // COMPUTE TARGET POSE
      // ─────────────────────────────────────────────────────────────────────────

      if (isInserting) {
        // Animate into slot
        const insertTarget = slotPose.position.clone().add(INSERT_OFFSET);
        targetPosition.current.copy(insertTarget);
        targetQuaternion.current.copy(slotPose.quaternion);
      } else if (isAiming) {
        // Magnetic snap toward slot (but not fully in)
        const aimOffset = new THREE.Vector3(0, 0.15, 0.1);
        targetPosition.current.copy(slotPose.position).add(aimOffset);
        targetQuaternion.current.copy(slotPose.quaternion);
      } else if (isThisHeld) {
        // Follow pointer on drag plane
        const dragPos = rayPlaneIntersect(pointerRef.current, camera, HELD_Z_DEPTH);
        targetPosition.current.copy(dragPos);

        // Apply drag rotation
        const euler = new THREE.Euler(
          dragRotation.current.pitch,
          dragRotation.current.yaw,
          0
        );
        targetQuaternion.current.setFromEuler(euler);

        // Check proximity to slot for aiming transition
        const slotPos = slotPose.position;
        const wasAiming = mode === 'AIMING';
        const shouldAim = isNear(targetPosition.current, slotPos, SLOT_SNAP_DISTANCE);

        if (shouldAim && !wasAiming) {
          onAimChange(true);
          dispatch({ type: 'AIM_IN' });
        } else if (!shouldAim && wasAiming) {
          onAimChange(false);
          dispatch({ type: 'AIM_OUT' });
        }
      } else if (isThisHovered) {
        // Hover: lift and slight tilt
        targetPosition.current.copy(homePose.position);
        targetPosition.current.y += HOVER_LIFT;

        const hoverEuler = new THREE.Euler(0.03, 0.02, 0);
        targetQuaternion.current.copy(homePose.quaternion);
        targetQuaternion.current.multiply(new THREE.Quaternion().setFromEuler(hoverEuler));
      } else {
        // Idle: home pose + breathing
        targetPosition.current.copy(homePose.position);
        targetPosition.current.y += Math.sin(time * BREATHING_SPEED * 1000 + stackIndex) * BREATHING_AMPLITUDE;
        targetQuaternion.current.copy(homePose.quaternion);
      }

      // ─────────────────────────────────────────────────────────────────────────
      // APPLY DAMPING
      // ─────────────────────────────────────────────────────────────────────────

      const posLambda = isThisHeld || isAiming ? POSITION_DAMPING * 1.5 : POSITION_DAMPING;
      const rotLambda = isThisHeld || isAiming ? ROTATION_DAMPING * 1.2 : ROTATION_DAMPING;

      dampVector3(currentPosition.current, targetPosition.current, posLambda, delta);
      dampQuaternion(currentQuaternion.current, targetQuaternion.current, rotLambda, delta);

      // ─────────────────────────────────────────────────────────────────────────
      // UPDATE GROUP TRANSFORM
      // ─────────────────────────────────────────────────────────────────────────

      groupRef.current.position.copy(currentPosition.current);
      groupRef.current.quaternion.copy(currentQuaternion.current);

      // ─────────────────────────────────────────────────────────────────────────
      // UPDATE HOLO MATERIAL SHIMMER
      // ─────────────────────────────────────────────────────────────────────────

      if (holoMaterial) {
        const shimmerIntensity = isThisHeld || isThisHovered ? 1.5 : 0.5;
        holoMaterial.update(delta, shimmerIntensity);
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // MATERIAL SETUP
    // ═══════════════════════════════════════════════════════════════════════════

    // Apply matte beige ABS plastic material to all meshes + enable shadow casting
    useEffect(() => {
      const seed = def.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const roughnessVariance = 0.05 * ((seed % 10) / 10 - 0.5);

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // Enable shadow casting for contact shadows
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          // Apply matte beige ABS plastic material
          mesh.material = new THREE.MeshStandardMaterial({
            color: '#d8d1c7', // Beige ABS plastic
            roughness: 0.7 + roughnessVariance,
            metalness: 0.05,
          });
        }
      });
    }, [clonedScene, def.id]);

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════════

    if (!isVisible) return null;

    return (
      <group
        ref={groupRef}
        scale={0.22} // TWEAK: Adjust scale for your GLB — larger for tactile presence
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        {/* The GLB model */}
        <primitive object={clonedScene} />

        {/* Label as positioned plane mesh (more reliable than Decal with cloned primitives) */}
        {labelTexture && (
          <mesh
            position={LABEL_DECAL_POSITION}
            rotation={LABEL_DECAL_ROTATION}
          >
            <planeGeometry args={[LABEL_DECAL_SCALE[0], LABEL_DECAL_SCALE[1]]} />
            <meshStandardMaterial
              map={labelTexture}
              transparent
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Holographic sticker as positioned plane mesh */}
        <mesh
          position={HOLO_DECAL_POSITION}
          rotation={HOLO_DECAL_ROTATION}
        >
          <planeGeometry args={[HOLO_DECAL_SCALE[0], HOLO_DECAL_SCALE[1]]} />
          <primitive object={holoMaterial} attach="material" />
        </mesh>
      </group>
    );
  }
);

export default CartridgeItem;
