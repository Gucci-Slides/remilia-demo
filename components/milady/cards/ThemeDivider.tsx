'use client';

import { getThemeHeader } from '@/lib/milady/layoutRhythm';
import { MiladyTheme } from '@/lib/milady/theme';

interface ThemeDividerProps {
  theme: MiladyTheme;
  additionalQuote?: string;
}

export function ThemeDivider({ theme, additionalQuote }: ThemeDividerProps) {
  const config = getThemeHeader(theme);

  return (
    <div className="col-span-full bg-[#f5f2ea] py-3 px-2 border-b border-black/10">
      {/* Main title row */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <h3 className="font-sans text-[24px] md:text-[28px] font-black tracking-tight text-black/90">
          {config.theme}
        </h3>
        <span className="font-sans text-[14px] md:text-[16px] text-black/40">
          ——
        </span>
        <span className="font-sans text-[14px] md:text-[16px] font-medium text-black/60 tracking-wide">
          {config.subtitle}
        </span>
        
        {additionalQuote && (
          <>
            <span className="font-sans text-[14px] text-black/30 hidden md:inline">——</span>
            <span className="font-serif text-[12px] italic text-black/40 hidden md:inline">
              {additionalQuote}
            </span>
          </>
        )}
      </div>

      {/* Quote row */}
      <p className="mt-1 font-serif text-[12px] italic text-black/50 max-w-2xl">
        {config.quote}
      </p>
    </div>
  );
}
