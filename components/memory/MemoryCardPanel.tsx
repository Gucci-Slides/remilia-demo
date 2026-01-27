'use client';

import React from 'react';
import { SAVE_BLOCKS, SaveBlock } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CARD PANEL — Save Block Selector
//
// Flat overlay panel. No animation on open/close.
// Vertical list of save blocks.
//
// RULES:
// - Squares are solid blocks, not checkboxes
// - No icons, no images
// - Monospaced font
// - Perfect baseline alignment
// - Equal vertical spacing
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryCardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlot: (slotId: string) => void;
  activeSlot: string | null;
}

export function MemoryCardPanel({
  isOpen,
  onClose,
  onSelectSlot,
  activeSlot,
}: MemoryCardPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 199,
          background: 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Memory card"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'clamp(280px, 40vw, 420px)',
          zIndex: 200,
          
          // Appearance
          background: 'var(--archive-paper, #F3EEE6)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          
          // Layout
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'calc(var(--baseline) * 6)',
        }}
      >
        {/* Save blocks list */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--baseline) * 2.5)',
          }}
        >
          {SAVE_BLOCKS.map((block) => (
            <SaveBlockItem
              key={block.id}
              block={block}
              isActive={block.id === activeSlot}
              onClick={() => onSelectSlot(block.id)}
            />
          ))}

          {/* Separator */}
          <div
            style={{
              height: 'calc(var(--baseline) * 2)',
            }}
            aria-hidden="true"
          />

          {/* Eject */}
          <EjectButton onClick={onClose} />
        </div>

        {/* Panel metadata */}
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(var(--baseline) * 4)',
            left: 'calc(var(--baseline) * 6)',
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          Memory Card — Slot 1
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SAVE BLOCK ITEM — Individual slot entry
// ─────────────────────────────────────────────────────────────────────────────────

interface SaveBlockItemProps {
  block: SaveBlock;
  isActive: boolean;
  onClick: () => void;
}

function SaveBlockItem({ block, isActive, onClick }: SaveBlockItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'calc(var(--baseline) * 1.5)',
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0.08em',
        color: isActive ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        lineHeight: 1.4,
        
        // No focus ring — intentional for aesthetic
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-current={isActive ? 'true' : undefined}
    >
      {/* Solid square indicator */}
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          background: isActive ? 'var(--remilia-red, #E10600)' : 'rgba(0, 0, 0, 0.6)',
          flexShrink: 0,
          transform: 'translateY(-1px)',
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
// EJECT BUTTON — Return to base state
// ─────────────────────────────────────────────────────────────────────────────────

interface EjectButtonProps {
  onClick: () => void;
}

function EjectButton({ onClick }: EjectButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'calc(var(--baseline) * 1.5)',
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        
        // Typography
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: '13px',
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
          width: '8px',
          height: '8px',
          border: '1px solid rgba(0, 0, 0, 0.4)',
          background: 'transparent',
          flexShrink: 0,
          transform: 'translateY(-1px)',
        }}
        aria-hidden="true"
      />

      <span>EJECT</span>
    </button>
  );
}

export default MemoryCardPanel;
