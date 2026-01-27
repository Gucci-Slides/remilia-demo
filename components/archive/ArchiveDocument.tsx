'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE DOCUMENT — Main document renderer
//
// Takes DocumentMeta + content blocks and renders paginated pages.
// Implements the "printed document that got CSS" aesthetic.
//
// USAGE:
// <ArchiveDocument
//   meta={documentMeta}
//   blocks={contentBlocks}
// />
// ═══════════════════════════════════════════════════════════════════════════════

import '@/styles/archive.css';
import { useEffect, useState, useCallback, ReactNode } from 'react';
import Link from 'next/link';
import type {
  DocumentMeta,
  ContentBlock,
  PageContent,
  HeadingBlock,
  ParagraphBlock,
  DefinitionListBlock,
  NumberedSectionBlock,
  RuleListBlock,
  CalloutBlock,
} from '@/lib/archive/types';
import { paginateBlocks, shouldEnablePagination } from '@/lib/archive/pagination';
import { buildRevisionChain, formatRevision } from '@/lib/archive/revision';
import { PageFrame } from './PageFrame';
import { RevisionBadge } from './RevisionBadge';
import { SupersededOverlay, SupersededNotice } from './SupersededOverlay';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ArchiveDocumentProps {
  /** Document metadata */
  meta: DocumentMeta;
  /** Content blocks */
  blocks: ContentBlock[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function ArchiveDocument({ meta, blocks }: ArchiveDocumentProps) {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isPaginated, setIsPaginated] = useState(true);

  // Check viewport and paginate
  useEffect(() => {
    const handleResize = () => {
      const shouldPaginate = shouldEnablePagination(window.innerWidth);
      setIsPaginated(shouldPaginate);
      
      if (shouldPaginate) {
        setPages(paginateBlocks(blocks));
      } else {
        // Single "page" with all content
        setPages([{
          pageNumber: 1,
          blocks,
          isFirstPage: true,
          isLastPage: true,
        }]);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [blocks]);

  // Build revision chain
  const revisionChain = buildRevisionChain(meta);

  return (
    <div className="archive-paper">
      {/* Paper grain overlay */}
      <div className="archive-paper-grain" aria-hidden="true" />

      {/* Superseded overlay (if applicable) */}
      <SupersededOverlay meta={meta} />

      {/* Revision chain in right margin (desktop only) */}
      <RevisionChain chain={revisionChain} />

      {/* Pages */}
      <main>
        {pages.map((page, index) => (
          <PageFrame
            key={page.pageNumber}
            meta={meta}
            pageNumber={page.pageNumber}
            totalPages={pages.length}
            isFirstPage={page.isFirstPage}
            isLastPage={page.isLastPage}
          >
            {/* First page: show title and metadata */}
            {page.isFirstPage && (
              <DocumentHeader meta={meta} />
            )}

            {/* Render content blocks */}
            {page.blocks.map((block, blockIndex) => (
              <BlockRenderer
                key={`${page.pageNumber}-${blockIndex}`}
                block={block}
              />
            ))}

            {/* Last page: show rev notes if available */}
            {page.isLastPage && meta.revNotes && meta.revNotes.length > 0 && (
              <RevNotes notes={meta.revNotes} />
            )}
          </PageFrame>
        ))}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// DOCUMENT HEADER — Title, badge, superseded notice
// ─────────────────────────────────────────────────────────────────────────────────

function DocumentHeader({ meta }: { meta: DocumentMeta }) {
  return (
    <header style={{ marginBottom: 'calc(var(--archive-baseline) * 6)' }}>
      {/* Title */}
      <h1 className="archive-monument">{meta.title}</h1>

      {/* Revision badge */}
      <div style={{ marginBottom: 'calc(var(--archive-baseline) * 2)' }}>
        <RevisionBadge
          rev={meta.rev}
          status={meta.status}
          protocol={meta.protocol}
        />
      </div>

      {/* Superseded notice */}
      <SupersededNotice meta={meta} />

      {/* Callouts */}
      <div style={{ display: 'flex', gap: 'calc(var(--archive-baseline) * 4)', marginTop: 'calc(var(--archive-baseline) * 3)' }}>
        <div className="archive-callout">
          <span className="archive-callout-label">STATUS:</span>
          <span className="archive-callout-value">{meta.status}</span>
        </div>
        <div className="archive-callout">
          <span className="archive-callout-label">PROTOCOL:</span>
          <span className="archive-callout-value">{meta.protocol}</span>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// REVISION CHAIN — Right margin reference stack
// ─────────────────────────────────────────────────────────────────────────────────

interface RevisionChainEntry {
  docCode: string;
  rev: string;
  type: 'current' | 'supersedes' | 'supersededBy';
  url: string;
}

function RevisionChain({ chain }: { chain: RevisionChainEntry[] }) {
  return (
    <nav className="archive-revision-chain" aria-label="Revision history">
      {chain.map((entry, i) => (
        <Link
          key={`${entry.docCode}-${entry.rev}`}
          href={entry.url}
          className={`archive-revision-chain-item archive-revision-chain-item--${entry.type}`}
        >
          {entry.docCode} {formatRevision(entry.rev)}
        </Link>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// REV NOTES — End section
// ─────────────────────────────────────────────────────────────────────────────────

function RevNotes({ notes }: { notes: string[] }) {
  return (
    <section className="archive-rev-notes">
      <h3 className="archive-rev-notes-title">REV NOTES</h3>
      <ul className="archive-rev-notes-list">
        {notes.map((note, i) => (
          <li key={i} className="archive-rev-notes-item">
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// BLOCK RENDERER — Renders individual content blocks
// ─────────────────────────────────────────────────────────────────────────────────

interface BlockRendererProps {
  block: ContentBlock;
}

function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'heading':
      return <HeadingRenderer block={block} />;
    case 'paragraph':
      return <ParagraphRenderer block={block} />;
    case 'definitionList':
      return <DefinitionListRenderer block={block} />;
    case 'numberedSection':
      return <NumberedSectionRenderer block={block} />;
    case 'ruleList':
      return <RuleListRenderer block={block} />;
    case 'callout':
      return <CalloutRenderer block={block} />;
    case 'spacer':
      return <div style={{ height: `calc(var(--archive-baseline) * ${block.height || 3})` }} />;
    default:
      return null;
  }
}

// Heading
function HeadingRenderer({ block }: { block: HeadingBlock }) {
  const className = block.level === 1
    ? 'archive-monument'
    : block.level === 2
      ? 'archive-state'
      : 'archive-label';
  
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag id={block.id} className={className}>
      {block.text}
    </Tag>
  );
}

// Paragraph
function ParagraphRenderer({ block }: { block: ParagraphBlock }) {
  return <p className="archive-body">{block.text}</p>;
}

// Definition List
function DefinitionListRenderer({ block }: { block: DefinitionListBlock }) {
  return (
    <dl className="archive-definition-list">
      {block.items.map((item, i) => (
        <div key={i} className="archive-definition-item">
          <dt className="archive-definition-term">{item.term}</dt>
          <dd className="archive-definition-def">{item.def}</dd>
        </div>
      ))}
    </dl>
  );
}

// Numbered Section
function NumberedSectionRenderer({ block }: { block: NumberedSectionBlock }) {
  // Scroll handler for margin ref
  const handleRefClick = useCallback(() => {
    if (block.id) {
      const el = document.getElementById(block.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [block.id]);

  return (
    <section id={block.id} className="archive-numbered-section">
      {/* Section marker in left margin */}
      <span className="archive-section-marker">{block.sectionNo}</span>

      {/* Header */}
      <div className="archive-numbered-section-header">
        <span className="archive-numbered-section-no">{block.sectionNo}</span>
        <span className="archive-numbered-section-title">{block.title}</span>
      </div>

      {/* REF in right margin */}
      {block.refCode && (
        <span
          className="archive-margin-ref"
          onClick={handleRefClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRefClick()}
        >
          {block.refCode}
        </span>
      )}

      {/* Body content */}
      <div className="archive-numbered-section-body">
        {block.body.map((subBlock, i) => (
          <BlockRenderer key={i} block={subBlock} />
        ))}
      </div>
    </section>
  );
}

// Rule List
function RuleListRenderer({ block }: { block: RuleListBlock }) {
  return (
    <ul className="archive-rule-list">
      {block.items.map((item, i) => (
        <li key={i} className="archive-rule-item">{item}</li>
      ))}
    </ul>
  );
}

// Callout
function CalloutRenderer({ block }: { block: CalloutBlock }) {
  return (
    <div className="archive-callout">
      <span className="archive-callout-label">{block.label}:</span>
      <span className="archive-callout-value">{block.value}</span>
    </div>
  );
}

export default ArchiveDocument;
