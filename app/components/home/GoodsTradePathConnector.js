'use client';

import Link from 'next/link';
import { ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';
import { GOODS_NEED_INTRO, GOODS_SUPPLY_INTRO } from '../../copy/goodsPageFa';

export default function GoodsTradePathConnector() {
  return (
    <div
      className="border-y border-gray-200 bg-white px-6 py-4 sm:px-8 sm:py-4"
      aria-label="ثبت آگهی"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 sm:text-sm">
          <ShoppingBagIcon className="h-4 w-4 text-amber-600" aria-hidden />
          {GOODS_NEED_INTRO.title}
        </span>

        <span className="hidden text-gray-300 sm:inline" aria-hidden>
          |
        </span>

        <Link
          href="/divar/new"
          className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800 ring-1 ring-gray-200 transition hover:bg-violet-50 hover:text-violet-800 hover:ring-violet-200 sm:px-4 sm:text-sm"
        >
          ثبت آگهی
        </Link>

        <span className="hidden text-gray-300 sm:inline" aria-hidden>
          |
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-800 sm:text-sm">
          <TagIcon className="h-4 w-4 text-violet-600" aria-hidden />
          {GOODS_SUPPLY_INTRO.title}
        </span>
      </div>
    </div>
  );
}
