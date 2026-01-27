'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE INDEX TABLE — Document listing table
//
// Paper-native table with:
// - Columns: DocId, Title, Rev, Status, Date, Ref
// - Title truncation with dotted leader
// - Superseded rows with subline notice
// - Variant rows indented beneath primary
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import { 
  type ArchiveEntry, 
  formatRev, 
  getStatusClass,
} from '@/lib/archive/revisioning';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ArchiveIndexTableProps {
  /** List of entries to display */
  entries: ArchiveEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function ArchiveIndexTable({ entries }: ArchiveIndexTableProps) {
  return (
    <div className="archive-table">
      {entries.map((entry) => (
        <ArchiveTableRow key={entry.variantId || entry.docId} entry={entry} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// TABLE ROW
// ─────────────────────────────────────────────────────────────────────────────────

function ArchiveTableRow({ entry }: { entry: ArchiveEntry }) {
  const statusClass = getStatusClass(entry.status);
  const isVariant = entry.isVariant || false;
  const isSuperseded = entry.status === 'SUPERSEDED';
  const isWithdrawn = entry.status === 'WITHDRAWN';
  const isDemoted = isVariant || isSuperseded || isWithdrawn;

  const rowClass = [
    'archive-table-row',
    isVariant ? 'archive-table-row--variant' : '',
    isDemoted ? 'archive-table-row--demoted' : '',
  ].filter(Boolean).join(' ');

  return (
    <Link href={entry.href} className={rowClass}>
      {/* DOC ID */}
      <span className="archive-table-docid">
        {isVariant && <span className="archive-table-indent" aria-hidden="true">└</span>}
        {entry.variantId || entry.docId}
      </span>

      {/* TITLE with truncation */}
      <span className="archive-table-title-cell">
        <span className="archive-table-title">{entry.title}</span>
        <span className="archive-table-leader" aria-hidden="true" />
      </span>

      {/* REV */}
      <span className="archive-table-rev">{formatRev(entry.rev)}</span>

      {/* STATUS */}
      <span className={`archive-table-status ${statusClass}`}>{entry.status}</span>

      {/* DATE */}
      <span className="archive-table-date">{entry.date}</span>

      {/* REF */}
      <span className="archive-table-ref">{entry.ref}</span>

      {/* Superseded notice */}
      {entry.supersededBy && (
        <span className="archive-table-superseded">
          SUPERSEDED BY: {entry.supersededBy.docId} REV {entry.supersededBy.rev}
        </span>
      )}
    </Link>
  );
}

export default ArchiveIndexTable;
