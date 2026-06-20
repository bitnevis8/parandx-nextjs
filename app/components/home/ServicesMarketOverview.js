'use client';

import { CheckIcon, UserIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { SERVICES_MARKET_OVERVIEW } from '../../copy/friendlyFa';
import { focusHomePath } from '../../utils/homePathFocus';

function ExpertSignupButton({ onAction, label, compact = false }) {
  if (compact) {
    return (
      <div className="mt-auto border-t border-gray-100 pt-2 dark:border-sky-800">
        <button
          type="button"
          onClick={onAction}
          className="flex w-full items-center justify-center rounded-lg bg-teal-600 px-2 py-1.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-sky-900 min-[420px]:py-2 min-[420px]:text-[11px]"
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onAction}
      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.995] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-sky-900"
    >
      {label}
    </button>
  );
}

function RoleCard({
  icon: Icon,
  title,
  items,
  accent = 'client',
  onAction = null,
  actionLabel = null,
  compact = false,
}) {
  const isExpert = accent === 'expert';
  const iconWrap = isExpert
    ? 'bg-teal-100 text-teal-700 dark:bg-sky-800 dark:text-sky-100 dark:ring-1 dark:ring-sky-600'
    : 'bg-teal-50 text-teal-700 dark:bg-sky-800 dark:text-sky-200';
  const checkClass = 'text-teal-600 dark:text-sky-300';
  const cardBorder = isExpert
    ? 'border-gray-200/90 dark:border-sky-600'
    : 'border-gray-200/90 dark:border-sky-800';
  const cardShell = compact
    ? `flex min-h-full flex-col rounded-xl border ${cardBorder} bg-white p-2.5 text-right shadow-sm ring-1 ring-gray-100/80 dark:bg-sky-900 dark:ring-sky-800/60 min-[420px]:p-3`
    : `flex min-h-full flex-col rounded-2xl border ${cardBorder} bg-white p-4 shadow-sm ring-1 ring-gray-100/80 dark:bg-sky-900 dark:ring-sky-800/60 sm:p-5`;

  if (compact) {
    return (
      <article className={cardShell}>
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconWrap}`}
            aria-hidden
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <h3 className="min-w-0 text-xs font-bold leading-snug text-gray-900 dark:text-sky-50 min-[420px]:text-[13px]">
            {title}
          </h3>
        </div>

        <ul className="mt-2 flex-1 space-y-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-1.5 text-[10px] leading-relaxed text-gray-600 dark:text-sky-300 min-[420px]:text-[11px]"
            >
              <CheckIcon
                className={`mt-0.5 h-3 w-3 shrink-0 ${checkClass}`}
                strokeWidth={2.25}
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {onAction && actionLabel ? (
          <ExpertSignupButton compact onAction={onAction} label={actionLabel} />
        ) : null}
      </article>
    );
  }

  return (
    <article className={cardShell}>
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
          aria-hidden
        >
          <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
        </span>
        <h3 className="text-sm font-bold text-gray-900 dark:text-sky-50 sm:text-base">{title}</h3>
      </div>

      <ul className="mt-3 flex-1 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs leading-relaxed text-gray-600 dark:text-sky-300 sm:text-[13px]"
          >
            <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${checkClass}`} strokeWidth={2.25} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {onAction && actionLabel ? (
        <ExpertSignupButton onAction={onAction} label={actionLabel} />
      ) : null}
    </article>
  );
}

const expertCtaProps = {
  actionLabel: SERVICES_MARKET_OVERVIEW.expert.ctaLabel,
  onAction: () => focusHomePath([SERVICES_MARKET_OVERVIEW.expert.ctaScrollTarget]),
};

/** موبایل — دو ستون زیر عکس: کاربر راست، متخصص چپ */
export function ServicesMobileRoleCards() {
  return (
    <div className="grid grid-cols-2 gap-2 min-[420px]:gap-2.5 md:hidden">
      <RoleCard
        compact
        icon={UserIcon}
        title={SERVICES_MARKET_OVERVIEW.client.title}
        items={SERVICES_MARKET_OVERVIEW.client.items}
        accent="client"
      />
      <RoleCard
        compact
        icon={WrenchScrewdriverIcon}
        title={SERVICES_MARKET_OVERVIEW.expert.title}
        items={SERVICES_MARKET_OVERVIEW.expert.items}
        accent="expert"
        {...expertCtaProps}
      />
    </div>
  );
}

export default function ServicesMarketOverview() {
  return (
    <section className="hidden w-full text-right md:block" aria-labelledby="services-market-overview-title">
      <p id="services-market-overview-title" className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-sky-300">
        {SERVICES_MARKET_OVERVIEW.tagline}
      </p>

      <div className="grid grid-cols-2 gap-4">
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
          {...expertCtaProps}
        />
      </div>
    </section>
  );
}
