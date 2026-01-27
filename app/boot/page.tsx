'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT PAGE — Entry Point
//
// Bouncing smiley → click → glitch → navigate to title page
// ═══════════════════════════════════════════════════════════════════════════════

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { BootGate } from '@/components/boot/BootGate';

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────────

export default function BootPage() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // Navigate to home/title page after glitch completes
    router.push('/');
  }, [router]);

  return (
    <BootGate 
      onComplete={handleComplete}
      smileyUrl="/smile.png"
      crtEnabled={true}
    />
  );
}
