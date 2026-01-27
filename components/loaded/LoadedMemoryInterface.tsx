'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { DriftingWordmark } from './DriftingWordmark';
import { SystemLabels } from './SystemLabels';
import { MemoryCardBlock } from './MemoryCardBlock';
import { NarrativeReveal } from './NarrativeReveal';
import { InterfaceState, COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// LOADED MEMORY INTERFACE — Main Component
//
// A title page that behaves like a loaded system state.
// PS1 / PS2 boot screens, early Xbox dashboard, memory card UI.
//
// Layout:
// - No centered hero
// - Asymmetric composition
// - Elements feel placed, not aligned
//
// Interaction:
// - Subtle parallax only
// - No overt scrollytelling
// - No CTAs
// - Page feels like a system waiting for input
// ═══════════════════════════════════════════════════════════════════════════════

export function LoadedMemoryInterface() {
  // State
  const [interfaceState, setInterfaceState] = useState<InterfaceState>('mounted');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL / CLICK HANDLER
  // First scroll or click triggers the transition
  // ═══════════════════════════════════════════════════════════════════════════

  const handleFirstInteraction = useCallback(() => {
    if (hasInteracted) return;
    
    setHasInteracted(true);
    setInterfaceState('transitioning');

    // After wordmark fades, show narrative
    setTimeout(() => {
      setInterfaceState('narrative');
    }, 600);
  }, [hasInteracted]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!hasInteracted) {
        handleFirstInteraction();
        return;
      }

      // Calculate scroll progress for narrative reveal
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 0.8;
      const progress = Math.min(1, scrollY / maxScroll);
      setScrollProgress(progress);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!hasInteracted && e.deltaY > 0) {
        handleFirstInteraction();
      }
    };

    const handleClick = () => {
      if (!hasInteracted) {
        handleFirstInteraction();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('click', handleClick);
    };
  }, [hasInteracted, handleFirstInteraction]);

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const showWordmark = interfaceState === 'mounted';
  const showLabels = interfaceState === 'mounted';
  const showMemoryCard = interfaceState === 'mounted' || interfaceState === 'transitioning';
  const showNarrative = interfaceState === 'narrative';

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '200vh', // Allow scrolling for narrative reveal
        background: COLORS.background,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          SUBTLE GRAIN OVERLAY
      ════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          VIGNETTE
      ════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(
            ellipse 100% 80% at 60% 50%,
            transparent 30%,
            rgba(0, 0, 0, 0.3) 70%,
            rgba(0, 0, 0, 0.6) 100%
          )`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          MEMORY CARD BLOCK — Top-left corner
      ════════════════════════════════════════════════════════════════════ */}
      <MemoryCardBlock isVisible={showMemoryCard} />

      {/* ════════════════════════════════════════════════════════════════════
          SYSTEM LABELS — Coordinates around wordmark
      ════════════════════════════════════════════════════════════════════ */}
      <SystemLabels isVisible={showLabels} />

      {/* ════════════════════════════════════════════════════════════════════
          DRIFTING WORDMARK — Lower-right quadrant
      ════════════════════════════════════════════════════════════════════ */}
      <DriftingWordmark isVisible={showWordmark} />

      {/* ════════════════════════════════════════════════════════════════════
          NARRATIVE REVEAL — Same position as wordmark
      ════════════════════════════════════════════════════════════════════ */}
      <NarrativeReveal
        isVisible={showNarrative}
        progress={Math.max(0.1, scrollProgress)} // Start with first line visible
      />

      {/* ════════════════════════════════════════════════════════════════════
          SYSTEM WAITING INDICATOR
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showWordmark ? 0.15 : 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: COLORS.textFaint,
          zIndex: 10,
        }}
      >
        <motion.span
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ▌
        </motion.span>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════
          CORNER DECORATION — Asymmetric placement
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ delay: 0.8 }}
        style={{
          position: 'fixed',
          top: 32,
          right: 32,
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: COLORS.textFaint,
          zIndex: 10,
          textAlign: 'right',
        }}
      >
        <div>SYS.2026</div>
        <div style={{ marginTop: 4, opacity: 0.6 }}>ACTIVE</div>
      </motion.div>
    </div>
  );
}

export default LoadedMemoryInterface;
