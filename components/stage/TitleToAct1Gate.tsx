'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { RemiliaWordmark } from '@/components/RemiliaWordmark';

// ═══════════════════════════════════════════════════════════════════════════
// TITLE TO ACT I GATE — Imageless Pinned Transition
// 
// CRITICAL RULES:
// 1. Both layers MUST be position: absolute inside the sticky frame
// 2. No layout changes during scroll — only opacity + transform
// 3. No margin/padding that can cause reflow
// 4. Act I opacity MUST be exactly 0 until the handoff point
// 
// PHASES (tight, no overlap):
// 0.00–0.28: Title stable (opacity 1)
// 0.28–0.45: Title fades out (opacity 1→0)
// 0.45–0.50: Dead zone (both invisible)
// 0.50–0.65: Act I fades in (opacity 0→1)
// 0.65–1.00: Act I stable
// ═══════════════════════════════════════════════════════════════════════════

interface TitleToAct1GateProps {
  /** Title content - can be a node or render function that receives scroll progress */
  titleNode: ReactNode | ((scrollProgress: MotionValue<number>) => ReactNode);
  actNode: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG OVERLAY — Shows scroll progress (remove in production)
// ─────────────────────────────────────────────────────────────────────────────
function DebugOverlay({ progress }: { progress: MotionValue<number> }) {
  const displayProgress = useTransform(progress, (p) => p.toFixed(3));
  
  return (
    <motion.div 
      className="fixed top-4 left-4 z-[9999] text-xs bg-black text-white px-2 py-1 rounded font-mono"
    >
      p: <motion.span>{displayProgress}</motion.span>
    </motion.div>
  );
}

export function TitleToAct1Gate({ titleNode, actNode }: TitleToAct1GateProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const p = scrollYProgress;

  // ═══════════════════════════════════════════════════════════════════════════
  // TITLE TRANSFORMS — Fades out first
  // 0.00–0.28: Stable (opacity 1)
  // 0.28–0.45: Fade out (opacity 1→0)
  // 0.45+: Gone (opacity 0)
  // ═══════════════════════════════════════════════════════════════════════════
  const titleOpacity = useTransform(p, [0, 0.28, 0.45], [1, 0.85, 0]);
  const titleY = useTransform(p, [0.28, 0.45], [0, -12]);
  const titleScale = useTransform(p, [0.28, 0.45], [1, 0.98]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ACT I TRANSFORMS — Fades in after title is gone, fully visible quickly
  // 0.00–0.46: Hidden (opacity EXACTLY 0)
  // 0.46–0.52: Fade in (opacity 0→1) — quick, decisive
  // 0.52+: Stable (opacity 1) — fully visible for rest of gate
  // ═══════════════════════════════════════════════════════════════════════════
  const actOpacity = useTransform(p, [0.46, 0.52], [0, 1]);
  const actY = useTransform(p, [0.46, 0.52], [6, 0]);
  const actScale = useTransform(p, [0.46, 0.52], [0.998, 1]);

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKGROUND — Subtle dimming during transition
  // ═══════════════════════════════════════════════════════════════════════════
  const bgDim = useTransform(p, [0.28, 0.45, 0.55], [0, 0.02, 0]);

  return (
    <>
      {/* Debug overlay — remove after fixing */}
      <DebugOverlay progress={p} />

      <section
        ref={sectionRef}
        className="relative bg-white"
        style={{ height: '200vh' }}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            STICKY CONTAINER — 100vh pinned viewport
            All content layers MUST be position: absolute inside this
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="sticky top-0 h-screen overflow-hidden">
          
          {/* ─────────────────────────────────────────────────────────────────
              BACKGROUND LAYER — Base white, always present
              ───────────────────────────────────────────────────────────────── */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: '#ffffff' }}
          />
          
          {/* ─────────────────────────────────────────────────────────────────
              DIM OVERLAY — Subtle darken during handoff
              ───────────────────────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: '#000000',
              opacity: bgDim,
            }}
            aria-hidden="true"
          />

          {/* ─────────────────────────────────────────────────────────────────
              TITLE LAYER — Dominant initially, fades out first
              MUST be absolute inset-0
              ───────────────────────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: titleOpacity,
              y: titleY,
              scale: titleScale,
              willChange: 'transform, opacity',
            }}
          >
            {typeof titleNode === 'function' ? titleNode(p) : titleNode}
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────────
              ACT I LAYER — Hidden until 0.50, then fades in
              MUST be absolute inset-0
              ───────────────────────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: actOpacity,
              y: actY,
              scale: actScale,
              willChange: 'transform, opacity',
            }}
          >
            {actNode}
          </motion.div>

        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT TITLE CONTENT — "Baseline Fracture" Title Page
// 
// DESIGN INTENT:
// - Subtly uncanny, unresolved, but still elegant
// - Clean empty field + oversized wordmark that fractures at syllable boundaries
// - Must NOT look like a logo mock in a corner
// 
// FRACTURE MECHANICS (via RemiliaWordmark):
// - Same serif font for all syllables
// - Baseline offsets: RE(0px), MIL(-2px), IA(+2px)
// - Asymmetric gaps: 0.18em after RE, 0.30em after MIL
// - IA opacity: 0.86 → 0.94 on scroll (micro-resolve)
// 
// LAYOUT:
// - Wordmark: bottom-left QUADRANT anchor (not edge-flush)
//   - Left: clamp(72px, 10vw, 180px)
//   - Bottom: clamp(96px, 12vh, 220px)
// - Counterweight: top-right status line
//   - Right: clamp(72px, 10vw, 180px)
//   - Top: clamp(40px, 6vh, 96px)
// 
// The page should feel like a system, but still minimal.
// ═══════════════════════════════════════════════════════════════════════════

interface DefaultTitleContentProps {
  /** Optional scroll progress for IA micro-resolve (0.86 → 0.94) */
  scrollProgress?: MotionValue<number>;
}

export function DefaultTitleContent({ scrollProgress }: DefaultTitleContentProps = {}) {
  return (
    <div className="absolute inset-0 p-0 m-0">
      {/* ─────────────────────────────────────────────────────────────────
          COUNTERWEIGHT — Top-right status line
          
          Single tiny text line that makes the page feel "like a system"
          Position: top-right quadrant anchor
          ───────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(72px, 10vw, 180px)',
          top: 'clamp(40px, 6vh, 96px)',
          fontFamily: 'var(--font-meta), Inter, system-ui, sans-serif',
          fontSize: 'clamp(11px, 1vw, 12px)',
          fontWeight: 400,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(0, 0, 0, 0.35)',
        }}
      >
        In formation · 2026 · 45.2892°N
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          WORDMARK — Bottom-left quadrant placement
          
          Position anchored to invisible grid, not viewport edge.
          - left: clamp(72px, 10vw, 180px)
          - bottom: clamp(96px, 12vh, 220px)
          - font-size: clamp(84px, 12vw, 176px)
          ───────────────────────────────────────────────────────────────── */}
      <h1
        style={{
          position: 'absolute',
          left: 'clamp(72px, 10vw, 180px)',
          bottom: 'clamp(96px, 12vh, 220px)',
          margin: 0,
          padding: 0,
          fontSize: 'clamp(84px, 12vw, 176px)',
        }}
      >
        <RemiliaWordmark scrollProgress={scrollProgress} />
      </h1>
    </div>
  );
}

// Render function version for use with TitleToAct1Gate
export const createTitleContent = (scrollProgress: MotionValue<number>) => (
  <DefaultTitleContent scrollProgress={scrollProgress} />
);

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT ACT I CONTENT — Simple intro (NOT the full copy)
// The full Act1Copy comes AFTER this gate in a separate section
// Position: absolute, centered
// ═══════════════════════════════════════════════════════════════════════════
export function DefaultActContent() {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="text-center">
        <p
          className="uppercase tracking-[0.15em] text-xs text-neutral-500 mb-4"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          Act I
        </p>
        <h2
          className="text-5xl md:text-6xl leading-[1.0] tracking-tight text-neutral-900"
          style={{ fontFamily: 'var(--font-editorial)' }}
        >
          A network state
        </h2>
        <p
          className="uppercase tracking-[0.12em] text-xs text-neutral-400 mt-6"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          In formation
        </p>
      </div>
    </div>
  );
}
