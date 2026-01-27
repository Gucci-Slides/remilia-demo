// ═══════════════════════════════════════════════════════════════════════════════
// BOOT FX — Constants for boot sequence transition
//
// Single source of truth for timings and colors.
// Phase sequence: idle -> p1 (destabilize) -> p2 (collapse) -> p3 (resolve) -> title
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// PHASE DURATIONS (ms)
// ─────────────────────────────────────────────────────────────────────────────────

export const BOOT_TIMINGS = {
  /** Phase 1: Yellow destabilize (CRT glitch, warm spectrum) */
  P1_DURATION: 350,
  
  /** Phase 2: Color collapse (flash, saturation drop, blue linger) */
  P2_DURATION: 170,
  
  /** Phase 3: Blue asserts (ghost -> title fade in) */
  P3_DURATION: 380,
  
  /** Blue ghost linger after collapse */
  BLUE_LINGER: 60,
  
  /** Total transition duration */
  get TOTAL() {
    return this.P1_DURATION + this.P2_DURATION + this.P3_DURATION;
  },
  
  /** Phase boundaries (cumulative) */
  get P1_END() { return this.P1_DURATION; },
  get P2_END() { return this.P1_DURATION + this.P2_DURATION; },
  get P3_END() { return this.TOTAL; },
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// COLOR TOKENS (LOCKED)
// ─────────────────────────────────────────────────────────────────────────────────

export const BOOT_COLORS = {
  /** Smiley yellow base */
  YELLOW_BASE: '#FFD400',
  
  /** Yellow overdrive (luminance blow-out) */
  YELLOW_OVERDRIVE: '#FFF6C0',
  
  /** Flash white (Phase 2 clipped flash) */
  FLASH_WHITE: '#F5F7FF',
  
  /** Title blue (core text) */
  TITLE_BLUE: '#7FA6FF',
  
  /** Inner glow blue */
  GLOW_INNER: '#5A7DFF',
  
  /** Mid glow blue */
  GLOW_MID: '#4A6BFF',
  
  /** Outer glow blue */
  GLOW_OUTER: '#2B4CFF',
  
  /** Blue ghost (lingers after collapse) */
  BLUE_GHOST: '#3A5CFF',
  
  /** Background (near-black, not pure) */
  BG_BLACK: '#05060A',
  
  /** Subtle green contamination for Phase 1 */
  GREEN_BLEED: '#9AFF6A',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// PHASE TYPE
// ─────────────────────────────────────────────────────────────────────────────────

export type BootPhase = 'idle' | 'p1' | 'p2' | 'p3' | 'title';

// ─────────────────────────────────────────────────────────────────────────────────
// TIMELINE HELPER
// ─────────────────────────────────────────────────────────────────────────────────

export interface PhaseStep {
  phase: BootPhase;
  delay: number;
}

export const BOOT_TIMELINE: PhaseStep[] = [
  { phase: 'p1', delay: 0 },
  { phase: 'p2', delay: BOOT_TIMINGS.P1_DURATION },
  { phase: 'p3', delay: BOOT_TIMINGS.P1_DURATION + BOOT_TIMINGS.P2_DURATION },
  { phase: 'title', delay: BOOT_TIMINGS.TOTAL },
];
