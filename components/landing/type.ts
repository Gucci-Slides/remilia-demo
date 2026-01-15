// ═══════════════════════════════════════════════════════════════════════════
// TYPE.TS — Typography Tokens
// 
// This page is not a website — it is an institutional document.
// Everything should feel measured, restrained, inevitable.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY CLASS TOKENS
// 
// All classes defined in globals.css
// ─────────────────────────────────────────────────────────────────────────────

export const TYPE = {
  // Navigation / Metadata: Inter, 11px, tracking wide, uppercase
  // Used ONLY for: INDEX / REGISTRY, SCROLL indicator, footnotes
  nav: 't-nav',
  
  // Witness mark: Inter, 10px, very low opacity
  witness: 't-witness',
  
  // Inscription: Canela, 22-26px, primary declarative sentences
  inscription: 't-inscription',
  
  // Inscription line: Same as inscription, for Act II sequential reveals
  inscriptionLine: 't-inscription-line',
  
  // Monument: Benguiat, extremely large, REMILIA wordmark only
  monument: 't-monument',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// RHYTHM
// 
// 8px baseline grid
// ─────────────────────────────────────────────────────────────────────────────

export const BASELINE = 8;

export function snapToGrid(value: number): number {
  return Math.round(value / BASELINE) * BASELINE;
}
