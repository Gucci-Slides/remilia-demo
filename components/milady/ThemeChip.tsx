'use client';

import { MiladyTheme, THEME_COLORS } from '@/lib/milady/theme';

interface ThemeChipProps {
  theme: MiladyTheme;
  size?: 'xs' | 'sm';
  active?: boolean;
  onClick?: () => void;
}

export function ThemeChip({ theme, size = 'xs', active = true, onClick }: ThemeChipProps) {
  const colors = THEME_COLORS[theme];
  
  const sizeClasses = size === 'xs' 
    ? 'text-[8px] px-1 py-0.5' 
    : 'text-[9px] px-1.5 py-0.5';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`
        font-mono tracking-wider uppercase
        border ${colors.border} ${colors.text}
        ${active ? colors.bg : 'bg-transparent opacity-40'}
        ${sizeClasses}
        ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
        transition-opacity
      `}
    >
      {theme}
    </button>
  );
}
