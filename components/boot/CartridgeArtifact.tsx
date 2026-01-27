'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE ARTIFACT — Single Ritual Cartridge with Projected Decal
//
// Uses @react-three/drei Decal to project label onto cartridge mesh.
// Debug mode shows axes helper and wireframe for calibration.
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef, useMemo, useEffect } from 'react';
import { useGLTF, Decal } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useBootSequence } from './useBootSequence';
import { useLabelTexture, ORIGIN_DECAL_SPEC } from '../r3f/CartridgeDecal';

// ─────────────────────────────────────────────────────────────────────────────────
// DEBUG MODE — Toggle this to calibrate decal placement
// ─────────────────────────────────────────────────────────────────────────────────

const DEBUG_MODE = false;

// ─────────────────────────────────────────────────────────────────────────────────
// DECAL CALIBRATION CONSTANTS — Tune these values
// ─────────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// DECAL CALIBRATION — Tune these to position the label in the bay
// ═══════════════════════════════════════════════════════════════════════════════

// Position: [x, y, z] — nudge into the recessed bay center
// x = left/right, y = up/down, z = toward camera
const DECAL_POSITION: [number, number, number] = [0.02, 0.03, 0.055];

// Rotation: [rx, ry, rz] in radians
// X: -π/2 to face upward (toward camera looking down)
// Z: π/2 to rotate text upright, minus small correction for alignment
const DECAL_ROTATION: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2 - 0.08];

// Scale: fill the bay with margin
const DECAL_SCALE = 0.20;

// ─────────────────────────────────────────────────────────────────────────────────
// TRANSFORM CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const BASE_POSITION: [number, number, number] = [0, 0, 0];
const BASE_ROTATION: [number, number, number] = [0, 0, 0];
const BASE_SCALE = 0.35;

const HOVER_LIFT = 0.04;
const HOVER_PITCH_BOOST = 0.03;

const SELECTED_LIFT = 0.12;
const SELECTED_YAW = 0.15;
const SELECTED_PITCH = 0.08;

const INSERT_DURATION = 400;

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeArtifactProps {
  onInserted?: (cartridgeId: string) => void;
}

export function CartridgeArtifact({ onInserted }: CartridgeArtifactProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF('/models/cartridge.glb');

  // Generate label texture
  const labelTexture = useLabelTexture(ORIGIN_DECAL_SPEC);

  // State
  const state = useBootSequence((s) => s.state);
  const cartridgeId = useBootSequence((s) => s.cartridgeId);
  const setHover = useBootSequence((s) => s.setHover);
  const select = useBootSequence((s) => s.select);
  const startInsert = useBootSequence((s) => s.startInsert);
  const completeInsert = useBootSequence((s) => s.completeInsert);

  // ─────────────────────────────────────────────────────────────────────────────
  // FIND THE MAIN MESH FROM GLB
  // ─────────────────────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────────────────────
  // ANALYZE GLB STRUCTURE — Log all meshes to find label mesh
  // ─────────────────────────────────────────────────────────────────────────────

  const { geometry, material, labelMesh } = useMemo(() => {
    const allMeshes: { name: string; volume: number }[] = [];
    let targetMesh: THREE.Mesh | null = null;
    let labelTarget: THREE.Mesh | null = null;
    let largestVolume = 0;

    // Traverse and log ALL meshes
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const volume = size.x * size.y * size.z;
          
          allMeshes.push({ name: child.name, volume });
          
          // Check if this is a label mesh
          const nameLower = child.name.toLowerCase();
          if (nameLower.includes('label') || nameLower.includes('sticker') || nameLower.includes('decal')) {
            labelTarget = child;
            console.log('[CartridgeArtifact] 🏷️ Found label mesh:', child.name);
          }
          
          // Track largest for body
          if (volume > largestVolume) {
            largestVolume = volume;
            targetMesh = child;
          }
        }
      }
    });

    // Log all meshes for debugging
    console.log('[CartridgeArtifact] All meshes in GLB:', allMeshes);

    if (!targetMesh) {
      console.warn('[CartridgeArtifact] No mesh found in GLB');
      return { geometry: null, material: null, labelMesh: null };
    }

    const mesh = targetMesh as THREE.Mesh;
    console.log('[CartridgeArtifact] Main body mesh:', mesh.name);

    // Clone geometry and material
    const geo = mesh.geometry.clone();
    const mat = Array.isArray(mesh.material)
      ? mesh.material[0].clone()
      : mesh.material.clone();

    return { 
      geometry: geo, 
      material: mat,
      labelMesh: labelTarget 
    };
  }, [scene]);

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTE TARGET TRANSFORMS
  // ─────────────────────────────────────────────────────────────────────────────

  const targetTransform = useMemo(() => {
    let position = [...BASE_POSITION] as [number, number, number];
    let rotation = [...BASE_ROTATION] as [number, number, number];
    let scale = BASE_SCALE;

    if (state === 'hover') {
      position[1] += HOVER_LIFT;
      rotation[0] += HOVER_PITCH_BOOST;
    } else if (state === 'selected' || state === 'inserting') {
      position[1] += SELECTED_LIFT;
      rotation[0] += SELECTED_PITCH;
      rotation[1] += SELECTED_YAW;
    } else if (state === 'inserted') {
      position[2] += 0.8;
      scale = 0.2;
    }

    return { position, rotation, scale };
  }, [state]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SPRING ANIMATION
  // ─────────────────────────────────────────────────────────────────────────────

  const spring = useSpring({
    position: targetTransform.position,
    rotation: targetTransform.rotation,
    scale: targetTransform.scale,
    config: state === 'inserting'
      ? { tension: 80, friction: 20 }
      : { tension: 200, friction: 22 },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TRIGGER INSERT AFTER SELECTION
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state === 'selected') {
      const timer = setTimeout(() => startInsert(), INSERT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [state, startInsert]);

  useEffect(() => {
    if (state === 'inserting') {
      const timer = setTimeout(() => {
        completeInsert();
        onInserted?.(cartridgeId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, completeInsert, cartridgeId, onInserted]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const isInteractive = state === 'idle' || state === 'hover';

  const handlePointerOver = () => {
    if (isInteractive) {
      setHover(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (isInteractive) {
      setHover(false);
      document.body.style.cursor = 'auto';
    }
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isInteractive) {
      select();
      document.body.style.cursor = 'auto';
    }
  };

  // Hide after inserted
  if (state === 'inserted') return null;

  // Need geometry and material
  if (!geometry || !material) return null;

  return (
    <animated.group
      ref={groupRef}
      position={spring.position}
      rotation={spring.rotation as unknown as THREE.Euler}
      scale={spring.scale}
      onPointerOver={isInteractive ? handlePointerOver : undefined}
      onPointerOut={isInteractive ? handlePointerOut : undefined}
      onClick={isInteractive ? handleClick : undefined}
    >
      {/* Main cartridge mesh with decal */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      >
        {/* Projected decal label */}
        {labelTexture && (
          <Decal
            position={DECAL_POSITION}
            rotation={DECAL_ROTATION}
            scale={DECAL_SCALE}
            map={labelTexture}
            polygonOffsetFactor={-8}
          />
        )}
      </mesh>

      {/* DEBUG: Wireframe overlay (separate mesh) */}
      {DEBUG_MODE && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            wireframe
            color="#00ff00"
            transparent
            opacity={0.08}
            depthTest={false}
          />
        </mesh>
      )}

      {/* DEBUG: Axes helper at decal position */}
      {DEBUG_MODE && (
        <group position={DECAL_POSITION}>
          <axesHelper args={[0.15]} />
        </group>
      )}
    </animated.group>
  );
}

// Preload
useGLTF.preload('/models/cartridge.glb');
