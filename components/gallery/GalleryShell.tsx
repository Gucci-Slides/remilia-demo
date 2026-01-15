'use client';

import { ReactNode } from 'react';

interface GalleryShellProps {
  children: ReactNode;
}

export function GalleryShell({ children }: GalleryShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Subtle paper texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-[10vw] py-6">
        <div className="flex items-center justify-between">
          <span className="font-light text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
            Archive
          </span>
          <span className="font-light text-[10px] tracking-[0.15em] text-neutral-300 uppercase">
            Index
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
