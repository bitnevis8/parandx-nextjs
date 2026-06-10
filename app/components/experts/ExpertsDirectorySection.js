'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FunnelIcon, Squares2X2Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import SiteSearchBox from '../ui/SiteSearchBox';
import ExpertHubCard, { ExpertHubCardSkeleton } from './ExpertHubCard';
import {
  HOME_BTN_PRIMARY,
  HOME_CARD_SHELL,
  HOME_PAGE_TITLE,
  HOME_BLOCK_LEAD,
} from '../home/homePageTheme';

function findCategoryTitle(categories, slug) {
  if (!slug || !categories?.length) return null;
  for (const main of categories) {
    if (main.slug === slug) return main.title;
    const sub = (main.subcategories || []).find((s) => s.slug === slug);
    if (sub) return sub.title;
  }
  return slug;
}

export default function ExpertsDirectorySection({
  experts = [],
  categories = [],
  loading = false,
  error = null,
  cityName = 'شهر شما',
}) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') || '';
  const categoryTitle = findCategoryTitle(categories, categorySlug);

  const title = categoryTitle
    ? `${EXPERTS_HUB.directoryTitle} · ${categoryTitle}`
    : EXPERTS_HUB.directoryTitle;

  return (
    <section
      id="experts-directory"
      className="scroll-mt-28 mt-10 sm:mt-12"
      aria-labelledby="experts-directory-title"
    >
      <div className={`${HOME_CARD_SHELL} overflow-hidden`}>
        <div className="border-b border-gray-200/90 bg-white px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="text-right">
              <h2 id="experts-directory-title" className={HOME_PAGE_TITLE}>
                {title}
              </h2>
              <p className={`${HOME_BLOCK_LEAD} mt-1`}>
                {EXPERTS_HUB.directoryLead} · {cityName}
              </p>
            </div>
            <div className="w-full lg:max-w-sm">
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {EXPERTS_HUB.searchLabel}
              </label>
              <SiteSearchBox variant="header" inputId="experts-directory-search" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categorySlug ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden />
                {EXPERTS_HUB.clearCategory}
              </Link>
            ) : null}
            <Link
              href="/#home-path-categories"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-teal-300 hover:text-teal-700"
            >
              <Squares2X2Icon className="h-4 w-4 text-teal-600" aria-hidden />
              {EXPERTS_HUB.browseCategories}
            </Link>
            {!loading && !error ? (
              <span className="text-xs font-medium text-gray-500 sm:ms-auto sm:text-sm">
                <FunnelIcon className="ms-1 inline h-4 w-4 text-teal-600" aria-hidden />
                {EXPERTS_HUB.resultCount(experts.length)}
              </span>
            ) : null}
          </div>

          {categories.length > 0 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {(categories || []).slice(0, 12).flatMap((main) => [
                ...(main.subcategories || []).slice(0, 1).map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/experts?category=${encodeURIComponent(sub.slug)}`}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${
                      categorySlug === sub.slug
                        ? 'bg-teal-600 text-white ring-teal-600'
                        : 'bg-gray-50 text-gray-700 ring-gray-200 hover:bg-teal-50 hover:ring-teal-200'
                    }`}
                  >
                    {sub.title}
                  </Link>
                )),
              ])}
            </div>
          ) : null}
        </div>

        <div className="bg-gray-50/50 p-4 sm:p-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ExpertHubCardSkeleton key={i} />
              ))}
            </div>
          ) : null}

          {error && !loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-600">{EXPERTS_HUB.error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`${HOME_BTN_PRIMARY} mt-4`}
              >
                تلاش دوباره
              </button>
            </div>
          ) : null}

          {!loading && !error && experts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {experts.map((expert) => (
                <ExpertHubCard key={expert.id} expert={expert} />
              ))}
            </div>
          ) : null}

          {!loading && !error && experts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-semibold text-gray-800">{EXPERTS_HUB.emptyTitle}</p>
              <p className="mt-2 text-sm text-gray-600">{EXPERTS_HUB.emptyBody}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Link href="/#home-path-categories" className={HOME_BTN_PRIMARY}>
                  {EXPERTS_HUB.browseCategories}
                </Link>
                <Link href="/requests/new" className={HOME_BTN_PRIMARY}>
                  {EXPERTS_HUB.ctaCustomer}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
