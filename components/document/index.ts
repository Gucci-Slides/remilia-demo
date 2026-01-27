// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT SYSTEM — Component Exports
// ═══════════════════════════════════════════════════════════════════════════════

// Original shell (single-page, non-scrolling)
export { DocumentShell } from './DocumentShell';

// Viewport system (multi-page, scrolling)
export { DocumentViewport, useViewport, SoftPageBreak, PageRegionFooter } from './DocumentViewport';
export type { DocStatus } from './DocumentViewport';
export { DocSection } from './DocSection';
export { PageBreak } from './PageBreak';
