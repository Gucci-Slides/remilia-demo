// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE STATE MACHINE — Reducer-Based FSM
//
// States: IDLE → HOVER → HELD → AIMING → INSERTING → BOOTING → READY
//
// No external libraries — clean reducer with timing managed externally.
// The boot timer sequence is handled in CartridgeSystem, not here.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  CartridgeMachineState,
  CartridgeMachineAction,
  CartridgeMode,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────────
// STATUS TEXTS
// ─────────────────────────────────────────────────────────────────────────────────

const STATUS_TEXTS: Record<CartridgeMode, string> = {
  IDLE: 'MOUNTED',
  HOVER: 'READABLE',
  HELD: 'READING...',
  AIMING: 'ALIGNING',
  INSERTING: 'INSERTING',
  BOOTING: 'BOOTING',
  READY: 'READY',
};

// ─────────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────────

export const initialState: CartridgeMachineState = {
  mode: 'IDLE',
  hoveredId: null,
  heldId: null,
  selectedId: null,
  statusText: STATUS_TEXTS.IDLE,
};

// ─────────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────────

export function cartridgeReducer(
  state: CartridgeMachineState,
  action: CartridgeMachineAction
): CartridgeMachineState {
  switch (action.type) {
    // ═══════════════════════════════════════════════════════════════════════════
    // HOVER EVENTS
    // ═══════════════════════════════════════════════════════════════════════════
    case 'HOVER_IN': {
      // Only respond if idle (not holding anything)
      if (state.mode !== 'IDLE') return state;
      return {
        ...state,
        mode: 'HOVER',
        hoveredId: action.id,
        statusText: STATUS_TEXTS.HOVER,
      };
    }

    case 'HOVER_OUT': {
      // Only respond if currently hovering this specific cartridge
      if (state.mode !== 'HOVER' || state.hoveredId !== action.id) return state;
      return {
        ...state,
        mode: 'IDLE',
        hoveredId: null,
        statusText: STATUS_TEXTS.IDLE,
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PICK UP (pointer down on cartridge)
    // ═══════════════════════════════════════════════════════════════════════════
    case 'PICK_UP': {
      // Can pick up from IDLE or HOVER states
      if (state.mode !== 'IDLE' && state.mode !== 'HOVER') return state;
      return {
        ...state,
        mode: 'HELD',
        heldId: action.id,
        hoveredId: null,
        statusText: STATUS_TEXTS.HELD,
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MOVE (pointer move while holding)
    // ═══════════════════════════════════════════════════════════════════════════
    case 'MOVE': {
      // Handled externally for position updates, no state change needed
      return state;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // AIMING (near slot while held)
    // ═══════════════════════════════════════════════════════════════════════════
    case 'AIM_IN': {
      if (state.mode !== 'HELD') return state;
      return {
        ...state,
        mode: 'AIMING',
        statusText: STATUS_TEXTS.AIMING,
      };
    }

    case 'AIM_OUT': {
      if (state.mode !== 'AIMING') return state;
      return {
        ...state,
        mode: 'HELD',
        statusText: STATUS_TEXTS.HELD,
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DROP (pointer up)
    // ═══════════════════════════════════════════════════════════════════════════
    case 'DROP': {
      // If aiming, commit to insert
      if (state.mode === 'AIMING') {
        return {
          ...state,
          mode: 'INSERTING',
          selectedId: state.heldId,
          statusText: STATUS_TEXTS.INSERTING,
        };
      }
      // Otherwise, drop back to idle
      if (state.mode === 'HELD') {
        return {
          ...state,
          mode: 'IDLE',
          heldId: null,
          statusText: STATUS_TEXTS.IDLE,
        };
      }
      return state;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // INSERT COMMIT (after insert animation completes)
    // ═══════════════════════════════════════════════════════════════════════════
    case 'INSERT_COMMIT': {
      if (state.mode !== 'INSERTING') return state;
      return {
        ...state,
        mode: 'BOOTING',
        heldId: null,
        statusText: STATUS_TEXTS.BOOTING,
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // BOOT DONE
    // ═══════════════════════════════════════════════════════════════════════════
    case 'BOOT_DONE': {
      if (state.mode !== 'BOOTING') return state;
      return {
        ...state,
        mode: 'READY',
        statusText: STATUS_TEXTS.READY,
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RESET
    // ═══════════════════════════════════════════════════════════════════════════
    case 'RESET': {
      return initialState;
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// DERIVED STATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

export function isHeld(state: CartridgeMachineState, id: string): boolean {
  return (
    (state.mode === 'HELD' || state.mode === 'AIMING' || state.mode === 'INSERTING') &&
    state.heldId === id
  );
}

export function isHovered(state: CartridgeMachineState, id: string): boolean {
  return state.mode === 'HOVER' && state.hoveredId === id;
}

export function isSelected(state: CartridgeMachineState, id: string): boolean {
  return state.selectedId === id;
}

export function isInteractive(state: CartridgeMachineState): boolean {
  return state.mode === 'IDLE' || state.mode === 'HOVER' || state.mode === 'HELD';
}

export function canPickUp(state: CartridgeMachineState): boolean {
  return state.mode === 'IDLE' || state.mode === 'HOVER';
}
