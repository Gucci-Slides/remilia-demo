'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CARD BUTTON — PS1 State Persistence UI
//
// Fixed position, persistent across all states.
// This is not a menu button. This is a system interface.
//
// RULES:
// - No hover animation
// - Cursor change only
// - Monospaced, all caps
// - Slightly darker than background
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryCardButtonProps {
  onClick: () => void;
  className?: string;
}

export function MemoryCardButton({ onClick, className }: MemoryCardButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        position: 'fixed',
        // Desktop: bottom-right
        // Mobile handled via media query in parent
        bottom: 'calc(var(--baseline) * 4)',
        right: 'calc(var(--baseline) * 4)',
        zIndex: 100,
        
        // Appearance
        padding: 'calc(var(--baseline) * 1.5) calc(var(--baseline) * 2)',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        background: 'rgba(0, 0, 0, 0.02)',
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '10px',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.55)',
        lineHeight: 1.4,
        textAlign: 'left',
        
        // Cursor only — no animation
        cursor: 'pointer',
        
        // Reset
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label="Open memory card"
    >
      <div>Memory Card</div>
      <div style={{ opacity: 0.6 }}>Slot 1</div>
    </button>
  );
}

// Mobile-centered variant
export function MemoryCardButtonMobile({ onClick, className }: MemoryCardButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        position: 'fixed',
        bottom: 'calc(var(--baseline) * 3)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        
        // Appearance
        padding: 'calc(var(--baseline) * 1.5) calc(var(--baseline) * 3)',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        background: 'rgba(0, 0, 0, 0.02)',
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '10px',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.55)',
        lineHeight: 1.4,
        textAlign: 'center',
        
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label="Open memory card"
    >
      <div>Memory Card</div>
      <div style={{ opacity: 0.6 }}>Slot 1</div>
    </button>
  );
}

export default MemoryCardButton;
