// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE SYSTEM — Math Utilities
//
// Damping, lerp, and ray-plane intersection helpers for smooth physics-lite motion.
// No physics engine — deterministic exponential smoothing.
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// DAMPING / LERP HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Exponential damping for smooth interpolation.
 * This is the "damp" function — framerate-independent smoothing.
 *
 * @param current - Current value
 * @param target - Target value
 * @param lambda - Damping factor (higher = faster, typically 5-25)
 * @param dt - Delta time in seconds
 */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number
): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Exponential damping for Vector3.
 * Mutates the `current` vector in place.
 */
export function dampVector3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number
): void {
  current.x = damp(current.x, target.x, lambda, dt);
  current.y = damp(current.y, target.y, lambda, dt);
  current.z = damp(current.z, target.z, lambda, dt);
}

/**
 * Exponential damping for Quaternion using slerp.
 * Mutates the `current` quaternion in place.
 */
export function dampQuaternion(
  current: THREE.Quaternion,
  target: THREE.Quaternion,
  lambda: number,
  dt: number
): void {
  const t = 1 - Math.exp(-lambda * dt);
  current.slerp(target, t);
}

/**
 * Exponential damping for Euler angles.
 * Mutates the `current` euler in place.
 */
export function dampEuler(
  current: THREE.Euler,
  target: THREE.Euler,
  lambda: number,
  dt: number
): void {
  current.x = damp(current.x, target.x, lambda, dt);
  current.y = damp(current.y, target.y, lambda, dt);
  current.z = damp(current.z, target.z, lambda, dt);
}

// ─────────────────────────────────────────────────────────────────────────────────
// RAY-PLANE INTERSECTION
// ─────────────────────────────────────────────────────────────────────────────────

const _tempRay = new THREE.Ray();
const _tempPlane = new THREE.Plane();
const _tempIntersect = new THREE.Vector3();

/**
 * Get the intersection point of a ray with a plane facing the camera.
 * Used for drag operations — project pointer onto a virtual plane at specified depth.
 *
 * @param pointer - Normalized pointer coords (-1 to 1)
 * @param camera - Three.js camera
 * @param planeZ - Z distance from camera for the drag plane
 * @param out - Output vector (optional, will be created if not provided)
 */
export function rayPlaneIntersect(
  pointer: THREE.Vector2,
  camera: THREE.Camera,
  planeZ: number,
  out?: THREE.Vector3
): THREE.Vector3 {
  const result = out ?? new THREE.Vector3();

  // Create ray from camera through pointer
  _tempRay.origin.copy(camera.position);
  
  // Get ray direction from pointer NDC
  const rayDir = new THREE.Vector3(pointer.x, pointer.y, 0.5);
  rayDir.unproject(camera);
  rayDir.sub(camera.position).normalize();
  _tempRay.direction.copy(rayDir);

  // Create plane facing camera at specified depth
  const planeNormal = new THREE.Vector3(0, 0, 1);
  planeNormal.applyQuaternion(camera.quaternion);
  const planePoint = camera.position.clone().add(
    new THREE.Vector3(0, 0, -planeZ).applyQuaternion(camera.quaternion)
  );
  _tempPlane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);

  // Intersect
  _tempRay.intersectPlane(_tempPlane, _tempIntersect);
  if (_tempIntersect) {
    result.copy(_tempIntersect);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DISTANCE & PROXIMITY
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if a position is within threshold distance of a target.
 */
export function isNear(
  position: THREE.Vector3,
  target: THREE.Vector3,
  threshold: number
): boolean {
  return position.distanceTo(target) < threshold;
}

/**
 * Calculate smooth falloff factor (0-1) based on distance.
 * 0 = at target, 1 = at/beyond threshold.
 */
export function distanceFalloff(
  position: THREE.Vector3,
  target: THREE.Vector3,
  threshold: number
): number {
  const dist = position.distanceTo(target);
  return Math.min(1, dist / threshold);
}

// ─────────────────────────────────────────────────────────────────────────────────
// ROTATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Clamp an angle to a symmetric range [-max, max].
 */
export function clampAngle(angle: number, max: number): number {
  return THREE.MathUtils.clamp(angle, -max, max);
}

/**
 * Convert pointer delta to rotation amounts.
 * Returns [yaw, pitch] in radians.
 *
 * @param deltaX - Horizontal pointer delta (normalized, -1 to 1)
 * @param deltaY - Vertical pointer delta (normalized, -1 to 1)
 * @param sensitivity - Rotation sensitivity multiplier
 */
export function pointerDeltaToRotation(
  deltaX: number,
  deltaY: number,
  sensitivity: number = 2
): [number, number] {
  return [deltaX * sensitivity, -deltaY * sensitivity];
}

// ─────────────────────────────────────────────────────────────────────────────────
// BOUNDING BOX HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Find the largest mesh in an Object3D tree by bounding box volume.
 * Used to identify the main cartridge body for decal projection.
 */
export function findLargestMesh(root: THREE.Object3D): THREE.Mesh | null {
  let largestMesh: THREE.Mesh | null = null;
  let largestVolume = 0;

  const box = new THREE.Box3();

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      box.setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const volume = size.x * size.y * size.z;

      if (volume > largestVolume) {
        largestVolume = volume;
        largestMesh = mesh;
      }
    }
  });

  return largestMesh;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SPRING HELPERS (for overshoot effects)
// ─────────────────────────────────────────────────────────────────────────────────

export interface SpringState {
  value: number;
  velocity: number;
}

/**
 * Simple spring physics step.
 * Returns new state after one timestep.
 *
 * @param state - Current spring state (value + velocity)
 * @param target - Target value
 * @param stiffness - Spring stiffness (higher = snappier)
 * @param damping - Damping ratio (higher = less oscillation)
 * @param dt - Delta time in seconds
 */
export function springStep(
  state: SpringState,
  target: number,
  stiffness: number,
  damping: number,
  dt: number
): SpringState {
  const displacement = state.value - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * state.velocity;
  const acceleration = springForce + dampingForce;

  const newVelocity = state.velocity + acceleration * dt;
  const newValue = state.value + newVelocity * dt;

  return { value: newValue, velocity: newVelocity };
}
