// ═══════════════════════════════════════════════════════════════
// MILADY THEME TAXONOMY
// Based on "Drip Grade" style classification system
// ═══════════════════════════════════════════════════════════════

export type MiladyTheme = 
  | 'GYARU'
  | 'PREP'
  | 'LOLITA'
  | 'HYPEBEAST'
  | 'HARAJUKU'
  | 'GOTH'
  | 'COTTAGECORE'
  | 'Y2K'
  | 'MIXED'
  | 'UNKNOWN';

// Theme to accent color mapping (subtle, not overwhelming)
export const THEME_COLORS: Record<MiladyTheme, { border: string; bg: string; text: string }> = {
  GYARU: { border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-700' },
  PREP: { border: 'border-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  LOLITA: { border: 'border-pink-400', bg: 'bg-pink-50', text: 'text-pink-700' },
  HYPEBEAST: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  HARAJUKU: { border: 'border-violet-400', bg: 'bg-violet-50', text: 'text-violet-700' },
  GOTH: { border: 'border-neutral-600', bg: 'bg-neutral-100', text: 'text-neutral-700' },
  COTTAGECORE: { border: 'border-lime-400', bg: 'bg-lime-50', text: 'text-lime-700' },
  Y2K: { border: 'border-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  MIXED: { border: 'border-neutral-400', bg: 'bg-neutral-50', text: 'text-neutral-600' },
  UNKNOWN: { border: 'border-neutral-300', bg: 'bg-neutral-50', text: 'text-neutral-500' },
};

// Keywords that map to themes (for trait/attribute parsing)
const THEME_KEYWORDS: Record<MiladyTheme, string[]> = {
  GYARU: ['gyaru', 'tan', 'blonde', 'kogal', 'ganguro', 'manba'],
  PREP: ['prep', 'preppy', 'polo', 'blazer', 'sweater', 'cardigan', 'plaid'],
  LOLITA: ['lolita', 'frilly', 'bow', 'bonnet', 'maid', 'princess', 'ribbon'],
  HYPEBEAST: ['hype', 'supreme', 'bape', 'streetwear', 'hoodie', 'cap'],
  HARAJUKU: ['harajuku', 'decora', 'fairy', 'kawaii', 'colorful', 'punk'],
  GOTH: ['goth', 'dark', 'black', 'vampire', 'skull', 'emo', 'punk'],
  COTTAGECORE: ['cottage', 'floral', 'garden', 'pastoral', 'nature', 'rustic'],
  Y2K: ['y2k', 'cyber', 'chrome', 'holographic', 'futuristic', 'space'],
  MIXED: [],
  UNKNOWN: [],
};

/**
 * Infer theme from traits/attributes
 */
export function inferTheme(traits: Record<string, string | number> | undefined): MiladyTheme {
  if (!traits) return 'UNKNOWN';

  const traitString = Object.values(traits).join(' ').toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(kw => traitString.includes(kw))) {
      return theme as MiladyTheme;
    }
  }

  // Fallback based on "core" attribute if present
  const core = traits.core?.toString().toLowerCase();
  if (core) {
    if (core.includes('gyaru')) return 'GYARU';
    if (core.includes('prep')) return 'PREP';
    if (core.includes('lolita')) return 'LOLITA';
    if (core.includes('goth')) return 'GOTH';
    if (core.includes('harajuku') || core.includes('kawaii')) return 'HARAJUKU';
  }

  return 'UNKNOWN';
}

/**
 * Get hat theme from hat attribute
 */
export function getHatTheme(hatValue: string | undefined): MiladyTheme {
  if (!hatValue) return 'UNKNOWN';
  const lower = hatValue.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return theme as MiladyTheme;
    }
  }
  return 'MIXED';
}

/**
 * Get shirt theme from shirt attribute
 */
export function getShirtTheme(shirtValue: string | undefined): MiladyTheme {
  if (!shirtValue) return 'UNKNOWN';
  const lower = shirtValue.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return theme as MiladyTheme;
    }
  }
  return 'MIXED';
}

export const ALL_THEMES: MiladyTheme[] = [
  'GYARU', 'PREP', 'LOLITA', 'HYPEBEAST', 'HARAJUKU', 'GOTH', 'COTTAGECORE', 'Y2K', 'MIXED', 'UNKNOWN'
];
