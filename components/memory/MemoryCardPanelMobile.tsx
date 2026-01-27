'use client';

import React from 'react';
import { SAVE_BLOCKS, SaveBlock } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CARD PANEL (MOBILE) — Full-screen overlay variant
//
// Same content as desktop, but fills the viewport.
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryCardPanelMobileProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlot: (slotId: string) => void;
  activeSlot: string | null;
}

export function MemoryCardPanelMobile({
  isOpen,
  onClose,
  onSelectSlot,
  activeSlot,
}: MemoryCardPanelMobileProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Memory card"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        
        // Appearance
        background: 'var(--archive-paper, #F3EEE6)',
        
        // Layout
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'calc(var(--baseline) * 4)',
      }}
    >
      {/* Save blocks list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--baseline) * 3)',
          width: '100%',
          maxWidth: '280px',
        }}
      >
        {SAVE_BLOCKS.map((block) => (
          <SaveBlockItemMobile
            key={block.id}
            block={block}
            isActive={block.id === activeSlot}
            onClick={() => onSelectSlot(block.id)}
          />
        ))}

        {/* Separator */}
        <div
          style={{
            height: 'calc(var(--baseline) * 3)',
          }}
          aria-hidden="true"
        />

        {/* Eject */}
        <EjectButtonMobile onClick={onClose} />
      </div>

      {/* Panel metadata */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(var(--baseline) * 4)',
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
        }}
      >
        Memory Card — Slot 1
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MOBILE SAVE BLOCK ITEM
// ─────────────────────────────────────────────────────────────────────────────────

interface SaveBlockItemMobileProps {
  block: SaveBlock;
  isActive: boolean;
  onClick: () => void;
}

function SaveBlockItemMobile({ block, isActive, onClick }: SaveBlockItemMobileProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'calc(var(--baseline) * 2)',
        padding: 'calc(var(--baseline) * 1.5) 0',
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: '0.08em',
        color: isActive ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        lineHeight: 1.4,
        
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-current={isActive ? 'true' : undefined}
    >
      {/* Solid square indicator */}
      <span
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          background: isActive ? 'var(--remilia-red, #E10600)' : 'rgba(0, 0, 0, 0.6)',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />

      {/* Slot number */}
      <span style={{ opacity: 0.5 }}>{block.id}</span>

      {/* Label */}
      <span>
        {block.label}
        {block.sublabel && (
          <span style={{ opacity: 0.5 }}> / {block.sublabel}</span>
        )}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MOBILE EJECT BUTTON
// ─────────────────────────────────────────────────────────────────────────────────

interface EjectButtonMobileProps {
  onClick: () => void;
}

function EjectButtonMobile({ onClick }: EjectButtonMobileProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'calc(var(--baseline) * 2)',
        padding: 'calc(var(--baseline) * 1.5) 0',
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: '0.08em',
        color: 'rgba(0, 0, 0, 0.5)',
        lineHeight: 1.4,
        
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Empty square indicator */}
      <span
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          border: '1px solid rgba(0, 0, 0, 0.4)',
          background: 'transparent',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />

      <span>EJECT</span>
    </button>
  );
}

export default MemoryCardPanelMobile;
