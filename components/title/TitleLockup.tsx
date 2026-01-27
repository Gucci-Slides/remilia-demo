'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// TITLE LOCKUP — PS2 System Identity Screen
//
// "Light in darkness" — not "text on black"
//
// THIN typography with perceived thickness from LAYERED GLOW.
// Cold, authoritative, quiet. Console identity, not marketing.
//
// Glow stack (5 layers, bottom to top):
// 1. Far outer glow (blur 50px, opacity 0.18, #2A3CFF) — expands presence
// 2. Outer glow (blur 28px, opacity 0.25, #2F4BFF)
// 3. Mid glow (blur 10px, opacity 0.4, #4A6BFF)
// 4. Inner glow (blur 3px, opacity 0.6, #5A7DFF)
// 5. Core text (no blur, opacity 0.8, #A8C6FF) — fragile, not dominant
//
// Reference check:
// - Without glow: text should look almost too thin
// - Without core: glow should still spell "REMILIA"
// ═══════════════════════════════════════════════════════════════════════════════

import './title.css';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface TitleLockupProps {
  /** Main title text */
  title?: string;
  /** Subtext under the title */
  subtext?: string;
  /** Enable mount animation */
  animate?: boolean;
  /** Enable micro flicker on glow layers */
  flicker?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function TitleLockup({
  title = 'REMILIA',
  subtext = '',
  animate = true,
  flicker = true,
}: TitleLockupProps) {
  const flickerClass = flicker ? 'glow-flicker' : '';

  return (
    <div className="title-root">
      {/* Vignette overlay */}
      <div className="title-vignette" />

      {/* Scanlines overlay */}
      <div className="title-scanlines" />

      {/* Main content */}
      <div className={`remilia-wrap ${animate ? 'title-animate-in' : ''}`}>
        {/* Title container with stacked glow layers */}
        <div style={{ position: 'relative' }}>
          {/* Layer 1: Far outer glow (barely visible, expands presence) */}
          <span 
            className={`remilia-text-base remilia-glow-far ${flickerClass}`}
            aria-hidden="true"
          >
            {title}
          </span>

          {/* Layer 2: Outer glow (largest visible blur, diffuse) */}
          <span 
            className={`remilia-text-base remilia-glow-outer ${flickerClass}`}
            aria-hidden="true"
          >
            {title}
          </span>

          {/* Layer 3: Mid glow */}
          <span 
            className={`remilia-text-base remilia-glow-mid ${flickerClass}`}
            aria-hidden="true"
          >
            {title}
          </span>

          {/* Layer 4: Inner glow (small blur, close to text) */}
          <span 
            className={`remilia-text-base remilia-glow-inner ${flickerClass}`}
            aria-hidden="true"
          >
            {title}
          </span>

          {/* Layer 5: Core text (crisp, fragile, not dominant) */}
          <h1 className="remilia-text-base remilia-core">
            {title}
          </h1>
        </div>

        {/* Subtext */}
        {subtext && (
          <p className={`title-subtext ${animate ? 'title-animate-in-delay' : ''}`}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export default TitleLockup;
