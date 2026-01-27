'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT VIEWPORT — Scrollable document with fixed margins
//
// Implements long-form scrolling that preserves the "paper document" illusion.
// The viewport does not scroll like a website — the document advances under
// fixed margins.
//
// STRUCTURE:
// - FixedMarginsLayer (never moves): crop marks, texture, header/footer, rules
// - FlowLayer (moves with scroll): sections, content, page breaks
//
// USAGE:
// <DocumentViewport
//   docId="1"
//   title="SCOPE & DEFINITIONS"
//   rev="REV 1"
//   issuedYear="2026"
//   registry="REMILIA"
// >
//   <DocSection id="def" tier="MONUMENT" refCode="D1-0" title="REMILIA — SCOPE">
//     ...
//   </DocSection>
// </DocumentViewport>
// ═══════════════════════════════════════════════════════════════════════════════

import '@/app/paper-print.css';
import '@/app/document-system.css';
import '@/app/document-viewport.css';
import '@/app/archive-index.css';
import { createContext, useContext, useState, useCallback, useEffect, useRef, forwardRef, ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────────
// CONTEXT — Active section tracking
// ─────────────────────────────────────────────────────────────────────────────────

interface SectionRef {
  id: string;
  refCode: string;
  title: string;
}

interface ViewportContextValue {
  activeSectionId: string | null;
  sections: SectionRef[];
  registerSection: (section: SectionRef) => void;
  setActiveSection: (id: string) => void;
  currentPage: number;
  totalPages: number;
}

const ViewportContext = createContext<ViewportContextValue | null>(null);

export function useViewport() {
  const ctx = useContext(ViewportContext);
  if (!ctx) throw new Error('useViewport must be used within DocumentViewport');
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type DocStatus = 'ACTIVE' | 'SUPERSEDED' | 'DRAFT';

interface DocumentViewportProps {
  /** Document ID (e.g., "0", "1") */
  docId: string;
  /** Document title */
  title: string;
  /** Revision string */
  rev?: string;
  /** Issued year */
  issuedYear?: string;
  /** Registry name */
  registry?: string;
  /** Document status */
  status?: DocStatus;
  /** Related document chain for right margin */
  docChain?: string[];
  /** Estimated total pages */
  estimatedPages?: number;
  /** Children (DocSection components) */
  children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const PAGE_HEIGHT = 900; // Estimated height per "page" in pixels

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function DocumentViewport({
  docId,
  title,
  rev = 'REV 1',
  issuedYear = '2026',
  registry = 'REMILIA',
  status = 'ACTIVE',
  docChain,
  estimatedPages = 3,
  children,
}: DocumentViewportProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionRef[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(estimatedPages);
  const flowRef = useRef<HTMLDivElement>(null);

  // Track scroll position for page calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!flowRef.current) return;
      
      const scrollTop = flowRef.current.scrollTop;
      const scrollHeight = flowRef.current.scrollHeight;
      const clientHeight = flowRef.current.clientHeight;
      
      // Calculate total pages based on content height
      const contentHeight = scrollHeight - clientHeight;
      const calculatedTotalPages = Math.max(1, Math.ceil(scrollHeight / PAGE_HEIGHT));
      setTotalPages(calculatedTotalPages);
      
      // Calculate current page
      const pageIndex = Math.floor(scrollTop / PAGE_HEIGHT) + 1;
      setCurrentPage(Math.min(pageIndex, calculatedTotalPages));
    };

    const flow = flowRef.current;
    if (flow) {
      flow.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial calculation
    }

    return () => {
      if (flow) {
        flow.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const registerSection = useCallback((section: SectionRef) => {
    setSections((prev) => {
      // Avoid duplicates
      if (prev.some((s) => s.id === section.id)) return prev;
      return [...prev, section];
    });
  }, []);

  const setActiveSection = useCallback((id: string) => {
    setActiveSectionId(id);
  }, []);

  const contextValue: ViewportContextValue = {
    activeSectionId,
    sections,
    registerSection,
    setActiveSection,
    currentPage,
    totalPages,
  };

  return (
    <ViewportContext.Provider value={contextValue}>
      <div className="document-viewport">
        {/* ═══════════════════════════════════════════════════════════════
            PAGE MARKER — Top center, updates on scroll
        ═══════════════════════════════════════════════════════════════ */}
        <PageMarker currentPage={currentPage} totalPages={totalPages} />

        {/* ═══════════════════════════════════════════════════════════════
            FIXED MARGINS LAYER — Never moves
        ═══════════════════════════════════════════════════════════════ */}
        <FixedMarginsLayer
          docId={docId}
          title={title}
          rev={rev}
          issuedYear={issuedYear}
          registry={registry}
          status={status}
          docChain={docChain}
        />

        {/* ═══════════════════════════════════════════════════════════════
            PAPER TEXTURE OVERLAY — Fixed grain
        ═══════════════════════════════════════════════════════════════ */}
        <div className="paper-texture-overlay" aria-hidden="true" />

        {/* ═══════════════════════════════════════════════════════════════
            CROP MARKS — Fixed corners
        ═══════════════════════════════════════════════════════════════ */}
        <CropMarks />

        {/* ═══════════════════════════════════════════════════════════════
            FLOW LAYER — Scrolling content
        ═══════════════════════════════════════════════════════════════ */}
        <FlowLayer ref={flowRef}>{children}</FlowLayer>
      </div>
    </ViewportContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE MARKER — Fixed top-center page counter
// ─────────────────────────────────────────────────────────────────────────────────

function PageMarker({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const formatNum = (n: number) => n.toString().padStart(2, '0');
  
  return (
    <div className="page-marker" aria-live="polite">
      PAGE {formatNum(currentPage)} / {formatNum(totalPages)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// FIXED MARGINS LAYER
// ─────────────────────────────────────────────────────────────────────────────────

interface FixedMarginsLayerProps {
  docId: string;
  title: string;
  rev: string;
  issuedYear: string;
  registry: string;
  status: DocStatus;
  docChain?: string[];
}

function FixedMarginsLayer({
  docId,
  title,
  rev,
  issuedYear,
  registry,
  status,
  docChain,
}: FixedMarginsLayerProps) {
  const statusClass = status !== 'ACTIVE' ? `doc-status-line status--${status.toLowerCase()}` : '';
  
  return (
    <div className="fixed-margins-layer" aria-hidden="true">
      {/* Spine rule (left vertical line) */}
      <div className="spine-rule" />
      
      {/* Right margin rule */}
      <div className="right-margin-rule" />
      
      {/* Header microblock (top-left) */}
      <div className="header-microblock">
        <span className="header-microblock-line">DOCUMENT {docId}</span>
        <span className="header-microblock-line">{title}</span>
        <span className="header-microblock-line">{rev}</span>
        {status !== 'ACTIVE' && (
          <span className={statusClass}>STATUS: {status}</span>
        )}
      </div>
      
      {/* Footer microblock (bottom-left) */}
      <div className="footer-microblock">
        <span className="footer-microblock-line">ISSUED {issuedYear} · {registry}</span>
      </div>
      
      {/* Right margin: doc chain or refs */}
      {docChain && docChain.length > 0 ? (
        <DocChain docs={docChain} currentDocId={docId} />
      ) : (
        <RightMarginRefs />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// DOC CHAIN — Right margin document chain
// ─────────────────────────────────────────────────────────────────────────────────

function DocChain({ docs, currentDocId }: { docs: string[]; currentDocId: string }) {
  return (
    <div className="right-margin-refs">
      <div className="doc-chain">
        {docs.map((doc) => {
          const isCurrent = doc === `D${currentDocId}` || doc === currentDocId;
          return (
            <span
              key={doc}
              className={`doc-chain-item ${isCurrent ? 'doc-chain-item--current' : 'doc-chain-item--related'}`}
            >
              {doc}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// RIGHT MARGIN REFS — Shows active + neighbor refs
// ─────────────────────────────────────────────────────────────────────────────────

function RightMarginRefs() {
  const { activeSectionId, sections } = useViewport();
  
  // Find active index
  const activeIndex = sections.findIndex((s) => s.id === activeSectionId);
  
  // Get prev, current, next refs
  const prevRef = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const activeRef = activeIndex >= 0 ? sections[activeIndex] : null;
  const nextRef = activeIndex < sections.length - 1 ? sections[activeIndex + 1] : null;
  
  return (
    <div className="right-margin-refs">
      {prevRef && (
        <span className="margin-ref margin-ref--prev">{prevRef.refCode}</span>
      )}
      {activeRef && (
        <span className="margin-ref margin-ref--active">{activeRef.refCode}</span>
      )}
      {nextRef && (
        <span className="margin-ref margin-ref--next">{nextRef.refCode}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// CROP MARKS — Fixed corners
// ─────────────────────────────────────────────────────────────────────────────────

function CropMarks() {
  return (
    <div className="viewport-crop-marks" aria-hidden="true">
      <div className="viewport-crop-mark viewport-crop-mark--tl" />
      <div className="viewport-crop-mark viewport-crop-mark--tr" />
      <div className="viewport-crop-mark viewport-crop-mark--br" />
      <div className="viewport-crop-mark viewport-crop-mark--bl" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// FLOW LAYER — Scrolling content container
// ─────────────────────────────────────────────────────────────────────────────────

const FlowLayer = forwardRef<HTMLDivElement, { children: ReactNode }>(
  function FlowLayer({ children }, ref) {
    return (
      <div className="flow-layer" ref={ref}>
        <div className="flow-content">{children}</div>
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────────────────────────────────
// SOFT PAGE BREAK — Visual page separator
// ─────────────────────────────────────────────────────────────────────────────────

export function SoftPageBreak({ pageNumber }: { pageNumber?: number }) {
  return (
    <div className="soft-page-break" aria-hidden="true">
      {pageNumber && (
        <span className="soft-page-break-label">PAGE {pageNumber.toString().padStart(2, '0')}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE REGION FOOTER — Repeating footer stamp
// ─────────────────────────────────────────────────────────────────────────────────

interface PageRegionFooterProps {
  issuedYear: string;
  registry: string;
  docId: string;
  rev: string;
}

export function PageRegionFooter({ issuedYear, registry, docId, rev }: PageRegionFooterProps) {
  return (
    <div className="page-region-footer">
      <span className="page-region-footer-left">ISSUED {issuedYear} · {registry}</span>
      <span className="page-region-footer-right">DOC {docId} · {rev}</span>
    </div>
  );
}

export default DocumentViewport;
