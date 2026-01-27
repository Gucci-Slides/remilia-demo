'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT LOADER — DVD-style bouncing smiley with CRT effects
// ═══════════════════════════════════════════════════════════════════════════════

import { CrtTvFrame } from '../tv/CrtTvFrame';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface BootLoaderProps {
  onInserted?: (cartridgeId: string) => void;
  debug?: boolean;
  /** Enable CRT TV effects */
  crtEnabled?: boolean;
  /** Show power-on animation */
  powerOnAnimation?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function BootLoader({ 
  crtEnabled = true,
  powerOnAnimation = true,
}: BootLoaderProps) {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <CrtTvFrame
        enabled={crtEnabled}
        smileyUrl="/smile.png"
        smileyOpacity={0.9}
        smileyStretch={1}
        smileyBlend="screen"
        intensity={0.7}
        powerOnAnimation={powerOnAnimation}
        curved={true}
        chromatic={true}
        bouncingDvd={true}
      >
        {/* Empty - just the bouncing smiley */}
        <div className="w-full h-full bg-black" />
      </CrtTvFrame>
    </div>
  );
}
