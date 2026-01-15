/**
 * ═══════════════════════════════════════════════════════════════
 * MILADY REGISTRY — INSTITUTIONAL ARCHIVE TERMINAL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Design Philosophy:
 * - The user is not "browsing NFTs"; they are querying an artifact registry
 * - UI feels like a museum backroom terminal / editorial catalog
 * - Search is the hero, not the results grid
 * - Minimal chrome, maximum negative space
 * - No ecommerce cues
 * 
 * Layout:
 * - Two-panel "Ritual Terminal"
 * - Left: Query Console (compose a query like a form)
 * - Right: Archive Output (Dossier or Index view)
 * 
 * Keyboard:
 * - / : Focus search
 * - Arrow keys: Navigate index
 * - Enter: Open dossier
 * - Escape: Clear selection
 * 
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  QueryState, 
  ViewMode, 
  MiladySubject,
  DEFAULT_QUERY 
} from '@/lib/registry/types';
import { MOCK_SUBJECTS } from '@/lib/registry/mock';
import { filterSubjects, findSubjectById } from '@/lib/registry/filter';
import { InstitutionHeader } from '@/components/terminal/InstitutionHeader';
import { QueryConsole } from '@/components/terminal/QueryConsole';
import { DossierView } from '@/components/terminal/DossierView';
import { IndexView } from '@/components/terminal/IndexView';

export default function TerminalPage() {
  // State
  const [query, setQuery] = useState<QueryState>(DEFAULT_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryState>(DEFAULT_QUERY);
  const [viewMode, setViewMode] = useState<ViewMode>('dossier');
  const [selectedSubject, setSelectedSubject] = useState<MiladySubject | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Filter results based on applied query
  const results = useMemo(() => {
    return filterSubjects(MOCK_SUBJECTS, appliedQuery);
  }, [appliedQuery]);

  // Apply query
  const handleApply = useCallback(() => {
    setAppliedQuery(query);
    
    // If searching by ID, find and select that subject
    if (query.searchId.trim()) {
      const found = findSubjectById(MOCK_SUBJECTS, query.searchId.trim());
      if (found) {
        setSelectedSubject(found);
        setViewMode('dossier');
      }
    }
  }, [query]);

  // Select subject from index
  const handleSelectSubject = useCallback((subject: MiladySubject) => {
    setSelectedSubject(subject);
    const idx = results.findIndex(s => s.id === subject.id);
    setSelectedIndex(idx);
    
    // Auto-switch to dossier on selection
    setViewMode('dossier');
  }, [results]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on /
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        input?.focus();
      }

      // Navigate index with arrow keys
      if (viewMode === 'index' && results.length > 0) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = Math.min(selectedIndex + 1, results.length - 1);
          setSelectedIndex(nextIndex);
          setSelectedSubject(results[nextIndex]);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = Math.max(selectedIndex - 1, 0);
          setSelectedIndex(prevIndex);
          setSelectedSubject(results[prevIndex]);
        }
        if (e.key === 'Enter' && selectedSubject) {
          e.preventDefault();
          setViewMode('dossier');
        }
      }

      // Escape clears selection
      if (e.key === 'Escape') {
        setSelectedSubject(null);
        setSelectedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, results, selectedIndex, selectedSubject]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      {/* Paper grain */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <InstitutionHeader
        totalCount={MOCK_SUBJECTS.length}
        loadedCount={results.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={query.sortBy}
        onSortChange={(sort) => {
          const newQuery = { ...query, sortBy: sort as QueryState['sortBy'] };
          setQuery(newQuery);
          setAppliedQuery(newQuery);
        }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Query Console (left panel) */}
        <QueryConsole
          query={query}
          onQueryChange={setQuery}
          onApply={handleApply}
          resultCount={results.length}
        />

        {/* Archive Output (right panel) */}
        {viewMode === 'dossier' ? (
          <DossierView subject={selectedSubject} />
        ) : (
          <IndexView
            subjects={results}
            selectedId={selectedSubject?.id ?? null}
            onSelect={handleSelectSubject}
          />
        )}
      </div>
    </div>
  );
}
