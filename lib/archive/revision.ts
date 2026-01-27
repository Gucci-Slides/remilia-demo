// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE SYSTEM — Revision Logic
//
// Implements formal revisioning rules:
// R0 — REV Format (major.minor)
// R1 — Revision Classification (minor vs major changes)
// R2 — SUPERSEDED State handling
// R3 — Revision Chain Rendering
// R4 — Change Log formatting
// ═══════════════════════════════════════════════════════════════════════════════

import type { DocumentMeta } from './types';

// ─────────────────────────────────────────────────────────────────────────────────
// R0 — REV FORMAT
// ─────────────────────────────────────────────────────────────────────────────────

export interface ParsedRevision {
  major: number;
  minor: number;
  display: string;
}

/**
 * Parse a revision string into major/minor components.
 * "1" → { major: 1, minor: 0, display: "1" }
 * "1.2" → { major: 1, minor: 2, display: "1.2" }
 * "2.0" → { major: 2, minor: 0, display: "2.0" }
 */
export function parseRevision(rev: string): ParsedRevision {
  const parts = rev.split('.');
  const major = parseInt(parts[0], 10) || 1;
  const minor = parts[1] ? parseInt(parts[1], 10) : 0;
  
  return {
    major,
    minor,
    display: minor > 0 || parts.length > 1 ? `${major}.${minor}` : `${major}`,
  };
}

/**
 * Format a revision for display.
 * Always shows as "REV X" or "REV X.Y"
 */
export function formatRevision(rev: string): string {
  const parsed = parseRevision(rev);
  return `REV ${parsed.display}`;
}

/**
 * Increment revision.
 * If type is 'minor': 1 → 1.1, 1.1 → 1.2
 * If type is 'major': 1.2 → 2, 2.1 → 3
 */
export function incrementRevision(
  currentRev: string,
  type: 'minor' | 'major'
): string {
  const parsed = parseRevision(currentRev);
  
  if (type === 'major') {
    return `${parsed.major + 1}`;
  } else {
    return `${parsed.major}.${parsed.minor + 1}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// R1 — REVISION CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────────

export type ChangeType =
  | 'wording'       // Minor: phrasing changes
  | 'spacing'       // Minor: layout adjustments
  | 'clarification' // Minor: explanatory additions
  | 'structure'     // Minor: small reorganization
  | 'scope'         // Major: changed scope
  | 'hierarchy'     // Major: changed document hierarchy
  | 'definition'    // Major: changed definitions
  | 'rule'          // Major: rule changes that alter meaning
  | 'supersede';    // Major: superseding another document

const MAJOR_CHANGES: ChangeType[] = [
  'scope',
  'hierarchy',
  'definition',
  'rule',
  'supersede',
];

/**
 * Classify revision changes as minor or major.
 * If any change is a major type, returns 'major'.
 */
export function classifyRevisionChange(
  changes: ChangeType[]
): 'minor' | 'major' {
  const hasMajorChange = changes.some((c) => MAJOR_CHANGES.includes(c));
  return hasMajorChange ? 'major' : 'minor';
}

/**
 * Get the next revision based on changes.
 */
export function getNextRevision(
  currentRev: string,
  changes: ChangeType[]
): string {
  const type = classifyRevisionChange(changes);
  return incrementRevision(currentRev, type);
}

// ─────────────────────────────────────────────────────────────────────────────────
// R2 — SUPERSEDED STATE
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if a document is superseded.
 */
export function isSuperseded(meta: DocumentMeta): boolean {
  return meta.status === 'SUPERSEDED' && meta.supersededBy !== undefined;
}

/**
 * Format the superseded notice line.
 * Returns: "SUPERSEDED BY D1-2 REV 2.0"
 */
export function formatSupersededNotice(
  supersededBy: { docCode: string; rev: string }
): string {
  const rev = formatRevision(supersededBy.rev);
  return `SUPERSEDED BY ${supersededBy.docCode} ${rev}`;
}

/**
 * Get the URL for a document.
 */
export function getDocumentUrl(docCode: string): string {
  // Extract the numeric part from docCode (e.g., "D1-0" → "1")
  const match = docCode.match(/D(\d+)/);
  const id = match ? match[1] : docCode;
  return `/document/${id}`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// R3 — REVISION CHAIN
// ─────────────────────────────────────────────────────────────────────────────────

export interface RevisionChainEntry {
  docCode: string;
  rev: string;
  type: 'current' | 'supersedes' | 'supersededBy';
  url: string;
}

/**
 * Build the revision chain for display in the margin.
 */
export function buildRevisionChain(meta: DocumentMeta): RevisionChainEntry[] {
  const chain: RevisionChainEntry[] = [];
  
  // SupersededBy (strongest link, shown first if exists)
  if (meta.supersededBy) {
    chain.push({
      docCode: meta.supersededBy.docCode,
      rev: meta.supersededBy.rev,
      type: 'supersededBy',
      url: getDocumentUrl(meta.supersededBy.docCode),
    });
  }
  
  // Current document
  chain.push({
    docCode: meta.docCode,
    rev: meta.rev,
    type: 'current',
    url: getDocumentUrl(meta.docCode),
  });
  
  // Supersedes (older documents)
  if (meta.supersedes) {
    meta.supersedes.forEach((doc) => {
      chain.push({
        docCode: doc.docCode,
        rev: doc.rev,
        type: 'supersedes',
        url: getDocumentUrl(doc.docCode),
      });
    });
  }
  
  return chain;
}

// ─────────────────────────────────────────────────────────────────────────────────
// R4 — CHANGE LOG
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Format revision notes for display.
 */
export function formatRevisionNotes(notes: string[]): string[] {
  return notes.map((note, i) => `${i + 1}. ${note}`);
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPARISON
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Compare two revisions.
 * Returns: -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareRevisions(a: string, b: string): number {
  const parsedA = parseRevision(a);
  const parsedB = parseRevision(b);
  
  if (parsedA.major !== parsedB.major) {
    return parsedA.major - parsedB.major;
  }
  return parsedA.minor - parsedB.minor;
}
