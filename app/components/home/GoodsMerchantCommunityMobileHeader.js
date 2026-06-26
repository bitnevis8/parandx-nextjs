'use client';

import {
  buildGoodsMerchantCommunityMobileTitle,
  GOODS_MERCHANT_COMMUNITY_HEADER,
} from '../../copy/goodsPageFa';
import ExpertFreeRibbon from './ExpertFreeRibbon';

export default function GoodsMerchantCommunityMobileHeader({ cityName = '' }) {
  const title = buildGoodsMerchantCommunityMobileTitle(cityName);

  return (
    <header
      className="relative flex min-h-[3.5rem] items-center overflow-hidden border-b border-gray-200/90 bg-gradient-to-l from-amber-50/80 via-white to-white px-4 py-4 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 sm:hidden"
      dir="rtl"
    >
      <ExpertFreeRibbon label={GOODS_MERCHANT_COMMUNITY_HEADER.mobileRibbon} />
      <h2 className="relative z-[1] w-full pe-1 text-right text-base font-bold leading-snug text-gray-900 dark:text-slate-50">
        {title}
      </h2>
    </header>
  );
}
