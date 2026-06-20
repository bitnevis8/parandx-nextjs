'use client';

import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { GOODS_MAP_TOOLBAR, GOODS_MAP_TOOLBAR_PAD } from '../home/mapFilterTheme';

export default function GoodsMapCompactToolbar({
  layerToolbar,
  regionFilters,
  categoryPanelOpen,
  onToggleCategoryPanel,
  activeFilterLabel = '',
}) {
  if (!layerToolbar && !regionFilters && !onToggleCategoryPanel) return null;

  return (
    <div
      className={`${GOODS_MAP_TOOLBAR} ${GOODS_MAP_TOOLBAR_PAD} rounded-t-2xl border-b border-gray-200/90`}
      dir="rtl"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
        {layerToolbar ? (
          <div className="min-w-0 shrink-0 basis-[9.5rem] sm:max-w-[14rem] sm:basis-auto">
            {layerToolbar}
          </div>
        ) : null}

        {regionFilters ? (
          <div className="flex min-w-0 max-w-full shrink gap-1.5 sm:max-w-[min(100%,18rem)] sm:gap-2">
            {regionFilters}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggleCategoryPanel}
          aria-expanded={categoryPanelOpen}
          className={`ms-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition sm:px-3 sm:text-[13px] ${
            categoryPanelOpen
              ? 'border-amber-300 bg-amber-50 text-amber-800'
              : 'border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:bg-amber-50/70 hover:text-amber-800'
          }`}
        >
          <Squares2X2Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          <span>{categoryPanelOpen ? 'بستن دسته‌ها' : 'دسته‌بندی'}</span>
        </button>
      </div>

      {activeFilterLabel && !categoryPanelOpen ? (
        <p className="mt-1.5 truncate text-[10px] text-gray-500 sm:text-[11px]">{activeFilterLabel}</p>
      ) : null}
    </div>
  );
}
