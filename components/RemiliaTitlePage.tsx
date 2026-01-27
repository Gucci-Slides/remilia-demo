'use client';

import React, { useRef, useState } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValueEvent,
  MotionValue 
} from 'framer-motion';
import { RemiliaRegistryWordmark } from './RemiliaRegistryWordmark';

// ═══════════════════════════════════════════════════════════════════════════
// REMILIA TITLE PAGE — "Overprint Archive"
// 
// AESTHETIC: Print ephemera / archive capture
// - Flyer grain (halftone speckle)
// - Misregistered IA duplicate in red
// - Baseline grid alignment
// - Scroll-driven mutation (not scrollytelling)
// 
// MOTION SPEC (scroll progress p = 0 → 1):
// - p = 0.00:       Initial state (wordmark + metadata visible)
// - p = 0.15→0.45:  Pressure increases (red IA strengthens, metadata clears)
// - p = 0.45→0.75:  Handoff (wordmark exits, narrative enters)
// - p = 0.75→1.00:  Settle (stable, no extra motion)
// 
// COLOR: REMILIA RED #E10600 (ink behavior, multiply blend)
// ═══════════════════════════════════════════════════════════════════════════

const REMILIA_RED = '#E10600';

// Narrative lines (exact text, line breaks matter)
const NARRATIVE_LINES = [
  'Remilia started online.',
  'It became a matter of record.',
  'Identity turned portable.',
  'The interface became the institution.',
] as const;

// Which word gets red intrusion (index in line, word)
const RED_WORD = { lineIndex: 1, word: 'record' };

export function RemiliaTitlePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  
  // Scroll progress (0 → 1 across 200vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track grain intensity for CSS class toggle
  const [grainIntensity, setGrainIntensity] = useState<'normal' | 'high'>('normal');
  
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Increase grain between p=0.15 and p=0.45
    if (p >= 0.15 && p <= 0.45) {
      setGrainIntensity('high');
    } else {
      setGrainIntensity('normal');
    }
  });

  // ═══════════════════════════════════════════════════════════════════════
  // MOTION TRANSFORMS
  // ═══════════════════════════════════════════════════════════════════════

  // Metadata: clears by p=0.45
  const metadataOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45], [1, 1, 0]);
  const metadataY = useTransform(scrollYProgress, [0.15, 0.45], [0, -8]);

  // Wordmark: exits between p=0.45 and p=0.75
  const wordmarkOpacity = useTransform(scrollYProgress, [0.45, 0.75], [1, 0]);
  const wordmarkX = useTransform(scrollYProgress, [0.45, 0.75], [0, -120]);
  const wordmarkY = useTransform(scrollYProgress, [0.45, 0.75], [0, 40]);

  // Narrative: enters between p=0.45 and p=0.75
  const narrativeOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const narrativeY = useTransform(scrollYProgress, [0.45, 0.65], [24, 0]);

  // Misregistered IA: pressure increases between p=0.15 and p=0.45
  const iaOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0.55, 0.85]);
  const iaOffsetX = useTransform(scrollYProgress, [0.15, 0.45], [4, 7]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '200vh' }}
      data-show-grid={showGrid}
    >
      {/* ════════════════════════════════════════════════════════════════
          STICKY VIEWPORT CONTAINER
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ backgroundColor: 'var(--archive-paper, #F3EEE6)' }}
      >
        {/* ══════════════════════════════════════════════════════════════
            TEXTURE LAYERS
        ══════════════════════════════════════════════════════════════ */}
        
        {/* Flyer grain overlay */}
        <div 
          className="flyer-grain-overlay"
          data-intensity={grainIntensity}
          aria-hidden="true"
        />
        
        {/* Vignette (scanned paper edge) */}
        <div className="archive-vignette" aria-hidden="true" />
        
        {/* Baseline grid debug (dev toggle) */}
        <div className="baseline-grid-debug" aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════════
            METADATA — Top corners (stamp text)
            Clears by p=0.45
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="fixed z-10"
          style={{
            opacity: metadataOpacity,
            y: metadataY,
          }}
        >
          {/* Top-left */}
          <div
            className="fixed stamp-text"
            style={{
              top: 'calc(var(--baseline) * 3)',
              left: 'var(--archive-left)',
            }}
          >
            <div>Archive Status: Active</div>
            <div style={{ marginTop: 'var(--baseline)' }}>Version 0.1</div>
          </div>

          {/* Top-right */}
          <div
            className="fixed stamp-text text-right"
            style={{
              top: 'calc(var(--baseline) * 3)',
              right: 'var(--archive-left)',
            }}
          >
            <div>In Formation · 2026 · 45.2892°N</div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            WORDMARK — Bottom-left anchored
            Exits between p=0.45 and p=0.75
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="fixed z-10"
          style={{
            left: 'var(--archive-left)',
            bottom: 'var(--archive-bottom)',
            opacity: wordmarkOpacity,
            x: wordmarkX,
            y: wordmarkY,
          }}
        >
          <RemiliaRegistryWordmark
            scrollProgress={scrollYProgress}
            iaOpacity={iaOpacity}
            iaOffsetX={iaOffsetX}
          />
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            NARRATIVE — Enters as wordmark exits
            Same left anchor, aligned to baseline grid
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="fixed z-20"
          style={{
            left: 'var(--archive-left)',
            bottom: 'var(--archive-bottom)',
            opacity: narrativeOpacity,
            y: narrativeY,
          }}
        >
          <div className="narrative-text">
            {NARRATIVE_LINES.map((line, i) => (
              <NarrativeLine
                key={i}
                line={line}
                index={i}
                scrollProgress={scrollYProgress}
                isRedLine={i === RED_WORD.lineIndex}
                redWord={RED_WORD.word}
              />
            ))}
          </div>
        </motion.div>

        {/* Dev: Grid toggle (remove in production) */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="fixed bottom-4 right-4 z-50 stamp-text opacity-30 hover:opacity-60 transition-opacity"
          style={{ fontSize: '9px' }}
        >
          {showGrid ? 'GRID: ON' : 'GRID: OFF'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NARRATIVE LINE — Individual line with stagger and red word intrusion
// ═══════════════════════════════════════════════════════════════════════════

interface NarrativeLineProps {
  line: string;
  index: number;
  scrollProgress: MotionValue<number>;
  isRedLine: boolean;
  redWord: string;
}

function NarrativeLine({ 
  line, 
  index, 
  scrollProgress, 
  isRedLine, 
  redWord 
}: NarrativeLineProps) {
  // Stagger each line by 0.05p
  const staggerStart = 0.45 + index * 0.05;
  const staggerEnd = 0.65 + index * 0.05;
  
  const lineOpacity = useTransform(
    scrollProgress, 
    [staggerStart, staggerEnd], 
    [0, 1]
  );
  const lineY = useTransform(
    scrollProgress, 
    [staggerStart, staggerEnd], 
    [24, 0]
  );

  // Render line with red word if applicable
  const renderLine = () => {
    if (!isRedLine) return line;

    // Split and highlight the red word
    const parts = line.split(new RegExp(`(${redWord})`, 'i'));
    return parts.map((part, i) => {
      if (part.toLowerCase() === redWord.toLowerCase()) {
        return (
          <span 
            key={i} 
            className="ink-red"
            style={{ 
              color: REMILIA_RED,
              position: 'relative',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.p
      style={{
        opacity: lineOpacity,
        y: lineY,
        marginTop: index > 0 ? 'calc(var(--baseline) * 1.5)' : 0,
      }}
    >
      {renderLine()}
    </motion.p>
  );
}

export default RemiliaTitlePage;
