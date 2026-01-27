'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// LABEL CARD — Holographic PS1-style label plane
//
// A thin plane mesh sitting above the cartridge face with:
// - Holographic material (metalness + low roughness + envMap)
// - Hover: brighten + tilt
// - Click: punch scale + trigger selection
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface LabelCardProps {
  texture: THREE.Texture;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number];
  
  // Interaction
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  
  // Debug
  debug?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function LabelCard({
  texture,
  position,
  rotation,
  scale,
  isHovered,
  isSelected,
  onHover,
  onClick,
  debug = false,
}: LabelCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // ANIMATED SPRINGS
  // ─────────────────────────────────────────────────────────────────────────────

  const { animatedScale, animatedRotation } = useSpring({
    // Hover: slight scale up + tilt
    animatedScale: isSelected ? 1.06 : isHovered ? 1.03 : 1.0,
    animatedRotation: isHovered ? 0.02 : 0,
    config: { tension: 300, friction: 20 },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // HOLOGRAPHIC SWEEP — Subtle animation
  // ─────────────────────────────────────────────────────────────────────────────

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Subtle pulsing envMapIntensity for holo effect
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.08;
      materialRef.current.envMapIntensity = (isHovered ? 1.5 : 1.2) + pulse;
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <group position={position} rotation={rotation}>
      {/* Debug: Axes helper */}
      {debug && <axesHelper args={[0.05]} />}

      <animated.mesh
        ref={meshRef}
        scale={animatedScale}
        rotation-z={animatedRotation}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <planeGeometry args={scale} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          transparent
          alphaTest={0.1}
          metalness={0.55}
          roughness={0.22}
          envMapIntensity={1.2}
          side={THREE.FrontSide}
        />
      </animated.mesh>

      {/* Debug: Wireframe overlay */}
      {debug && (
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={scale} />
          <meshBasicMaterial wireframe color="#ff00ff" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
