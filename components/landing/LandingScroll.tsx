'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue, AnimatePresence } from 'framer-motion';
import { ACT_I, BEAT_1_LINES, BEAT_2_LINES, BEAT_3_LINES, BEAT_4_LINES, ActILine } from './acts';
import { ActII } from './ActII';
import { Globe } from '@/components/ui/globe';

// ═══════════════════════════════════════════════════════════════════════════
// LANDING SCROLL — Exclusive Beat Reveal
// 
// SCROLL PHASES (based on progress 0 → 1):
// P0 = 0.00–0.22 → Monument dominates (copy hidden)
// P1 = 0.22–0.42 → Handoff window (monument shrinking, copy still hidden)
// P2 = 0.42–1.00 → Copy visible with 4 EXCLUSIVE beats
// 
// BEAT MODEL:
// - Only ONE beat is visible at a time
// - Non-active beats are UNMOUNTED (not just faded)
// - AnimatePresence mode="wait" ensures clean transitions
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL PHASE THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

const PHASES = {
  monumentDominant: { start: 0, end: 0.22 },
  handoff: { start: 0.22, end: 0.42 },
  copyVisible: { start: 0.42, end: 1.0 },
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT TIMING — 4 exclusive beats within P2
// 
// P2 runs from 0.42 → 1.00 (0.58 range).
// Each beat gets 25% of P2:
// Beat 0: 0.420 → 0.565 (index 0)
// Beat 1: 0.565 → 0.710 (index 1)
// Beat 2: 0.710 → 0.855 (index 2)
// Beat 3: 0.855 → 1.000 (index 3)
// ─────────────────────────────────────────────────────────────────────────────

const P2_START = 0.42;
const P2_RANGE = 0.58;

// Beat boundaries (global progress values)
const BEAT_BOUNDARIES = [
  P2_START,                      // Beat 0 starts (0.42)
  P2_START + P2_RANGE * 0.25,    // Beat 1 starts (0.565)
  P2_START + P2_RANGE * 0.50,    // Beat 2 starts (0.71)
  P2_START + P2_RANGE * 0.75,    // Beat 3 starts (0.855)
  1.0,                           // End
];

// Get active beat index from scroll progress (returns -1 if before P2)
function getActiveBeatIndex(progress: number): number {
  if (progress < P2_START) return -1;
  if (progress >= BEAT_BOUNDARIES[4]) return 3;
  if (progress >= BEAT_BOUNDARIES[3]) return 3;
  if (progress >= BEAT_BOUNDARIES[2]) return 2;
  if (progress >= BEAT_BOUNDARIES[1]) return 1;
  return 0;
}

// Beat content arrays
const BEATS = [
  { lines: BEAT_1_LINES, includesInscription: true },
  { lines: BEAT_2_LINES, includesInscription: false },
  { lines: BEAT_3_LINES, includesInscription: false },
  { lines: BEAT_4_LINES, includesInscription: false },
];

// Animation variants for beat transitions
// CRITICAL: mode="wait" + these variants ensure only ONE beat is ever visible.
// Exit must complete (opacity: 0) before next beat enters.
const beatVariants = {
  enter: {
    opacity: 0,
    y: 10,
    // Not interactive while entering
    pointerEvents: 'none' as const,
  },
  active: {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto' as const,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    // Immediately disable interaction on exit
    pointerEvents: 'none' as const,
    transition: {
      // Fast exit ensures previous beat is GONE before new one appears
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO MONUMENT
// ─────────────────────────────────────────────────────────────────────────────

interface HeroMonumentProps {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

function HeroMonument({ scrollProgress, reducedMotion }: HeroMonumentProps) {
  const scale = useTransform(
    scrollProgress,
    [0, PHASES.monumentDominant.end, PHASES.handoff.end],
    reducedMotion ? [1, 1, 1] : [1, 1, 0.3]
  );
  
  const x = useTransform(
    scrollProgress,
    [0, PHASES.monumentDominant.end, PHASES.handoff.end],
    reducedMotion ? ['0%', '0%', '0%'] : ['0%', '0%', '-30%']
  );
  
  const y = useTransform(
    scrollProgress,
    [0, PHASES.monumentDominant.end, PHASES.handoff.end],
    reducedMotion ? ['0%', '0%', '0%'] : ['0%', '0%', '-35%']
  );
  
  const opacity = useTransform(
    scrollProgress,
    [0, PHASES.monumentDominant.end, PHASES.handoff.end - 0.05, PHASES.handoff.end],
    reducedMotion ? [0, 0, 0, 0] : [1, 1, 0.4, 0]
  );
  
  const blur = useTransform(
    scrollProgress,
    [PHASES.monumentDominant.end, PHASES.handoff.end],
    reducedMotion ? [0, 0] : [0, 2]
  );

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
      style={{ opacity }}
    >
      <motion.h1
        className="t-monument-hero select-none origin-center"
        style={{ 
          scale, 
          x, 
          y,
          filter: useTransform(blur, v => `blur(${v}px)`),
        }}
        aria-hidden="true"
      >
        REMILIA
      </motion.h1>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACT I CONTENT — Exclusive beats (only one visible at a time)
// 
// Uses AnimatePresence mode="wait" to ensure clean transitions.
// Non-active beats are completely unmounted.
// ─────────────────────────────────────────────────────────────────────────────

interface ActIContentProps {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

function ActIContent({ scrollProgress, reducedMotion }: ActIContentProps) {
  const [activeBeat, setActiveBeat] = useState(-1);
  
  // Subscribe to scroll progress and update active beat
  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (latest) => {
      const newBeat = getActiveBeatIndex(latest);
      setActiveBeat(newBeat);
    });
    return unsubscribe;
  }, [scrollProgress]);
  
  // Don't render anything before P2
  if (activeBeat < 0) return null;
  
  const currentBeat = BEATS[activeBeat];
  const isBeat1 = activeBeat === 0;

  return (
    <div
      className="absolute left-6 md:left-12 right-6 md:right-12 z-10"
      style={{ top: 'clamp(140px, 22vh, 260px)', overflow: 'visible' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBeat}
          variants={reducedMotion ? undefined : beatVariants}
          initial="enter"
          animate="active"
          exit="exit"
          style={{ overflow: 'visible' }}
        >
          {isBeat1 ? (
            // Beat 1: Globe defines spatial field, text acts as annotation
            // Globe is the dominant system — text intrudes into its space
            <div className="relative" style={{ overflow: 'visible' }}>
              {/* Text block — annotation within the globe's implied field
                  Positioned to visually intrude into globe space */}
              <motion.div 
                className="max-w-[28rem] relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  // Text sits within globe's spatial field
                  marginTop: '8vh',
                }}
              >
                {/* Headline as registry classification */}
                <p 
                  className="t-act1 mb-4"
                  style={{ 
                    lineHeight: 1.3,
                    opacity: 0.92,
                    letterSpacing: '0.01em',
                  }}
                >
                  {ACT_I.inscription}
                </p>
                <div style={{ opacity: 0.85 }}>
                  <BeatLines lines={currentBeat.lines} />
                </div>
              </motion.div>
              
              {/* Globe — Ethereal atmospheric presentation
                  Nearly transparent sphere, visible dots, soft blur */}
              <motion.div 
                className="hidden lg:block absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  right: '4vw',
                  top: '12vh',
                  width: 'min(680px, 48vw)',
                  height: 'min(680px, 48vw)',
                  pointerEvents: 'none',
                  // Soft atmospheric blur for ethereal effect
                  filter: 'blur(0.8px)',
                }}
              >
                {/* Soft atmospheric haze behind globe */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-20%',
                    background: 'radial-gradient(circle at 50% 50%, rgba(180,180,180,0.12) 0%, rgba(200,200,200,0.06) 40%, transparent 65%)',
                    pointerEvents: 'none',
                  }}
                />
                
                {/* Globe with soft edge fade */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    maskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 65%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 65%, transparent 80%)',
                  }}
                >
                  <Globe 
                    config={{
                      width: 800,
                      height: 800,
                      devicePixelRatio: 2,
                      phi: 0.3,
                      theta: 0.2,
                      dark: 0,
                      diffuse: 1.2,
                      mapSamples: 16000,
                      mapBrightness: 6,
                      // Very light base — sphere nearly invisible
                      baseColor: [0.97, 0.97, 0.97],
                      // Dots remain visible
                      markerColor: [0.45, 0.45, 0.45],
                      glowColor: [1, 1, 1],
                      markers: [
                        { location: [39.9042, 116.4074], size: 0.024 },
                        { location: [40.7128, -74.006], size: 0.03 },
                        { location: [51.5074, -0.1278], size: 0.022 },
                        { location: [35.6762, 139.6503], size: 0.024 },
                        { location: [-23.5505, -46.6333], size: 0.02 },
                      ],
                      onRender: () => {},
                    }}
                  />
                </div>
              </motion.div>

              {/* Caption — positioned below globe area */}
              <motion.div
                className="hidden lg:block absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  right: '8vw',
                  bottom: '12vh',
                  opacity: 0.45,
                  pointerEvents: 'none',
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#666',
                    margin: 0,
                    fontFamily: 'var(--font-meta), Inter, system-ui, sans-serif',
                  }}
                >
                  NETWORK TOPOLOGY SNAPSHOT
                </p>
                <p
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#888',
                    margin: '3px 0 0 0',
                    fontFamily: 'var(--font-meta), Inter, system-ui, sans-serif',
                  }}
                >
                  RML-NET / OBSERVATION WINDOW
                </p>
              </motion.div>
            </div>
          ) : (
            // Beats 2-4: Single column text
            <div className="max-w-[38rem]">
              <BeatLines lines={currentBeat.lines} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// BEAT LINES — Render lines within a beat
// ─────────────────────────────────────────────────────────────────────────────

interface BeatLinesProps {
  lines: ActILine[];
}

function BeatLines({ lines }: BeatLinesProps) {
  return (
    <div className="space-y-0.5">
      {lines.map((line) => {
        const isEmphasis = line.weight === 'medium';
        return (
          <p
            key={line.id}
            className={`t-act2-line ${isEmphasis ? 't-act2-line--emphasis' : ''} ${line.paragraphBreak ? 'mt-4' : ''}`}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

interface ScrollIndicatorProps {
  scrollProgress: MotionValue<number>;
}

function ScrollIndicator({ scrollProgress }: ScrollIndicatorProps) {
  const opacity = useTransform(
    scrollProgress,
    [0, 0.05, 0.12],
    [0.4, 0.4, 0]
  );

  return (
    <motion.div 
      className="absolute bottom-12 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
      style={{ opacity }}
    >
      <span className="text-[10px] tracking-[0.14em] uppercase text-black/50">SCROLL</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REDUCED MOTION FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

function ReducedMotionFallback() {
  return (
    <main className="min-h-screen bg-[var(--background)] relative">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <div>
          <span className="text-xs tracking-[0.14em] uppercase font-medium block">REMILIA</span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-black/55 mt-2 block">
            WITNESS MARK · RML-01
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <span className="text-[11px] tracking-[0.10em] uppercase text-black/60">INDEX</span>
          <span className="text-[11px] tracking-[0.10em] uppercase text-black/40">REGISTRY</span>
        </nav>
      </header>
      
      <div className="min-h-screen flex items-start pt-32 px-6 md:px-12">
        <div className="w-full space-y-12">
          {/* Beat 1 — Globe defines spatial field, text as annotation */}
          <div className="relative">
            <div className="max-w-[28rem] relative z-10" style={{ marginTop: '8vh' }}>
              <p className="t-act1 mb-4" style={{ lineHeight: 1.3, opacity: 0.92, letterSpacing: '0.01em' }}>{ACT_I.inscription}</p>
              <div style={{ opacity: 0.85 }}>
                <BeatLines lines={BEAT_1_LINES} />
              </div>
            </div>
            {/* Globe — archive observation window */}
            <div 
              className="hidden lg:block absolute"
              style={{
                right: '6vw',
                top: '18vh',
                pointerEvents: 'none',
                isolation: 'isolate',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 'min(820px, 48vw)',
                  height: 'clamp(520px, 55vh, 620px)',
                  background: 'radial-gradient(120% 120% at 65% 55%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.00) 72%)',
                  boxShadow: '0 30px 110px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    maskImage: 'radial-gradient(circle at 60% 45%, #000 52%, rgba(0,0,0,0.75) 62%, transparent 78%)',
                    WebkitMaskImage: 'radial-gradient(circle at 60% 45%, #000 52%, rgba(0,0,0,0.75) 62%, transparent 78%)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '140%',
                      height: '140%',
                      left: '-20%',
                      top: '-20%',
                      transform: 'translateX(6%) translateY(-6%)',
                    }}
                  >
                    <Globe 
                      config={{
                        width: 800,
                        height: 800,
                        devicePixelRatio: 2,
                        phi: 0.35,
                        theta: 0.15,
                        dark: 0,
                        diffuse: 0.6,
                        mapSamples: 18000,
                        mapBrightness: 1.1,
                        baseColor: [0.62, 0.62, 0.62],
                        markerColor: [0.22, 0.22, 0.22],
                        glowColor: [0.78, 0.78, 0.78],
                        markers: [
                          { location: [39.9042, 116.4074], size: 0.026 },
                          { location: [40.7128, -74.006], size: 0.032 },
                          { location: [51.5074, -0.1278], size: 0.024 },
                        ],
                        onRender: () => {},
                      }}
                    />
                  </div>
                </div>
                <div style={{ position: 'absolute', left: '24px', bottom: '20px', opacity: 0.45 }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#333', margin: 0, fontFamily: 'var(--font-meta), Inter, system-ui, sans-serif' }}>
                    NETWORK TOPOLOGY SNAPSHOT
                  </p>
                  <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555', margin: '3px 0 0 0', fontFamily: 'var(--font-meta), Inter, system-ui, sans-serif' }}>
                    RML-NET / OBSERVATION WINDOW
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Beat 2 */}
          <div className="max-w-[38rem]">
            <BeatLines lines={BEAT_2_LINES} />
          </div>
          
          {/* Beat 3 */}
          <div className="max-w-[38rem]">
            <BeatLines lines={BEAT_3_LINES} />
          </div>
          
          {/* Beat 4 */}
          <div className="max-w-[38rem]">
            <BeatLines lines={BEAT_4_LINES} />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACT I SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ActISection() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '300vh' }} // Increased height for 4 beats
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[var(--background)]">
        
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.015) 100%)',
          }}
        />
        
        <HeroMonument 
          scrollProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
        
        <ActIContent 
          scrollProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />

        <ScrollIndicator scrollProgress={scrollYProgress} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENT MASTHEAD
// ─────────────────────────────────────────────────────────────────────────────

function PersistentMasthead() {
  const { scrollY } = useScroll();
  
  const opacity = useTransform(
    scrollY,
    [0, 200, 400],
    [0, 0, 1]
  );

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 pointer-events-auto"
      style={{ opacity }}
    >
      <div>
        <span className="text-xs md:text-sm tracking-[0.14em] uppercase font-medium text-black/70 block">
          REMILIA
        </span>
        <span className="text-[10px] tracking-[0.18em] uppercase text-black/50 mt-1 block">
          WITNESS MARK · RML-01
        </span>
      </div>
      
      <nav className="flex items-center gap-6">
        <button className="text-[11px] tracking-[0.10em] uppercase text-black/60 hover:text-black/80 transition-colors">
          INDEX
        </button>
        <button className="text-[11px] tracking-[0.10em] uppercase text-black/40 hover:text-black/60 transition-colors">
          REGISTRY
        </button>
      </nav>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function LandingScroll() {
  const reducedMotion = useReducedMotion() ?? false;

  if (reducedMotion) {
    return <ReducedMotionFallback />;
  }

  return (
    <main className="relative bg-[var(--background)]">
      <PersistentMasthead />
      <ActISection />
      <ActII />
    </main>
  );
}

export default LandingScroll;
