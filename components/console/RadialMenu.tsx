'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, MENU_ITEMS, MenuItem } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// RADIAL MENU — Floating Navigation
//
// Menu items float and radiate around the orb. No grid alignment.
// Selection snaps with a red cursor ring.
// Selecting triggers a pulse through the orb.
//
// Features:
// - Orbital floating animation
// - Cursor ring on hover/selection
// - Glow effects
// - Snap-to selection
// ═══════════════════════════════════════════════════════════════════════════════

interface RadialMenuProps {
  intensity: number;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  isVisible: boolean;
}

export function RadialMenu({
  intensity,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  isVisible,
}: RadialMenuProps) {
  const orbitRadius = 280; // Distance from center

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: orbitRadius * 2 + 200,
            height: orbitRadius * 2 + 200,
          }}
        >
          {MENU_ITEMS.map((item, index) => (
            <RadialMenuItem
              key={item.id}
              item={item}
              index={index}
              orbitRadius={orbitRadius}
              intensity={intensity}
              isSelected={selectedId === item.id}
              isHovered={hoveredId === item.id}
              onSelect={() => onSelect(item.id)}
              onHover={(hovered) => onHover(hovered ? item.id : null)}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// RADIAL MENU ITEM — Individual floating item
// ─────────────────────────────────────────────────────────────────────────────────

interface RadialMenuItemProps {
  item: MenuItem;
  index: number;
  orbitRadius: number;
  intensity: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

function RadialMenuItem({
  item,
  index,
  orbitRadius,
  intensity,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: RadialMenuItemProps) {
  // Calculate position based on angle
  const angleRad = (item.angle * Math.PI) / 180;
  const baseX = Math.cos(angleRad) * orbitRadius;
  const baseY = Math.sin(angleRad) * orbitRadius;

  // Floating offset animation
  const floatOffset = 8;
  const floatDuration = 4 + index * 0.5;

  const isActive = isSelected || isHovered;

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: baseX,
        y: baseY,
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.05 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        padding: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Floating motion wrapper */}
      <motion.div
        animate={{
          y: [-floatOffset, floatOffset, -floatOffset],
          x: [floatOffset / 2, -floatOffset / 2, floatOffset / 2],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Cursor ring */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `2px solid ${COLORS.primary}`,
                boxShadow: `
                  0 0 20px ${COLORS.glow},
                  inset 0 0 20px rgba(225, 6, 0, 0.1)
                `,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Selection dot */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: COLORS.primary,
                boxShadow: `0 0 10px ${COLORS.primary}`,
                top: -30,
              }}
            />
          )}
        </AnimatePresence>

        {/* Label */}
        <motion.span
          animate={{
            color: isActive ? COLORS.text : COLORS.textMuted,
            textShadow: isActive
              ? `0 0 30px rgba(255, 255, 255, 0.3)`
              : 'none',
          }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </motion.span>

        {/* Glow line connecting to center */}
        <motion.div
          animate={{
            opacity: isActive ? 0.4 : 0.08,
            scaleX: isActive ? 1 : 0.7,
          }}
          style={{
            position: 'absolute',
            width: 60,
            height: 1,
            background: `linear-gradient(
              to ${item.angle > 0 ? 'left' : 'right'},
              ${isActive ? COLORS.primary : 'rgba(255,255,255,0.3)'} 0%,
              transparent 100%
            )`,
            transformOrigin: item.angle > 0 ? 'left' : 'right',
            [item.angle > 0 ? 'right' : 'left']: '100%',
          }}
        />
      </motion.div>
    </motion.button>
  );
}

export default RadialMenu;
