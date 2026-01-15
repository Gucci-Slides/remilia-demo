'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MiladySubject } from '@/lib/registry/types';

interface RegistryStageProps {
  subject: MiladySubject | null;
  spreadIndex: number;
  totalSpreads: number;
  onOpenInvoke: () => void;
  onOpenIndex: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function RegistryStage({
  subject,
  spreadIndex,
  totalSpreads,
  onOpenInvoke,
  onOpenIndex,
  onPrev,
  onNext,
}: RegistryStageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3ED]">
      {/* Paper grain */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Meta bar */}
      <header className="relative z-20 h-10 px-6 flex items-center justify-between">
        <span className="font-light text-[10px] tracking-[0.2em] text-black/40 uppercase">
          Milady Registry v3.2
        </span>
        
        <span className="font-mono text-[9px] text-black/30">
          SPREAD {String(spreadIndex + 1).padStart(2, '0')} / {String(totalSpreads).padStart(2, '0')}
        </span>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenIndex}
            className="font-light text-[10px] tracking-[0.15em] text-black/35 uppercase hover:text-black/60 transition-colors"
          >
            Index
          </button>
          <button
            onClick={onOpenInvoke}
            className="font-light text-[10px] tracking-[0.15em] text-black/35 uppercase hover:text-black/60 transition-colors"
          >
            Invoke
          </button>
        </div>
      </header>

      {/* Stage area */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-8 py-12">
        <AnimatePresence mode="wait">
          {subject ? (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="max-w-2xl w-full"
            >
              {/* Hero plate */}
              <div className="relative aspect-[3/4] max-h-[68vh] mx-auto bg-neutral-100">
                {subject.imageUrl ? (
                  <Image
                    src={subject.imageUrl}
                    alt={subject.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 600px"
                    className="object-cover object-[50%_25%]"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-light text-[64px] text-black/[0.06]">
                      #{subject.id}
                    </span>
                  </div>
                )}

                {/* Match seal */}
                <AnimatePresence>
                  {subject.matchBonus && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: -2 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="absolute top-6 right-6"
                    >
                      <div className="bg-[#C41E3A] text-white px-3 py-1.5 font-mono text-[10px] tracking-widest">
                        SEAL +5
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Editorial label */}
              <div className="mt-8 max-w-md">
                <div className="flex items-baseline gap-6 mb-3">
                  <span className="font-light text-[13px] tracking-[0.05em] text-black/70">
                    Subject #{subject.id}
                  </span>
                  <span className="font-mono text-[10px] text-black/30">
                    {subject.dripGrade}
                  </span>
                </div>
                
                <div className="h-px bg-black/8 mb-3" />
                
                <div className="flex items-center gap-6">
                  <div>
                    <span className="font-mono text-[8px] text-black/25 uppercase tracking-widest">
                      Theme
                    </span>
                    <div className="font-light text-[11px] text-black/50 mt-0.5">
                      {subject.themes.join(' / ') || '—'}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-black/25 uppercase tracking-widest">
                      Drip
                    </span>
                    <div className="font-light text-[11px] text-black/50 mt-0.5">
                      {subject.dripScore}
                    </div>
                  </div>
                  {subject.matchBonus && (
                    <div>
                      <span className="font-mono text-[8px] text-black/25 uppercase tracking-widest">
                        Seal
                      </span>
                      <div className="font-light text-[11px] text-[#C41E3A]/70 mt-0.5">
                        Match (+5)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 border border-black/10 flex items-center justify-center">
                <span className="font-mono text-[10px] text-black/15">?</span>
              </div>
              <p className="font-light text-[11px] text-black/25 tracking-wider">
                Invoke to begin
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation hints */}
      <footer className="relative z-20 h-10 px-6 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={spreadIndex <= 0}
          className="font-mono text-[9px] text-black/20 hover:text-black/40 disabled:opacity-30 transition-colors"
        >
          ← PREV
        </button>
        
        <span className="font-mono text-[8px] text-black/15">
          / to invoke · ← → to navigate
        </span>
        
        <button
          onClick={onNext}
          disabled={spreadIndex >= totalSpreads - 1}
          className="font-mono text-[9px] text-black/20 hover:text-black/40 disabled:opacity-30 transition-colors"
        >
          NEXT →
        </button>
      </footer>
    </div>
  );
}
