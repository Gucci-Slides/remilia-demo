'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// CARTRIDGE DECAL — Projected Label using drei <Decal />
//
// Projects a canvas-generated texture onto the cartridge mesh face.
// Uses @react-three/drei's Decal component for proper mesh projection.
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface DecalSpec {
  header: string;
  title: string;
  meta: string;
  serial: string;
  accentColor?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// TEXTURE GENERATOR — Simple, proven canvas drawing
// ─────────────────────────────────────────────────────────────────────────────────

export function createLabelTexture(spec: DecalSpec): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  console.log('[createLabelTexture] Creating texture for:', spec.title);

  // ── BACKGROUND (solid off-white sticker) ──
  ctx.fillStyle = '#E9E7E2';
  ctx.fillRect(0, 0, size, size);

  // ── BORDER ──
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 12;
  ctx.strokeRect(60, 60, size - 120, size - 120);

  // ── HEADER ──
  ctx.fillStyle = '#444';
  ctx.font = '72px Menlo, Monaco, "Courier New", monospace';
  ctx.fillText(spec.header.toUpperCase(), 120, 200);

  // ── TITLE (large) ──
  ctx.fillStyle = '#111';
  ctx.font = '280px Georgia, "Times New Roman", serif';
  ctx.fillText(spec.title, 120, 580);

  // ── META ──
  ctx.fillStyle = '#555';
  ctx.font = '80px Menlo, Monaco, "Courier New", monospace';
  ctx.fillText(spec.meta, 120, 740);

  // ── SERIAL ──
  ctx.fillStyle = '#888';
  ctx.font = '64px Menlo, Monaco, "Courier New", monospace';
  ctx.fillText(spec.serial, 120, 880);

  // ── ACCENT DOT ──
  if (spec.accentColor) {
    ctx.fillStyle = spec.accentColor;
    ctx.beginPath();
    ctx.arc(size - 180, size - 180, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // DEBUG: Log the canvas data URL to verify it's drawing correctly
  console.log('[createLabelTexture] Canvas created, size:', canvas.width, 'x', canvas.height);
  
  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  texture.flipY = true; // Ensure correct orientation

  console.log('[createLabelTexture] Texture created:', texture.uuid);

  return texture;
}

// ─────────────────────────────────────────────────────────────────────────────────
// HOOK: Use label texture (memoized)
// ─────────────────────────────────────────────────────────────────────────────────

export function useLabelTexture(spec: DecalSpec): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createLabelTexture(spec);
  }, [spec]);
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRESET SPECS
// ─────────────────────────────────────────────────────────────────────────────────

export const ORIGIN_DECAL_SPEC: DecalSpec = {
  header: 'REMILIA MEMORY ARCHIVE',
  title: 'ORIGIN',
  meta: 'SLOT 01 · BOOTABLE',
  serial: 'RM-0001',
  accentColor: '#8B3A3A',
};

export const NETWORK_DECAL_SPEC: DecalSpec = {
  header: 'REMILIA MEMORY ARCHIVE',
  title: 'NETWORK',
  meta: 'SLOT 02 · BOOTABLE',
  serial: 'RM-0002',
  accentColor: '#3A5EB2',
};

export const RECORDS_DECAL_SPEC: DecalSpec = {
  header: 'REMILIA MEMORY ARCHIVE',
  title: 'RECORDS',
  meta: 'SLOT 03 · BOOTABLE',
  serial: 'RM-0003',
  accentColor: '#3AB256',
};
