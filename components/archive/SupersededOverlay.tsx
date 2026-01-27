'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// SUPERSEDED OVERLAY — Watermark for superseded documents
//
// Adds visible "SUPERSEDED" overlay without destroying layout.
// Only renders when document status is SUPERSEDED.
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import type { DocumentMeta } from '@/lib/archive/types';
import { formatSupersededNotice, getDocumentUrl } from '@/lib/archive/revision';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface SupersededOverlayProps {
  /** Document metadata */
  meta: DocumentMeta;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function SupersededOverlay({ meta }: SupersededOverlayProps) {
  // Only render if superseded
  if (meta.status !== 'SUPERSEDED' || !meta.supersededBy) {
    return null;
  }

  const notice = formatSupersededNotice(meta.supersededBy);
  const url = getDocumentUrl(meta.supersededBy.docCode);

  return (
    <div className="archive-superseded-overlay" aria-label="This document has been superseded">
      <span className="archive-superseded-watermark">SUPERSEDED</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SUPERSEDED NOTICE — Inline notice below title
// ─────────────────────────────────────────────────────────────────────────────────

interface SupersededNoticeProps {
  meta: DocumentMeta;
}

export function SupersededNotice({ meta }: SupersededNoticeProps) {
  if (meta.status !== 'SUPERSEDED' || !meta.supersededBy) {
    return null;
  }

  const notice = formatSupersededNotice(meta.supersededBy);
  const url = getDocumentUrl(meta.supersededBy.docCode);

  return (
    <div className="archive-superseded-notice">
      <span className="archive-superseded-notice-text">{notice}</span>
      <Link href={url} className="archive-superseded-notice-link">
        VIEW CURRENT →
      </Link>
    </div>
  );
}

export default SupersededOverlay;
