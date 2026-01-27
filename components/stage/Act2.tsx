'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// ACT II — Articulation (Essay-Like Scroll)
//
// Calm, readable, accumulative. Each paragraph fades in and HOLDS (no fade-out).
// The act builds meaning as you scroll.
//
// TIMING (normalized 0→1):
// - Each paragraph fades in over ~0.06 progress
// - Starts ~0.10 after the previous
// - Once visible, stays visible
//
// p1 S=0.06  | p2 S=0.16 | p3 S=0.26 | p4 S=0.36
// p5 S=0.46  | p6 S=0.56 | p7 S=0.66 | p8 S=0.76
// ═══════════════════════════════════════════════════════════════════════════

const PARAGRAPHS = [
  "Remilia is not just a project. It is a shared belief system that formed online.",
  "The internet allowed people with similar instincts to find each other before they had to explain themselves. This mattered more than scale.",
  "Aesthetic came before ideology. Taste came before argument.",
  "What looked like art was often a way of signaling alignment. Images, language, and humor became a shared shorthand.",
  "Over time, this coherence began to function like structure. People recognized who was inside and who was not.",
  "This was not planned. It emerged from participation.",
  "Remilia treats art as something closer to infrastructure than expression. A medium for coordination rather than persuasion.",
  "This is why it resists traditional organizational language. The belief came first. The form followed.",
];

export function Act2() {
  const act2Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: act2Ref,
    offset: ['start start', 'end end'],
  });

  // ─────────────────────────────────────────────────────────────────────────
  // OPACITY TRANSFORMS — Each paragraph fades in and holds
  // ─────────────────────────────────────────────────────────────────────────
  const o1 = useTransform(scrollYProgress, [0.06, 0.12], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.16, 0.22], [0, 1]);
  const o3 = useTransform(scrollYProgress, [0.26, 0.32], [0, 1]);
  const o4 = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  const o5 = useTransform(scrollYProgress, [0.46, 0.52], [0, 1]);
  const o6 = useTransform(scrollYProgress, [0.56, 0.62], [0, 1]);
  const o7 = useTransform(scrollYProgress, [0.66, 0.72], [0, 1]);
  const o8 = useTransform(scrollYProgress, [0.76, 0.82], [0, 1]);

  const opacities = [o1, o2, o3, o4, o5, o6, o7, o8];

  return (
    <div
      ref={act2Ref}
      className="relative bg-white"
      style={{ height: 'clamp(520vh, 560vh, 600vh)' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full">
          {/* Left-offset column like Act I */}
          <div
            className="space-y-8 md:space-y-10"
            style={{
              maxWidth: '58ch',
              marginLeft: '12vw',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              fontSize: '18px',
              lineHeight: 1.75,
              color: '#262626',
              fontFamily: 'var(--font-editorial)',
            }}
          >
            {PARAGRAPHS.map((text, i) => (
              <motion.p
                key={i}
                style={{
                  opacity: opacities[i],
                  willChange: 'opacity',
                }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Act2;
