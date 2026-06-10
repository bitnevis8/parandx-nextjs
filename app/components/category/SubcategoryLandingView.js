'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { useCity } from '../../context/CityContext';
import { getSubcategoryLandingCopy } from '../../copy/subcategoryLandingFa';
import { getExpertPublicName } from '../../utils/expertProfileUtils';
import {
  HOME_CONTAINER,
  HOME_BTN_PRIMARY,
  HOME_BTN_SECONDARY,
  HOME_BLOCK_TITLE,
  HOME_BLOCK_LEAD,
} from '../home/homePageTheme';
import {
  HeroMedia,
  mapHref,
  FeaturedSlotsSection,
  expertAvatarSrc,
  filterExpertsForCategory,
  EXPERT_PREVIEW_LIMIT,
} from './categoryLandingShared';

function ExpertPreviewCard({ expert, name }) {
  const avatar = expertAvatarSrc(expert);
  const fallback =
    expert.user?.gender === 'female'
      ? '/images/default/female.png'
      : '/images/default/male.png';

  return (
    <Link
      href={`/experts/${expert.id}`}
      className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:border-teal-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
    >
      <span className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-teal-300"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallback;
          }}
        />
        <span
          className="absolute bottom-0 left-0 h-3 w-3 rounded-full border-2 border-white bg-teal-500"
          title="فعال در شبکه"
          aria-hidden
        />
      </span>
      <span className="mt-3 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-800">
        {name}
      </span>
      {expert.location && (
        <span className="mt-1 text-xs text-gray-500 line-clamp-1">{expert.location}</span>
      )}
      <span className="mt-2 text-xs font-medium text-teal-600 group-hover:underline">مشاهده پروفایل</span>
    </Link>
  );
}

export default function SubcategoryLandingView({ category, parent, marketplaceType = 'services' }) {
  const { selectedCity } = useCity();
  const [experts, setExperts] = useState([]);
  const [loadingExperts, setLoadingExperts] = useState(false);

  const isGoods = marketplaceType === 'goods';
  const parentSlug = parent?.slug;
  const parentTitle = parent?.title;
  const copy = getSubcategoryLandingCopy(category.slug, category.title, parentTitle);
  const mapBase = isGoods ? '/goods' : '/';
  const mapLink = mapHref(parentSlug, category.slug, mapBase);
  const homeHref = isGoods ? '/goods#home-path-categories' : '/#home-path-categories';
  const homeLabel = isGoods ? 'بازار کالا' : 'بازار خدمات';
  const actionLink = isGoods
    ? '/goods/needs/new'
    : `/requests/new?category=${encodeURIComponent(category.slug)}`;
  const actionLabel = isGoods ? 'ثبت نیاز کالا' : 'ثبت کار';

  useEffect(() => {
    if (isGoods || !selectedCity?.id || !category?.id) {
      setExperts([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingExperts(true);

    fetch(API_ENDPOINTS.experts.getAll(selectedCity.id))
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        if (cancelled) return;
        const list = filterExpertsForCategory(json.data || [], category.id).slice(
          0,
          EXPERT_PREVIEW_LIMIT
        );
        setExperts(list);
      })
      .catch(() => {
        if (!cancelled) setExperts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingExperts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCity?.id, category?.id, isGoods]);

  const expertTotal = category.expertCount ?? experts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${HOME_CONTAINER} py-6 sm:py-8`}>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6" aria-label="مسیر">
          <Link href={homeHref} className="text-teal-600 hover:text-teal-700">
            {homeLabel}
          </Link>
          <span aria-hidden>/</span>
          {parentSlug && (
            <>
              <Link href={`/categories/${parentSlug}`} className="text-teal-600 hover:text-teal-700">
                {parentTitle}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="text-gray-800 font-medium">{category.title}</span>
        </nav>

        <header className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="relative w-full aspect-[2/1] sm:aspect-[21/9] min-h-[160px] bg-gray-100">
            <HeroMedia
              image={category.image}
              alt={category.title}
              placeholderLabel="جای تصویر این زیرخدمت (hero)"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 via-gray-900/25 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-6 text-white">
              {parentTitle && (
                <Link
                  href={`/categories/${parentSlug}`}
                  className="inline-block text-xs sm:text-sm font-medium text-teal-200 hover:text-white mb-2"
                >
                  ← {parentTitle}
                </Link>
              )}
              <span className="text-2xl sm:text-3xl mb-1 block" aria-hidden>
                {category.icon || '🔧'}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold leading-snug">
                {category.title}
              </h1>
              <p className="mt-1 text-sm text-white/90">
                {isGoods
                  ? 'فروشگاه‌های این دسته را روی نقشه پیدا کنید'
                  : expertTotal > 0
                    ? `${expertTotal} متخصص در ${selectedCity?.name || 'شهر شما'}`
                    : 'متخصص‌ها روی نقشه و با ثبت کار پیدا می‌شوند'}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-100 space-y-4">
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">{copy.intro}</p>
            {copy.bullets?.length > 0 && (
              <ul className="flex flex-wrap gap-2">
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
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href={mapLink} className={`${HOME_BTN_PRIMARY} flex-1`}>
                <MapPinIcon className="h-5 w-5 shrink-0" />
                {isGoods ? 'فروشگاه روی نقشه' : 'روی نقشه ببین'}
              </Link>
              <Link href={actionLink} className={`${HOME_BTN_SECONDARY} flex-1 border-teal-200`}>
                <ClipboardDocumentListIcon className="h-5 w-5 shrink-0 text-teal-600" />
                {actionLabel}
              </Link>
            </div>
          </div>
        </header>

        {!isGoods ? (
        <section className="mt-8 sm:mt-10" aria-labelledby="sub-experts-title">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 id="sub-experts-title" className={HOME_BLOCK_TITLE}>
                متخصص‌های این خدمت
              </h2>
              <p className={HOME_BLOCK_LEAD}>
                نمونه‌ای از فعال‌ها — برای بقیه نقشه را باز کنید.
              </p>
            </div>
            {experts.length > 0 && (
              <Link href={mapLink} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                همه روی نقشه ←
              </Link>
            )}
          </div>

          {loadingExperts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl border border-gray-200 bg-white animate-pulse"
                  aria-hidden
                />
              ))}
            </div>
          ) : experts.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {experts.map((expert) => {
                const name = getExpertPublicName(expert) || 'متخصص';
                return (
                  <li key={expert.id}>
                    <ExpertPreviewCard expert={expert} name={name} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
              <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" strokeWidth={1.5} />
              <p className="text-sm text-gray-600 mb-4">
                فعلاً متخصصی برای نمایش در این لیست نیست — روی نقشه جستجو کنید یا کار ثبت کنید.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={mapLink} className={HOME_BTN_PRIMARY}>
                  باز کردن نقشه
                </Link>
                <Link href={actionLink} className={HOME_BTN_SECONDARY}>
                  ثبت کار
                </Link>
              </div>
            </div>
          )}
        </section>
        ) : null}

        <FeaturedSlotsSection
          hint={
            isGoods
              ? 'جایگاه تبلیغ / فروشگاه ویژه برای همین دسته — بعداً پر می‌شود'
              : 'جایگاه تبلیغ / متخصص ویژه برای همین زیرخدمت — بعداً پر می‌شود'
          }
        />

        {parentSlug && (
          <p className="mt-8 text-center">
            <Link
              href={`/categories/${parentSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              <ArrowRightIcon className="h-4 w-4" />
              همهٔ زیر{isGoods ? 'دسته' : 'خدمت'}‌های {parentTitle}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
