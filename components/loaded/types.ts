// ═══════════════════════════════════════════════════════════════════════════════
// LOADED MEMORY INTERFACE — Types
//
// A title page that behaves like a loaded system state.
// PS1 / PS2 boot screens, early Xbox dashboard, memory card UI.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * System coordinate labels
 * These are not buttons — they are coordinates.
 */
export interface SystemLabel {
  id: string;
  text: string;
  // Position offsets from natural placement (intentional irregularity)
  offsetX: number;
  offsetY: number;
  // Letter spacing variance
  letterSpacing: string;
}

/**
 * Interface state
 * - mounted: Initial state, wordmark visible
 * - transitioning: Wordmark fading, narrative incoming
 * - narrative: Narrative text visible
 */
export type InterfaceState = 'mounted' | 'transitioning' | 'narrative';

/**
 * Narrative line
 */
export interface NarrativeLine {
  text: string;
  indent?: boolean; // Slight left indent for visual rhythm
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const SYSTEM_LABELS: SystemLabel[] = [
  { id: 'origin', text: 'ORIGIN', offsetX: -12, offsetY: 8, letterSpacing: '0.28em' },
  { id: 'network', text: 'NETWORK', offsetX: 6, offsetY: -4, letterSpacing: '0.22em' },
  { id: 'records', text: 'RECORDS', offsetX: -8, offsetY: 14, letterSpacing: '0.25em' },
];

export const NARRATIVE_LINES: NarrativeLine[] = [
  { text: 'Remilia was not announced.' },
  { text: 'It accumulated.' },
  { text: '' }, // Spacer
  { text: 'Identity persisted.', indent: true },
  { text: 'Records formed.', indent: true },
  { text: 'Systems followed.', indent: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  background: '#0a0a0b',
  text: 'rgba(245, 243, 240, 0.85)',
  textMuted: 'rgba(245, 243, 240, 0.45)',
  textDim: 'rgba(245, 243, 240, 0.2)',
  textFaint: 'rgba(245, 243, 240, 0.08)',
  interference: '#E10600',
  bloom: 'rgba(255, 255, 255, 0.15)',
};
