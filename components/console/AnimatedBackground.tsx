'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND — Console OS Atmosphere
//
// Layers:
// 1. Deep dark base with subtle gradient
// 2. Animated noise overlay
// 3. Curved vector field / grid
// 4. Scanlines
//
// Intensity controls opacity/motion of all layers.
// ═══════════════════════════════════════════════════════════════════════════════

interface AnimatedBackgroundProps {
  intensity: number; // 0-1
}

export function AnimatedBackground({ intensity }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  // Animated noise canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 25;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise + Math.random() * 5; // Slight blue tint
        data[i + 3] = 15 + intensity * 10; // Alpha based on intensity
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      time++;
      if (time % 3 === 0) { // Reduce noise update frequency
        drawNoise();
      }
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: `radial-gradient(ellipse 120% 100% at 50% 40%, ${COLORS.backgroundLight} 0%, ${COLORS.background} 70%)`,
        overflow: 'hidden',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          NOISE LAYER
      ════════════════════════════════════════════════════════════════════ */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4 + intensity * 0.2,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          CURVED VECTOR FIELD / GRID
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200vmax',
          height: '200vmax',
          transform: 'translate(-50%, -50%)',
          opacity: 0.3 + intensity * 0.3,
          pointerEvents: 'none',
        }}
      >
        <VectorField />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════
          SCANLINES
      ════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            ${COLORS.scanline} 2px,
            ${COLORS.scanline} 4px
          )`,
          opacity: 0.5 + intensity * 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          VIGNETTE
      ════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
            ellipse 80% 70% at 50% 50%,
            transparent 30%,
            rgba(0, 0, 0, 0.4) 70%,
            rgba(0, 0, 0, 0.8) 100%
          )`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// VECTOR FIELD — Curved grid pattern
// ─────────────────────────────────────────────────────────────────────────────────

function VectorField() {
  const lines = [];
  const count = 24;

  // Radial lines
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 360;
    lines.push(
      <line
        key={`radial-${i}`}
        x1="50%"
        y1="50%"
        x2={`${50 + Math.cos((angle * Math.PI) / 180) * 50}%`}
        y2={`${50 + Math.sin((angle * Math.PI) / 180) * 50}%`}
        stroke={COLORS.grid}
        strokeWidth="0.5"
      />
    );
  }

  // Concentric circles
  for (let i = 1; i <= 8; i++) {
    const radius = i * 12;
    lines.push(
      <circle
        key={`circle-${i}`}
        cx="50%"
        cy="50%"
        r={`${radius}%`}
        fill="none"
        stroke={COLORS.grid}
        strokeWidth="0.5"
        strokeDasharray={i % 2 === 0 ? '4 8' : undefined}
      />
    );
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {lines}
    </svg>
  );
}

export default AnimatedBackground;
