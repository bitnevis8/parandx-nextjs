'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import GoodsMapCategorySearch from './GoodsMapCategorySearch';
import {
  buildCategorySearchSummary,
  searchCategoriesDeep,
} from './goodsCategorySearchUtils';
import { GOODS_MAP_TOOLBAR, GOODS_MAP_TOOLBAR_PAD } from '../home/mapFilterTheme';

const SCROLLBAR_HIDE =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const SCROLL_STEP = 320;
const MAIN_ICON_SIZE = 'h-11 w-11 sm:h-12 sm:w-12';
const MAIN_TILE_WIDTH = 'w-[4.25rem] sm:w-[4.65rem] md:w-[5rem] lg:w-[5.35rem]';

const GOODS_TONES = ['teal', 'amber', 'violet', 'rose', 'sky', 'emerald'];

const TONE_STYLES = {
  teal: {
    active: 'border-teal-400 bg-teal-50 text-teal-900 ring-teal-200/80',
    chip: 'bg-teal-50 text-teal-800 ring-teal-200/80',
    icon: 'border-gray-200/90 bg-white hover:border-teal-200 hover:bg-teal-50/80',
    iconActive: 'border-teal-400 bg-teal-50 ring-2 ring-teal-200/80 shadow-sm',
  },
  amber: {
    active: 'border-amber-400 bg-amber-50 text-amber-900 ring-amber-200/80',
    chip: 'bg-amber-50 text-amber-800 ring-amber-200/80',
    icon: 'border-gray-200/90 bg-white hover:border-amber-200 hover:bg-amber-50/80',
    iconActive: 'border-amber-400 bg-amber-50 ring-2 ring-amber-200/80 shadow-sm',
  },
  violet: {
    active: 'border-violet-400 bg-violet-50 text-violet-900 ring-violet-200/80',
    chip: 'bg-violet-50 text-violet-800 ring-violet-200/80',
    icon: 'border-gray-200/90 bg-white hover:border-violet-200 hover:bg-violet-50/80',
    iconActive: 'border-violet-400 bg-violet-50 ring-2 ring-violet-200/80 shadow-sm',
  },
  rose: {
    active: 'border-rose-400 bg-rose-50 text-rose-900 ring-rose-200/80',
    chip: 'bg-rose-50 text-rose-800 ring-rose-200/80',
    icon: 'border-gray-200/90 bg-white hover:border-rose-200 hover:bg-rose-50/80',
    iconActive: 'border-rose-400 bg-rose-50 ring-2 ring-rose-200/80 shadow-sm',
  },
  sky: {
    active: 'border-sky-400 bg-sky-50 text-sky-900 ring-sky-200/80',
    chip: 'bg-sky-50 text-sky-800 ring-sky-200/80',
    icon: 'border-gray-200/90 bg-white hover:border-sky-200 hover:bg-sky-50/80',
    iconActive: 'border-sky-400 bg-sky-50 ring-2 ring-sky-200/80 shadow-sm',
  },
  emerald: {
    active: 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-emerald-200/80',
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
    icon: 'border-gray-200/90 bg-white hover:border-emerald-200 hover:bg-emerald-50/80',
    iconActive: 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200/80 shadow-sm',
  },
};

function getNormalizedScrollLeft(el) {
  if (!el) return 0;
  const { scrollLeft, scrollWidth, clientWidth } = el;
  const isRtl = getComputedStyle(el).direction === 'rtl';
  if (!isRtl) return scrollLeft;
  if (scrollLeft < 0) return -scrollLeft;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  return maxScroll - scrollLeft;
}

function getScrollState(el) {
  if (!el) return { canScroll: false, canPrev: false, canNext: false };
  const overflow = el.scrollWidth - el.clientWidth;
  const canScroll = overflow > 16;
  if (!canScroll) {
    return { canScroll: false, canPrev: false, canNext: false };
  }
  const maxScroll = overflow;
  const offset = getNormalizedScrollLeft(el);
  return {
    canScroll: true,
    canPrev: offset > 8,
    canNext: offset < maxScroll - 8,
  };
}

function setNormalizedScrollLeft(el, offset) {
  if (!el) return;
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
  const clamped = Math.max(0, Math.min(maxScroll, offset));
  const isRtl = getComputedStyle(el).direction === 'rtl';

  if (isRtl) {
    if (el.scrollLeft <= 0) {
      el.scrollTo({ left: -clamped, behavior: 'smooth' });
      return;
    }
    el.scrollTo({ left: maxScroll - clamped, behavior: 'smooth' });
    return;
  }

  el.scrollTo({ left: clamped, behavior: 'smooth' });
}

function scrollElementHorizontally(el, direction) {
  if (!el) return;
  setNormalizedScrollLeft(el, getNormalizedScrollLeft(el) + direction * SCROLL_STEP);
}

function normalizeGoodsCategories(categories = []) {
  return categories.map((category, index) => ({
    id: String(category.id),
    title: category.title,
    slug: category.slug,
    icon: category.icon || '🛍️',
    tone: GOODS_TONES[index % GOODS_TONES.length],
    items: (category.subcategories || []).map((sub) => ({
      id: String(sub.id),
      title: sub.title,
      slug: sub.slug,
      icon: sub.icon || category.icon || '🏪',
    })),
  }));
}

function NavCategoryLabeledTile({
  emoji,
  label,
  active = false,
  tone = 'teal',
  onClick,
  subtitle = '',
}) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.teal;

  return (
    <button
      type="button"
      onClick={onClick}
      title={subtitle ? `${label} · ${subtitle}` : label}
      aria-label={subtitle ? `${label} · ${subtitle}` : label}
      className={`group flex ${MAIN_TILE_WIDTH} shrink-0 snap-start flex-col items-center gap-1 px-0.5 py-0.5 text-center transition touch-manipulation active:scale-[0.97]`}
    >
      <span
        className={`inline-flex ${MAIN_ICON_SIZE} items-center justify-center rounded-full border text-xl shadow-sm transition group-hover:shadow-md sm:text-2xl ${
          active ? styles.iconActive : styles.icon
        }`}
        aria-hidden
      >
        {emoji}
      </span>
      <span
        className={`flex min-h-[1.85rem] w-full items-start justify-center text-[9px] font-medium leading-snug line-clamp-2 sm:min-h-[2rem] sm:text-[10px] ${
          active ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
        }`}
      >
        {label}
      </span>
      {subtitle ? (
        <span className="-mt-0.5 w-full text-[8px] font-normal leading-snug text-gray-500 line-clamp-1 sm:text-[9px]">{subtitle}</span>
      ) : null}
    </button>
  );
}

function NavCategoryScrollRow({
  children,
  itemCount = 0,
  className = '',
  twoRows = false,
  twoRowsWhenNarrow = false,
}) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    canPrev: false,
    canNext: false,
  });

  const updateScrollState = useCallback(() => {
    setScrollState(getScrollState(scrollRef.current));
  }, []);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      updateScrollState();
      raf2 = requestAnimationFrame(updateScrollState);
    });

    const el = scrollRef.current;
    if (!el) {
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    const inner = el.firstElementChild;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null;
    observer?.observe(el);
    if (inner) observer?.observe(inner);

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      observer?.disconnect();
    };
  }, [itemCount, updateScrollState]);

  const scrollByStep = (direction) => {
    scrollElementHorizontally(scrollRef.current, direction);
  };

  const arrowClass =
    'pointer-events-auto absolute z-[2] flex h-7 w-7 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-amber-700 shadow-md backdrop-blur-sm transition hover:border-amber-200 hover:bg-amber-50 sm:h-8 sm:w-8';

  return (
    <div className={`relative w-full min-w-0 ${className}`.trim()}>
      {scrollState.canScroll && scrollState.canPrev ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-10"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            className={`${arrowClass} right-0.5 top-1/2 -translate-y-1/2 sm:right-1`}
            aria-label="دسته‌های قبلی"
          >
            <ChevronRightIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.5} aria-hidden />
          </button>
        </>
      ) : null}

      {scrollState.canScroll && scrollState.canNext ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-10"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            className={`${arrowClass} left-0.5 top-1/2 -translate-y-1/2 sm:left-1`}
            aria-label="دسته‌های بعدی"
          >
            <ChevronLeftIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.5} aria-hidden />
          </button>
        </>
      ) : null}

      <div
        ref={scrollRef}
        className={`overflow-x-auto overscroll-x-contain scroll-smooth px-1 py-0.5 sm:px-2 ${SCROLLBAR_HIDE}`}
        dir="rtl"
      >
        {twoRowsWhenNarrow ? (
          <div className="grid w-max grid-flow-col grid-rows-2 items-start gap-x-1 gap-y-0.5 sm:grid-rows-1 sm:gap-x-1.5 sm:gap-y-0 md:gap-x-2">
            {children}
          </div>
        ) : twoRows ? (
          <div className="grid w-max grid-flow-col grid-rows-2 items-start gap-x-1 gap-y-0.5 sm:gap-x-1.5 sm:gap-y-1 md:gap-x-2">
            {children}
          </div>
        ) : (
          <div className="flex w-max items-start gap-1.5 sm:gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}

const GOODS_MAP_OPEN_SEARCH_EVENT = 'goods-map-open-search';

function GoodsMapToolbarRow({ layerToolbar, searchControl, regionFilters, flushTop = false }) {
  if (!layerToolbar && !searchControl && !regionFilters) return null;

  return (
    <div
      id="home-path-search"
      className={`${GOODS_MAP_TOOLBAR} ${GOODS_MAP_TOOLBAR_PAD} scroll-mt-28 md:scroll-mt-32 ${
        flushTop ? 'rounded-t-2xl' : ''
      }`}
      dir="rtl"
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {layerToolbar ? (
          <div className="min-w-0 shrink-0 sm:max-w-[14rem]">{layerToolbar}</div>
        ) : null}
        {searchControl ? searchControl : null}
        {regionFilters ? (
          <div className="flex min-w-0 max-w-[min(100%,20rem)] shrink gap-1.5 sm:gap-2">
            {regionFilters}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CategoryDrilldownHeader({ mainCategory, onBack }) {
  return (
    <div className="border-b border-gray-100 px-2 py-1.5 sm:px-3 sm:py-2">
      <button
        type="button"
        onClick={onBack}
        className="flex w-full min-w-0 items-center gap-1.5 rounded-lg px-1 py-0.5 text-right transition hover:bg-gray-50 active:scale-[0.99]"
        aria-label={`بازگشت از ${mainCategory.title}`}
      >
        <ChevronRightIcon
          className="h-4 w-4 shrink-0 text-gray-500 sm:h-[1.125rem] sm:w-[1.125rem]"
          strokeWidth={2.5}
          aria-hidden
        />
        <span className="text-lg sm:text-xl" aria-hidden>
          {mainCategory.icon}
        </span>
        <span className="truncate text-xs font-bold text-gray-900 sm:text-sm">{mainCategory.title}</span>
      </button>
    </div>
  );
}

function GoodsCategoryNavbar({
  panelCategories,
  mainCategory,
  parentSlug,
  serviceSlug,
  statusDetail,
  showSearch,
  searchQuery,
  setSearchQuery,
  resultSummary,
  hasActiveSearch,
  visibleMainCategories,
  deepSearchResults,
  filteredSubItems,
  hasVisibleResults,
  compact,
  onSelectMainCategory,
  onSelectSubCategory,
  onClearFilters,
  onShowAllSubcategories,
  onBackToMain,
  layerToolbar = null,
  regionFilters = null,
  flushTop = false,
}) {
  const inputId = compact ? 'goods-map-category-search-fullscreen' : 'goods-map-category-search';

  const showDrilldown = Boolean(mainCategory) && !hasActiveSearch && mainCategory.items.length > 0;
  const showSearchResults = hasActiveSearch;

  useEffect(() => {
    const focusSearch = () => {
      window.setTimeout(() => {
        document.getElementById(inputId)?.focus({ preventScroll: true });
      }, 80);
    };
    window.addEventListener(GOODS_MAP_OPEN_SEARCH_EVENT, focusSearch);
    return () => window.removeEventListener(GOODS_MAP_OPEN_SEARCH_EVENT, focusSearch);
  }, [inputId]);

  const renderCategoryStrip = () => {
    if (showSearchResults) {
      const searchItemCount = visibleMainCategories.length + deepSearchResults.subs.length;
      return (
        <NavCategoryScrollRow itemCount={searchItemCount} twoRowsWhenNarrow>
          {hasVisibleResults ? (
            <>
              {visibleMainCategories.map((category) => (
                <NavCategoryLabeledTile
                  key={category.id}
                  emoji={category.icon}
                  label={category.title}
                  tone={category.tone}
                  active={parentSlug === category.slug && !serviceSlug}
                  onClick={() => onSelectMainCategory(category)}
                />
              ))}
              {deepSearchResults.subs.map(({ subcategory, parent }) => (
                <NavCategoryLabeledTile
                  key={`sub-${subcategory.id}`}
                  emoji={subcategory.icon || parent.icon}
                  label={subcategory.title}
                  subtitle={parent.title}
                  tone={parent.tone}
                  active={serviceSlug === subcategory.slug && parentSlug === parent.slug}
                  onClick={() =>
                    onSelectSubCategory(
                      {
                        id: subcategory.id,
                        title: subcategory.title,
                        slug: subcategory.slug,
                        icon: subcategory.icon || parent.icon,
                      },
                      parent
                    )
                  }
                />
              ))}
            </>
          ) : (
            <span className="col-span-full px-2 py-2 text-[11px] text-gray-500">موردی پیدا نشد</span>
          )}
        </NavCategoryScrollRow>
      );
    }

    if (showDrilldown) {
      return (
        <NavCategoryScrollRow itemCount={mainCategory.items.length + 1} twoRowsWhenNarrow>
          <NavCategoryLabeledTile
            emoji={mainCategory.icon}
            label="همه"
            tone={mainCategory.tone}
            active={!serviceSlug}
            onClick={onShowAllSubcategories}
          />
          {filteredSubItems.map((subItem) => (
            <NavCategoryLabeledTile
              key={subItem.id}
              emoji={subItem.icon}
              label={subItem.title}
              tone={mainCategory.tone}
              active={serviceSlug === subItem.slug}
              onClick={() => onSelectSubCategory(subItem, mainCategory)}
            />
          ))}
        </NavCategoryScrollRow>
      );
    }

    return (
      <NavCategoryScrollRow itemCount={panelCategories.length + 1} twoRows>
        <NavCategoryLabeledTile
          emoji="🗺️"
          label="همه"
          tone="amber"
          active={!parentSlug}
          onClick={onClearFilters}
        />
        {panelCategories.map((category) => (
          <NavCategoryLabeledTile
            key={category.id}
            emoji={category.icon}
            label={category.title}
            tone={category.tone}
            active={parentSlug === category.slug && !serviceSlug}
            onClick={() => onSelectMainCategory(category)}
          />
        ))}
      </NavCategoryScrollRow>
    );
  };

  const searchControl =
    showSearch ? (
      <GoodsMapCategorySearch
        variant="toolbar"
        value={searchQuery}
        onChange={setSearchQuery}
        resultSummary={resultSummary}
        inputId={inputId}
      />
    ) : null;

  return (
    <div
      className={`border-b border-gray-200/90 bg-white ${
        flushTop ? 'sticky top-14 z-30 sm:top-16' : ''
      }`}
    >
      <GoodsMapToolbarRow
        layerToolbar={layerToolbar}
        searchControl={searchControl}
        regionFilters={regionFilters}
        flushTop={flushTop}
      />

      {statusDetail && !flushTop ? (
        <p className="truncate border-b border-gray-50 bg-gray-50/40 px-3 py-1 text-[10px] text-gray-500 sm:px-4">
          {statusDetail}
        </p>
      ) : null}

      <div id="home-path-categories" className={flushTop ? '' : 'scroll-mt-28 md:scroll-mt-32'}>
        {showDrilldown ? (
          <CategoryDrilldownHeader mainCategory={mainCategory} onBack={onBackToMain} />
        ) : null}
        <div className="px-1 py-1 sm:px-1.5 sm:py-1.5">{renderCategoryStrip()}</div>
      </div>
    </div>
  );
}

export default function MapGoodsCategoryPanel({
  categories = [],
  parentSlug = '',
  serviceSlug = '',
  onParentChange,
  onServiceChange,
  statusDetail = '',
  compact = false,
  position = 'belowMap',
  showSearch = true,
  layerToolbar = null,
  regionFilters = null,
  flushTop = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const panelCategories = useMemo(() => normalizeGoodsCategories(categories), [categories]);

  const mainCategory = useMemo(
    () => panelCategories.find((item) => item.slug === parentSlug) || null,
    [panelCategories, parentSlug]
  );

  const handleSelectMainCategory = useCallback(
    (category) => {
      setSearchQuery('');
      onParentChange?.(category.slug);
      onServiceChange?.('');
    },
    [onParentChange, onServiceChange]
  );

  const handleSelectSubCategory = useCallback(
    (subItem, category) => {
      setSearchQuery('');
      onParentChange?.(category.slug);
      onServiceChange?.(subItem.slug);
    },
    [onParentChange, onServiceChange]
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    onParentChange?.('');
    onServiceChange?.('');
  }, [onParentChange, onServiceChange]);

  const handleShowAllSubcategories = useCallback(() => {
    if (!mainCategory) return;
    onParentChange?.(mainCategory.slug);
    onServiceChange?.('');
  }, [mainCategory, onParentChange, onServiceChange]);

  const handleBackToMain = useCallback(() => {
    setSearchQuery('');
    onParentChange?.('');
    onServiceChange?.('');
  }, [onParentChange, onServiceChange]);

  const hasActiveSearch = Boolean(searchQuery.trim());

  const deepSearchResults = useMemo(
    () => searchCategoriesDeep(panelCategories, searchQuery),
    [panelCategories, searchQuery]
  );

  const filteredSubItems = useMemo(() => {
    if (!mainCategory) return [];
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return mainCategory.items;
    return mainCategory.items.filter((item) => item.title?.toLowerCase().includes(normalized));
  }, [mainCategory, searchQuery]);

  const resultSummary = useMemo(
    () =>
      buildCategorySearchSummary({
        query: searchQuery,
        deepResults: deepSearchResults,
      }),
    [searchQuery, deepSearchResults]
  );

  const visibleMainCategories = useMemo(() => {
    if (!hasActiveSearch || mainCategory) return panelCategories;
    return deepSearchResults.mains;
  }, [hasActiveSearch, mainCategory, panelCategories, deepSearchResults.mains]);

  const hasVisibleResults = mainCategory
    ? !hasActiveSearch || filteredSubItems.length > 0
    : !hasActiveSearch || deepSearchResults.mains.length + deepSearchResults.subs.length > 0;

  const isNavbar = position === 'aboveMap' || compact;
  const isAboveMap = position === 'aboveMap';

  if (!panelCategories.length) {
    return (
      <div
        className={`px-4 py-3 text-center text-sm text-gray-500 ${
          isAboveMap ? 'border-b border-gray-200/90' : 'border-t border-gray-200/90'
        }`}
      >
        دسته‌بندی کالا برای این شهر در دسترس نیست.
      </div>
    );
  }

  if (isNavbar) {
    return (
      <div>
        <GoodsCategoryNavbar
          panelCategories={panelCategories}
          mainCategory={mainCategory}
          parentSlug={parentSlug}
          serviceSlug={serviceSlug}
          statusDetail={statusDetail}
          showSearch={showSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultSummary={hasActiveSearch ? resultSummary : ''}
          hasActiveSearch={hasActiveSearch}
          visibleMainCategories={visibleMainCategories}
          deepSearchResults={deepSearchResults}
          filteredSubItems={filteredSubItems}
          hasVisibleResults={hasVisibleResults}
          compact={compact}
          onSelectMainCategory={handleSelectMainCategory}
          onSelectSubCategory={handleSelectSubCategory}
          onClearFilters={handleClearFilters}
          onShowAllSubcategories={handleShowAllSubcategories}
          onBackToMain={handleBackToMain}
          layerToolbar={layerToolbar}
          regionFilters={regionFilters}
          flushTop={flushTop}
        />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200/90 bg-white">
      <GoodsCategoryNavbar
        panelCategories={panelCategories}
        mainCategory={mainCategory}
        parentSlug={parentSlug}
        serviceSlug={serviceSlug}
        statusDetail={statusDetail}
        showSearch={showSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultSummary={hasActiveSearch ? resultSummary : ''}
        hasActiveSearch={hasActiveSearch}
        visibleMainCategories={visibleMainCategories}
        deepSearchResults={deepSearchResults}
        filteredSubItems={filteredSubItems}
        hasVisibleResults={hasVisibleResults}
        compact={false}
        onSelectMainCategory={handleSelectMainCategory}
        onSelectSubCategory={handleSelectSubCategory}
        onClearFilters={handleClearFilters}
        onShowAllSubcategories={handleShowAllSubcategories}
        onBackToMain={handleBackToMain}
        layerToolbar={layerToolbar}
        regionFilters={regionFilters}
        flushTop={flushTop}
      />
    </div>
  );
}

export { GOODS_MAP_OPEN_SEARCH_EVENT };
