'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  LinkIcon,
  PhotoIcon,
  SparklesIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { EXPERT_SIGNUP_CTA } from '../../copy/friendlyFa';
import { EXPERT_BLOCK_BOTTOM } from './homeExpertTheme';

const BENEFIT_ICONS = {
  profile: UserCircleIcon,
  portfolio: PhotoIcon,
  reach: UserGroupIcon,
  network: LinkIcon,
};

const NETWORK_IMAGE_WEBP = '/images/expert-network-banner.webp';
const NETWORK_IMAGE_PNG = '/images/expert-network-banner.png';

function ExpertNetworkBackdrop() {
  const [src, setSrc] = useState(NETWORK_IMAGE_WEBP);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const handleImageError = () => {
    if (src === NETWORK_IMAGE_WEBP) setSrc(NETWORK_IMAGE_PNG);
    else setHidden(true);
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* PNG شفاف + mix-blend-screen روی گرادیان teal — ابعاد با object-contain */}
      <img
        src={src}
        alt=""
        className="absolute max-h-[70%] max-w-[92%] object-contain mix-blend-screen opacity-[0.08] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:left-0 sm:top-auto sm:bottom-0 sm:h-full sm:max-h-none sm:w-auto sm:max-w-[min(52%,22rem)] sm:translate-x-0 sm:translate-y-0 sm:object-left-bottom sm:opacity-[0.22] sm:saturate-[0.85] sm:brightness-110 lg:max-w-[min(46%,26rem)] lg:opacity-[0.16]"
        onError={handleImageError}
      />
      <div
        className="absolute inset-0 bg-gradient-to-l from-teal-950/80 via-transparent to-transparent sm:from-teal-950/50"
        aria-hidden
      />
    </div>
  );
}

const BENEFITS = EXPERT_SIGNUP_CTA.benefits.map((item) => ({
  ...item,
  Icon: BENEFIT_ICONS[item.key] || SparklesIcon,
}));

function ExpertPageUrlPreview() {
  return (
    <div className="mx-auto mt-3 max-w-xl sm:mt-4 sm:max-w-2xl lg:mx-0 lg:max-w-[40rem]">
      <div className="inline-flex w-full max-w-full flex-col gap-2 rounded-xl border border-white/20 bg-black/15 px-3 py-2.5 text-right shadow-inner backdrop-blur-sm sm:inline-flex sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:px-4">
        <span className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-teal-100/80 sm:shrink-0 sm:text-[11px]">
          <GlobeAltIcon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          {EXPERT_SIGNUP_CTA.ctaPageLabel}
        </span>
        <span
          className="block truncate rounded-lg bg-white/10 px-2.5 py-1.5 text-left font-mono text-[11px] leading-none text-white ring-1 ring-white/10 sm:text-xs"
          dir="ltr"
        >
          {EXPERT_SIGNUP_CTA.ctaPageUrlHost}
          <span className="text-teal-100/90">{EXPERT_SIGNUP_CTA.ctaPageUrlPath}</span>
          <span className="text-teal-300">{EXPERT_SIGNUP_CTA.ctaPageUrlSlug}</span>
        </span>
      </div>
    </div>
  );
}

function BenefitCard({ title, description, Icon }) {
  return (
    <li className="flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-2.5 py-3 text-center ring-1 ring-white/10 transition hover:bg-white/[0.1] sm:min-h-[6.25rem] sm:px-3 sm:py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-100 sm:h-10 sm:w-10 sm:rounded-xl">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="min-w-0 w-full">
        <span className="block text-xs font-bold leading-tight text-white sm:text-sm">{title}</span>
        <span className="mt-0.5 block text-[10px] leading-snug text-teal-100/75 sm:text-[11px]">
          {description}
        </span>
      </span>
    </li>
  );
}

export default function HomeExpertSignupCta({ cityName = 'شهر شما', embedded = false }) {
  const content = (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />

      <ExpertNetworkBackdrop />

      <div className="relative z-10 px-4 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-10">
          <div className="relative min-w-0 flex-1 text-center lg:min-w-0 lg:text-right">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-teal-50 ring-1 ring-white/15 sm:px-3 sm:py-1.5 sm:text-xs">
              <UserCircleIcon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
              {EXPERT_SIGNUP_CTA.badge}
            </span>

            <h2
              id="expert-cta-heading"
              className="mx-auto mt-3 max-w-xl text-base font-bold leading-snug tracking-tight text-white sm:mt-4 sm:max-w-2xl sm:text-lg lg:mx-0 lg:max-w-none lg:text-xl xl:text-2xl"
            >
              {EXPERT_SIGNUP_CTA.title}
            </h2>

            <ExpertPageUrlPreview />

            <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-teal-50/90 sm:mt-4 sm:max-w-2xl sm:text-sm lg:mx-0 lg:max-w-[40rem] xl:max-w-[44rem]">
              {EXPERT_SIGNUP_CTA.bodyBeforeCity}
              <span className="font-semibold text-white">{cityName}</span>
              {EXPERT_SIGNUP_CTA.bodyAfterCity}
            </p>

            <ul
              className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2 sm:mt-6 sm:max-w-none sm:gap-2.5 lg:mt-7 lg:max-w-none lg:grid-cols-4 lg:gap-3"
              aria-label={EXPERT_SIGNUP_CTA.benefitsAriaLabel}
            >
              {BENEFITS.map(({ key, title, description, Icon }) => (
                <BenefitCard key={key} title={title} description={description} Icon={Icon} />
              ))}
            </ul>
          </div>

          <div className="flex w-full shrink-0 flex-col items-stretch justify-center gap-2 border-t border-white/10 pt-5 sm:gap-2.5 lg:w-[13.25rem] lg:border-t-0 lg:pt-0 xl:w-[14.5rem]">
            <Link
              href="/auth"
              scroll={false}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-teal-900 shadow-md transition hover:bg-teal-50 active:scale-[0.99] sm:py-4"
            >
              {EXPERT_SIGNUP_CTA.cta}
              <ArrowLeftIcon
                className="h-5 w-5 shrink-0 text-teal-700 transition group-hover:-translate-x-0.5"
                aria-hidden
              />
            </Link>
            <p className="text-center text-[11px] leading-relaxed text-teal-100/75 sm:text-xs">
              {EXPERT_SIGNUP_CTA.ctaHint}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <section
        className={`relative overflow-hidden ${EXPERT_BLOCK_BOTTOM}`}
        aria-labelledby="expert-cta-heading"
      >
        {content}
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 ${EXPERT_BLOCK_BOTTOM} shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]`}
      aria-labelledby="expert-cta-heading"
    >
      {content}
    </section>
  );
}
