'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  RectangleGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import MapExplorerSummary from './MapExplorerSummary';
import { MapSettingToggle, MapViewModeToggle } from './MapSettingsBar';

export const HOME_MAP_MOBILE_FILTER_OPEN_EVENT = 'home-map-mobile-filter-open';

function useVisualViewportInset(active) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!active || typeof window === 'undefined' || !window.visualViewport) {
      setInset(0);
      return undefined;
    }

    const update = () => {
      const vv = window.visualViewport;
      if (!vv) {
        setInset(0);
        return;
      }
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setInset(keyboard > 50 ? keyboard : 0);
    };

    update();
    window.visualViewport.addEventListener('resize', update);
    window.visualViewport.addEventListener('scroll', update);
    return () => {
      window.visualViewport.removeEventListener('resize', update);
      window.visualViewport.removeEventListener('scroll', update);
    };
  }, [active]);

  return inset;
}

/** پنل فیلتر/تنظیمات — بالای نقشه تمام‌صفحه موبایل؛ باز شدن به پایین */
export default function HomeMapMobileFullscreenSheet({
  summary = 'فیلتر نقشه',
  statusCopy = null,
  mapLayer = null,
  layerToolbar = null,
  searchControl = null,
  regionControls = null,
  extraControls = null,
  show3D = true,
  onSelect2D,
  onSelect3D,
  showBoundaries = true,
  onShowBoundariesChange,
  onExpandedChange,
}) {
  const [open, setOpen] = useState(false);
  const keyboardInset = useVisualViewportInset(open);
  const hasMapSettings = Boolean(
    (onSelect2D && onSelect3D) || onShowBoundariesChange || extraControls
  );
  const hasStatus = Boolean(statusCopy?.title);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    onExpandedChange?.(open);
  }, [open, onExpandedChange]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const openFilters = () => setOpen(true);
    window.addEventListener(HOME_MAP_MOBILE_FILTER_OPEN_EVENT, openFilters);
    return () => window.removeEventListener(HOME_MAP_MOBILE_FILTER_OPEN_EVENT, openFilters);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const panelMaxHeight =
    keyboardInset > 0
      ? `min(calc(100dvh - ${keyboardInset + 180}px), 32rem)`
      : 'min(72dvh, 34rem)';

  return (
    <>
      {open ? (
        <button
          type="button"
          className="absolute inset-0 z-[540] bg-slate-950/20 backdrop-blur-[1px] dark:bg-black/35"
          aria-label="بستن پنل فیلتر"
          onClick={close}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[550] px-2 pt-2 sm:px-3">
        <div className="pointer-events-auto mx-auto w-full max-w-lg">
          <div
            className={`overflow-hidden rounded-2xl border border-gray-200/90 bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur-md transition-shadow dark:border-sky-800/90 dark:bg-sky-950/95 dark:shadow-black/30 ${
              open ? 'ring-1 ring-teal-500/20' : ''
            }`}
          >
            <button
              type="button"
              onClick={toggle}
              className="flex w-full touch-manipulation items-center gap-2.5 px-3 py-2.5 text-right active:bg-gray-50/90 dark:active:bg-sky-900/60 sm:gap-3 sm:px-3.5 sm:py-3"
              aria-expanded={open}
              aria-controls="home-map-mobile-fullscreen-filters"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/25 dark:bg-teal-500">
                <AdjustmentsHorizontalIcon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold leading-snug text-gray-900 dark:text-sky-50">
                  فیلتر و تنظیمات نقشه
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-gray-500 dark:text-sky-400">
                  {summary}
                </span>
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-teal-600 transition-transform duration-200 dark:text-teal-300 ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </button>

            {open ? (
              <>
                <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-3.5 py-2 dark:border-sky-800/90">
                  <p className="text-xs font-semibold text-gray-700 dark:text-sky-100">تنظیمات نقشه</p>
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-sky-300 dark:hover:bg-sky-900"
                    aria-label="بستن"
                  >
                    <XMarkIcon className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <div
                  id="home-map-mobile-fullscreen-filters"
                  className="overflow-y-auto overscroll-contain border-t border-gray-100 px-3.5 py-3.5 dark:border-sky-800/90"
                  style={{ maxHeight: panelMaxHeight }}
                >
                  <div className="space-y-4">
                    {layerToolbar ? (
                      <section className="space-y-2">
                        <h3 className="text-[11px] font-semibold text-gray-500 dark:text-sky-400">نوع نمایش</h3>
                        {layerToolbar}
                      </section>
                    ) : null}

                    {searchControl ? (
                      <section className="space-y-2">
                        <h3 className="text-[11px] font-semibold text-gray-500 dark:text-sky-400">
                          جستجوی حرفه یا دسته
                        </h3>
                        {searchControl}
                      </section>
                    ) : null}

                    {regionControls ? (
                      <section className="space-y-2">
                        <h3 className="text-[11px] font-semibold text-gray-500 dark:text-sky-400">منطقه</h3>
                        <div className="space-y-2.5">{regionControls}</div>
                      </section>
                    ) : null}

                    {hasMapSettings ? (
                      <section className="space-y-2">
                        <h3 className="text-[11px] font-semibold text-gray-500 dark:text-sky-400">نمای نقشه</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {onSelect2D && onSelect3D ? (
                            <MapViewModeToggle
                              compact
                              show3D={show3D}
                              onSelect2D={onSelect2D}
                              onSelect3D={onSelect3D}
                            />
                          ) : null}
                          {onShowBoundariesChange ? (
                            <MapSettingToggle
                              compact
                              active={showBoundaries}
                              onToggle={() => onShowBoundariesChange(!showBoundaries)}
                              icon={RectangleGroupIcon}
                              label="مرزها"
                              ariaOn="مخفی کردن مرزها"
                              ariaOff="نمایش مرزها"
                            />
                          ) : null}
                        </div>
                        {extraControls ? <div className="pt-1">{extraControls}</div> : null}
                      </section>
                    ) : null}

                    {hasStatus ? (
                      <section className="rounded-xl border border-gray-200/90 bg-gray-50/90 px-3 py-2.5 dark:border-sky-800 dark:bg-sky-900/60">
                        <MapExplorerSummary copy={statusCopy} footer layer={mapLayer} />
                      </section>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-gray-100 px-3.5 py-2.5 dark:border-sky-800/90">
                  <button
                    type="button"
                    onClick={close}
                    className="flex h-10 w-full touch-manipulation items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white shadow-sm active:scale-[0.99] dark:bg-teal-500"
                  >
                    اعمال و بستن
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
