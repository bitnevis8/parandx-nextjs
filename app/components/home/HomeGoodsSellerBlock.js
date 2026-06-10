'use client';

import Link from 'next/link';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { GOODS_SELLER_CTA, GOODS_SELLER_HEADER } from '../../copy/goodsPageFa';
import HomeSectionHeader from './HomeSectionHeader';
import { EXPERT_BLOCK_SHELL } from './homeExpertTheme';
import { HOME_BTN_PRIMARY } from './homePageTheme';

export default function HomeGoodsSellerBlock({ cityName = 'شهر شما' }) {
  return (
    <div id="home-path-seller" className={`${EXPERT_BLOCK_SHELL} scroll-mt-28`}>
      <HomeSectionHeader
        icon={BuildingStorefrontIcon}
        title={GOODS_SELLER_HEADER.title}
        description={GOODS_SELLER_HEADER.description}
        iconClassName="!bg-amber-600 !text-white"
      />

      <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-5 sm:p-6">
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
          {GOODS_SELLER_CTA.badge}
        </span>
        <h3 className="mt-3 text-lg font-bold text-gray-900">{GOODS_SELLER_CTA.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {GOODS_SELLER_CTA.bodyBeforeCity}
          <span className="font-semibold text-gray-800">{cityName}</span>
          {GOODS_SELLER_CTA.bodyAfterCity}
        </p>

        <ul
          className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5"
          aria-label={GOODS_SELLER_CTA.benefitsAriaLabel}
        >
          {GOODS_SELLER_CTA.benefits.map((benefit) => (
            <li
              key={benefit.key}
              className="rounded-xl border border-amber-100/80 bg-white/80 px-3 py-2.5"
            >
              <span className="block text-xs font-bold text-gray-900 sm:text-[13px]">
                {benefit.title}
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                {benefit.description}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/dashboard?tab=merchant-edit"
            scroll={false}
            className={`${HOME_BTN_PRIMARY} bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500`}
          >
            {GOODS_SELLER_CTA.cta}
          </Link>
          <span className="text-xs text-gray-500">{GOODS_SELLER_CTA.ctaHint}</span>
        </div>
      </div>
    </div>
  );
}
