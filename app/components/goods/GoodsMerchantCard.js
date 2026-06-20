'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  merchantCategoryMeta,
  merchantDisplayAddress,
  merchantDisplayName,
  merchantStorePagePath,
  merchantStorePageUrlFull,
  merchantStorePublicHref,
  merchantStoreCardImage,
} from '../../utils/merchantDisplayUtils';
import MerchantRatingBadge from './MerchantRatingBadge';

export const STORE_CARD_IMAGE_OPEN = '/images/store-open.png';
export const STORE_CARD_IMAGE_CLOSED = '/images/store-close.png';

const CARD_SHELL =
  'group relative block w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/80 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-amber-300/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40';

const TEXT_ON_STORE =
  'text-gray-900 [text-shadow:0_1px_0_rgba(255,255,255,0.95),0_0_8px_rgba(255,255,255,0.65)]';

export default function GoodsMerchantCard({ merchant, className = '' }) {
  const [storeImgFailed, setStoreImgFailed] = useState(false);

  const name = merchantDisplayName(merchant);
  const address = merchantDisplayAddress(merchant);
  const storePagePath = merchantStorePagePath(merchant);
  const storePageUrlFull = merchantStorePageUrlFull(merchant);
  const { icon: categoryIcon, title: categoryTitle } = merchantCategoryMeta(merchant);
  const storeImage = merchantStoreCardImage(merchant);

  return (
    <Link
      href={merchantStorePublicHref(merchant)}
      className={`${CARD_SHELL} ${className}`.trim()}
      aria-label={`مشاهده فروشگاه ${name}`}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={storeImgFailed ? STORE_CARD_IMAGE_CLOSED : storeImage}
        alt=""
        className="block w-full h-auto select-none pointer-events-none"
        onError={() => setStoreImgFailed(true)}
      />

      <div className="absolute inset-0 pointer-events-none">
        {/* آیکون زیردسته — کمی پایین‌تر از قبل */}
        <span
          className={`absolute top-[14%] right-[8%] flex h-7 w-7 items-center justify-center text-lg leading-none sm:h-8 sm:w-8 sm:text-xl ${TEXT_ON_STORE}`}
        >
          {categoryIcon}
        </span>

        {/* عنوان زیردسته — وسط، کمی پایین‌تر */}
        {categoryTitle ? (
          <p
            className={`absolute top-[14%] left-1/2 w-[72%] -translate-x-1/2 truncate text-center text-[9px] font-semibold leading-tight sm:text-[10px] ${TEXT_ON_STORE}`}
          >
            {categoryTitle}
          </p>
        ) : null}

        {/* آدرس کوتاه صفحه فروشگاه — هاور: لینک کامل */}
        <div className="pointer-events-auto absolute top-[38%] left-1/2 z-10 w-[90%] -translate-x-1/2 group/page">
          <p
            className={`truncate text-center font-mono text-[10px] font-bold leading-tight sm:text-[11px] ${TEXT_ON_STORE}`}
            dir="ltr"
          >
            {storePagePath}
          </p>
          <span
            className="pointer-events-none absolute top-full left-1/2 z-20 mt-1 hidden max-w-[14rem] -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900/95 px-2.5 py-1.5 text-center font-mono text-[9px] leading-none text-white shadow-lg ring-1 ring-white/10 group-hover/page:block sm:text-[10px]"
            dir="ltr"
            role="tooltip"
          >
            {storePageUrlFull}
          </span>
        </div>

        {/* وسط کارت — فقط نام فروشگاه */}
        <p className="absolute top-[60%] left-1/2 w-[84%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-[9px] font-semibold leading-snug text-gray-100 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] sm:text-[10px]">
          {name}
        </p>

        {/* آدرس فروشگاه — هاور: آدرس کامل */}
        {address ? (
          <div className="pointer-events-auto absolute top-[72%] left-1/2 z-10 w-[88%] -translate-x-1/2 group/addr">
            <p className="line-clamp-2 text-center text-[8px] font-medium leading-tight text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.65)] sm:text-[9px]">
              📍 {address}
            </p>
            <span
              className="pointer-events-none absolute top-full left-1/2 z-20 mt-1 hidden max-w-[14rem] -translate-x-1/2 rounded-lg bg-gray-900/95 px-2.5 py-1.5 text-center text-[9px] leading-snug text-white shadow-lg ring-1 ring-white/10 group-hover/addr:block sm:text-[10px]"
              role="tooltip"
            >
              📍 {merchant?.location || address}
            </span>
          </div>
        ) : null}

        {/* امتیاز — فعلاً فیک */}
        <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2">
          <MerchantRatingBadge merchant={merchant} variant="card" />
        </div>
      </div>
    </Link>
  );
}

export function GoodsMerchantCardSkeleton({ className = '' }) {
  return (
    <div
      className={`relative block w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200/80 ${className}`.trim()}
      aria-hidden
    >
      <div className="aspect-[3/4] w-full animate-pulse bg-gradient-to-b from-gray-100 via-gray-200/70 to-gray-100" />
    </div>
  );
}

/** عرض پایه کارت فروشگاه — ۴۰٪ بزرگ‌تر از اندازه اولیه */
export const STORE_CARD_SCROLL_WIDTH =
  'w-[10.875rem] min-w-[10.875rem] sm:w-[12rem] sm:min-w-[12rem]';

export const STORE_CARD_GRID_WIDTH =
  'w-[10.875rem] max-w-full mx-auto sm:w-[12rem]';
