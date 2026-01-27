'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// GLITCH OVERLAY — Full-screen CRT glitch effect layers
//
// Stacked overlay effects triggered by phase changes:
// - Scanlines (intensified)
// - RGB split (chromatic aberration)
// - White flash
// - Tear bars (horizontal displacement)
// - Vertical roll
// - Collapse line
// - Noise
// - Fade to black
// ═══════════════════════════════════════════════════════════════════════════════

import './boot-glitch.css';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type GlitchPhase = 
  | 'idle'
  | 'glitch-start'
  | 'glitch-flash'
  | 'glitch-tear'
  | 'glitch-collapse'
  | 'fade-out'
  | 'done';

interface GlitchOverlayProps {
  phase: GlitchPhase;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function GlitchOverlay({ phase }: GlitchOverlayProps) {
  const isActive = phase !== 'idle' && phase !== 'done';
  const isGlitching = phase !== 'idle' && phase !== 'fade-out' && phase !== 'done';
  const showFlash = phase === 'glitch-flash';
  const showTears = phase === 'glitch-tear';
  const showCollapse = phase === 'glitch-collapse';
  const showFadeOut = phase === 'fade-out' || phase === 'done';

  return (
    <div className={`glitch-overlay ${isActive ? 'glitch-overlay--active' : ''}`}>
      {/* Scanlines Layer */}
      <div 
        className={`glitch-scanlines ${isGlitching ? 'glitch-scanlines--hard' : ''}`}
      />

      {/* RGB Split Layer */}
      <div 
        className={`glitch-rgb-split ${isGlitching ? 'glitch-rgb-split--active' : ''}`}
      />

      {/* Vertical Roll Layer */}
      <div 
        className={`glitch-roll ${isGlitching ? 'glitch-roll--active' : ''}`}
      />

      {/* Noise Layer */}
      <div 
        className={`glitch-noise ${isGlitching ? 'glitch-noise--active' : ''}`}
      />

      {/* White Flash Layer */}
      <div 
        className={`glitch-flash ${showFlash ? 'glitch-flash--active' : ''}`}
      />

      {/* Tear Bars */}
      <div className={`glitch-tear glitch-tear-1 ${showTears ? 'glitch-tear--active' : ''}`} />
      <div className={`glitch-tear glitch-tear-2 ${showTears ? 'glitch-tear--active' : ''}`} />
      <div className={`glitch-tear glitch-tear-3 ${showTears ? 'glitch-tear--active' : ''}`} />
      <div className={`glitch-tear glitch-tear-4 ${showTears ? 'glitch-tear--active' : ''}`} />
      <div className={`glitch-tear glitch-tear-5 ${showTears ? 'glitch-tear--active' : ''}`} />

      {/* Collapse Effect */}
      <div 
        className={`glitch-collapse ${showCollapse ? 'glitch-collapse--active' : ''}`}
      />
      <div 
        className={`glitch-collapse-line ${showCollapse ? 'glitch-collapse-line--active' : ''}`}
      />

      {/* Fade to Black */}
      <div 
        className={`glitch-fade-black ${showFadeOut ? 'glitch-fade-black--active' : ''}`}
      />
    </div>
  );
}

export default GlitchOverlay;
