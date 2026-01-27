'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Act1Copy } from '@/components/stage/Act1Copy';
import { Act2 } from '@/components/stage/Act2';
import { Act3 } from '@/components/stage/Act3';

// ═══════════════════════════════════════════════════════════════════════════
// ABOUT PAGE — Institutional Record
//
// A long-form document containing:
// - Header: "About — A record of formation."
// - Act I: Formation (3-line scroll manifesto)
// - Act II: Alignment (essay-like accumulative scroll)
// - Act III: Manifestation (archival insert layout)
//
// Anchors:
// - /about#formation
// - /about#alignment
// - /about#manifestation
//
// Rewards slow reading. Tolerates silence.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// ACT I INTRO — "A network state" header (replaces TitleStage for /about)
// ─────────────────────────────────────────────────────────────────────────────
function ActIIntro() {
  return (
    <header 
      className="relative bg-white h-screen flex items-center justify-center"
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Act label */}
        <p
          className="text-[11px] uppercase tracking-[0.32em] text-neutral-500"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          Act I
        </p>

        {/* Headline */}
        <h1
          className="mt-4 text-5xl md:text-6xl leading-[1.02] tracking-tight text-neutral-900"
          style={{ fontFamily: 'var(--font-editorial)' }}
        >
          A network state
        </h1>

        {/* Sub-label */}
        <p
          className="mt-6 text-[11px] uppercase tracking-[0.32em] text-neutral-400"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          In formation
        </p>
      </motion.div>
    </header>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* ═══════════════════════════════════════════════════════════════════
          ACT I INTRO — "A network state" header
          ═══════════════════════════════════════════════════════════════════ */}
      <ActIIntro />

      {/* ═══════════════════════════════════════════════════════════════════
          ACT I — FORMATION
          3-line scroll manifesto
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="formation">
        <Act1Copy />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ACT II — ALIGNMENT
          Essay-like accumulative scroll
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="alignment">
        <Act2 />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ACT III — MANIFESTATION
          Archival insert layout
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="manifestation">
        <Act3 />
      </section>
    </main>
  );
}
