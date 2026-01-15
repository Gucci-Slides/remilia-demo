'use client';

import { ReactNode } from 'react';

interface RegistryShellProps {
  children: ReactNode;
  currentIndex: number;
  totalRecords: number;
  mode: 'ritual' | 'index';
  onModeChange: (mode: 'ritual' | 'index') => void;
  onSearchOpen: () => void;
}

export function RegistryShell({
  children,
  currentIndex,
  totalRecords,
  mode,
  onModeChange,
  onSearchOpen,
}: RegistryShellProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Paper grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Institutional header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-black/5">
        <div className="h-12 px-6 flex items-center justify-between">
          {/* Left: Institution identity */}
          <div className="flex items-baseline gap-3">
            <h1 className="font-mono text-[11px] font-medium tracking-[0.15em] text-black/80 uppercase">
              Milady Registry
            </h1>
            <span className="font-mono text-[9px] text-black/25 tracking-wider">
              v3.0
            </span>
            <span className="font-mono text-[9px] text-black/30 hidden sm:inline">
              SPREAD {String(currentIndex + 1).padStart(2, '0')}/{String(totalRecords).padStart(2, '0')}
            </span>
          </div>

          {/* Right: Minimal controls */}
          <div className="flex items-center gap-4">
            {/* Mode toggle */}
            <div className="flex items-center gap-0.5 bg-black/[0.03] p-0.5">
              <button
                onClick={() => onModeChange('ritual')}
                className={`
                  px-2 py-1 font-mono text-[8px] tracking-wider uppercase
                  transition-colors
                  ${mode === 'ritual' 
                    ? 'bg-white text-black/70 shadow-sm' 
                    : 'text-black/30 hover:text-black/50'
                  }
                `}
              >
                Ritual
              </button>
              <button
                onClick={() => onModeChange('index')}
                className={`
                  px-2 py-1 font-mono text-[8px] tracking-wider uppercase
                  transition-colors
                  ${mode === 'index' 
                    ? 'bg-white text-black/70 shadow-sm' 
                    : 'text-black/30 hover:text-black/50'
                  }
                `}
              >
                Index
              </button>
            </div>

            {/* Search */}
            <button
              onClick={onSearchOpen}
              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
              title="Search (⌘K)"
            >
              <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pt-12">
        {children}
      </main>
    </div>
  );
}
