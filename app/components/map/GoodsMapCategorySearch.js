'use client';

import { useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MAP_FILTER_FIELD } from '../home/mapFilterTheme';
const SEARCH_PLACEHOLDER = 'مثلاً پوشاک، لبنیات یا سوپرمارکت…';
const SEARCH_LABEL = 'جستجو در انواع کالا و فروشگاه';

export default function GoodsMapCategorySearch({
  value,
  onChange,
  resultSummary,
  inputId = 'goods-map-category-search',
  variant = 'default',
}) {
  const inputRef = useRef(null);
  const isNavbar = variant === 'navbar';
  const isCompact = variant === 'compact';
  const isToolbar = variant === 'toolbar';

  const shellClass = isToolbar
    ? 'min-w-0 w-full'
    : isNavbar
      ? 'border-b border-amber-100/80 bg-gradient-to-b from-amber-50/80 via-amber-50/30 to-white px-3 py-2 sm:px-4 sm:py-2.5'
      : isCompact
        ? ''
        : 'px-3 pt-2.5 sm:px-4 sm:pt-3';

  const fieldClass = isToolbar
    ? `${MAP_FILTER_FIELD} h-9 px-2 sm:px-2.5 focus-within:border-teal-500 focus-within:ring-teal-500/20`
    : isNavbar
      ? 'rounded-xl border border-amber-200/70 bg-white py-1.5 pe-2 ps-3 shadow-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 sm:py-2 sm:pe-2.5 sm:ps-3.5'
      : isCompact
        ? 'rounded-lg border border-gray-200 bg-white py-0.5 pe-1 ps-2 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20'
        : 'rounded-xl border border-gray-200 bg-white py-1 pe-1.5 ps-2.5 shadow-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 sm:gap-1.5 sm:pe-2 sm:ps-3';

  return (
    <div className={shellClass}>
      <label htmlFor={inputId} className="sr-only">
        {SEARCH_LABEL}
      </label>
      <div dir="rtl" className={`flex items-center gap-1.5 sm:gap-2 ${fieldClass}`}>
        <MagnifyingGlassIcon
          className={`shrink-0 text-gray-400 ${
            isToolbar ? 'h-3.5 w-3.5' : isNavbar ? 'h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]' : 'h-4 w-4'
          }`}
          aria-hidden
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          autoComplete="off"
          enterKeyHint="search"
          className={`min-w-0 flex-1 border-0 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${
            isToolbar
              ? 'py-0 text-[13px]'
              : isNavbar
                ? 'py-0.5 text-sm'
                : isCompact
                  ? 'py-1.5 text-xs'
                  : 'py-2 text-sm'
          }`}
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="پاک کردن جستجو"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {value.trim() && resultSummary && !isToolbar ? (
        <p
          className={`text-gray-500 ${
            isNavbar
              ? 'mt-1.5 px-0.5 text-[10px] sm:text-[11px]'
              : 'mt-1.5 text-center text-[11px] sm:text-xs'
          }`}
        >
          {resultSummary}
        </p>
      ) : null}
    </div>
  );
}
