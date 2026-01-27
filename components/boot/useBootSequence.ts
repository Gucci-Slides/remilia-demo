// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE — State Management
//
// States: idle → hover → selected → inserting → inserted
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type BootState = 'idle' | 'hover' | 'selected' | 'inserting' | 'inserted';

interface BootSequence {
  state: BootState;
  cartridgeId: string;

  // Actions
  setHover: (hovering: boolean) => void;
  select: () => void;
  startInsert: () => void;
  completeInsert: () => void;
  reset: () => void;

  // Derived
  isInteractive: () => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────────

export const useBootSequence = create<BootSequence>((set, get) => ({
  state: 'idle',
  cartridgeId: 'origin', // Single cartridge ID for now

  setHover: (hovering) => {
    const { state } = get();
    // Only allow hover transitions in idle state
    if (state === 'idle' && hovering) {
      set({ state: 'hover' });
    } else if (state === 'hover' && !hovering) {
      set({ state: 'idle' });
    }
  },

  select: () => {
    const { state } = get();
    if (state === 'idle' || state === 'hover') {
      set({ state: 'selected' });
    }
  },

  startInsert: () => {
    const { state } = get();
    if (state === 'selected') {
      set({ state: 'inserting' });
    }
  },

  completeInsert: () => {
    set({ state: 'inserted' });
  },

  reset: () => {
    set({ state: 'idle' });
  },

  isInteractive: () => {
    const { state } = get();
    return state === 'idle' || state === 'hover';
  },
}));
