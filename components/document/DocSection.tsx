'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// DOC SECTION — Individual content section with tier styling
//
// Registers with IntersectionObserver to update active ref in viewport.
// Uses the established typographic tiers: MONUMENT, STATE, ARCHIVE, LABEL, MICRO.
//
// USAGE:
// <DocSection
//   id="definitions"
//   tier="STATE"
//   refCode="D1-1"
//   title="1. DEFINITIONS"
// >
//   <p className="t-archive">Definition content...</p>
// </DocSection>
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, ReactNode } from 'react';
import { useViewport } from './DocumentViewport';
import type { Tier } from '@/lib/document/tokens';

// ─────────────────────────────────────────────────────────────────────────────────
// TIER TO CLASS MAPPING
// ─────────────────────────────────────────────────────────────────────────────────

const tierToClass: Record<Tier, string> = {
  MONUMENT: 't-monument',
  STATE: 't-state',
  ARCHIVE: 't-archive',
  LABEL: 't-label',
  MICRO: 't-micro',
};

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface DocSectionProps {
  /** Unique section ID */
  id: string;
  /** Typographic tier for the title */
  tier: Tier;
  /** Reference code (e.g., "D1-1") */
  refCode: string;
  /** Section title */
  title?: string;
  /** Optional meta lines (shown below title) */
  metaLines?: string[];
  /** Section content */
  children?: ReactNode;
  /** Whether to show dotted baseline */
  showBaseline?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function DocSection({
  id,
  tier,
  refCode,
  title,
  metaLines,
  children,
  showBaseline = true,
}: DocSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const { registerSection, setActiveSection } = useViewport();

  // Register section on mount
  useEffect(() => {
    registerSection({ id, refCode, title: title || '' });
  }, [id, refCode, title, registerSection]);

  // Set up IntersectionObserver
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When heading enters the active band (top 20% → 55%)
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setActiveSection(id);
          }
        });
      },
      {
        // Active band: top 20% → 55% of viewport
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.2, 0.5, 1],
      }
    );

    observer.observe(heading);

    return () => observer.disconnect();
  }, [id, setActiveSection]);

  const titleClass = tierToClass[tier];

  return (
    <section
      id={id}
      className={`doc-section ${showBaseline ? 'doc-section--baseline' : ''}`}
    >
      {/* Section heading (observed for intersection) */}
      {title && (
        <div ref={headingRef} className={titleClass}>
          {title}
        </div>
      )}

      {/* Optional meta lines */}
      {metaLines && metaLines.length > 0 && (
        <div className="doc-section-meta">
          {metaLines.map((line, i) => (
            <span key={i} className="t-micro">
              {line}
            </span>
          ))}
        </div>
      )}

      {/* Mobile: inline ref */}
      <div className="doc-section-meta">
        <span className="t-micro">{refCode}</span>
      </div>

      {/* Section content */}
      {children}
    </section>
  );
}

export default DocSection;
