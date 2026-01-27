'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT GLITCH OVERLAY — Phase-based CRT transition effects
//
// Phase 1 (p1): Yellow destabilize - warm spectrum, CRT noise, NO BLUE
// Phase 2 (p2): Color collapse - flash, desaturate, blue linger
// Phase 3 (p3): Blue asserts - ghost → title fade in
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { type BootPhase, BOOT_TIMINGS } from '@/lib/bootFx';
import './boot-glitch-fx.css';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface BootGlitchOverlayProps {
  /** Whether overlay is active */
  active: boolean;
  /** Current phase of the transition */
  phase: BootPhase;
  /** Effect intensity multiplier (0-1) */
  intensity?: number;
  /** Callback when transition completes */
  onComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function BootGlitchOverlay({
  active,
  phase,
  intensity = 1,
  onComplete,
}: BootGlitchOverlayProps) {
  const [showBlueGhost, setShowBlueGhost] = useState(false);

  // Blue ghost linger timing (appears at end of P2, fades through P3)
  useEffect(() => {
    if (phase === 'p2') {
      // Show blue ghost near end of P2
      const timer = setTimeout(() => {
        setShowBlueGhost(true);
      }, BOOT_TIMINGS.P2_DURATION - BOOT_TIMINGS.BLUE_LINGER);
      return () => clearTimeout(timer);
    } else if (phase === 'title') {
      setShowBlueGhost(false);
    }
  }, [phase]);

  // Call onComplete when reaching title phase
  useEffect(() => {
    if (phase === 'title' && onComplete) {
      onComplete();
    }
  }, [phase, onComplete]);

  if (!active && phase === 'idle') {
    return null;
  }

  const isP1 = phase === 'p1';
  const isP2 = phase === 'p2';
  const isP3 = phase === 'p3';
  const isGlitching = isP1 || isP2;

  return (
    <div
      className={`boot-glitch-overlay ${isGlitching ? 'boot-glitch-overlay--blocking' : ''}`}
      style={{ opacity: intensity }}
    >
      {/* Background snap to near-black (Phase 3) */}
      <div className={`glitch-bg-black ${isP3 ? 'glitch-bg-black--p3' : ''}`} />

      {/* Scanlines layer */}
      <div
        className={`glitch-scanlines ${
          isP1 ? 'glitch-scanlines--p1' : ''
        } ${isP2 ? 'glitch-scanlines--p2' : ''} ${isP3 ? 'glitch-scanlines--p3' : ''}`}
      />

      {/* Noise layer */}
      <div
        className={`glitch-noise ${
          isP1 ? 'glitch-noise--p1' : ''
        } ${isP2 ? 'glitch-noise--p2' : ''} ${isP3 ? 'glitch-noise--p3' : ''}`}
      />

      {/* Glitch slices (Phase 1 only - warm spectrum) */}
      {isP1 && (
        <>
          <div className="glitch-slice glitch-slice--p1 glitch-slice-1" />
          <div className="glitch-slice glitch-slice--p1 glitch-slice-2" />
          <div className="glitch-slice glitch-slice--p1 glitch-slice-3" />
          <div className="glitch-slice glitch-slice--p1 glitch-slice-4" />
          <div className="glitch-slice glitch-slice--p1 glitch-slice-5" />
        </>
      )}

      {/* Chromatic aberration */}
      <div
        className={`glitch-chroma ${
          isP1 ? 'glitch-chroma--p1' : ''
        } ${isP2 ? 'glitch-chroma--p2' : ''}`}
      />

      {/* Luminance overdrive (Phase 1 - yellow blow-out) */}
      {isP1 && <div className="glitch-overdrive glitch-overdrive--p1" />}

      {/* Flash overlay (Phase 2 - near-white collapse) */}
      {isP2 && <div className="glitch-flash glitch-flash--p2" />}

      {/* Blue ghost (lingers from P2 end through P3) */}
      {(showBlueGhost || isP3) && (
        <div
          className={`glitch-blue-ghost ${
            isP2 ? 'glitch-blue-ghost--p2-end' : ''
          } ${isP3 ? 'glitch-blue-ghost--p3' : ''}`}
        >
          <div className="glitch-blue-ghost-shape" />
        </div>
      )}
    </div>
  );
}

export default BootGlitchOverlay;
