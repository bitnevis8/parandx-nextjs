'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import {
  MAP_PLACE_CATEGORIES,
  MAP_PLACE_CATEGORY_TONE_STYLES,
  resolvePlaceCategoryIcon,
} from '../../utils/mapPlaceCategories';
import { filterPlacesWithinBoundary, clearPlaceMarkers, showPlacesOnMap } from '../../utils/mapPlaceMarkers';
import { searchMapPlacesForSubCategory } from '../../utils/mapPlaceSearch';

const SCROLLBAR_HIDE =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
const ALL_SUBS_LOADING = '__all__';

function CategoryIconButton({
  iconName,
  label,
  tone = 'teal',
  active = false,
  loading = false,
  onClick,
}) {
  const styles = MAP_PLACE_CATEGORY_TONE_STYLES[tone] || MAP_PLACE_CATEGORY_TONE_STYLES.teal;
  const Icon = resolvePlaceCategoryIcon(iconName);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`group flex w-full min-w-0 flex-col items-center gap-1.5 rounded-2xl border p-2 text-center transition touch-manipulation active:scale-[0.97] sm:p-2.5 ${
        active
          ? `${styles.active} shadow-sm ring-2`
          : 'border-gray-200/90 bg-white hover:border-gray-300 hover:bg-gray-50/80'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/[0.04] sm:h-12 sm:w-12 ${
          active ? styles.activeIcon : styles.icon
        }`}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" aria-hidden />
        )}
      </span>
      <span
        className={`line-clamp-2 w-full text-[10px] font-bold leading-tight sm:text-[11px] ${
          active ? 'text-gray-900' : 'text-gray-800'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function CategoryScroller({ sub = false, children }) {
  return (
    <div
      className={`-mx-3 px-3 overflow-x-auto overscroll-x-contain ${SCROLLBAR_HIDE} sm:mx-0 sm:overflow-visible sm:px-0`}
    >
      <div
        className={`flex w-max min-w-full snap-x snap-mandatory gap-2 pb-0.5 sm:grid sm:w-full sm:snap-none sm:gap-2 ${
          sub
            ? 'sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'
            : 'sm:grid-cols-5 md:grid-cols-7'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function CategoryCell({ children }) {
  return (
    <div className="w-[4.85rem] shrink-0 snap-start sm:w-auto sm:shrink">{children}</div>
  );
}

function attachSubCategory(place, subItem, tone) {
  return {
    ...place,
    subCategory: {
      icon: subItem.icon,
      title: subItem.title,
      tone,
    },
  };
}

export default function MapPlaceCategoryPanel({
  mapRef,
  cityName = '',
  centerLat,
  centerLng,
  boundaryGeometry = null,
  markerEngine = 'maplibre',
  regionKey = '',
  compact = false,
  onStatusChange = null,
}) {
  const [mainCategoryId, setMainCategoryId] = useState('');
  const [activeSubId, setActiveSubId] = useState('');
  const [loadingSubId, setLoadingSubId] = useState('');
  const searchGenRef = useRef(0);

  const mainCategory = useMemo(
    () => MAP_PLACE_CATEGORIES.find((item) => item.id === mainCategoryId) || null,
    [mainCategoryId]
  );

  const runMainCategorySearch = useCallback(
    async (category) => {
      const map = mapRef?.current;
      if (!map) {
        onStatusChange?.('نقشه هنوز آماده نیست.');
        return false;
      }
      if (!category?.items?.length) return false;

      if (!Number.isFinite(centerLat) || !Number.isFinite(centerLng)) {
        onStatusChange?.('مرکز شهر برای جستجو مشخص نیست.');
        return false;
      }

      const gen = ++searchGenRef.current;
      setLoadingSubId(ALL_SUBS_LOADING);
      setActiveSubId('');
      onStatusChange?.(`در حال بارگذاری «${category.title}» روی نقشه…`);

      try {
        const batches = await Promise.all(
          category.items.map(async (subItem) => {
            try {
              const response = await searchMapPlacesForSubCategory({
                subItem,
                lat: centerLat,
                lng: centerLng,
                cityName,
                categoryId: category.id,
              });

              if (!response.success || !response.items?.length) return [];

              return filterPlacesWithinBoundary(response.items, boundaryGeometry).map((place) =>
                attachSubCategory(place, subItem, category.tone)
              );
            } catch {
              return [];
            }
          })
        );

        if (gen !== searchGenRef.current) return false;

        const merged = [];
        const seen = new Set();
        batches.flat().forEach((place) => {
          const key = `${place.lat.toFixed(5)}|${place.lng.toFixed(5)}`;
          if (seen.has(key)) return;
          seen.add(key);
          merged.push(place);
        });

        if (!merged.length) {
          onStatusChange?.(`«${category.title}» در ${cityName || 'این منطقه'} پیدا نشد.`);
          clearPlaceMarkers();
          return false;
        }

        showPlacesOnMap(map, merged, { markerEngine });
        onStatusChange?.(
          `${merged.length} مکان از ${category.items.length} زیردسته «${category.title}» روی نقشه`
        );
        return true;
      } catch {
        if (gen === searchGenRef.current) {
          onStatusChange?.('خطا در جستجو. دوباره تلاش کنید.');
        }
        return false;
      } finally {
        if (gen === searchGenRef.current) {
          setLoadingSubId('');
        }
      }
    },
    [mapRef, centerLat, centerLng, cityName, boundaryGeometry, markerEngine, onStatusChange]
  );

  const runSubCategorySearch = useCallback(
    async (subItem, category) => {
      const map = mapRef?.current;
      if (!map) {
        onStatusChange?.('نقشه هنوز آماده نیست.');
        return;
      }

      if (!Number.isFinite(centerLat) || !Number.isFinite(centerLng)) {
        onStatusChange?.('مرکز شهر برای جستجو مشخص نیست.');
        return;
      }

      const gen = ++searchGenRef.current;
      setLoadingSubId(subItem.id);
      setActiveSubId(subItem.id);
      onStatusChange?.(`در حال جستجوی «${subItem.title}»…`);

      try {
        const response = await searchMapPlacesForSubCategory({
          subItem,
          lat: centerLat,
          lng: centerLng,
          cityName,
          categoryId: category.id,
        });

        if (gen !== searchGenRef.current) return;

        if (!response.success) {
          onStatusChange?.(response.message || 'جستجو انجام نشد.');
          return;
        }

        const filtered = filterPlacesWithinBoundary(response.items, boundaryGeometry).map((place) =>
          attachSubCategory(place, subItem, category.tone)
        );

        if (!filtered.length) {
          onStatusChange?.(`«${subItem.title}» در ${cityName || 'این منطقه'} پیدا نشد.`);
          clearPlaceMarkers();
          return;
        }

        showPlacesOnMap(map, filtered, { markerEngine });
        onStatusChange?.(
          filtered.length === 1
            ? `۱ ${subItem.title} در ${category.title} روی نقشه`
            : `${filtered.length} ${subItem.title} در ${category.title} روی نقشه`
        );
      } catch {
        if (gen === searchGenRef.current) {
          onStatusChange?.('خطا در جستجو. دوباره تلاش کنید.');
        }
      } finally {
        if (gen === searchGenRef.current) {
          setLoadingSubId('');
        }
      }
    },
    [mapRef, centerLat, centerLng, cityName, boundaryGeometry, markerEngine, onStatusChange]
  );

  const handleSelectMainCategory = useCallback(
    (categoryId) => {
      searchGenRef.current += 1;
      clearPlaceMarkers();
      setMainCategoryId(categoryId);
      setActiveSubId('');
      setLoadingSubId('');
      const category = MAP_PLACE_CATEGORIES.find((item) => item.id === categoryId);
      onStatusChange?.(
        category
          ? `«${category.title}» — یک زیردسته بزنید یا همه را روی نقشه جستجو کنید.`
          : 'زیردسته را انتخاب کنید.'
      );
    },
    [onStatusChange]
  );

  const handleSearchAllSubcategories = useCallback(() => {
    if (!mainCategory || loadingSubId === ALL_SUBS_LOADING) return;
    runMainCategorySearch(mainCategory);
  }, [mainCategory, loadingSubId, runMainCategorySearch]);

  const handleBackToMain = useCallback(() => {
    searchGenRef.current += 1;
    clearPlaceMarkers();
    setMainCategoryId('');
    setActiveSubId('');
    setLoadingSubId('');
    onStatusChange?.('دسته اصلی را انتخاب کنید');
  }, [onStatusChange]);

  useEffect(() => {
    setActiveSubId('');
    setLoadingSubId('');
    if (mainCategoryId) {
      clearPlaceMarkers();
    }
  }, [regionKey, mainCategoryId]);

  const loadingAll = loadingSubId === ALL_SUBS_LOADING;

  return (
    <div
      className={`border-t border-gray-200/90 bg-gradient-to-b from-slate-50/90 to-white ${
        compact
          ? 'max-h-[min(44dvh,22rem)] overflow-y-auto overscroll-contain'
          : 'max-h-[min(52dvh,28rem)] overflow-y-auto overscroll-contain sm:max-h-none'
      }`}
    >
      <div className="sticky top-0 z-10 border-b border-gray-100/80 bg-white/90 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900">دسته مراکز</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
              {mainCategory
                ? loadingAll
                  ? `در حال جستجوی همه زیردسته‌های «${mainCategory.title}»…`
                  : `«${mainCategory.title}» — زیردسته را بزنید یا همه را روی نقشه جستجو کنید`
                : 'دسته اصلی را انتخاب کنید'}
            </p>
          </div>
          {mainCategory ? (
            <button
              type="button"
              onClick={handleBackToMain}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-bold text-gray-700 transition hover:border-teal-200 hover:text-teal-800 active:scale-[0.98]"
            >
              <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
              بازگشت
            </button>
          ) : null}
        </div>

        {mainCategory ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                MAP_PLACE_CATEGORY_TONE_STYLES[mainCategory.tone]?.chip ||
                MAP_PLACE_CATEGORY_TONE_STYLES.teal.chip
              }`}
            >
              {(() => {
                const MainIcon = resolvePlaceCategoryIcon(mainCategory.icon);
                return <MainIcon className="h-3.5 w-3.5" aria-hidden />;
              })()}
              {mainCategory.title}
            </span>
            <button
              type="button"
              onClick={handleSearchAllSubcategories}
              disabled={loadingAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingAll ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
              ) : (
                <MapPinIcon className="h-3.5 w-3.5" aria-hidden />
              )}
              جستجوی همه زیردسته‌ها روی نقشه
            </button>
          </div>
        ) : null}
      </div>

      <div className="px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4">
        {!mainCategory ? (
          <CategoryScroller>
            {MAP_PLACE_CATEGORIES.map((category) => (
              <CategoryCell key={category.id}>
                <CategoryIconButton
                  iconName={category.icon}
                  label={category.title}
                  tone={category.tone}
                  onClick={() => handleSelectMainCategory(category.id)}
                />
              </CategoryCell>
            ))}
          </CategoryScroller>
        ) : (
          <CategoryScroller sub>
            {mainCategory.items.map((subItem) => (
              <CategoryCell key={subItem.id}>
                <CategoryIconButton
                  iconName={subItem.icon}
                  label={subItem.title}
                  tone={mainCategory.tone}
                  active={activeSubId === subItem.id}
                  loading={loadingSubId === subItem.id}
                  onClick={() => runSubCategorySearch(subItem, mainCategory)}
                />
              </CategoryCell>
            ))}
          </CategoryScroller>
        )}
      </div>
    </div>
  );
}
