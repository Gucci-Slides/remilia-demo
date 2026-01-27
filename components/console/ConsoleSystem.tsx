'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from './AnimatedBackground';
import { RemiliaNode, NodePulseRing } from './RemiliaNode';
import { RadialMenu } from './RadialMenu';
import { SystemTelemetry, SystemClock } from './SystemTelemetry';
import { NarrativeOutput } from './NarrativeOutput';
import { SystemState, COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSOLE SYSTEM — Remilia Title Page
//
// PS1 Boot Screen / Xbox Live Dashboard inspired interface.
// This is not a website. This is a powered-on console OS.
//
// State Machine:
// - boot: Initial power-on sequence (brief)
// - idle: Waiting for input, menu visible
// - selected: Item selected, transitioning to narrative
// - narrative: Displaying narrative content
//
// Scroll adjusts system intensity (glow, noise, motion) instead of moving content.
// ═══════════════════════════════════════════════════════════════════════════════

export function ConsoleSystem() {
  // System state
  const [systemState, setSystemState] = useState<SystemState>('boot');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Intensity controlled by scroll (0-1)
  const [intensity, setIntensity] = useState(0.5);
  const scrollRef = useRef(0);

  // ═══════════════════════════════════════════════════════════════════════════
  // BOOT SEQUENCE
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    // Brief boot delay
    const bootTimer = setTimeout(() => {
      setSystemState('idle');
    }, 1200);

    return () => clearTimeout(bootTimer);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL-BASED INTENSITY CONTROL
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent actual scrolling
      e.preventDefault();

      // Adjust intensity based on scroll direction
      scrollRef.current += e.deltaY * 0.001;
      scrollRef.current = Math.max(0, Math.min(1, scrollRef.current + 0.5)); // Normalize to 0-1
      
      // Smooth intensity change
      const delta = e.deltaY > 0 ? 0.05 : -0.05;
      setIntensity((prev) => Math.max(0.1, Math.min(1, prev + delta)));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // SELECTION HANDLER
  // ═══════════════════════════════════════════════════════════════════════════

  const handleSelect = useCallback((id: string) => {
    if (systemState !== 'idle') return;

    setSelectedId(id);
    setIsPulsing(true);
    
    // Trigger pulse animation, then transition
    setTimeout(() => {
      setIsPulsing(false);
      setSystemState('selected');
      
      // Transition to narrative after selection animation
      setTimeout(() => {
        setSystemState('narrative');
      }, 600);
    }, 400);
  }, [systemState]);

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (systemState !== 'idle') return;

      // Number keys 1-5 select menu items
      if (e.key >= '1' && e.key <= '5') {
        const items = ['origin', 'network', 'records', 'systems', 'archive'];
        const id = items[parseInt(e.key) - 1];
        if (id) handleSelect(id);
      }

      // Escape to reset (for testing)
      if (e.key === 'Escape' && systemState === 'narrative') {
        setSystemState('idle');
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [systemState, handleSelect]);

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const isBooting = systemState === 'boot';
  const isIdle = systemState === 'idle';
  const isSelected = systemState === 'selected';
  const isNarrative = systemState === 'narrative';
  
  const showMenu = isIdle && !isBooting;
  const showTelemetry = (isIdle || isBooting) && !isSelected && !isNarrative;
  const showNarrative = isNarrative;
  const isExpanded = isSelected || isNarrative;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          ANIMATED BACKGROUND
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedBackground intensity={intensity} />

      {/* ════════════════════════════════════════════════════════════════════
          SYSTEM TELEMETRY — Disappears after selection
      ════════════════════════════════════════════════════════════════════ */}
      <SystemTelemetry isVisible={showTelemetry} intensity={intensity} />
      <SystemClock isVisible={showTelemetry} />

      {/* ════════════════════════════════════════════════════════════════════
          MAIN STAGE — Orb + Menu
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        animate={{
          opacity: isBooting ? 0 : 1,
          scale: isBooting ? 0.9 : 1,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulse ring effect on selection */}
        <NodePulseRing isActive={isPulsing} />

        {/* Remilia Node Orb */}
        <motion.div
          animate={{
            scale: isExpanded ? 1.1 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <RemiliaNode
            intensity={intensity}
            isExpanded={isExpanded}
          />
        </motion.div>

        {/* Radial Navigation Menu */}
        <RadialMenu
          intensity={intensity}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={handleSelect}
          onHover={setHoveredId}
          isVisible={showMenu}
        />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════
          NARRATIVE OUTPUT
      ════════════════════════════════════════════════════════════════════ */}
      <NarrativeOutput isVisible={showNarrative} />

      {/* ════════════════════════════════════════════════════════════════════
          BOOT OVERLAY
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: COLORS.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              style={{
                fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
                fontSize: '11px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: COLORS.textDim,
              }}
            >
              INITIALIZING...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════
          BACKGROUND DIM ON NARRATIVE
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isNarrative && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'black',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLL HINT
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isIdle && !isBooting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: COLORS.textDim,
              zIndex: 20,
            }}
          >
            Scroll to adjust intensity
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ConsoleSystem;
