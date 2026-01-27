// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE INDEX DATA — Document entries for the archive index
//
// Contains revision/supersession model and sample document data.
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type DocStatus = 'ACTIVE' | 'SUPERSEDED' | 'DRAFT';

export interface ArchiveIndexEntry {
  /** Document ID (e.g., "D0-1", "D1-0") */
  docId: string;
  /** Document title */
  title: string;
  /** Revision string (e.g., "1", "1.1", "2") */
  rev: string;
  /** Document status */
  status: DocStatus;
  /** Issue date (ISO format) */
  date: string;
  /** Reference code for linking */
  refCode: string;
  /** Route path */
  href: string;
  /** If superseded, the document that replaces it */
  supersededBy?: string;
  /** Related document chain (for right margin display) */
  relatedDocs?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// ARCHIVE INDEX ENTRIES — Sample data
// ─────────────────────────────────────────────────────────────────────────────────

export const ARCHIVE_INDEX: ArchiveIndexEntry[] = [
  {
    docId: 'D0-1',
    title: 'TYPOGRAPHIC CONSTITUTION',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-15',
    refCode: 'REF: D0-1',
    href: '/archive',
    relatedDocs: ['D0-0', 'D0-1'],
  },
  {
    docId: 'D0-0',
    title: 'REMILIA — FOUNDING CHARTER',
    rev: '1',
    status: 'ACTIVE',
    date: '2025-12-01',
    refCode: 'REF: D0-0',
    href: '/document/0',
  },
  {
    docId: 'D1-0',
    title: 'SCOPE & DEFINITIONS',
    rev: '2',
    status: 'ACTIVE',
    date: '2026-01-20',
    refCode: 'REF: D1-0',
    href: '/document/1',
    relatedDocs: ['D1-0', 'D1-0.1'],
  },
  {
    docId: 'D1-0.1',
    title: 'SCOPE & DEFINITIONS',
    rev: '1',
    status: 'SUPERSEDED',
    date: '2025-11-15',
    refCode: 'REF: D1-0.1',
    href: '/document/1?rev=1',
    supersededBy: 'D1-0 REV 2',
  },
  {
    docId: 'D2-0',
    title: 'NODE CLASSIFICATION PROTOCOL',
    rev: '1.1',
    status: 'ACTIVE',
    date: '2026-01-22',
    refCode: 'REF: D2-0',
    href: '/document/2',
  },
  {
    docId: 'D2-1',
    title: 'NODE EXPRESSIVE GUIDELINES',
    rev: '1',
    status: 'DRAFT',
    date: '2026-01-25',
    refCode: 'REF: D2-1',
    href: '/document/2-1',
  },
  {
    docId: 'D3-0',
    title: 'ARCHIVE FORMAT SPECIFICATION',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-18',
    refCode: 'REF: D3-0',
    href: '/document/3',
  },
  {
    docId: 'D3-1',
    title: 'REVISION CONTROL PROTOCOL',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-19',
    refCode: 'REF: D3-1',
    href: '/document/3-1',
  },
  {
    docId: 'D4-0',
    title: 'INK DENSITY AUTHORITY MODEL',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-21',
    refCode: 'REF: D4-0',
    href: '/document/4',
  },
  {
    docId: 'D5-0',
    title: 'RESPONSIVE BEHAVIOR RULES',
    rev: '1',
    status: 'DRAFT',
    date: '2026-01-27',
    refCode: 'REF: D5-0',
    href: '/document/5',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// CURRENT DOCUMENT METADATA (for D0-1 index cover)
// ─────────────────────────────────────────────────────────────────────────────────

export const CURRENT_DOC = {
  docId: 'D0-1',
  title: 'REMILIA ARCHIVE',
  rev: '1',
  status: 'ACTIVE' as DocStatus,
  registry: 'REMILIA',
  issuedYear: 2026,
  relatedDocs: ['D0-0', 'D0-1'],
};

// ─────────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Format revision for display.
 */
export function formatRev(rev: string): string {
  return `REV ${rev}`;
}

/**
 * Get status class for styling.
 */
export function getStatusClass(status: DocStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'status--active';
    case 'SUPERSEDED':
      return 'status--superseded';
    case 'DRAFT':
      return 'status--draft';
    default:
      return '';
  }
}

/**
 * Format date for display.
 */
export function formatDate(isoDate: string): string {
  return isoDate; // Already in YYYY-MM-DD format
}
