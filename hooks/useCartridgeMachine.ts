'use client';

import { useReducer, useCallback, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE STATE MACHINE — PS1 Boot Semiotics
//
// States: idle → hover → pressing → inserting → verifying → booting → ready
// Optional: error state for CRC failure simulation
//
// No xstate — just a clean reducer with timing logic.
// ═══════════════════════════════════════════════════════════════════════════════

export type CartridgeState =
  | 'idle'
  | 'hover'
  | 'pressing'
  | 'inserting'
  | 'verifying'
  | 'booting'
  | 'ready'
  | 'error';

type CartridgeAction =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'POINTER_DOWN' }
  | { type: 'POINTER_UP' }
  | { type: 'CLICK' }
  | { type: 'INSERT_COMPLETE' }
  | { type: 'VERIFY_COMPLETE' }
  | { type: 'BOOT_COMPLETE' }
  | { type: 'TRIGGER_ERROR' }
  | { type: 'RESET' };

// ─────────────────────────────────────────────────────────────────────────────────
// TIMING CONSTANTS (ms)
// ─────────────────────────────────────────────────────────────────────────────────

export const TIMINGS = {
  INSERT_DURATION: 400,      // Cartridge movement into slot
  INSERT_CLICK_AT: 0.55,     // When to play click (55% through motion)
  VERIFY_DURATION: 650,      // CRC verification display
  BOOT_DURATION: 900,        // Boot sequence display
  ERROR_DISPLAY: 1500,       // Error message display before reset
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// SCREEN TEXT FOR EACH STATE
// ─────────────────────────────────────────────────────────────────────────────────

export const SCREEN_TEXT: Record<CartridgeState, string[]> = {
  idle: ['', '', ''],
  hover: ['WAIT', 'SLOT', 'INSERT'],
  pressing: ['WAIT', 'SLOT', 'INSERT'],
  inserting: ['DETECTING...', 'SLOT 01', 'SEATING'],
  verifying: ['BOOT', 'CRC...', 'VERIFYING'],
  booting: ['CRC OK', 'MOUNTED', 'LOADING ORIGIN'],
  ready: ['READY', 'ORIGIN', 'PRESS TO ENTER'],
  error: ['ERROR', 'CRC FAIL', 'EJECT'],
};

// ─────────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────────

function cartridgeReducer(state: CartridgeState, action: CartridgeAction): CartridgeState {
  switch (action.type) {
    case 'POINTER_ENTER':
      if (state === 'idle') return 'hover';
      return state;

    case 'POINTER_LEAVE':
      if (state === 'hover' || state === 'pressing') return 'idle';
      return state;

    case 'POINTER_DOWN':
      if (state === 'hover' || state === 'idle') return 'pressing';
      return state;

    case 'POINTER_UP':
      if (state === 'pressing') return 'hover';
      return state;

    case 'CLICK':
      if (state === 'idle' || state === 'hover' || state === 'pressing') return 'inserting';
      if (state === 'error') return 'idle';
      // Ready state click is handled externally (route transition)
      return state;

    case 'INSERT_COMPLETE':
      if (state === 'inserting') return 'verifying';
      return state;

    case 'VERIFY_COMPLETE':
      if (state === 'verifying') return 'booting';
      return state;

    case 'BOOT_COMPLETE':
      if (state === 'booting') return 'ready';
      return state;

    case 'TRIGGER_ERROR':
      if (state === 'verifying') return 'error';
      return state;

    case 'RESET':
      return 'idle';

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────────

interface UseCartridgeMachineOptions {
  onReady?: () => void;
  onInsertClick?: () => void;
  onVerifyStart?: () => void;
  onBootStart?: () => void;
  simulateError?: boolean;
}

export function useCartridgeMachine(options: UseCartridgeMachineOptions = {}) {
  const { onReady, onInsertClick, onVerifyStart, onBootStart, simulateError = false } = options;
  
  const [state, dispatch] = useReducer(cartridgeReducer, 'idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const insertClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (insertClickTimeoutRef.current) clearTimeout(insertClickTimeoutRef.current);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE TRANSITION EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (insertClickTimeoutRef.current) clearTimeout(insertClickTimeoutRef.current);

    switch (state) {
      case 'inserting':
        // Schedule insert click sound
        insertClickTimeoutRef.current = setTimeout(() => {
          onInsertClick?.();
        }, TIMINGS.INSERT_DURATION * TIMINGS.INSERT_CLICK_AT);
        
        // Complete insert
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'INSERT_COMPLETE' });
        }, TIMINGS.INSERT_DURATION);
        break;

      case 'verifying':
        onVerifyStart?.();
        timeoutRef.current = setTimeout(() => {
          if (simulateError) {
            dispatch({ type: 'TRIGGER_ERROR' });
          } else {
            dispatch({ type: 'VERIFY_COMPLETE' });
          }
        }, TIMINGS.VERIFY_DURATION);
        break;

      case 'booting':
        onBootStart?.();
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'BOOT_COMPLETE' });
        }, TIMINGS.BOOT_DURATION);
        break;

      case 'ready':
        onReady?.();
        break;

      case 'error':
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'RESET' });
        }, TIMINGS.ERROR_DISPLAY);
        break;
    }
  }, [state, simulateError, onInsertClick, onVerifyStart, onBootStart, onReady]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: 'POINTER_ENTER' });
  }, []);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: 'POINTER_LEAVE' });
  }, []);

  const handlePointerDown = useCallback(() => {
    dispatch({ type: 'POINTER_DOWN' });
  }, []);

  const handlePointerUp = useCallback(() => {
    dispatch({ type: 'POINTER_UP' });
  }, []);

  const handleClick = useCallback(() => {
    dispatch({ type: 'CLICK' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const isInserted = ['verifying', 'booting', 'ready'].includes(state);
  const isAnimating = ['inserting', 'verifying', 'booting'].includes(state);
  const screenActive = state !== 'idle';
  const screenLines = SCREEN_TEXT[state];

  // Insert progress (0 to 1) for animation
  const getInsertProgress = useCallback(() => {
    if (state === 'inserting') return 0; // Will be animated externally
    if (isInserted) return 1;
    return 0;
  }, [state, isInserted]);

  return {
    state,
    screenLines,
    screenActive,
    isInserted,
    isAnimating,
    getInsertProgress,
    
    // Actions
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleClick,
    reset,
  };
}

export default useCartridgeMachine;
