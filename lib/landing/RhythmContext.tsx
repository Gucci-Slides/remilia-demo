'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { computeRhythmLayout, type RhythmLayout, spacing } from './rhythm';

// ─────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────

interface RhythmContextValue {
  layout: RhythmLayout | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  wordmarkRef: React.RefObject<HTMLHeadingElement | null>;
  registerWordmark: (ref: HTMLHeadingElement | null) => void;
  registerContainer: (ref: HTMLDivElement | null) => void;
}

const RhythmContext = createContext<RhythmContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────

interface RhythmProviderProps {
  children: React.ReactNode;
}

export function RhythmProvider({ children }: RhythmProviderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const [layout, setLayout] = useState<RhythmLayout | null>(null);

  const registerWordmark = useCallback((ref: HTMLHeadingElement | null) => {
    wordmarkRef.current = ref;
  }, []);

  const registerContainer = useCallback((ref: HTMLDivElement | null) => {
    containerRef.current = ref;
  }, []);

  // Compute layout
  const computeLayout = useCallback(() => {
    if (!containerRef.current || !wordmarkRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const wordmarkRect = wordmarkRef.current.getBoundingClientRect();

    const newLayout = computeRhythmLayout({
      containerRect,
      wordmarkRect,
      opticalNudge: 0,
    });

    setLayout(newLayout);
  }, []);

  // Initial computation + resize handling
  useLayoutEffect(() => {
    // Delay initial computation to ensure refs are set
    const timer = setTimeout(computeLayout, 50);
    return () => clearTimeout(timer);
  }, [computeLayout]);

  useEffect(() => {
    let rafId: number | null = null;

    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeLayout);
    };

    // ResizeObserver for wordmark
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && wordmarkRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(wordmarkRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [computeLayout]);

  return (
    <RhythmContext.Provider
      value={{
        layout,
        containerRef,
        wordmarkRef,
        registerWordmark,
        registerContainer,
      }}
    >
      {children}
    </RhythmContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────

export function useRhythm() {
  const context = useContext(RhythmContext);
  if (!context) {
    throw new Error('useRhythm must be used within a RhythmProvider');
  }
  return context;
}

// Re-export spacing for convenience
export { spacing };
