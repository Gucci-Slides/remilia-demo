'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CRT TV FRAME — Analog television wrapper with DVD bouncing smiley
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react';
import './crt.css';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CrtTvFrameProps {
  children: ReactNode;
  smileyUrl?: string;
  intensity?: number;
  smileyOpacity?: number;
  smileyStretch?: number;
  smileyBlend?: 'screen' | 'overlay' | 'lighten' | 'soft-light' | 'hard-light';
  enabled?: boolean;
  showBezel?: boolean;
  powerOnAnimation?: boolean;
  curved?: boolean;
  chromatic?: boolean;
  className?: string;
  /** Enable DVD-style bouncing animation */
  bouncingDvd?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DVD BOUNCING HOOK
// ─────────────────────────────────────────────────────────────────────────────────

function useBouncingPosition(enabled: boolean, smileySize: number = 200) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const velocityRef = useRef({ x: 2.5, y: 2 });
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      setPosition((prev) => {
        const vx = velocityRef.current.x;
        const vy = velocityRef.current.y;
        
        let newX = prev.x + vx;
        let newY = prev.y + vy;

        // Bounce off walls
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

export function CrtTvFrame({
  children,
  smileyUrl,
  intensity = 1,
  smileyOpacity = 0.7,
  smileyStretch = 1.25,
  smileyBlend = 'screen',
  enabled = true,
  showBezel = false,
  powerOnAnimation = true,
  curved = true,
  chromatic = true,
  className = '',
  bouncingDvd = false,
}: CrtTvFrameProps) {
  const [isPoweredOn, setIsPoweredOn] = useState(!powerOnAnimation);
  const [showPowerOverlay, setShowPowerOverlay] = useState(powerOnAnimation);
  
  const smileySize = 280;
  const position = useBouncingPosition(bouncingDvd && isPoweredOn, smileySize);

  useEffect(() => {
    if (!powerOnAnimation) {
      setIsPoweredOn(true);
      setShowPowerOverlay(false);
      return;
    }

    const powerOnTimer = setTimeout(() => {
      setIsPoweredOn(true);
    }, 100);

    const overlayTimer = setTimeout(() => {
      setShowPowerOverlay(false);
    }, 900);

    return () => {
      clearTimeout(powerOnTimer);
      clearTimeout(overlayTimer);
    };
  }, [powerOnAnimation]);

  if (!enabled) {
    return <>{children}</>;
  }

  const scanlineOpacity = Math.min(1, intensity * 0.6);
  const vignetteOpacity = Math.min(1, intensity * 0.8);
  const noiseOpacity = Math.min(0.05, intensity * 0.03);

  // DVD bouncing smiley styles
  const bouncingSmileyStyle: CSSProperties = bouncingDvd ? {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: smileySize,
    height: 'auto',
    transform: `scaleX(${smileyStretch})`,
    opacity: smileyOpacity,
    mixBlendMode: smileyBlend,
    filter: 'blur(0.5px) brightness(1.1)',
    transition: 'none',
    zIndex: 5,
    pointerEvents: 'none',
  } : {};

  // Static smiley styles (original behavior)
  const staticSmileyStyle: CSSProperties = !bouncingDvd ? {
    transform: `scaleX(${smileyStretch})`,
    opacity: smileyOpacity,
    mixBlendMode: smileyBlend,
  } : {};

  return (
    <div
      className={`crt-tv-frame ${showBezel ? 'crt-tv-frame--bezel' : ''} ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <div
        className={`crt-tv-screen ${curved ? 'crt-tv-screen--curved' : ''} ${isPoweredOn ? 'crt-flicker' : ''}`}
      >
        {/* Screen Content */}
        <div className="crt-screen-content">
          {children}
        </div>

        {/* Bouncing DVD Smiley */}
        {smileyUrl && bouncingDvd && (
          <>
            <img
              src={smileyUrl}
              alt=""
              style={bouncingSmileyStyle}
              aria-hidden="true"
            />
            {/* Chromatic aberration */}
            {chromatic && (
              <>
                <img
                  src={smileyUrl}
                  alt=""
                  style={{
                    ...bouncingSmileyStyle,
                    left: position.x - 3,
                    opacity: 0.15,
                    filter: 'blur(1px) hue-rotate(-30deg) saturate(2)',
                  }}
                  aria-hidden="true"
                />
                <img
                  src={smileyUrl}
                  alt=""
                  style={{
                    ...bouncingSmileyStyle,
                    left: position.x + 3,
                    opacity: 0.15,
                    filter: 'blur(1px) hue-rotate(30deg) saturate(2)',
                  }}
                  aria-hidden="true"
                />
              </>
            )}
          </>
        )}

        {/* Static Smiley (original behavior) */}
        {smileyUrl && !bouncingDvd && (
          <div className="crt-smiley-layer">
            <img
              src={smileyUrl}
              alt=""
              className="crt-smiley-image"
              style={staticSmileyStyle}
              aria-hidden="true"
            />
            {chromatic && (
              <>
                <img
                  src={smileyUrl}
                  alt=""
                  className="crt-smiley-image crt-smiley-chroma crt-smiley-chroma--red"
                  style={{
                    ...staticSmileyStyle,
                    position: 'absolute',
                    left: 'clamp(24px, 5vw, 80px)',
                  }}
                  aria-hidden="true"
                />
                <img
                  src={smileyUrl}
                  alt=""
                  className="crt-smiley-image crt-smiley-chroma crt-smiley-chroma--blue"
                  style={{
                    ...staticSmileyStyle,
                    position: 'absolute',
                    left: 'clamp(24px, 5vw, 80px)',
                  }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        )}

        {/* CRT Effect Layers */}
        <div className="crt-noise" style={{ opacity: noiseOpacity }} />
        <div className="crt-scanlines" style={{ opacity: scanlineOpacity }} />
        <div className="crt-vignette" style={{ opacity: vignetteOpacity }} />
        <div className="crt-glare" />

        {/* Power On Animation */}
        {showPowerOverlay && <div className="crt-power-on-overlay" />}
      </div>
    </div>
  );
}

export type { CrtTvFrameProps };
export default CrtTvFrame;
