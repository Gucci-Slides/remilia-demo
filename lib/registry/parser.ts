// ═══════════════════════════════════════════════════════════════
// INVOCATION PARSER — Parse query tokens into structured query
// ═══════════════════════════════════════════════════════════════

import { MiladyTheme, ALL_THEMES } from './types';

export interface ParsedQuery {
  id?: string;
  themes: MiladyTheme[];
  dripMin: number;
  dripMax: number;
  matchOnly: boolean;
  sort: 'drip_desc' | 'drip_asc' | 'id_asc' | 'id_desc';
}

export const DEFAULT_PARSED_QUERY: ParsedQuery = {
  themes: [],
  dripMin: 0,
  dripMax: 100,
  matchOnly: false,
  sort: 'drip_desc',
};

/**
 * Parse invocation string into structured query
 * 
 * Supported tokens:
 * - id:9999
 * - theme:prep (or theme:gyaru,lolita)
 * - drip>70 or drip<50 or drip:60-90
 * - match:true
 * - sort:drip_desc
 * 
 * Example: "theme:goth drip>60 match:true"
 */
export function parseInvocation(input: string): ParsedQuery {
  const query: ParsedQuery = { ...DEFAULT_PARSED_QUERY };
  
  if (!input.trim()) return query;

  const tokens = input.toLowerCase().trim().split(/\s+/);

  for (const token of tokens) {
    // ID match
    if (token.startsWith('id:')) {
      query.id = token.slice(3);
      continue;
    }

    // Direct ID (just numbers)
    if (/^\d+$/.test(token)) {
      query.id = token;
      continue;
    }

    // Theme match
    if (token.startsWith('theme:')) {
      const themeStr = token.slice(6);
      const themeNames = themeStr.split(',');
      for (const name of themeNames) {
        const found = ALL_THEMES.find(
          t => t.toLowerCase() === name || t.toLowerCase().startsWith(name)
        );
        if (found && !query.themes.includes(found)) {
          query.themes.push(found);
        }
      }
      continue;
    }

    // Drip comparisons
    if (token.startsWith('drip>')) {
      const val = parseInt(token.slice(5));
      if (!isNaN(val)) query.dripMin = val;
      continue;
    }
    if (token.startsWith('drip<')) {
      const val = parseInt(token.slice(5));
      if (!isNaN(val)) query.dripMax = val;
      continue;
    }
    if (token.startsWith('drip:')) {
      const range = token.slice(5);
      const [min, max] = range.split('-').map(Number);
      if (!isNaN(min)) query.dripMin = min;
      if (!isNaN(max)) query.dripMax = max;
      continue;
    }

    // Match
    if (token === 'match:true' || token === 'match' || token === '+5') {
      query.matchOnly = true;
      continue;
    }

    // Sort
    if (token.startsWith('sort:')) {
      const sortVal = token.slice(5);
      if (['drip_desc', 'drip_asc', 'id_asc', 'id_desc'].includes(sortVal)) {
        query.sort = sortVal as ParsedQuery['sort'];
      }
      continue;
    }

    // Theme shorthand (just the theme name)
    const foundTheme = ALL_THEMES.find(
      t => t.toLowerCase() === token || t.toLowerCase().startsWith(token)
    );
    if (foundTheme && !query.themes.includes(foundTheme)) {
      query.themes.push(foundTheme);
    }
  }

  return query;
}

/**
 * Oracle suggestions based on partial input
 */
export const ORACLE_SUGGESTIONS = [
  'id:9999',
  'theme:gyaru',
  'theme:prep',
  'theme:lolita',
  'theme:hypebeast',
  'theme:harajuku',
  'theme:goth',
  'drip>80',
  'drip>90',
  'drip:70-100',
  'match:true',
  '+5',
  'sort:drip_desc',
  'sort:id_asc',
];

export function getOracleSuggestions(input: string): string[] {
  if (!input.trim()) return ORACLE_SUGGESTIONS.slice(0, 6);
  
  const lastToken = input.split(/\s+/).pop()?.toLowerCase() || '';
  
  return ORACLE_SUGGESTIONS.filter(s => 
    s.toLowerCase().includes(lastToken)
  ).slice(0, 5);
}
