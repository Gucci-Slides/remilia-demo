'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CartridgeState } from '@/hooks/useCartridgeMachine';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SCREEN — CanvasTexture CRT Display
//
// A plane mesh that renders text with:
// - Scanlines
// - Rolling band effect
// - Emissive glow that powers on/off
// - Low-contrast, monospaced text
//
// PS1 boot semiotics: quiet, utilitarian, slightly ominous.
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 128;
const SCANLINE_SPACING = 3;
const ROLLING_BAND_HEIGHT = 20;
const ROLLING_BAND_SPEED = 0.4; // seconds per full cycle

// Colors
const SCREEN_BG = '#0a0c10';
const TEXT_COLOR = '#a8b4c4'; // Dim white with slight blue tint
const TEXT_COLOR_DIM = '#5a6878';
const SCANLINE_COLOR = 'rgba(255, 255, 255, 0.04)';
const ROLLING_BAND_COLOR = 'rgba(180, 200, 220, 0.03)';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeScreenProps {
  lines: string[];
  active: boolean;
  state: CartridgeState;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function CartridgeScreen({
  lines,
  active,
  state,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: CartridgeScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const rollingBandOffset = useRef(0);
  const targetEmissive = useRef(0);
  const currentEmissive = useRef(0);

  // Create canvas and texture
  const { canvas, texture } = useMemo(() => {
    if (typeof document === 'undefined') {
      return { canvas: null, texture: null };
    }
    
    const cvs = document.createElement('canvas');
    cvs.width = CANVAS_WIDTH;
    cvs.height = CANVAS_HEIGHT;
    
    const tex = new THREE.CanvasTexture(cvs);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    
    return { canvas: cvs, texture: tex };
  }, []);

  useEffect(() => {
    if (canvas) {
      canvasRef.current = canvas;
      textureRef.current = texture;
    }
  }, [canvas, texture]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER CANVAS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderCanvas = (delta: number) => {
    const cvs = canvasRef.current;
    const tex = textureRef.current;
    if (!cvs || !tex) return;

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    // Update rolling band
    rollingBandOffset.current += delta / ROLLING_BAND_SPEED;
    if (rollingBandOffset.current > 1) rollingBandOffset.current -= 1;

    // Clear canvas
    ctx.fillStyle = SCREEN_BG;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (active) {
      // Draw rolling band (subtle horizontal band that scrolls down)
      const bandY = rollingBandOffset.current * (CANVAS_HEIGHT + ROLLING_BAND_HEIGHT) - ROLLING_BAND_HEIGHT;
      const gradient = ctx.createLinearGradient(0, bandY, 0, bandY + ROLLING_BAND_HEIGHT);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, ROLLING_BAND_COLOR);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, bandY, CANVAS_WIDTH, ROLLING_BAND_HEIGHT);

      // Draw text
      ctx.font = '12px "IBM Plex Mono", "Consolas", monospace';
      ctx.textBaseline = 'top';
      
      const lineHeight = 22;
      const startY = 24;
      const startX = 16;

      lines.forEach((line, i) => {
        if (!line) return;
        
        // Determine text color based on line content and state
        let color = TEXT_COLOR;
        if (state === 'error') {
          color = i === 0 ? '#c44' : TEXT_COLOR_DIM;
        } else if (state === 'ready' && i === 2) {
          // "PRESS TO ENTER" gets slight emphasis
          color = '#c8d4e4';
        } else if (i === 0) {
          color = TEXT_COLOR;
        } else {
          color = TEXT_COLOR_DIM;
        }

        ctx.fillStyle = color;
        ctx.fillText(`> ${line}`, startX, startY + i * lineHeight);
      });

      // Draw scanlines
      ctx.fillStyle = SCANLINE_COLOR;
      for (let y = 0; y < CANVAS_HEIGHT; y += SCANLINE_SPACING) {
        ctx.fillRect(0, y, CANVAS_WIDTH, 1);
      }

      // Subtle vignette
      const vignette = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.7
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    tex.needsUpdate = true;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION FRAME
  // ═══════════════════════════════════════════════════════════════════════════

  useFrame((_, delta) => {
    // Update target emissive based on state (boosted for visibility)
    targetEmissive.current = active ? 1.6 : 0.1; // Minimum 0.1 so screen is never invisible

    // Smooth emissive transition
    const lerpSpeed = active ? 3 : 1.5; // Power on faster than power off
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      targetEmissive.current,
      delta * lerpSpeed
    );

    // Update material emissive intensity
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = currentEmissive.current;
    }

    // Render canvas
    renderCanvas(delta);
  });

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[1, 0.5]} />
      {/* Glass-like emissive screen material */}
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        emissive={new THREE.Color(0x9fb6ff)}
        emissiveIntensity={1.8}
        emissiveMap={texture}
        roughness={0.25}
        metalness={0}
        transparent={true}
        opacity={0.92}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default CartridgeScreen;
