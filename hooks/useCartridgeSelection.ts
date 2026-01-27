import { create } from 'zustand';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SELECTION STATE MACHINE
// States: idle → hover → selected → inserting → inserted
// ═══════════════════════════════════════════════════════════════════════════════

export type CartridgeState = 'idle' | 'hover' | 'selected' | 'inserting' | 'inserted';

interface CartridgeSelectionStore {
  state: CartridgeState;
  cartridgeId: string | null;
  
  // Actions
  setHover: (hovered: boolean) => void;
  select: (id: string) => void;
  startInsert: () => void;
  completeInsert: () => void;
  reset: () => void;
}

export const useCartridgeSelection = create<CartridgeSelectionStore>((set, get) => ({
  state: 'idle',
  cartridgeId: null,

  setHover: (hovered) => {
    const { state } = get();
    if (state === 'idle' && hovered) {
      set({ state: 'hover' });
    } else if (state === 'hover' && !hovered) {
      set({ state: 'idle' });
    }
  },

  select: (id) => {
    const { state } = get();
    if (state === 'idle' || state === 'hover') {
      set({ state: 'selected', cartridgeId: id });
    }
  },

  startInsert: () => {
    const { state } = get();
    if (state === 'selected') {
      set({ state: 'inserting' });
    }
  },

  completeInsert: () => {
    const { state } = get();
    if (state === 'inserting') {
      set({ state: 'inserted' });
    }
  },

  reset: () => {
    set({ state: 'idle', cartridgeId: null });
  },
}));
