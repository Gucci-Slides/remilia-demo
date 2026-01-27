'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CARD BLOCK — System Status Display
//
// Positioned in a corner. Monospace, small size, faint opacity.
// On hover: single-frame flicker + red interference.
//
// Display:
// MEMORY CARD
// SLOT 01
// 
// STATUS: MOUNTED
// BLOCKS USED: ███░░░░░
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryCardBlockProps {
  isVisible: boolean;
}

export function MemoryCardBlock({ isVisible }: MemoryCardBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const [showInterference, setShowInterference] = useState(false);

  // Single-frame flicker on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setIsFlickering(true);
    setShowInterference(true);

    // Single frame flicker
    setTimeout(() => setIsFlickering(false), 50);
    // Brief red interference
    setTimeout(() => setShowInterference(false), 120);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        top: 32,
        left: 32,
        zIndex: 15,
        cursor: 'default',
      }}
    >
      <motion.div
        animate={{
          opacity: isFlickering ? 0 : 1,
        }}
        transition={{ duration: 0.05 }}
        style={{
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontSize: '10px',
          fontWeight: 400,
          lineHeight: 1.7,
          letterSpacing: '0.1em',
          color: showInterference ? COLORS.interference : COLORS.textDim,
          transition: 'color 0.05s',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div>MEMORY CARD</div>
          <div style={{ opacity: 0.7 }}>SLOT 01</div>
        </div>

        {/* Status */}
        <div style={{ opacity: 0.6 }}>
          <div>
            STATUS:{' '}
            <span
              style={{
                color: showInterference
                  ? COLORS.interference
                  : 'rgba(120, 200, 140, 0.6)',
              }}
            >
              MOUNTED
            </span>
          </div>
          <div>
            BLOCKS USED:{' '}
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              ███░░░░░
            </span>
          </div>
        </div>
      </motion.div>

      {/* Red interference overlay on hover */}
      {showInterference && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(225, 6, 0, 0.03) 50%,
              transparent 100%
            )`,
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
}

export default MemoryCardBlock;
