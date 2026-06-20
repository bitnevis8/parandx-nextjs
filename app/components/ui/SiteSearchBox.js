'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useCity } from '../../context/CityContext';
import { useSiteSearchIndex } from '../../hooks/useSiteSearchIndex';

function normalizeForSearch(text) {
  if (text == null) return '';
  return String(text).trim().replace(/\s+/g, ' ');
}

function matchesQuery(text, q) {
  const a = normalizeForSearch(text);
  const b = normalizeForSearch(q);
  if (!b) return true;
  return a.includes(b) || a.replace(/\s/g, '').includes(b.replace(/\s/g, ''));
}

const SUGGESTION_CATEGORY_LIMIT = 6;
const SUGGESTION_EXPERT_LIMIT = 5;

function CityPickerSegment({
  citySelectId,
  cities,
  selectedCity,
  cityLoading,
  setSelectedCity,
  compact = false,
  isGoods = false,
}) {
  const pinClass = isGoods
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-teal-600 dark:text-sky-300';
  const textClass = isGoods ? 'text-amber-900 dark:text-sky-100' : 'text-teal-900 dark:text-sky-100';
  const chevronClass = isGoods
    ? 'text-amber-700/60 dark:text-sky-400'
    : 'text-teal-700/60 dark:text-sky-400';

  return (
    <div
      className={`flex shrink-0 items-center border-r border-gray-200/90 bg-transparent dark:border-slate-700 ${
        compact ? 'px-1.5 py-1.5' : 'px-1.5 py-2 sm:px-2'
      }`}
    >
      <div
        className={`relative flex items-center gap-0.5 ${
          compact
            ? 'min-w-[3.75rem] max-w-[5.25rem]'
            : 'min-w-[4.5rem] max-w-[6rem] sm:min-w-[5rem] sm:max-w-[6.75rem]'
        }`}
      >
        <MapPinIcon
          className={`shrink-0 ${pinClass} ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
          aria-hidden
        />
        <label htmlFor={citySelectId} className="sr-only">
          شهر جستجو
        </label>
        <select
          id={citySelectId}
          value={selectedCity?.id ?? ''}
          disabled={cityLoading || !cities.length}
          onChange={(e) => {
            const city = cities.find((c) => String(c.id) === e.target.value);
            if (city) setSelectedCity(city);
          }}
          className={`min-w-0 flex-1 cursor-pointer appearance-none truncate border-0 bg-transparent py-0 pl-4 pr-0 font-semibold focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-transparent ${textClass} ${
            compact ? 'text-[11px]' : 'text-xs sm:text-sm'
          }`}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className={`pointer-events-none absolute left-0 ${chevronClass} ${
            compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
          }`}
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function SiteSearchBox({
  variant = 'header',
  marketplaceType = 'services',
  searchCategoriesAll: categoriesProp,
  searchExpertsAll: expertsProp,
  inputId: inputIdProp,
}) {
  const router = useRouter();
  const { cities, selectedCity, setSelectedCity, loading: cityLoading } = useCity();
  const index = useSiteSearchIndex(marketplaceType);
  const searchCategoriesAll = categoriesProp ?? index.searchCategoriesAll;
  const searchExpertsAll = expertsProp ?? index.searchExpertsAll;

  const searchWrapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const cityName = selectedCity?.name || index.cityName || 'شهر شما';
  const isGoods = marketplaceType === 'goods';
  const isHeader = variant === 'header';
  const isMobileHeader = variant === 'mobileHeader';
  const isHero = variant === 'hero';
  const showCityPicker = isHero || isMobileHeader;

  const searchScopeLabel = isGoods
    ? `جستجو در کالا و فروشگاه‌های ${cityName}`
    : `جستجو در خدمات و متخصص‌های ${cityName}`;

  const placeholder = isGoods
    ? `کالا، فروشگاه…`
    : `متخصص، خدمت…`;

  const categoryBase = isGoods ? '/goods/categories' : '/categories';

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery?.trim();
    setSuggestionsOpen(false);
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}${isGoods ? '&marketplace=goods' : ''}`);
    } else {
      router.push(isGoods ? '/goods#goods-path-categories' : '/#home-path-categories');
    }
  };

  const suggestions = useMemo(() => {
    const q = normalizeForSearch(searchQuery);
    if (!q || q.length < 1) return { categories: [], experts: [] };
    const catMatches = searchCategoriesAll
      .filter((c) => matchesQuery(c.title, q) || matchesQuery(c.slug, q))
      .slice(0, SUGGESTION_CATEGORY_LIMIT);
    const expMatches = searchExpertsAll
      .filter(
        (e) =>
          matchesQuery(e.user?.firstName, q) ||
          matchesQuery(e.user?.lastName, q) ||
          matchesQuery(e.bio, q) ||
          matchesQuery([e.user?.firstName, e.user?.lastName].filter(Boolean).join(' '), q)
      )
      .slice(0, SUGGESTION_EXPERT_LIMIT);
    return { categories: catMatches, experts: expMatches };
  }, [searchQuery, searchCategoriesAll, searchExpertsAll]);

  const hasSuggestions = suggestions.categories.length > 0 || suggestions.experts.length > 0;
  const showDropdown = suggestionsOpen && searchQuery.trim().length >= 1;
  const hoverRowClass = isGoods
    ? 'hover:bg-amber-50 dark:hover:bg-sky-800'
    : 'hover:bg-teal-50 dark:hover:bg-sky-800';
  const resultBadgeClass = isGoods ? 'text-amber-800 dark:text-amber-300' : 'text-teal-800 dark:text-sky-200';
  const footerClass = isGoods
    ? 'border-t border-amber-100 bg-amber-50 dark:border-sky-700 dark:bg-sky-950'
    : 'border-t border-teal-100 bg-teal-50 dark:border-sky-700 dark:bg-sky-950';
  const footerBtnClass = isGoods
    ? 'text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200'
    : 'text-teal-700 hover:text-teal-800 dark:text-sky-300 dark:hover:text-sky-100';

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const accentRing = isGoods
    ? 'focus-within:ring-amber-500/30 dark:focus-within:ring-amber-500/25'
    : 'focus-within:ring-teal-500/30 dark:focus-within:ring-sky-500/30';

  const shellClass = isMobileHeader
    ? `relative flex min-h-[2.375rem] items-stretch overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200/90 transition focus-within:bg-white focus-within:ring-2 dark:bg-sky-900 dark:ring-sky-700 dark:focus-within:bg-sky-900 dark:focus-within:ring-sky-500/40 ${accentRing}`
    : isHeader
      ? `relative flex min-h-[2.5rem] items-stretch overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200/90 transition focus-within:bg-white focus-within:ring-2 dark:bg-sky-900 dark:ring-sky-700 dark:focus-within:bg-sky-900 dark:focus-within:ring-sky-500/40 ${accentRing}`
      : `relative flex min-h-[3rem] items-stretch overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/90 transition-all duration-200 hover:ring-teal-300/80 focus-within:ring-2 focus-within:ring-teal-500/35 focus-within:ring-offset-2 dark:bg-sky-900 dark:ring-sky-700 dark:hover:ring-sky-500/50 dark:focus-within:ring-sky-500/40 dark:focus-within:ring-offset-sky-950 sm:min-h-[3.25rem]`;

  const inputId =
    inputIdProp ||
    (isMobileHeader ? 'mobile-header-search' : isHeader ? 'header-search' : 'hero-search');
  const citySelectId = `${inputId}-city`;

  const inputClass = isMobileHeader
    ? 'w-full min-w-0 border-0 bg-transparent py-2 pr-2 pl-1 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-sky-100 dark:placeholder:text-sky-500'
    : isHeader
      ? 'w-full min-w-0 border-0 bg-transparent py-2 pr-3 pl-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-sky-100 dark:placeholder:text-sky-500'
      : 'w-full min-w-0 border-0 bg-transparent py-3 pl-3 pr-3 text-sm text-gray-800 placeholder-gray-400 placeholder:text-sm focus:outline-none focus:ring-0 dark:text-sky-100 dark:placeholder:text-sky-500 sm:py-3.5 sm:pl-4 sm:pr-4 sm:text-[0.9375rem]';

  const submitClass = isMobileHeader || isHeader
    ? `flex w-9 shrink-0 items-center justify-center transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:hover:bg-sky-800 dark:focus-visible:ring-sky-500/40 ${
        isGoods
          ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400'
          : 'text-teal-600 dark:text-sky-300'
      }`
    : 'flex w-11 shrink-0 items-center justify-center bg-teal-500 text-white transition-colors hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:w-12';

  return (
    <div ref={searchWrapRef} className="relative w-full min-w-0">
      <form onSubmit={handleSearch}>
        <div dir="rtl" className={shellClass}>
          <div className="relative flex min-w-0 flex-1 items-center">
            <label htmlFor={inputId} className="sr-only">
              {searchScopeLabel}
            </label>
            <input
              id={inputId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder={
                isHeader || isMobileHeader ? `${placeholder}` : `جستجو در ${cityName}...`
              }
              className={inputClass}
              dir="rtl"
              autoComplete="off"
              aria-expanded={showDropdown}
              aria-autocomplete="list"
            />
          </div>

          {showCityPicker ? (
            <CityPickerSegment
              citySelectId={citySelectId}
              cities={cities}
              selectedCity={selectedCity}
              cityLoading={cityLoading}
              setSelectedCity={setSelectedCity}
              compact={isMobileHeader}
              isGoods={isGoods}
            />
          ) : null}

          <button type="submit" className={submitClass} aria-label="جستجو">
            <MagnifyingGlassIcon
              className={isHero ? 'h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]' : 'h-4 w-4'}
              strokeWidth={2.5}
              aria-hidden
            />
          </button>
        </div>
      </form>

      {showDropdown ? (
        <div
          className="absolute top-full left-0 right-0 z-[10050] mt-1 max-h-[min(70vh,22rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-sky-700 dark:bg-sky-900"
          role="listbox"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
            {isGoods ? 'جستجو در کالا — ' : 'جستجو در خدمات — '}
            <span className={`font-semibold ${resultBadgeClass}`}>{cityName}</span>
          </div>
          {hasSuggestions ? (
            <>
              {suggestions.categories.length > 0 ? (
                <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 dark:border-sky-800 dark:bg-sky-950">
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-sky-400">
                    <Squares2X2Icon className="h-4 w-4" />
                    {isGoods ? 'دسته‌های کالا' : 'دسته‌ها و خدمات'}
                  </span>
                </div>
              ) : null}
              {suggestions.categories.map((c) => (
                <Link
                  key={c.type === 'sub' ? `sub-${c.id}` : `cat-${c.id}`}
                  href={`${categoryBase}/${c.slug || c.id}`}
                  onClick={() => {
                    setSuggestionsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-3 border-b border-gray-50 px-4 py-2.5 text-right transition-colors ${hoverRowClass}`}
                  role="option"
                >
                  <span className="font-medium text-gray-800">{c.title}</span>
                </Link>
              ))}
              {!isGoods && suggestions.experts.length > 0 ? (
                <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 dark:border-sky-800 dark:bg-sky-950">
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-sky-400">
                    <UserCircleIcon className="h-4 w-4" /> متخصص‌ها
                  </span>
                </div>
              ) : null}
              {!isGoods
                ? suggestions.experts.map((expert) => {
                    const avatarSrc =
                      expert.user?.avatar ||
                      (expert.user?.gender === 'female'
                        ? '/images/default/female.png'
                        : '/images/default/male.png');
                    return (
                      <Link
                        key={expert.id}
                        href={`/experts/${expert.id}`}
                        onClick={() => {
                          setSuggestionsOpen(false);
                          setSearchQuery('');
                        }}
                        className={`flex items-center gap-3 border-b border-gray-50 px-4 py-2.5 text-right transition-colors ${hoverRowClass}`}
                        role="option"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarSrc}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              expert.user?.gender === 'female'
                                ? '/images/default/female.png'
                                : '/images/default/male.png';
                          }}
                        />
                        <span className="font-medium text-gray-800">
                          {expert.user?.firstName} {expert.user?.lastName}
                        </span>
                      </Link>
                    );
                  })
                : null}
              <div className={`${footerClass} px-4 py-2`}>
                <button
                  type="button"
                  onClick={handleSearch}
                  className={`w-full text-center text-sm font-medium ${footerBtnClass}`}
                >
                  مشاهده همه نتایج «{searchQuery.trim()}» در {cityName}
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              نتیجه‌ای در {cityName} یافت نشد. Enter بزنید تا جستجوی کامل انجام شود.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
