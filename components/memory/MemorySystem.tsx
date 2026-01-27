'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MemoryCardButton } from './MemoryCardButton';
import { MemoryCardPanel } from './MemoryCardPanel';
import { MemoryCardPanelMobile } from './MemoryCardPanelMobile';
import { SystemFlicker, EjectFlicker } from './SystemFlicker';
import { BaseSystemState } from './BaseSystemState';
import { NarrativeView } from './NarrativeView';
import { SlotIndicator } from './SlotIndicator';
import { SystemState, ActiveSlot } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY SYSTEM — PS1 Memory Card Navigation
//
// The site is a single environment. Navigation = loading saved states.
// This is not a menu. This is state persistence UI.
//
// STATE MACHINE:
// - idle: Base state (wordmark + metadata visible)
// - loading: Transition flicker (120-150ms pause + flash)
// - loaded: Inside a memory (narrative visible)
// - ejecting: Returning to base state
// ═══════════════════════════════════════════════════════════════════════════════

export function MemorySystem() {
  // System state
  const [systemState, setSystemState] = useState<SystemState>('idle');
  const [activeSlot, setActiveSlot] = useState<ActiveSlot>(null);
  const [pendingSlot, setPendingSlot] = useState<ActiveSlot>(null);
  
  // UI state
  const [panelOpen, setPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE TRANSITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // Handle slot selection from panel
  const handleSelectSlot = useCallback((slotId: string) => {
    if (slotId === activeSlot) {
      // Already on this slot — just close panel
      setPanelOpen(false);
      return;
    }

    // Start loading sequence
    setPendingSlot(slotId);
    setSystemState('loading');
    setPanelOpen(false);
  }, [activeSlot]);

  // Handle load complete (after flicker)
  const handleLoadComplete = useCallback(() => {
    if (pendingSlot) {
      setActiveSlot(pendingSlot);
      setPendingSlot(null);
      setSystemState('loaded');
    }
  }, [pendingSlot]);

  // Handle eject
  const handleEject = useCallback(() => {
    if (systemState === 'loaded') {
      setSystemState('ejecting');
      setPanelOpen(false);
    } else {
      // Just close panel if in idle state
      setPanelOpen(false);
    }
  }, [systemState]);

  // Handle eject complete
  const handleEjectComplete = useCallback(() => {
    setActiveSlot(null);
    setSystemState('idle');
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes panel
      if (e.key === 'Escape' && panelOpen) {
        setPanelOpen(false);
      }
      
      // 'm' or 'M' opens memory card
      if ((e.key === 'm' || e.key === 'M') && !panelOpen) {
        setPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panelOpen]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  const isIdle = systemState === 'idle';
  const isLoaded = systemState === 'loaded';
  const isLoading = systemState === 'loading';
  const isEjecting = systemState === 'ejecting';

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--archive-paper, #F3EEE6)',
        // Scroll enabled only when inside a loaded memory
        overflowY: isLoaded ? 'auto' : 'hidden',
        overflowX: 'hidden',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          TEXTURE LAYERS
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flyer-grain-overlay" aria-hidden="true" />
      <div className="archive-vignette" aria-hidden="true" />

      {/* ════════════════════════════════════════════════════════════════════
          BASE SYSTEM STATE — Wordmark + Metadata (visible when idle)
      ════════════════════════════════════════════════════════════════════ */}
      <BaseSystemState 
        isVisible={isIdle && !isLoading} 
        isExiting={isLoading} 
      />

      {/* ════════════════════════════════════════════════════════════════════
          LOADED STATE — Narrative + Slot Indicator
      ════════════════════════════════════════════════════════════════════ */}
      {isLoaded && activeSlot && (
        <>
          <SlotIndicator slotId={activeSlot} />
          <NarrativeView slotId={activeSlot} />
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MEMORY CARD BUTTON — Always visible (except during transitions)
      ════════════════════════════════════════════════════════════════════ */}
      {!isLoading && !isEjecting && !panelOpen && (
        <MemoryCardButton onClick={() => setPanelOpen(true)} />
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MEMORY CARD PANEL — Desktop vs Mobile
      ════════════════════════════════════════════════════════════════════ */}
      {isMobile ? (
        <MemoryCardPanelMobile
          isOpen={panelOpen}
          onClose={handleEject}
          onSelectSlot={handleSelectSlot}
          activeSlot={activeSlot}
        />
      ) : (
        <MemoryCardPanel
          isOpen={panelOpen}
          onClose={handleEject}
          onSelectSlot={handleSelectSlot}
          activeSlot={activeSlot}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SYSTEM FLICKER — Load transition effect
      ════════════════════════════════════════════════════════════════════ */}
      <SystemFlicker 
        isActive={isLoading} 
        onComplete={handleLoadComplete} 
      />

      {/* ════════════════════════════════════════════════════════════════════
          EJECT FLICKER — Eject transition effect
      ════════════════════════════════════════════════════════════════════ */}
      <EjectFlicker 
        isActive={isEjecting} 
        onComplete={handleEjectComplete} 
      />
    </div>
  );
}

export default MemorySystem;
