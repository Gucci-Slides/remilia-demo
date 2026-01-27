'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT GATE — State machine for boot sequence with phase-based glitch transition
//
// States: idle -> p1 (yellow destabilize) -> p2 (collapse) -> p3 (blue assert) -> title
//
// Phase 1: Yellow stays yellow, CRT glitch, warm spectrum (NO BLUE)
// Phase 2: Flash, desaturate, blue ghost lingers
// Phase 3: Black screen, blue ghost fades, title fades in (already blue)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BootGlitchOverlay } from './BootGlitchOverlay';
import { CrtTvFrame } from '../tv/CrtTvFrame';
import { RemiliaSplash } from '../splash/RemiliaSplash';
import { type BootPhase, BOOT_TIMELINE, BOOT_COLORS } from '@/lib/bootFx';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface BootGateProps {
  /** Callback when transition completes and title is shown */
  onComplete?: () => void;
  /** Smiley image URL */
  smileyUrl?: string;
  /** Enable CRT effects on idle screen */
  crtEnabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// BOUNCING ANIMATION HOOK
// ─────────────────────────────────────────────────────────────────────────────────

function useBouncingPosition(enabled: boolean, smileySize: number = 280) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const velocityRef = useRef({ x: 3, y: 2.5 });
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      setPosition((prev) => {
        const vx = velocityRef.current.x;
        const vy = velocityRef.current.y;
        
        let newX = prev.x + vx;
        let newY = prev.y + vy;

        const maxX = window.innerWidth - smileySize;
        const maxY = window.innerHeight - smileySize;

        if (newX <= 0 || newX >= maxX) {
          velocityRef.current.x = -vx;
          newX = Math.max(0, Math.min(newX, maxX));
        }

        if (newY <= 0 || newY >= maxY) {
          velocityRef.current.y = -vy;
          newY = Math.max(0, Math.min(newY, maxY));
        }

        return { x: newX, y: newY };
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, smileySize]);

  return position;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function BootGate({
  onComplete,
  smileyUrl = '/smile.png',
  crtEnabled = true,
}: BootGateProps) {
  const [phase, setPhase] = useState<BootPhase>('idle');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  const smileySize = 280;
  const isBouncing = phase === 'idle';
  const position = useBouncingPosition(isBouncing, smileySize);
  const [frozenPosition, setFrozenPosition] = useState({ x: 0, y: 0 });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Handle smiley click → start glitch sequence
  const handleClick = useCallback(() => {
    // Prevent multiple clicks during transition
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setFrozenPosition(position); // Freeze at current position

    // Run through the phase timeline
    BOOT_TIMELINE.forEach(({ phase: nextPhase, delay }) => {
      const timeout = setTimeout(() => {
        setPhase(nextPhase);
      }, delay);
      
      timeoutsRef.current.push(timeout);
    });
  }, [isTransitioning, position]);

  // Notify when title phase is reached
  useEffect(() => {
    if (phase === 'title' && onComplete) {
      // Small delay to let title fade in before navigating
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  // Determine smiley position (bouncing or frozen)
  const smileyPosition = isBouncing ? position : frozenPosition;
  const isGlitching = phase === 'p1' || phase === 'p2';
  const showTitle = phase === 'title';
  const showSmiley = phase !== 'title' && phase !== 'p3';

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{ background: phase === 'p3' || phase === 'title' ? BOOT_COLORS.BG_BLACK : '#000' }}
    >
      {/* Idle/Glitching Screen */}
      {!showTitle && (
        <CrtTvFrame
          enabled={crtEnabled && phase === 'idle'}
          intensity={0.4}
          powerOnAnimation={false}
          curved={false}
          chromatic={false}
        >
          {/* Black background */}
          <div className="w-full h-full bg-black" />

          {/* Bouncing/Frozen Smiley */}
          {showSmiley && (
            <motion.div
              className={isGlitching ? 'glitch-jitter--p1' : ''}
              style={{
                position: 'absolute',
                left: smileyPosition.x,
                top: smileyPosition.y,
                width: smileySize,
                height: smileySize,
                zIndex: 10,
                cursor: isTransitioning ? 'default' : 'pointer',
                pointerEvents: isTransitioning ? 'none' : 'auto',
              }}
              onClick={handleClick}
              whileHover={!isTransitioning ? { scale: 1.05 } : undefined}
              whileTap={!isTransitioning ? { scale: 0.95 } : undefined}
            >
              {/* Main smiley */}
              <img
                src={smileyUrl}
                alt="Click to enter"
                style={{
                  width: '100%',
                  height: 'auto',
                  // Phase 1: luminance overdrive toward near-white
                  filter: isGlitching 
                    ? 'brightness(1.3) contrast(1.1) saturate(1.2)' 
                    : 'none',
                  transition: 'filter 0.05s ease',
                }}
                draggable={false}
              />

              {/* Warm spectrum duplicates during Phase 1 (NO BLUE) */}
              {phase === 'p1' && (
                <>
                  {/* Yellow/white channel offset */}
                  <img
                    src={smileyUrl}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: -5,
                      width: '100%',
                      height: 'auto',
                      opacity: 0.3,
                      filter: 'brightness(1.5) saturate(0.8)',
                      mixBlendMode: 'screen',
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                  {/* Green contamination */}
                  <img
                    src={smileyUrl}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 4,
                      width: '100%',
                      height: 'auto',
                      opacity: 0.15,
                      filter: 'hue-rotate(60deg) saturate(1.5) brightness(1.2)',
                      mixBlendMode: 'screen',
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                </>
              )}
            </motion.div>
          )}
        </CrtTvFrame>
      )}

      {/* Title Screen (Phase 3 end / Title state) — Rockstar-style splash */}
      {showTitle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%' }}
        >
          <RemiliaSplash emblemUrl="/smile.png" />
        </motion.div>
      )}

      {/* Glitch Overlay (on top of everything) */}
      <BootGlitchOverlay
        active={isTransitioning}
        phase={phase}
        intensity={1}
      />
    </div>
  );
}

export default BootGate;
