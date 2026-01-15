'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// ACT II STAGE — "It produces artifacts."
// 
// ARCHITECTURE:
// ─────────────
// - Single mount, no re-rendering heavy nodes on scroll
// - Acts as state transitions via transforms, not remounts
// - One pinned container (sticky top:0, 200vh scroll height)
// - No overlap with Act I visually
//
// SCROLL BEATS (progress 0 → 1 over 200vh):
// ─────────────────────────────────────────
// Beat 1 (0.00 → 0.20): Headline + body lines reveal with stagger
// Beat 2 (0.20 → 0.45): Card #1 fades in with subtle y translate
// Beat 3 (0.45 → 0.75): Cards #2 and #3 appear behind with offsets
// Beat 4 (0.75 → 1.00): Hold for reading
//
// TRANSITION HINGE LINE:
// ─────────────────────
// "The network began to resolve into identity."
// Opacity: 0 @ 0.00 → 1 @ 0.08 → 0 @ 0.22
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT — Defined once, rendered once
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT = {
  headline: 'It produces artifacts.',
  hingeLine: 'The network began to resolve into identity.',
  bodyLines: [
    'Characters.',
    'Events.',
    'Publications.',
    'Garments.',
    'Records.',
  ],
  card: {
    topLabel: ['NETWORK TOPOLOGY SNAPSHOT', 'RML-NET / OBSERVATION WINDOW'],
    metadata: [
      'ARCHIVE ENTRY — RML-NET-0002',
      'TYPE: CHARACTER SEED',
      'STATUS: IN CIRCULATION',
      'SOURCE: REMILIA.NET',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ACT II STAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ActIIStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Single scroll progress drives all transforms
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSITION HINGE LINE
  // Appears briefly at start, then fades
  // ─────────────────────────────────────────────────────────────────────────
  const hingeOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.22],
    [0, 1, 0],
    { clamp: true }
  );

  // ─────────────────────────────────────────────────────────────────────────
  // HEADLINE + BODY TRANSFORMS (Beat 1: 0.00 → 0.20)
  // ─────────────────────────────────────────────────────────────────────────
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.15],
    [0, 0.5, 1],
    { clamp: true }
  );
  const headlineY = useTransform(
    scrollYProgress,
    [0, 0.15],
    [12, 0]
  );

  // Body lines staggered reveal
  const line1Opacity = useTransform(scrollYProgress, [0.04, 0.12], [0, 1], { clamp: true });
  const line2Opacity = useTransform(scrollYProgress, [0.06, 0.14], [0, 1], { clamp: true });
  const line3Opacity = useTransform(scrollYProgress, [0.08, 0.16], [0, 1], { clamp: true });
  const line4Opacity = useTransform(scrollYProgress, [0.10, 0.18], [0, 1], { clamp: true });
  const line5Opacity = useTransform(scrollYProgress, [0.12, 0.20], [0, 1], { clamp: true });
  const lineOpacities = [line1Opacity, line2Opacity, line3Opacity, line4Opacity, line5Opacity];

  // ─────────────────────────────────────────────────────────────────────────
  // CARD STACK TRANSFORMS
  // ─────────────────────────────────────────────────────────────────────────
  
  // Trace stack container — Beat 2: 0.20 → 0.45
  // Entire stack fades in as one unit; ghosts have static internal opacities
  const card1Opacity = useTransform(
    scrollYProgress,
    [0.20, 0.35],
    [0, 1],
    { clamp: true }
  );
  const card1Y = useTransform(
    scrollYProgress,
    [0.20, 0.35],
    [10, 0]
  );
  
  // Scanline effect (very subtle, single pass)
  const scanlineY = useTransform(
    scrollYProgress,
    [0.25, 0.45],
    ['-100%', '200%']
  );
  const scanlineOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.30, 0.40, 0.45],
    [0, 0.15, 0.15, 0],
    { clamp: true }
  );

  // NOTE: Ghost traces (GARMENT, PUBLICATION) have FIXED opacities (0.22, 0.12)
  // They do NOT animate separately — they inherit the card1Opacity animation
  // as part of the unified stack container. This creates "multiplicity" read.

  // ─────────────────────────────────────────────────────────────────────────
  // REDUCED MOTION FALLBACK
  // ─────────────────────────────────────────────────────────────────────────
  if (reducedMotion) {
    return (
      <section className="min-h-screen bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="max-w-[560px]">
            <h2 className="font-serif text-3xl mb-6">{CONTENT.headline}</h2>
            {CONTENT.bodyLines.map((line, i) => (
              <p key={i} className="font-serif text-xl">{line}</p>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="w-[320px] bg-white border border-black/10 p-4">
              <p className="text-xs tracking-widest uppercase text-black/50">
                {CONTENT.card.metadata[0]}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER — Single mount, transforms only
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={stageRef}
      className="relative bg-white"
      style={{ height: '200vh' }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Grid container — matches Act I layout */}
        <div
          className="relative h-full max-w-[1200px] mx-auto"
          style={{ padding: '0 clamp(48px, 6vw, 96px)' }}
        >
          
          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN — Editorial text
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute"
            style={{
              top: '38vh',
              left: 'clamp(48px, 6vw, 96px)',
              maxWidth: '560px',
            }}
          >
            {/* Transition hinge line — appears briefly */}
            <motion.p
              className="font-serif italic"
              style={{
                opacity: hingeOpacity,
                fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                color: 'rgba(0,0,0,0.55)',
                marginBottom: '2rem',
                lineHeight: 1.4,
              }}
            >
              {CONTENT.hingeLine}
            </motion.p>

            {/* Headline */}
            <motion.h2
              className="font-serif"
              style={{
                opacity: headlineOpacity,
                y: headlineY,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: '#111',
                marginBottom: '1.5rem',
              }}
            >
              {CONTENT.headline}
            </motion.h2>

            {/* Body lines — staggered reveal */}
            {CONTENT.bodyLines.map((line, i) => (
              <motion.p
                key={i}
                className="font-serif"
                style={{
                  opacity: lineOpacities[i],
                  fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: '#222',
                  marginBottom: '0.35rem',
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT COLUMN — Artifact Stack (SIMPLIFIED)
              Top poster card + 2 blank ghost paper cards behind
              
              CRITICAL: overflow-visible on stack wrapper so ghosts aren't clipped
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute hidden lg:block"
            style={{
              top: '50%',
              right: 'clamp(48px, 6vw, 96px)',
              transform: 'translateY(-50%)',
              width: 'clamp(300px, 22vw, 360px)',
              opacity: card1Opacity,
              y: card1Y,
            }}
          >
            {/* Stack wrapper — MUST be overflow-visible for ghost offsets */}
            <div className="relative" style={{ overflow: 'visible' }}>
              
              {/* ─────────────────────────────────────────────────────────────
                  GHOST 2 — BACK (furthest)
                  Blank paper card, clearly visible
                  ───────────────────────────────────────────────────────────── */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: 'translate(36px, 36px)',
                  zIndex: 10,
                  opacity: 0.10,
                  filter: 'blur(1px)',
                }}
              >
                <div
                  style={{
                    background: '#faf9f7',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: '280px',
                  }}
                />
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  GHOST 1 — MIDDLE
                  Blank paper card, clearly visible
                  ───────────────────────────────────────────────────────────── */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: 'translate(18px, 18px)',
                  zIndex: 20,
                  opacity: 0.18,
                  filter: 'blur(0.6px)',
                }}
              >
                <div
                  style={{
                    background: '#faf9f7',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: '280px',
                  }}
                />
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  TOP CARD — Poster (EVENT)
                  Full opacity, primary readable artifact
                  ───────────────────────────────────────────────────────────── */}
              <div style={{ position: 'relative', zIndex: 30 }}>
                <TraceCardEvent />
                
                {/* Scanline effect — extremely subtle, single pass */}
                <motion.div
                  className="absolute inset-x-0 pointer-events-none"
                  style={{
                    top: scanlineY,
                    height: '2px',
                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05), transparent)',
                    opacity: scanlineOpacity,
                    zIndex: 31,
                  }}
                />
              </div>

            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              TOP-RIGHT MICRO LABEL — Persistent
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute hidden lg:block"
            style={{
              opacity: headlineOpacity,
              right: 'clamp(48px, 6vw, 96px)',
              top: 'clamp(80px, 10vh, 120px)',
            }}
          >
            <p className="text-[10px] tracking-[0.22em] uppercase text-black/50 mb-1">
              {CONTENT.card.topLabel[0]}
            </p>
            <p className="text-[10px] tracking-[0.22em] uppercase text-black/35">
              {CONTENT.card.topLabel[1]}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TRACE CARDS — EVENT / GARMENT / PUBLICATION
// Three overlapping artifact traces replacing the archive index table
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// TRACE #1 — EVENT (Poster fragment with cropped image)
// ─────────────────────────────────────────────────────────────────────────────

function TraceCardEvent() {
  // Aspect ratio for the crop region: 1080x560 ≈ 1.93
  const cropAspect = 1080 / 560;
  
  return (
    <div
      style={{
        background: 'rgba(253,252,251,1)',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
    >
      {/* Image window — cropped poster fragment */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: `${100 / cropAspect}%`, // Maintains aspect ratio
          overflow: 'hidden',
          background: 'rgba(250,248,246,1)',
        }}
      >
        {/* Poster image with CSS crop */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/milady-poster.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'auto',
            // Scale to show only top 560px of 1440px height (38.9%)
            // We want to show top portion, so objectPosition top left
            objectFit: 'cover',
            objectPosition: 'top left',
            // Visual treatment: scanned/archived feel
            // Moderate de-emphasis: still readable but not "poster feature"
            filter: 'grayscale(90%) contrast(0.85) brightness(1.0)',
            opacity: 0.82,
          }}
        />
        
        {/* Paper grain overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.006) 3px,
                rgba(0,0,0,0.006) 6px
              )
            `,
            pointerEvents: 'none',
          }}
        />
        
        {/* Subtle vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.03) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Caption — micro labels */}
      <div style={{ padding: '10px 12px' }}>
        <p
          style={{
            fontSize: '8px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.45)',
            margin: 0,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          ARCHIVE TRACE — EVENT
        </p>
        <p
          style={{
            fontSize: '7px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.32)',
            margin: '3px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          RML-NET / TOKYO
        </p>
        <p
          style={{
            fontSize: '6px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.24)',
            margin: '3px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          STATUS: LOGGED
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL TIMELINE (200vh)
//
// Progress | Phase                    | Left Column              | Right Column (Artifact Stack)
// ─────────|──────────────────────────|──────────────────────────|─────────────────────────────
// 0.00     | Start                    | Hinge fading in          | Empty
// 0.08     | Hinge peak               | Hinge at 100%, headline  | Empty
// 0.15     | Headline visible         | Headline + body stagger  | Empty
// 0.20     | Body complete            | All text visible         | ENTIRE STACK emerging
// 0.22     | Hinge gone               | Hinge faded out          | Stack visible (poster + ghosts)
// 0.35     | Stack stable             | Hold                     | Full stack at 100%
// 0.75     | Hold                     | Hold                     | Hold
// 1.00     | End                      | Hold                     | Hold
//
// ARTIFACT STACK (SIMPLIFIED):
// - Entire stack animates as ONE unit via card1Opacity
// - Ghost cards have FIXED internal opacities (always visible when stack appears)
// - Stack wrapper is overflow-visible so ghost offsets aren't clipped
//
// TOP CARD (EVENT): z-30, opacity 1
// - Poster fragment from /milady-poster.png
// - Caption: "ARCHIVE TRACE — EVENT / RML-NET / TOKYO / STATUS: LOGGED"
//
// GHOST 1: z-20, opacity 0.18, blur 0.6px, translate(18px, 18px)
// - Blank paper card (#faf9f7)
//
// GHOST 2: z-10, opacity 0.10, blur 1px, translate(36px, 36px)
// - Blank paper card (#faf9f7)
//
// DOM: ONE pinned container, no duplicates, transforms only
// ═══════════════════════════════════════════════════════════════════════════
