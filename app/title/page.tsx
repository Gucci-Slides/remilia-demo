'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// TITLE PAGE — PS2 Boot Lockup Style
//
// Electric blue REMILIA with glow/bloom effect.
// Destination after boot sequence glitch transition.
// ═══════════════════════════════════════════════════════════════════════════════

import { Orbitron } from 'next/font/google';
import { TitleLockup } from '@/components/title/TitleLockup';

// ─────────────────────────────────────────────────────────────────────────────────
// FONT
// ─────────────────────────────────────────────────────────────────────────────────

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
  display: 'swap',
});

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────────

export default function TitlePage() {
  return (
    <main className={orbitron.variable}>
      <TitleLockup
        title="REMILIA"
        subtext="Remilia Network State"
        flicker={true}
        bloomPulse={true}
        animate={true}
      />
    </main>
  );
}
