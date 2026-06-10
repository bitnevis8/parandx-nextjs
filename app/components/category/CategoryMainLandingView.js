'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRightIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { getCategoryLandingCopy } from '../../copy/categoryLandingFa';
import {
  HOME_CONTAINER,
  HOME_BTN_PRIMARY,
  HOME_BTN_SECONDARY,
  HOME_BLOCK_TITLE,
  HOME_BLOCK_LEAD,
} from '../home/homePageTheme';
import {
  HeroMedia,
  ImagePlaceholder,
  mapHref,
  FeaturedSlotsSection,
} from './categoryLandingShared';

function SubcategoryCardImage({ src, alt }) {
  if (!src) {
    return <ImagePlaceholder label="جای تصویر زیردسته" className="w-full aspect-[4/3]" />;
  }
  return (
    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-xl">
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" unoptimized />
    </div>
  );
}

export default function CategoryMainLandingView({ category, marketplaceType = 'services' }) {
  const copy = getCategoryLandingCopy(category.slug);
  const subcategories = [...(category.subcategories || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const parentSlug = category.slug;
  const isGoods = marketplaceType === 'goods';
  const homeHref = isGoods ? '/goods#home-path-categories' : '/#home-path-categories';
  const homeLabel = isGoods ? 'بازار کالا' : 'بازار خدمات';
  const mapBase = isGoods ? '/goods' : '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${HOME_CONTAINER} py-6 sm:py-8`}>
        <Link
          href={homeHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 mb-6"
        >
          <ArrowRightIcon className="h-4 w-4" />
          {homeLabel}
        </Link>

        <header className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] min-h-[140px] bg-gray-100">
            <HeroMedia
              image={category.image}
              alt={category.title}
              placeholderLabel="جای تصویر اصلی دسته (hero)"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-6 text-white">
              <span className="text-3xl sm:text-4xl mb-2 block" aria-hidden>
                {category.icon || '📂'}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{category.title}</h1>
              <p className="mt-1 text-sm sm:text-base text-white/90">
                {subcategories.length > 0
                  ? `${subcategories.length} ${isGoods ? 'زیردسته' : 'زیرخدمت'}`
                  : isGoods ? 'زیردسته‌ای ثبت نشده' : 'زیرخدمتی ثبت نشده'}
                {!isGoods && category.expertCount != null && category.expertCount > 0
                  ? ` · ${category.expertCount} متخصص در شبکه`
                  : ''}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-100">
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">{copy.intro}</p>
            {copy.bullets?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {copy.bullets.map((item) => (
                  <li
                    key={item}
                    className="text-xs sm:text-sm font-medium text-teal-800 bg-teal-50 px-3 py-1 rounded-full ring-1 ring-teal-200/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href={mapHref(parentSlug, '', mapBase)} className={`${HOME_BTN_PRIMARY} flex-1`}>
                <MapPinIcon className="h-5 w-5 shrink-0" />
                {isGoods ? 'فروشگاه روی نقشه' : 'متخصص روی نقشه'}
              </Link>
              <Link
                href={
                  isGoods
                    ? '/goods/needs/new'
                    : `/requests/new?category=${encodeURIComponent(parentSlug)}`
                }
                className={`${HOME_BTN_SECONDARY} flex-1 border-teal-200`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5 shrink-0 text-teal-600" />
                {isGoods ? 'ثبت نیاز کالا' : 'ثبت کار'}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 sm:mt-10" aria-labelledby="category-subs-title">
          <h2 id="category-subs-title" className={HOME_BLOCK_TITLE}>
            {isGoods ? 'زیردسته‌ها' : 'زیرخدمت‌ها'}
          </h2>
          <p className={HOME_BLOCK_LEAD}>
            {isGoods
              ? 'روی هر مورد بزنید تا صفحهٔ همان دسته کالا باز شود.'
              : 'روی هر مورد بزنید تا صفحهٔ اختصاصی همان خدمت باز شود.'}
          </p>

          {subcategories.length > 0 ? (
            <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {subcategories.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/categories/${sub.slug}`}
                    className="group flex flex-col h-full rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-teal-200 hover:shadow-md transition-all"
                  >
                    <SubcategoryCardImage src={sub.image} alt={sub.title} />
                    <div className="p-3 flex flex-col flex-1 text-center gap-1">
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-teal-700 line-clamp-2 leading-snug">
                        {sub.icon ? `${sub.icon} ` : ''}
                        {sub.title}
                      </span>
                      {sub.expertCount != null && !isGoods && (
                        <span className="text-[10px] sm:text-xs text-teal-600 self-center">
                          {sub.expertCount} متخصص
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500 text-center py-8 rounded-xl border border-dashed border-gray-300 bg-white">
              هنوز زیرخدمتی برای این دسته تعریف نشده است.
            </p>
          )}
        </section>

        <FeaturedSlotsSection />
      </div>
    </div>
  );
}
