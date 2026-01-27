'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN FADE — Full-screen black overlay for insertion transition
// ═══════════════════════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';

interface ScreenFadeProps {
  visible: boolean;
  onFadeComplete?: () => void;
}

export function ScreenFade({ visible, onFadeComplete }: ScreenFadeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (visible && onFadeComplete) {
              onFadeComplete();
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}
