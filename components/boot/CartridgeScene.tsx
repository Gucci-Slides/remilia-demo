'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SCENE — Canvas + Lighting + Environment
//
// The 3D scene container for the boot loader cartridge display.
// ═══════════════════════════════════════════════════════════════════════════════

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Cartridge } from './Cartridge';
import { ScreenFade } from './ScreenFade';
import { useCartridgeSelection } from '../../hooks/useCartridgeSelection';
import { ORIGIN_LABEL, NETWORK_LABEL, RECORDS_LABEL, type LabelSpec } from './useLabelTexture';

// ─────────────────────────────────────────────────────────────────────────────────
// CAMERA CONSTANTS — Locked view from above
// ─────────────────────────────────────────────────────────────────────────────────

const CAMERA_POSITION: [number, number, number] = [0.12, 0.58, -0.02];
const CAMERA_FOV = 35;

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeSceneProps {
  label?: LabelSpec;
  onSelected?: (id: string) => void;
  debug?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function CartridgeScene({ 
  label = ORIGIN_LABEL,
  onSelected,
  debug = false,
}: CartridgeSceneProps) {
  const state = useCartridgeSelection((s) => s.state);
  const isInserting = state === 'inserting' || state === 'inserted';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{
          position: CAMERA_POSITION,
          fov: CAMERA_FOV,
          near: 0.01,
          far: 100,
        }}
        style={{ background: '#000' }}
      >
        <Suspense fallback={null}>
          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Key light — top-left */}
          <directionalLight
            position={[2, 4, -1]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Fill light — softer, opposite side */}
          <directionalLight
            position={[-2, 2, 2]}
            intensity={0.4}
          />
          
          {/* Rim light — behind for edge highlight */}
          <pointLight
            position={[0, 1, -2]}
            intensity={0.6}
            color="#ffffff"
          />

          {/* Contact shadows for grounding */}
          <ContactShadows
            position={[0, -0.18, 0]}
            opacity={0.5}
            scale={3}
            blur={2}
            far={1}
          />

          {/* The cartridge */}
          <Cartridge
            id="origin"
            label={label}
            onSelected={onSelected}
            debug={debug}
          />
        </Suspense>
      </Canvas>

      {/* Screen fade overlay */}
      <ScreenFade 
        visible={isInserting}
        onFadeComplete={() => {
          // Fade complete — could trigger navigation here
        }}
      />
    </div>
  );
}

// Export label presets for convenience
export { ORIGIN_LABEL, NETWORK_LABEL, RECORDS_LABEL };
