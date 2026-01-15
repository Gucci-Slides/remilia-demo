'use client';

import { QueryState, MiladyTheme, ALL_THEMES, DEFAULT_QUERY } from '@/lib/registry/types';

interface QueryConsoleProps {
  query: QueryState;
  onQueryChange: (query: QueryState) => void;
  onApply: () => void;
  resultCount: number;
}

export function QueryConsole({
  query,
  onQueryChange,
  onApply,
  resultCount,
}: QueryConsoleProps) {
  const handleThemeToggle = (theme: MiladyTheme) => {
    const newThemes = query.selectedThemes.includes(theme)
      ? query.selectedThemes.filter(t => t !== theme)
      : [...query.selectedThemes, theme];
    onQueryChange({ ...query, selectedThemes: newThemes });
  };

  const handleReset = () => {
    onQueryChange(DEFAULT_QUERY);
  };

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-black/5 bg-[#FAF8F4] p-6 lg:p-8 overflow-y-auto">
      {/* Console header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-[#C41E3A]" />
          <span className="font-mono text-[9px] text-black/40 tracking-[0.2em] uppercase">
            Query Console
          </span>
        </div>
        <div className="h-px bg-black/5" />
      </div>

      {/* ID Search */}
      <div className="mb-8">
        <label className="block font-mono text-[9px] text-black/40 tracking-[0.15em] uppercase mb-3">
          Subject ID
        </label>
        <form onSubmit={handleIdSubmit}>
          <input
            type="text"
            value={query.searchId}
            onChange={(e) => onQueryChange({ ...query, searchId: e.target.value })}
            placeholder="ENTER ID (e.g. 9999)"
            className="
              w-full px-3 py-2.5
              font-mono text-[12px] text-black/70
              bg-white border border-black/8
              placeholder:text-black/20
              focus:outline-none focus:border-black/20
              transition-colors
            "
          />
        </form>
      </div>

      {/* Theme Selector */}
      <div className="mb-8">
        <label className="block font-mono text-[9px] text-black/40 tracking-[0.15em] uppercase mb-3">
          Theme Classification
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALL_THEMES.map((theme) => {
            const isActive = query.selectedThemes.includes(theme);
            return (
              <button
                key={theme}
                onClick={() => handleThemeToggle(theme)}
                className={`
                  px-3 py-2 text-left
                  font-mono text-[10px] tracking-wider
                  border transition-all
                  ${isActive
                    ? 'bg-black/5 text-black/70 border-black/15'
                    : 'bg-white text-black/35 border-black/8 hover:border-black/15'
                  }
                `}
              >
                {theme}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drip Range */}
      <div className="mb-8">
        <label className="block font-mono text-[9px] text-black/40 tracking-[0.15em] uppercase mb-3">
          Drip Score Range
        </label>
        <div className="bg-white border border-black/8 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] text-black/50">
              {query.dripRange[0]}
            </span>
            <span className="font-mono text-[9px] text-black/25">—</span>
            <span className="font-mono text-[11px] text-black/50">
              {query.dripRange[1]}
            </span>
          </div>
          <div className="relative h-1 bg-black/5">
            <div
              className="absolute h-full bg-black/20"
              style={{
                left: `${query.dripRange[0]}%`,
                right: `${100 - query.dripRange[1]}%`,
              }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="range"
              min={0}
              max={100}
              value={query.dripRange[0]}
              onChange={(e) =>
                onQueryChange({
                  ...query,
                  dripRange: [parseInt(e.target.value), query.dripRange[1]],
                })
              }
              className="flex-1 h-1 bg-transparent appearance-none cursor-pointer accent-black"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={query.dripRange[1]}
              onChange={(e) =>
                onQueryChange({
                  ...query,
                  dripRange: [query.dripRange[0], parseInt(e.target.value)],
                })
              }
              className="flex-1 h-1 bg-transparent appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>
      </div>

      {/* Match Toggle */}
      <div className="mb-8">
        <button
          onClick={() => onQueryChange({ ...query, matchOnly: !query.matchOnly })}
          className={`
            w-full px-4 py-3 text-left
            font-mono text-[10px] tracking-wide
            border transition-all
            flex items-center justify-between
            ${query.matchOnly
              ? 'bg-[#C41E3A]/5 text-[#C41E3A]/80 border-[#C41E3A]/20'
              : 'bg-white text-black/40 border-black/8 hover:border-black/15'
            }
          `}
        >
          <span>MATCHED THEMES ONLY</span>
          <span className="font-medium">{query.matchOnly ? '+5 ✓' : '+5'}</span>
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onApply}
          className="
            w-full py-3
            font-mono text-[10px] tracking-[0.15em] uppercase
            bg-black/80 text-white
            hover:bg-black transition-colors
          "
        >
          Apply Query
        </button>
        <button
          onClick={handleReset}
          className="
            w-full py-2
            font-mono text-[9px] tracking-wider uppercase
            text-black/30 hover:text-black/50
            transition-colors
          "
        >
          Reset
        </button>
      </div>

      {/* Result count */}
      <div className="mt-8 pt-6 border-t border-black/5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-black/30 uppercase tracking-wider">
            Results
          </span>
          <span className="font-mono text-[14px] text-black/60">
            {resultCount}
          </span>
        </div>
      </div>
    </aside>
  );
}
