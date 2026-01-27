'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// REMILIA WORDMARK — "Baseline Fracture" Implementation
// 
// DESIGN INTENT:
// - Subtly uncanny, unresolved, but still elegant
// - The eye registers a micro-tension it can't quite name
// - Must read as one word "Remilia" at first glance
// 
// FRACTURE MECHANICS:
// - Same serif font for all syllables (optical cohesion)
// - Baseline offsets via translateY (NOT margin/padding):
//   - RE: 0px (anchor)
//   - MIL: -2px (slightly higher)
//   - IA: +2px (slightly lower, also faded)
// - Asymmetric syllable gaps (spacer spans):
//   - After RE: 0.18em
//   - After MIL: 0.30em (hesitation before IA)
// - IA opacity: 0.86 (readable but receding)
// 
// RULES:
// - No imagery, gradients, borders, or decorative UI
// - No different fonts per syllable
// - Keep kerning natural inside each syllable
// - Quiet and editorial
// ═══════════════════════════════════════════════════════════════════════════

interface RemiliaWordmarkProps {
  /** Additional class names */
  className?: string;
  /** Show baseline debug guides */
  debug?: boolean;
  /** Optional scroll progress for micro-resolve (IA opacity 0.86 → 0.94) */
  scrollProgress?: MotionValue<number>;
}

// Baseline offsets (pixels)
const BASELINE_RE = 0;
const BASELINE_MIL = -2;
const BASELINE_IA = 2;

// Syllable spacing (em units)
const GAP_AFTER_RE = '0.18em';
const GAP_AFTER_MIL = '0.30em';

// IA opacity
const IA_OPACITY_DEFAULT = 0.86;
const IA_OPACITY_RESOLVED = 0.94;

export function RemiliaWordmark({
  className,
  debug = false,
  scrollProgress,
}: RemiliaWordmarkProps) {
  // Debug baseline guide style
  const debugGuideStyle: React.CSSProperties = debug
    ? {
        position: 'relative',
        background: 'linear-gradient(transparent 95%, rgba(255, 0, 0, 0.2) 95%, rgba(255, 0, 0, 0.2) 100%)',
      }
    : {};

  return (
    <span
      aria-label="Remilia"
      className={cn(
        'rm-wordmark',
        'inline-flex items-baseline select-none',
        className
      )}
      style={{
        fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
        fontWeight: 400,
        lineHeight: 0.95,
        whiteSpace: 'nowrap',
        ...debugGuideStyle,
      }}
    >
      {/* RE — Anchor baseline (0px) */}
      <span
        data-part="re"
        style={{
          display: 'inline-block',
          transform: `translateY(${BASELINE_RE}px)`,
          willChange: 'transform',
        }}
      >
        Re
      </span>

      {/* Spacer after RE */}
      <span aria-hidden="true" style={{ width: GAP_AFTER_RE }} />

      {/* MIL — Slightly higher baseline (-2px) */}
      <span
        data-part="mil"
        style={{
          display: 'inline-block',
          transform: `translateY(${BASELINE_MIL}px)`,
          willChange: 'transform',
        }}
      >
        mil
      </span>

      {/* Spacer after MIL (larger — hesitation) */}
      <span aria-hidden="true" style={{ width: GAP_AFTER_MIL }} />

      {/* IA — Lower baseline (+2px), faded */}
      {scrollProgress ? (
        <IAWithScroll 
          scrollProgress={scrollProgress} 
          baselineOffset={BASELINE_IA} 
        />
      ) : (
        <span
          data-part="ia"
          style={{
            display: 'inline-block',
            transform: `translateY(${BASELINE_IA}px)`,
            opacity: IA_OPACITY_DEFAULT,
            willChange: 'transform',
          }}
        >
          ia
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IA WITH SCROLL — Micro-resolve opacity on scroll (0.86 → 0.94 over 10%)
// ─────────────────────────────────────────────────────────────────────────────
function IAWithScroll({ 
  scrollProgress, 
  baselineOffset 
}: { 
  scrollProgress: MotionValue<number>; 
  baselineOffset: number;
}) {
  const opacity = useTransform(
    scrollProgress, 
    [0, 0.10], 
    [IA_OPACITY_DEFAULT, IA_OPACITY_RESOLVED], 
    { clamp: true }
  );

  return (
    <motion.span
      data-part="ia"
      style={{
        display: 'inline-block',
        transform: `translateY(${baselineOffset}px)`,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      ia
    </motion.span>
  );
}

export default RemiliaWordmark;
