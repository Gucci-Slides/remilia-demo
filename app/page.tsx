'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT 0 — Typographic Constitution
//
// Rendered as a PRINT DOCUMENT in a browser, not a webpage.
// Physical sheet of paper with programmable print/ink rules.
//
// STRUCTURE:
// - Document identifier block (top-left)
// - Header metadata (below identifier)
// - Typographic scale rows (vertical ladder, left-weighted)
// - Right marginalia tier labels (deep in annotation field)
// - Crop marks (print registration)
// - Reserved annotation field (right half, intentionally empty)
//
// PER-TIER INK VARIABLES (tunable in paper-print.css):
// --ink-04 (MONUMENT): highest density + registration ghost
// --ink-03 (STATE): normal, crisp
// --ink-02 (ARCHIVE): lighter, tighter tracking
// --ink-01 (LABEL): lighter still, wider tracking
// --ink-00 (MICRO): lightest, under-inked
//
// FONT STACK (FREE ONLY):
//   MONUMENT → Inter (Semibold, wide tracking)
//   STATE    → Inter (Medium)
//   ARCHIVE  → Source Serif 4
//   LABEL    → IBM Plex Mono
//   MICRO    → IBM Plex Mono
// ═══════════════════════════════════════════════════════════════════════════════

import './paper-print.css';
import './document-system.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────────
// SCALE LADDER DATA — Single source of truth for tier styles
// ─────────────────────────────────────────────────────────────────────────────────

const SCALE_ROWS = [
  { index: '04', role: 'MONUMENT', tier: 'monument' },
  { index: '03', role: 'STATE', tier: 'state' },
  { index: '02', role: 'ARCHIVE', tier: 'archive' },
  { index: '01', role: 'LABEL', tier: 'label' },
  { index: '00', role: 'MICRO', tier: 'micro' },
] as const;

const SPECIMEN_PHRASE = 'REMILIA';

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export default function Document0() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="paper-surface">
      {/* ═══════════════════════════════════════════════════════════════
          PAPER LAYERS — Grain, vignette, edge
      ═══════════════════════════════════════════════════════════════ */}
      <div className="paper-grain" aria-hidden="true" />
      <div className="paper-vignette" aria-hidden="true" />
      <div className="paper-edge" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════════
          CROP MARKS — Print registration
      ═══════════════════════════════════════════════════════════════ */}
      <div className="crop-marks" aria-hidden="true">
        <div className="crop-mark-print crop-mark-print--tl" />
        <div className="crop-mark-print crop-mark-print--tr" />
        <div className="crop-mark-print crop-mark-print--br" />
        <div className="crop-mark-print crop-mark-print--bl" />
        
        {/* Registration ticks (very faint) */}
        <div className="registration-tick registration-tick--tl" />
        <div className="registration-tick registration-tick--tr" />
        <div className="registration-tick registration-tick--br" />
        <div className="registration-tick registration-tick--bl" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ANNOTATION FIELD GUIDE — Very faint vertical rule (right)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="annotation-field-guide" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════════
          DOCUMENT AREA — Content safe zone (left-weighted)
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="document-area document-area--left-weighted"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 300ms ease-out',
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            DOCUMENT IDENTIFIER — Formal archival block
        ───────────────────────────────────────────────────────────── */}
        <div className="document-identifier">
          <span className="document-identifier-line">DOCUMENT 0</span>
          <span className="document-identifier-line">TYPOGRAPHIC CONSTITUTION</span>
          <span className="document-identifier-line">REV 1</span>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            HEADER METADATA — Technical specifications
        ───────────────────────────────────────────────────────────── */}
        <header className="document-meta">
          <span className="document-meta-line">TYPE SYSTEM · V1</span>
          <span className="document-meta-line">ROOT 16 · RATIO 1.25</span>
          <span className="document-meta-line">REMILIA COLLECTIVE</span>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            SCALE LADDER — Typographic specimen stack
        ───────────────────────────────────────────────────────────── */}
        <div className="scale-ladder">
          {SCALE_ROWS.map((row, i) => (
            <ScaleRow
              key={row.tier}
              index={row.index}
              role={row.role}
              tier={row.tier}
              phrase={SPECIMEN_PHRASE}
              isLast={i === SCALE_ROWS.length - 1}
            />
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FOOTER — Issuance statement + Archive link
        ───────────────────────────────────────────────────────────── */}
        <footer className="document-meta document-footer">
          <span className="document-meta-line">ISSUED 2026 · REMILIA</span>
          <Link href="/archive" className="document-link" style={{ marginTop: 'calc(var(--baseline-unit) * 3)' }}>
            ENTER ARCHIVE →
          </Link>
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SCALE ROW — Individual specimen row with per-tier print variance
// ─────────────────────────────────────────────────────────────────────────────────

interface ScaleRowProps {
  index: string;
  role: string;
  tier: string;
  phrase: string;
  isLast: boolean;
}

function ScaleRow({ index, role, tier, phrase, isLast }: ScaleRowProps) {
  const isMonument = tier === 'monument';
  
  return (
    <div 
      className={`scale-row-print ${!isLast ? 'scale-row-baseline' : ''}`}
    >
      {/* Left: Scale Index */}
      <div className={`scale-index-print scale-index-print--${tier}`}>
        {index}
      </div>
      
      {/* Center: Specimen Phrase */}
      <div className={`specimen-print specimen-print--${tier}`}>
        {/* Registration ghost for MONUMENT only */}
        {isMonument && (
          <span className="specimen-ghost" aria-hidden="true">
            {phrase}
          </span>
        )}
        <span className={isMonument ? 'specimen-primary' : undefined}>
          {phrase}
        </span>
      </div>
      
      {/* Right: Marginalia Role (deep in annotation field) */}
      <div className={`marginalia marginalia--${tier}`}>
        {role}
      </div>
    </div>
  );
}
