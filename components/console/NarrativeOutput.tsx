'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, NARRATIVE_LINES, NarrativeLine } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE OUTPUT — System Text Display
//
// Displays narrative text as system output.
// Text appears line-by-line with typewriter effect.
// "record" briefly flashes red.
//
// Triggered after first menu selection.
// ═══════════════════════════════════════════════════════════════════════════════

interface NarrativeOutputProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function NarrativeOutput({ isVisible, onComplete }: NarrativeOutputProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [flashWord, setFlashWord] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setVisibleLines(0);
      setFlashWord(false);
      return;
    }

    // Reveal lines one by one
    let lineIndex = 0;
    const interval = setInterval(() => {
      lineIndex++;
      setVisibleLines(lineIndex);

      // Check if this line has the red word
      if (lineIndex <= NARRATIVE_LINES.length) {
        const currentLine = NARRATIVE_LINES[lineIndex - 1];
        if (currentLine?.redWord) {
          // Flash the red word briefly
          setTimeout(() => {
            setFlashWord(true);
            setTimeout(() => setFlashWord(false), 300);
          }, 500);
        }
      }

      if (lineIndex >= NARRATIVE_LINES.length) {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 600,
            padding: '0 32px',
            zIndex: 30,
            textAlign: 'center',
          }}
        >
          {NARRATIVE_LINES.map((line, index) => (
            <NarrativeLineDisplay
              key={index}
              line={line}
              isVisible={index < visibleLines}
              flashWord={flashWord && Boolean(line.redWord)}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// NARRATIVE LINE DISPLAY — Individual line with animation
// ─────────────────────────────────────────────────────────────────────────────────

interface NarrativeLineDisplayProps {
  line: NarrativeLine;
  isVisible: boolean;
  flashWord: boolean;
  delay: number;
}

function NarrativeLineDisplay({ line, isVisible, flashWord, delay }: NarrativeLineDisplayProps) {
  if (!line.text) {
    // Empty line for spacing
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        style={{ height: 24 }}
      />
    );
  }

  const renderText = () => {
    if (!line.redWord) return line.text;

    const parts = line.text.split(new RegExp(`(${line.redWord})`, 'i'));
    return parts.map((part, i) => {
      if (part.toLowerCase() === line.redWord?.toLowerCase()) {
        return (
          <motion.span
            key={i}
            animate={{
              color: flashWord ? COLORS.primary : COLORS.text,
              textShadow: flashWord
                ? `0 0 30px ${COLORS.primary}, 0 0 60px ${COLORS.glow}`
                : 'none',
            }}
            transition={{ duration: 0.1 }}
            style={{
              display: 'inline',
            }}
          >
            {part}
          </motion.span>
        );
      }
      return part;
    });
  };

  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 10,
      }}
      transition={{ delay: delay * 0.5, duration: 0.4 }}
      style={{
        fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(18px, 2.5vw, 24px)',
        fontWeight: 400,
        lineHeight: 1.6,
        color: COLORS.text,
        marginBottom: 8,
        opacity: 0.9,
      }}
    >
      {renderText()}
    </motion.p>
  );
}

export default NarrativeOutput;
