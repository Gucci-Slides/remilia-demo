'use client';

import { ViewMode } from '@/lib/registry/types';

interface InstitutionHeaderProps {
  totalCount: number;
  loadedCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function InstitutionHeader({
  totalCount,
  loadedCount,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: InstitutionHeaderProps) {
  return (
    <header className="h-12 px-6 flex items-center justify-between border-b border-black/5 bg-[#F8F6F2]">
      {/* Left: Institution identity */}
      <div className="flex items-baseline gap-3">
        <h1 className="font-light text-[11px] tracking-[0.2em] text-black/70 uppercase">
          Milady Registry
        </h1>
        <span className="font-mono text-[9px] text-black/25">
          v3.1
        </span>
        <span className="font-mono text-[9px] text-black/30">
          {loadedCount}/{totalCount}
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="
            font-mono text-[9px] text-black/50
            bg-transparent border-none
            focus:outline-none cursor-pointer
            appearance-none pr-4
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23999' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
          }}
        >
          <option value="drip_desc">DRIP ↓</option>
          <option value="drip_asc">DRIP ↑</option>
          <option value="id_asc">ID ↑</option>
          <option value="id_desc">ID ↓</option>
        </select>

        {/* View mode toggle */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onViewModeChange('dossier')}
            className={`
              px-2 py-1 font-mono text-[8px] tracking-wider uppercase
              transition-colors
              ${viewMode === 'dossier' 
                ? 'text-black/70 bg-white' 
                : 'text-black/30 hover:text-black/50'
              }
            `}
          >
            Dossier
          </button>
          <button
            onClick={() => onViewModeChange('index')}
            className={`
              px-2 py-1 font-mono text-[8px] tracking-wider uppercase
              transition-colors
              ${viewMode === 'index' 
                ? 'text-black/70 bg-white' 
                : 'text-black/30 hover:text-black/50'
              }
            `}
          >
            Index
          </button>
        </div>
      </div>
    </header>
  );
}
