'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';
import { GOODS_NEED_INTRO, GOODS_SUPPLY_INTRO } from '../../copy/goodsPageFa';

const CARDS = [
  {
    id: 'home-path-need',
    intro: GOODS_NEED_INTRO,
    href: '/goods/needs/new',
    Icon: ShoppingBagIcon,
    accent: {
      shell: 'border-amber-100/90 bg-amber-50/40 hover:border-amber-200/90 hover:bg-amber-50/70',
      icon: 'bg-amber-100 text-amber-700 ring-amber-200/70',
      cta: 'text-amber-700 group-hover:text-amber-800',
    },
  },
  {
    id: 'home-path-supply',
    intro: GOODS_SUPPLY_INTRO,
    href: '/goods/supplies/new',
    Icon: TagIcon,
    accent: {
      shell: 'border-violet-100/90 bg-violet-50/35 hover:border-violet-200/90 hover:bg-violet-50/60',
      icon: 'bg-violet-100 text-violet-700 ring-violet-200/70',
      cta: 'text-violet-700 group-hover:text-violet-800',
    },
  },
];

function TradePathCompactCard({ id, intro, href, Icon, accent }) {
  return (
    <Link
      id={id}
      href={href}
      scroll={false}
      className={`group scroll-mt-28 flex min-h-[7.5rem] flex-col rounded-2xl border p-4 text-right shadow-sm ring-1 ring-gray-100/60 transition duration-200 hover:shadow-md sm:min-h-[8rem] sm:p-5 ${accent.shell}`}
      aria-label={intro.ariaLabel}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${accent.icon}`}
          aria-hidden
        >
          <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">{intro.title}</h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:text-[13px]">
            {intro.body}
          </p>
        </div>
      </div>

      <span
        className={`mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold sm:text-[13px] ${accent.cta}`}
      >
        {intro.cta}
        <ArrowLeftIcon
          className="h-3.5 w-3.5 shrink-0 transition group-hover:-translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

/** دو باکس «کالا نیاز دارم / برای فروش دارم» — زیر ثبت فروشگاه */
export default function HomeGoodsTradePathsRow() {
  return (
    <section
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
      aria-label="ثبت نیاز و عرضه کالا"
    >
      {CARDS.map((card) => (
        <TradePathCompactCard key={card.id} {...card} />
      ))}
    </section>
  );
}
