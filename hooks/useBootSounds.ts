'use client';

import { useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SOUNDS HOOK — WebAudio Oscillator-Based Sound Effects
//
// PS1/PS2 cartridge UI sound scaffold.
// Uses oscillators with envelopes — no audio files needed.
//
// API:
// - playFocus(): short tick
// - playInsert(): click + low thump
// - playEject(): softer thunk
// ═══════════════════════════════════════════════════════════════════════════════

interface BootSounds {
  playFocus: () => void;
  playInsert: () => void;
  playEject: () => void;
  initAudio: () => void;
}

export function useBootSounds(): BootSounds {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize AudioContext on first user interaction
  const initAudio = useCallback(() => {
    if (isInitializedRef.current) return;
    
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      isInitializedRef.current = true;
    } catch (e) {
      console.warn('WebAudio not available');
    }
  }, []);

  // Helper: create oscillator with envelope
  const createTone = useCallback((
    frequency: number,
    type: OscillatorType,
    duration: number,
    volume: number = 0.1,
    attack: number = 0.005,
    decay: number = 0.1
  ) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // PLAY FOCUS — Short tick
  // ─────────────────────────────────────────────────────────────────────────────
  const playFocus = useCallback(() => {
    initAudio();
    // High-pitched short tick
    createTone(2400, 'square', 0.03, 0.04, 0.001, 0.02);
  }, [initAudio, createTone]);

  // ─────────────────────────────────────────────────────────────────────────────
  // PLAY INSERT — Click + low thump
  // ─────────────────────────────────────────────────────────────────────────────
  const playInsert = useCallback(() => {
    initAudio();
    // Click (high)
    createTone(1800, 'square', 0.025, 0.06, 0.001, 0.015);
    // Low thump (delayed slightly)
    setTimeout(() => {
      createTone(80, 'sine', 0.12, 0.15, 0.005, 0.08);
      createTone(120, 'triangle', 0.08, 0.08, 0.002, 0.05);
    }, 20);
  }, [initAudio, createTone]);

  // ─────────────────────────────────────────────────────────────────────────────
  // PLAY EJECT — Softer thunk
  // ─────────────────────────────────────────────────────────────────────────────
  const playEject = useCallback(() => {
    initAudio();
    // Softer mechanical sound
    createTone(600, 'triangle', 0.05, 0.05, 0.002, 0.03);
    createTone(100, 'sine', 0.15, 0.1, 0.01, 0.1);
  }, [initAudio, createTone]);

  return {
    playFocus,
    playInsert,
    playEject,
    initAudio,
  };
}

export default useBootSounds;
