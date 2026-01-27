'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useBootSounds } from '@/hooks/useBootSounds';

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGIN CARTRIDGE — PS1/PS2 Boot Semiotics UI
//
// A physical game cartridge component with:
// - Plastic shell with bevel and texture
// - Bezel screen with scanlines and boot text
// - Mechanical insert/eject switch
// - Stamp misregistration on activation
//
// States: idle | focus | inserted | ejecting
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// COLOR TOKENS
// ─────────────────────────────────────────────────────────────────────────────────

const COLORS = {
  PLASTIC_BASE: '#D8D1C7',
  BEZEL_DARK: '#1B1E24',
  STAMP_TEXT: 'rgba(20, 20, 20, 0.55)',
  STAMP_FAINT: 'rgba(20, 20, 20, 0.28)',
  ACTIVE_RED: '#E6322E',
  ACTIVE_RED_DARK: '#B11F1C',
  LED_GREEN: '#62F6A5',
  LED_AMBER: '#F4C84B',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

type CartridgeState = 'idle' | 'focus' | 'inserted' | 'ejecting';

// ─────────────────────────────────────────────────────────────────────────────────
// BOOT LINES (screen content)
// ─────────────────────────────────────────────────────────────────────────────────

const BOOT_LINES = ['> BOOT', '> CRC OK', '> ORIGIN', '> LINK'];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface OriginCartridgeProps {
  className?: string;
}

export function OriginCartridge({ className }: OriginCartridgeProps) {
  const [state, setState] = useState<CartridgeState>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const { playFocus, playInsert, playEject, initAudio } = useBootSounds();
  const containerRef = useRef<HTMLDivElement>(null);

  // Derived states
  const isFocused = state === 'focus' || isHovered;
  const isInserted = state === 'inserted';
  const isEjecting = state === 'ejecting';
  const isActive = isInserted;

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleMouseEnter = useCallback(() => {
    initAudio();
    setIsHovered(true);
    if (state === 'idle') {
      playFocus();
    }
  }, [state, playFocus, initAudio]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (state === 'idle' || state === 'focus') {
      // INSERT sequence
      setState('focus');
      setTimeout(() => {
        playInsert();
        setState('inserted');
      }, 120); // Mechanical delay
    } else if (state === 'inserted') {
      // EJECT sequence
      setState('ejecting');
      playEject();
      setTimeout(() => {
        setState('idle');
      }, 300);
    }
  }, [state, playInsert, playEject]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION VARIANTS
  // ═══════════════════════════════════════════════════════════════════════════

  const shellVariants: Variants = {
    idle: {
      y: 0,
      x: 0,
      boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
    },
    focus: {
      y: -6,
      x: 0,
      boxShadow: '0 24px 50px rgba(0,0,0,0.30)',
    },
    inserted: {
      y: -6,
      x: -24,
      boxShadow: '0 20px 45px rgba(0,0,0,0.28)',
    },
    ejecting: {
      y: 0,
      x: 0,
      boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
    },
  };

  const currentVariant = isInserted ? 'inserted' : isEjecting ? 'ejecting' : isFocused ? 'focus' : 'idle';

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: 720,
        height: 420,
        // Responsive scaling
        transform: 'scale(var(--cartridge-scale, 1))',
        transformOrigin: 'bottom left',
      }}
    >
      {/* Socket guide (visible when inserting) */}
      <AnimatePresence>
        {(isInserted || isEjecting) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: -40,
              top: 80,
              width: 60,
              height: 260,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
              borderRadius: '8px 0 0 8px',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Main cartridge shell */}
      <motion.div
        ref={containerRef}
        variants={shellVariants}
        animate={currentVariant}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isInserted}
        aria-label="Origin cartridge"
        style={{
          position: 'relative',
          width: 720,
          height: 420,
          borderRadius: 28,
          padding: 24,
          background: COLORS.PLASTIC_BASE,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -2px 6px rgba(0,0,0,0.18),
            0 18px 40px rgba(0,0,0,0.25)
          `,
          cursor: 'pointer',
          outline: 'none',
          textRendering: 'geometricPrecision',
          // Focus ring
          ...(isFocused && {
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.55),
              inset 0 -2px 6px rgba(0,0,0,0.18),
              0 24px 50px rgba(0,0,0,0.30),
              0 0 0 2px rgba(230, 50, 46, 0.3)
            `,
          }),
        }}
      >
        {/* ════════════════════════════════════════════════════════════════════
            TEXTURE OVERLAYS
        ════════════════════════════════════════════════════════════════════ */}
        
        {/* Surface noise */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            backgroundImage: `
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0,
                transparent 1px,
                rgba(0,0,0,0.015) 1px,
                rgba(0,0,0,0.015) 2px
              )
            `,
            backgroundSize: '4px 4px',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        {/* Micro scratches */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            backgroundImage: `
              repeating-linear-gradient(
                135deg,
                transparent 0,
                transparent 1px,
                rgba(0,0,0,0.02) 1px,
                rgba(0,0,0,0.02) 2px
              )
            `,
            backgroundSize: '3px 3px',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />

        {/* ════════════════════════════════════════════════════════════════════
            ZONE A: LABEL STRIP
        ════════════════════════════════════════════════════════════════════ */}
        <LabelStrip isFocused={isFocused} isActive={isActive} />

        {/* ════════════════════════════════════════════════════════════════════
            ZONE B: ACTIVE WINDOW (SCREEN)
        ════════════════════════════════════════════════════════════════════ */}
        <ActiveWindow isFocused={isFocused} isActive={isActive} />

        {/* ════════════════════════════════════════════════════════════════════
            ZONE C: STATUS BLOCK
        ════════════════════════════════════════════════════════════════════ */}
        <StatusBlock isFocused={isFocused} isActive={isActive} />

        {/* ════════════════════════════════════════════════════════════════════
            ZONE D: I/O BAY
        ════════════════════════════════════════════════════════════════════ */}
        <IoBay
          isActive={isActive}
          isEjecting={isEjecting}
          onInsert={handleClick}
        />
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE A: LABEL STRIP
// ═══════════════════════════════════════════════════════════════════════════════

interface LabelStripProps {
  isFocused: boolean;
  isActive: boolean;
}

function LabelStrip({ isFocused, isActive }: LabelStripProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 24,
        top: 20,
        width: 672,
        height: 52,
        borderRadius: 18,
        background: 'rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}
    >
      {/* Left: Title */}
      <span
        style={{
          fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: COLORS.STAMP_TEXT,
          opacity: isFocused ? 1 : 0.8,
          transition: 'opacity 0.2s',
        }}
      >
        REMILIA / ORIGIN
      </span>

      {/* Right: Slot + LED */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: COLORS.STAMP_FAINT,
          }}
        >
          SLOT 01
        </span>
        {/* LED indicator */}
        <motion.div
          animate={{
            backgroundColor: isActive ? COLORS.LED_GREEN : COLORS.LED_AMBER,
            boxShadow: isActive
              ? `0 0 6px ${COLORS.LED_GREEN}`
              : `0 0 4px ${COLORS.LED_AMBER}`,
          }}
          style={{
            width: 6,
            height: 6,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE B: ACTIVE WINDOW (SCREEN)
// ═══════════════════════════════════════════════════════════════════════════════

interface ActiveWindowProps {
  isFocused: boolean;
  isActive: boolean;
}

function ActiveWindow({ isFocused, isActive }: ActiveWindowProps) {
  const [bootLineIndex, setBootLineIndex] = useState(0);

  // Slow boot line cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setBootLineIndex((prev) => (prev + 1) % BOOT_LINES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: 24,
        top: 86,
        width: 440,
        height: 230,
        borderRadius: 22,
        background: COLORS.BEZEL_DARK,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
        padding: 14,
      }}
    >
      {/* Glass inner */}
      <motion.div
        animate={{
          opacity: isFocused ? 1 : 0.85,
        }}
        style={{
          width: 412,
          height: 202,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0E1015 0%, #121624 40%, #0C0F18 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,0.06) 0 1px,
              rgba(0,0,0,0) 1px 3px
            )`,
            opacity: isFocused ? 0.8 : 0.5,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}
        />

        {/* Reflection highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 40%)',
            pointerEvents: 'none',
          }}
        />

        {/* White sweep on insert */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ x: '-100%', opacity: 0.08 }}
              animate={{ x: '200%', opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Boot text (glyph fog) */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.35)',
            filter: 'blur(0.3px)',
            lineHeight: 1.8,
          }}
        >
          {BOOT_LINES.map((line, i) => (
            <motion.div
              key={line}
              animate={{
                opacity: i <= bootLineIndex ? 0.35 : 0.1,
              }}
              transition={{ duration: 0.5 }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* CRT vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE C: STATUS BLOCK
// ═══════════════════════════════════════════════════════════════════════════════

interface StatusBlockProps {
  isFocused: boolean;
  isActive: boolean;
}

function StatusBlock({ isFocused, isActive }: StatusBlockProps) {
  return (
    <motion.div
      animate={{
        opacity: isFocused ? 1 : 0.7,
      }}
      style={{
        position: 'absolute',
        left: 24,
        top: 326,
        width: 440,
        height: 70,
        borderRadius: 18,
        background: 'rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.12)',
        padding: '12px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridTemplateRows: '1fr 1fr',
        gap: 4,
        fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
        fontSize: 11,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: COLORS.STAMP_FAINT,
      }}
    >
      <span>
        STATUS:{' '}
        <span style={{ color: isActive ? COLORS.LED_GREEN : COLORS.STAMP_TEXT }}>
          {isActive ? 'ACTIVE' : 'READABLE'}
        </span>
      </span>
      <span />
      <span>MEMORY: PRESENT</span>
      <span style={{ textAlign: 'right' }}>v0.1</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE D: I/O BAY
// ═══════════════════════════════════════════════════════════════════════════════

interface IoBayProps {
  isActive: boolean;
  isEjecting: boolean;
  onInsert: () => void;
}

function IoBay({ isActive, isEjecting }: IoBayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 484,
        top: 86,
        width: 212,
        height: 310,
        borderRadius: 22,
        background: 'rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      {/* D1: Name Plate */}
      <NamePlate isActive={isActive} />

      {/* D2: Insert/Eject Switch */}
      <InsertSwitch isActive={isActive} isEjecting={isEjecting} />

      {/* D3: Stamp Seal */}
      <StampSeal isActive={isActive} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// D1: NAME PLATE
// ─────────────────────────────────────────────────────────────────────────────────

interface NamePlateProps {
  isActive: boolean;
}

function NamePlate({ isActive }: NamePlateProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 16,
        width: 180,
        height: 64,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.35)',
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.55),
          inset 0 -2px 6px rgba(0,0,0,0.10)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Base text layer */}
      <span
        style={{
          fontFamily: '"Arial Narrow", system-ui, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: COLORS.STAMP_TEXT,
          position: 'relative',
          zIndex: 1,
        }}
      >
        ORIGIN
      </span>

      {/* Misregistration layer (red duplicate) — only when active */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              fontFamily: '"Arial Narrow", system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: COLORS.ACTIVE_RED,
              transform: 'translate(2px, 1px)',
              filter: 'blur(0.2px)',
              zIndex: 0,
            }}
          >
            ORIGIN
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// D2: INSERT/EJECT SWITCH
// ─────────────────────────────────────────────────────────────────────────────────

interface InsertSwitchProps {
  isActive: boolean;
  isEjecting: boolean;
}

function InsertSwitch({ isActive, isEjecting }: InsertSwitchProps) {
  const thumbY = isActive && !isEjecting ? 0 : 126; // Track height - thumb height

  return (
    <div
      style={{
        position: 'absolute',
        left: 156,
        top: 92,
        width: 40,
        height: 180,
      }}
    >
      {/* Labels */}
      <span
        style={{
          position: 'absolute',
          right: 48,
          top: 8,
          fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: COLORS.STAMP_FAINT,
          whiteSpace: 'nowrap',
        }}
      >
        INSERT
      </span>
      <span
        style={{
          position: 'absolute',
          right: 48,
          bottom: 8,
          fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: COLORS.STAMP_FAINT,
          whiteSpace: 'nowrap',
        }}
      >
        EJECT
      </span>

      {/* Track */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 40,
          height: 180,
          borderRadius: 8,
          background: 'rgba(0,0,0,0.12)',
        }}
      >
        {/* Thumb */}
        <motion.div
          animate={{ y: thumbY }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          style={{
            position: 'absolute',
            left: 3,
            top: 0,
            width: 34,
            height: 54,
            borderRadius: 10,
            background: COLORS.PLASTIC_BASE,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.6),
              inset 0 -2px 4px rgba(0,0,0,0.15),
              0 2px 4px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* Grip lines */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 2,
                  borderRadius: 1,
                  background: 'rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// D3: STAMP SEAL
// ─────────────────────────────────────────────────────────────────────────────────

interface StampSealProps {
  isActive: boolean;
}

function StampSeal({ isActive }: StampSealProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 210,
        width: 180,
        height: 84,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Circular stamp ring */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '2px solid rgba(0,0,0,0.08)',
          position: 'relative',
          opacity: 0.12,
        }}
      >
        {/* Inner ring */}
        <div
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.15)',
          }}
        />

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 7,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.5)',
          }}
        >
          ✓
        </div>
      </div>

      {/* Ring text (curved effect simulated) */}
      <div
        style={{
          position: 'absolute',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 6,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.15)',
          top: 4,
        }}
      >
        ARCHIVE · ORIGIN · VERIFIED
      </div>
    </div>
  );
}

export default OriginCartridge;
