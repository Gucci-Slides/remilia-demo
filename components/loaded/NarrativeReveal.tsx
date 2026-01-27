'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, NARRATIVE_LINES, NarrativeLine } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE REVEAL — Scroll-Triggered Text
//
// On scroll, REMILIA fades out, then reveal narrative text
// on the same baseline grid.
//
// Text:
// Remilia was not announced.
// It accumulated.
//
// Identity persisted.
// Records formed.
// Systems followed.
// ═══════════════════════════════════════════════════════════════════════════════

interface NarrativeRevealProps {
  isVisible: boolean;
  progress: number; // 0-1, controls staggered reveal
}

export function NarrativeReveal({ isVisible, progress }: NarrativeRevealProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            // Same baseline area as wordmark (lower-right quadrant)
            bottom: '18vh',
            right: '12vw',
            zIndex: 10,
            maxWidth: '38ch',
            textAlign: 'right',
          }}
        >
          {NARRATIVE_LINES.map((line, index) => (
            <NarrativeLineDisplay
              key={index}
              line={line}
              index={index}
              progress={progress}
              totalLines={NARRATIVE_LINES.length}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// NARRATIVE LINE DISPLAY — Individual line with staggered reveal
// ─────────────────────────────────────────────────────────────────────────────────

interface NarrativeLineDisplayProps {
  line: NarrativeLine;
  index: number;
  progress: number;
  totalLines: number;
}

function NarrativeLineDisplay({
  line,
  index,
  progress,
  totalLines,
}: NarrativeLineDisplayProps) {
  // Calculate when this line should appear based on progress
  const lineThreshold = index / totalLines;
  const isRevealed = progress > lineThreshold;
  const lineOpacity = isRevealed ? Math.min(1, (progress - lineThreshold) * totalLines) : 0;

  if (!line.text) {
    // Empty line for spacing
    return <div style={{ height: 20 }} />;
  }

  return (
    <motion.p
      initial={{ opacity: 0, x: 10 }}
      animate={{
        opacity: lineOpacity * 0.9,
        x: isRevealed ? 0 : 10,
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(17px, 2vw, 22px)',
        fontWeight: 400,
        lineHeight: 1.55,
        color: COLORS.text,
        marginBottom: 6,
        // Indent for rhythm
        marginRight: line.indent ? 24 : 0,
      }}
    >
      {line.text}
    </motion.p>
  );
}

export default NarrativeReveal;
