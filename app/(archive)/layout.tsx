// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE LAYOUT
//
// Shared layout for all archive document pages.
// Provides consistent metadata and styling context.
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from 'react';
import '@/styles/archive.css';

export default function ArchiveLayout({ children }: { children: ReactNode }) {
  return children;
}
