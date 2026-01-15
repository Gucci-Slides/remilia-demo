'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// ACT II — SLIDING SHEET FROM LEFT
// 
// A single sheet/panel that slides in from the left, becoming the primary
// reading surface. Act I becomes archived (faded, out of flow) during this.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const DOCTRINE_COPY = [
  'Remilia is an organism of culture.',
  'It survives through images, events, and software.',
  'A platform cannot hold it.',
  'A brand cannot contain it.',
  'A state cannot legislate it.',
  'So it self-constitutes.',
];

const INDEX_LINKS = [
  { label: 'Index', href: '/' },
  { label: 'Registry', href: '/registry' },
  { label: 'Events', href: '#events' },
  { label: 'Writing', href: '#writing' },
  { label: 'Releases', href: '#releases' },
  { label: 'Studio', href: '#studio' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIMING — Sheet entrance and content reveals
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_TIMING = {
  // Sheet slides in from left
  enter: { start: 0.02, end: 0.18 },
  // Content reveals (after sheet is mostly in)
  content: { start: 0.12, end: 0.28 },
  // Index links stagger
  linksStart: 0.20,
  linksEnd: 0.45,
};

// ─────────────────────────────────────────────────────────────────────────────
// SHEET COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ActIISheetProps {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

function ActIISheet({ scrollProgress, reducedMotion }: ActIISheetProps) {
  // Sheet slide-in from left
  const sheetX = useTransform(
    scrollProgress,
    [SHEET_TIMING.enter.start, SHEET_TIMING.enter.end],
    reducedMotion ? ['0%', '0%'] : ['-100%', '0%']
  );
  
  const sheetOpacity = useTransform(
    scrollProgress,
    [SHEET_TIMING.enter.start, SHEET_TIMING.enter.end * 0.6],
    reducedMotion ? [1, 1] : [0, 1]
  );
  
  // Content fade in (after sheet is in place)
  const contentOpacity = useTransform(
    scrollProgress,
    [SHEET_TIMING.content.start, SHEET_TIMING.content.end],
    reducedMotion ? [1, 1] : [0, 1]
  );
  
  const contentY = useTransform(
    scrollProgress,
    [SHEET_TIMING.content.start, SHEET_TIMING.content.end],
    reducedMotion ? [0, 0] : [16, 0]
  );

  return (
    <motion.div
      className="absolute left-0 top-0 bottom-0 z-20 flex items-center"
      style={{
        x: sheetX,
        opacity: sheetOpacity,
      }}
    >
      {/* The Sheet */}
      <div 
        className="ml-6 md:ml-12 w-[90vw] md:w-[70vw] lg:w-[62vw] max-w-[900px] bg-[#f7f7f5] border border-black/8 shadow-[0_4px_32px_rgba(0,0,0,0.04)]"
        style={{
          padding: 'clamp(32px, 5vw, 64px)',
        }}
      >
        <motion.div
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
        >
          {/* INDEX label */}
          <span className="text-[11px] tracking-[0.22em] uppercase text-black/55 block mb-6">
            INDEX
          </span>
          
          {/* Two-column layout inside sheet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Doctrine column */}
            <div className="space-y-1.5">
              {DOCTRINE_COPY.map((line, i) => (
                <p 
                  key={i} 
                  className="text-[15px] leading-snug text-black/85"
                  style={{ fontFamily: 'var(--font-editorial)' }}
                >
                  {line}
                </p>
              ))}
            </div>
            
            {/* Index links column */}
            <div>
              <nav className="space-y-0.5">
                {INDEX_LINKS.map((link, index) => (
                  <IndexLinkItem
                    key={link.label}
                    link={link}
                    index={index}
                    scrollProgress={scrollProgress}
                    reducedMotion={reducedMotion}
                    isActive={link.href === '/'}
                  />
                ))}
              </nav>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INDEX LINK ITEM
// ─────────────────────────────────────────────────────────────────────────────

interface IndexLinkItemProps {
  link: typeof INDEX_LINKS[number];
  index: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  isActive?: boolean;
}

function IndexLinkItem({ link, index, scrollProgress, reducedMotion, isActive }: IndexLinkItemProps) {
  const itemCount = INDEX_LINKS.length;
  const staggerRange = SHEET_TIMING.linksEnd - SHEET_TIMING.linksStart;
  const itemStart = SHEET_TIMING.linksStart + (index / itemCount) * staggerRange * 0.6;
  const itemEnd = itemStart + 0.08;
  
  const opacity = useTransform(
    scrollProgress,
    [itemStart, itemEnd],
    reducedMotion ? [0.7, 0.7] : [0, 0.7]
  );
  
  const y = useTransform(
    scrollProgress,
    [itemStart, itemEnd],
    reducedMotion ? [0, 0] : [4, 0]
  );

  return (
    <motion.div style={{ opacity, y }}>
      <Link 
        href={link.href}
        className="group flex items-center gap-2.5 py-1.5 transition-transform duration-150 ease-out hover:translate-x-[3px]"
      >
        <span 
          className={`h-px transition-all duration-150 ease-out ${
            isActive 
              ? 'w-5 bg-black/30' 
              : 'w-3 bg-black/18 group-hover:w-5 group-hover:bg-black/25'
          }`} 
        />
        <span 
          className="text-[12px] tracking-[0.18em] uppercase transition-opacity duration-150 group-hover:opacity-100"
          style={{ opacity: isActive ? 1 : undefined }}
        >
          {link.label}
        </span>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REDUCED MOTION FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

function ReducedMotionFallback() {
  return (
    <section className="min-h-screen bg-[var(--background)] relative flex items-center">
      <div 
        className="ml-6 md:ml-12 w-[90vw] md:w-[70vw] lg:w-[62vw] max-w-[900px] bg-[#f7f7f5] border border-black/8 shadow-[0_4px_32px_rgba(0,0,0,0.04)]"
        style={{ padding: 'clamp(32px, 5vw, 64px)' }}
      >
        <span className="text-[11px] tracking-[0.22em] uppercase text-black/55 block mb-6">
          INDEX
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-1.5">
            {DOCTRINE_COPY.map((line, i) => (
              <p key={i} className="text-[15px] leading-snug text-black/85" style={{ fontFamily: 'var(--font-editorial)' }}>
                {line}
              </p>
            ))}
          </div>
          
          <nav className="space-y-0.5">
            {INDEX_LINKS.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="flex items-center gap-2.5 py-1.5 text-[12px] tracking-[0.18em] uppercase text-black/70 hover:translate-x-[3px] transition-transform"
              >
                <span className="w-3 h-px bg-black/18" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ActII() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  if (reducedMotion) {
    return <ReducedMotionFallback />;
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '200vh' }}
    >
      {/* Sticky viewport for sheet */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[var(--background)]">
        <ActIISheet 
          scrollProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}

export default ActII;
