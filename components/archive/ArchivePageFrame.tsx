'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE PAGE FRAME — Individual page in the paper stack
//
// Renders a single "page" with:
// - Crop marks (corners)
// - Paper margins + grid
// - Page header (PAGE xx / yy)
// - Page footer (ISSUED 2026 · REMILIA / DOC D0-0 · REV 1)
// - Content slot
//
// Pages feel like continuous paper sheets in a stack.
// ═══════════════════════════════════════════════════════════════════════════════

import { ReactNode, useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ArchivePageFrameProps {
  /** Current page number */
  pageNumber: number;
  /** Total pages */
  totalPages: number;
  /** Document ID for footer */
  docId?: string;
  /** Revision for footer */
  rev?: string;
  /** Issued year */
  issuedYear?: string;
  /** Registry name */
  registry?: string;
  /** Is this the first page (shows cover header) */
  isFirstPage?: boolean;
  /** Page content */
  children: ReactNode;
  /** Callback when page enters view */
  onEnterView?: (pageNumber: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function ArchivePageFrame({
  pageNumber,
  totalPages,
  docId = 'D0-0',
  rev = '1',
  issuedYear = '2026',
  registry = 'REMILIA',
  isFirstPage = false,
  children,
  onEnterView,
}: ArchivePageFrameProps) {
  const pageRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver to track when page enters view
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setIsInView(true);
            onEnterView?.(pageNumber);
          } else if (entry.intersectionRatio < 0.1) {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
      }
    );

    observer.observe(page);
    return () => observer.disconnect();
  }, [pageNumber, onEnterView]);

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <article
      ref={pageRef}
      className={`archive-page-frame ${isInView ? 'archive-page-frame--active' : ''}`}
      data-page={pageNumber}
    >
      {/* ═══════════════════════════════════════════════════════════════
          CROP MARKS — Corners
      ═══════════════════════════════════════════════════════════════ */}
      <div className="archive-crop-marks" aria-hidden="true">
        <div className="archive-crop-mark archive-crop-mark--tl" />
        <div className="archive-crop-mark archive-crop-mark--tr" />
        <div className="archive-crop-mark archive-crop-mark--br" />
        <div className="archive-crop-mark archive-crop-mark--bl" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT VERTICAL RULE
      ═══════════════════════════════════════════════════════════════ */}
      <div className="archive-right-rule" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════════
          PAGE HEADER — Top center
      ═══════════════════════════════════════════════════════════════ */}
      <header className="archive-page-header">
        <span className="archive-page-number">
          PAGE {formatNum(pageNumber)} / {formatNum(totalPages)}
        </span>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          LEFT STAMP — Document identifier (sticky within page)
      ═══════════════════════════════════════════════════════════════ */}
      {isFirstPage && (
        <div className="archive-left-stamp">
          <span className="archive-left-stamp-line">DOCUMENT {docId}</span>
          <span className="archive-left-stamp-line">ARCHIVE INDEX</span>
          <span className="archive-left-stamp-line">REV {rev}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE CONTENT
      ═══════════════════════════════════════════════════════════════ */}
      <div className="archive-page-content">
        {children}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="archive-page-footer">
        <span className="archive-page-footer-left">
          ISSUED {issuedYear} · {registry}
        </span>
        <span className="archive-page-footer-right">
          DOC {docId} · REV {rev}
        </span>
      </footer>
    </article>
  );
}

export default ArchivePageFrame;
