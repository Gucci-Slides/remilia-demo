'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// REMILIA REGISTRY WORDMARK — RE / MIL / IA (Overprint Archive)
// 
// TYPOGRAPHIC ROLES:
// - RE = "Institution / archive" voice (serif, heavier, authoritative)
// - MIL = "system / interface" voice (slightly tighter, UI promoted)
// - IA = "artifact / misprint" voice (same as RE but treated as print layer)
// 
// THE SINGLE DISRUPTION:
// Misregistered IA duplicate behind the true IA:
// - REMILIA RED #E10600
// - Offset: x: +6px, y: -2px (animates based on scroll)
// - Blend: multiply
// - Blur: 0.4px (ink bleed)
// 
// SPACING (kerning failure aesthetic):
// - Gap RE → MIL: 0.38em
// - Gap MIL → IA: 0.62em
// - IA gets translateY(+0.08em) for subtle optical drop
// ═══════════════════════════════════════════════════════════════════════════

const REMILIA_RED = '#E10600';

// Syllable gaps (em units)
const GAP_RE_MIL = '0.38em';
const GAP_MIL_IA = '0.62em';

// IA optical drop
const IA_DROP = '0.08em';

// Misregistered layer base offset
const MISREG_X_BASE = 6; // px
const MISREG_Y = -2; // px

interface RemiliaRegistryWordmarkProps {
  /** Scroll progress (0 → 1) for animating misregistration */
  scrollProgress?: MotionValue<number>;
  /** Animated IA opacity (for pressure effect) */
  iaOpacity?: MotionValue<number>;
  /** Animated IA x offset (for pressure effect) */
  iaOffsetX?: MotionValue<number>;
}

export function RemiliaRegistryWordmark({
  scrollProgress,
  iaOpacity,
  iaOffsetX,
}: RemiliaRegistryWordmarkProps) {
  // Default static values if no scroll progress provided
  const staticIaOpacity = 0.75;
  const staticIaOffsetX = MISREG_X_BASE;

  return (
    <span
      aria-label="Remilia"
      className="inline-flex items-baseline select-none"
      style={{
        whiteSpace: 'nowrap',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          RE — Institution / Archive Voice
          Serif, authoritative, anchor baseline
      ══════════════════════════════════════════════════════════════ */}
      <span
        data-part="re"
        style={{
          fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 500,
          lineHeight: 0.95,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
        }}
      >
        Re
      </span>

      {/* Kerning failure gap: RE → MIL */}
      <span aria-hidden="true" style={{ width: GAP_RE_MIL }} />

      {/* ══════════════════════════════════════════════════════════════
          MIL — System / Interface Voice
          Slightly tighter, UI text promoted
      ══════════════════════════════════════════════════════════════ */}
      <span
        data-part="mil"
        style={{
          fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
          fontSize: 'clamp(44px, 7.5vw, 90px)',
          fontWeight: 400,
          lineHeight: 0.95,
          color: '#0a0a0a',
          letterSpacing: '0.01em',
        }}
      >
        mil
      </span>

      {/* Kerning failure gap: MIL → IA (larger hesitation) */}
      <span aria-hidden="true" style={{ width: GAP_MIL_IA }} />

      {/* ══════════════════════════════════════════════════════════════
          IA — Artifact / Misprint Voice
          With misregistered red duplicate behind
      ══════════════════════════════════════════════════════════════ */}
      <span
        data-part="ia"
        className="relative inline-block"
        style={{
          transform: `translateY(${IA_DROP})`,
        }}
      >
        {/* Misregistered duplicate (behind) — THE SINGLE DISRUPTION */}
        {scrollProgress ? (
          <MisregisteredIA 
            iaOpacity={iaOpacity} 
            iaOffsetX={iaOffsetX} 
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute pointer-events-none select-none"
            style={{
              fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 500,
              lineHeight: 0.95,
              color: REMILIA_RED,
              mixBlendMode: 'multiply',
              filter: 'blur(0.4px)',
              opacity: staticIaOpacity,
              left: `${staticIaOffsetX}px`,
              top: `${MISREG_Y}px`,
              zIndex: -1,
            }}
          >
            ia
          </span>
        )}

        {/* True IA (foreground) */}
        <span
          style={{
            fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 500,
            lineHeight: 0.95,
            color: '#0a0a0a',
            letterSpacing: '-0.01em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          ia
        </span>
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MISREGISTERED IA — Animated duplicate layer
// ═══════════════════════════════════════════════════════════════════════════

interface MisregisteredIAProps {
  iaOpacity?: MotionValue<number>;
  iaOffsetX?: MotionValue<number>;
}

function MisregisteredIA({ iaOpacity, iaOffsetX }: MisregisteredIAProps) {
  // Use provided motion values or defaults
  const opacity = iaOpacity ? iaOpacity : 0.75;
  const x = iaOffsetX ? iaOffsetX : MISREG_X_BASE;

  return (
    <motion.span
      aria-hidden="true"
      className="absolute pointer-events-none select-none"
      style={{
        fontFamily: 'var(--font-editorial), "Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(48px, 8vw, 96px)',
        fontWeight: 500,
        lineHeight: 0.95,
        color: REMILIA_RED,
        mixBlendMode: 'multiply',
        filter: 'blur(0.4px)',
        opacity: typeof opacity === 'number' ? opacity : opacity,
        x: typeof x === 'number' ? x : x,
        top: `${MISREG_Y}px`,
        left: 0,
        zIndex: -1,
      }}
    >
      ia
    </motion.span>
  );
}

export default RemiliaRegistryWordmark;
