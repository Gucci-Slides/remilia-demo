'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollState, usePrefersReducedMotion } from '@/lib/scroll';

// ─────────────────────────────────────────────────────────────────
// NARRATIVE STATES
// Each state is a block of lines shown one at a time.
// Adjust lines/content here. The scroll system auto-divides the
// total scroll height equally among all states.
// ─────────────────────────────────────────────────────────────────

interface NarrativeState {
  id: string;
  lines: string[];
  variant?: 'title' | 'statement' | 'body';
}

const STATES: NarrativeState[] = [
  {
    id: 'intro',
    lines: ['REMILIA', 'A NETWORK STATE'],
    variant: 'title',
  },
  {
    id: 'state-1',
    lines: ['REMILIA IS A NETWORK STATE.'],
  },
  {
    id: 'state-2',
    lines: ['REMILIA OPERATES AS', 'A DISTRIBUTED CULTURAL SYSTEM.'],
  },
  {
    id: 'state-3',
    lines: ['IT PRODUCES,', 'INDEXES,', 'AND RECIRCULATES IDENTITIES', 'ACROSS NETWORKS.'],
  },
  {
    id: 'state-4',
    lines: ['MEANING IS NOT ASSIGNED.'],
  },
  {
    id: 'state-5',
    lines: ['IT EMERGES.'],
  },
  {
    id: 'state-6',
    lines: ['REMILIA IS NOT A PLATFORM.', 'IT IS NOT A COMMUNITY.', 'IT IS NOT A BRAND.'],
  },
  {
    id: 'state-7',
    lines: ['REMILIA MAINTAINS RECORDS.', 'THESE RECORDS ARE PUBLIC.', 'THEY ARE NOT NEUTRAL.'],
  },
  {
    id: 'state-8',
    lines: ['THE REGISTRY IS A STRUCTURE.', 'IT DOES NOT CURATE.', 'IT DOES NOT RECOMMEND.', 'IT DOES NOT EXPLAIN.'],
  },
  {
    id: 'state-9',
    lines: ['INTERPRETATION BELONGS', 'TO THE NETWORK.'],
  },
  {
    id: 'state-10',
    lines: ['THE RECORD PERSISTS.', 'ENTER THE REGISTRY'],
  },
];

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────

const SHOW_EYES_WATERMARK = false; // Toggle eyes PNG watermark
const SCROLL_HEIGHT_MULTIPLIER = 100; // vh per state (100 = 1 viewport per state)

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────

export function LandingNarrative() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { activeIndex } = useScrollState(STATES.length, containerRef);
  const currentState = STATES[activeIndex];
  const isLastState = activeIndex === STATES.length - 1;

  const handleRegistryClick = () => {
    router.push('/registry');
  };

  // Animation variants
  const blockVariants = {
    initial: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 6,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(2px)',
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
    },
    exit: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -4,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(1.5px)',
    },
  };

  const transition = {
    duration: prefersReducedMotion ? 0 : 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-paper"
      style={{ height: `${STATES.length * SCROLL_HEIGHT_MULTIPLIER}vh` }}
    >
      {/* ─────────────────────────────────────────────────────────── */}
      {/* FIXED VIEWPORT LAYER */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-10 overflow-hidden">
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-8 lg:px-12 py-5 sm:py-6 z-20">
          <span className="type-micro text-black/50">
            REMILIA
          </span>
          <button 
            onClick={handleRegistryClick}
            className="type-micro text-black/40 hover:text-black/70 transition-colors duration-300"
          >
            REGISTRY
          </button>
        </header>

        {/* Center narrative zone — offset upward to account for bottom wordmark */}
        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-8 lg:px-12 pb-[22vh]">
          
          {/* Eyes watermark (optional) */}
          {SHOW_EYES_WATERMARK && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[30vw] max-w-[280px] aspect-square opacity-[0.05] blur-[0.5px]">
                <Image
                  src="/milady-eyes-transparent.png"
                  alt=""
                  fill
                  sizes="30vw"
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          {/* Narrative block */}
          <div className="relative z-10 w-full max-w-[800px] text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentState.id}
                variants={blockVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="space-y-1 sm:space-y-2"
              >
                {currentState.lines.map((line, index) => {
                  const isRegistryLink = line === 'ENTER THE REGISTRY';
                  
                  if (isRegistryLink) {
                    return (
                      <button
                        key={index}
                        onClick={handleRegistryClick}
                        className="block w-full type-statement text-black/50 hover:text-black transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {line}
                          <span className="absolute -bottom-1 left-0 w-full h-px bg-black/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                        </span>
                      </button>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className={
                        currentState.variant === 'title' && index === 0
                          ? 'type-title text-black'
                          : 'type-statement text-black'
                      }
                    >
                      {line}
                    </p>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom wordmark — architectural, anchored to bottom, cropped */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <h1
            className="select-none text-center text-black"
            style={{ 
              fontFamily: 'var(--font-bebas), system-ui, sans-serif',
              fontSize: 'clamp(100px, 20vw, 360px)',
              lineHeight: 0.78,
              letterSpacing: '0.04em',
              fontWeight: 400,
              transform: 'translateY(20%)',
            }}
            aria-hidden="true"
          >
            REMILIA
          </h1>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SCROLL PROGRESS INDICATOR */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1">
        {STATES.map((_, index) => (
          <div
            key={index}
            className={`
              w-[2px] rounded-full transition-all duration-400
              ${index === activeIndex ? 'h-5 bg-black/40' : 'h-1.5 bg-black/10'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
