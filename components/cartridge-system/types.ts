// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SYSTEM — Types & Sample Data
//
// Defines CartridgeDef shape and provides sample cartridge configurations.
// Each cartridge has a unique identity via label decal + holographic sticker.
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// CARTRIDGE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────────

export interface CartridgeDef {
  /** Unique identifier for routing */
  id: string;
  /** Display title for the cartridge */
  title: string;
  /** Path to label decal texture (PNG with alpha) */
  labelSrc: string;
  /** Tint color for holographic sticker iridescence */
  holoTint: string;
  /** Serial number display (Y2K aesthetic) */
  serial: string;
  /** Optional: route to navigate on boot complete */
  route?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// POSE TYPE (position + rotation)
// ─────────────────────────────────────────────────────────────────────────────────

export interface Pose {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STATE MACHINE TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type CartridgeMode =
  | 'IDLE'
  | 'HOVER'
  | 'HELD'
  | 'AIMING'
  | 'INSERTING'
  | 'BOOTING'
  | 'READY';

export interface CartridgeMachineState {
  mode: CartridgeMode;
  hoveredId: string | null;
  heldId: string | null;
  selectedId: string | null;
  /** Screen status text for HTML overlay */
  statusText: string;
}

export type CartridgeMachineAction =
  | { type: 'HOVER_IN'; id: string }
  | { type: 'HOVER_OUT'; id: string }
  | { type: 'PICK_UP'; id: string }
  | { type: 'MOVE'; position: THREE.Vector3 }
  | { type: 'AIM_IN' }
  | { type: 'AIM_OUT' }
  | { type: 'DROP' }
  | { type: 'INSERT_COMMIT' }
  | { type: 'BOOT_DONE' }
  | { type: 'RESET' };

// ─────────────────────────────────────────────────────────────────────────────────
// SAMPLE CARTRIDGES
//
// TWEAK: Update labelSrc paths to match your actual decal assets.
// Expected location: public/decals/labels/<id>.png
// ─────────────────────────────────────────────────────────────────────────────────

export const CARTRIDGES: CartridgeDef[] = [
  {
    id: 'origin',
    title: 'ORIGIN',
    labelSrc: '/decals/labels/origin.png',
    holoTint: '#ff6b9d',
    serial: 'RML-001-A',
    route: '/act-1',
  },
  {
    id: 'archive',
    title: 'ARCHIVE',
    labelSrc: '/decals/labels/archive.png',
    holoTint: '#6bffc8',
    serial: 'RML-002-B',
    route: '/gallery',
  },
  {
    id: 'registry',
    title: 'REGISTRY',
    labelSrc: '/decals/labels/registry.png',
    holoTint: '#6b9dff',
    serial: 'RML-003-C',
    route: '/registry',
  },
  {
    id: 'lookbook',
    title: 'LOOKBOOK',
    labelSrc: '/decals/labels/lookbook.png',
    holoTint: '#ffd76b',
    serial: 'RML-004-D',
    route: '/lookbook',
  },
  {
    id: 'terminal',
    title: 'TERMINAL',
    labelSrc: '/decals/labels/terminal.png',
    holoTint: '#c86bff',
    serial: 'RML-005-E',
    route: '/terminal',
  },
  {
    id: 'about',
    title: 'ABOUT',
    labelSrc: '/decals/labels/about.png',
    holoTint: '#ff6b6b',
    serial: 'RML-006-F',
    route: '/about',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

/** Distance threshold for magnetic snap to slot */
export const SLOT_SNAP_DISTANCE = 0.8;

/** Time in ms for insert animation */
export const INSERT_DURATION = 600;

/** Time in ms for boot sequence */
export const BOOT_DURATION = 1200;

/** Hover lift height — subtle, barely noticeable */
export const HOVER_LIFT = 0.035;

/** Held cartridge Z offset from camera plane */
export const HELD_Z_DEPTH = 3.5;

/** Damping factor for smooth motion (0-1, lower = more damping) */
export const MOTION_DAMPING = 0.12;

/** Rotation damping for held cartridge */
export const ROTATION_DAMPING = 0.08;

/** Max rotation during drag inspection (radians) */
export const MAX_DRAG_ROTATION = Math.PI / 4;
