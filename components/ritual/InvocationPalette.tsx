'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseInvocation, getOracleSuggestions, ParsedQuery } from '@/lib/registry/parser';
import { MiladySubject } from '@/lib/registry/types';

interface InvocationPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoke: (query: ParsedQuery) => void;
  previewResults: MiladySubject[];
  totalCount: number;
}

export function InvocationPalette({
  isOpen,
  onClose,
  onInvoke,
  previewResults,
  totalCount,
}: InvocationPaletteProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const parsedQuery = parseInvocation(input);
  const suggestions = getOracleSuggestions(input);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setInput('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvoke(parsedQuery);
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(prev => {
      const tokens = prev.trim().split(/\s+/);
      if (tokens.length > 0 && tokens[tokens.length - 1]) {
        tokens[tokens.length - 1] = suggestion;
      } else {
        tokens.push(suggestion);
      }
      return tokens.join(' ') + ' ';
    });
    inputRef.current?.focus();
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
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="bg-[#FAF8F4] border border-black/8 shadow-2xl">
              {/* Header */}
              <div className="px-5 py-4 border-b border-black/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-[#C41E3A]" />
                  <span className="font-mono text-[9px] text-black/35 tracking-[0.2em] uppercase">
                    Invocation
                  </span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="theme:prep drip>70 match:true"
                    className="
                      w-full py-2
                      font-mono text-[13px] text-black/70
                      bg-transparent border-none
                      placeholder:text-black/20
                      focus:outline-none
                    "
                  />
                </form>
              </div>

              {/* Oracle suggestions */}
              <div className="px-5 py-3 border-b border-black/5">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="
                        px-2 py-1
                        font-mono text-[9px] text-black/35
                        border border-black/8
                        hover:border-black/15 hover:text-black/50
                        transition-colors
                      "
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview results */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[8px] text-black/25 uppercase tracking-widest">
                    Matching
                  </span>
                  <span className="font-mono text-[10px] text-black/40">
                    {previewResults.length} / {totalCount}
                  </span>
                </div>

                {previewResults.length > 0 ? (
                  <div className="space-y-1">
                    {previewResults.slice(0, 5).map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between py-1.5 border-b border-black/5 last:border-0"
                      >
                        <span className="font-mono text-[10px] text-black/50">
                          #{subject.id}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[8px] text-black/25">
                            {subject.themes[0] || '—'}
                          </span>
                          <span className="font-mono text-[9px] text-black/35">
                            {subject.dripScore}
                          </span>
                          {subject.matchBonus && (
                            <span className="font-mono text-[7px] text-[#C41E3A]/60">
                              +5
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {previewResults.length > 5 && (
                      <div className="text-center pt-2">
                        <span className="font-mono text-[8px] text-black/20">
                          +{previewResults.length - 5} more
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <span className="font-mono text-[9px] text-black/20">
                      No matches
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-black/5 flex items-center justify-between">
                <span className="font-mono text-[8px] text-black/20">
                  Enter to invoke · Esc to dismiss
                </span>
                <button
                  onClick={() => {
                    onInvoke(parsedQuery);
                    onClose();
                  }}
                  className="
                    px-4 py-1.5
                    font-mono text-[9px] text-black/50 tracking-wider uppercase
                    border border-black/10
                    hover:bg-black/5 transition-colors
                  "
                >
                  Invoke
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
