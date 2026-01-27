'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// REVISION BADGE — Displays revision and status
//
// Formats REV and status in a consistent badge style.
// ═══════════════════════════════════════════════════════════════════════════════

import type { DocumentMeta } from '@/lib/archive/types';
import { formatRevision } from '@/lib/archive/revision';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface RevisionBadgeProps {
  /** Revision string */
  rev: string;
  /** Document status */
  status: DocumentMeta['status'];
  /** Optional protocol */
  protocol?: DocumentMeta['protocol'];
  /** Show status label */
  showStatus?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function RevisionBadge({
  rev,
  status,
  protocol,
  showStatus = true,
}: RevisionBadgeProps) {
  const statusClass = `archive-revision-badge--${status.toLowerCase()}`;
  
  return (
    <div className={`archive-revision-badge ${statusClass}`}>
      <span className="archive-revision-badge-label">
        {formatRevision(rev)}
      </span>
      {showStatus && (
        <span className="archive-revision-badge-value">
          {status}
          {protocol && ` · ${protocol}`}
        </span>
      )}
    </div>
  );
}

export default RevisionBadge;
