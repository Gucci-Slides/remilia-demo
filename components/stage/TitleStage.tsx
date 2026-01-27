'use client';

import React from 'react';
import { 
  TitleToAct1Gate, 
  createTitleContent, 
  DefaultActContent 
} from './TitleToAct1Gate';

// ═══════════════════════════════════════════════════════════════════════════
// TITLE STAGE — Wrapper for the Imageless Title → Act I Gate
// 
// DESIGN:
// - "Baseline Fracture" wordmark (RE/MIL/IA with micro offsets)
// - Clean empty field with oversized wordmark
// - Counterweight status line in top-right
// 
// MOTION:
// - IA opacity micro-resolves on scroll (0.86 → 0.94 over first 10%)
// - Overall title layer fades out as user scrolls
// - Act I fades in after title is gone
// 
// NO imagery, symbols, or decorative UI.
// ═══════════════════════════════════════════════════════════════════════════

export function TitleStage() {
  return (
    <TitleToAct1Gate
      titleNode={createTitleContent}
      actNode={<DefaultActContent />}
    />
  );
}
