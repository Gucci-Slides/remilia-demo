// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SYSTEM — Exports
//
// Diegetic cartridge-based navigation system for Next.js + React Three Fiber.
//
// Main entry point:
// - CartridgeSystem: The complete orchestrator component
//
// Sub-components:
// - SceneStage: Canvas wrapper with lighting/environment
// - ConsoleDock: Console slab with insertion slot
// - CartridgeStack: Arranges cartridges in pile
// - CartridgeItem: Individual interactive cartridge
//
// Utilities:
// - types: CartridgeDef, CARTRIDGES sample data, constants
// - state/machine: FSM reducer and helpers
// - utils/math: Damping, lerp, ray-plane intersection
// - decals/HoloStickerMaterial: Holographic material factory
// ═══════════════════════════════════════════════════════════════════════════════

// Main component
export { CartridgeSystem } from './CartridgeSystem';

// Sub-components
export { SceneStage } from './SceneStage';
export { ConsoleDock, type ConsoleDockHandle } from './ConsoleDock';
export { CartridgeStack } from './CartridgeStack';
export { CartridgeItem, type CartridgeItemHandle } from './CartridgeItem';

// Types and data
export type {
  CartridgeDef,
  Pose,
  CartridgeMode,
  CartridgeMachineState,
  CartridgeMachineAction,
} from './types';
export {
  CARTRIDGES,
  SLOT_SNAP_DISTANCE,
  INSERT_DURATION,
  BOOT_DURATION,
  HOVER_LIFT,
  HELD_Z_DEPTH,
  MOTION_DAMPING,
  ROTATION_DAMPING,
  MAX_DRAG_ROTATION,
} from './types';

// State machine
export {
  cartridgeReducer,
  initialState,
  isHeld,
  isHovered,
  isSelected,
  isInteractive,
  canPickUp,
} from './state/machine';

// Math utilities
export {
  damp,
  dampVector3,
  dampQuaternion,
  dampEuler,
  rayPlaneIntersect,
  isNear,
  distanceFalloff,
  clampAngle,
  pointerDeltaToRotation,
  findLargestMesh,
  springStep,
  type SpringState,
} from './utils/math';

// Material utilities
export {
  HoloStickerMaterial,
  makeHoloMaterial,
  loadHoloTexture,
  loadHoloTextureSync,
  type HoloMaterialOptions,
} from './decals/HoloStickerMaterial';
