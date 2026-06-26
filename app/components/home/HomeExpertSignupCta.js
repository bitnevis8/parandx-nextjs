'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  MapPinIcon,
  SparklesIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { EXPERT_SIGNUP_CTA } from '../../copy/friendlyFa';
import { EXPERT_BLOCK_BOTTOM } from './homeExpertTheme';

const BENEFIT_ICONS = {
  page: GlobeAltIcon,
  visibility: MapPinIcon,
  network: UserGroupIcon,
  jobs: BriefcaseIcon,
};

const SIGNUP_ILLUSTRATION = '/images/latest-experts-illustration.webp';

function ExpertNetworkBackdrop() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden dark:opacity-40 max-sm:opacity-30"
      aria-hidden
    >
      <img
        src={SIGNUP_ILLUSTRATION}
        alt=""
        className="absolute max-h-[70%] max-w-[92%] object-contain mix-blend-screen opacity-[0.08] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:opacity-[0.06] max-sm:hidden sm:left-0 sm:top-auto sm:bottom-0 sm:h-full sm:max-h-none sm:w-auto sm:max-w-[min(52%,22rem)] sm:translate-x-0 sm:translate-y-0 sm:object-left-bottom sm:opacity-[0.22] sm:saturate-[0.85] sm:brightness-110 sm:dark:opacity-[0.12] lg:max-w-[min(46%,26rem)] lg:opacity-[0.16] lg:dark:opacity-[0.1]"
        onError={() => setHidden(true)}
      />
      <div
        className="absolute inset-0 bg-gradient-to-l from-teal-950/80 via-transparent to-transparent dark:from-sky-950/90 sm:from-teal-950/50 sm:dark:from-slate-900/80"
        aria-hidden
      />
    </div>
  );
}

function ExpertSignupMobileImage() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="pointer-events-none flex justify-center px-2 sm:hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SIGNUP_ILLUSTRATION}
        alt=""
        className="h-[7.5rem] w-auto max-w-[min(100%,14rem)] object-contain object-bottom opacity-90 [mask-image:linear-gradient(to_bottom,black_68%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_68%,transparent_100%)] min-[420px]:h-[8.5rem] min-[420px]:max-w-[16rem]"
        onError={() => setHidden(true)}
      />
    </div>
  );
}

const BENEFITS = EXPERT_SIGNUP_CTA.benefits.map((item) => ({
  ...item,
  Icon: BENEFIT_ICONS[item.key] || SparklesIcon,
}));

const JOBS_BENEFIT = {
  ...EXPERT_SIGNUP_CTA.benefitJobs,
  Icon: BENEFIT_ICONS.jobs,
};

function ExpertPageUrlPreview({ className = '' }) {
  return (
    <div className={`w-full text-right ${className}`}>
      <span className="mb-2 flex items-center justify-start gap-1.5 text-[11px] font-semibold text-teal-50 dark:text-sky-200 sm:text-xs">
        <GlobeAltIcon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
        {EXPERT_SIGNUP_CTA.ctaPageLabel}
      </span>
      <div
        className="w-full truncate rounded-xl border border-white/20 bg-black/15 px-3 py-2.5 text-left font-mono text-[13px] leading-snug text-white shadow-inner backdrop-blur-sm dark:border-sky-700 dark:bg-slate-900/80 sm:px-4 sm:py-3 sm:text-sm"
        dir="ltr"
      >
        {EXPERT_SIGNUP_CTA.ctaPageUrlHost}
        <span className="text-teal-100/90 dark:text-sky-200">{EXPERT_SIGNUP_CTA.ctaPageUrlPath}</span>
        <span className="text-teal-300 dark:text-sky-100">{EXPERT_SIGNUP_CTA.ctaPageUrlSlug}</span>
      </div>
    </div>
  );
}

function SignupBodyText({ className = '' }) {
  return (
    <div className={`space-y-1.5 text-right text-[13px] leading-relaxed text-teal-50/90 dark:text-sky-300 sm:text-sm ${className}`}>
      {EXPERT_SIGNUP_CTA.bodyLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function BenefitCard({ title, description, Icon, mobile = false }) {
  return (
    <li
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/[0.07] px-2 py-2.5 text-center ring-1 ring-white/10 dark:bg-slate-800/70 dark:ring-sky-800 sm:gap-2 sm:px-2.5 sm:py-3 ${
        mobile ? 'min-h-[4.5rem]' : 'min-h-[5.25rem] sm:min-h-[5.75rem]'
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-100 dark:bg-sky-800 dark:text-sky-200 sm:h-9 sm:w-9">
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="min-w-0 w-full">
        <span className="block text-[11px] font-bold leading-tight text-white dark:text-sky-50 sm:text-xs">
          {title}
        </span>
        <span className="mt-0.5 block text-[9px] leading-snug text-teal-100/75 dark:text-sky-300 sm:text-[10px]">
          {description}
        </span>
      </span>
    </li>
  );
}

function SignupBenefitsGrid({ mobile = false, className = '' }) {
  return (
    <ul
      className={`grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 lg:gap-3 ${className}`}
      aria-label={EXPERT_SIGNUP_CTA.benefitsAriaLabel}
    >
      {BENEFITS.map(({ key, title, description, Icon }) => (
        <BenefitCard key={key} title={title} description={description} Icon={Icon} mobile={mobile} />
      ))}
      <BenefitCard
        key={JOBS_BENEFIT.key}
        title={JOBS_BENEFIT.title}
        description={JOBS_BENEFIT.description}
        Icon={JOBS_BENEFIT.Icon}
        mobile={mobile}
      />
    </ul>
  );
}

function SignupCtaButton({ className = '' }) {
  return (
    <Link
      href="/auth"
      scroll={false}
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-5 py-3.5 text-sm font-bold text-amber-950 shadow-[0_4px_16px_rgba(245,158,11,0.38)] ring-1 ring-amber-200/80 transition hover:from-amber-300 hover:via-amber-200 hover:to-amber-300 hover:shadow-[0_6px_20px_rgba(245,158,11,0.45)] active:scale-[0.99] dark:from-amber-300 dark:via-amber-200 dark:to-amber-300 dark:text-amber-950 dark:ring-amber-100/40 dark:shadow-amber-900/45 sm:py-4 ${className}`}
      aria-label={EXPERT_SIGNUP_CTA.ctaAriaLabel}
    >
      {EXPERT_SIGNUP_CTA.cta}
      <ArrowLeftIcon
        className="h-5 w-5 shrink-0 text-amber-900/85 transition group-hover:-translate-x-0.5 dark:text-amber-950"
        aria-hidden
      />
    </Link>
  );
}

function SignupMobileLayout() {
  return (
    <div className="flex flex-col sm:hidden">
      <ExpertPageUrlPreview />
      <SignupBodyText className="mt-3" />
      <SignupBenefitsGrid mobile className="mt-4" />
      <ExpertSignupMobileImage />
      <div className="mt-5 px-1 pb-4 pt-1 text-center">
        <SignupCtaButton className="mx-auto max-w-sm" />
      </div>
    </div>
  );
}

function SignupDesktopLayout() {
  return (
    <div className="hidden flex-col gap-6 sm:flex sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8 xl:gap-10">
      <div className="relative min-w-0 flex-1 text-center lg:min-w-0 lg:text-right">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-teal-50 ring-1 ring-white/15 dark:bg-slate-800 dark:text-sky-200 dark:ring-sky-700 sm:px-3 sm:py-1.5 sm:text-xs">
          <UserCircleIcon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
          {EXPERT_SIGNUP_CTA.badge}
        </span>

        <ExpertPageUrlPreview className="mt-4 w-full" />
        <SignupBodyText className="mx-auto mt-3 max-w-2xl lg:mx-0 lg:max-w-[40rem]" />
        <SignupBenefitsGrid className="mx-auto mt-5 max-w-2xl lg:mx-0 lg:mt-6 lg:max-w-none" />
      </div>

      <div className="flex w-full shrink-0 flex-col items-stretch justify-center lg:w-[13.25rem] xl:w-[14.5rem]">
        <SignupCtaButton />
      </div>
    </div>
  );
}

export default function HomeExpertSignupCta({ embedded = false }) {
  const content = (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent dark:from-sky-800/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl dark:bg-sky-700/10"
        aria-hidden
      />

      <ExpertNetworkBackdrop />

      <div className="relative z-10 px-4 py-5 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
        <SignupMobileLayout />
        <SignupDesktopLayout />
      </div>
    </>
  );

  if (embedded) {
    return (
      <section
        className={`relative overflow-hidden ${EXPERT_BLOCK_BOTTOM}`}
        aria-label={EXPERT_SIGNUP_CTA.badge}
      >
        {content}
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 ${EXPERT_BLOCK_BOTTOM} shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] dark:border-sky-800 dark:shadow-none`}
      aria-label={EXPERT_SIGNUP_CTA.badge}
    >
      {content}
    </section>
  );
}
