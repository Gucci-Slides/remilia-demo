'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { COLORS, SYSTEM_LABELS, SystemLabel } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM LABELS — Coordinate Markers
//
// Three labels placed around the wordmark: ORIGIN, NETWORK, RECORDS
// These are not buttons. They are coordinates.
// Slight positional irregularity and uneven letter spacing.
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemLabelsProps {
  isVisible: boolean;
}

export function SystemLabels({ isVisible }: SystemLabelsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        position: 'fixed',
        // Positioned relative to wordmark area
        bottom: '32vh',
        right: '8vw',
        zIndex: 8,
        pointerEvents: 'none',
      }}
    >
      {SYSTEM_LABELS.map((label, index) => (
        <LabelMarker
          key={label.id}
          label={label}
          index={index}
        />
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// LABEL MARKER — Individual coordinate label
// ─────────────────────────────────────────────────────────────────────────────────

interface LabelMarkerProps {
  label: SystemLabel;
  index: number;
}

function LabelMarker({ label, index }: LabelMarkerProps) {
  // Staggered vertical positioning with intentional irregularity
  const baseY = index * 32;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.15, duration: 0.4 }}
      style={{
        position: 'relative',
        marginBottom: 24 + (index % 2) * 8, // Uneven spacing
        transform: `translate(${label.offsetX}px, ${label.offsetY}px)`,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: label.letterSpacing,
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          // No hover effects — these are coordinates, not buttons
          userSelect: 'none',
        }}
      >
        {label.text}
      </span>
    </motion.div>
  );
}

export default SystemLabels;
