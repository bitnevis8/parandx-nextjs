'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { useCity } from '../../context/CityContext';
import { filterMerchantSubcategories } from '../../utils/merchantDisplayUtils';
import { mapHref } from '../category/categoryLandingShared';
import GoodsMerchantCard, {
  GoodsMerchantCardSkeleton,
  STORE_CARD_GRID_WIDTH,
} from './GoodsMerchantCard';
import GoodsSubcategoryCard from './GoodsSubcategoryCard';
import {
  HOME_BLOCK_LEAD,
  HOME_BLOCK_TITLE,
  HOME_BTN_PRIMARY,
  HOME_BTN_SECONDARY,
  HOME_CONTAINER,
} from '../home/homePageTheme';

const SCROLLBAR_HIDE =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const AMBER_BTN_PRIMARY =
  `${HOME_BTN_PRIMARY} bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 hover:shadow-amber-600/30 focus-visible:ring-amber-500/40`;

const AMBER_BTN_SECONDARY =
  `${HOME_BTN_SECONDARY} hover:border-amber-300 hover:text-amber-800`;

function useMerchantCount(cityId, slug, enabled) {
  const [count, setCount] = useState(null);
  useEffect(() => {
    if (!enabled || !cityId || !slug) return;
    let cancelled = false;
    fetch(API_ENDPOINTS.merchants.getBrowseCount(cityId, slug))
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res.success) setCount(res.count ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, cityId, slug]);
  return count;
}

function HorizontalScrollRow({ children, itemCount = 0 }) {
  const scrollRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow <= 8) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const offset = Math.abs(el.scrollLeft);
    setCanPrev(offset > 8);
    setCanNext(offset < overflow - 8);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(update);
    const el = scrollRef.current;
    if (!el) return () => cancelAnimationFrame(raf);
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [itemCount]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  const arrowCls =
    'pointer-events-auto absolute z-[2] flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-md backdrop-blur-sm transition hover:border-amber-200 hover:bg-amber-50 top-1/2 -translate-y-1/2';

  return (
    <div className="relative">
      {canPrev && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-white via-white/85 to-transparent" aria-hidden />
          <button type="button" onClick={() => scroll(-1)} className={`${arrowCls} right-0`} aria-label="قبلی">
            <ChevronRightIcon className="h-4 w-4 text-gray-600" strokeWidth={2.5} />
          </button>
        </>
      )}
      {canNext && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-white via-white/85 to-transparent" aria-hidden />
          <button type="button" onClick={() => scroll(1)} className={`${arrowCls} left-0`} aria-label="بعدی">
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" strokeWidth={2.5} />
          </button>
        </>
      )}
      <div ref={scrollRef} dir="rtl" className={`overflow-x-auto overscroll-x-contain scroll-smooth py-1 ${SCROLLBAR_HIDE}`}>
        <div className="flex w-max items-stretch gap-2.5 px-0.5">{children}</div>
      </div>
    </div>
  );
}

function SubcategoryPill({ href, active, icon, title, count }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ring-1 ring-inset transition sm:text-[13px] ${
        active
          ? 'bg-amber-600 text-white ring-amber-600 shadow-sm'
          : 'bg-white text-gray-600 ring-gray-200 hover:bg-amber-50 hover:text-amber-900 hover:ring-amber-200'
      }`}
    >
      {icon ? `${icon} ` : ''}
      {title}
      {count != null && count > 0 ? (
        <span className={`mr-1.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function SubcategoryBrowseCard({ sub, cityId, active }) {
  return (
    <GoodsSubcategoryCard
      sub={sub}
      href={`/goods/categories/${sub.slug}`}
      cityId={cityId}
      active={active}
    />
  );
}

function MerchantGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <GoodsMerchantCardSkeleton key={i} className={STORE_CARD_GRID_WIDTH} />
      ))}
    </div>
  );
}

function CategoryHero({ category, parentCategory, cityName, merchantCount, mapLink }) {
  const hasImage = Boolean(category?.image);

  return (
    <header className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
      <div className="relative min-h-[11rem] sm:min-h-[12.5rem]">
        {hasImage ? (
          <>
            <Image
              src={category.image}
              alt={category.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/35 to-gray-950/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/90 via-amber-50/50 to-white" />
        )}

        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-orange-200/30 blur-2xl" />
        </div>

        <div className={`relative flex h-full flex-col justify-end p-5 sm:p-7 ${hasImage ? 'text-white' : 'text-gray-900'}`}>
          {parentCategory && (
            <Link
              href={`/goods/categories/${parentCategory.slug}`}
              className={`mb-2 inline-flex w-fit items-center gap-1 text-xs font-medium transition sm:text-sm ${
                hasImage ? 'text-amber-100 hover:text-white' : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              <ChevronRightIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
              {parentCategory.title}
            </Link>
          )}

          <div className="flex items-end gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm sm:h-16 sm:w-16 sm:text-4xl ${
                hasImage ? 'bg-white/15 backdrop-blur-sm ring-1 ring-white/25' : 'bg-white ring-1 ring-amber-100'
              }`}
              aria-hidden
            >
              {category?.icon || '📦'}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold leading-snug sm:text-2xl lg:text-[1.75rem]">
                {category?.title}
              </h1>
              <p className={`mt-1 text-sm ${hasImage ? 'text-white/85' : 'text-gray-600'}`}>
                {cityName
                  ? merchantCount != null
                    ? `${merchantCount.toLocaleString('fa-IR')} فروشگاه در ${cityName}`
                    : `فروشگاه‌های ${cityName}`
                  : 'فروشگاه‌های این دسته'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-white p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-gray-600 sm:text-[15px]">
          فروشگاه‌های فعال این دسته را ببینید، روی نقشه پیدا کنید یا نیاز کالای خود را ثبت کنید تا پیشنهاد بگیرید.
        </p>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <Link href={mapLink} className={`${AMBER_BTN_PRIMARY} flex-1 sm:min-w-[10rem]`}>
            <MapPinIcon className="h-5 w-5 shrink-0" aria-hidden />
            روی نقشه ببین
          </Link>
          <Link href="/goods/needs/new" className={`${AMBER_BTN_SECONDARY} flex-1 sm:min-w-[10rem]`}>
            <ClipboardDocumentListIcon className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            ثبت نیاز کالا
          </Link>
          <Link
            href="/dashboard?tab=merchant-edit"
            className={`${AMBER_BTN_SECONDARY} flex-1 sm:min-w-[10rem]`}
          >
            <PlusIcon className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            ثبت فروشگاه
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function GoodsCategoryLandingView({ category, parentCategory, slug }) {
  const { selectedCity } = useCity();
  const [merchants, setMerchants] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  const subCategories = filterMerchantSubcategories(category?.subcategories || []);
  const siblingSubcategories = filterMerchantSubcategories(parentCategory?.subcategories || []);
  const isParentCategory = !category?.parentId && subCategories.length > 0;
  const isSubCategory = Boolean(category?.parentId);
  const browseSlug = slug;
  const merchantCount = useMerchantCount(selectedCity?.id, browseSlug, Boolean(selectedCity?.id && category));

  const mapParentSlug = parentCategory?.slug || (isParentCategory ? category.slug : undefined);
  const mapServiceSlug = isSubCategory ? category.slug : undefined;
  const mapLink = mapHref(mapParentSlug, mapServiceSlug, '/goods');

  useEffect(() => {
    if (!selectedCity?.id || !category) return;
    setMerchantsLoading(true);
    fetch(API_ENDPOINTS.merchants.getBrowse(selectedCity.id, browseSlug, 100))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setMerchants(res.data || []);
      })
      .catch(console.error)
      .finally(() => setMerchantsLoading(false));
  }, [selectedCity?.id, category, browseSlug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${HOME_CONTAINER} py-5 sm:py-8`}>
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-gray-400 sm:text-sm" aria-label="مسیر">
          <Link href="/goods" className="transition hover:text-amber-600">
            بازار کالا
          </Link>
          <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          {isSubCategory && parentCategory && (
            <>
              <Link
                href={`/goods/categories/${parentCategory.slug}`}
                className="transition hover:text-amber-600"
              >
                {parentCategory.title}
              </Link>
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
            </>
          )}
          <span className="font-medium text-gray-700">{category?.title}</span>
        </nav>

        <CategoryHero
          category={category}
          parentCategory={parentCategory}
          cityName={selectedCity?.name}
          merchantCount={merchantCount}
          mapLink={mapLink}
        />

        {isSubCategory && siblingSubcategories.length > 0 && (
          <section className="mt-6 sm:mt-8" aria-label="زیردسته‌های مرتبط">
            <div className={`mb-3 flex gap-2 overflow-x-auto pb-1 ${SCROLLBAR_HIDE}`} dir="rtl">
              <SubcategoryPill
                href={`/goods/categories/${parentCategory.slug}`}
                active={false}
                icon={parentCategory.icon}
                title={`همه ${parentCategory.title}`}
              />
              {siblingSubcategories.map((sub) => (
                <SubcategoryPill
                  key={sub.slug}
                  href={`/goods/categories/${sub.slug}`}
                  active={sub.slug === slug}
                  icon={sub.icon}
                  title={sub.title}
                />
              ))}
            </div>
          </section>
        )}

        {isParentCategory && (
          <section className="mt-8 sm:mt-10" aria-labelledby="goods-subcategories-title">
            <div className="mb-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm ring-1 ring-gray-100/80 sm:p-5">
              <h2 id="goods-subcategories-title" className={HOME_BLOCK_TITLE}>
                زیردسته‌ها
              </h2>
              <p className={`${HOME_BLOCK_LEAD} mt-1`}>
                دقیق‌تر انتخاب کنید و فروشگاه‌های همان نوع را ببینید.
              </p>
              <div className="mt-4">
                <HorizontalScrollRow itemCount={subCategories.length + 1}>
                  {subCategories.map((sub) => (
                    <SubcategoryBrowseCard
                      key={sub.slug}
                      sub={sub}
                      cityId={selectedCity?.id}
                      active={sub.slug === slug}
                    />
                  ))}
                  <GoodsSubcategoryCard
                    sub={{ title: 'همه', slug: category.slug }}
                    href={`/goods/categories/${category.slug}`}
                    cityId={selectedCity?.id}
                    variant="all"
                  />
                </HorizontalScrollRow>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 sm:mt-10" aria-labelledby="goods-stores-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="goods-stores-title" className={HOME_BLOCK_TITLE}>
                {isSubCategory ? `فروشگاه‌های ${category.title}` : 'فروشگاه‌های این دسته'}
              </h2>
              <p className={HOME_BLOCK_LEAD}>
                {merchantsLoading
                  ? 'در حال بارگذاری فروشگاه‌ها…'
                  : merchants.length
                    ? `${merchants.length.toLocaleString('fa-IR')} فروشگاه${selectedCity?.name ? ` در ${selectedCity.name}` : ''}`
                    : selectedCity?.name
                      ? `فعلاً فروشگاهی در ${selectedCity.name} ثبت نشده`
                      : 'شهر را از بالای صفحه انتخاب کنید'}
              </p>
            </div>
            {merchants.length > 0 && (
              <Link href={mapLink} className="text-sm font-medium text-amber-700 transition hover:text-amber-900">
                همه روی نقشه ←
              </Link>
            )}
          </div>

          {merchantsLoading ? (
            <MerchantGridSkeleton />
          ) : merchants.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-3xl ring-1 ring-gray-100">
                🏪
              </span>
              <p className="mt-4 text-base font-semibold text-gray-800">هنوز فروشگاهی اینجا نیست</p>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-gray-500">
                اولین فروشگاه این دسته در {selectedCity?.name || 'شهر شما'} باشید یا نیاز کالا ثبت کنید.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link href="/goods/store/register" className={AMBER_BTN_PRIMARY}>
                  <BuildingStorefrontIcon className="h-5 w-5 shrink-0" aria-hidden />
                  ثبت فروشگاه
                </Link>
                <Link href="/goods/needs/new" className={AMBER_BTN_SECONDARY}>
                  ثبت نیاز کالا
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {merchants.map((merchant) => (
                <GoodsMerchantCard
                  key={merchant.id}
                  merchant={merchant}
                  cityName={selectedCity?.name}
                  className={STORE_CARD_GRID_WIDTH}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
