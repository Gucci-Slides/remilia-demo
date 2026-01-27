'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CartridgeScreen } from './CartridgeScreen';
import type { CartridgeState } from '@/hooks/useCartridgeMachine';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE MODEL — 3D GLB with Interactive States
//
// Loads the cartridge GLB and:
// - Controls group pose (position/rotation) based on state
// - Animates button depression on pressing state
// - Embeds CartridgeScreen plane for the display
// - Handles pointer events for the state machine
//
// Motion is slow, deliberate, physical — no overshoot except tiny button return.
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const MODEL_PATH = '/models/origin-cartridge.glb';

// Pose configurations
const POSES = {
  idle: {
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  hover: {
    position: [0, 0.02, 0] as [number, number, number],
    rotation: [0.02, 0, 0] as [number, number, number],
  },
  pressing: {
    position: [0, 0.01, 0] as [number, number, number],
    rotation: [0.02, 0, 0] as [number, number, number],
  },
  inserting: {
    position: [0, -0.08, 0.02] as [number, number, number],
    rotation: [-0.04, 0, 0] as [number, number, number],
  },
  inserted: {
    position: [0, -0.12, 0.03] as [number, number, number],
    rotation: [-0.06, 0, 0] as [number, number, number],
  },
};

// Animation speeds
const LERP_SPEED = {
  position: 4,
  rotation: 3,
  button: 8,
};

// Button depression depth
const BUTTON_DEPRESSION = 0.008;

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeModelProps {
  state: CartridgeState;
  screenLines: string[];
  screenActive: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onClick: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function CartridgeModel({
  state,
  screenLines,
  screenActive,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onClick,
}: CartridgeModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Object3D | null>(null);
  
  // Current animated values
  const currentPosition = useRef(new THREE.Vector3(...POSES.idle.position));
  const currentRotation = useRef(new THREE.Euler(...POSES.idle.rotation));
  const currentButtonY = useRef(0);
  
  // Load the GLB model
  const { scene } = useGLTF(MODEL_PATH);
  const [modelReady, setModelReady] = useState(false);

  // Clone the scene to avoid shared state issues
  const clonedScene = useRef<THREE.Group | null>(null);
  
  useEffect(() => {
    if (scene) {
      clonedScene.current = scene.clone();
      
      // Find button mesh if it exists (for animation)
      clonedScene.current.traverse((child) => {
        if (child.name.toLowerCase().includes('button')) {
          buttonRef.current = child;
        }
        
        // Apply material tweaks for industrial look
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = Math.max(mat.roughness, 0.6);
            mat.metalness = Math.min(mat.metalness, 0.3);
          }
        }
      });
      
      setModelReady(true);
    }
  }, [scene]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GET TARGET POSE
  // ═══════════════════════════════════════════════════════════════════════════

  const getTargetPose = () => {
    switch (state) {
      case 'idle':
        return POSES.idle;
      case 'hover':
        return POSES.hover;
      case 'pressing':
        return POSES.pressing;
      case 'inserting':
        return POSES.inserting;
      case 'verifying':
      case 'booting':
      case 'ready':
      case 'error':
        return POSES.inserted;
      default:
        return POSES.idle;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION FRAME
  // ═══════════════════════════════════════════════════════════════════════════

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetPose = getTargetPose();
    
    // Lerp position
    currentPosition.current.lerp(
      new THREE.Vector3(...targetPose.position),
      delta * LERP_SPEED.position
    );
    groupRef.current.position.copy(currentPosition.current);
    
    // Subtle idle float (sub-millimeter, "powered but waiting")
    if (state === 'idle' || state === 'hover') {
      groupRef.current.position.y += Math.sin(performance.now() * 0.0004) * 0.0006;
    }

    // Lerp rotation
    const targetEuler = new THREE.Euler(...targetPose.rotation);
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetEuler.x,
      delta * LERP_SPEED.rotation
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetEuler.y,
      delta * LERP_SPEED.rotation
    );
    currentRotation.current.z = THREE.MathUtils.lerp(
      currentRotation.current.z,
      targetEuler.z,
      delta * LERP_SPEED.rotation
    );
    groupRef.current.rotation.copy(currentRotation.current);

    // Animate button depression
    if (buttonRef.current) {
      const targetButtonY = state === 'pressing' ? -BUTTON_DEPRESSION : 0;
      currentButtonY.current = THREE.MathUtils.lerp(
        currentButtonY.current,
        targetButtonY,
        delta * LERP_SPEED.button
      );
      buttonRef.current.position.y = currentButtonY.current;
    }
  });

  if (!modelReady || !clonedScene.current) {
    return null;
  }

  return (
    // Outer group: base orientation + scale (static)
    <group 
      scale={0.2}                              // Shrink GLB to reasonable size
      rotation={[-Math.PI / 2, 0, Math.PI]}   // 90° forward + 180° Z flip (alternate axis)
      position={[0, -0.3, 0]}                 // Center vertically
    >
      {/* Inner group: animated pose (position/rotation deltas) */}
      <group ref={groupRef}>
        {/* The GLB model */}
        <primitive
          object={clonedScene.current}
          onPointerEnter={(e: THREE.Event) => {
            e.stopPropagation();
            onPointerEnter();
            document.body.style.cursor = 'pointer';
          }}
          onPointerLeave={(e: THREE.Event) => {
            e.stopPropagation();
            onPointerLeave();
            document.body.style.cursor = 'auto';
          }}
          onPointerDown={(e: THREE.Event) => {
            e.stopPropagation();
            onPointerDown();
          }}
          onPointerUp={(e: THREE.Event) => {
            e.stopPropagation();
            onPointerUp();
          }}
          onClick={(e: THREE.Event) => {
            e.stopPropagation();
            onClick();
          }}
        />
        
        {/* Screen as glass overlay - sits IN FRONT of plastic recess */}
        <CartridgeScreen
          lines={screenLines}
          active={screenActive}
          state={state}
          position={[0.6, 0.4, 0.4]}        // In front of plastic, centered on recess
          rotation={[Math.PI / 2, 0, 0]}    // Rotated to face camera
          scale={[3, 2.4, 1]}               // Sized to fill recess
        />
      </group>
    </group>
  );
}

// Preload the model
useGLTF.preload(MODEL_PATH);

export default CartridgeModel;
