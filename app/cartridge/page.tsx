'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE PAGE — Diegetic Navigation Hub
//
// Full-screen 3D cartridge selection interface.
// Select a cartridge → insert into console → boot → route transition.
//
// This is the main entry point for the cartridge-based navigation system.
// Each cartridge routes to a different section of the site.
// ═══════════════════════════════════════════════════════════════════════════════

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CartridgeSystem } from '@/components/cartridge-system/CartridgeSystem';
import { CARTRIDGES, type CartridgeDef } from '@/components/cartridge-system/types';

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export default function CartridgePage() {
  const router = useRouter();

  // Handle boot complete — navigate to the cartridge's route
  const handleBootComplete = useCallback(
    (cartridge: CartridgeDef) => {
      console.log(`[CartridgePage] Booted: ${cartridge.id}`);

      if (cartridge.route) {
        // Navigate to the cartridge's destination
        router.push(cartridge.route);
      } else {
        // Fallback: log and stay on page
        console.log(`[CartridgePage] No route defined for ${cartridge.id}`);
      }
    },
    [router]
  );

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#0a0a0c',
      }}
    >
      <CartridgeSystem
        cartridges={CARTRIDGES}
        onBootComplete={handleBootComplete}
        className="cartridge-stage"
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          INSTRUCTIONS OVERLAY
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          fontFamily: '"IBM Plex Mono", "Consolas", monospace',
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.4)',
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1.8,
        }}
      >
        <div>REMILIA // BOOT LOADER v0.2</div>
        <div style={{ marginTop: 12, opacity: 0.5 }}>
          <div>HOVER → INSPECT</div>
          <div>DRAG → ROTATE</div>
          <div>DROP ON SLOT → INSERT</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER BRANDING
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          fontFamily: '"IBM Plex Mono", "Consolas", monospace',
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.15)',
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
          textAlign: 'right',
        }}
      >
        <div>MEMORY CARD INTERFACE</div>
        <div style={{ marginTop: 4 }}>© REMILIA COLLECTIVE</div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #0a0a0c;
        }

        .cartridge-stage {
          width: 100%;
          height: 100%;
        }

        /* Custom cursor styles */
        .cartridge-stage canvas {
          cursor: auto;
        }
      `}</style>
    </main>
  );
}
