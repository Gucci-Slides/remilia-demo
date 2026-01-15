'use client';

import { MiladyTheme, ALL_THEMES, THEME_COLORS } from '@/lib/milady/theme';
import { SortMode } from '@/lib/milady/drip';

interface IndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Filter state
  selectedThemes: MiladyTheme[];
  onThemeToggle: (theme: MiladyTheme) => void;
  dripRange: [number, number];
  onDripRangeChange: (range: [number, number]) => void;
  matchOnly: boolean;
  onMatchOnlyChange: (val: boolean) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  onClearAll: () => void;
}

export function IndexDrawer({
  isOpen,
  onClose,
  selectedThemes,
  onThemeToggle,
  dripRange,
  onDripRangeChange,
  matchOnly,
  onMatchOnlyChange,
  sortMode,
  onSortModeChange,
  onClearAll,
}: IndexDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="
        fixed z-50 bg-[#f5f2ea] shadow-xl
        
        /* Mobile: bottom sheet */
        inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg
        
        /* Desktop: right panel */
        lg:inset-y-0 lg:right-0 lg:left-auto lg:w-80 lg:max-h-full lg:rounded-none
        
        overflow-y-auto
      ">
        {/* Header */}
        <div className="sticky top-0 bg-[#f5f2ea] border-b border-black/10 px-4 py-3 flex items-center justify-between">
          <div className="font-mono text-[11px] font-medium text-black/70">
            INDEX / FILTER PANEL
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[10px] text-black/40 hover:text-black/60 px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Themes */}
          <section>
            <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider mb-3">
              THEME CLASSIFICATION
            </div>
            <div className="space-y-1.5">
              {ALL_THEMES.filter(t => t !== 'UNKNOWN').map((theme) => {
                const isActive = selectedThemes.includes(theme);
                const colors = THEME_COLORS[theme];
                
                return (
                  <button
                    key={theme}
                    onClick={() => onThemeToggle(theme)}
                    className={`
                      w-full flex items-center gap-3 px-2 py-1.5
                      font-mono text-[10px] tracking-wide
                      border-l-2 ${colors.border}
                      ${isActive ? 'bg-white/70 text-black/80' : 'bg-transparent text-black/40'}
                      hover:bg-white/50 transition-colors
                      text-left
                    `}
                  >
                    <span className={`
                      w-2.5 h-2.5 rounded-sm border ${colors.border}
                      ${isActive ? colors.bg : 'bg-transparent'}
                    `} />
                    {theme}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Drip range */}
          <section>
            <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider mb-3">
              DRIP SCORE RANGE
            </div>
            <div className="bg-white/50 p-3 border border-black/5">
              <div className="flex justify-between font-mono text-[10px] text-black/60 mb-2">
                <span>{dripRange[0]}</span>
                <span>—</span>
                <span>{dripRange[1]}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={dripRange[0]}
                  onChange={(e) => onDripRangeChange([parseInt(e.target.value), dripRange[1]])}
                  className="w-full h-1 bg-black/10 appearance-none cursor-pointer accent-black"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={dripRange[1]}
                  onChange={(e) => onDripRangeChange([dripRange[0], parseInt(e.target.value)])}
                  className="w-full h-1 bg-black/10 appearance-none cursor-pointer accent-black"
                />
              </div>
            </div>
          </section>

          {/* Match toggle */}
          <section>
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/30 transition-colors">
              <input
                type="checkbox"
                checked={matchOnly}
                onChange={(e) => onMatchOnlyChange(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              <div>
                <div className="font-mono text-[10px] text-black/70">HAT/SHIRT MATCH ONLY</div>
                <div className="font-mono text-[8px] text-black/40">+5 drip alignment bonus</div>
              </div>
            </label>
          </section>

          {/* Sort */}
          <section>
            <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider mb-3">
              SORT ORDER
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { value: 'drip_desc', label: 'DRIP ↓' },
                { value: 'drip_asc', label: 'DRIP ↑' },
                { value: 'id_asc', label: 'ID ↑' },
                { value: 'id_desc', label: 'ID ↓' },
                { value: 'theme', label: 'THEME' },
                { value: 'random', label: 'SHUFFLE' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSortModeChange(opt.value as SortMode)}
                  className={`
                    px-2 py-1.5 font-mono text-[9px]
                    border border-black/10
                    ${sortMode === opt.value 
                      ? 'bg-black text-white' 
                      : 'bg-white/50 text-black/50 hover:bg-white/80'
                    }
                    transition-colors
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Clear all */}
          <button
            onClick={onClearAll}
            className="
              w-full py-2
              font-mono text-[10px] text-black/40
              border border-black/10
              hover:bg-black/5 hover:text-black/60
              transition-colors
            "
          >
            RESET ALL FILTERS
          </button>

          {/* Registry notes */}
          <div className="pt-4 border-t border-black/5">
            <div className="font-mono text-[7px] text-black/25 space-y-0.5">
              <div>REGISTRY BUILD: 2024.01.R3</div>
              <div>CLASSIFICATION: PROVISIONAL</div>
              <div>DRIP SCORES: ON-CHAIN DERIVED</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
