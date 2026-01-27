'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT 1 — Scope & Definitions
//
// Uses ONLY the five typographic tiers defined by Document 0:
// - t-monument (04) — Primary title
// - t-state    (03) — Section headers
// - t-archive  (02) — Definitions and body text
// - t-label    (01) — Section anchors and status
// - t-micro    (00) — Margin annotations
//
// NO ad-hoc font sizes. NO arbitrary Tailwind text utilities.
// ═══════════════════════════════════════════════════════════════════════════════

import { DocumentShell } from '@/components/document';

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT DATA
// ─────────────────────────────────────────────────────────────────────────────────

const METADATA = [
  'TYPE SYSTEM · V1',
  'ROOT 16 · RATIO 1.25',
  'REGISTRY: REMILIA',
];

const FOOTER = [
  'ISSUED 2026 · REMILIA',
  'INDEX: 0001',
];

const SECTIONS = [
  {
    id: '1',
    title: '1. DEFINITIONS',
    ref: 'REF: D1-1',
    definitions: [
      'Institution: a framework that outlives nodes.',
      'Node: an expressive artifact operating inside the framework.',
      'Document: a versioned unit of authority.',
    ],
  },
  {
    id: '2',
    title: '2. JURISDICTION',
    ref: 'REF: D1-2',
    definitions: [
      'The interface is typographic.',
      'Authority is communicated through constraint.',
    ],
  },
  {
    id: '3',
    title: '3. NODES',
    ref: 'REF: D1-3',
    definitions: [
      'Nodes may vary in style; the institution does not.',
    ],
  },
  {
    id: '4',
    title: '4. ARCHIVE FORMAT',
    ref: 'REF: D1-4',
    definitions: [
      'All revisions are additive and dated.',
    ],
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export default function Document1() {
  return (
    <DocumentShell
      documentId="1"
      title="SCOPE & DEFINITIONS"
      revision="REV 1"
      metadata={METADATA}
      footer={FOOTER}
    >
      {/* ═══════════════════════════════════════════════════════════════
          MONUMENT — Primary Title
      ═══════════════════════════════════════════════════════════════ */}
      <header className="document-section">
        <h1 className="t-monument t-monument--inline">REMILIA — SCOPE</h1>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          STATUS BLOCK — Label tier callouts
      ═══════════════════════════════════════════════════════════════ */}
      <div className="document-status">
        <span className="t-label t-label--status">STATUS: ACTIVE</span>
        <span className="t-label t-label--status">PROTOCOL: STABLE</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTIONS — State headers with Archive definitions
      ═══════════════════════════════════════════════════════════════ */}
      {SECTIONS.map((section) => (
        <section key={section.id} className="document-section document-section--annotated">
          {/* Main content column */}
          <div>
            {/* Section anchor + header */}
            <div className="t-state t-state--list">
              <span className="t-label t-label--anchor">§{section.id}.0</span>
              {section.title}
            </div>

            {/* Definitions */}
            <div className="document-definitions">
              {section.definitions.map((def, i) => (
                <p key={i} className="t-archive t-archive--def">
                  {def}
                </p>
              ))}
            </div>
          </div>

          {/* Right margin annotation */}
          <div className="t-micro t-micro--margin">
            {section.ref}
          </div>
        </section>
      ))}
    </DocumentShell>
  );
}
