'use client';

import { MAP_FILTER_HEIGHT } from './mapFilterTheme';

export default function MapGoodsNeedScopeToggle({
  mineOnly = true,
  onChange,
  disabled = false,
  compact = false,
}) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-lg border border-gray-200/90 bg-white p-0.5 shadow-sm ${
        compact ? MAP_FILTER_HEIGHT : 'h-9'
      }`}
      role="group"
      aria-label="محدوده نیازهای کالا"
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={mineOnly}
        onClick={() => onChange?.(true)}
        className={`rounded-md px-2.5 text-[11px] font-bold transition ${
          mineOnly ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-800'
        } ${compact ? 'h-8' : 'h-8'}`}
      >
        دسته من
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={!mineOnly}
        onClick={() => onChange?.(false)}
        className={`rounded-md px-2.5 text-[11px] font-bold transition ${
          !mineOnly ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-800'
        } ${compact ? 'h-8' : 'h-8'}`}
      >
        همه
      </button>
    </div>
  );
}
