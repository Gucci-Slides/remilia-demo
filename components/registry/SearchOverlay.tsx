'use client';

import { useState, useEffect, useRef } from 'react';
import { MiladyRecord } from '@/lib/mock/miladies';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  records: MiladyRecord[];
  onRecordSelect: (record: MiladyRecord) => void;
}

export function SearchOverlay({ isOpen, onClose, records, onRecordSelect }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter records
  const filtered = records.filter(r => 
    r.id.includes(query) ||
    r.hatTheme.toLowerCase().includes(query.toLowerCase()) ||
    r.shirtTheme.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-50">
        <div className="bg-[#FAF8F5] border border-black/10 shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-black/8">
            <svg className="w-4 h-4 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID or theme..."
              className="flex-1 font-mono text-[12px] text-black/70 bg-transparent focus:outline-none placeholder:text-black/25"
            />
            <kbd className="font-mono text-[8px] text-black/25 bg-black/5 px-1.5 py-0.5">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-8 text-center">
                <span className="font-mono text-[10px] text-black/30">No records found</span>
              </div>
            ) : (
              <div className="py-2">
                {filtered.slice(0, 10).map((record) => (
                  <button
                    key={record.id}
                    onClick={() => {
                      onRecordSelect(record);
                      onClose();
                      setQuery('');
                    }}
                    className="
                      w-full px-4 py-3 flex items-center justify-between
                      hover:bg-black/5 transition-colors
                      border-b border-black/5 last:border-0
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-black/60">
                        #{record.id}
                      </span>
                      <span className="font-mono text-[9px] text-black/30">
                        {record.hatTheme}
                      </span>
                      {record.matchBonus && (
                        <span className="font-mono text-[7px] text-[#C41E3A]/70 px-1 border border-[#C41E3A]/30">
                          +5
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[9px] text-black/30">
                      {record.dripGrade}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-black/8 flex items-center justify-between">
            <span className="font-mono text-[8px] text-black/25">
              {filtered.length} records
            </span>
            <span className="font-mono text-[8px] text-black/20">
              ↑↓ navigate · ↵ select
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
