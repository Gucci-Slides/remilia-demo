import { MiladyNFT } from './milady';

// ═══════════════════════════════════════════════════════════════
// LAYOUT SYSTEM — STREET ARCHIVE
// ═══════════════════════════════════════════════════════════════

export type SpreadLayout = 'SINGLE' | 'OFFSET' | 'TIGHT' | 'GROUP_STRIP';
export type SpreadType = 'look' | 'interruption' | 'group_strip';

export interface SpreadConfig {
  type: SpreadType;
  layout?: SpreadLayout;
  interruptionText?: string;
  groupCount?: number;
}

/**
 * Deterministic layout picker
 * Creates dense, zine-like rhythm with occasional group strips
 */
export function getSpreadConfig(index: number): SpreadConfig {
  // Group strip every 6 looks (shows 4-5 images in a row)
  if (index > 0 && index % 7 === 6) {
    return {
      type: 'group_strip',
      groupCount: 4 + (index % 2), // alternates 4-5
    };
  }

  // Aggressive typographic interruption every 10 looks
  if (index > 0 && index % 11 === 0) {
    return {
      type: 'interruption',
      interruptionText: getInterruptionText(index),
    };
  }

  // Layout rotation for variety
  const layouts: SpreadLayout[] = ['SINGLE', 'TIGHT', 'SINGLE', 'OFFSET', 'TIGHT'];
  const layout = layouts[index % layouts.length];

  return {
    type: 'look',
    layout,
  };
}

function getInterruptionText(index: number): string {
  const texts = [
    'MILADY',
    'NETWORK STATE',
    'DIGITAL TRIBE',
    'STREET STYLE',
    'NEOCHIBI',
  ];
  return texts[Math.floor(index / 11) % texts.length];
}

// ═══════════════════════════════════════════════════════════════
// TRAIT SELECTION
// ═══════════════════════════════════════════════════════════════

const PREFERRED_TRAITS = [
  'core', 'background', 'hair', 'eyes', 'hat', 'accessory', 'shirt', 'drip_grade',
];

export interface DisplayTrait {
  label: string;
  value: string;
}

export function selectDisplayTraits(nft: MiladyNFT, count: number = 3): DisplayTrait[] {
  const traits: DisplayTrait[] = [];

  if (nft.core) traits.push({ label: 'CORE', value: String(nft.core).toUpperCase() });
  if (nft.background) traits.push({ label: 'BG', value: String(nft.background).toUpperCase() });
  if (nft.hair) traits.push({ label: 'HAIR', value: String(nft.hair).toUpperCase() });
  if (nft.hat) traits.push({ label: 'HAT', value: String(nft.hat).toUpperCase() });
  if (nft.drip_grade) traits.push({ label: 'DRIP', value: String(nft.drip_grade).toUpperCase() });

  if (nft.traits && typeof nft.traits === 'object') {
    for (const key of PREFERRED_TRAITS) {
      if (traits.length >= count) break;
      const value = nft.traits[key];
      if (value !== undefined && value !== null) {
        const alreadyAdded = traits.some(t => t.label.toLowerCase() === key);
        if (!alreadyAdded) {
          traits.push({ label: key.toUpperCase(), value: String(value).toUpperCase() });
        }
      }
    }
  }

  return traits.slice(0, count);
}

// ═══════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════

export function formatTokenName(nft: MiladyNFT): string {
  if (nft.name && nft.name.trim()) return nft.name.toUpperCase();
  return `MILADY #${nft.id}`;
}

export function formatTokenId(nft: MiladyNFT): string {
  return `#${nft.id}`;
}

export const COLLECTION_META = {
  name: 'MILADY MAKER',
  year: '2021',
} as const;
