// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE SYSTEM — Pagination Engine
//
// Measurement-based pagination for long-form documents.
// Splits content into pages by height constraints with orphan control.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  ContentBlock,
  PageContent,
  PaginatedDocument,
  ArchiveDocumentData,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

export const PAGINATION_CONFIG = {
  /** Available content height per page (in pixels) */
  pageContentHeight: 720,
  
  /** Minimum height remaining to keep a heading on current page */
  orphanThresholdPx: 80,
  
  /** Estimated heights for different block types (px) */
  blockHeights: {
    heading1: 64,
    heading2: 48,
    heading3: 40,
    paragraph: 32,
    definitionItem: 28,
    ruleItem: 24,
    callout: 32,
    spacer: 24,
    numberedSectionHeader: 48,
  },
  
  /** Minimum viewport width to enable pagination */
  minPaginationWidth: 900,
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// BLOCK HEIGHT ESTIMATION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Estimate the rendered height of a content block.
 * This is a heuristic; actual measurement would require DOM rendering.
 */
export function estimateBlockHeight(block: ContentBlock): number {
  const heights = PAGINATION_CONFIG.blockHeights;
  
  switch (block.type) {
    case 'heading':
      return block.level === 1
        ? heights.heading1
        : block.level === 2
          ? heights.heading2
          : heights.heading3;
    
    case 'paragraph':
      // Estimate based on text length (roughly 80 chars per line, 24px per line)
      const lines = Math.ceil(block.text.length / 80);
      return Math.max(heights.paragraph, lines * 24);
    
    case 'definitionList':
      return block.items.length * heights.definitionItem + 16; // + padding
    
    case 'numberedSection':
      // Header + body content
      let sectionHeight = heights.numberedSectionHeader;
      block.body.forEach((b) => {
        sectionHeight += estimateBlockHeight(b);
      });
      return sectionHeight;
    
    case 'ruleList':
      return block.items.length * heights.ruleItem + 16;
    
    case 'callout':
      return heights.callout;
    
    case 'spacer':
      return (block.height || 3) * 8; // baseline units
    
    default:
      return 32;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// PAGINATION ALGORITHM
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if a block is a heading-type (should not be orphaned).
 */
function isHeadingBlock(block: ContentBlock): boolean {
  return (
    block.type === 'heading' ||
    block.type === 'numberedSection'
  );
}

/**
 * Paginate content blocks into fixed-height pages.
 * 
 * Implements orphan control:
 * - Headings near page bottom are pushed to next page with their following block.
 */
export function paginateBlocks(
  blocks: ContentBlock[],
  pageHeight: number = PAGINATION_CONFIG.pageContentHeight
): PageContent[] {
  const pages: PageContent[] = [];
  let currentPage: ContentBlock[] = [];
  let currentHeight = 0;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHeight = estimateBlockHeight(block);
    const remainingHeight = pageHeight - currentHeight;
    
    // Check if block fits on current page
    if (blockHeight <= remainingHeight) {
      // Special case: heading near bottom of page
      if (isHeadingBlock(block) && remainingHeight < blockHeight + PAGINATION_CONFIG.orphanThresholdPx) {
        // Push heading to next page
        if (currentPage.length > 0) {
          pages.push(createPageContent(pages.length + 1, currentPage, false, false));
          currentPage = [];
          currentHeight = 0;
        }
      }
      
      currentPage.push(block);
      currentHeight += blockHeight;
    } else {
      // Block doesn't fit; start new page
      if (currentPage.length > 0) {
        pages.push(createPageContent(pages.length + 1, currentPage, false, false));
      }
      currentPage = [block];
      currentHeight = blockHeight;
    }
  }
  
  // Add final page
  if (currentPage.length > 0) {
    pages.push(createPageContent(pages.length + 1, currentPage, false, false));
  }
  
  // Mark first and last pages
  if (pages.length > 0) {
    pages[0].isFirstPage = true;
    pages[pages.length - 1].isLastPage = true;
  }
  
  return pages;
}

/**
 * Create a PageContent object.
 */
function createPageContent(
  pageNumber: number,
  blocks: ContentBlock[],
  isFirstPage: boolean,
  isLastPage: boolean
): PageContent {
  return {
    pageNumber,
    blocks: [...blocks],
    isFirstPage,
    isLastPage,
  };
}

/**
 * Paginate a full document.
 */
export function paginateDocument(
  doc: ArchiveDocumentData,
  pageHeight?: number
): PaginatedDocument {
  const pages = paginateBlocks(doc.blocks, pageHeight);
  
  return {
    meta: doc.meta,
    pages,
    totalPages: pages.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE MEASUREMENT
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Measure actual block heights using the DOM.
 * This is more accurate but requires a reference to measured elements.
 * 
 * Usage:
 * const heights = await measureBlockHeights(containerRef, blocks);
 */
export interface MeasuredBlock {
  block: ContentBlock;
  height: number;
}

export function measureBlockHeights(
  container: HTMLElement,
  blocks: ContentBlock[]
): MeasuredBlock[] {
  const measured: MeasuredBlock[] = [];
  const children = container.children;
  
  for (let i = 0; i < Math.min(children.length, blocks.length); i++) {
    const child = children[i] as HTMLElement;
    measured.push({
      block: blocks[i],
      height: child.offsetHeight,
    });
  }
  
  return measured;
}

/**
 * Re-paginate with actual measured heights.
 */
export function paginateWithMeasurements(
  blocks: ContentBlock[],
  measuredHeights: Map<number, number>,
  pageHeight: number = PAGINATION_CONFIG.pageContentHeight
): PageContent[] {
  const pages: PageContent[] = [];
  let currentPage: ContentBlock[] = [];
  let currentHeight = 0;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHeight = measuredHeights.get(i) ?? estimateBlockHeight(block);
    const remainingHeight = pageHeight - currentHeight;
    
    if (blockHeight <= remainingHeight) {
      if (isHeadingBlock(block) && remainingHeight < blockHeight + PAGINATION_CONFIG.orphanThresholdPx) {
        if (currentPage.length > 0) {
          pages.push(createPageContent(pages.length + 1, currentPage, false, false));
          currentPage = [];
          currentHeight = 0;
        }
      }
      
      currentPage.push(block);
      currentHeight += blockHeight;
    } else {
      if (currentPage.length > 0) {
        pages.push(createPageContent(pages.length + 1, currentPage, false, false));
      }
      currentPage = [block];
      currentHeight = blockHeight;
    }
  }
  
  if (currentPage.length > 0) {
    pages.push(createPageContent(pages.length + 1, currentPage, false, false));
  }
  
  if (pages.length > 0) {
    pages[0].isFirstPage = true;
    pages[pages.length - 1].isLastPage = true;
  }
  
  return pages;
}

// ─────────────────────────────────────────────────────────────────────────────────
// RESPONSIVE BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if pagination should be enabled based on viewport width.
 */
export function shouldEnablePagination(viewportWidth: number): boolean {
  return viewportWidth >= PAGINATION_CONFIG.minPaginationWidth;
}

/**
 * Get page content height based on viewport.
 */
export function getPageContentHeight(viewportHeight: number): number {
  // Reserve space for page header/footer (approx 120px total)
  const reserved = 140;
  const available = viewportHeight - reserved;
  
  // Clamp to reasonable range
  return Math.max(400, Math.min(available, 900));
}
