'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// ACT I COPY — 3-Line Scroll Manifesto (Final)
//
// Each line = one scroll beat
// Lines do not overlap meaningfully
// Each line gets: entrance → hold → exit
// Last line holds (no exit) → hands off to Act II
//
// Timeline (normalized progress):
// Line 1: 0.00→0.12 enter | 0.12→0.28 hold | 0.28→0.38 exit
// Line 2: 0.32→0.44 enter | 0.44→0.60 hold | 0.60→0.70 exit
// Line 3: 0.64→0.76 enter | 0.76→1.00 hold | — no exit
// ═══════════════════════════════════════════════════════════════════════════

export function Act1Copy() {
  const act1Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: act1Ref,
    offset: ['start start', 'end end'],
  });

  // ─────────────────────────────────────────────────────────────────────────
  // LINE 1: "Remilia started online."
  // ─────────────────────────────────────────────────────────────────────────
  const line1Opacity = useTransform(
    scrollYProgress, 
    [0.00, 0.12, 0.28, 0.38], 
    [0, 1, 1, 0]
  );
  const line1Y = useTransform(
    scrollYProgress, 
    [0.00, 0.12, 0.38], 
    [12, 0, -6]
  );
  const line1Blur = useTransform(
    scrollYProgress, 
    [0.00, 0.12, 0.38], 
    ['4px', '0px', '2px']
  );

  // ─────────────────────────────────────────────────────────────────────────
  // LINE 2: "It was a cultural alignment first."
  // ─────────────────────────────────────────────────────────────────────────
  const line2Opacity = useTransform(
    scrollYProgress, 
    [0.32, 0.44, 0.60, 0.70], 
    [0, 1, 1, 0]
  );
  const line2Y = useTransform(
    scrollYProgress, 
    [0.32, 0.44, 0.70], 
    [12, 0, -6]
  );
  const line2Blur = useTransform(
    scrollYProgress, 
    [0.32, 0.44, 0.70], 
    ['4px', '0px', '2px']
  );

  // ─────────────────────────────────────────────────────────────────────────
  // LINE 3: "The organization came later." (final hold, no exit)
  // ─────────────────────────────────────────────────────────────────────────
  const line3Opacity = useTransform(
    scrollYProgress, 
    [0.64, 0.76], 
    [0, 1]
  );
  const line3Y = useTransform(
    scrollYProgress, 
    [0.64, 0.76], 
    [12, 0]
  );
  const line3Blur = useTransform(
    scrollYProgress, 
    [0.64, 0.76], 
    ['4px', '0px']
  );

  return (
    <div 
      ref={act1Ref} 
      className="relative bg-white"
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full">
          <div 
            className="space-y-6"
            style={{ 
              maxWidth: '48ch',
              marginLeft: '12vw',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              fontSize: '20px',
              lineHeight: 1.6,
              color: '#171717',
              fontFamily: 'var(--font-editorial)',
            }}
          >
            <motion.p 
              style={{ 
                opacity: line1Opacity, 
                y: line1Y, 
                filter: line1Blur,
                willChange: 'transform, opacity, filter',
              }}
            >
              Remilia started online.
            </motion.p>

            <motion.p 
              style={{ 
                opacity: line2Opacity, 
                y: line2Y, 
                filter: line2Blur,
                willChange: 'transform, opacity, filter',
              }}
            >
              It was a cultural alignment first.
            </motion.p>

            <motion.p 
              style={{ 
                opacity: line3Opacity, 
                y: line3Y, 
                filter: line3Blur,
                willChange: 'transform, opacity, filter',
              }}
            >
              The organization came later.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Act1Copy;
