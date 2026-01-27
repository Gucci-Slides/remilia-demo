'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RemiliaRegistryWordmark } from '../RemiliaRegistryWordmark';

// ═══════════════════════════════════════════════════════════════════════════════
// BASE SYSTEM STATE — Default Idle State
//
// What appears when no memory is loaded:
// - Off-white background with scan noise
// - REMILIA wordmark anchored bottom-left
// - Metadata in corners (mono, faint)
// - No narrative text visible
// - Page feels idle, waiting
// ═══════════════════════════════════════════════════════════════════════════════

interface BaseSystemStateProps {
  isVisible: boolean;
  isExiting?: boolean;
}

export function BaseSystemState({ isVisible, isExiting }: BaseSystemStateProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ══════════════════════════════════════════════════════════════════
              METADATA — Corner stamps
          ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Top-left */}
            <div
              className="stamp-text"
              style={{
                position: 'fixed',
                top: 'calc(var(--baseline) * 3)',
                left: 'var(--archive-left, 7vw)',
                zIndex: 10,
              }}
            >
              <div>Archive Status: Active</div>
              <div style={{ marginTop: 'var(--baseline)' }}>Version 0.1</div>
            </div>

            {/* Top-right */}
            <div
              className="stamp-text"
              style={{
                position: 'fixed',
                top: 'calc(var(--baseline) * 3)',
                right: 'var(--archive-left, 7vw)',
                zIndex: 10,
                textAlign: 'right',
              }}
            >
              <div>In Formation · 2026</div>
              <div style={{ marginTop: 'var(--baseline)' }}>45.2892° N</div>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════════
              WORDMARK — Bottom-left anchored
              Slides down and exits on state load
          ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ 
              opacity: isExiting ? 0 : 1, 
              y: isExiting ? 60 : 0 
            }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: 'var(--archive-left, 7vw)',
              bottom: 'var(--archive-bottom, 10vh)',
              zIndex: 10,
            }}
          >
            <RemiliaRegistryWordmark />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BaseSystemState;
