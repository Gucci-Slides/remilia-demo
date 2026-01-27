'use client';

import React, { useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM FLICKER — State Transition Effect
//
// Single-frame flash when loading a save block.
// This is not animation — this is a system context switch.
//
// Timing: 120-150ms pause, single white flash, instant content swap
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemFlickerProps {
  isActive: boolean;
  onComplete: () => void;
}

export function SystemFlicker({ isActive, onComplete }: SystemFlickerProps) {
  const [phase, setPhase] = useState<'idle' | 'pause' | 'flash' | 'done'>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Phase 1: Initial pause (120ms)
    setPhase('pause');
    const pauseTimer = setTimeout(() => {
      // Phase 2: Flash (single frame, ~50ms)
      setPhase('flash');
      
      const flashTimer = setTimeout(() => {
        // Phase 3: Complete
        setPhase('done');
        onComplete();
      }, 50);

      return () => clearTimeout(flashTimer);
    }, 120);

    return () => clearTimeout(pauseTimer);
  }, [isActive, onComplete]);

  if (!isActive || phase === 'idle' || phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: phase === 'flash' ? '#FFFFFF' : 'transparent',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EJECT FLICKER — Simpler fade-out effect for ejecting
//
// No flash — just clear the screen
// ═══════════════════════════════════════════════════════════════════════════════

interface EjectFlickerProps {
  isActive: boolean;
  onComplete: () => void;
}

export function EjectFlicker({ isActive, onComplete }: EjectFlickerProps) {
  useEffect(() => {
    if (!isActive) return;

    // Quick clear — no dramatic flash
    const timer = setTimeout(() => {
      onComplete();
    }, 80);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--archive-paper, #F3EEE6)',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

export default SystemFlicker;
