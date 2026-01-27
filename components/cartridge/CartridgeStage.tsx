'use client';

import { Suspense, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { CartridgeModel } from './CartridgeModel';
import { useCartridgeMachine, TIMINGS } from '@/hooks/useCartridgeMachine';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE STAGE — Main Canvas with Industrial Lighting
//
// The cartridge IS the UI. Not a website navbar.
// User interacts with a 3D cartridge like a physical object.
//
// Lighting: industrial studio, not cinematic.
// - 2 directionals + ambient
// - Subtle reflections
// - No dramatic shadows
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// AUDIO HOOK — Web Audio for boot sounds
// ─────────────────────────────────────────────────────────────────────────────────

function useCartridgeSounds() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bootHumGainRef = useRef<GainNode | null>(null);
  const bootHumOscRef = useRef<OscillatorNode | null>(null);

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;
    
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;
      return ctx;
    } catch {
      console.warn('WebAudio not available');
      return null;
    }
  }, []);

  // Helper: create oscillator with envelope
  const createTone = useCallback((
    frequency: number,
    type: OscillatorType,
    duration: number,
    volume: number = 0.1,
    attack: number = 0.005,
    decay: number = 0.1
  ) => {
    const ctx = initAudio();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [initAudio]);

  // Insert click sound
  const playInsertClick = useCallback(() => {
    createTone(1800, 'square', 0.025, 0.08, 0.001, 0.015);
    setTimeout(() => {
      createTone(80, 'sine', 0.12, 0.12, 0.005, 0.08);
      createTone(120, 'triangle', 0.08, 0.06, 0.002, 0.05);
    }, 20);
  }, [createTone]);

  // Read whirr (looping-ish sound for verify phase)
  const playReadWhirr = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    // Simulate disc/chip read with modulated noise
    const duration = TIMINGS.VERIFY_DURATION / 1000;
    
    // Low frequency sweep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(60, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(80, ctx.currentTime + duration);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
    gain1.gain.setValueAtTime(0.04, ctx.currentTime + duration - 0.1);
    gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + duration);

    // High-pitched subtle whine
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(2600, ctx.currentTime + duration * 0.5);
    osc2.frequency.linearRampToValueAtTime(2400, ctx.currentTime + duration);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.05);
    gain2.gain.setValueAtTime(0.015, ctx.currentTime + duration - 0.1);
    gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + duration);
  }, [initAudio]);

  // Verify chime
  const playVerifyChime = useCallback(() => {
    createTone(880, 'sine', 0.15, 0.06, 0.01, 0.1);
    setTimeout(() => createTone(1100, 'sine', 0.12, 0.04, 0.01, 0.08), 80);
    setTimeout(() => createTone(1320, 'sine', 0.2, 0.05, 0.01, 0.15), 160);
  }, [createTone]);

  // Boot hum (fade in and sustain)
  const startBootHum = useCallback(() => {
    const ctx = initAudio();
    if (!ctx || bootHumOscRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);

    bootHumOscRef.current = osc;
    bootHumGainRef.current = gain;
  }, [initAudio]);

  const stopBootHum = useCallback(() => {
    if (bootHumGainRef.current && bootHumOscRef.current) {
      const ctx = audioContextRef.current;
      if (ctx) {
        bootHumGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        setTimeout(() => {
          bootHumOscRef.current?.stop();
          bootHumOscRef.current = null;
          bootHumGainRef.current = null;
        }, 300);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBootHum();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBootHum]);

  return {
    initAudio,
    playInsertClick,
    playReadWhirr,
    playVerifyChime,
    startBootHum,
    stopBootHum,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// LIGHTING SETUP — PS1 era, not showroom
// No rim lights, no colored lights. Matte, slightly tired plastic.
// ─────────────────────────────────────────────────────────────────────────────────

function PS1Lighting() {
  return (
    <>
      {/* Ambient - low, neutral */}
      <ambientLight intensity={0.28} />
      
      {/* Key light - main illumination, neutral white */}
      <directionalLight
        position={[2.5, 3.5, 4]}
        intensity={0.85}
      />
      
      {/* Fill light - subtle, from below-left to soften shadows */}
      <directionalLight
        position={[-2, -1.5, 1]}
        intensity={0.22}
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
      <boxGeometry args={[0.3, 0.2, 0.05]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// STAGE CONTENT
// ─────────────────────────────────────────────────────────────────────────────────

interface StageContentProps {
  onReadyClick: () => void;
}

// Debug helpers removed - orientation locked

function StageContent({ onReadyClick }: StageContentProps) {
  const sounds = useCartridgeSounds();
  
  const machine = useCartridgeMachine({
    onInsertClick: sounds.playInsertClick,
    onVerifyStart: sounds.playReadWhirr,
    onBootStart: () => {
      sounds.playVerifyChime();
      sounds.startBootHum();
    },
    onReady: () => {
      sounds.stopBootHum();
    },
  });

  const handleClick = useCallback(() => {
    // Initialize audio on first click
    sounds.initAudio();
    
    if (machine.state === 'ready') {
      onReadyClick();
    } else {
      machine.handleClick();
    }
  }, [machine, sounds, onReadyClick]);

  return (
    <>
      <PS1Lighting />
      
      <Suspense fallback={<LoadingFallback />}>
        <CartridgeModel
          state={machine.state}
          screenLines={machine.screenLines}
          screenActive={machine.screenActive}
          onPointerEnter={machine.handlePointerEnter}
          onPointerLeave={machine.handlePointerLeave}
          onPointerDown={machine.handlePointerDown}
          onPointerUp={machine.handlePointerUp}
          onClick={handleClick}
        />
      </Suspense>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN STAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeStageProps {
  className?: string;
}

export function CartridgeStage({ className }: CartridgeStageProps) {
  const router = useRouter();

  const handleReadyClick = useCallback(() => {
    router.push('/act-1');
  }, [router]);

  return (
    <div 
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
        position: 'relative',
      }}
    >
      {/* Faint diagonal banding overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent 0,
            transparent 2px,
            rgba(255, 255, 255, 0.008) 2px,
            rgba(255, 255, 255, 0.008) 4px
          )`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      
      <Canvas
        camera={{
          position: [0, 0.35, 4.2], // PS1-era inspection angle
          fov: 28,
          near: 0.01,
          far: 50,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: 0, // NoToneMapping for more control
          outputColorSpace: 'srgb',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <StageContent onReadyClick={handleReadyClick} />
      </Canvas>

      {/* Optional: System info in corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          fontFamily: '"IBM Plex Mono", "Consolas", monospace',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.2)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        REMILIA // ORIGIN BOOT v0.1
      </div>
    </div>
  );
}

export default CartridgeStage;
