'use client';

import { MAP_FILTER_HEIGHT } from './mapFilterTheme';

export default function MapGoodsNeedScopeToggle({
  mineOnly = true,
  onChange,
  disabled = false,
  compact = false,
  fullWidth = false,
}) {
  const shellClass = fullWidth
    ? `flex h-9 w-full items-center rounded-lg border border-gray-200/90 bg-white p-0.5 shadow-sm ${MAP_FILTER_HEIGHT}`
    : `inline-flex shrink-0 items-center rounded-lg border border-gray-200/90 bg-white p-0.5 shadow-sm ${
        compact ? MAP_FILTER_HEIGHT : 'h-9'
      }`;

  return (
    <div className={shellClass} role="group" aria-label="محدوده نیازهای کالا">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={mineOnly}
        onClick={() => onChange?.(true)}
        className={`rounded-md font-bold transition ${
          mineOnly ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-800'
        } ${
          fullWidth ? 'h-full flex-1 px-2 text-xs' : compact ? 'h-8 px-2.5 text-[11px]' : 'h-8 px-2.5 text-[11px]'
        }`}
      >
        دسته من
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={!mineOnly}
        onClick={() => onChange?.(false)}
        className={`rounded-md font-bold transition ${
          !mineOnly ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-800'
        } ${
          fullWidth ? 'h-full flex-1 px-2 text-xs' : compact ? 'h-8 px-2.5 text-[11px]' : 'h-8 px-2.5 text-[11px]'
        }`}
      >
        همه
      </button>
    </div>
  );
}
