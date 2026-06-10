'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { searchMapPlaces } from '../../utils/mapPlaceSearch';
import {
  clearPlaceMarkers,
  filterPlacesWithinBoundary,
  showPlacesOnMap,
} from '../../utils/mapPlaceMarkers';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';

import { MAP_FILTER_HEIGHT } from '../home/mapFilterTheme';

export default function MapPlaceSearchControl({
  mapRef,
  cityName = '',
  centerLat,
  centerLng,
  boundaryGeometry = null,
  markerEngine = 'maplibre',
  variant = 'map',
  regionKey = '',
  className = '',
}) {
  const isToolbar = variant === 'toolbar';
  const isMobile = useIsMobileViewport();
  const listId = useId();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const clearMarkers = useCallback(() => {
    clearPlaceMarkers();
  }, []);

  useEffect(() => () => clearMarkers(), [clearMarkers]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    runSearch(term);
  }, [regionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const showOnMap = useCallback(
    (items) => {
      const map = mapRef?.current;
      if (!map || !items.length) return;
      showPlacesOnMap(map, items, { markerEngine });
    },
    [mapRef, markerEngine]
  );

  const runSearch = useCallback(
    async (rawTerm) => {
      const term = String(rawTerm || '').trim();
      if (term.length < 2) {
        setResults([]);
        setMessage('');
        clearMarkers();
        return;
      }

      if (!Number.isFinite(centerLat) || !Number.isFinite(centerLng)) {
        setMessage('مرکز شهر برای جستجو مشخص نیست.');
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const response = await searchMapPlaces({
          term,
          lat: centerLat,
          lng: centerLng,
          cityName,
        });

        if (!response.success) {
          setResults([]);
          clearMarkers();
          setMessage(response.message || 'جستجو انجام نشد.');
          return;
        }

        const filtered = filterPlacesWithinBoundary(response.items, boundaryGeometry);
        setResults(filtered);
        setOpen(true);
        setActiveIndex(-1);

        if (!filtered.length) {
          clearMarkers();
          setMessage(`نتیجه‌ای برای «${term}» در ${cityName || 'این شهر'} پیدا نشد.`);
          return;
        }

        clearMarkers();
        setMessage(
          filtered.length === 1
            ? '۱ نتیجه — «نمایش همه روی نقشه» یا مورد را انتخاب کنید.'
            : `${filtered.length} نتیجه — «نمایش همه روی نقشه» را بزنید یا یک مورد را انتخاب کنید.`
        );
      } catch {
        setResults([]);
        clearMarkers();
        setMessage('خطا در جستجو. دوباره تلاش کنید.');
      } finally {
        setLoading(false);
      }
    },
    [centerLat, centerLng, cityName, boundaryGeometry, clearMarkers]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    runSearch(query);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      setMessage('');
      setOpen(false);
      clearMarkers();
      return;
    }
    debounceRef.current = window.setTimeout(() => runSearch(value), 450);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setMessage('');
    setOpen(false);
    clearMarkers();
    inputRef.current?.focus();
  };

  const handleShowAll = () => {
    if (!results.length) return;
    showOnMap(results);
    setMessage(
      results.length === 1
        ? '۱ مکان روی نقشه نشان داده شد.'
        : `${results.length} مکان روی نقشه نشان داده شد.`
    );
    setOpen(false);
  };

  const handlePickResult = (item) => {
    showOnMap([item]);
    setMessage(`«${item.title}» روی نقشه`);
    setOpen(false);
  };

  const listOptionCount = results.length ? results.length + 1 : 0;

  const handleKeyDown = (event) => {
    if (!open || !listOptionCount) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i < 0 ? 0 : Math.min(i + 1, listOptionCount - 1)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i <= 0 ? 0 : i - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      if (activeIndex === 0) handleShowAll();
      else handlePickResult(results[activeIndex - 1]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const rootClass = isToolbar
    ? `relative w-full min-w-0 ${className}`.trim()
    : `pointer-events-none absolute inset-x-3 top-3 z-[1002] mx-auto max-w-md sm:inset-x-auto sm:start-3 sm:end-auto sm:mx-0 ${className}`.trim();

  const formClass = isToolbar
    ? `flex items-center gap-1.5 ${MAP_FILTER_HEIGHT} w-full rounded-lg border border-gray-200/90 bg-white px-2 shadow-sm ring-0 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20`
    : 'pointer-events-auto flex items-center gap-1.5 rounded-xl border border-gray-200/90 bg-white/98 px-2 py-1.5 shadow-md ring-1 ring-black/5 backdrop-blur-sm';

  const inputClass = isToolbar
    ? `min-w-0 flex-1 border-0 bg-transparent py-0 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${MAP_FILTER_HEIGHT}`
    : 'min-w-0 flex-1 border-0 bg-transparent py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0';

  const listClass = isToolbar
    ? 'absolute inset-x-0 top-[calc(100%+0.35rem)] z-[1005] max-h-[min(40dvh,14rem)] overflow-y-auto overscroll-contain rounded-xl border border-gray-200/90 bg-white py-1 shadow-lg ring-1 ring-black/5'
    : 'pointer-events-auto mt-1.5 max-h-[min(40dvh,14rem)] overflow-y-auto overscroll-contain rounded-xl border border-gray-200/90 bg-white/98 py-1 shadow-lg ring-1 ring-black/5 backdrop-blur-sm';

  return (
    <div className={rootClass}>
      <form onSubmit={handleSubmit} className={formClass} role="search">
        <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length && setOpen(true)}
          placeholder={
            isToolbar
              ? `جستجو بین مراکز ${cityName || 'شهر'}…`
              : isMobile
                ? `جستجو در ${cityName || 'شهر'}…`
                : `مثلاً مسجد — ${cityName || 'شهر'}`
          }
          className={inputClass}
          aria-label="جستجوی مکان روی نقشه"
          aria-expanded={open}
          aria-controls={listId}
          autoComplete="off"
          enterKeyHint="search"
        />
        {loading ? (
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
            aria-hidden
          />
        ) : null}
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="پاک کردن جستجو"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          className={
            isToolbar
              ? 'shrink-0 rounded-md bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-700'
              : 'shrink-0 rounded-lg bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-700'
          }
        >
          جستجو
        </button>
      </form>

      {message ? (
        <p
          className={
            isToolbar
              ? 'mt-1.5 text-[11px] font-medium text-teal-800'
              : 'pointer-events-none mt-1.5 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100'
          }
        >
          {message}
        </p>
      ) : null}

      {open && results.length ? (
        <ul id={listId} role="listbox" className={listClass}>
          <li role="option" aria-selected={activeIndex === 0}>
            <button
              type="button"
              className={`flex w-full items-center gap-2.5 border-b border-teal-100/90 px-3 py-2.5 text-right transition hover:bg-teal-50 ${
                activeIndex === 0 ? 'bg-teal-50' : ''
              }`}
              onClick={handleShowAll}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <MapPinIcon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-teal-900">نمایش همه روی نقشه</span>
                <span className="mt-0.5 block text-[10px] text-teal-700">
                  {results.length === 1 ? '۱ مکان پیدا شد' : `${results.length} مکان پیدا شد`}
                </span>
              </span>
            </button>
          </li>
          {results.map((item, index) => {
            const optionIndex = index + 1;
            return (
              <li key={item.id} role="option" aria-selected={activeIndex === optionIndex}>
                <button
                  type="button"
                  className={`flex w-full flex-col gap-0.5 px-3 py-2 text-right transition hover:bg-gray-50 ${
                    activeIndex === optionIndex ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handlePickResult(item)}
                >
                  <span className="text-xs font-bold text-gray-900">{item.title}</span>
                  {item.address ? (
                    <span className="line-clamp-2 text-[10px] leading-relaxed text-gray-500">
                      {item.address}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
