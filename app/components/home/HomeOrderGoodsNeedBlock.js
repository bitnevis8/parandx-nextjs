'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { GOODS_NEED_INTRO } from '../../copy/goodsPageFa';
import { HOME_BTN_PRIMARY_BLOCK, HOME_PAGE_TITLE } from './homePageTheme';
import RegisterWorkSideIllustration from './RegisterWorkSideIllustration';

export default function HomeOrderGoodsNeedBlock({ connectTop = false }) {
  const shellClass = connectTop
    ? 'scroll-mt-28 relative flex flex-col overflow-hidden bg-white border-0 rounded-b-2xl'
    : 'scroll-mt-28 relative flex flex-col overflow-hidden bg-white border border-gray-200/90 border-b-0 rounded-2xl shadow-sm ring-1 ring-gray-100/80';

  return (
    <section
      id="home-path-need"
      className={shellClass}
      aria-labelledby="home-goods-need-headline"
    >
      <RegisterWorkSideIllustration />

      <div className="relative z-10 flex min-h-[22rem] flex-1 flex-col px-4 pt-12 pb-4 sm:min-h-[24rem] sm:px-6 sm:pt-14 sm:pb-6 lg:min-h-[26rem] lg:px-8 lg:pt-16 lg:pb-6 lg:ps-[min(46%,24rem)]">
        <div className="w-full space-y-3 text-right sm:space-y-4">
          <ShoppingBagIcon
            className="h-8 w-8 text-amber-600 sm:h-9 sm:w-9"
            strokeWidth={1.5}
            aria-hidden
          />

          <h2 id="home-goods-need-headline" className={HOME_PAGE_TITLE}>
            {GOODS_NEED_INTRO.title}
          </h2>

          <p className="w-full text-sm leading-relaxed text-justify text-gray-600 sm:text-[15px]">
            {GOODS_NEED_INTRO.body}
          </p>
        </div>

        <div className="mt-auto w-full pt-6 sm:pt-8">
          <Link
            href="/goods/needs/new"
            scroll={false}
            className={`${HOME_BTN_PRIMARY_BLOCK} group bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500`}
            aria-label={GOODS_NEED_INTRO.ariaLabel}
          >
            <span>{GOODS_NEED_INTRO.cta}</span>
            <ChevronLeftIcon
              className="h-5 w-5 shrink-0 transition group-hover:-translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
