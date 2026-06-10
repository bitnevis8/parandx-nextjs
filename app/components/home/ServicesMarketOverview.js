'use client';

import { CheckIcon, UserIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { SERVICES_MARKET_OVERVIEW } from '../../copy/friendlyFa';
import { focusHomePath } from '../../utils/homePathFocus';

function RoleCard({ icon: Icon, title, items, accent = 'client', onAction = null, actionLabel = null }) {
  const isExpert = accent === 'expert';
  const iconWrap = isExpert ? 'bg-teal-100 text-teal-700' : 'bg-teal-50 text-teal-700';
  const checkClass = 'text-teal-600';
  const actionClass = 'text-teal-700 hover:text-teal-800 focus-visible:ring-teal-500/40';

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
          className={`mt-3 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-[13px] ${actionClass}`}
        >
          {actionLabel}
        </button>
      ) : null}
    </article>
  );
}

export default function ServicesMarketOverview() {
  return (
    <section className="w-full text-right" aria-labelledby="services-market-overview-title">
      <p id="services-market-overview-title" className="mb-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
        {SERVICES_MARKET_OVERVIEW.tagline}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <RoleCard
          icon={UserIcon}
          title={SERVICES_MARKET_OVERVIEW.client.title}
          items={SERVICES_MARKET_OVERVIEW.client.items}
          accent="client"
        />
        <RoleCard
          icon={WrenchScrewdriverIcon}
          title={SERVICES_MARKET_OVERVIEW.expert.title}
          items={SERVICES_MARKET_OVERVIEW.expert.items}
          accent="expert"
          actionLabel="رفتن به بخش ثبت‌نام متخصص"
          onAction={() => focusHomePath([SERVICES_MARKET_OVERVIEW.expert.ctaScrollTarget])}
        />
      </div>
    </section>
  );
}
