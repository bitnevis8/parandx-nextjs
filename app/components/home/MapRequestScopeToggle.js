'use client';

import { MAP_FILTER_HEIGHT } from './mapFilterTheme';

export default function MapRequestScopeToggle({
  mineOnly = true,
  onChange,
  disabled = false,
  compact = false,
  fullWidth = false,
}) {
  const shellClass = fullWidth
    ? 'flex h-10 w-full rounded-xl border border-amber-200/80 bg-amber-50/60 p-0.5 dark:border-amber-700/50 dark:bg-amber-950/40'
    : compact
      ? 'inline-flex h-9 min-w-[11rem] max-w-[12.5rem] rounded-lg border border-amber-200/80 bg-amber-50/60 p-0.5'
      : `inline-flex ${MAP_FILTER_HEIGHT} w-full rounded-xl border border-amber-200/80 bg-amber-50/60 p-0.5 sm:w-auto sm:min-w-[15rem]`;

  return (
    <div className={shellClass} role="group" aria-label="محدوده نمایش کارها">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={mineOnly}
        onClick={() => onChange?.(true)}
        className={`inline-flex min-w-0 items-center justify-center rounded-md font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35 disabled:opacity-50 ${
          fullWidth ? 'h-full flex-1 px-2 text-xs' : compact
            ? 'h-full px-2 text-[10px] leading-tight'
            : 'flex-1 rounded-[0.65rem] px-2.5 text-[11px] sm:px-3 sm:text-xs'
        } ${
          mineOnly
            ? 'bg-amber-500 text-white shadow-sm'
            : 'text-amber-900/70 hover:bg-white/70 hover:text-amber-950'
        }`}
      >
        {compact ? 'تخصص من' : 'کارهای تخصص من'}
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={!mineOnly}
        onClick={() => onChange?.(false)}
        className={`inline-flex min-w-0 items-center justify-center rounded-md font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35 disabled:opacity-50 ${
          fullWidth ? 'h-full flex-1 px-2 text-xs' : compact
            ? 'h-full px-2 text-[10px] leading-tight'
            : 'flex-1 rounded-[0.65rem] px-2.5 text-[11px] sm:px-3 sm:text-xs'
        } ${
          !mineOnly
            ? 'bg-white text-amber-950 shadow-sm ring-1 ring-amber-200/80'
            : 'text-amber-900/70 hover:bg-white/70 hover:text-amber-950'
        }`}
      >
        {compact ? 'همه' : 'همه کارها'}
      </button>
    </div>
  );
}
