// ═══════════════════════════════════════════════════════════════════════════════
// HOLOGRAPHIC STICKER MATERIAL — Y2K Iridescence
//
// Creates a MeshPhysicalMaterial with iridescence for holographic stickers.
// Uses built-in Three.js physical material properties — no custom shaders.
//
// Usage:
//   const material = makeHoloMaterial({ map: holoTexture, tint: '#ff6b9d' });
//   <meshStandardMaterial ref={holoMaterialRef} {...material} />
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// MATERIAL FACTORY
// ─────────────────────────────────────────────────────────────────────────────────

export interface HoloMaterialOptions {
  /** Alpha-cutout texture for sticker shape */
  map?: THREE.Texture | null;
  /** Base tint color for iridescence */
  tint: string;
  /** Opacity of the sticker (default 1) */
  opacity?: number;
}

/**
 * Create a holographic sticker material with iridescence.
 * Returns props to spread onto a MeshPhysicalMaterial.
 */
export function makeHoloMaterial(options: HoloMaterialOptions): THREE.MeshPhysicalMaterialParameters {
  const { map, tint, opacity = 1 } = options;

  return {
    // Base appearance
    color: new THREE.Color(tint),
    map: map ?? undefined,
    transparent: true,
    opacity,
    side: THREE.FrontSide,

    // Physical properties for iridescence
    metalness: 0.35,
    roughness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,

    // Iridescence (rainbow shimmer effect)
    iridescence: 1.0,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [100, 400],

    // Sheen for extra Y2K shimmer
    sheen: 0.5,
    sheenRoughness: 0.3,
    sheenColor: new THREE.Color(tint).multiplyScalar(1.2),

    // Alpha handling
    alphaTest: 0.1,
    depthWrite: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MATERIAL INSTANCE CLASS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Pre-configured holographic sticker material class.
 * Can be animated via update() method in useFrame.
 */
export class HoloStickerMaterial extends THREE.MeshPhysicalMaterial {
  private _baseRoughness: number;
  private _baseColor: THREE.Color;
  private _time: number = 0;

  constructor(options: HoloMaterialOptions) {
    const props = makeHoloMaterial(options);
    super(props);
    
    this._baseRoughness = props.roughness ?? 0.25;
    this._baseColor = new THREE.Color(options.tint);
  }

  /**
   * Call in useFrame to animate the holographic shimmer.
   *
   * @param delta - Delta time in seconds
   * @param intensity - Animation intensity (0-1, default 1)
   */
  update(delta: number, intensity: number = 1): void {
    this._time += delta;

    // Subtle roughness oscillation
    const roughnessOffset = Math.sin(this._time * 2) * 0.05 * intensity;
    this.roughness = this._baseRoughness + roughnessOffset;

    // Subtle hue shift via iridescence IOR
    const iorOffset = Math.sin(this._time * 1.5) * 0.1 * intensity;
    this.iridescenceIOR = 1.5 + iorOffset;

    // Shimmer via clearcoat roughness
    const clearcoatOffset = Math.sin(this._time * 3) * 0.05 * intensity;
    this.clearcoatRoughness = 0.1 + Math.abs(clearcoatOffset);
  }

  /**
   * Reset animation time (e.g., when cartridge is picked up).
   */
  resetTime(): void {
    this._time = 0;
  }

  /**
   * Get current animation time.
   */
  get time(): number {
    return this._time;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// TEXTURE LOADER HELPER
// ─────────────────────────────────────────────────────────────────────────────────

const textureLoader = new THREE.TextureLoader();

/**
 * Load a holographic sticker texture with proper settings.
 * Handles missing files gracefully (returns null).
 */
export async function loadHoloTexture(src: string): Promise<THREE.Texture | null> {
  try {
    const texture = await textureLoader.loadAsync(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false; // GLB convention
    return texture;
  } catch {
    console.warn(`[HoloStickerMaterial] Failed to load texture: ${src}`);
    return null;
  }
}

/**
 * Synchronous texture load (for use in component initialization).
 * Returns the texture immediately but loading happens async.
 */
export function loadHoloTextureSync(src: string): THREE.Texture {
  const texture = textureLoader.load(
    src,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
    },
    undefined,
    () => {
      console.warn(`[HoloStickerMaterial] Failed to load texture: ${src}`);
    }
  );
  return texture;
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export default HoloStickerMaterial;
