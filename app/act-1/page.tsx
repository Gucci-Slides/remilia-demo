'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// ACT I — Placeholder Page
//
// Reached after successful cartridge boot sequence.
// PS1 memory card loaded. Origin data accessible.
// ═══════════════════════════════════════════════════════════════════════════════

export default function ActOnePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle diagonal banding */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent 0,
            transparent 2px,
            rgba(255, 255, 255, 0.008) 2px,
            rgba(255, 255, 255, 0.008) 4px
          )`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: 40,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-monument), Georgia, serif',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            color: '#f4f1ea',
            marginBottom: 32,
          }}
        >
          ACT I
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: '"IBM Plex Mono", Consolas, monospace',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: 48,
          }}
        >
          ORIGIN LOADED // MEMORY STATE RESTORED
        </p>

        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 1,
            background: 'rgba(255, 255, 255, 0.15)',
            margin: '0 auto 48px',
          }}
        />

        {/* Placeholder message */}
        <p
          style={{
            fontFamily: 'var(--font-editorial), Georgia, serif',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          The archive awaits. This is where the narrative begins.
        </p>
      </motion.div>

      {/* Boot info corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          fontFamily: '"IBM Plex Mono", Consolas, monospace',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.2)',
          zIndex: 2,
        }}
      >
        REMILIA // ACT I // SLOT 01 ACTIVE
      </div>

      {/* System status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: '"IBM Plex Mono", Consolas, monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.3)',
          zIndex: 2,
        }}
      >
        <span>CRC VERIFIED</span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 1,
            background: '#62F6A5',
            boxShadow: '0 0 6px #62F6A5',
          }}
        />
      </motion.div>
    </main>
  );
}
