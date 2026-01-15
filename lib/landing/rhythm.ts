// ─────────────────────────────────────────────────────────────────
// LANDING PAGE RHYTHM SYSTEM
// Shared layout computation for Act I and Act II
// ─────────────────────────────────────────────────────────────────

// Base rhythm unit (8px)
export const U = 8;

// Spacing helpers
export const spacing = {
  u1: U,
  u2: U * 2,
  u3: U * 3,
  u4: U * 4,
  u6: U * 6,
  u8: U * 8,
  u10: U * 10,
  u12: U * 12,
} as const;

// ─────────────────────────────────────────────────────────────────
// LAYOUT COMPUTATION
// ─────────────────────────────────────────────────────────────────

export interface RhythmLayout {
  // Spine A: left edge of wordmark (desktop alignment point)
  spineA_x: number;
  // Wordmark position relative to container
  wordmarkTop: number;
  wordmarkBottom: number;
  wordmarkHeight: number;
  // Container dimensions
  containerWidth: number;
  containerHeight: number;
  // Mobile flag
  isMobile: boolean;
  // Optical nudge for inscription alignment
  opticalNudge: number;
}

export interface ComputeRhythmOptions {
  containerRect: DOMRect;
  wordmarkRect: DOMRect;
  opticalNudge?: number;
  mobileBreakpoint?: number;
}

export function computeRhythmLayout({
  containerRect,
  wordmarkRect,
  opticalNudge = 0,
  mobileBreakpoint = 640,
}: ComputeRhythmOptions): RhythmLayout {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < mobileBreakpoint;
  
  // Spine A: left edge of wordmark relative to container
  const spineA_x = wordmarkRect.left - containerRect.left + opticalNudge;
  
  // Wordmark position
  const wordmarkTop = wordmarkRect.top - containerRect.top;
  const wordmarkBottom = wordmarkRect.bottom - containerRect.top;
  const wordmarkHeight = wordmarkRect.height;
  
  return {
    spineA_x: Math.max(0, spineA_x),
    wordmarkTop,
    wordmarkBottom,
    wordmarkHeight,
    containerWidth: containerRect.width,
    containerHeight: containerRect.height,
    isMobile,
    opticalNudge,
  };
}

// ─────────────────────────────────────────────────────────────────
// INSCRIPTION POSITION
// Position above wordmark, aligned to spine A
// ─────────────────────────────────────────────────────────────────

export interface InscriptionPosition {
  left: number;
  top: number;
}

export function computeInscriptionPosition(
  layout: RhythmLayout,
  inscriptionHeight: number
): InscriptionPosition {
  if (layout.isMobile) {
    // Mobile: center the inscription
    return {
      left: 0, // Will use centered styling instead
      top: layout.wordmarkTop - inscriptionHeight - spacing.u4,
    };
  }
  
  // Desktop: align to spine A, position above wordmark
  return {
    left: layout.spineA_x,
    top: layout.wordmarkTop - inscriptionHeight - spacing.u3,
  };
}

// ─────────────────────────────────────────────────────────────────
// ACT II COLUMN POSITION
// Position below wordmark, aligned to spine A
// ─────────────────────────────────────────────────────────────────

export interface Act2ColumnPosition {
  left: number | 'auto';
  marginLeft: string;
  maxWidth: string;
}

export function computeAct2ColumnPosition(
  layout: RhythmLayout
): Act2ColumnPosition {
  if (layout.isMobile) {
    // Mobile: centered column with padding
    return {
      left: 'auto',
      marginLeft: 'auto',
      maxWidth: 'var(--measure-sm)',
    };
  }
  
  // Desktop: align to spine A
  return {
    left: layout.spineA_x,
    marginLeft: '0',
    maxWidth: 'var(--measure-lg)',
  };
}

// ─────────────────────────────────────────────────────────────────
// EYES POSITION (witness mark)
// Position to the right of wordmark
// ─────────────────────────────────────────────────────────────────

export interface EyesPosition {
  left: number;
  top: number;
  opacity: number;
}

export function computeEyesPosition(
  layout: RhythmLayout,
  wordmarkRect: DOMRect,
  containerRect: DOMRect,
  eyesSize: number
): EyesPosition {
  const eyesGap = Math.min(spacing.u6, Math.max(spacing.u3, layout.containerWidth * 0.02));
  let eyesLeft = (wordmarkRect.right - containerRect.left) + eyesGap;
  const eyesTop = layout.wordmarkTop + (layout.wordmarkHeight * 0.55) - (eyesSize * 0.5);
  
  // If overflow, tuck over the wordmark
  if (eyesLeft + eyesSize > layout.containerWidth - spacing.u2) {
    eyesLeft = (wordmarkRect.right - containerRect.left) - spacing.u3;
  }
  
  return {
    left: Math.max(0, eyesLeft),
    top: Math.max(0, eyesTop),
    opacity: layout.isMobile ? 0.06 : 0.08,
  };
}

// ─────────────────────────────────────────────────────────────────
// SCROLL BEAT CALCULATION
// Map scroll progress to active beat index
// ─────────────────────────────────────────────────────────────────

export function getActiveBeatIndex(scrollProgress: number, totalBeats: number): number {
  return Math.min(
    Math.floor(scrollProgress * totalBeats),
    totalBeats - 1
  );
}

export function getBeatOpacityRange(
  beatIndex: number,
  totalBeats: number
): { start: number; fadeIn: number; holdEnd: number; end: number } {
  const segmentSize = 1 / totalBeats;
  const start = beatIndex * segmentSize;
  const end = (beatIndex + 1) * segmentSize;
  
  return {
    start,
    fadeIn: start + segmentSize * 0.15,
    holdEnd: start + segmentSize * 0.75,
    end,
  };
}
