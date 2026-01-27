'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE — GLB model with label plane overlay
//
// Loads the cartridge GLB and positions a LabelCard plane above the label bay.
// No Decal projection — just a simple plane mesh with texture.
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { LabelCard } from './LabelCard';
import { useLabelTexture, ORIGIN_LABEL, type LabelSpec } from './useLabelTexture';
import { useCartridgeSelection } from '../../hooks/useCartridgeSelection';

// ─────────────────────────────────────────────────────────────────────────────────
// LABEL PLACEMENT CONSTANTS — Tune these to position the label
// ─────────────────────────────────────────────────────────────────────────────────

// Position relative to cartridge root [x, y, z]
// x = left/right, y = height above surface, z = forward/back
const LABEL_POS: [number, number, number] = [0, 0.088, 0.008];

// Rotation in radians [rx, ry, rz]
// rx = -π/2 to face upward (toward camera looking down)
const LABEL_ROT: [number, number, number] = [-Math.PI / 2, 0, 0];

// Scale [width, height] of the label plane
const LABEL_SCALE: [number, number] = [0.40, 0.26];

// ─────────────────────────────────────────────────────────────────────────────────
// CARTRIDGE TRANSFORM CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const BASE_POSITION: [number, number, number] = [0, 0, 0];
const BASE_ROTATION: [number, number, number] = [0, 0, 0];
const BASE_SCALE = 0.35;

const HOVER_LIFT = 0.03;
const HOVER_PITCH = 0.02;

const SELECTED_LIFT = 0.08;
const SELECTED_YAW = 0.1;

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeProps {
  id: string;
  label?: LabelSpec;
  onSelected?: (id: string) => void;
  debug?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function Cartridge({ 
  id, 
  label = ORIGIN_LABEL,
  onSelected, 
  debug = false 
}: CartridgeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/cartridge.glb');

  // Generate label texture
  const labelTexture = useLabelTexture(label);

  // State
  const state = useCartridgeSelection((s) => s.state);
  const setHover = useCartridgeSelection((s) => s.setHover);
  const select = useCartridgeSelection((s) => s.select);
  const startInsert = useCartridgeSelection((s) => s.startInsert);
  const completeInsert = useCartridgeSelection((s) => s.completeInsert);

  const isHovered = state === 'hover';
  const isSelected = state === 'selected' || state === 'inserting';

  // ─────────────────────────────────────────────────────────────────────────────
  // CLONE SCENE WITH SHADOWS
  // ─────────────────────────────────────────────────────────────────────────────

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTE TARGET TRANSFORMS
  // ─────────────────────────────────────────────────────────────────────────────

  const targetTransform = useMemo(() => {
    let position = [...BASE_POSITION] as [number, number, number];
    let rotation = [...BASE_ROTATION] as [number, number, number];
    let scale = BASE_SCALE;

    if (isHovered) {
      position[1] += HOVER_LIFT;
      rotation[0] += HOVER_PITCH;
    } else if (isSelected) {
      position[1] += SELECTED_LIFT;
      rotation[1] += SELECTED_YAW;
    } else if (state === 'inserted') {
      position[2] += 0.8;
      scale = 0.2;
    }

    return { position, rotation, scale };
  }, [state, isHovered, isSelected]);

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
  // TRIGGER INSERT SEQUENCE
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state === 'selected') {
      const timer = setTimeout(() => startInsert(), 400);
      return () => clearTimeout(timer);
    }
  }, [state, startInsert]);

  useEffect(() => {
    if (state === 'inserting') {
      const timer = setTimeout(() => {
        completeInsert();
        onSelected?.(id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, completeInsert, id, onSelected]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleLabelHover = (hovered: boolean) => {
    if (state === 'idle' || state === 'hover') {
      setHover(hovered);
    }
  };

  const handleLabelClick = () => {
    if (state === 'idle' || state === 'hover') {
      select(id);
    }
  };

  // Hide after inserted
  if (state === 'inserted') return null;

  // Wait for texture
  if (!labelTexture) return null;

  return (
    <animated.group
      ref={groupRef}
      position={spring.position}
      rotation={spring.rotation as unknown as THREE.Euler}
      scale={spring.scale}
    >
      {/* Cartridge body */}
      <primitive object={clonedScene} />

      {/* Label plane — sits above the cartridge face */}
      <LabelCard
        texture={labelTexture}
        position={LABEL_POS}
        rotation={LABEL_ROT}
        scale={LABEL_SCALE}
        isHovered={isHovered}
        isSelected={isSelected}
        onHover={handleLabelHover}
        onClick={handleLabelClick}
        debug={debug}
      />

      {/* Debug: Show label anchor point */}
      {debug && (
        <group position={LABEL_POS}>
          <axesHelper args={[0.1]} />
        </group>
      )}
    </animated.group>
  );
}

// Preload
useGLTF.preload('/models/cartridge.glb');
