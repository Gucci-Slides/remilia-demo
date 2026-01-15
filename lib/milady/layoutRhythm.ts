// ═══════════════════════════════════════════════════════════════
// LAYOUT RHYTHM — Newspaper/zine aesthetic
// ═══════════════════════════════════════════════════════════════

export function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ═══════════════════════════════════════════════════════════════
// GRID ITEM TYPES
// ═══════════════════════════════════════════════════════════════

export type GridItemType = 
  | 'card' 
  | 'card_hero'
  | 'theme_header' 
  | 'doctrine_quote' 
  | 'typographic_spread'
  | 'expert_block'
  | 'flyer_block';

export interface GridItemConfig {
  type: GridItemType;
  colSpan?: number;
  rowSpan?: number;
}

// ═══════════════════════════════════════════════════════════════
// THEME HEADERS
// ═══════════════════════════════════════════════════════════════

export interface ThemeHeaderConfig {
  theme: string;
  subtitle: string;
  quote: string;
}

const THEME_DATA: Record<string, { subtitle: string; quote: string }> = {
  GYARU: { 
    subtitle: 'STREET FORM', 
    quote: '"Microvibes dominate the liminal surface of Network Spirituality."' 
  },
  PREP: { 
    subtitle: 'CAMPUS DOC', 
    quote: '"The institution persists through aesthetic discipline."' 
  },
  LOLITA: { 
    subtitle: 'SWEET ARCHIVE', 
    quote: '"Ornamentation is not excess but structural necessity."' 
  },
  HYPEBEAST: { 
    subtitle: 'HYPE INDEX', 
    quote: '"Status signals compound across network surfaces."' 
  },
  HARAJUKU: { 
    subtitle: 'DOCUMIT', 
    quote: '"Hyperagodic desaturation flows through tribe fashion."' 
  },
  GOTH: { 
    subtitle: 'DARK FORM', 
    quote: '"The shadow aesthetic persists beyond trend cycles."' 
  },
  COTTAGECORE: { 
    subtitle: 'PASTORAL', 
    quote: '"Return aesthetics mask forward acceleration."' 
  },
  Y2K: { 
    subtitle: 'CYBER DOC', 
    quote: '"Nostalgia for futures that never arrived."' 
  },
  MIXED: { 
    subtitle: 'HYBRID', 
    quote: '"Classification fails at the edges."' 
  },
  UNKNOWN: { 
    subtitle: 'UNCLASSIFIED', 
    quote: '"The archive contains its own gaps."' 
  },
};

export function getThemeHeader(theme: string): ThemeHeaderConfig {
  const data = THEME_DATA[theme] ?? THEME_DATA.UNKNOWN;
  return { theme, ...data };
}

// ═══════════════════════════════════════════════════════════════
// DOCTRINE QUOTES — Inline text blocks
// ═══════════════════════════════════════════════════════════════

export const INLINE_QUOTES = [
  'Milady is natively post-IRL.',
  'The present is a network of microscopic style clans.',
  'Classification is provisional; drip is eternal.',
  'Taste propagates through tribal vectors.',
  'The archive remembers what individuals forget.',
  'Street form is the only authentic document.',
];

export function getInlineQuote(index: number): string {
  return INLINE_QUOTES[index % INLINE_QUOTES.length];
}

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHIC SPREADS
// ═══════════════════════════════════════════════════════════════

export const TYPO_SPREADS = [
  'MILADY IS NOT CUTE.',
  'NETWORK SPIRITUALITY',
  'INSTITUTIONAL CONTINUITY',
  'DRIP CHECK.',
];

export function getTypoSpread(index: number): string {
  return TYPO_SPREADS[index % TYPO_SPREADS.length];
}

// ═══════════════════════════════════════════════════════════════
// EXPERT MODE BLOCKS
// ═══════════════════════════════════════════════════════════════

export interface ExpertBlockConfig {
  theme: string;
  title: string;
  subtitle: string;
}

export function getExpertBlock(theme: string, index: number): ExpertBlockConfig {
  return {
    theme,
    title: `${theme} — EXPERT MODE`,
    subtitle: 'THE NEW MICROTRIBES',
  };
}

// ═══════════════════════════════════════════════════════════════
// CARD SIZING
// ═══════════════════════════════════════════════════════════════

export type CardSize = 'sm' | 'md' | 'lg' | 'hero';

export function getCardSize(index: number, hash: number): CardSize {
  // Hero: every 12th item
  if (index > 0 && index % 12 === 0) return 'hero';
  // Large: every 7th
  if (index % 7 === 0) return 'lg';
  // Medium: every 4th
  if (index % 4 === 0) return 'md';
  // Small: default
  return 'sm';
}

// ═══════════════════════════════════════════════════════════════
// CROP PRESETS — Aggressive, varied
// ═══════════════════════════════════════════════════════════════

export interface CropPreset {
  position: string;
  scale: string;
}

export const CROP_PRESETS: CropPreset[] = [
  { position: 'object-[50%_15%]', scale: 'scale-105' },
  { position: 'object-[50%_20%]', scale: 'scale-100' },
  { position: 'object-[35%_15%]', scale: 'scale-110' },
  { position: 'object-[65%_15%]', scale: 'scale-110' },
  { position: 'object-[50%_10%]', scale: 'scale-115' },
  { position: 'object-[40%_20%]', scale: 'scale-105' },
  { position: 'object-[60%_20%]', scale: 'scale-105' },
  { position: 'object-center', scale: 'scale-110' },
];

export function getCropPreset(id: string): CropPreset {
  const hash = hashId(id);
  return CROP_PRESETS[hash % CROP_PRESETS.length];
}

// ═══════════════════════════════════════════════════════════════
// LABEL CODES — Short metadata stamps
// ═══════════════════════════════════════════════════════════════

const LABEL_CODES = [
  'STRES', 'ELIRPS', 'STIRRD', 'PRNGR', 'LDRIP', 
  'HYPES', 'KITPS', 'PTOGAN', 'SITFRD', 'ALIEPS'
];

export function getLabelCode(id: string): string {
  const hash = hashId(id);
  return LABEL_CODES[hash % LABEL_CODES.length];
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT SEQUENCER
// ═══════════════════════════════════════════════════════════════

export interface LayoutItem {
  type: GridItemType;
  colSpan: number;
  rowSpan: number;
  index?: number;
  text?: string;
  theme?: string;
}

export function shouldInsertSpecialBlock(
  index: number, 
  isThemeBoundary: boolean,
  theme?: string
): LayoutItem | null {
  // Theme boundary: insert theme header
  if (isThemeBoundary && theme) {
    return { type: 'theme_header', colSpan: 6, rowSpan: 1, theme };
  }

  // Every 8 items: inline doctrine quote
  if (index > 0 && index % 8 === 7) {
    return { 
      type: 'doctrine_quote', 
      colSpan: 2, 
      rowSpan: 1, 
      text: getInlineQuote(index),
      index 
    };
  }

  // Every 15 items: typographic spread
  if (index > 0 && index % 15 === 0) {
    return { 
      type: 'typographic_spread', 
      colSpan: 3, 
      rowSpan: 2, 
      text: getTypoSpread(index),
      index 
    };
  }

  // Every 20 items: expert block
  if (index > 0 && index % 20 === 0 && theme) {
    return { 
      type: 'expert_block', 
      colSpan: 3, 
      rowSpan: 1, 
      theme,
      index 
    };
  }

  // Every 25 items: flyer block
  if (index > 0 && index % 25 === 0) {
    return { 
      type: 'flyer_block', 
      colSpan: 6, 
      rowSpan: 1,
      index 
    };
  }

  return null;
}
