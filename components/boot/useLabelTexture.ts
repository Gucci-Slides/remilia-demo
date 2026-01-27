'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// USE LABEL TEXTURE — Canvas-generated PS1-style label
//
// Generates a CanvasTexture for the label since we may not have a PNG.
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface LabelSpec {
  header: string;
  title: string;
  meta: string;
  serial: string;
  accentColor?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRESET LABELS
// ─────────────────────────────────────────────────────────────────────────────────

export const ORIGIN_LABEL: LabelSpec = {
  header: 'REMILIA MEMORY ARCHIVE',
  title: 'ORIGIN',
  meta: 'SLOT 01 · BOOTABLE',
  serial: 'RM-0001',
  accentColor: '#8B3A3A',
};

export const NETWORK_LABEL: LabelSpec = {
  header: 'REMILIA MEMORY ARCHIVE',
  title: 'NETWORK',
  meta: 'SLOT 02 · BOOTABLE',
  serial: 'RM-0002',
  accentColor: '#3A5EB2',
};

export const RECORDS_LABEL: LabelSpec = {
  header: 'REMILIA MEMORY ARCHIVE',
  title: 'RECORDS',
  meta: 'SLOT 03 · BOOTABLE',
  serial: 'RM-0003',
  accentColor: '#3AB256',
};

// ─────────────────────────────────────────────────────────────────────────────────
// TEXTURE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────────

export function createLabelTexture(spec: LabelSpec): THREE.CanvasTexture {
  const size = 1024; // Power of 2 for mipmaps
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const padding = 40;
  const innerWidth = size - padding * 2;
  const innerHeight = size - padding * 2;

  // ── BACKGROUND (cream sticker) ──
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, size, size);

  // ── BORDER ──
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 6;
  ctx.strokeRect(padding, padding, innerWidth, innerHeight);

  // ── INNER BORDER (subtle) ──
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding + 12, padding + 12, innerWidth - 24, innerHeight - 24);

  // ── HEADER ──
  ctx.fillStyle = '#666';
  ctx.font = '500 32px "SF Mono", Menlo, Monaco, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(spec.header.toUpperCase(), padding + 24, padding + 32);

  // ── TITLE (large, serif) ──
  ctx.fillStyle = '#111';
  ctx.font = '600 140px Georgia, "Times New Roman", serif';
  ctx.fillText(spec.title, padding + 20, padding + 100);

  // ── META LINE ──
  ctx.fillStyle = '#444';
  ctx.font = '400 40px "SF Mono", Menlo, Monaco, monospace';
  ctx.fillText(spec.meta, padding + 24, padding + 280);

  // ── SERIAL ──
  ctx.fillStyle = '#888';
  ctx.font = '400 28px "SF Mono", Menlo, Monaco, monospace';
  ctx.fillText(spec.serial, padding + 24, padding + 340);

  // ── ACCENT DOT (bottom right) ──
  if (spec.accentColor) {
    ctx.fillStyle = spec.accentColor;
    ctx.beginPath();
    ctx.arc(size - padding - 50, size - padding - 50, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── CREATE TEXTURE ──
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

// ─────────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useLabelTexture(spec: LabelSpec): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createLabelTexture(spec);
  }, [spec]);
}
