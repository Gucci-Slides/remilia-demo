// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CARD SYSTEM TYPES
//
// State machine for PS1 memory card navigation metaphor.
// Each "save block" represents a loadable state, not a page.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Save block definition
 * - id: Unique identifier (01-05)
 * - label: Display text (uppercase)
 * - sublabel: Optional secondary text
 */
export interface SaveBlock {
  id: string;
  label: string;
  sublabel?: string;
}

/**
 * System states
 * - idle: Base state (wordmark + metadata visible)
 * - loading: Transition flicker (120-150ms)
 * - loaded: Inside a memory (narrative visible)
 * - ejecting: Returning to base state
 */
export type SystemState = 'idle' | 'loading' | 'loaded' | 'ejecting';

/**
 * Active memory slot (null = no memory loaded)
 */
export type ActiveSlot = string | null;

/**
 * Narrative content for each save block
 */
export interface NarrativeContent {
  slotId: string;
  lines: NarrativeLine[];
}

/**
 * Individual narrative line with optional red intrusion
 */
export interface NarrativeLine {
  text: string;
  redWord?: string; // Single word to highlight in system red
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAVE BLOCK REGISTRY
//
// These are the "save files" available in the memory card.
// ═══════════════════════════════════════════════════════════════════════════════

export const SAVE_BLOCKS: SaveBlock[] = [
  { id: '01', label: 'REMILIA', sublabel: 'ORIGIN' },
  { id: '02', label: 'NETWORK', sublabel: undefined },
  { id: '03', label: 'RECORDS', sublabel: undefined },
  { id: '04', label: 'SYSTEMS', sublabel: undefined },
  { id: '05', label: 'ARCHIVE', sublabel: undefined },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE CONTENT PER SLOT
//
// Each slot has its own narrative text.
// Red word intrusions are sparse and semantic.
// ═══════════════════════════════════════════════════════════════════════════════

export const NARRATIVES: Record<string, NarrativeContent> = {
  '01': {
    slotId: '01',
    lines: [
      { text: 'Remilia started online.' },
      { text: 'It persisted.' },
      { text: 'It became a matter of record.', redWord: 'record' },
      { text: 'What begins as presence becomes proof.' },
      { text: 'The interface remembers what the institution forgot.' },
    ],
  },
  '02': {
    slotId: '02',
    lines: [
      { text: 'A network is not a platform.' },
      { text: 'Platforms extract. Networks compound.' },
      { text: 'Identity is portable when it is yours.' },
      { text: 'Sovereignty is not granted. It is claimed.' },
      { text: 'The boundary of the network is participation.', redWord: 'participation' },
    ],
  },
  '03': {
    slotId: '03',
    lines: [
      { text: 'Every artifact is an entry.' },
      { text: 'The archive grows by what it accepts.' },
      { text: 'Records outlive the systems that made them.', redWord: 'Records' },
      { text: 'What is witnessed becomes permanent.' },
      { text: 'Time is the only curator.' },
    ],
  },
  '04': {
    slotId: '04',
    lines: [
      { text: 'Systems fail. Protocols persist.' },
      { text: 'The interface is the institution.' },
      { text: 'Code is law is culture is memory.' },
      { text: 'Coordination without coordination.', redWord: 'error' },
      { text: 'The system knows what the user forgot.' },
    ],
  },
  '05': {
    slotId: '05',
    lines: [
      { text: 'The archive is never complete.' },
      { text: 'What is stored is not what is known.' },
      { text: 'Access is the new ownership.', redWord: 'archive' },
      { text: 'Memory is distributed. Truth is consensus.' },
      { text: 'The record continues.' },
    ],
  },
};
