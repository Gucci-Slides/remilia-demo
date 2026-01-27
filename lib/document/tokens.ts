// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT SYSTEM — Design Tokens
//
// Single source of truth for all document viewport styling.
// Import these tokens when building document components.
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// PAPER COLORS
// ─────────────────────────────────────────────────────────────────────────────────

export const paper = {
  base: '#f5f2eb',
  warmth: '#faf8f3',
  shadow: 'rgba(45, 40, 35, 0.04)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// INK LEVELS BY TIER
// 
// MONUMENT: 85-90% (highest contrast)
// STATE: 65-75%
// ARCHIVE: 55-65%
// LABEL: 45-55%
// MICRO: 35-45%
// ─────────────────────────────────────────────────────────────────────────────────

export const ink = {
  // Per-tier ink (active state)
  monument: 'rgba(18, 16, 14, 0.88)',   // 04 - highest
  state: 'rgba(18, 16, 14, 0.72)',       // 03
  archive: 'rgba(18, 16, 14, 0.60)',     // 02
  label: 'rgba(18, 16, 14, 0.50)',       // 01
  micro: 'rgba(18, 16, 14, 0.40)',       // 00 - lightest
  
  // Ref states (margin annotations)
  refActive: 'rgba(18, 16, 14, 0.65)',   // Active ref
  refInactive: 'rgba(18, 16, 14, 0.35)', // Inactive ref
  
  // Structural elements
  rule: 'rgba(18, 16, 14, 0.09)',
  ruleFaint: 'rgba(18, 16, 14, 0.05)',
  cropMark: 'rgba(18, 16, 14, 0.12)',
  tick: 'rgba(18, 16, 14, 0.03)',
  pageBreak: 'rgba(18, 16, 14, 0.12)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// BASELINE UNIT
// 
// All spacing derives from this unit.
// ─────────────────────────────────────────────────────────────────────────────────

export const baseline = {
  unit: 8,        // px
  lineHeight: 1.55,
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// MARGIN SIZES
// ─────────────────────────────────────────────────────────────────────────────────

export const margins = {
  // Outer padding
  outer: 'clamp(24px, 5vw, 64px)',
  
  // Spine line offset from left
  spineOffset: 72, // px from outer padding
  
  // Right margin for refs (desktop)
  rightMargin: 240, // px minimum
  rightMarginMobile: 0,
  
  // Page padding
  pageX: 'clamp(48px, 8vw, 96px)',
  pageY: 'clamp(48px, 8vh, 80px)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// RULE OPACITY
// ─────────────────────────────────────────────────────────────────────────────────

export const rules = {
  spine: 0.08,
  rightMargin: 0.06,
  cropMark: 0.12,
  pageBreak: 0.12,
  baseline: 0.05,
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// GRAIN SETTINGS
// ─────────────────────────────────────────────────────────────────────────────────

export const grain = {
  layerA: 0.018,
  layerB: 0.012,
  // Alternate seed for page breaks
  layerAlt: 0.015,
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// INTERSECTION OBSERVER THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────────

export const observer = {
  // Active band: top 20% → 55% of viewport
  rootMargin: '-20% 0px -45% 0px',
  threshold: [0, 0.2, 0.5, 1],
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// BREAKPOINTS
// ─────────────────────────────────────────────────────────────────────────────────

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1024,
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// CSS VARIABLE MAPPING
// 
// Use these to generate CSS custom properties.
// ─────────────────────────────────────────────────────────────────────────────────

export const cssVars = {
  '--vp-paper-base': paper.base,
  '--vp-paper-warmth': paper.warmth,
  '--vp-ink-monument': ink.monument,
  '--vp-ink-state': ink.state,
  '--vp-ink-archive': ink.archive,
  '--vp-ink-label': ink.label,
  '--vp-ink-micro': ink.micro,
  '--vp-ink-ref-active': ink.refActive,
  '--vp-ink-ref-inactive': ink.refInactive,
  '--vp-ink-rule': ink.rule,
  '--vp-baseline-unit': `${baseline.unit}px`,
  '--vp-margin-outer': margins.outer,
  '--vp-margin-right': `${margins.rightMargin}px`,
  '--vp-spine-offset': `${margins.spineOffset}px`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE SCALE (matching globals.css)
// ─────────────────────────────────────────────────────────────────────────────────

export const typeScale = {
  monument: 'clamp(38px, 3.6vw, 48px)',
  state: '22px',
  archive: '16px',
  label: '12px',
  micro: '10px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// TIER ENUM
// ─────────────────────────────────────────────────────────────────────────────────

export type Tier = 'MONUMENT' | 'STATE' | 'ARCHIVE' | 'LABEL' | 'MICRO';

export const tierToClass: Record<Tier, string> = {
  MONUMENT: 't-monument',
  STATE: 't-state',
  ARCHIVE: 't-archive',
  LABEL: 't-label',
  MICRO: 't-micro',
};
