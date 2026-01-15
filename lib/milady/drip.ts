import { MiladyNFT } from '../milady';
import { inferTheme, getHatTheme, getShirtTheme, MiladyTheme } from './theme';

// ═══════════════════════════════════════════════════════════════
// DRIP SCORE + MATCH LOGIC
// ═══════════════════════════════════════════════════════════════

export interface MiladyClassification {
  id: string;
  name: string;
  image: string;
  opensea_url: string;
  primaryTheme: MiladyTheme;
  hatTheme: MiladyTheme;
  shirtTheme: MiladyTheme;
  hatShirtMatch: boolean;
  dripScore: number;
  dripGrade: string;
  traits: { key: string; value: string }[];
  raw: MiladyNFT;
}

/**
 * Classify a Milady NFT with theme and drip data
 */
export function classifyMilady(nft: MiladyNFT): MiladyClassification {
  const primaryTheme = inferTheme(nft.traits);
  const hatTheme = getHatTheme(nft.hat);
  const shirtTheme = getShirtTheme(nft.shirt);
  
  // Hat + Shirt theme match bonus
  const hatShirtMatch = hatTheme !== 'UNKNOWN' && 
                        shirtTheme !== 'UNKNOWN' && 
                        hatTheme === shirtTheme;

  // Extract drip score from attributes or compute approximation
  let dripScore = nft.drip_score ?? 0;
  if (!dripScore && nft.drip_grade) {
    dripScore = gradeToDripScore(nft.drip_grade);
  }
  if (!dripScore) {
    // Approximate from traits
    dripScore = approximateDripScore(nft, hatShirtMatch);
  }

  const dripGrade = nft.drip_grade ?? scoreToGrade(dripScore);

  // Extract key traits for display
  const traits: { key: string; value: string }[] = [];
  if (nft.core) traits.push({ key: 'CORE', value: nft.core });
  if (nft.background) traits.push({ key: 'BG', value: nft.background });
  if (nft.hair) traits.push({ key: 'HAIR', value: nft.hair });
  if (nft.hat) traits.push({ key: 'HAT', value: nft.hat });
  if (nft.shirt) traits.push({ key: 'SHIRT', value: nft.shirt });
  if (nft.race) traits.push({ key: 'RACE', value: nft.race });

  return {
    id: nft.id,
    name: nft.name || `Milady #${nft.id}`,
    image: nft.image,
    opensea_url: nft.opensea_url,
    primaryTheme,
    hatTheme,
    shirtTheme,
    hatShirtMatch,
    dripScore,
    dripGrade,
    traits,
    raw: nft,
  };
}

function gradeToDripScore(grade: string): number {
  const gradeMap: Record<string, number> = {
    'S+': 95, 'S': 90, 'A+': 85, 'A': 80,
    'B+': 75, 'B': 70, 'C+': 65, 'C': 60,
    'D+': 55, 'D': 50, 'F': 30,
  };
  return gradeMap[grade.toUpperCase()] ?? 50;
}

function scoreToGrade(score: number): string {
  if (score >= 95) return 'S+';
  if (score >= 90) return 'S';
  if (score >= 85) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'D+';
  if (score >= 50) return 'D';
  return 'F';
}

function approximateDripScore(nft: MiladyNFT, hatShirtMatch: boolean): number {
  let score = 50; // base

  // Bonus for having core
  if (nft.core) score += 10;
  // Bonus for hat
  if (nft.hat) score += 5;
  // Bonus for accessories implied
  if (nft.traits && Object.keys(nft.traits).length > 5) score += 10;
  // Hat/shirt match bonus
  if (hatShirtMatch) score += 5;

  return Math.min(score, 100);
}

/**
 * Sort functions
 */
export type SortMode = 'drip_desc' | 'drip_asc' | 'id_asc' | 'id_desc' | 'random' | 'theme';

export function sortMiladys(items: MiladyClassification[], mode: SortMode): MiladyClassification[] {
  const sorted = [...items];

  switch (mode) {
    case 'drip_desc':
      return sorted.sort((a, b) => b.dripScore - a.dripScore);
    case 'drip_asc':
      return sorted.sort((a, b) => a.dripScore - b.dripScore);
    case 'id_asc':
      return sorted.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    case 'id_desc':
      return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    case 'random':
      return sorted.sort(() => Math.random() - 0.5);
    case 'theme':
      return sorted.sort((a, b) => a.primaryTheme.localeCompare(b.primaryTheme));
    default:
      return sorted;
  }
}

/**
 * Filter functions
 */
export function filterMiladys(
  items: MiladyClassification[],
  filters: {
    themes?: MiladyTheme[];
    minDrip?: number;
    maxDrip?: number;
    matchOnly?: boolean;
    searchId?: string;
  }
): MiladyClassification[] {
  return items.filter(item => {
    // Theme filter
    if (filters.themes && filters.themes.length > 0) {
      if (!filters.themes.includes(item.primaryTheme)) return false;
    }

    // Drip range filter
    if (filters.minDrip !== undefined && item.dripScore < filters.minDrip) return false;
    if (filters.maxDrip !== undefined && item.dripScore > filters.maxDrip) return false;

    // Match only filter
    if (filters.matchOnly && !item.hatShirtMatch) return false;

    // ID search
    if (filters.searchId && !item.id.includes(filters.searchId)) return false;

    return true;
  });
}
