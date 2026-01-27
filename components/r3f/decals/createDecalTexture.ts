// ═══════════════════════════════════════════════════════════════════════════════
// CREATE DECAL TEXTURE — Canvas-based PS1/Boot-Sector Style Label Generator
//
// Generates a high-res CanvasTexture with:
// - Micro header (tracking, uppercase)
// - Primary title (serif)
// - Metadata line (monospace)
// - Serial mark
// - Optional accent mark, noise, and wear effects
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface DecalAccent {
  enabled: boolean;
  color: string;
  x?: number; // 0-1, relative to label
  y?: number; // 0-1, relative to label
  size?: number; // pixels at native DPI
}

export interface DecalPalette {
  bg: string;
  text: string;
  subtext: string;
}

export interface DecalNoise {
  enabled: boolean;
  amount: number; // 0-1, recommend 0.03-0.08
}

export interface DecalWear {
  enabled: boolean;
  vignette: number; // 0-1
  smudge: number; // 0-1
}

export interface DecalSpec {
  header: string;
  title: string;
  meta: string;
  serial: string;
  accent?: DecalAccent;
  palette?: DecalPalette;
  noise?: DecalNoise;
  wear?: DecalWear;
  dpi?: number; // default 2048
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────────────────────────

const DEFAULT_PALETTE: DecalPalette = {
  bg: '#E8E3D7',
  text: '#1a1a1a',
  subtext: '#6a6a6a',
};

const DEFAULT_ACCENT: DecalAccent = {
  enabled: false,
  color: '#8B3A3A',
  x: 0.94,
  y: 0.88,
  size: 16,
};

const DEFAULT_NOISE: DecalNoise = {
  enabled: true,
  amount: 0.04,
};

const DEFAULT_WEAR: DecalWear = {
  enabled: true,
  vignette: 0.08,
  smudge: 0.05,
};

// ─────────────────────────────────────────────────────────────────────────────────
// FONTS — System-safe stacks
// ─────────────────────────────────────────────────────────────────────────────────

const TITLE_FONT = 'Georgia, "Times New Roman", serif';
const MONO_FONT = 'Menlo, Monaco, "Courier New", monospace';

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER: Draw text with manual letter spacing
// ─────────────────────────────────────────────────────────────────────────────────

function drawTextWithSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number
): void {
  let currentX = x;
  for (const char of text) {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + spacing;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER: Draw rounded rectangle (cross-browser)
// ─────────────────────────────────────────────────────────────────────────────────

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER: Add subtle noise
// ─────────────────────────────────────────────────────────────────────────────────

function addNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const intensity = amount * 35;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER: Add vignette effect
// ─────────────────────────────────────────────────────────────────────────────────

function addVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
): void {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${strength})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER: Add smudge marks
// ─────────────────────────────────────────────────────────────────────────────────

function addSmudges(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const numSmudges = Math.floor(2 + Math.random() * 3);

  for (let i = 0; i < numSmudges; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 30 + Math.random() * 80;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(200, 190, 175, ${intensity * 0.2})`);
    gradient.addColorStop(1, 'rgba(200, 190, 175, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION: Create Decal Texture
// ─────────────────────────────────────────────────────────────────────────────────

export function createDecalTexture(spec: DecalSpec): THREE.CanvasTexture {
  const dpi = spec.dpi ?? 2048;
  const palette = { ...DEFAULT_PALETTE, ...spec.palette };
  const accent = { ...DEFAULT_ACCENT, ...spec.accent };
  const noise = { ...DEFAULT_NOISE, ...spec.noise };
  const wear = { ...DEFAULT_WEAR, ...spec.wear };

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = dpi;
  canvas.height = dpi;
  const ctx = canvas.getContext('2d')!;

  // Scale factor based on DPI
  const scale = dpi / 2048;

  // ─────────────────────────────────────────────────────────────────────────────
  // SOLID BACKGROUND — Fill entire canvas with opaque off-white
  // ─────────────────────────────────────────────────────────────────────────────

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dpi, dpi);

  // ─────────────────────────────────────────────────────────────────────────────
  // LABEL INSET — Subtle inner rectangle (slightly darker)
  // ─────────────────────────────────────────────────────────────────────────────

  const insetMargin = 60 * scale;
  const insetWidth = dpi - insetMargin * 2;
  const insetHeight = dpi - insetMargin * 2;
  const cornerRadius = 8 * scale;

  // Draw inset background
  ctx.fillStyle = '#E2DDD1';
  drawRoundedRect(ctx, insetMargin, insetMargin, insetWidth, insetHeight, cornerRadius);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────────────────────
  // TEXT LAYOUT — Institutional boot label
  // ─────────────────────────────────────────────────────────────────────────────

  const padding = 80 * scale;
  const textX = insetMargin + padding;

  // ── HEADER (small, spaced, quiet) ──
  const headerSize = 36 * scale;
  ctx.font = `500 ${headerSize}px ${MONO_FONT}`;
  ctx.fillStyle = palette.subtext;
  const headerY = insetMargin + padding + headerSize;
  drawTextWithSpacing(ctx, spec.header.toUpperCase(), textX, headerY, 6 * scale);

  // ── TITLE (main, dominant) ──
  const titleSize = 220 * scale;
  ctx.font = `normal ${titleSize}px ${TITLE_FONT}`;
  ctx.fillStyle = palette.text;
  const titleY = insetMargin + insetHeight * 0.48;
  ctx.fillText(spec.title, textX, titleY);

  // ── META LINE (slot info) ──
  const metaSize = 42 * scale;
  ctx.font = `400 ${metaSize}px ${MONO_FONT}`;
  ctx.fillStyle = palette.subtext;
  const metaY = insetMargin + insetHeight - padding - 80 * scale;
  ctx.fillText(spec.meta, textX, metaY);

  // ── SERIAL (bottom left, faded) ──
  const serialSize = 32 * scale;
  ctx.font = `400 ${serialSize}px ${MONO_FONT}`;
  ctx.fillStyle = palette.subtext;
  ctx.globalAlpha = 0.5;
  const serialY = insetMargin + insetHeight - padding - 20 * scale;
  ctx.fillText(spec.serial, textX, serialY);
  ctx.globalAlpha = 1;

  // ─────────────────────────────────────────────────────────────────────────────
  // ACCENT MARK — Small QA dot (bottom right)
  // ─────────────────────────────────────────────────────────────────────────────

  if (accent.enabled) {
    const accentX = insetMargin + insetWidth * (accent.x ?? 0.94);
    const accentY = insetMargin + insetHeight * (accent.y ?? 0.88);
    const accentSize = (accent.size ?? 16) * scale;

    ctx.fillStyle = accent.color;
    ctx.beginPath();
    ctx.arc(accentX, accentY, accentSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // WEAR EFFECTS (subtle)
  // ─────────────────────────────────────────────────────────────────────────────

  if (wear.enabled) {
    if (wear.smudge > 0) {
      addSmudges(ctx, dpi, dpi, wear.smudge);
    }
    if (wear.vignette > 0) {
      addVignette(ctx, dpi, dpi, wear.vignette);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NOISE (film grain)
  // ─────────────────────────────────────────────────────────────────────────────

  if (noise.enabled && noise.amount > 0) {
    addNoise(ctx, dpi, dpi, noise.amount);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CREATE THREE.JS TEXTURE
  // ─────────────────────────────────────────────────────────────────────────────

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  return texture;
}
