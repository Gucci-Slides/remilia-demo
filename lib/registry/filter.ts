// ═══════════════════════════════════════════════════════════════
// MILADY REGISTRY — FILTERING & SORTING
// ═══════════════════════════════════════════════════════════════

import { MiladySubject, QueryState } from './types';

export function filterSubjects(
  subjects: MiladySubject[],
  query: QueryState
): MiladySubject[] {
  let results = [...subjects];

  // Filter by ID (exact match)
  if (query.searchId.trim()) {
    const searchTerm = query.searchId.trim();
    results = results.filter(s => s.id.includes(searchTerm));
  }

  // Filter by themes (intersection)
  if (query.selectedThemes.length > 0) {
    results = results.filter(s =>
      query.selectedThemes.some(theme => s.themes.includes(theme))
    );
  }

  // Filter by drip range
  results = results.filter(
    s => s.dripScore >= query.dripRange[0] && s.dripScore <= query.dripRange[1]
  );

  // Filter by match only
  if (query.matchOnly) {
    results = results.filter(s => s.matchBonus);
  }

  // Sort
  switch (query.sortBy) {
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

export function findSubjectById(
  subjects: MiladySubject[],
  id: string
): MiladySubject | undefined {
  return subjects.find(s => s.id === id);
}
