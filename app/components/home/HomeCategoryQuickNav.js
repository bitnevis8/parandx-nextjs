'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AcademicCapIcon,
  BoltIcon,
  BuildingOffice2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  ComputerDesktopIcon,
  HomeModernIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  ScissorsIcon,
  SparklesIcon,
  Squares2X2Icon,
  SunIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { pickPopularCategories } from '../../config/goodsPopularCategories';

const HEADER_SCROLL_OFFSET = 128;
const SEARCH_MODE = {
  simple: 'simple',
  deep: 'deep',
};

const SEARCH_MODE_HELP = {
  simple: {
    title: 'دسته اصلی',
    body: 'فقط نام دسته‌های سطح اول (مثل پوشاک یا مواد غذایی) را می‌گردد.',
  },
  deep: {
    title: 'شامل زیردسته',
    body: 'زیردسته‌ها را هم پیدا می‌کند؛ مثلاً «کبابی» را نشان می‌دهد و می‌گوید مربوط به کدام دستهٔ اصلی است.',
  },
};

const CATEGORY_ICONS = {
  'building-renovation': BuildingOffice2Icon,
  'facilities-equipment': BoltIcon,
  'home-appliances': HomeModernIcon,
  'automotive-transport': TruckIcon,
  'home-cleaning': SparklesIcon,
  'health-beauty': ScissorsIcon,
  'education-consulting': AcademicCapIcon,
  'technology-digital': ComputerDesktopIcon,
  'agriculture-gardening': SunIcon,
  'other-services': WrenchScrewdriverIcon,
};

function scrollToCategory(slug) {
  const el = document.getElementById(`home-category-${slug}`);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function CategoryIcon({ slug, emoji, useEmojiIcons }) {
  if (useEmojiIcons && emoji) {
    return (
      <span className="text-2xl leading-none sm:text-[1.65rem]" aria-hidden>
        {emoji}
      </span>
    );
  }

  const Icon = CATEGORY_ICONS[slug] || Squares2X2Icon;
  return <Icon className="h-7 w-7 text-teal-600 sm:h-8 sm:w-8" strokeWidth={1.75} aria-hidden />;
}

function CategoryButton({
  category,
  useEmojiIcons,
  hoverRing,
  hoverText,
  focusRing,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (onSelect) onSelect(category);
        else scrollToCategory(category.slug);
      }}
      className={`group flex max-sm:w-[calc((100%-2.25rem)/4.15)] shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg px-0.5 focus:outline-none focus-visible:ring-2 ${focusRing} focus-visible:ring-offset-2 max-sm:min-w-0 sm:w-full sm:min-w-0 sm:shrink sm:gap-2 sm:rounded-xl sm:px-1 sm:py-1`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-200 group-active:scale-95 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-[3.25rem] lg:w-[3.25rem] xl:h-14 xl:w-14 ${hoverRing}`}
      >
        <CategoryIcon slug={category.slug} emoji={category.icon} useEmojiIcons={useEmojiIcons} />
      </span>
      <span
        className={`flex min-h-[2rem] w-full items-center justify-center px-0.5 text-center text-[10px] font-medium leading-snug text-gray-700 line-clamp-2 sm:min-h-[2.35rem] sm:px-1 sm:text-xs lg:text-[10px] xl:text-xs ${hoverText}`}
      >
        {category.title}
      </span>
    </button>
  );
}

function filterMainCategoriesByQuery(categories = [], query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return categories;

  return categories.filter((category) => category.title?.toLowerCase().includes(normalized));
}

function searchCategoriesDeep(categories = [], query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { mains: categories, subs: [] };
  }

  const mains = [];
  const subs = [];

  categories.forEach((category) => {
    if (category.title?.toLowerCase().includes(normalized)) {
      mains.push(category);
      return;
    }

    (category.subcategories || []).forEach((subcategory) => {
      if (subcategory.title?.toLowerCase().includes(normalized)) {
        subs.push({ subcategory, parent: category });
      }
    });
  });

  return { mains, subs };
}

function SubcategoryMatchButton({
  subcategory,
  parent,
  useEmojiIcons,
  hoverRing,
  hoverText,
  focusRing,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (onSelect) onSelect({ subcategory, parent });
        else scrollToCategory(parent.slug);
      }}
      className={`group flex max-sm:w-[calc((100%-2.25rem)/4.15)] shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg px-0.5 focus:outline-none focus-visible:ring-2 ${focusRing} focus-visible:ring-offset-2 max-sm:min-w-0 sm:w-full sm:min-w-0 sm:shrink sm:gap-2 sm:rounded-xl sm:px-1 sm:py-1`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-teal-200 bg-white shadow-sm transition-all duration-200 group-active:scale-95 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-[3.25rem] lg:w-[3.25rem] xl:h-14 xl:w-14 ${hoverRing}`}
      >
        <CategoryIcon
          slug={parent.slug}
          emoji={subcategory.icon || parent.icon}
          useEmojiIcons={useEmojiIcons}
        />
      </span>
      <span className="flex min-h-[2.35rem] w-full flex-col items-center justify-center gap-0.5 px-0.5 sm:min-h-[2.75rem] sm:px-1">
        <span
          className={`w-full text-center text-[10px] font-semibold leading-snug text-gray-800 line-clamp-2 sm:text-xs ${hoverText}`}
        >
          {subcategory.title}
        </span>
        <span className="w-full text-center text-[9px] font-normal leading-snug text-gray-500 line-clamp-2 sm:text-[10px]">
          دستهٔ {parent.title}
        </span>
      </span>
    </button>
  );
}

function SearchModeIconButton({ mode, searchMode, onChange, icon: Icon, label }) {
  const active = searchMode === mode;

  return (
    <button
      type="button"
      onClick={() => onChange(mode)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
        active
          ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/90'
          : 'text-gray-400 hover:bg-gray-50 hover:text-teal-600'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={active ? 2.1 : 1.75} aria-hidden />
    </button>
  );
}

function SearchHelpModeItem({ icon: Icon, title, body, active = false }) {
  return (
    <div className={active ? 'rounded-lg bg-teal-50/70 px-2 py-1.5' : ''}>
      <p className="flex items-center gap-2 text-xs font-bold text-gray-900">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-teal-700 ring-1 ring-teal-200/80">
          <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </span>
        <span>{title}</span>
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function CategorySearchHelp({ searchMode, compact = false }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="راهنمای محدوده جستجو"
        title="راهنما"
        className={`inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
          compact ? 'h-7 w-7' : 'h-8 w-8 rounded-lg border sm:h-9 sm:w-9'
        } ${
          open
            ? compact
              ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/90'
              : 'border-teal-300 bg-teal-50 text-teal-700'
            : compact
              ? 'text-gray-400 hover:bg-gray-50 hover:text-teal-600'
              : 'border-gray-200 bg-white text-gray-500 hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-700'
        }`}
      >
        <QuestionMarkCircleIcon
          className={compact ? 'h-4 w-4' : 'h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]'}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="tooltip"
          className={`absolute z-20 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-xl border border-gray-200 bg-white p-3 text-right shadow-lg ring-1 ring-gray-100 ${
            compact ? 'left-0 top-full' : 'left-1/2 top-full -translate-x-1/2'
          }`}
        >
          <SearchHelpModeItem
            icon={Squares2X2Icon}
            title={SEARCH_MODE_HELP.simple.title}
            body={SEARCH_MODE_HELP.simple.body}
            active={searchMode === SEARCH_MODE.simple}
          />
          <div className="my-2.5">
            <SearchHelpModeItem
              icon={RectangleStackIcon}
              title={SEARCH_MODE_HELP.deep.title}
              body={SEARCH_MODE_HELP.deep.body}
              active={searchMode === SEARCH_MODE.deep}
            />
          </div>
          <p className="flex items-center gap-1.5 border-t border-gray-100 pt-2 text-[10px] text-teal-700">
            <span>حالت فعال:</span>
            <span className="inline-flex items-center gap-1 font-semibold">
              {searchMode === SEARCH_MODE.deep ? (
                <>
                  <RectangleStackIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  {SEARCH_MODE_HELP.deep.title}
                </>
              ) : (
                <>
                  <Squares2X2Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  {SEARCH_MODE_HELP.simple.title}
                </>
              )}
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

function CategoryQuickNavSearch({
  value,
  onChange,
  searchMode,
  onSearchModeChange,
  resultSummary,
}) {
  const inputRef = useRef(null);
  const placeholder =
    searchMode === SEARCH_MODE.deep
      ? 'نام دسته یا زیردسته…'
      : 'نام دسته اصلی…';

  return (
    <div className="mx-auto mb-4 max-w-md animate-in fade-in slide-in-from-top-1 duration-200 sm:mb-5">
      <label htmlFor="category-quick-nav-search" className="sr-only">
        جستجو در دسته‌ها
      </label>
      <div
        dir="rtl"
        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white py-1 pe-1.5 ps-2.5 shadow-sm transition-colors focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20 sm:gap-1.5 sm:pe-2 sm:ps-3"
      >
        <MagnifyingGlassIcon
          className="h-4 w-4 shrink-0 text-teal-500/85"
          aria-hidden
        />
        <input
          ref={inputRef}
          id="category-quick-nav-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
        />
        <div
          className="flex shrink-0 items-center gap-0.5 border-s border-gray-100 ps-1.5 sm:gap-1 sm:ps-2"
          role="group"
          aria-label="محدوده جستجو"
        >
          <SearchModeIconButton
            mode={SEARCH_MODE.simple}
            searchMode={searchMode}
            onChange={onSearchModeChange}
            icon={Squares2X2Icon}
            label="دسته اصلی"
          />
          <SearchModeIconButton
            mode={SEARCH_MODE.deep}
            searchMode={searchMode}
            onChange={onSearchModeChange}
            icon={RectangleStackIcon}
            label="شامل زیردسته"
          />
          <CategorySearchHelp searchMode={searchMode} compact />
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
              aria-label="پاک کردن جستجو"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      {value.trim() && resultSummary ? (
        <p className="mt-1.5 text-center text-[11px] text-gray-500 sm:text-xs">{resultSummary}</p>
      ) : null}
    </div>
  );
}

function ExpandCategoryTab({ expanded, onToggle, isAmber }) {
  const label = expanded ? 'نمایش کمتر' : 'نمایش بیشتر';
  const Icon = expanded ? ChevronUpIcon : ChevronDownIcon;

  const iconClass = isAmber
    ? 'text-amber-600 group-hover:text-teal-600'
    : 'text-teal-600 group-hover:text-teal-700';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="group absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-0.5 bg-transparent px-1 py-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 sm:gap-1"
    >
      <span
        className="rounded-t-md border border-b-0 border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium leading-snug text-gray-700 shadow-[0_-2px_6px_rgba(15,23,42,0.06)] transition-colors group-hover:border-teal-200 group-hover:text-teal-700 group-hover:shadow-[0_-3px_10px_rgba(20,184,166,0.18)] sm:rounded-t-lg sm:px-3 sm:py-1 sm:text-xs"
      >
        {label}
      </span>
      <Icon
        className={`h-4 w-4 motion-safe:animate-bounce transition-colors sm:h-[1.125rem] sm:w-[1.125rem] ${iconClass}`}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}

export default function HomeCategoryQuickNav({
  categories = [],
  useEmojiIcons = false,
  popularSlugs = null,
  expandable = false,
  accent = 'teal',
  onSelectCategory = null,
  onSelectSubcategory = null,
  className = '',
}) {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.deep);

  const popularCategories = useMemo(
    () => (popularSlugs ? pickPopularCategories(categories, popularSlugs) : []),
    [categories, popularSlugs]
  );

  useEffect(() => {
    if (!expanded) setSearchQuery('');
  }, [expanded]);

  const isAmber = accent === 'amber';
  const canExpand = expandable && popularCategories.length > 0 && categories.length > popularCategories.length;
  const baseCategories = canExpand && !expanded ? popularCategories : categories;

  const deepSearchResults = useMemo(
    () => searchCategoriesDeep(baseCategories, searchQuery),
    [baseCategories, searchQuery]
  );

  const simpleSearchResults = useMemo(
    () => filterMainCategoriesByQuery(baseCategories, searchQuery),
    [baseCategories, searchQuery]
  );

  const hasActiveSearch = expanded && Boolean(searchQuery.trim());
  const isDeepMode = searchMode === SEARCH_MODE.deep;
  const deepResultCount = deepSearchResults.mains.length + deepSearchResults.subs.length;
  const simpleResultCount = simpleSearchResults.length;
  const hasVisibleResults = isDeepMode
    ? !hasActiveSearch || deepResultCount > 0
    : !hasActiveSearch || simpleResultCount > 0;

  const resultSummary = useMemo(() => {
    if (!hasActiveSearch) return '';

    if (isDeepMode) {
      if (deepResultCount === 0) return 'موردی پیدا نشد';
      const parts = [];
      if (deepSearchResults.mains.length > 0) {
        parts.push(`${deepSearchResults.mains.length} دسته اصلی`);
      }
      if (deepSearchResults.subs.length > 0) {
        parts.push(`${deepSearchResults.subs.length} زیرمجموعه`);
      }
      return parts.join(' · ');
    }

    if (simpleResultCount === 0) return 'موردی پیدا نشد';
    return `${simpleResultCount} دسته اصلی`;
  }, [deepResultCount, deepSearchResults, hasActiveSearch, isDeepMode, simpleResultCount]);

  const visibleMainCategories = useMemo(() => {
    if (!hasActiveSearch) return baseCategories;
    return isDeepMode ? deepSearchResults.mains : simpleSearchResults;
  }, [baseCategories, deepSearchResults.mains, hasActiveSearch, isDeepMode, simpleSearchResults]);

  if (!categories.length) return null;

  const gridClass =
    'flex flex-nowrap items-start gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-4 px-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-x-3 sm:gap-y-5 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-10 lg:gap-x-2 xl:gap-x-4 lg:gap-y-4';

  const hoverRing = isAmber
    ? 'group-hover:border-amber-300 group-hover:bg-amber-50'
    : 'group-hover:border-teal-300 group-hover:bg-teal-50 group-hover:shadow-md';
  const hoverText = isAmber ? 'group-hover:text-amber-800' : 'group-hover:text-teal-700';
  const focusRing = isAmber ? 'focus-visible:ring-amber-500' : 'focus-visible:ring-teal-500';

  const handleToggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className={`w-full sm:px-0 ${className}`.trim()}>
      {expanded && canExpand ? (
        <CategoryQuickNavSearch
          value={searchQuery}
          onChange={setSearchQuery}
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          resultSummary={resultSummary}
        />
      ) : null}

      <div className={gridClass} dir="rtl">
        {hasVisibleResults ? (
          <>
            {visibleMainCategories.map((category) => (
              <CategoryButton
                key={`main-${category.id}`}
                category={category}
                useEmojiIcons={useEmojiIcons}
                hoverRing={hoverRing}
                hoverText={hoverText}
                focusRing={focusRing}
                onSelect={onSelectCategory}
              />
            ))}
            {hasActiveSearch && isDeepMode
              ? deepSearchResults.subs.map(({ subcategory, parent }) => (
                  <SubcategoryMatchButton
                    key={`sub-${subcategory.id}`}
                    subcategory={subcategory}
                    parent={parent}
                    useEmojiIcons={useEmojiIcons}
                    hoverRing={hoverRing}
                    hoverText={hoverText}
                    focusRing={focusRing}
                    onSelect={onSelectSubcategory}
                  />
                ))
              : null}
          </>
        ) : (
          <p className="col-span-full w-full py-6 text-center text-sm text-gray-500 sm:col-span-5 lg:col-span-10">
            {isDeepMode ? 'دسته یا زیرمجموعه‌ای' : 'دسته اصلی‌ای'} با «{searchQuery.trim()}» پیدا نشد —
            عبارت دیگری امتحان کنید یا محدوده جستجو را عوض کنید.
          </p>
        )}
      </div>

      {canExpand ? (
        <ExpandCategoryTab
          expanded={expanded}
          onToggle={handleToggleExpand}
          isAmber={isAmber}
        />
      ) : null}
    </div>
  );
}
