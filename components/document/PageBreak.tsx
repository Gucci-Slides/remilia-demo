'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE BREAK — Soft page separation
//
// Visual:
// - Thin horizontal tick line across the page (hairline, 10–15% ink)
// - Paper grain shifts slightly below the break (alternate seed)
// - Micro label at right margin: PAGE 03 / 12
//
// Must NOT snap or jump. Just appears naturally as it scrolls into view.
//
// USAGE:
// <PageBreak pageNumber={2} totalPages={5} />
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface PageBreakProps {
  /** Current page number */
  pageNumber?: number;
  /** Total number of pages */
  totalPages?: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function PageBreak({ pageNumber, totalPages }: PageBreakProps) {
  // Format page numbers with leading zeros
  const formatNumber = (n: number) => n.toString().padStart(2, '0');
  
  const showLabel = pageNumber !== undefined && totalPages !== undefined;

  return (
    <div className="page-break" aria-hidden="true">
      {showLabel && (
        <span className="page-break-label">
          PAGE {formatNumber(pageNumber)} / {formatNumber(totalPages)}
        </span>
      )}
    </div>
  );
}

export default PageBreak;
