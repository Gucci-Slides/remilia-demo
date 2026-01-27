'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// REMILIA SPLASH — CRT Publisher Logo Screen
//
// Captured CRT broadcast aesthetic, not rendered logo:
// - ULTRA-THIN base glyphs (glow does the work)
// - Layered glow: cyan inner → blue mid → violet outer
// - Smiley as luminous blue mark
// - Capture softness, grain, scanline jitter
// ═══════════════════════════════════════════════════════════════════════════════

import './splash.css';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface RemiliaSplashProps {
  /** URL of the smiley emblem image */
  emblemUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function RemiliaSplash({
  emblemUrl = '/smile.png',
}: RemiliaSplashProps) {
  const wordmark = 'remilia';

  return (
    <main className="splash-container">
      {/* ═══ SCREEN ATMOSPHERE ═══ */}
      
      {/* Center bloom - faint luminance in the middle */}
      <div className="splash-center-bloom" aria-hidden="true" />
      
      {/* Vignette - edge darkening */}
      <div className="splash-vignette" aria-hidden="true" />
      
      {/* Diagonal glare band */}
      <div className="splash-glare" aria-hidden="true" />
      
      {/* Film grain */}
      <div className="splash-grain" aria-hidden="true" />
      
      {/* Scanlines with opacity jitter */}
      <div className="splash-scanlines" aria-hidden="true" />

      {/* ═══ LOCKUP (WORDMARK + EMBLEM) ═══ */}
      <div className="splash-lockup">
        {/* Wordmark wrapper with outer violet bloom */}
        <div className="splash-wordmark-wrap">
          {/* Chromatic aberration layer */}
          <div className="splash-wordmark-chroma" data-text={wordmark}>
            <h1 className="splash-wordmark">
              {wordmark}
            </h1>
          </div>
        </div>

        {/* Smiley emblem - converted to blue spectral family */}
        <div className="splash-emblem">
          <img
            src={emblemUrl}
            alt="Remilia"
            className="splash-emblem-img"
            draggable={false}
          />
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export default RemiliaSplash;
