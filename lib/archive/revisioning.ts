// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE REVISIONING — Status resolution and grouping
//
// Implements formal revision rules:
// - REV format: major (1, 2), minor (1.1, 1.2)
// - Status: ACTIVE, DRAFT, SUPERSEDED, WITHDRAWN
// - Automatic status resolution based on dates
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type DocStatus = 'ACTIVE' | 'DRAFT' | 'SUPERSEDED' | 'WITHDRAWN';

export interface ArchiveEntry {
  /** Primary document ID (e.g., "D1-0") */
  docId: string;
  /** Variant ID for superseded versions (e.g., "D1-0.1") */
  variantId?: string;
  /** Document title */
  title: string;
  /** Revision string (e.g., "1", "1.1", "2") */
  rev: string;
  /** Document status */
  status: DocStatus;
  /** Issue date (YYYY-MM-DD) */
  date: string;
  /** Reference code */
  ref: string;
  /** Route path */
  href: string;
  /** If superseded, reference to superseding doc */
  supersededBy?: { docId: string; rev: string };
  /** Is this a variant (child) entry */
  isVariant?: boolean;
}

export interface GroupedEntry {
  primary: ArchiveEntry;
  variants: ArchiveEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// REVISION PARSING
// ─────────────────────────────────────────────────────────────────────────────────

export interface ParsedRev {
  major: number;
  minor: number;
  patch: number;
  display: string;
}

export function parseRev(rev: string): ParsedRev {
  const parts = rev.split('.').map((p) => parseInt(p, 10) || 0);
  return {
    major: parts[0] || 1,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    display: rev,
  };
}

export function formatRev(rev: string): string {
  return `REV ${rev}`;
}

export function compareRevs(a: string, b: string): number {
  const pa = parseRev(a);
  const pb = parseRev(b);
  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  return pa.patch - pb.patch;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STATUS HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

export function getStatusColor(status: DocStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'var(--status-active)';
    case 'DRAFT':
      return 'var(--status-draft)';
    case 'SUPERSEDED':
      return 'var(--status-superseded)';
    case 'WITHDRAWN':
      return 'var(--status-withdrawn)';
    default:
      return 'var(--ink-2)';
  }
}

export function getStatusClass(status: DocStatus): string {
  return `status--${status.toLowerCase()}`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// GROUPING + STATUS RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Extract base document ID from a variant ID.
 * "D1-0.1" → "D1-0"
 * "D1-0" → "D1-0"
 */
function getBaseDocId(docId: string): string {
  // Match pattern like D1-0.1 → D1-0
  const match = docId.match(/^(D\d+-\d+)/);
  return match ? match[1] : docId;
}

/**
 * Group entries by base document ID.
 * Primary = latest ACTIVE revision.
 * Variants = older/superseded revisions.
 */
export function groupEntries(entries: ArchiveEntry[]): GroupedEntry[] {
  const groups = new Map<string, ArchiveEntry[]>();

  // Group by base doc ID
  entries.forEach((entry) => {
    const baseId = getBaseDocId(entry.variantId || entry.docId);
    const group = groups.get(baseId) || [];
    group.push(entry);
    groups.set(baseId, group);
  });

  // Process each group
  const result: GroupedEntry[] = [];

  groups.forEach((group) => {
    // Sort by date (newest first), then by rev (highest first)
    group.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return compareRevs(b.rev, a.rev);
    });

    // Find primary (newest ACTIVE)
    const activeIdx = group.findIndex((e) => e.status === 'ACTIVE');
    const primaryIdx = activeIdx >= 0 ? activeIdx : 0;
    const primary = group[primaryIdx];

    // Variants are everything else
    const variants = group
      .filter((_, i) => i !== primaryIdx)
      .map((v) => ({ ...v, isVariant: true }));

    result.push({ primary, variants });
  });

  // Sort groups by primary date (newest first)
  result.sort((a, b) => b.primary.date.localeCompare(a.primary.date));

  return result;
}

/**
 * Flatten grouped entries back to a list for rendering.
 * Each primary is followed by its variants (indented).
 */
export function flattenGroups(groups: GroupedEntry[]): ArchiveEntry[] {
  const result: ArchiveEntry[] = [];

  groups.forEach(({ primary, variants }) => {
    result.push(primary);
    variants.forEach((v) => result.push(v));
  });

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────────────────────────────────────────

export const ARCHIVE_ENTRIES: ArchiveEntry[] = [
  {
    docId: 'D0-0',
    title: 'FOUNDING CHARTER',
    rev: '1',
    status: 'ACTIVE',
    date: '2025-12-01',
    ref: 'D0-0',
    href: '/document/0',
  },
  {
    docId: 'D0-1',
    title: 'TYPOGRAPHIC CONSTITUTION',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-15',
    ref: 'D0-1',
    href: '/document/0-1',
  },
  {
    docId: 'D1-0',
    title: 'SCOPE & DEFINITIONS',
    rev: '2',
    status: 'ACTIVE',
    date: '2026-01-20',
    ref: 'D1-0',
    href: '/document/1',
  },
  {
    docId: 'D1-0',
    variantId: 'D1-0.1',
    title: 'SCOPE & DEFINITIONS',
    rev: '1',
    status: 'SUPERSEDED',
    date: '2025-11-15',
    ref: 'D1-0.1',
    href: '/document/1?rev=1',
    supersededBy: { docId: 'D1-0', rev: '2' },
    isVariant: true,
  },
  {
    docId: 'D2-0',
    title: 'NODE CLASSIFICATION',
    rev: '1.1',
    status: 'ACTIVE',
    date: '2026-01-22',
    ref: 'D2-0',
    href: '/document/2',
  },
  {
    docId: 'D2-1',
    title: 'NODE EXPRESSIVE GUIDELINES',
    rev: '1',
    status: 'DRAFT',
    date: '2026-01-25',
    ref: 'D2-1',
    href: '/document/2-1',
  },
  {
    docId: 'D3-0',
    title: 'ARCHIVE FORMAT SPEC',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-18',
    ref: 'D3-0',
    href: '/document/3',
  },
  {
    docId: 'D3-1',
    title: 'REVISION CONTROL',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-19',
    ref: 'D3-1',
    href: '/document/3-1',
  },
  {
    docId: 'D4-0',
    title: 'INK DENSITY MODEL',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-21',
    ref: 'D4-0',
    href: '/document/4',
  },
  {
    docId: 'D5-0',
    title: 'RESPONSIVE RULES',
    rev: '1',
    status: 'DRAFT',
    date: '2026-01-27',
    ref: 'D5-0',
    href: '/document/5',
  },
  {
    docId: 'D6-0',
    title: 'PAPER TEXTURE SPEC',
    rev: '1',
    status: 'ACTIVE',
    date: '2026-01-23',
    ref: 'D6-0',
    href: '/document/6',
  },
  {
    docId: 'D7-0',
    title: 'MARGIN SYSTEM',
    rev: '1',
    status: 'WITHDRAWN',
    date: '2025-10-01',
    ref: 'D7-0',
    href: '/document/7',
  },
];
