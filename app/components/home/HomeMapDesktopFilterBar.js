'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MAP_FILTER_TOOLBAR, MAP_FILTER_TOOLBAR_PAD } from './mapFilterTheme';

function MapFilterCell({ label, children, hideLabel = false }) {
  if (!children) return null;
  return (
    <div className="min-w-0">
      <span className={hideLabel ? 'sr-only' : 'mb-1.5 block text-[11px] font-semibold leading-none text-gray-500'}>
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function HomeMapDesktopFilterBar({
  placeSearchControl = null,
  regionFilters = null,
  layerToolbar = null,
  layerControl = null,
  mainCategoryControl = null,
  subCategoryControl = null,
  sectionControl = null,
  neighborhoodControl = null,
  /** @deprecated */
  serviceControl = null,
  /** @deprecated */
  regionControl = null,
  summary = null,
  variant = 'default',
  onCategorySearchFocus = null,
}) {
  const useLegacyLayout = Boolean(serviceControl || regionControl) && !mainCategoryControl;
  const isGoodsRegionRow = variant === 'goodsRegionRow';

  if (isGoodsRegionRow) {
    const hasRegion = Boolean(sectionControl || neighborhoodControl);
    if (!layerToolbar && !layerControl && !hasRegion && !onCategorySearchFocus) return null;

    return (
      <div className={MAP_FILTER_TOOLBAR}>
        <div className={`flex items-center gap-2 ${MAP_FILTER_TOOLBAR_PAD}`}>
          {layerToolbar || layerControl ? (
            <div className="min-w-0 shrink-0 sm:max-w-[14rem]">{layerToolbar || layerControl}</div>
          ) : null}

          {hasRegion ? (
            <>
              {sectionControl ? (
                <div className="min-w-0 flex-1 sm:max-w-[11.5rem] md:max-w-[13rem]">
                  <MapFilterCell label="بخش" hideLabel>
                    {sectionControl}
                  </MapFilterCell>
                </div>
              ) : null}
              {neighborhoodControl ? (
                <div className="min-w-0 flex-1 sm:max-w-[11.5rem] md:max-w-[13rem]">
                  <MapFilterCell label="محله" hideLabel>
                    {neighborhoodControl}
                  </MapFilterCell>
                </div>
              ) : null}
            </>
          ) : null}

          {onCategorySearchFocus ? (
            <button
              type="button"
              onClick={onCategorySearchFocus}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200/90 bg-white text-amber-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 active:scale-[0.98]"
              aria-label="جستجو در دسته‌ها"
              title="جستجو در دسته‌ها"
            >
              <MagnifyingGlassIcon className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (placeSearchControl) {
    const hasRegion = Boolean(sectionControl || neighborhoodControl || regionFilters);
    return (
      <div className={MAP_FILTER_TOOLBAR}>
        <div
          className={`flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2.5 ${MAP_FILTER_TOOLBAR_PAD}`}
        >
          <div className="min-w-0 flex-1">{placeSearchControl}</div>
          {hasRegion ? (
            regionFilters || (
              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:w-[min(100%,26rem)] lg:shrink-0">
                {sectionControl ? (
                  <MapFilterCell label="بخش" hideLabel>
                    {sectionControl}
                  </MapFilterCell>
                ) : null}
                {neighborhoodControl ? (
                  <MapFilterCell label="محله" hideLabel>
                    {neighborhoodControl}
                  </MapFilterCell>
                ) : null}
              </div>
            )
          ) : null}
        </div>
      </div>
    );
  }

  if (useLegacyLayout) {
    if (!serviceControl && !regionControl) return null;
    return (
      <div className={`hidden md:block ${MAP_FILTER_TOOLBAR}`}>
        <div className={`flex flex-wrap items-center gap-2 ${MAP_FILTER_TOOLBAR_PAD}`}>
          {serviceControl ? (
            <div className="min-w-[10rem] flex-1 max-w-xs">
              <span className="sr-only">سرویس</span>
              {serviceControl}
            </div>
          ) : null}
          {regionControl ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 lg:min-w-[18rem]">
              {regionControl}
            </div>
          ) : null}
        </div>
        {summary ? (
          <div className="border-t border-gray-100/90 px-4 py-2 lg:px-5">{summary}</div>
        ) : null}
      </div>
    );
  }

  const cells = [
    { key: 'main', label: 'دسته', control: mainCategoryControl },
    { key: 'sub', label: 'زیردسته', control: subCategoryControl },
    { key: 'section', label: 'بخش', control: sectionControl },
    { key: 'neighborhood', label: 'محله', control: neighborhoodControl },
  ].filter((item) => item.control);

  const hasLayer = Boolean(layerToolbar || layerControl);

  if (!cells.length && !hasLayer && !summary) return null;

  return (
    <div className={`hidden md:block ${MAP_FILTER_TOOLBAR}`}>
      <div
        className={`flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-2.5 ${MAP_FILTER_TOOLBAR_PAD}`}
      >
        {hasLayer ? <div className="shrink-0">{layerToolbar || layerControl}</div> : null}

        {hasLayer && cells.length ? (
          <div
            className="hidden h-9 w-px shrink-0 bg-gray-200/90 lg:block"
            role="presentation"
            aria-hidden
          />
        ) : null}

        {cells.length ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 lg:flex-nowrap">
            {cells.map((item) => (
              <div
                key={item.key}
                className="min-w-[calc(50%-0.25rem)] flex-1 lg:min-w-0 lg:max-w-none"
              >
                <MapFilterCell label={item.label} hideLabel>
                  {item.control}
                </MapFilterCell>
              </div>
            ))}
          </div>
        ) : null}

        {!cells.length && summary ? <div className="min-w-0 flex-1">{summary}</div> : null}
      </div>
    </div>
  );
}
