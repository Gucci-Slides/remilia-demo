// ═══════════════════════════════════════════════════════════════
// REGISTRY QUERY — Filter and sort subjects
// ═══════════════════════════════════════════════════════════════

import { MiladySubject } from './types';
import { ParsedQuery } from './parser';

export function querySubjects(
  subjects: MiladySubject[],
  query: ParsedQuery
): MiladySubject[] {
  let results = [...subjects];

  // Filter by ID (exact or partial)
  if (query.id) {
    results = results.filter(s => s.id.includes(query.id!));
  }

  // Filter by themes
  if (query.themes.length > 0) {
    results = results.filter(s =>
      query.themes.some(theme => s.themes.includes(theme))
    );
  }

  // Filter by drip range
  results = results.filter(
    s => s.dripScore >= query.dripMin && s.dripScore <= query.dripMax
  );

  // Filter by match only
  if (query.matchOnly) {
    results = results.filter(s => s.matchBonus);
  }

  // Sort
  switch (query.sort) {
    case 'drip_desc':
      results.sort((a, b) => b.dripScore - a.dripScore);
      break;
    case 'drip_asc':
      results.sort((a, b) => a.dripScore - b.dripScore);
      break;
    case 'id_asc':
      results.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      break;
    case 'id_desc':
      results.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      break;
  }

  return results;
}

export function getFeaturedSubject(subjects: MiladySubject[]): MiladySubject | null {
  if (subjects.length === 0) return null;
  
  // Return highest drip score
  return subjects.reduce((best, s) => 
    s.dripScore > best.dripScore ? s : best
  , subjects[0]);
}
