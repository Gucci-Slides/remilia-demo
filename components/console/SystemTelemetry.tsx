'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM TELEMETRY — Faint Console Metadata
//
// Displays system status information in corners.
// Flickers occasionally. Fully disappears after first selection.
//
// Data points:
// - STATUS: ONLINE
// - ARCHIVE STATE: ACTIVE
// - NODE: CONNECTED
// - VERSION: 0.1.0
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemTelemetryProps {
  isVisible: boolean;
  intensity: number;
}

interface TelemetryItem {
  label: string;
  value: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const TELEMETRY_DATA: TelemetryItem[] = [
  { label: 'STATUS', value: 'ONLINE', position: 'top-left' },
  { label: 'NODE', value: 'CONNECTED', position: 'top-right' },
  { label: 'ARCHIVE STATE', value: 'ACTIVE', position: 'bottom-left' },
  { label: 'VERSION', value: '0.1.0', position: 'bottom-right' },
];

export function SystemTelemetry({ isVisible, intensity }: SystemTelemetryProps) {
  const [flickeringItems, setFlickeringItems] = useState<Set<number>>(new Set());

  // Random flicker effect
  useEffect(() => {
    if (!isVisible) return;

    const flicker = () => {
      const idx = Math.floor(Math.random() * TELEMETRY_DATA.length);
      setFlickeringItems((prev) => new Set(prev).add(idx));
      
      setTimeout(() => {
        setFlickeringItems((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }, 50 + Math.random() * 100);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) flicker();
    }, 1500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {TELEMETRY_DATA.map((item, index) => (
            <TelemetryDisplay
              key={item.label}
              item={item}
              intensity={intensity}
              isFlickering={flickeringItems.has(index)}
              delay={index * 0.1}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// TELEMETRY DISPLAY — Individual metadata item
// ─────────────────────────────────────────────────────────────────────────────────

interface TelemetryDisplayProps {
  item: TelemetryItem;
  intensity: number;
  isFlickering: boolean;
  delay: number;
}

function TelemetryDisplay({ item, intensity, isFlickering, delay }: TelemetryDisplayProps) {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: 32, left: 32 },
    'top-right': { top: 32, right: 32, textAlign: 'right' },
    'bottom-left': { bottom: 32, left: 32 },
    'bottom-right': { bottom: 32, right: 32, textAlign: 'right' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: item.position.includes('top') ? -10 : 10 }}
      animate={{
        opacity: isFlickering ? 0 : 0.15 + intensity * 0.15,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: item.position.includes('top') ? -20 : 20,
        transition: { duration: 0.3 },
      }}
      transition={{
        delay,
        duration: 0.5,
        opacity: { duration: isFlickering ? 0.05 : 0.3 },
      }}
      style={{
        position: 'fixed',
        zIndex: 20,
        ...positionStyles[item.position],
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: COLORS.textDim,
          lineHeight: 1.6,
        }}
      >
        <span style={{ opacity: 0.6 }}>{item.label}:</span>{' '}
        <span
          style={{
            color: item.value === 'ONLINE' || item.value === 'ACTIVE' || item.value === 'CONNECTED'
              ? `rgba(100, 255, 150, ${0.3 + intensity * 0.2})`
              : COLORS.textDim,
          }}
        >
          {item.value}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SYSTEM CLOCK — Optional animated timestamp
// ─────────────────────────────────────────────────────────────────────────────────

export function SystemClock({ isVisible }: { isVisible: boolean }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().slice(11, 19));
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: COLORS.textDim,
            zIndex: 20,
          }}
        >
          {time}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SystemTelemetry;
