'use client';

import { MiladyTheme, ALL_THEMES, THEME_COLORS } from '@/lib/milady/theme';
import { SortMode } from '@/lib/milady/drip';

interface IndexBarProps {
  // Filter state
  selectedThemes: MiladyTheme[];
  onThemeToggle: (theme: MiladyTheme) => void;
  dripRange: [number, number];
  onDripRangeChange: (range: [number, number]) => void;
  matchOnly: boolean;
  onMatchOnlyChange: (val: boolean) => void;
  searchId: string;
  onSearchIdChange: (val: string) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  // Actions
  onOpenDrawer: () => void;
  onClearAll: () => void;
}

export function IndexBar({
  selectedThemes,
  onThemeToggle,
  dripRange,
  onDripRangeChange,
  matchOnly,
  onMatchOnlyChange,
  searchId,
  onSearchIdChange,
  sortMode,
  onSortModeChange,
  onOpenDrawer,
}: IndexBarProps) {
  return (
    <div className="sticky top-[29px] z-40 bg-[#f5f2ea] border-b border-black/10">
      <div className="px-3 py-1.5">
        {/* Main row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center border border-black/15 bg-white/50">
            <span className="font-mono text-[8px] text-black/30 px-1.5">SEARCE US</span>
            <input
              type="text"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              className="
                w-8 px-1 py-0.5
                font-mono text-[9px] text-black/80
                bg-transparent
                placeholder:text-black/25
                focus:outline-none
              "
            />
            <span className="font-mono text-[9px] text-black/20 px-1">Q</span>
          </div>

          {/* Theme chips - newspaper style */}
          <div className="flex items-center gap-0.5">
            {ALL_THEMES.filter(t => !['UNKNOWN', 'MIXED'].includes(t)).slice(0, 4).map((theme) => {
              const isActive = selectedThemes.includes(theme);
              const colors = THEME_COLORS[theme];
              
              return (
                <button
                  key={theme}
                  onClick={() => onThemeToggle(theme)}
                  className={`
                    px-1 py-0.5
                    font-mono text-[8px] tracking-wide
                    border
                    ${isActive 
                      ? `${colors.bg} ${colors.text} ${colors.border}` 
                      : 'bg-white/50 text-black/40 border-black/10'
                    }
                    hover:opacity-80 transition-opacity
                  `}
                >
                  {theme.slice(0, 4)}
                </button>
              );
            })}
          </div>

          {/* Drip range */}
          <div className="flex items-center gap-1.5 border border-black/10 bg-white/30 px-1.5 py-0.5">
            <span className="font-mono text-[8px] text-black/30">DRIP</span>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black/20" 
                  style={{ width: `${dripRange[1] - dripRange[0]}%`, marginLeft: `${dripRange[0]}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-[8px] text-black/40">{dripRange[0]}-{dripRange[1]}</span>
          </div>

          {/* Match toggle */}
          <button
            onClick={() => onMatchOnlyChange(!matchOnly)}
            className={`
              px-1 py-0.5
              font-mono text-[8px]
              border
              ${matchOnly 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-400' 
                : 'bg-white/30 text-black/30 border-black/10'
              }
            `}
          >
            +5
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort dropdown - hidden on mobile */}
          <select
            value={sortMode}
            onChange={(e) => onSortModeChange(e.target.value as SortMode)}
            className="
              hidden sm:block
              px-1 py-0.5
              font-mono text-[8px] text-black/50
              bg-white/30 border border-black/10
              focus:outline-none
              cursor-pointer
            "
          >
            <option value="drip_desc">DRIP ↓</option>
            <option value="drip_asc">DRIP ↑</option>
            <option value="id_asc">ID ↑</option>
            <option value="id_desc">ID ↓</option>
            <option value="theme">THEME</option>
            <option value="random">SHUFFLE</option>
          </select>

          {/* INDEX button */}
          <button
            onClick={onOpenDrawer}
            className="
              px-2 py-0.5
              font-mono text-[9px] text-black/60
              border border-black/20
              bg-white/50
              hover:bg-black/5
              transition-colors
            "
          >
            INDEX
          </button>
        </div>
      </div>
    </div>
  );
}
