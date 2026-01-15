'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MiladySubject } from '@/lib/registry/types';

interface IndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: MiladySubject[];
  selectedId: string | null;
  onSelect: (subject: MiladySubject) => void;
}

export function IndexDrawer({
  isOpen,
  onClose,
  subjects,
  selectedId,
  onSelect,
}: IndexDrawerProps) {
  const handleSelect = (subject: MiladySubject) => {
    onSelect(subject);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/15 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[60vh] bg-[#FAF8F4] border-t border-black/10"
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className="w-8 h-0.5 bg-black/10 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-black/20" />
                <span className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase">
                  Index
                </span>
              </div>
              <span className="font-mono text-[8px] text-black/20">
                {subjects.length} subjects
              </span>
            </div>

            {/* Grid */}
            <div className="px-6 pb-6 overflow-y-auto max-h-[calc(60vh-80px)]">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSelect(subject)}
                    className={`
                      relative aspect-square bg-neutral-100
                      transition-all
                      ${selectedId === subject.id
                        ? 'ring-1 ring-black/20'
                        : 'hover:ring-1 hover:ring-black/10'
                      }
                    `}
                  >
                    {subject.imageUrl ? (
                      <Image
                        src={subject.imageUrl}
                        alt={subject.name}
                        fill
                        sizes="80px"
                        className="object-cover object-[50%_25%]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[7px] text-black/15">
                          {subject.id}
                        </span>
                      </div>
                    )}

                    {/* Match indicator */}
                    {subject.matchBonus && (
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#C41E3A]" />
                    )}

                    {/* ID overlay */}
                    <div className="absolute inset-x-0 bottom-0 px-0.5 py-px bg-white/80">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[6px] text-black/40">
                          {subject.id}
                        </span>
                        <span className="font-mono text-[5px] text-black/25">
                          {subject.dripScore}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
