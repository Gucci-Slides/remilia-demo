'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SMILEY OVERLAY — PS1/Bootloader-style ASCII display
//
// A CRT-styled overlay that renders either ASCII text or an image with
// scanline effects, glow, and boot animation.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BOOT_SMILEY from './bootAscii';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface BootSmileyOverlayProps {
  /** Render mode: ASCII text or image texture */
  mode?: 'ascii' | 'image';
  /** Multiline ASCII art string */
  ascii?: string;
  /** URL for image mode (screenshot-based smiley) */
  imageUrl?: string;
  /** Horizontal anchor position */
  anchor?: 'left' | 'center';
  /** Overall opacity (0-1) */
  opacity?: number;
  /** Scale factor */
  scale?: number;
  /** Glow intensity (0-1) */
  glow?: number;
  /** Enable CRT scanline effect */
  scanlines?: boolean;
  /** Enable boot-in animation */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Color of the ASCII/overlay */
  color?: string;
  /** Callback when boot animation completes */
  onBootComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const DEFAULT_COLOR = '#00ff41'; // Classic terminal green
const REVEAL_STAGGER = 45; // ms between each line reveal
const FLICKER_DURATION = 150; // ms for flicker effect

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function BootSmileyOverlay({
  mode = 'ascii',
  ascii = BOOT_SMILEY,
  imageUrl,
  anchor = 'left',
  opacity = 1,
  scale = 1,
  glow = 0.6,
  scanlines = true,
  animate = true,
  animationDuration = 800,
  delay = 200,
  color = DEFAULT_COLOR,
  onBootComplete,
}: BootSmileyOverlayProps) {
  // Parse ASCII into lines for animation
  const lines = useMemo(() => {
    return ascii.split('\n').filter((line) => line.length > 0);
  }, [ascii]);

  // Track revealed lines during boot animation
  const [revealedLines, setRevealedLines] = useState<number>(animate ? 0 : lines.length);
  const [isFlickering, setIsFlickering] = useState(false);
  const [bootComplete, setBootComplete] = useState(!animate);

  // Boot animation: reveal lines progressively
  useEffect(() => {
    if (!animate) {
      setRevealedLines(lines.length);
      setBootComplete(true);
      return;
    }

    // Initial delay before starting
    const startTimeout = setTimeout(() => {
      const lineDelay = Math.min(REVEAL_STAGGER, animationDuration / lines.length);
      
      let currentLine = 0;
      const interval = setInterval(() => {
        currentLine++;
        setRevealedLines(currentLine);

        if (currentLine >= lines.length) {
          clearInterval(interval);
          
          // Trigger flicker effect once fully revealed
          setIsFlickering(true);
          setTimeout(() => {
            setIsFlickering(false);
            setBootComplete(true);
            onBootComplete?.();
          }, FLICKER_DURATION * 3);
        }
      }, lineDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [animate, animationDuration, delay, lines.length, onBootComplete]);

  // Calculate anchor positioning
  const anchorStyles = useMemo(() => {
    if (anchor === 'center') {
      return {
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
      };
    }
    return {
      left: 'clamp(24px, 5vw, 64px)',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };
  }, [anchor, scale]);

  // Glow filter for CRT effect
  const glowFilter = useMemo(() => {
    if (glow <= 0) return 'none';
    const blur = Math.round(glow * 8);
    const brightness = 1 + glow * 0.5;
    return `drop-shadow(0 0 ${blur}px ${color}) brightness(${brightness})`;
  }, [glow, color]);

  return (
    <div
      className="boot-smiley-overlay"
      style={{
        position: 'absolute',
        top: 'clamp(80px, 12vh, 160px)',
        ...anchorStyles,
        zIndex: 20,
        pointerEvents: 'none',
        opacity: opacity * (isFlickering ? 0.3 + Math.random() * 0.7 : 1),
        transition: isFlickering ? 'none' : 'opacity 0.3s ease',
      }}
    >
      {/* ASCII Mode */}
      {mode === 'ascii' && (
        <div
          className="boot-smiley-ascii"
          style={{
            position: 'relative',
            filter: glowFilter,
          }}
        >
          <pre
            style={{
              fontFamily: '"IBM Plex Mono", "SF Mono", "Fira Code", "Consolas", monospace',
              fontSize: 'clamp(8px, 1.2vw, 14px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: color,
              margin: 0,
              whiteSpace: 'pre',
              textShadow: glow > 0 
                ? `0 0 ${Math.round(glow * 4)}px ${color}, 0 0 ${Math.round(glow * 12)}px ${color}40`
                : 'none',
            }}
          >
            {lines.slice(0, revealedLines).map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.08 }}
                style={{ display: 'block' }}
              >
                {line}
              </motion.span>
            ))}
          </pre>

          {/* Scanline overlay */}
          {scanlines && (
            <div
              className="boot-smiley-scanlines"
              style={{
                position: 'absolute',
                inset: -4,
                pointerEvents: 'none',
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.15) 2px,
                  rgba(0, 0, 0, 0.15) 4px
                )`,
                mixBlendMode: 'multiply',
              }}
            />
          )}

          {/* CRT flicker overlay (active during boot) */}
          <AnimatePresence>
            {!bootComplete && (
              <motion.div
                initial={{ opacity: 0.1 }}
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -4,
                  background: `linear-gradient(
                    180deg,
                    transparent 0%,
                    ${color}08 50%,
                    transparent 100%
                  )`,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Image Mode */}
      {mode === 'image' && imageUrl && (
        <div
          className="boot-smiley-image"
          style={{
            position: 'relative',
            filter: glowFilter,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Boot smiley"
            style={{
              width: 'clamp(120px, 20vw, 280px)',
              height: 'auto',
              // Convert to grayscale first, then we'll tint with color overlay
              filter: 'grayscale(1) brightness(1.2) contrast(1.1)',
              opacity: bootComplete ? 1 : revealedLines / lines.length,
              transition: 'opacity 0.1s ease',
            }}
          />

          {/* Green tint overlay - multiply blends the color */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: color,
              mixBlendMode: 'multiply',
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          />

          {/* Scanline overlay for image */}
          {scanlines && (
            <div
              className="boot-smiley-scanlines"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.25) 2px,
                  rgba(0, 0, 0, 0.25) 4px
                )`,
                mixBlendMode: 'multiply',
              }}
            />
          )}
        </div>
      )}

      {/* Subtle jitter animation (post-boot) */}
      {bootComplete && (
        <style jsx global>{`
          @keyframes boot-smiley-jitter {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 1;
            }
            25% {
              transform: translate(0.5px, 0);
              opacity: 0.98;
            }
            50% {
              transform: translate(-0.5px, 0.5px);
              opacity: 1;
            }
            75% {
              transform: translate(0, -0.5px);
              opacity: 0.99;
            }
          }

          .boot-smiley-ascii,
          .boot-smiley-image {
            animation: boot-smiley-jitter 4s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .boot-smiley-ascii,
            .boot-smiley-image {
              animation: none;
            }
          }
        `}</style>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export { BOOT_SMILEY } from './bootAscii';
export type { BootSmileyOverlayProps };
