/**
 * ═══════════════════════════════════════════════════════════════
 * MILADY REGISTRY — RITUAL TERMINAL
 * ═══════════════════════════════════════════════════════════════
 * 
 * This is not a gallery or a dashboard. It is a ritual terminal.
 * The user is presented with selections, not asked to "filter."
 * 
 * LAYERS:
 * 1. Stage — Single hero plate with editorial label
 * 2. Invocation — Command palette overlay for queries
 * 3. Index — Bottom drawer contact sheet
 * 
 * KEYBOARD:
 * - / : Open invocation palette
 * - Esc : Close overlays
 * - ← → : Navigate spreads
 * 
 * INVOCATION SYNTAX:
 * - id:9999
 * - theme:prep (or theme:gyaru,lolita)
 * - drip>70 or drip<50 or drip:60-90
 * - match:true or +5
 * - sort:drip_desc
 * 
 * Combined: "theme:goth drip>60 match:true"
 * 
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MOCK_SUBJECTS } from '@/lib/registry/mock';
import { parseInvocation, DEFAULT_PARSED_QUERY, ParsedQuery } from '@/lib/registry/parser';
import { querySubjects, getFeaturedSubject } from '@/lib/registry/query';
import { MiladySubject } from '@/lib/registry/types';
import { RegistryStage } from '@/components/ritual/RegistryStage';
import { InvocationPalette } from '@/components/ritual/InvocationPalette';
import { IndexDrawer } from '@/components/ritual/IndexDrawer';

export default function RegistryPage() {
  // Query state
  const [currentQuery, setCurrentQuery] = useState<ParsedQuery>(DEFAULT_PARSED_QUERY);
  const [invocationInput, setInvocationInput] = useState('');
  
  // UI state
  const [invokeOpen, setInvokeOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);

  // Filtered results
  const results = useMemo(() => {
    return querySubjects(MOCK_SUBJECTS, currentQuery);
  }, [currentQuery]);

  // Preview for invocation palette
  const previewQuery = useMemo(() => parseInvocation(invocationInput), [invocationInput]);
  const previewResults = useMemo(() => {
    return querySubjects(MOCK_SUBJECTS, previewQuery);
  }, [previewQuery]);

  // Current subject on stage
  const currentSubject = useMemo(() => {
    if (results.length === 0) return null;
    return results[Math.min(spreadIndex, results.length - 1)] || null;
  }, [results, spreadIndex]);

  // Initialize with featured subject
  useEffect(() => {
    if (results.length > 0 && spreadIndex >= results.length) {
      setSpreadIndex(0);
    }
  }, [results, spreadIndex]);

  // Handle invocation
  const handleInvoke = useCallback((query: ParsedQuery) => {
    setCurrentQuery(query);
    setSpreadIndex(0);
  }, []);

  // Handle subject selection from index
  const handleSelectSubject = useCallback((subject: MiladySubject) => {
    const idx = results.findIndex(s => s.id === subject.id);
    if (idx >= 0) {
      setSpreadIndex(idx);
    }
  }, [results]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if palette is open and typing
      if (invokeOpen && e.key !== 'Escape') return;

      // Open invocation
      if (e.key === '/' && !invokeOpen) {
        e.preventDefault();
        setInvokeOpen(true);
      }

      // Close overlays
      if (e.key === 'Escape') {
        setInvokeOpen(false);
        setIndexOpen(false);
      }

      // Navigate spreads
      if (e.key === 'ArrowLeft' && !invokeOpen && !indexOpen) {
        setSpreadIndex(prev => Math.max(0, prev - 1));
      }
      if (e.key === 'ArrowRight' && !invokeOpen && !indexOpen) {
        setSpreadIndex(prev => Math.min(results.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invokeOpen, indexOpen, results.length]);

  return (
    <>
      {/* Stage */}
      <RegistryStage
        subject={currentSubject}
        spreadIndex={spreadIndex}
        totalSpreads={results.length}
        onOpenInvoke={() => setInvokeOpen(true)}
        onOpenIndex={() => setIndexOpen(true)}
        onPrev={() => setSpreadIndex(prev => Math.max(0, prev - 1))}
        onNext={() => setSpreadIndex(prev => Math.min(results.length - 1, prev + 1))}
      />

      {/* Invocation Palette */}
      <InvocationPalette
        isOpen={invokeOpen}
        onClose={() => setInvokeOpen(false)}
        onInvoke={handleInvoke}
        previewResults={previewResults}
        totalCount={MOCK_SUBJECTS.length}
      />

      {/* Index Drawer */}
      <IndexDrawer
        isOpen={indexOpen}
        onClose={() => setIndexOpen(false)}
        subjects={results}
        selectedId={currentSubject?.id ?? null}
        onSelect={handleSelectSubject}
      />
    </>
  );
}
