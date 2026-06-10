'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  Squares2X2Icon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { EXPERTS_INDEX } from '../../copy/expertsPageFa';
import { useCity } from '../../context/CityContext';
import SiteSearchBox from '../ui/SiteSearchBox';
import {
  HOME_BADGE,
  HOME_BTN_PRIMARY,
  HOME_BTN_SECONDARY,
  HOME_CARD_SHELL,
  HOME_CONTAINER,
  HOME_PAGE_LEAD,
  HOME_PAGE_TITLE,
} from '../home/homePageTheme';

const PATHS = [
  {
    key: 'request',
    href: EXPERTS_INDEX.pathRequestHref,
    title: EXPERTS_INDEX.pathRequestTitle,
    desc: EXPERTS_INDEX.pathRequestDesc,
    Icon: ClipboardDocumentListIcon,
    primary: true,
  },
  {
    key: 'map',
    href: EXPERTS_INDEX.pathMapHref,
    title: EXPERTS_INDEX.pathMapTitle,
    desc: EXPERTS_INDEX.pathMapDesc,
    Icon: MapIcon,
  },
  {
    key: 'categories',
    href: EXPERTS_INDEX.pathCategoriesHref,
    title: EXPERTS_INDEX.pathCategoriesTitle,
    desc: EXPERTS_INDEX.pathCategoriesDesc,
    Icon: Squares2X2Icon,
  },
  {
    key: 'search',
    href: EXPERTS_INDEX.pathSearchHref,
    title: EXPERTS_INDEX.pathSearchTitle,
    desc: EXPERTS_INDEX.pathSearchDesc,
    Icon: MagnifyingGlassIcon,
  },
];

function findCategoryTitle(categories, slug) {
  if (!slug || !categories?.length) return null;
  for (const main of categories) {
    if (main.slug === slug) return main.title;
    const sub = (main.subcategories || []).find((s) => s.slug === slug);
    if (sub) return sub.title;
  }
  return null;
}

export default function ExpertsPageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') || '';
  const { selectedCity } = useCity();
  const [categoryTitle, setCategoryTitle] = useState(null);

  const cityName = selectedCity?.name || 'شهر شما';

  useEffect(() => {
    if (!categorySlug) {
      setCategoryTitle(null);
      return undefined;
    }
    let cancelled = false;
    fetch(API_ENDPOINTS.categories.getAll('services'))
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const cats = json?.success && Array.isArray(json.data) ? json.data : [];
        setCategoryTitle(findCategoryTitle(cats, categorySlug) || categorySlug);
      })
      .catch(() => {
        if (!cancelled) setCategoryTitle(categorySlug);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${HOME_CONTAINER} py-8 sm:py-10`}>
        <div className={`${HOME_CARD_SHELL} overflow-hidden`}>
          <div className="border-b border-gray-200/90 bg-gradient-to-l from-teal-50/80 via-white to-white px-5 py-6 sm:px-8 sm:py-8">
            <span className={HOME_BADGE}>
              <UserGroupIcon className="h-3.5 w-3.5" aria-hidden />
              {EXPERTS_INDEX.badge}
            </span>
            <h1 className={`${HOME_PAGE_TITLE} mt-3`}>
              {categoryTitle
                ? EXPERTS_INDEX.categoryTitle(categoryTitle, cityName)
                : EXPERTS_INDEX.title}
            </h1>
            <p className={`${HOME_PAGE_LEAD} mt-2 max-w-2xl lg:mx-0`}>
              {categoryTitle ? EXPERTS_INDEX.categoryLead : EXPERTS_INDEX.lead}
            </p>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-gray-500 sm:text-sm">
              {EXPERTS_INDEX.profileNote}
            </p>
          </div>

          <div className="border-b border-gray-100 bg-white px-5 py-5 sm:px-8">
            <label className="mb-2 block text-xs font-semibold text-gray-700">
              جستجوی سریع
            </label>
            <SiteSearchBox variant="header" inputId="experts-index-search" />
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:gap-4 sm:p-8">
            {PATHS.map(({ key, href, title, desc, Icon, primary }) => (
              <Link
                key={key}
                href={href}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-right transition sm:p-5 ${
                  primary
                    ? 'border-teal-200 bg-teal-50/60 ring-1 ring-teal-200/80 hover:border-teal-300 hover:bg-teal-50'
                    : 'border-gray-200/90 bg-white hover:border-teal-300/80 hover:shadow-sm'
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    primary ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/80'
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-gray-900">{title}</span>
                  <span className="mt-1 block text-sm text-gray-600">{desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 bg-slate-50/80 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{EXPERTS_INDEX.expertJoinTitle}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{EXPERTS_INDEX.expertJoinLead}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={EXPERTS_INDEX.expertJoinHref} className={HOME_BTN_PRIMARY}>
                <WrenchScrewdriverIcon className="h-5 w-5" aria-hidden />
                {EXPERTS_INDEX.expertJoinCta}
              </Link>
              <Link href={EXPERTS_INDEX.expertDashboardHref} className={HOME_BTN_SECONDARY}>
                {EXPERTS_INDEX.expertDashboardCta}
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link
            href={EXPERTS_INDEX.homeHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            <HomeIcon className="h-4 w-4" aria-hidden />
            {EXPERTS_INDEX.homeCta}
          </Link>
        </p>
      </div>
    </div>
  );
}
