'use client';

import { CheckIcon, ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { GOODS_MARKET_OVERVIEW } from '../../copy/goodsPageFa';
import { focusHomePath } from '../../utils/homePathFocus';

function RoleCard({ icon: Icon, title, items, accent = 'buyer', onAction = null, actionLabel = null }) {
  const isSeller = accent === 'seller';
  const iconWrap = isSeller
    ? 'bg-amber-100 text-amber-700'
    : 'bg-teal-50 text-teal-700';
  const checkClass = isSeller ? 'text-amber-600' : 'text-teal-600';

  return (
    <article className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm ring-1 ring-gray-100/80 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
          aria-hidden
        >
          <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
        </span>
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">{title}</h3>
      </div>

      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-gray-600 sm:text-[13px]">
            <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${checkClass}`} strokeWidth={2.25} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {onAction && actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 text-xs font-semibold text-amber-700 transition hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 sm:text-[13px]"
        >
          {actionLabel}
        </button>
      ) : null}
    </article>
  );
}

export default function GoodsMarketOverview() {
  return (
    <section className="w-full text-right" aria-labelledby="goods-market-overview-title">
      <p id="goods-market-overview-title" className="mb-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
        {GOODS_MARKET_OVERVIEW.tagline}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <RoleCard
          icon={ShoppingBagIcon}
          title={GOODS_MARKET_OVERVIEW.buyer.title}
          items={GOODS_MARKET_OVERVIEW.buyer.items}
          accent="buyer"
        />
        <RoleCard
          icon={BuildingStorefrontIcon}
          title={GOODS_MARKET_OVERVIEW.seller.title}
          items={GOODS_MARKET_OVERVIEW.seller.items}
          accent="seller"
          actionLabel="رفتن به بخش ثبت فروشگاه"
          onAction={() => focusHomePath([GOODS_MARKET_OVERVIEW.seller.ctaScrollTarget])}
        />
      </div>
    </section>
  );
}
