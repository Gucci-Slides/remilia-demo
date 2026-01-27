// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE SYSTEM — Type Definitions
//
// Authoritative data model for document identity, revision history,
// and semantic content blocks.
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT METADATA
// ─────────────────────────────────────────────────────────────────────────────────

export interface DocumentMeta {
  /** Document code (e.g., "D0-1", "D1-0") */
  docCode: string;
  /** Document title (e.g., "REMILIA — SCOPE") */
  title: string;
  /** Registry name */
  registry: string;
  /** Year of issuance */
  issuedYear: number;
  /** Document status */
  status: 'ACTIVE' | 'DRAFT' | 'SUPERSEDED';
  /** Protocol stability */
  protocol: 'STABLE' | 'EXPERIMENTAL';
  /** Revision string for display (e.g., "1", "1.1", "2") */
  rev: string;
  /** ISO date of revision */
  revDate?: string;
  /** If superseded, reference to the superseding document */
  supersededBy?: { docCode: string; rev: string };
  /** Documents that this one supersedes */
  supersedes?: { docCode: string; rev: string }[];
  /** Optional revision notes */
  revNotes?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONTENT BLOCKS
// ─────────────────────────────────────────────────────────────────────────────────

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
  id?: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface DefinitionListBlock {
  type: 'definitionList';
  items: { term: string; def: string }[];
}

export interface NumberedSectionBlock {
  type: 'numberedSection';
  sectionNo: string; // "1." | "2." | "§1.0"
  title: string;
  body: ContentBlock[];
  id?: string;
  refCode?: string; // e.g., "D1-1"
}

export interface RuleListBlock {
  type: 'ruleList';
  items: string[];
}

export interface CalloutBlock {
  type: 'callout';
  label: string;
  value: string;
}

export interface SpacerBlock {
  type: 'spacer';
  height?: number; // in baseline units
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | DefinitionListBlock
  | NumberedSectionBlock
  | RuleListBlock
  | CalloutBlock
  | SpacerBlock;

// ─────────────────────────────────────────────────────────────────────────────────
// FULL DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────────

export interface ArchiveDocumentData {
  meta: DocumentMeta;
  blocks: ContentBlock[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────────

export interface PageContent {
  pageNumber: number;
  blocks: ContentBlock[];
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface PaginatedDocument {
  meta: DocumentMeta;
  pages: PageContent[];
  totalPages: number;
}
