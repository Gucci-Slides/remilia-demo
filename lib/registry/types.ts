// ═══════════════════════════════════════════════════════════════
// MILADY REGISTRY — TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export type MiladyTheme = 
  | 'GYARU' 
  | 'PREP' 
  | 'LOLITA' 
  | 'HYPEBEAST' 
  | 'HARAJUKU' 
  | 'GOTH';

export const ALL_THEMES: MiladyTheme[] = [
  'GYARU',
  'PREP', 
  'LOLITA',
  'HYPEBEAST',
  'HARAJUKU',
  'GOTH',
];

export type DripGrade = 'S+' | 'A' | 'B' | 'C' | 'D';

export interface MiladySubject {
  id: string;
  imageUrl: string;
  name: string;
  dripScore: number;
  dripGrade: DripGrade;
  themes: MiladyTheme[];
  hatTheme?: MiladyTheme;
  shirtTheme?: MiladyTheme;
  matchBonus: boolean;
  traits: Record<string, string>;
}

export interface QueryState {
  searchId: string;
  selectedThemes: MiladyTheme[];
  dripRange: [number, number];
  matchOnly: boolean;
  sortBy: 'drip_desc' | 'drip_asc' | 'id_asc' | 'id_desc';
}

export type ViewMode = 'dossier' | 'index';

export const DEFAULT_QUERY: QueryState = {
  searchId: '',
  selectedThemes: [],
  dripRange: [0, 100],
  matchOnly: false,
  sortBy: 'drip_desc',
};
