'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// REMILIA NODE — Glowing Orb with Refracted Wordmark
//
// The main visual anchor. A semi-translucent orb with slow rotational motion.
// "REMILIA" text inside with light refraction distortion.
// Occasional red flicker inside letterforms only.
//
// Features:
// - Multi-layer glow effect
// - Slow rotation
// - Text refraction (CSS distortion)
// - Random red letter flicker
// - Pulse animation on selection
// ═══════════════════════════════════════════════════════════════════════════════

interface RemiliaNodeProps {
  intensity: number; // 0-1, controls glow strength
  isExpanded?: boolean; // Expands slightly after selection
  onPulse?: () => void; // Callback when pulse animation triggers
}

export function RemiliaNode({ intensity, isExpanded, onPulse }: RemiliaNodeProps) {
  const [flickerIndex, setFlickerIndex] = useState<number | null>(null);
  const controls = useAnimation();
  const letters = 'REMILIA'.split('');

  // Random letter flicker effect
  useEffect(() => {
    const flicker = () => {
      if (Math.random() > 0.7) { // 30% chance per interval
        const idx = Math.floor(Math.random() * letters.length);
        setFlickerIndex(idx);
        setTimeout(() => setFlickerIndex(null), 80 + Math.random() * 120);
      }
    };

    const interval = setInterval(flicker, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [letters.length]);

  // Pulse animation method
  const triggerPulse = async () => {
    await controls.start({
      scale: [1, 1.15, 1],
      transition: { duration: 0.4, ease: 'easeOut' },
    });
    onPulse?.();
  };

  const baseSize = isExpanded ? 380 : 320;
  const glowIntensity = 0.3 + intensity * 0.5;

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'relative',
        width: baseSize,
        height: baseSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          ORB GLOW LAYERS
      ════════════════════════════════════════════════════════════════════ */}
      
      {/* Outer glow */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [glowIntensity * 0.4, glowIntensity * 0.6, glowIntensity * 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: -60,
          borderRadius: '50%',
          background: `radial-gradient(
            circle,
            ${COLORS.orbGlow} 0%,
            transparent 70%
          )`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Red accent glow */}
      <motion.div
        animate={{
          opacity: [0, intensity * 0.15, 0],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: -40,
          borderRadius: '50%',
          background: `radial-gradient(
            circle,
            ${COLORS.glow} 0%,
            transparent 60%
          )`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          ORB BODY — Semi-translucent sphere
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          width: baseSize,
          height: baseSize,
          borderRadius: '50%',
          background: `
            radial-gradient(
              ellipse 80% 60% at 30% 30%,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 50% 50%,
              ${COLORS.orb} 0%,
              rgba(60, 80, 120, 0.04) 60%,
              transparent 80%
            )
          `,
          border: `1px solid rgba(255, 255, 255, ${0.03 + intensity * 0.04})`,
          boxShadow: `
            inset 0 0 80px rgba(180, 200, 255, ${0.02 + intensity * 0.03}),
            0 0 60px rgba(180, 200, 255, ${0.05 + intensity * 0.05})
          `,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Inner sphere highlight */}
      <div
        style={{
          position: 'absolute',
          width: baseSize * 0.85,
          height: baseSize * 0.85,
          borderRadius: '50%',
          background: `
            radial-gradient(
              ellipse 100% 80% at 40% 25%,
              rgba(255, 255, 255, 0.03) 0%,
              transparent 40%
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          REFRACTED WORDMARK
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        animate={{
          y: [0, -3, 0, 3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Refraction distortion effect
          filter: `blur(0.3px)`,
          textShadow: `
            1px 0 2px rgba(255, 100, 100, ${0.1 + intensity * 0.1}),
            -1px 0 2px rgba(100, 100, 255, ${0.1 + intensity * 0.1})
          `,
        }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            animate={{
              y: Math.sin(i * 0.8) * 2,
              rotateY: Math.cos(i * 0.5) * 3,
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: flickerIndex === i ? COLORS.primary : COLORS.text,
              textShadow: flickerIndex === i
                ? `0 0 20px ${COLORS.primary}, 0 0 40px ${COLORS.glow}`
                : 'none',
              transition: 'color 0.05s, text-shadow 0.05s',
              transform: `translateZ(${i * 2}px)`,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// NODE PULSE RING — Visual feedback on selection
// ─────────────────────────────────────────────────────────────────────────────────

interface PulseRingProps {
  isActive: boolean;
}

export function NodePulseRing({ isActive }: PulseRingProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: `2px solid ${COLORS.primary}`,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}

export default RemiliaNode;
