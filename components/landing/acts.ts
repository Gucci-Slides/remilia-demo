// ═══════════════════════════════════════════════════════════════════════════
// ACTS.TS — Landing Page Copy
// 
// ACT I: 4 internal beats with progressive reveal
// Only one beat is ACTIVE at a time; previous beats become ARCHIVED.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// ACT I — INSCRIPTION (part of Beat 1)
// ─────────────────────────────────────────────────────────────────────────────

export const ACT_I = {
  inscription: 'Remilia is a Network State.',
};

// ─────────────────────────────────────────────────────────────────────────────
// LINE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface ActILine {
  id: string;
  text: string;
  weight: 'regular' | 'medium';
  paragraphBreak?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 1 — DEFINITION
// 
// "Remilia is a Network State.
// Not a platform.
// Not a brand.
// Not a DAO.
// A sovereign cultural organism."
// ─────────────────────────────────────────────────────────────────────────────

export const BEAT_1_LINES: ActILine[] = [
  { id: 'b1-1', text: 'Not a platform.', weight: 'regular' },
  { id: 'b1-2', text: 'Not a brand.', weight: 'regular' },
  { id: 'b1-3', text: 'Not a DAO.', weight: 'regular' },
  { id: 'b1-4', text: 'A sovereign cultural organism.', weight: 'medium' },
];

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 2 — ORIGIN / MEDIUM
// 
// "It began as a net art collective.
// An open-ended online factory.
// A meeting ground for an emerging scene.
// 
// Its medium is the internet.
// Its materials are identity,
// finance,
// industry,
// and circulation."
// ─────────────────────────────────────────────────────────────────────────────

export const BEAT_2_LINES: ActILine[] = [
  { id: 'b2-1', text: 'It began as a net art collective.', weight: 'regular' },
  { id: 'b2-2', text: 'An open-ended online factory.', weight: 'regular' },
  { id: 'b2-3', text: 'A meeting ground for an emerging scene.', weight: 'regular' },
  // Medium sub-block
  { id: 'b2-4', text: 'Its medium is the internet.', weight: 'regular', paragraphBreak: true },
  { id: 'b2-5', text: 'Its materials are identity,', weight: 'regular' },
  { id: 'b2-6', text: 'finance,', weight: 'regular' },
  { id: 'b2-7', text: 'industry,', weight: 'regular' },
  { id: 'b2-8', text: 'and circulation.', weight: 'regular' },
];

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 3 — OUTPUTS
// 
// "Remilia produces artifacts.
// Characters.
// Events.
// Publications.
// Garments.
// Records.
// 
// Subculture precedes ideology.
// Fashion and music converge.
// Belief follows."
// ─────────────────────────────────────────────────────────────────────────────

export const BEAT_3_LINES: ActILine[] = [
  { id: 'b3-1', text: 'Remilia produces artifacts.', weight: 'regular' },
  { id: 'b3-2', text: 'Characters.', weight: 'regular' },
  { id: 'b3-3', text: 'Events.', weight: 'regular' },
  { id: 'b3-4', text: 'Publications.', weight: 'regular' },
  { id: 'b3-5', text: 'Garments.', weight: 'regular' },
  { id: 'b3-6', text: 'Records.', weight: 'regular' },
  // Philosophy sub-block
  { id: 'b3-7', text: 'Subculture precedes ideology.', weight: 'regular', paragraphBreak: true },
  { id: 'b3-8', text: 'Fashion and music converge.', weight: 'regular' },
  { id: 'b3-9', text: 'Belief follows.', weight: 'regular' },
];

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 4 — PARTICIPATION / RECORD
// 
// "Remilia is not consumed.
// It is participated in.
// It is worn.
// It is attended.
// It is archived.
// 
// This site is a record of that process."
// ─────────────────────────────────────────────────────────────────────────────

export const BEAT_4_LINES: ActILine[] = [
  { id: 'b4-1', text: 'Remilia is not consumed.', weight: 'regular' },
  { id: 'b4-2', text: 'It is participated in.', weight: 'regular' },
  { id: 'b4-3', text: 'It is worn.', weight: 'regular' },
  { id: 'b4-4', text: 'It is attended.', weight: 'regular' },
  { id: 'b4-5', text: 'It is archived.', weight: 'regular' },
  // Closing
  { id: 'b4-6', text: 'This site is a record of that process.', weight: 'medium', paragraphBreak: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// ALL BEATS (for reference and fallback)
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_BEATS = [BEAT_1_LINES, BEAT_2_LINES, BEAT_3_LINES, BEAT_4_LINES];

export const ACT_I_LINES: ActILine[] = [
  ...BEAT_1_LINES,
  ...BEAT_2_LINES.map((l, i) => i === 0 ? { ...l, paragraphBreak: true } : l),
  ...BEAT_3_LINES.map((l, i) => i === 0 ? { ...l, paragraphBreak: true } : l),
  ...BEAT_4_LINES.map((l, i) => i === 0 ? { ...l, paragraphBreak: true } : l),
];

// Legacy exports
export type ActIILine = ActILine;
export const ACT_II_LINES = ACT_I_LINES;
export const BEAT_4A_LINES = BEAT_3_LINES.slice(6); // Philosophy lines
export const BEAT_4B_LINES = BEAT_4_LINES; // Participation + closing

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL TIMING
// ─────────────────────────────────────────────────────────────────────────────

export const SCROLL_TIMING = {
  actII: { start: 0.10, end: 0.35 },
  witnessMarkAppear: 0.40,
};
