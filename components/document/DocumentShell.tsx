'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT SHELL — Reusable archival document layout
//
// Renders the consistent paper surface for all documents in the archive:
// - Paper background + grain/vignette (same as Document 0)
// - Crop marks (same as Document 0)
// - Consistent margins/padding
// - Top-left metadata block slot
// - Right marginal annotation column slot
// - Main content column aligned to grid
//
// USAGE:
// <DocumentShell
//   documentId="1"
//   title="SCOPE & DEFINITIONS"
//   revision="REV 1"
//   metadata={['TYPE SYSTEM · V1', 'ROOT 16 · RATIO 1.25', 'REGISTRY: REMILIA']}
//   footer={['ISSUED 2026 · REMILIA', 'INDEX: 0001']}
// >
//   {children}
// </DocumentShell>
// ═══════════════════════════════════════════════════════════════════════════════

import '@/app/paper-print.css';
import '@/app/document-system.css';
import { useEffect, useState, ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface DocumentShellProps {
  /** Document number (e.g., "0", "1", "2") */
  documentId: string;
  /** Document title (appears below DOCUMENT X) */
  title: string;
  /** Revision string (e.g., "REV 1") */
  revision?: string;
  /** Array of metadata lines for header */
  metadata?: string[];
  /** Array of footer lines */
  footer?: string[];
  /** Main content */
  children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function DocumentShell({
  documentId,
  title,
  revision = 'REV 1',
  metadata = [],
  footer = [],
  children,
}: DocumentShellProps) {
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
          <span className="document-identifier-line">DOCUMENT {documentId}</span>
          <span className="document-identifier-line">{title}</span>
          <span className="document-identifier-line">{revision}</span>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            HEADER METADATA — Technical specifications
        ───────────────────────────────────────────────────────────── */}
        {metadata.length > 0 && (
          <header className="document-meta">
            {metadata.map((line, i) => (
              <span key={i} className="document-meta-line">{line}</span>
            ))}
          </header>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MAIN CONTENT
        ───────────────────────────────────────────────────────────── */}
        <div className="document-content">
          {children}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FOOTER — Issuance statement
        ───────────────────────────────────────────────────────────── */}
        {footer.length > 0 && (
          <footer className="document-meta document-footer">
            {footer.map((line, i) => (
              <span key={i} className="document-meta-line">{line}</span>
            ))}
          </footer>
        )}
      </div>
    </main>
  );
}

export default DocumentShell;
