'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE FRAME — Individual page container with header/footer
//
// Each PageFrame includes:
// - Top header: docCode + registry + rev (left), PAGE NN / TT (center)
// - Main content area: constrained height, uses typographic tiers
// - Bottom footer: ISSUED YYYY · REGISTRY (left), optional refs (right)
// ═══════════════════════════════════════════════════════════════════════════════

import { ReactNode, useEffect, useRef, useState } from 'react';
import type { DocumentMeta } from '@/lib/archive/types';
import { formatRevision } from '@/lib/archive/revision';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface PageFrameProps {
  /** Document metadata */
  meta: DocumentMeta;
  /** Current page number */
  pageNumber: number;
  /** Total pages */
  totalPages: number;
  /** Whether this is the first page */
  isFirstPage?: boolean;
  /** Whether this is the last page */
  isLastPage?: boolean;
  /** Optional right footer content (ref codes) */
  footerRight?: string;
  /** Page content */
  children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function PageFrame({
  meta,
  pageNumber,
  totalPages,
  isFirstPage = false,
  isLastPage = false,
  footerRight,
  children,
}: PageFrameProps) {
  const frameRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Subtle focus effect when page is near top of viewport
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Consider "focused" when more than 50% visible in upper half
          setIsFocused(entry.isIntersecting && entry.intersectionRatio > 0.3);
        });
      },
      {
        rootMargin: '-10% 0px -50% 0px',
        threshold: [0, 0.3, 0.5, 0.7, 1],
      }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Format page numbers with leading zeros
  const formatPageNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <article
      ref={frameRef}
      className={`archive-page-frame ${isFocused ? 'archive-page-frame--focused' : ''}`}
      data-page={pageNumber}
    >
      {/* ═══════════════════════════════════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════════════════════════════════ */}
      <header className="archive-page-header">
        <div className="archive-page-header-left">
          {meta.docCode} · {meta.registry} · {formatRevision(meta.rev)}
        </div>
        <div className="archive-page-header-center">
          PAGE {formatPageNum(pageNumber)} / {formatPageNum(totalPages)}
        </div>
        <div className="archive-page-header-right">
          {meta.status}
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE CONTENT
      ═══════════════════════════════════════════════════════════════ */}
      <div className="archive-content">
        {children}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="archive-page-footer">
        <div className="archive-page-footer-left">
          ISSUED {meta.issuedYear} · {meta.registry}
        </div>
        {footerRight && (
          <div className="archive-page-footer-right">
            {footerRight}
          </div>
        )}
      </footer>
    </article>
  );
}

export default PageFrame;
