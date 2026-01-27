// ═══════════════════════════════════════════════════════════════════════════════
// CONSOLE SYSTEM TYPES
//
// PS1 Boot Screen / Xbox Live Dashboard inspired interface.
// This is not a website. This is a powered-on console OS.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Navigation menu items
 */
export interface MenuItem {
  id: string;
  label: string;
  angle: number; // Position in degrees around the orb (0 = top, 90 = right, etc.)
}

/**
 * System state
 * - boot: Initial power-on sequence
 * - idle: Waiting for input
 * - selected: Item selected, transitioning to narrative
 * - narrative: Displaying narrative content
 */
export type SystemState = 'boot' | 'idle' | 'selected' | 'narrative';

/**
 * System intensity (controlled by scroll)
 * 0 = dim, 1 = full intensity
 */
export type Intensity = number;

/**
 * Narrative line with optional red word
 */
export interface NarrativeLine {
  text: string;
  redWord?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const MENU_ITEMS: MenuItem[] = [
  { id: 'origin', label: 'ORIGIN', angle: -60 },
  { id: 'network', label: 'NETWORK', angle: -20 },
  { id: 'records', label: 'RECORDS', angle: 20 },
  { id: 'systems', label: 'SYSTEMS', angle: 60 },
  { id: 'archive', label: 'ARCHIVE', angle: 100 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NARRATIVE_LINES: NarrativeLine[] = [
  { text: 'Remilia started online.' },
  { text: '' }, // Empty line for spacing
  { text: 'What formed was not a site,' },
  { text: 'but a network.' },
  { text: '' },
  { text: 'What persisted' },
  { text: 'was the record.', redWord: 'record' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM COLORS
// ═══════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  background: '#0a0a0c',
  backgroundLight: '#12121a',
  primary: '#E10600', // Remilia Red
  glow: 'rgba(225, 6, 0, 0.6)',
  text: 'rgba(255, 255, 255, 0.85)',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  textDim: 'rgba(255, 255, 255, 0.15)',
  orb: 'rgba(180, 200, 255, 0.08)',
  orbGlow: 'rgba(180, 200, 255, 0.15)',
  grid: 'rgba(100, 120, 180, 0.06)',
  scanline: 'rgba(0, 0, 0, 0.03)',
};
