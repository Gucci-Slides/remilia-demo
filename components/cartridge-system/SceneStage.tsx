'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE STAGE — Canvas + Studio Lighting + Shadow Table
//
// Staged product-shot lighting:
// - Key light: main shape + shadow
// - Rim light: edge separation from background
// - Shadow catcher plane: grounds objects in space
// - Fog: depth + cinematic falloff
// ═══════════════════════════════════════════════════════════════════════════════

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Suspense, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface SceneStageProps {
  children: ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STUDIO LIGHTING — Key + Rim setup
// ─────────────────────────────────────────────────────────────────────────────────

function StudioLighting() {
  return (
    <>
      {/* Ambient — very low, just to lift shadows */}
      <ambientLight intensity={0.22} />

      {/* Key light — main illumination, casts shadows, gives shape */}
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* General rim light — soft edge separation */}
      <directionalLight
        position={[-6, 2, -2]}
        intensity={0.25}
      />

      {/* Console-specific rim light
          Behind + above console, no shadows
          Goal: edges separate from void, top plane readable, console still dormant
          CHANGE 4: Boosted intensity +0.1, moved slightly higher/back */}
      <directionalLight
        position={[1.5, 1.5, -2.2]}
        intensity={0.5}
        color="#e8eef8"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// LOADING FALLBACK
// ─────────────────────────────────────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.3, 0.08]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function SceneStage({ children, className }: SceneStageProps) {
  return (
    <div
      className={`sceneWrap ${className || ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        // Radial gradient background matching the mock
        background: `radial-gradient(
          1200px 600px at 50% 20%,
          #0b0d12 0%,
          #050608 60%,
          #030407 100%
        )`,
      }}
    >
      {/* Dust/film grain overlay — huge vibe, cheap */}
      <div
        style={{
          content: '""',
          position: 'absolute',
          inset: '-20%',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0.08,
          mixBlendMode: 'screen',
          filter: 'blur(0.4px)',
          // Procedural noise pattern
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          animation: 'drift 14s linear infinite',
        }}
      />

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          // CHANGE 4: Lowered Y by ~0.07 — console feels heavier, stack has more presence
          // Do NOT raise camera, do NOT zoom in
          position: [0, 0.45, 4.4],
          fov: 28,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: 0,
          outputColorSpace: 'srgb',
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* Scene background */}
        <color attach="background" args={['#050608']} />

        {/* Fog — depth + cinematic falloff */}
        <fog attach="fog" args={['#050608', 6, 14]} />

        {/* Studio lighting */}
        <StudioLighting />

        {/* Shadow catcher "table" plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.62, 0]}
          receiveShadow
        >
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.35} />
        </mesh>

        {/* Scene content */}
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>

        {/* Preload assets */}
        <Preload all />
      </Canvas>

      {/* CSS animation for dust drift */}
      <style jsx>{`
        @keyframes drift {
          from { transform: translate3d(-2%, -2%, 0); }
          to { transform: translate3d(2%, 2%, 0); }
        }
      `}</style>
    </div>
  );
}

export default SceneStage;
