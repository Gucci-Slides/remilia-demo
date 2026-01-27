'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// SLOT INDICATOR — Loaded State Confirmation
//
// Small mono text in top-right showing active slot.
// Confirms user is inside a saved context.
//
// Format: SLOT 1 — FILE 03
// ═══════════════════════════════════════════════════════════════════════════════

interface SlotIndicatorProps {
  slotId: string;
}

export function SlotIndicator({ slotId }: SlotIndicatorProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(var(--baseline) * 3)',
        right: 'var(--archive-left, 7vw)',
        zIndex: 50,
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '10px',
        fontWeight: 400,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.5)',
        lineHeight: 1.4,
      }}
    >
      Slot 1 — File {slotId}
    </div>
  );
}

export default SlotIndicator;
