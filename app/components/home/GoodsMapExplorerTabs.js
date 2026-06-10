'use client';

import { MAP_EXPLORER_MODES } from '../../utils/mapExplorerModes';

const TABS = [
  { id: MAP_EXPLORER_MODES.work, label: 'فروشگاه و نیاز' },
  { id: MAP_EXPLORER_MODES.places, label: 'مراکز و اماکن' },
];

export default function GoodsMapExplorerTabs({ value, onChange, className = '' }) {
  return (
    <div
      className={`border-b border-gray-200/90 bg-white px-3 py-2 sm:px-4 ${className}`.trim()}
      role="tablist"
      aria-label="نوع نقشه کالا"
    >
      <div className="inline-flex w-full max-w-md rounded-xl bg-gray-100/90 p-1 ring-1 ring-gray-200/80 sm:w-auto">
        {TABS.map((tab) => {
          const active = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange?.(tab.id)}
              className={`min-w-0 flex-1 rounded-lg px-3 py-2 text-xs font-bold transition touch-manipulation sm:flex-none sm:px-4 sm:text-[13px] ${
                active
                  ? 'bg-white text-amber-900 shadow-sm ring-1 ring-amber-200/80'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
