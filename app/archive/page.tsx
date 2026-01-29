'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE THRESHOLD — Type Scale Calibration
//
// A ritual calibration document. The user is measured, not welcomed.
// Each tier announces itself. The scale is demonstrated before entry.
//
// NO animation. NO parallax. NO easing.
// ═══════════════════════════════════════════════════════════════════════════════

import '@/app/archive-index.css';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────────
// TIER DATA
// ─────────────────────────────────────────────────────────────────────────────────

const TIERS = [
  { id: 'tier-iv', label: 'TIER IV — MONUMENT', text: 'REMILIA', className: 'threshold-tier--monument' },
  { id: 'tier-iii', label: 'TIER III — STATE', text: 'REMILIA STATE', className: 'threshold-tier--state' },
  { id: 'tier-ii', label: 'TIER II — ARCHIVE', text: 'REMILIA ARCHIVE', className: 'threshold-tier--archive' },
  { id: 'tier-i', label: 'TIER I — LABEL', text: 'REMILIA INDEX', className: 'threshold-tier--label' },
  { id: 'tier-0', label: 'TIER 0 — MICRO', text: 'REMILIA REF', className: 'threshold-tier--micro' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────────

export default function ArchiveThresholdPage() {
  return (
    <div className="threshold-container">
      {/* Crop marks */}
      <div className="threshold-crop-marks" aria-hidden="true">
        <div className="threshold-crop-mark threshold-crop-mark--tl" />
        <div className="threshold-crop-mark threshold-crop-mark--tr" />
        <div className="threshold-crop-mark threshold-crop-mark--br" />
        <div className="threshold-crop-mark threshold-crop-mark--bl" />
      </div>

      {/* Right vertical rule */}
      <div className="threshold-right-rule" aria-hidden="true" />

      {/* Main content field */}
      <main className="threshold-field">
        {/* Left stamp */}
        <div className="threshold-stamp">
          <span className="threshold-stamp-line">DOCUMENT T0-0</span>
          <span className="threshold-stamp-line">TYPE CALIBRATION</span>
          <span className="threshold-stamp-line">REV 1</span>
        </div>

        {/* Right margin tier labels */}
        <div className="threshold-margin-labels" aria-hidden="true">
          {TIERS.map((tier) => (
            <span 
              key={tier.id} 
              className="threshold-margin-label"
              data-tier={tier.id}
            >
              {tier.label}
            </span>
          ))}
        </div>

        {/* Type scale ladder */}
        <section className="threshold-ladder" aria-label="Typographic Scale">
          {TIERS.map((tier) => (
            <div 
              key={tier.id} 
              className={`threshold-tier ${tier.className}`}
              data-tier={tier.id}
            >
              <span className="threshold-tier-text">{tier.text}</span>
            </div>
          ))}
        </section>

        {/* Entry inscription */}
        <div className="threshold-entry">
          <Link href="/archive/index" className="threshold-entry-inscription">
            PROCEED TO ARCHIVE
          </Link>
        </div>

        {/* Footer */}
        <footer className="threshold-footer">
          <span className="threshold-footer-left">ISSUED 2026 · REMILIA</span>
          <span className="threshold-footer-right">DOC T0-0 · REV 1</span>
        </footer>
      </main>
    </div>
  );
}
