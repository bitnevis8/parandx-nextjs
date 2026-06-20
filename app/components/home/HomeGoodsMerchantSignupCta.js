'use client';

import Link from 'next/link';
import {
  ArrowLeftIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhotoIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { GOODS_MERCHANT_SIGNUP_CTA } from '../../copy/goodsPageFa';
import {
  GOODS_FLOATING_PANEL_SHADOW,
  GOODS_MERCHANT_SIGNUP_SHELL,
} from './homeGoodsTheme';

const BENEFIT_ICONS = {
  profile: BuildingStorefrontIcon,
  vitrine: PhotoIcon,
  reach: MapPinIcon,
  needs: BellAlertIcon,
};

function MerchantSignupBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F2] via-[#F8F4EA] to-[#F5F0E6]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2E8B83]/6 via-transparent to-[#5A6B4E]/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(46,139,131,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(90,107,78,0.07),transparent_50%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2E8B83]/25 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-[#E8E2D6]/90" />
    </div>
  );
}

const BENEFITS = GOODS_MERCHANT_SIGNUP_CTA.benefits.map((item) => ({
  ...item,
  Icon: BENEFIT_ICONS[item.key] || SparklesIcon,
}));

function MerchantPageUrlPreview() {
  return (
    <div className="mx-auto mt-3 max-w-xl sm:mt-4 sm:max-w-2xl lg:mx-0 lg:max-w-[40rem]">
      <div className="inline-flex w-full max-w-full flex-col gap-2 rounded-xl border border-[#E5E1D8] bg-white/80 px-3 py-2.5 text-right shadow-sm sm:inline-flex sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:px-4">
        <span className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-[#44513E] sm:shrink-0 sm:text-[11px]">
          <GlobeAltIcon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          {GOODS_MERCHANT_SIGNUP_CTA.ctaPageLabel}
        </span>
        <span
          className="block truncate rounded-lg bg-[#FAF8F2] px-2.5 py-1.5 text-left font-mono text-[11px] leading-none text-[#5A6355] ring-1 ring-[#E5E1D8] sm:text-xs"
          dir="ltr"
        >
          {GOODS_MERCHANT_SIGNUP_CTA.ctaPageUrlHost}
          <span className="text-[#44513E]">{GOODS_MERCHANT_SIGNUP_CTA.ctaPageUrlPath}</span>
          <span className="text-[#2E8B83]">{GOODS_MERCHANT_SIGNUP_CTA.ctaPageUrlSlug}</span>
        </span>
      </div>
    </div>
  );
}

function BenefitCard({ title, description, Icon }) {
  return (
    <li className="flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl bg-white/70 px-2.5 py-3 text-center ring-1 ring-[#E5E1D8] transition hover:bg-white sm:min-h-[6.25rem] sm:px-3 sm:py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2E8B83]/10 text-[#2E8B83] sm:h-10 sm:w-10 sm:rounded-xl">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="min-w-0 w-full">
        <span className="block text-xs font-bold leading-tight text-[#44513E] sm:text-sm">{title}</span>
        <span className="mt-0.5 block text-[10px] leading-snug text-[#5A6355] sm:text-[11px]">
          {description}
        </span>
      </span>
    </li>
  );
}

export default function HomeGoodsMerchantSignupCta({ cityName = 'شهر شما', embedded = false }) {
  const content = (
    <>
      <MerchantSignupBackdrop />

      <div className="relative z-10 px-4 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-10">
          <div className="relative min-w-0 flex-1 text-center lg:min-w-0 lg:text-right">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1 text-[11px] font-medium text-[#5A6B4E] ring-1 ring-[#E5E1D8] sm:px-3 sm:py-1.5 sm:text-xs">
              <BuildingStorefrontIcon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
              {GOODS_MERCHANT_SIGNUP_CTA.badge}
            </span>

            <h2
              id="goods-merchant-cta-heading"
              className="mx-auto mt-3 max-w-xl text-base font-bold leading-snug tracking-tight text-[#44513E] sm:mt-4 sm:max-w-2xl sm:text-lg lg:mx-0 lg:max-w-none lg:text-xl xl:text-2xl"
            >
              {GOODS_MERCHANT_SIGNUP_CTA.title}
            </h2>

            <MerchantPageUrlPreview />

            <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-[#5A6355] sm:mt-4 sm:max-w-2xl sm:text-sm lg:mx-0 lg:max-w-[40rem] xl:max-w-[44rem]">
              {GOODS_MERCHANT_SIGNUP_CTA.bodyBeforeCity}
              <span className="font-semibold text-[#44513E]">{cityName}</span>
              {GOODS_MERCHANT_SIGNUP_CTA.bodyAfterCity}
            </p>

            <ul
              className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2 sm:mt-6 sm:max-w-none sm:gap-2.5 lg:mt-7 lg:max-w-none lg:grid-cols-4 lg:gap-3"
              aria-label={GOODS_MERCHANT_SIGNUP_CTA.benefitsAriaLabel}
            >
              {BENEFITS.map(({ key, title, description, Icon }) => (
                <BenefitCard key={key} title={title} description={description} Icon={Icon} />
              ))}
            </ul>
          </div>

          <div className="flex w-full shrink-0 flex-col items-stretch justify-center gap-2 border-t border-[#E5E1D8] pt-5 sm:gap-2.5 lg:w-[13.25rem] lg:border-t-0 lg:pt-0 xl:w-[14.5rem]">
            <Link
              href="/dashboard?tab=merchant-edit"
              scroll={false}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E8B83] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2E8B83]/20 transition hover:bg-[#267A73] active:scale-[0.99] sm:py-4"
            >
              {GOODS_MERCHANT_SIGNUP_CTA.cta}
              <ArrowLeftIcon
                className="h-5 w-5 shrink-0 text-white/90 transition group-hover:-translate-x-0.5"
                aria-hidden
              />
            </Link>
            <p className="text-center text-[11px] leading-relaxed text-[#6B7564] sm:text-xs">
              {GOODS_MERCHANT_SIGNUP_CTA.ctaHint}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <section
        className={`relative mx-3 overflow-hidden rounded-2xl sm:mx-5 ${GOODS_MERCHANT_SIGNUP_SHELL} ${GOODS_FLOATING_PANEL_SHADOW}`}
        aria-labelledby="goods-merchant-cta-heading"
      >
        {content}
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-[#E5E1D8] ${GOODS_MERCHANT_SIGNUP_SHELL} ${GOODS_FLOATING_PANEL_SHADOW}`}
      aria-labelledby="goods-merchant-cta-heading"
    >
      {content}
    </section>
  );
}
