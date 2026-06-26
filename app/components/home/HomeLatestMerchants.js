'use client';

import { useEffect, useState } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import GoodsMerchantCard, {
  GoodsMerchantCardSkeleton,
  STORE_CARD_SCROLL_WIDTH,
} from '../goods/GoodsMerchantCard';
import { HOME_BLOCK_LEAD, HOME_BLOCK_TITLE } from './homePageTheme';
import { GOODS_BLOCK_TOP } from './homeGoodsTheme';
import LatestGoodsIllustration from './LatestGoodsIllustration';

const LATEST_LIMIT = 5;

function LatestMerchantsMobileLayout({ city, merchants, loading }) {
  return (
    <div className="relative flex min-h-[13.5rem] flex-col sm:hidden min-[420px]:min-h-[15rem]">
      <div className="shrink-0 text-right">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300 min-[420px]:text-[15px]">
          جدیدترین فروشگاه‌های{' '}
          <span className="font-semibold text-amber-800 dark:text-amber-100">{city.name}</span>
        </p>
      </div>

      {!loading && merchants.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-gray-200 bg-white px-3 py-4 text-xs leading-relaxed text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          فعلاً تو {city.name} فروشگاهی ثبت نشده.
        </p>
      ) : (
        <div className="mt-auto pt-3 min-[420px]:pt-4">
          <div className="flex w-full justify-center">
            <LatestGoodsIllustration placement="mobile-stack" />
          </div>

          <div className="-mx-1 mt-3 px-1 pb-2 min-[420px]:mt-3.5 min-[420px]:pb-3">
            {loading ? (
              <div className="flex min-h-[13.25rem] gap-3 overflow-hidden pb-1">
                {Array.from({ length: LATEST_LIMIT }).map((_, i) => (
                  <GoodsMerchantCardSkeleton key={i} className={`${STORE_CARD_SCROLL_WIDTH} shrink-0`} />
                ))}
              </div>
            ) : (
              <ul
                className="inline-flex min-h-[13.25rem] list-none items-end gap-3 overflow-x-auto pb-0 scroll-smooth min-[420px]:min-h-[14.75rem] min-[420px]:gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/80 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
                aria-label="فهرست فروشگاه‌ها"
              >
                {merchants.map((merchant) => (
                  <li key={merchant.id} className={`shrink-0 ${STORE_CARD_SCROLL_WIDTH}`}>
                    <GoodsMerchantCard merchant={merchant} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LatestMerchantsDesktopLayout({ city, merchants, loading }) {
  return (
    <div className="hidden sm:block">
      <div className="flex items-center gap-3 text-right">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/80 dark:bg-slate-800 dark:text-amber-400 dark:ring-slate-700">
          <BuildingStorefrontIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className={HOME_BLOCK_TITLE}>فروشگاه‌ها</h3>
          <p className={HOME_BLOCK_LEAD}>
            جدیدترین فروشگاه‌های{' '}
            <span className="font-medium text-amber-800 dark:text-amber-200">{city.name}</span>
          </p>
        </div>
      </div>

      <div className="-mx-1 mt-5 px-1 pb-4 sm:pb-5 lg:pb-6">
        {loading ? (
          <div className="flex min-h-[13.25rem] gap-3 overflow-hidden pb-1 sm:min-h-[14.75rem] sm:gap-3.5">
            {Array.from({ length: LATEST_LIMIT }).map((_, i) => (
              <GoodsMerchantCardSkeleton key={i} className={`${STORE_CARD_SCROLL_WIDTH} shrink-0`} />
            ))}
          </div>
        ) : merchants.length === 0 ? (
          <p className="flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            فعلاً تو {city.name} فروشگاهی ثبت نشده — به‌زودی پر می‌شه.
          </p>
        ) : (
          <ul
            className="flex min-h-[13.25rem] list-none gap-3 overflow-x-auto pb-1 scroll-smooth sm:min-h-[14.75rem] sm:gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/80 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
            aria-label="فهرست فروشگاه‌ها"
          >
            {merchants.map((merchant) => (
              <li key={merchant.id} className={`shrink-0 ${STORE_CARD_SCROLL_WIDTH}`}>
                <GoodsMerchantCard merchant={merchant} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function HomeLatestMerchants({ city, embedded = false }) {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city?.id) {
      setMerchants([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetch(API_ENDPOINTS.merchants.getBrowse(city.id, null, LATEST_LIMIT))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json.data) ? json.data : [];
        setMerchants(list.slice(0, LATEST_LIMIT));
      })
      .catch(() => {
        if (!cancelled) setMerchants([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city?.id]);

  if (!city?.id) return null;

  const inner = (
    <div
      className={`relative overflow-hidden px-4 pt-5 sm:px-8 sm:pt-7 ${
        embedded ? `${GOODS_BLOCK_TOP} pb-5 sm:pb-6 lg:pb-7` : 'py-6 sm:py-7'
      }`}
    >
      <LatestMerchantsMobileLayout city={city} merchants={merchants} loading={loading} />
      <LatestMerchantsDesktopLayout city={city} merchants={merchants} loading={loading} />
    </div>
  );

  if (embedded) return inner;

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
        {inner}
      </div>
    </div>
  );
}
