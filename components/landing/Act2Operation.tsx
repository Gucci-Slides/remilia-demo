'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRhythm, spacing } from '@/lib/landing/RhythmContext';
import { getBeatOpacityRange } from '@/lib/landing/rhythm';

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface Beat {
  id: string;
  lines: string[];
}

interface Act2OperationProps {
  onOpenIndex?: (options?: { query?: string; category?: string }) => void;
}

// ─────────────────────────────────────────────────────────────────
// BEAT DATA
// ─────────────────────────────────────────────────────────────────

const BEATS: Beat[] = [
  { id: 'beat-1', lines: ['REMILIA IS NOT A PLATFORM.'] },
  { id: 'beat-2', lines: ['It is a distributed cultural system.'] },
  { id: 'beat-3', lines: ['A system where identities are produced,', 'indexed, and recirculated across networks.'] },
  { id: 'beat-4', lines: ['No single author.', 'No central feed.', 'No final form.'] },
  { id: 'beat-5', lines: ['Remilia does not create culture.'] },
  { id: 'beat-6', lines: ['It registers what already exists.'] },
  { id: 'beat-7', lines: ['Artifacts are cataloged.', 'Signals are preserved.', 'Lineages are made legible.'] },
  { id: 'beat-8', lines: ['Meaning is not assigned.'] },
  { id: 'beat-9', lines: ['It emerges through use,', 'context,', 'and repetition.'] },
  { id: 'beat-10', lines: ['To participate is to be observed.'] },
  { id: 'beat-11', lines: ['To be observed is not to be owned.'] },
  { id: 'beat-12', lines: ['Remilia persists as a record', 'of collective presence.'] },
];

// SEE ALSO triggers - placed after specific beats
const SEE_ALSO_TRIGGERS: Record<string, { label: string; category: string }> = {
  'beat-4': { label: 'DIGITAL INNOVATION', category: 'DIGITAL INNOVATION' },
  'beat-7': { label: 'CORPORATE LITERATURE', category: 'CORPORATE LITERATURE' },
  'beat-12': { label: 'ENTERPRISE SOLUTIONS', category: 'ENTERPRISE SOLUTIONS' },
};

// ─────────────────────────────────────────────────────────────────
// BEAT COMPONENT
// ─────────────────────────────────────────────────────────────────

interface BeatBlockProps {
  beat: Beat;
  index: number;
  totalBeats: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  reducedMotion: boolean;
  seeAlso?: { label: string; category: string };
  onSeeAlso?: (category: string) => void;
}

function BeatBlock({ 
  beat, 
  index, 
  totalBeats, 
  scrollProgress, 
  reducedMotion,
  seeAlso,
  onSeeAlso,
}: BeatBlockProps) {
  const range = getBeatOpacityRange(index, totalBeats);
  
  // Transform scroll progress to opacity
  const opacity = useTransform(
    scrollProgress,
    [range.start, range.fadeIn, range.holdEnd, range.end],
    reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0]
  );

  // Transform scroll progress to Y position (6px drift)
  const y = useTransform(
    scrollProgress,
    [range.start, (range.start + range.end) / 2, range.end],
    reducedMotion ? [0, 0, 0] : [6, 0, -2]
  );

  if (reducedMotion) {
    return (
      <div style={{ marginBottom: `${spacing.u4 * 4}px` }}>
        {beat.lines.map((line, idx) => (
          <div key={idx} className="role-body">
            {line}
          </div>
        ))}
        {seeAlso && onSeeAlso && (
          <button
            onClick={() => onSeeAlso(seeAlso.category)}
            className="role-reference hover:opacity-60 transition-opacity group"
            style={{ marginTop: `${spacing.u3}px`, opacity: 0.4 }}
          >
            SEE ALSO: {seeAlso.label}
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ opacity, y }}
    >
      {beat.lines.map((line, idx) => (
        <div key={idx} className="role-body">
          {line}
        </div>
      ))}
      {seeAlso && onSeeAlso && (
        <button
          onClick={() => onSeeAlso(seeAlso.category)}
          className="role-reference hover:opacity-60 transition-opacity group pointer-events-auto"
          style={{ marginTop: `${spacing.u3}px`, opacity: 0.4 }}
        >
          SEE ALSO: {seeAlso.label}
          <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
        </button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export function Act2Operation({ onOpenIndex }: Act2OperationProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { layout } = useRhythm();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const handleSeeAlso = (category: string) => {
    onOpenIndex?.({ category });
  };

  // ─────────────────────────────────────────────────────────────────
  // REDUCED MOTION FALLBACK
  // ─────────────────────────────────────────────────────────────────

  if (reducedMotion) {
    return (
      <section
        id="act-2"
        style={{ 
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          paddingTop: `${spacing.u8 * 3}px`,
          paddingBottom: `${spacing.u8 * 5}px`,
        }}
      >
        <div 
          className={layout?.isMobile ? 'mx-auto text-center' : ''}
          style={{ 
            maxWidth: layout?.isMobile ? 'var(--measure-sm)' : 'var(--measure-lg)',
            paddingLeft: layout?.isMobile ? `${spacing.u3}px` : undefined,
            paddingRight: layout?.isMobile ? `${spacing.u3}px` : undefined,
            marginLeft: layout?.isMobile ? 'auto' : `${layout?.spineA_x ?? spacing.u8 * 3}px`,
          }}
        >
          {BEATS.map((beat, index) => (
            <BeatBlock
              key={beat.id}
              beat={beat}
              index={index}
              totalBeats={BEATS.length}
              scrollProgress={scrollYProgress}
              reducedMotion={true}
              seeAlso={SEE_ALSO_TRIGGERS[beat.id]}
              onSeeAlso={handleSeeAlso}
            />
          ))}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // ANIMATED VERSION
  // ─────────────────────────────────────────────────────────────────

  return (
    <section
      ref={containerRef}
      id="act-2"
      style={{ 
        height: '400vh',
        backgroundColor: 'var(--background)',
      }}
    >
      {/* Sticky container */}
      <div 
        className="sticky top-0 h-screen flex items-center pointer-events-none"
      >
        {/* Text column — aligned to spine A on desktop, centered on mobile */}
        <div 
          className={`relative ${layout?.isMobile ? 'mx-auto text-center' : ''}`}
          style={{ 
            maxWidth: layout?.isMobile ? 'var(--measure-sm)' : 'var(--measure-lg)',
            paddingLeft: layout?.isMobile ? `${spacing.u3}px` : undefined,
            paddingRight: layout?.isMobile ? `${spacing.u3}px` : undefined,
            marginLeft: layout?.isMobile ? 'auto' : `${layout?.spineA_x ?? spacing.u8 * 3}px`,
            height: `${spacing.u8 * 4}px`, // Container height for absolute children
          }}
        >
          {BEATS.map((beat, index) => (
            <BeatBlock
              key={beat.id}
              beat={beat}
              index={index}
              totalBeats={BEATS.length}
              scrollProgress={scrollYProgress}
              reducedMotion={false}
              seeAlso={SEE_ALSO_TRIGGERS[beat.id]}
              onSeeAlso={handleSeeAlso}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
