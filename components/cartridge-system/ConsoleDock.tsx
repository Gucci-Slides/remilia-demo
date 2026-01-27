'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSOLE DOCK — Product-Quality Slab + Emissive Slot
//
// The console that receives cartridges:
// - Warm graphite materials with edge readability
// - Emissive slot glow that responds to interaction state
// - Proper shadow casting/receiving
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CartridgeMode } from './types';

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

// Position: raised so console is fully visible in frame
const DOCK_POSITION: [number, number, number] = [0.2, -0.55, 0.2];

// Rotation: tilt the console toward the camera (front edge up)
// Negative X rotation tilts the front up toward the viewer
const DOCK_ROTATION: [number, number, number] = [-0.12, 0.08, 0]; // ~7° toward camera, slight Y rotation for dynamism

// Size of the main console slab [width, height, depth]
const SLAB_SIZE: [number, number, number] = [2.4, 0.12, 1.1];

// Slot opening size [width, height, depth]
const SLOT_SIZE: [number, number, number] = [0.42, 0.06, 0.22];

// Slot position offset from dock center (front-facing)
const SLOT_OFFSET: [number, number, number] = [0, 0.065, 0.32];

// Indicator light position
const LIGHT_OFFSET: [number, number, number] = [0.75, 0.07, 0.4];

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface ConsoleDockHandle {
  getSlotPose: () => { position: THREE.Vector3; quaternion: THREE.Quaternion };
  getSlotPosition: () => THREE.Vector3;
}

interface ConsoleDockProps {
  mode: CartridgeMode;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export const ConsoleDock = forwardRef<ConsoleDockHandle, ConsoleDockProps>(
  function ConsoleDock({ mode }, ref) {
    const groupRef = useRef<THREE.Group>(null);
    const slotTargetRef = useRef<THREE.Mesh>(null);
    const indicatorMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
    const slotGlowMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

    const pulseTime = useRef(0);

    useFrame((_, delta) => {
      // ─────────────────────────────────────────────────────────────────────
      // SLOT GLOW — the "boot device" moment
      // ─────────────────────────────────────────────────────────────────────
      if (slotGlowMaterialRef.current) {
        const isAiming = mode === 'AIMING';
        const isBooting = mode === 'BOOTING';
        const isInserting = mode === 'INSERTING';
        const isReady = mode === 'READY';

        // Target emissive intensity based on state
        let targetIntensity = 0.8; // idle glow
        if (isAiming) targetIntensity = 1.6;
        if (isInserting) targetIntensity = 2.0;
        if (isBooting) targetIntensity = 3.0;
        if (isReady) targetIntensity = 1.2;

        // Smooth transition
        const current = slotGlowMaterialRef.current.emissiveIntensity;
        slotGlowMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          current,
          targetIntensity,
          delta * 6
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // INDICATOR LIGHT
      // ─────────────────────────────────────────────────────────────────────
      if (indicatorMaterialRef.current) {
        const isBooting = mode === 'BOOTING';
        const isReady = mode === 'READY';

        if (isBooting) {
          pulseTime.current += delta * 8;
          const pulse = 0.5 + Math.sin(pulseTime.current) * 0.5;
          indicatorMaterialRef.current.emissive.setRGB(0, pulse * 0.9, pulse * 0.4);
          indicatorMaterialRef.current.emissiveIntensity = pulse * 2.5;
        } else if (isReady) {
          indicatorMaterialRef.current.emissive.setRGB(0.2, 0.95, 0.5);
          indicatorMaterialRef.current.emissiveIntensity = 2;
          pulseTime.current = 0;
        } else {
          indicatorMaterialRef.current.emissive.setRGB(0.08, 0.08, 0.08);
          indicatorMaterialRef.current.emissiveIntensity = 0.4;
          pulseTime.current = 0;
        }
      }
    });

    // Expose handle
    useImperativeHandle(ref, () => ({
      getSlotPose: () => {
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        if (slotTargetRef.current) {
          slotTargetRef.current.getWorldPosition(position);
          slotTargetRef.current.getWorldQuaternion(quaternion);
        } else {
          position.set(
            DOCK_POSITION[0] + SLOT_OFFSET[0],
            DOCK_POSITION[1] + SLOT_OFFSET[1],
            DOCK_POSITION[2] + SLOT_OFFSET[2]
          );
        }
        return { position, quaternion };
      },
      getSlotPosition: () => {
        const position = new THREE.Vector3();
        if (slotTargetRef.current) {
          slotTargetRef.current.getWorldPosition(position);
        } else {
          position.set(
            DOCK_POSITION[0] + SLOT_OFFSET[0],
            DOCK_POSITION[1] + SLOT_OFFSET[1],
            DOCK_POSITION[2] + SLOT_OFFSET[2]
          );
        }
        return position;
      },
    }));

    return (
      <group ref={groupRef} position={DOCK_POSITION} rotation={DOCK_ROTATION}>
        {/* ═══════════════════════════════════════════════════════════════════════
            MAIN SLAB — warm graphite, not black void
        ═══════════════════════════════════════════════════════════════════════ */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={SLAB_SIZE} />
          <meshStandardMaterial
            color="#2b2d31"
            roughness={0.85}
            metalness={0.08}
          />
        </mesh>

        {/* Top plate — slightly different roughness for edge contrast */}
        <mesh position={[0, SLAB_SIZE[1] / 2 + 0.004, 0]} receiveShadow>
          <boxGeometry args={[SLAB_SIZE[0] - 0.06, 0.008, SLAB_SIZE[2] - 0.06]} />
          <meshStandardMaterial
            color="#24262a"
            roughness={0.65}
            metalness={0.12}
          />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════════════
            SLOT OPENING
        ═══════════════════════════════════════════════════════════════════════ */}
        {/* Slot cavity */}
        <mesh position={SLOT_OFFSET}>
          <boxGeometry args={SLOT_SIZE} />
          <meshStandardMaterial
            color="#0a0c10"
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {/* Slot rim */}
        <mesh position={[SLOT_OFFSET[0], SLOT_OFFSET[1] + 0.008, SLOT_OFFSET[2]]}>
          <boxGeometry args={[SLOT_SIZE[0] + 0.03, 0.016, SLOT_SIZE[2] + 0.02]} />
          <meshStandardMaterial
            color="#1e2024"
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════════════
            SLOT GLOW — The destination cue
            Readable without hunting, but not screaming
        ═══════════════════════════════════════════════════════════════════════ */}
        {/* Inner glow strip at the back of the slot */}
        <mesh position={[SLOT_OFFSET[0], SLOT_OFFSET[1] - 0.015, SLOT_OFFSET[2] - 0.06]}>
          <boxGeometry args={[SLOT_SIZE[0] * 0.85, 0.012, 0.015]} />
          <meshStandardMaterial
            ref={slotGlowMaterialRef}
            color="#0a0e14"
            emissive="#5cc8e8"
            emissiveIntensity={1.0}
          />
        </mesh>
        {/* Faint edge glow on the slot rim */}
        <mesh position={[SLOT_OFFSET[0], SLOT_OFFSET[1] + 0.018, SLOT_OFFSET[2] + 0.08]}>
          <boxGeometry args={[SLOT_SIZE[0] + 0.01, 0.003, 0.008]} />
          <meshStandardMaterial
            color="#0a0e14"
            emissive="#4ab8d8"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════════════
            SLOT TARGET (invisible — for snap detection)
        ═══════════════════════════════════════════════════════════════════════ */}
        <mesh
          ref={slotTargetRef}
          position={[SLOT_OFFSET[0], SLOT_OFFSET[1] + 0.1, SLOT_OFFSET[2]]}
          visible={false}
        >
          <boxGeometry args={[SLOT_SIZE[0] * 1.8, 0.4, SLOT_SIZE[2] * 1.8]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════════════
            INDICATOR LIGHT
        ═══════════════════════════════════════════════════════════════════════ */}
        <mesh position={LIGHT_OFFSET}>
          <cylinderGeometry args={[0.02, 0.02, 0.012, 16]} />
          <meshStandardMaterial
            ref={indicatorMaterialRef}
            color="#0a0a0a"
            roughness={0.3}
            metalness={0.4}
            emissive="#1a1a1a"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Light housing */}
        <mesh position={LIGHT_OFFSET}>
          <torusGeometry args={[0.028, 0.006, 8, 24]} />
          <meshStandardMaterial
            color="#1e2024"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* ═══════════════════════════════════════════════════════════════════════
            DECORATIVE DETAILS
        ═══════════════════════════════════════════════════════════════════════ */}
        {/* Vent grille */}
        <group position={[-0.85, SLAB_SIZE[1] / 2 + 0.006, 0]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[0, 0, (i - 2) * 0.07]} receiveShadow>
              <boxGeometry args={[0.28, 0.004, 0.018]} />
              <meshStandardMaterial color="#14161a" roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Label recess */}
        <mesh position={[-LIGHT_OFFSET[0], LIGHT_OFFSET[1], LIGHT_OFFSET[2]]} receiveShadow>
          <planeGeometry args={[0.22, 0.055]} />
          <meshStandardMaterial
            color="#1a1c20"
            roughness={0.85}
          />
        </mesh>
      </group>
    );
  }
);

export default ConsoleDock;
