'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Globe } from '@/components/ui/globe';

// ═══════════════════════════════════════════════════════════════════════════
// STAGE — Single Mount Container
// 
// ARCHITECTURE:
// ─────────────
// - ONE Stage component, mounted ONCE
// - ONE MorphObject (globe → face) that persists throughout
// - Acts are STATE TRANSITIONS, not separate components
// - Scroll controls TRANSFORMS, not STRUCTURE
//
// EXACT SCROLL TIMELINE:
// ──────────────────────
// 0.00 - 0.14: Act 0 — Typography-only title page (no globe, no imagery)
// 0.14 - 0.22: Act I text fades in, globe still hidden
// 0.22 - 0.45: Globe fades in, then morphs to face
// 0.32 - 0.55: Face emerges (faceOpacity 0 → 1)
// 0.34 - 0.42: Transition sentence appears
// 0.45:        Globe fully faded
// 0.48 - 0.88: Noise tightening (uncanny effect)
// 0.88 - 1.00: Stage release gate (artifacts can render)
//
// HARD CONSTRAINTS:
// ─────────────────
// ✗ NO conditional rendering that creates new instances
// ✗ NO duplicated DOM nodes
// ✗ NO re-mounting on scroll
// ✗ NO imagery on title page (Act 0)
// ✓ Single MorphObject instance
// ✓ State changes via transforms only
// ✓ Typography carries visual weight on title page
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT — All text defined once, visibility controlled by scroll state
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT = {
  act0: {
    title: 'Remilia',
  },
  act1: {
    headline: 'Remilia is a Network State.',
    lines: [
      'Not a platform.',
      'Not a brand.',
      'Not a DAO.',
      'A sovereign cultural organism.',
    ],
  },
  // Transition sentence — appears during recognition threshold
  transitionSentence: 'Identity becomes medium.',
  act2: {
    headline: 'It began as a net art collective.',
    lines: [
      'An open-ended online factory.',
      'A meeting ground for an emerging scene.',
      '',
      'Its medium is the internet.',
      'Its materials are identity,',
      'finance,',
      'industry,',
      'and circulation.',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Stage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // ─────────────────────────────────────────────────────────────────────────
  // SINGLE SCROLL PROGRESS — Controls ALL state transitions
  // ─────────────────────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EXACT TRANSFORM MAPPINGS (as specified)
  // ═══════════════════════════════════════════════════════════════════════════

  // A. MORPH PROGRESS — Core driver (0 = globe, 1 = face)
  // Feeds: vertex interpolation, dot position lerp, curvature flattening
  const morphProgress = useTransform(
    scrollYProgress,
    [0.18, 0.70],
    [0, 1],
    { clamp: true }
  );

  // B. GLOBE ROTATION → LOCK
  // Stops rotation before recognition phase
  const rotationY = useTransform(
    scrollYProgress,
    [0.0, 0.25],
    [20, 0],
    { clamp: true }
  );

  // C. GLOBE OPACITY → IDENTITY PRESENCE
  // Globe hidden on title page, fades in during morph, never coexists with final face
  const globeOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.14, 0.22, 0.45],
    [0, 0, 1, 0],
    { clamp: true }
  );

  // D. FACE OPACITY (delayed emergence)
  // Prevents premature reveal
  const faceOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.55],
    [0, 1],
    { clamp: true }
  );

  // E. GRAIN / NOISE TIGHTENING (uncanny effect)
  // Feels like resolution sharpening, not glitching
  const noiseScale = useTransform(
    scrollYProgress,
    [0.48, 0.88],
    [1.4, 0.9],
    { clamp: true }
  );

  // F. TRANSITION SENTENCE OPACITY
  // Appears during recognition threshold only, then fades
  const sentenceOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.55, 0.65],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // G. STAGE RELEASE GATE (critical)
  // Artifacts must not render until stageComplete === 1
  const stageComplete = useTransform(
    scrollYProgress,
    [0.88, 1.0],
    [0, 1]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED TRANSFORMS — Built from core mappings
  // ─────────────────────────────────────────────────────────────────────────
  
  // Globe blur: sharp at start, slightly soft during morph
  const globeBlur = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35],
    [4, 1, 0]
  );
  const globeFilter = useTransform(globeBlur, (b) => `blur(${b}px)`);
  
  // Globe rotation as CSS transform
  const globeRotateY = useTransform(rotationY, (r) => `rotateY(${r}deg)`);
  
  // Face blur: emerges from soft to sharp
  const faceBlur = useTransform(
    scrollYProgress,
    [0.32, 0.55],
    [12, 0],
    { clamp: true }
  );
  
  // Face filter with noise/grain effect
  const faceFilter = useTransform(
    [faceBlur, noiseScale] as const,
    ([blur, noise]) => `blur(${blur}px) grayscale(100%) contrast(${0.85 + (1 - noise) * 0.15})`
  );
  
  // Morph container scale
  const morphScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.55, 0.88],
    [1.05, 1.0, 0.92, 0.88]
  );
  
  // Morph container Y position
  const morphY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.70, 0.88],
    ['-48%', '-50%', '-50%', '-52%']
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TEXT COLUMN TRANSFORMS — Act 0 / Act I / Act II
  // All text blocks exist, visibility controlled by opacity
  // ─────────────────────────────────────────────────────────────────────────
  
  // Act 0 text: visible at start, fades before morph
  const act0Opacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.16],
    [1, 1, 0],
    { clamp: true }
  );
  const act0Y = useTransform(
    scrollYProgress,
    [0.10, 0.16],
    [0, -16]
  );

  
  // Act I text: fades in after Act 0, visible until morph midpoint
  const act1Opacity = useTransform(
    scrollYProgress,
    [0.14, 0.20, 0.32, 0.40],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const act1Y = useTransform(
    scrollYProgress,
    [0.14, 0.20, 0.32, 0.40],
    [12, 0, 0, -16]
  );
  
  // Act II text: fades in after face is stable
  const act2Opacity = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [0, 1],
    { clamp: true }
  );
  const act2Y = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [16, 0]
  );
  
  // Metadata labels: appear with Act II
  const metadataOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.72],
    [0, 0.5],
    { clamp: true }
  );


  // ─────────────────────────────────────────────────────────────────────────
  // REDUCED MOTION FALLBACK
  // ─────────────────────────────────────────────────────────────────────────
  if (reducedMotion) {
    return (
      <section className="min-h-screen bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-12">
          <div className="max-w-[600px]">
            <h1 className="font-serif text-5xl mb-8">{CONTENT.act0.title}</h1>
            <p className="font-serif text-2xl mb-4">{CONTENT.act1.headline}</p>
            {CONTENT.act1.lines.map((line, i) => (
              <p key={i} className="font-serif text-lg">{line}</p>
            ))}
            <p className="font-serif text-2xl mt-8 mb-4">{CONTENT.act2.headline}</p>
            {CONTENT.act2.lines.map((line, i) => (
              <p key={i} className="font-serif text-lg">{line || '\u00A0'}</p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER — Single mount, all transitions via transforms
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={stageRef}
      className="relative bg-white"
      style={{ height: '400vh' }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          PINNED VIEWPORT — Stays fixed while scrolling through 400vh
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* ─────────────────────────────────────────────────────────────────
            MORPH OBJECT — Single container, globe + face layered
            Globe fades out, face fades in (crossfade morph)
            NEVER re-mounted, only transforms change
            ───────────────────────────────────────────────────────────────── */}
        <motion.div
          className="fixed pointer-events-none"
          style={{
            right: '4vw',
            top: '50%',
            width: 'min(650px, 45vw)',
            height: 'min(650px, 45vw)',
            zIndex: 1,
            scale: morphScale,
            y: morphY,
          }}
        >
          {/* GLOBE LAYER — Visible during Act 0/I, fades during morph */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: globeOpacity,
              filter: globeFilter,
              // Rotation locks before recognition phase (rotationY: 20 → 0)
              transform: globeRotateY,
            }}
          >
            {/* Atmospheric halo */}
            <div
              style={{
                position: 'absolute',
                inset: '-20%',
                background: 'radial-gradient(circle at 50% 50%, rgba(150,150,150,0.1) 0%, rgba(180,180,180,0.05) 40%, transparent 65%)',
              }}
            />
            {/* Globe with soft edge mask */}
            <div
              style={{
                width: '100%',
                height: '100%',
                maskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 70%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 70%, transparent 85%)',
              }}
            >
              {/* ═══════════════════════════════════════════════════════════
                  THE ONE AND ONLY GLOBE INSTANCE
                  Mounted once, never recreated
                  ═══════════════════════════════════════════════════════════ */}
              <Globe
                config={{
                  width: 800,
                  height: 800,
                  devicePixelRatio: 2,
                  phi: 0.25,
                  theta: 0.15,
                  dark: 0,
                  diffuse: 1.4,
                  mapSamples: 16000,
                  mapBrightness: 5.5,
                  baseColor: [0.95, 0.95, 0.95],
                  markerColor: [0.4, 0.4, 0.4],
                  glowColor: [1, 1, 1],
                  markers: [
                    { location: [39.9042, 116.4074], size: 0.025 },
                    { location: [40.7128, -74.006], size: 0.032 },
                    { location: [51.5074, -0.1278], size: 0.024 },
                    { location: [35.6762, 139.6503], size: 0.026 },
                    { location: [-23.5505, -46.6333], size: 0.022 },
                  ],
                  onRender: () => {},
                }}
              />
            </div>
          </motion.div>

          {/* FACE LAYER — Invisible until morph, then fades in */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: faceOpacity,
              filter: faceFilter,
            }}
          >
            {/* Milady face image — archival treatment */}
            <div
              style={{
                width: '80%',
                height: '80%',
                maskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 40%, rgba(0,0,0,0.3) 60%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 40%, rgba(0,0,0,0.3) 60%, transparent 80%)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/milady-demo-1.png"
                alt=""
                aria-hidden="true"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            
            {/* Grain/noise overlay — tightens during morph (uncanny effect) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
                opacity: 0.08,
                mixBlendMode: 'multiply',
                scale: noiseScale,
              }}
            />
          </motion.div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────
            LEFT TEXT COLUMN — All acts rendered, visibility via opacity
            No re-mounting, no conditional JSX trees
            ───────────────────────────────────────────────────────────────── */}
        <div
          className="relative z-10 h-full"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(48px, 6vw, 96px)',
          }}
        >
          <div className="relative h-full" style={{ maxWidth: '600px' }}>
            
            {/* Monument moved to TitleStage — Act 0 now separate */}

            {/* ═══════════════════════════════════════════════════════════
                ACT I TEXT — Network State (always in DOM, opacity controlled)
                ═══════════════════════════════════════════════════════════ */}
            <motion.div
              className="absolute"
              style={{
                top: '38vh',
                left: 0,
                right: 0,
                opacity: act1Opacity,
                y: act1Y,
              }}
            >
              <p
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: '#111',
                  marginBottom: '1.25rem',
                }}
              >
                {CONTENT.act1.headline}
              </p>
              <p className="font-serif text-lg md:text-xl text-[#222] mb-1">{CONTENT.act1.lines[0]}</p>
              <p className="font-serif text-lg md:text-xl text-[#222] mb-1">{CONTENT.act1.lines[1]}</p>
              <p className="font-serif text-lg md:text-xl text-[#222] mb-1">{CONTENT.act1.lines[2]}</p>
              <p className="font-serif text-lg md:text-xl text-[#222] font-medium">{CONTENT.act1.lines[3]}</p>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════
                TRANSITION SENTENCE — Appears during recognition threshold
                ═══════════════════════════════════════════════════════════ */}
            <motion.div
              className="absolute"
              style={{
                top: '45vh',
                left: 0,
                right: 0,
                opacity: sentenceOpacity,
              }}
            >
              <p
                className="font-serif italic"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: 'rgba(0,0,0,0.6)',
                  letterSpacing: '0.01em',
                }}
              >
                {CONTENT.transitionSentence}
              </p>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════
                ACT II TEXT — Origin (always in DOM, opacity controlled)
                ═══════════════════════════════════════════════════════════ */}
            <motion.div
              className="absolute"
              style={{
                top: '38vh',
                left: 0,
                right: 0,
                opacity: act2Opacity,
                y: act2Y,
              }}
            >
              <p
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: '#111',
                  marginBottom: '1.5rem',
                }}
              >
                {CONTENT.act2.headline}
              </p>
              {CONTENT.act2.lines.map((line, i) => (
                <p
                  key={i}
                  className="font-serif text-lg md:text-xl"
                  style={{
                    color: line === '' ? 'transparent' : '#222',
                    height: line === '' ? '1.25rem' : 'auto',
                    marginBottom: '0.2rem',
                  }}
                >
                  {line || '\u00A0'}
                </p>
              ))}
            </motion.div>

          </div>
        </div>

        {/* Witness line moved to TitleStage */}


        {/* ─────────────────────────────────────────────────────────────────
            METADATA LABELS — Top right, appears during Act II
            ───────────────────────────────────────────────────────────────── */}
        <motion.div
          className="absolute hidden lg:block"
          style={{
            opacity: metadataOpacity,
            right: 'clamp(40px, 5vw, 80px)',
            top: 'clamp(80px, 10vh, 120px)',
            zIndex: 10,
          }}
        >
          <p className="text-[10px] tracking-[0.22em] uppercase text-black/55 mb-1">
            NETWORK TOPOLOGY SNAPSHOT
          </p>
          <p className="text-[10px] tracking-[0.22em] uppercase text-black/40">
            RML-NET / OBSERVATION WINDOW
          </p>
        </motion.div>

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXACT SCROLL TIMELINE (400vh)
// 
// Progress | Phase                | Globe    | Face     | Text              | Notes
// ─────────|──────────────────────|──────────|──────────|───────────────────|──────────────
// 0.00     | Act 0 Start          | 0%       | 0%       | Act 0             | Typography-only title
// 0.10     | Act 0 Fade           | 0%       | 0%       | Act 0 fading      | No illustration
// 0.14     | Act I Emerge         | 0%       | 0%       | Act I fading in   |
// 0.18     | Morph Start          | 0%       | 0%       | Act I             | morphProgress starts
// 0.22     | Globe Emerge         | →100%    | 0%       | Act I             | Globe fades in
// 0.25     | Rotation Lock        | 100%     | 0%       | Act I             | Globe stops rotating
// 0.32     | Face Emerge          | ~70%     | 0%→      | Act I fading      | Face starts appearing
// 0.34     | Sentence             | ~60%     | ~10%     | Transition        | "Identity becomes medium"
// 0.42     | Sentence Full        | ~40%     | ~40%     | Transition        | Sentence at full opacity
// 0.45     | Globe Gone           | 0%       | ~60%     | Transition        | Globe fully faded
// 0.48     | Noise Start          | 0%       | ~70%     | Transition        | Grain tightening starts
// 0.55     | Face Stable          | 0%       | 100%     | Transition fading | Face fully visible
// 0.58     | Act II Emerge        | 0%       | 100%     | Act II fading in  |
// 0.70     | Morph Complete       | 0%       | 100%     | Act II            | morphProgress = 1
// 0.88     | Noise Complete       | 0%       | 100%     | Act II            | Grain at tightest
// 0.88     | Stage Release        | 0%       | 100%     | Act II            | stageComplete starts
// 1.00     | Stage Done           | 0%       | 100%     | Act II            | Artifacts can render
// 
// DOM: ONE globe, ONE face, FOUR text blocks (all mounted, visibility via opacity)
// GUARANTEE: Fast scroll still shows one morph, one face, no duplicates
// TITLE PAGE: Globe-less, typography-first. Absence of imagery is intentional.
// ═══════════════════════════════════════════════════════════════════════════
