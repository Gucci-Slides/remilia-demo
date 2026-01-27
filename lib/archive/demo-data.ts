// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE SYSTEM — Demo Document Data
//
// Sample documents for testing the archive system.
// ═══════════════════════════════════════════════════════════════════════════════

import type { ArchiveDocumentData } from './types';

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT D1-0: Scope & Definitions
// ─────────────────────────────────────────────────────────────────────────────────

export const DOCUMENT_D1_0: ArchiveDocumentData = {
  meta: {
    docCode: 'D1-0',
    title: 'REMILIA — SCOPE & DEFINITIONS',
    registry: 'REMILIA ARCHIVE',
    issuedYear: 2026,
    status: 'ACTIVE',
    protocol: 'STABLE',
    rev: '1',
    revDate: '2026-01-27',
    revNotes: [
      'Initial release of scope and definitions document.',
      'Establishes foundational terminology for the archive system.',
      'Defines document, node, and institution relationships.',
    ],
  },
  blocks: [
    {
      type: 'numberedSection',
      sectionNo: '§1.0',
      title: 'DEFINITIONS',
      id: 'definitions',
      refCode: 'D1-1',
      body: [
        {
          type: 'definitionList',
          items: [
            { term: 'INSTITUTION', def: 'A framework that outlives nodes. The persistent structure within which documents and artifacts exist.' },
            { term: 'NODE', def: 'An expressive artifact operating inside the framework. Nodes may vary in style; the institution does not.' },
            { term: 'DOCUMENT', def: 'A versioned unit of authority. Documents are immutable once issued; changes require new revisions.' },
            { term: 'REVISION', def: 'An incremental update to a document. Minor revisions (1.1) are clarifications; major revisions (2) alter meaning.' },
            { term: 'ARCHIVE', def: 'The complete collection of documents, their revisions, and metadata. The archive is append-only.' },
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§2.0',
      title: 'JURISDICTION',
      id: 'jurisdiction',
      refCode: 'D1-2',
      body: [
        {
          type: 'ruleList',
          items: [
            'The interface is typographic.',
            'Authority is communicated through constraint.',
            'All documents must conform to the typographic constitution.',
            'Deviations require explicit exemption and rationale.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§3.0',
      title: 'NODES',
      id: 'nodes',
      refCode: 'D1-3',
      body: [
        {
          type: 'paragraph',
          text: 'Nodes may vary in style; the institution does not. Each node operates within the constraints of the archive system while expressing its own character. The tension between institutional consistency and nodal expression is intentional.',
        },
        {
          type: 'ruleList',
          items: [
            'Nodes must reference parent documents.',
            'Nodes inherit typographic rules unless exempted.',
            'Node identifiers are unique within the archive.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§4.0',
      title: 'ARCHIVE FORMAT',
      id: 'archive-format',
      refCode: 'D1-4',
      body: [
        {
          type: 'ruleList',
          items: [
            'All revisions are additive and dated.',
            'Documents are never deleted, only superseded.',
            'The archive maintains full revision history.',
            'Superseded documents remain accessible but marked.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§5.0',
      title: 'REVISION PROTOCOL',
      id: 'revision-protocol',
      refCode: 'D1-5',
      body: [
        {
          type: 'paragraph',
          text: 'The revision protocol governs how documents evolve over time. Revisions are classified as minor or major based on the nature of changes.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'MINOR (X.1)', def: 'Wording, spacing, clarifications, small structural edits. Does not change meaning.' },
            { term: 'MAJOR (X+1)', def: 'Changed scope, hierarchy, definitions, or rules. Alters meaning or authority.' },
          ],
        },
        {
          type: 'ruleList',
          items: [
            'Minor revisions must not change document code.',
            'Major revisions may supersede the previous version.',
            'All revisions require dated changelog entries.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§6.0',
      title: 'SUPERSEDENCE',
      id: 'supersedence',
      refCode: 'D1-6',
      body: [
        {
          type: 'paragraph',
          text: 'When a document is superseded, it enters a historical state. The original content is preserved for reference, but all future operations should reference the superseding document.',
        },
        {
          type: 'ruleList',
          items: [
            'Superseded documents display a visible watermark.',
            'A notice line links to the superseding document.',
            'Revision chains show the full lineage.',
            'Supersedence is irreversible.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§7.0',
      title: 'TYPOGRAPHIC AUTHORITY',
      id: 'typographic-authority',
      refCode: 'D1-7',
      body: [
        {
          type: 'paragraph',
          text: 'The typographic system establishes visual hierarchy and authority. All documents must adhere to the five-tier system defined in the Typographic Constitution.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'MONUMENT', def: 'Highest authority. Display headlines. 85–90% ink density.' },
            { term: 'STATE', def: 'Section headers. Numbered lists. 65–75% ink density.' },
            { term: 'ARCHIVE', def: 'Body text. Definitions. 55–65% ink density.' },
            { term: 'LABEL', def: 'Anchors. Callouts. Status tags. 45–55% ink density.' },
            { term: 'MICRO', def: 'Margin annotations. Reference codes. 35–45% ink density.' },
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§8.0',
      title: 'IMPLEMENTATION NOTES',
      id: 'implementation-notes',
      refCode: 'D1-8',
      body: [
        {
          type: 'paragraph',
          text: 'The archive system is designed for long-term preservation and accessibility. Technical implementation should prioritize durability over novelty.',
        },
        {
          type: 'ruleList',
          items: [
            'Use only free and open fonts.',
            'Avoid external dependencies where possible.',
            'Maintain backwards compatibility for all APIs.',
            'Document all changes in revision notes.',
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT D0-1: Typographic Constitution (Superseded example)
// ─────────────────────────────────────────────────────────────────────────────────

export const DOCUMENT_D0_1_SUPERSEDED: ArchiveDocumentData = {
  meta: {
    docCode: 'D0-1',
    title: 'REMILIA — TYPOGRAPHIC CONSTITUTION',
    registry: 'REMILIA ARCHIVE',
    issuedYear: 2025,
    status: 'SUPERSEDED',
    protocol: 'STABLE',
    rev: '1',
    revDate: '2025-12-15',
    supersededBy: { docCode: 'D0-2', rev: '2' },
    revNotes: [
      'Original typographic constitution.',
      'Established five-tier ink hierarchy.',
      'Superseded by D0-2 REV 2 with expanded scale.',
    ],
  },
  blocks: [
    {
      type: 'numberedSection',
      sectionNo: '§1.0',
      title: 'SCALE SPECIFICATION',
      id: 'scale-spec',
      refCode: 'D0-1',
      body: [
        {
          type: 'paragraph',
          text: 'The typographic scale is defined with a modular ratio of 1.25, rooted at 16px. All type sizes derive from this scale.',
        },
        {
          type: 'ruleList',
          items: [
            'Root size: 16px',
            'Modular ratio: 1.25',
            'Baseline unit: 8px',
            'Line height (body): 1.55',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§2.0',
      title: 'INK HIERARCHY',
      id: 'ink-hierarchy',
      refCode: 'D0-2',
      body: [
        {
          type: 'paragraph',
          text: 'Ink density communicates typographic authority. Higher density indicates greater importance.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'TIER 04', def: 'MONUMENT — 85–90% ink density. Highest authority.' },
            { term: 'TIER 03', def: 'STATE — 65–75% ink density. Section headers.' },
            { term: 'TIER 02', def: 'ARCHIVE — 55–65% ink density. Body text.' },
            { term: 'TIER 01', def: 'LABEL — 45–55% ink density. Metadata.' },
            { term: 'TIER 00', def: 'MICRO — 35–45% ink density. Margin refs.' },
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§3.0',
      title: 'CONSTRAINTS',
      id: 'constraints',
      refCode: 'D0-3',
      body: [
        {
          type: 'ruleList',
          items: [
            'No pure black. Use warm charcoal (rgba 18, 16, 14).',
            'No paid fonts. System must work with fallbacks.',
            'No ad-hoc font sizes. Use tier tokens only.',
            'No color beyond ink levels.',
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT D0-2: Typographic Constitution v2
// ─────────────────────────────────────────────────────────────────────────────────

export const DOCUMENT_D0_2: ArchiveDocumentData = {
  meta: {
    docCode: 'D0-2',
    title: 'REMILIA — TYPOGRAPHIC CONSTITUTION',
    registry: 'REMILIA ARCHIVE',
    issuedYear: 2026,
    status: 'ACTIVE',
    protocol: 'STABLE',
    rev: '2',
    revDate: '2026-01-15',
    supersedes: [{ docCode: 'D0-1', rev: '1' }],
    revNotes: [
      'Major revision expanding the typographic scale.',
      'Added responsive clamp() values for all tiers.',
      'Clarified ink density ranges.',
      'Added grain and paper texture specifications.',
    ],
  },
  blocks: [
    {
      type: 'numberedSection',
      sectionNo: '§1.0',
      title: 'SCALE SPECIFICATION',
      id: 'scale-spec',
      refCode: 'D0-1',
      body: [
        {
          type: 'paragraph',
          text: 'The typographic scale uses a modular ratio of 1.25, rooted at 16px. All type sizes are computed from this base using the ratio.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'ROOT', def: '16px — base reference size' },
            { term: 'RATIO', def: '1.25 — modular scale multiplier' },
            { term: 'BASELINE', def: '8px — vertical rhythm unit' },
            { term: 'LINE HEIGHT', def: '1.55 — body text default' },
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§2.0',
      title: 'TYPE SCALE',
      id: 'type-scale',
      refCode: 'D0-2',
      body: [
        {
          type: 'paragraph',
          text: 'The scale defines five tiers, each with specific size, weight, and ink density. Use clamp() for responsive sizing.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'SCALE-04', def: 'clamp(38px, 3.6vw, 48px) — MONUMENT tier' },
            { term: 'SCALE-03', def: 'clamp(18px, 2vw, 22px) — STATE tier' },
            { term: 'SCALE-02', def: 'clamp(14px, 1.2vw, 16px) — ARCHIVE tier' },
            { term: 'SCALE-01', def: 'clamp(10px, 1vw, 12px) — LABEL tier' },
            { term: 'SCALE-00', def: 'clamp(9px, 0.9vw, 10px) — MICRO tier' },
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§3.0',
      title: 'INK HIERARCHY',
      id: 'ink-hierarchy',
      refCode: 'D0-3',
      body: [
        {
          type: 'paragraph',
          text: 'Ink density communicates authority. All ink uses warm charcoal as base (rgba 20, 20, 20, opacity).',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'INK-STRONG', def: 'rgba(20, 20, 20, 0.92) — MONUMENT, primary headings' },
            { term: 'INK-MID', def: 'rgba(20, 20, 20, 0.68) — STATE, body text' },
            { term: 'INK-LIGHT', def: 'rgba(20, 20, 20, 0.42) — LABEL, metadata' },
            { term: 'INK-FAINT', def: 'rgba(20, 20, 20, 0.22) — MICRO, margin refs' },
            { term: 'RULE-LINES', def: 'rgba(20, 20, 20, 0.10) — dividers, borders' },
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§4.0',
      title: 'PAPER & TEXTURE',
      id: 'paper-texture',
      refCode: 'D0-4',
      body: [
        {
          type: 'paragraph',
          text: 'The paper surface provides the foundation for all documents. Texture is subtle and static.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'PAPER-BASE', def: '#f5f2eb — warm off-white' },
            { term: 'PAPER-WARMTH', def: '#faf8f3 — highlight areas' },
            { term: 'GRAIN-A', def: '0.015 — primary noise layer' },
            { term: 'GRAIN-B', def: '0.010 — secondary fiber layer' },
          ],
        },
        {
          type: 'ruleList',
          items: [
            'Grain is static, not animated.',
            'Vignette edges are very subtle.',
            'Paper must force light mode regardless of system.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§5.0',
      title: 'CONSTRAINTS',
      id: 'constraints',
      refCode: 'D0-5',
      body: [
        {
          type: 'ruleList',
          items: [
            'No pure black. Use warm charcoal base.',
            'No paid fonts. Must function with fallbacks.',
            'No ad-hoc font sizes. Tier tokens only.',
            'No color beyond ink levels.',
            'No heavy animations. Bureaucratic calm.',
          ],
        },
      ],
    },
    {
      type: 'numberedSection',
      sectionNo: '§6.0',
      title: 'RESPONSIVE BEHAVIOR',
      id: 'responsive',
      refCode: 'D0-6',
      body: [
        {
          type: 'paragraph',
          text: 'The document system adapts to viewport size while maintaining the paper illusion.',
        },
        {
          type: 'definitionList',
          items: [
            { term: 'DESKTOP', def: '≥1024px — Full pagination, right margin refs visible' },
            { term: 'TABLET', def: '768–1023px — Reduced margins, simplified refs' },
            { term: 'MOBILE', def: '<768px — Continuous flow, inline refs' },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT MAP
// ─────────────────────────────────────────────────────────────────────────────────

export const DOCUMENTS: Record<string, ArchiveDocumentData> = {
  '1': DOCUMENT_D1_0,
  '0-1': DOCUMENT_D0_1_SUPERSEDED,
  '0-2': DOCUMENT_D0_2,
};

export function getDocument(docId: string): ArchiveDocumentData | null {
  return DOCUMENTS[docId] || null;
}
