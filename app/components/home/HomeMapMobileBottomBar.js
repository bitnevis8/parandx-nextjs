'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon, ChevronUpIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import MapExplorerSummary from './MapExplorerSummary';
import { MapSettingToggle, MapViewModeToggle } from './MapSettingsBar';

export default function HomeMapMobileBottomBar({
  filterSummary = 'فیلتر نقشه',
  filterControls = null,
  summaryCopy = null,
  mapLayer = null,
  showBoundaries = true,
  onShowBoundariesChange,
  show3D = true,
  onSelect2D,
  onSelect3D,
  onFiltersExpandedChange,
}) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const hasFilterPanel = Boolean(filterControls);
  const hasStatus = Boolean(summaryCopy?.title);

  const toggleFilters = useCallback(() => {
    if (!hasFilterPanel) return;
    setFiltersExpanded((prev) => !prev);
  }, [hasFilterPanel]);

  useEffect(() => {
    onFiltersExpandedChange?.(filtersExpanded);
  }, [filtersExpanded, onFiltersExpandedChange]);

  return (
    <div className="shrink-0 border-t border-gray-200/90 bg-white px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {hasFilterPanel && filtersExpanded ? (
        <div
          id="home-map-mobile-filters"
          className="mb-2 max-h-[min(38dvh,18rem)] overflow-y-auto overscroll-contain rounded-xl border border-gray-200/90 bg-white px-3 py-3 shadow-sm"
        >
          <div className="space-y-3">{filterControls}</div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200/90 bg-gray-50/95 shadow-sm">
        {hasStatus ? (
          <div className="border-b border-gray-200/80 bg-white px-3 py-2">
            <MapExplorerSummary copy={summaryCopy} footer layer={mapLayer} />
          </div>
        ) : null}

        <div className="flex items-stretch gap-1.5 p-1">
          <button
            type="button"
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-right touch-manipulation transition ${
              hasFilterPanel ? 'hover:bg-white active:bg-white' : 'cursor-default'
            }`}
            onClick={toggleFilters}
            aria-expanded={filtersExpanded}
            aria-controls="home-map-mobile-filters"
            disabled={!hasFilterPanel}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
              <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-gray-900">فیلتر</span>
              <span className="mt-0.5 block truncate text-[10px] leading-tight text-gray-500">
                {filterSummary}
              </span>
            </span>
            {hasFilterPanel ? (
              <ChevronUpIcon
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                  filtersExpanded ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            ) : null}
          </button>

          <div className="w-px shrink-0 self-stretch bg-gray-200/90" aria-hidden />

          <div className="flex shrink-0 items-center gap-1 pe-0.5">
            <MapViewModeToggle compact show3D={show3D} onSelect2D={onSelect2D} onSelect3D={onSelect3D} />
            <MapSettingToggle
              compact
              active={showBoundaries}
              onToggle={() => onShowBoundariesChange?.(!showBoundaries)}
              icon={RectangleGroupIcon}
              label="مرزها"
              ariaOn="مخفی کردن مرزها"
              ariaOff="نمایش مرزها"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
