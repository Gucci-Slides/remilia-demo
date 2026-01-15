'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRhythm, spacing } from '@/lib/landing/RhythmContext';
import { computeInscriptionPosition } from '@/lib/landing/rhythm';

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────

const ACT_1_HEIGHT_VH = 200;

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface ThresholdHeroProps {
  onOpenIndex?: () => void;
}

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────

export function ThresholdHero({ onOpenIndex }: ThresholdHeroProps) {
  const router = useRouter();
  const { layout, registerWordmark, registerContainer } = useRhythm();
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const inscriptionRef = useRef<HTMLDivElement>(null);
  
  // State
  const [entered, setEntered] = useState(false);
  const [inscriptionHeight, setInscriptionHeight] = useState(0);

  // Register refs with context
  useLayoutEffect(() => {
    registerContainer(heroRef.current);
    registerWordmark(wordmarkRef.current);
  }, [registerContainer, registerWordmark]);

  // Measure inscription height
  useLayoutEffect(() => {
    if (inscriptionRef.current) {
      setInscriptionHeight(inscriptionRef.current.offsetHeight);
    }
  }, []);

  // Scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Fade out hero as user scrolls toward end of Act I
  const heroOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0.7, 1], [1, 0.98]);

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────

  const handleRegistry = () => {
    if (entered) return;
    setEntered(true);
    setTimeout(() => router.push('/registry'), 500);
  };

  // ─────────────────────────────────────────────────────────────────
  // COMPUTE POSITIONS
  // ─────────────────────────────────────────────────────────────────

  const inscriptionPosition = layout ? computeInscriptionPosition(layout, inscriptionHeight) : null;

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────

  return (
    <section
      ref={containerRef}
      id="act-1"
      className="relative"
      style={{ 
        height: `${ACT_1_HEIGHT_VH}vh`,
        backgroundColor: 'var(--background)',
      }}
    >
      {/* Fixed hero viewport — fades out at end of Act I */}
      <motion.div 
        ref={heroRef}
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        {/* Header */}
        <header 
          className="absolute top-0 left-0 right-0 flex items-center justify-end z-20 pointer-events-auto"
          style={{ 
            paddingTop: `${spacing.u3}px`,
            paddingBottom: `${spacing.u3}px`,
            paddingLeft: `${spacing.u6}px`,
            paddingRight: `${spacing.u6}px`,
          }}
        >
          {/* Navigation */}
          <nav className="flex items-center" style={{ gap: `${spacing.u4}px` }}>
            <button
              onClick={onOpenIndex}
              className="role-reference hover:opacity-100 transition-opacity"
              style={{ opacity: 0.6 }}
            >
              INDEX
            </button>
            <span style={{ color: 'rgba(0,0,0,0.2)' }}>·</span>
            <button
              onClick={handleRegistry}
              className="role-reference hover:opacity-70 transition-opacity"
              style={{ opacity: 0.4 }}
            >
              REGISTRY
            </button>
          </nav>
        </header>

        {/* Inscription — aligned to spine A */}
        <div
          ref={inscriptionRef}
          className={`absolute z-10 ${layout?.isMobile ? 'left-0 right-0 text-center px-6' : ''}`}
          style={
            inscriptionPosition && !layout?.isMobile
              ? {
                  left: inscriptionPosition.left,
                  top: inscriptionPosition.top,
                }
              : layout?.isMobile
              ? {
                  top: inscriptionPosition?.top ?? 'auto',
                }
              : undefined
          }
        >
          <motion.p
            className="role-inscription"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Remilia is a Network State.
          </motion.p>
        </div>

        {/* Wordmark — Monument, anchored to bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden flex justify-center">
          <h1
            ref={wordmarkRef}
            className="role-monument select-none"
            style={{ 
              transform: 'translateY(-5%)',
            }}
            aria-hidden="true"
          >
            REMILIA
          </h1>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="fixed left-1/2 -translate-x-1/2 z-30"
        style={{ bottom: `${spacing.u4}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center"
          style={{ gap: `${spacing.u1}px`, opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
        >
          <span className="role-reference" style={{ opacity: 0.3 }}>
            Scroll
          </span>
          <motion.div
            style={{ width: 1, height: spacing.u3, backgroundColor: 'rgba(0,0,0,0.2)' }}
            animate={{ scaleY: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
