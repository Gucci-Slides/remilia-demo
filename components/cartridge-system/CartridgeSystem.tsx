'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SYSTEM — Orchestrator Component
//
// The main component that ties everything together:
// - Manages FSM state with useReducer
// - Renders SceneStage with ConsoleDock + CartridgeStack
// - Handles boot sequence timing
// - Plays audio hooks (insert, boot)
// - Fires onBootComplete callback with selected cartridge ID
// ═══════════════════════════════════════════════════════════════════════════════

import {
  useReducer,
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import * as THREE from 'three';

import { SceneStage } from './SceneStage';
import { ConsoleDock, type ConsoleDockHandle } from './ConsoleDock';
import { CartridgeStack } from './CartridgeStack';
import { cartridgeReducer, initialState } from './state/machine';
import type { CartridgeDef, Pose } from './types';
import { INSERT_DURATION, BOOT_DURATION, CARTRIDGES } from './types';
import type { CartridgeItemHandle } from './CartridgeItem';

// ─────────────────────────────────────────────────────────────────────────────────
// AUDIO HOOKS
// ─────────────────────────────────────────────────────────────────────────────────

function useCartridgeAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(() => {
    if (isInitializedRef.current) return audioContextRef.current;
    try {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      isInitializedRef.current = true;
      return audioContextRef.current;
    } catch {
      console.warn('[CartridgeSystem] WebAudio not available');
      return null;
    }
  }, []);

  const createTone = useCallback(
    (
      frequency: number,
      type: OscillatorType,
      duration: number,
      volume: number = 0.1,
      attack: number = 0.005
    ) => {
      const ctx = audioContextRef.current || initAudio();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    },
    [initAudio]
  );

  const playInsertSound = useCallback(() => {
    createTone(1800, 'square', 0.025, 0.08, 0.001);
    setTimeout(() => {
      createTone(80, 'sine', 0.12, 0.12, 0.005);
      createTone(120, 'triangle', 0.08, 0.06, 0.002);
    }, 20);
  }, [createTone]);

  const playBootSound = useCallback(() => {
    // Boot chime sequence
    createTone(440, 'sine', 0.2, 0.05, 0.01);
    setTimeout(() => createTone(550, 'sine', 0.18, 0.04, 0.01), 100);
    setTimeout(() => createTone(660, 'sine', 0.25, 0.05, 0.01), 200);
    setTimeout(() => createTone(880, 'sine', 0.4, 0.06, 0.02), 350);
  }, [createTone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { initAudio, playInsertSound, playBootSound };
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeSystemProps {
  /** Cartridges to display (defaults to sample CARTRIDGES) */
  cartridges?: CartridgeDef[];
  /** Called when boot sequence completes with the selected cartridge */
  onBootComplete?: (cartridge: CartridgeDef) => void;
  /** Additional class name for container */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function CartridgeSystem({
  cartridges = CARTRIDGES,
  onBootComplete,
  className,
}: CartridgeSystemProps) {
  const [state, dispatch] = useReducer(cartridgeReducer, initialState);
  const consoleDockRef = useRef<ConsoleDockHandle>(null);
  const itemRefs = useRef<Map<string, CartridgeItemHandle>>(new Map());
  const { initAudio, playInsertSound, playBootSound } = useCartridgeAudio();

  // Track aiming state for visual feedback
  const [isAiming, setIsAiming] = useState(false);

  // Compute slot pose (memoized, updated when dock mounts)
  const [slotPose, setSlotPose] = useState<Pose>({
    position: new THREE.Vector3(0, -1.1, 0.3),
    quaternion: new THREE.Quaternion(),
  });

  // Update slot pose once dock is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (consoleDockRef.current) {
        const pose = consoleDockRef.current.getSlotPose();
        setSlotPose(pose);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // BOOT SEQUENCE TIMING
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (state.mode === 'INSERTING') {
      // Initialize audio on first interaction
      initAudio();

      // Play insert sound
      playInsertSound();

      // After insert animation, transition to BOOTING
      const insertTimer = setTimeout(() => {
        dispatch({ type: 'INSERT_COMMIT' });
      }, INSERT_DURATION);

      return () => clearTimeout(insertTimer);
    }
  }, [state.mode, initAudio, playInsertSound]);

  useEffect(() => {
    if (state.mode === 'BOOTING') {
      // Play boot sound
      playBootSound();

      // After boot duration, fire BOOT_DONE
      const bootTimer = setTimeout(() => {
        dispatch({ type: 'BOOT_DONE' });
      }, BOOT_DURATION);

      return () => clearTimeout(bootTimer);
    }
  }, [state.mode, playBootSound]);

  useEffect(() => {
    if (state.mode === 'READY' && state.selectedId) {
      // Find the selected cartridge
      const selectedCartridge = cartridges.find((c) => c.id === state.selectedId);
      if (selectedCartridge && onBootComplete) {
        // Small delay before callback for visual polish
        const readyTimer = setTimeout(() => {
          onBootComplete(selectedCartridge);
        }, 300);
        return () => clearTimeout(readyTimer);
      }
    }
  }, [state.mode, state.selectedId, cartridges, onBootComplete]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AIM CHANGE HANDLER
  // ═══════════════════════════════════════════════════════════════════════════

  const handleAimChange = useCallback((aiming: boolean) => {
    setIsAiming(aiming);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <SceneStage>
        {/* Console dock with slot */}
        <ConsoleDock ref={consoleDockRef} mode={state.mode} />

        {/* Cartridge stack */}
        <CartridgeStack
          cartridges={cartridges}
          machineState={state}
          dispatch={dispatch}
          slotPose={slotPose}
          onAimChange={handleAimChange}
          itemRefs={itemRefs}
        />
      </SceneStage>

      {/* ═══════════════════════════════════════════════════════════════════════
          HTML OVERLAY — PS1-style status display
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          fontFamily: '"IBM Plex Mono", "Consolas", monospace',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.35)',
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ marginBottom: 4, opacity: 0.6 }}>MEMORY CARD / SLOT 01</div>
        <div
          style={{
            color:
              state.mode === 'BOOTING'
                ? '#62f6a5'
                : state.mode === 'READY'
                ? '#62f6a5'
                : state.mode === 'INSERTING'
                ? '#f4c84b'
                : isAiming
                ? '#6b9dff'
                : 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.3s',
          }}
        >
          {state.statusText}
          {state.mode === 'BOOTING' && (
            <span
              style={{
                animation: 'blink 0.5s step-end infinite',
              }}
            >
              ...
            </span>
          )}
        </div>
      </div>

      {/* Top-right: selected cartridge info */}
      {state.selectedId && (state.mode === 'BOOTING' || state.mode === 'READY') && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            fontFamily: '"IBM Plex Mono", "Consolas", monospace',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: state.mode === 'READY' ? '#62f6a5' : 'rgba(255, 255, 255, 0.4)',
            zIndex: 10,
            pointerEvents: 'none',
            userSelect: 'none',
            textAlign: 'right',
            transition: 'color 0.3s',
          }}
        >
          <div style={{ opacity: 0.6, marginBottom: 2 }}>
            {cartridges.find((c) => c.id === state.selectedId)?.serial}
          </div>
          <div style={{ fontSize: 14, letterSpacing: '0.2em' }}>
            {cartridges.find((c) => c.id === state.selectedId)?.title}
          </div>
        </div>
      )}

      {/* Blink animation keyframes */}
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default CartridgeSystem;
