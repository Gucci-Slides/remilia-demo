'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE STACK — Arranges Cartridges in a Pile
//
// Maps CartridgeDef array to CartridgeItem components with stacked positioning.
// Each cartridge has slight random jitter for organic "pile" feel.
//
// TWEAK POINTS:
// - STACK_BASE_POSITION: Where the stack starts [x, y, z]
// - Y_STEP: Vertical spacing between cartridges
// - Z_JITTER / ROT_JITTER: Randomness amounts
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import * as THREE from 'three';
import { CartridgeItem, type CartridgeItemHandle } from './CartridgeItem';
import type { CartridgeDef, CartridgeMachineState, CartridgeMachineAction, Pose } from './types';

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS — TWEAK THESE
// ─────────────────────────────────────────────────────────────────────────────────

// Base position of the stack (bottom cartridge)
// CHANGE 1: Moved closer to console (+0.35 X) and toward camera (+0.25 Z)
// Stack should overlap console silhouette slightly — next motion feels inevitable
const STACK_BASE_POSITION: [number, number, number] = [-0.75, -0.48, 0.9];

// Vertical spacing between cartridges
const Y_STEP = 0.06;

// Random Z jitter range (+/-)
const Z_JITTER = 0.01;

// Random X jitter range (+/-) — slight horizontal scatter
const X_JITTER = 0.012;

// Random rotation Z jitter range (+/- radians) — more variance for legibility
const ROT_Z_JITTER = 0.06;

// Random rotation X jitter (slight tilt to catch light)
const ROT_X_JITTER = 0.02;

// Random rotation Y jitter (slight yaw variation)
const ROT_Y_JITTER = 0.025;

// Downward resting bias — makes stack feel settled
const RESTING_BIAS = 0.02;

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface CartridgeStackProps {
  cartridges: CartridgeDef[];
  machineState: CartridgeMachineState;
  dispatch: React.Dispatch<CartridgeMachineAction>;
  slotPose: Pose;
  onAimChange: (isAiming: boolean) => void;
  itemRefs?: React.MutableRefObject<Map<string, CartridgeItemHandle>>;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SEEDED RANDOM (deterministic per cartridge)
// ─────────────────────────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function randomInRange(seed: number, range: number): number {
  return (seededRandom(seed) - 0.5) * 2 * range;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function CartridgeStack({
  cartridges,
  machineState,
  dispatch,
  slotPose,
  onAimChange,
  itemRefs,
}: CartridgeStackProps) {
  // Compute home poses for each cartridge (memoized)
  const homePoses = useMemo(() => {
    const isTopCartridge = (index: number) => index === cartridges.length - 1;
    const isMiddleCartridge = (index: number) => index === Math.floor(cartridges.length / 2);

    return cartridges.map((def, index): Pose => {
      // Use cartridge ID hash as seed for consistent randomness
      const seed = def.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

      // CHANGE 1: Top cartridge AIMED toward slot, not just lifted
      // Creates a vector from cartridge nose → slot center
      const topLift = isTopCartridge(index) ? 0.04 : 0;
      const topRotY = isTopCartridge(index) ? -0.18 : 0; // aimed toward console
      const topRotX = isTopCartridge(index) ? -0.06 : 0; // nose tilted down toward slot
      const topRotZ = isTopCartridge(index) ? -0.02 : 0; // subtle roll

      // CHANGE 3: Break stack perfection — alternating Z rotations
      const stackImperfectionZ = isTopCartridge(index) ? 0 : (index % 2 === 0 ? 0.03 : -0.03);
      // One middle cartridge gets a tiny X offset
      const middleXOffset = isMiddleCartridge(index) ? 0.012 : 0;

      // Stack position with jitter + resting bias
      const position = new THREE.Vector3(
        STACK_BASE_POSITION[0] + randomInRange(seed + 1, X_JITTER) + middleXOffset,
        STACK_BASE_POSITION[1] + index * Y_STEP - RESTING_BIAS + topLift,
        STACK_BASE_POSITION[2] + randomInRange(seed + 2, Z_JITTER)
      );

      // Stack rotation with jitter + imperfection
      const euler = new THREE.Euler(
        randomInRange(seed + 5, ROT_X_JITTER) + topRotX,
        randomInRange(seed + 3, ROT_Y_JITTER) + topRotY,
        randomInRange(seed + 4, ROT_Z_JITTER) + topRotZ + stackImperfectionZ
      );
      const quaternion = new THREE.Quaternion().setFromEuler(euler);

      return { position, quaternion };
    });
  }, [cartridges]);

  return (
    <group>
      {cartridges.map((def, index) => (
        <CartridgeItem
          key={def.id}
          ref={(handle) => {
            if (itemRefs && handle) {
              itemRefs.current.set(def.id, handle);
            }
          }}
          def={def}
          homePose={homePoses[index]}
          stackIndex={index}
          machineState={machineState}
          dispatch={dispatch}
          slotPose={slotPose}
          onAimChange={onAimChange}
        />
      ))}
    </group>
  );
}

export default CartridgeStack;
