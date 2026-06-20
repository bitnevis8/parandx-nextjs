'use client';

import { useMemo, useState } from 'react';
import { Squares2X2Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import GoodsCategorySection from './GoodsCategorySection';
import { GOODS_CATEGORY_BROWSE } from '../../copy/goodsPageFa';
import {
  HOME_BLOCK_TITLE,
  HOME_CARD_BODY,
  HOME_CARD_HEADER,
  HOME_CARD_SHELL,
  HOME_ICON_BOX,
} from '../home/homePageTheme';

function merchantSubcategories(category) {
  return (category.subcategories || category.subCategories || []).filter(
    (s) => !s.categoryUsage || s.categoryUsage === 'merchant'
  );
}

function filterCategoriesForBrowse(categories, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return categories;

  return categories
    .map((category) => {
      const subs = merchantSubcategories(category);
      const titleMatch = category.title?.toLowerCase().includes(normalized);
      const matchedSubs = subs.filter((sub) =>
        sub.title?.toLowerCase().includes(normalized)
      );

      if (titleMatch) return category;
      if (matchedSubs.length > 0) {
        return { ...category, subcategories: matchedSubs, subCategories: matchedSubs };
      }
      return null;
    })
    .filter(Boolean);
}

function CategoryBrowseSearch({ value, onChange }) {
  return (
    <div className="w-full min-w-0 sm:max-w-[17rem] lg:max-w-xs">
      <label htmlFor="goods-category-browse-search" className="sr-only">
        {GOODS_CATEGORY_BROWSE.searchPlaceholder}
      </label>
      <div
        dir="rtl"
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 sm:px-3 sm:py-2"
      >
        <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <input
          id="goods-category-browse-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={GOODS_CATEGORY_BROWSE.searchPlaceholder}
          autoComplete="off"
          enterKeyHint="search"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 rounded-md p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="پاک کردن جستجو"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function GoodsCategoryBrowse({ categories = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(
    () => filterCategoriesForBrowse(categories, searchQuery),
    [categories, searchQuery]
  );

  if (!categories.length) return null;

  return (
    <section id="goods-category-browse" className="scroll-mt-28 py-10 sm:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className={HOME_CARD_SHELL}>
          <header
            className={`${HOME_CARD_HEADER} bg-gradient-to-l from-amber-50/80 via-white to-white`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 text-right">
                <span
                  className={`${HOME_ICON_BOX} !bg-amber-50 !text-amber-700 ring-amber-200/80`}
                  aria-hidden
                >
                  <Squares2X2Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                </span>
                <h2 id="goods-category-browse-title" className={HOME_BLOCK_TITLE}>
                  {GOODS_CATEGORY_BROWSE.title}
                </h2>
              </div>
              <CategoryBrowseSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          </header>

          <div className={HOME_CARD_BODY}>
            {filteredCategories.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">
                {GOODS_CATEGORY_BROWSE.emptySearch}
              </p>
            ) : (
              <div className="columns-1 gap-x-10 [column-fill:balance] sm:columns-2 lg:columns-3">
                {filteredCategories.map((cat) => (
                  <GoodsCategorySection key={cat.slug} category={cat} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
