'use client';

import Link from 'next/link';
import {
  ArrowLeftIcon,
  MapIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import { HOME_BTN_PRIMARY, HOME_BTN_SECONDARY } from '../home/homePageTheme';

export default function ExpertsHubHero({ cityName }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-teal-700 via-teal-600 to-teal-800 text-white shadow-lg shadow-teal-900/20 ring-1 ring-teal-700/30">
      <div
        className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />

      <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <span className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
          <UserGroupIcon className="h-4 w-4" aria-hidden />
          {EXPERTS_HUB.heroBadge}
        </span>

        <h1 className="mt-4 max-w-3xl text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-4xl">
          {EXPERTS_HUB.heroTitle(cityName)}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-teal-50/95 sm:text-base lg:text-[17px]">
          {EXPERTS_HUB.heroLead}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/requests/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-teal-900 shadow-md transition hover:bg-teal-50"
          >
            {EXPERTS_HUB.ctaCustomer}
            <ArrowLeftIcon className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <WrenchScrewdriverIcon className="h-5 w-5" aria-hidden />
            {EXPERTS_HUB.ctaExpert}
          </Link>
          <Link
            href="/#home-path-map"
            className={`${HOME_BTN_SECONDARY} border-white/30 bg-white/95 text-gray-800 hover:border-teal-200`}
          >
            <MapIcon className="h-5 w-5 text-teal-600" aria-hidden />
            {EXPERTS_HUB.ctaMap}
          </Link>
        </div>
      </div>
    </section>
  );
}
