'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// ACT III — Manifestation (Archival Insert Layout)
//
// Single text column like Act II. The image appears as an "archival insert"
// overlay — evidence that briefly appears, then fades so focus returns to text.
//
// NOT a landing page module. Feels like reading, then artifact, then reading.
//
// TIMING:
// p1 S=0.06 | p2 S=0.14
// p3 S=0.26 | p4 S=0.36
// Insert: 0.45→0.52 fade in, 0.70→0.78 fade out
// p5 S=0.58 | p6 S=0.72
// ═══════════════════════════════════════════════════════════════════════════

export function Act3() {
  const act3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: act3Ref,
    offset: ['start start', 'end end'],
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PARAGRAPH OPACITY TRANSFORMS — Fade in and hold
  // ─────────────────────────────────────────────────────────────────────────
  const o1 = useTransform(scrollYProgress, [0.06, 0.12], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.14, 0.20], [0, 1]);
  const o3 = useTransform(scrollYProgress, [0.26, 0.32], [0, 1]);
  const o4 = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  const o5 = useTransform(scrollYProgress, [0.58, 0.64], [0, 1]);
  const o6 = useTransform(scrollYProgress, [0.72, 0.78], [0, 1]);

  // ─────────────────────────────────────────────────────────────────────────
  // INSERT (ARCHIVAL) TRANSFORMS — Appears after p3, fades before final lines
  // ─────────────────────────────────────────────────────────────────────────
  const insertOpacity = useTransform(
    scrollYProgress, 
    [0.45, 0.52, 0.70, 0.78], 
    [0, 1, 1, 0]
  );
  const insertY = useTransform(
    scrollYProgress, 
    [0.45, 0.52, 0.70, 0.78], 
    [8, 0, 0, 10]
  );

  return (
    <div
      ref={act3Ref}
      className="relative bg-white"
      style={{ height: 'clamp(480vh, 500vh, 520vh)' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full">
          
          {/* ═══════════════════════════════════════════════════════════════
              SINGLE TEXT COLUMN — Like Act II
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="px-6 md:px-10"
            style={{
              maxWidth: '56ch',
              marginLeft: '12vw',
              fontSize: '18px',
              lineHeight: 1.75,
              color: '#262626',
              fontFamily: 'var(--font-editorial)',
            }}
          >
            {/* GROUP 1 */}
            <motion.p style={{ opacity: o1, willChange: 'opacity' }}>
              Remilia didn't stay abstract.
            </motion.p>
            <motion.p className="mt-6" style={{ opacity: o2, willChange: 'opacity' }}>
              It produced cultural objects and social infrastructure.
            </motion.p>

            {/* SPACING BREAK */}
            <div className="mt-14" />

            {/* GROUP 2 */}
            <motion.p style={{ opacity: o3, willChange: 'opacity' }}>
              Milady Maker made an aesthetic legible at scale.
            </motion.p>
            <motion.p className="mt-6" style={{ opacity: o4, willChange: 'opacity' }}>
              RemiliaNET treated identity as portable across contexts.
            </motion.p>

            {/* MOBILE ONLY: Image inline between group 2 and group 3 */}
            <motion.div 
              className="md:hidden my-10"
              style={{ 
                opacity: insertOpacity, 
                y: insertY,
                willChange: 'opacity, transform',
              }}
            >
              <div 
                className="bg-neutral-50 rounded overflow-hidden shadow-sm"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src="/milady-demo-1.png"
                  alt="Milady Maker"
                  className="w-full h-full object-contain"
                />
              </div>
              <p 
                className="mt-3 text-[11px] text-neutral-500"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                RemiliaNET
              </p>
            </motion.div>

            {/* SPACING BREAK */}
            <div className="mt-14" />

            {/* GROUP 3 */}
            <motion.p style={{ opacity: o5, willChange: 'opacity' }}>
              These weren't side projects. They were how coherence was maintained.
            </motion.p>

            {/* FINAL LINE — Extra separation */}
            <motion.p className="mt-14" style={{ opacity: o6, willChange: 'opacity' }}>
              What began online started to behave like an institution.
            </motion.p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ARCHIVAL INSERT — Desktop only, absolute overlay
              Appears after p3, fades before final lines
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div 
            className="hidden md:block absolute pointer-events-none"
            style={{ 
              right: '8vw',
              top: '18vh',
              opacity: insertOpacity, 
              y: insertY,
              willChange: 'opacity, transform',
            }}
          >
            <div 
              className="bg-white rounded shadow-lg p-3"
              style={{ width: 'clamp(360px, 28vw, 420px)' }}
            >
              <div 
                className="bg-neutral-50 rounded-sm overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src="/milady-demo-1.png"
                  alt="Milady Maker"
                  className="w-full h-full object-contain"
                />
              </div>
              <p 
                className="mt-3 text-[11px] text-neutral-500"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                RemiliaNET
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Act3;
