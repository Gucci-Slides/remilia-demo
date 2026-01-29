'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE INDEX — DOCUMENT D0-0
//
// The archive index proper. Document table listing all registered documents.
// Long-form paper document rendered with CSS.
//
// STRUCTURE:
// - Page 1: Cover header + first part of table
// - Page 2: Continuation of table + footer
// ═══════════════════════════════════════════════════════════════════════════════

import '@/app/archive-index.css';
import { useState, useCallback } from 'react';
import { ArchivePageFrame } from '@/components/archive/ArchivePageFrame';
import { ArchiveIndexTable } from '@/components/archive/ArchiveIndexTable';
import { 
  ARCHIVE_ENTRIES, 
  flattenGroups, 
  groupEntries,
} from '@/lib/archive/revisioning';

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const DOC_ID = 'D0-0';
const DOC_REV = '1';
const ISSUED_YEAR = '2026';
const REGISTRY = 'REMILIA';
const TOTAL_PAGES = 2;

// Split entries for pagination
const groupedEntries = groupEntries(ARCHIVE_ENTRIES);
const allEntries = flattenGroups(groupedEntries);
const PAGE_1_ENTRIES = allEntries.slice(0, 6);
const PAGE_2_ENTRIES = allEntries.slice(6);

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────────

export default function ArchiveIndexPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageEnterView = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  return (
    <div className="archive-container">
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1 — Cover header + first part of table
      ═══════════════════════════════════════════════════════════════ */}
      <ArchivePageFrame
        pageNumber={1}
        totalPages={TOTAL_PAGES}
        docId={DOC_ID}
        rev={DOC_REV}
        issuedYear={ISSUED_YEAR}
        registry={REGISTRY}
        isFirstPage={true}
        onEnterView={handlePageEnterView}
      >
        {/* Right margin refs */}
        <div className="archive-margin-refs">
          <span className="archive-margin-ref archive-margin-ref--current">D0-0</span>
          <span className="archive-margin-ref">D0-1</span>
        </div>

        {/* Cover Header */}
        <header className="archive-cover-header">
          {/* Meta stack (Micro tier) */}
          <div className="archive-cover-meta">
            <span className="archive-cover-meta-line">REMILIA ARCHIVE</span>
            <span className="archive-cover-meta-line">REGISTRY: PUBLIC</span>
            <span className="archive-cover-meta-line">BUILD: V1</span>
            <span className="archive-cover-meta-line">ROOT 16 · RATIO 1.25</span>
            <span className="archive-cover-meta-line">ISSUED {ISSUED_YEAR}</span>
          </div>

          {/* Title (Monument tier) */}
          <h1 className="archive-cover-title">ARCHIVE INDEX</h1>

          {/* Status row (Label tier) */}
          <div className="archive-cover-status">
            <span className="archive-cover-status-item">STATUS: ACTIVE</span>
            <span className="archive-cover-status-item">PROTOCOL: STABLE</span>
            <span className="archive-cover-status-item">SCOPE: DOCUMENTED</span>
          </div>

          {/* Divider */}
          <div className="archive-cover-divider" aria-hidden="true" />
        </header>

        {/* Index Table — Page 1 entries */}
        <ArchiveIndexTable entries={PAGE_1_ENTRIES} />
      </ArchivePageFrame>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2 — Continuation of table
      ═══════════════════════════════════════════════════════════════ */}
      <ArchivePageFrame
        pageNumber={2}
        totalPages={TOTAL_PAGES}
        docId={DOC_ID}
        rev={DOC_REV}
        issuedYear={ISSUED_YEAR}
        registry={REGISTRY}
        isFirstPage={false}
        onEnterView={handlePageEnterView}
      >
        {/* Right margin refs */}
        <div className="archive-margin-refs">
          <span className="archive-margin-ref archive-margin-ref--current">D0-0</span>
          <span className="archive-margin-ref">D0-1</span>
        </div>

        {/* Index Table — Page 2 entries */}
        <ArchiveIndexTable entries={PAGE_2_ENTRIES} />
      </ArchivePageFrame>
    </div>
  );
}
