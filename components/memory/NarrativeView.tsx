'use client';

import React from 'react';
import { NARRATIVES, NarrativeContent, NarrativeLine } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE VIEW — Loaded Memory Content
//
// Displays narrative text for a loaded save block.
// Inherits baseline grid from system.
// Scroll enabled when content overflows.
//
// RULES:
// - Same primary serif as wordmark
// - No headlines, no sections
// - Continuous record text
// - One red word per content block (sparse)
// ═══════════════════════════════════════════════════════════════════════════════

const REMILIA_RED = '#E10600';

interface NarrativeViewProps {
  slotId: string;
}

export function NarrativeView({ slotId }: NarrativeViewProps) {
  const narrative = NARRATIVES[slotId];
  
  if (!narrative) {
    return (
      <div className="narrative-text" style={{ opacity: 0.5 }}>
        No record found for this slot.
      </div>
    );
  }

  return (
    <div
      className="memory-narrative-scroll"
      style={{
        // Position: same anchor as wordmark (bottom-left)
        position: 'fixed',
        left: 'var(--archive-left, 7vw)',
        bottom: 'var(--archive-bottom, 10vh)',
        zIndex: 20,
        
        // Scrollable content area
        maxHeight: '60vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        className="narrative-text"
        style={{
          maxWidth: '44ch',
        }}
      >
        {narrative.lines.map((line, i) => (
          <NarrativeLineComponent
            key={i}
            line={line}
            isFirst={i === 0}
          />
        ))}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// NARRATIVE LINE — Individual line with optional red intrusion
// ─────────────────────────────────────────────────────────────────────────────────

interface NarrativeLineComponentProps {
  line: NarrativeLine;
  isFirst: boolean;
}

function NarrativeLineComponent({ line, isFirst }: NarrativeLineComponentProps) {
  const renderText = () => {
    if (!line.redWord) return line.text;

    // Find and highlight the red word (case-insensitive)
    const regex = new RegExp(`(${line.redWord})`, 'i');
    const parts = line.text.split(regex);

    return parts.map((part, i) => {
      if (part.toLowerCase() === line.redWord?.toLowerCase()) {
        return (
          <span
            key={i}
            style={{
              color: REMILIA_RED,
              mixBlendMode: 'multiply',
              filter: 'blur(0.25px)',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <p
      style={{
        marginTop: isFirst ? 0 : 'calc(var(--baseline) * 1.5)',
      }}
    >
      {renderText()}
    </p>
  );
}

export default NarrativeView;
