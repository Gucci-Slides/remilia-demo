'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// DRIFTING WORDMARK — REMILIA
//
// Positioned in lower-right quadrant, slightly off-center.
// White text with soft bloom (2-4px), opacity ~0.85.
// Very slow drift animation (20s loop).
// Fully fades out on first scroll or click.
// ═══════════════════════════════════════════════════════════════════════════════

interface DriftingWordmarkProps {
  isVisible: boolean;
}

export function DriftingWordmark({ isVisible }: DriftingWordmarkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 0.85 : 0,
        y: isVisible ? 0 : 40,
      }}
      transition={{
        opacity: { duration: isVisible ? 0.8 : 0.5 },
        y: { duration: 0.6 },
      }}
      style={{
        position: 'fixed',
        // Lower-right quadrant, slightly off-center
        bottom: '18vh',
        right: '12vw',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Slow drift animation wrapper */}
      <motion.div
        animate={{
          x: [0, 8, -4, 6, 0],
          y: [0, -6, 4, -8, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Wordmark with bloom */}
        <h1
          style={{
            fontFamily: 'var(--font-monument), "ITC Benguiat", Georgia, serif',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: COLORS.text,
            margin: 0,
            // Soft bloom effect
            textShadow: `
              0 0 2px ${COLORS.bloom},
              0 0 4px ${COLORS.bloom},
              0 0 8px rgba(255, 255, 255, 0.05)
            `,
            // Slight blur for softness
            filter: 'blur(0.2px)',
          }}
        >
          REMILIA
        </h1>
      </motion.div>
    </motion.div>
  );
}

export default DriftingWordmark;
