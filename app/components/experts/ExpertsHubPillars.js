'use client';

import Link from 'next/link';
import {
  BriefcaseIcon,
  LinkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import { HOME_CARD_SHELL, HOME_PAGE_TITLE, HOME_BLOCK_LEAD } from '../home/homePageTheme';

function PillarCard({ icon: Icon, title, items, cta, href, accent }) {
  return (
    <article
      className={`${HOME_CARD_SHELL} flex h-full flex-col p-5 sm:p-6 ${accent}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/25">
        <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
      <ul className="mt-3 flex-1 space-y-2 text-sm leading-relaxed text-gray-600">
        {items.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
      >
        {cta}
        <span aria-hidden>←</span>
      </Link>
    </article>
  );
}

export default function ExpertsHubPillars({ sampleExpertId }) {
  const profileHref = sampleExpertId ? `/experts/${sampleExpertId}` : '/experts#experts-directory';

  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="experts-pillars-title">
      <div className="mb-5 text-right sm:mb-6">
        <h2 id="experts-pillars-title" className={HOME_PAGE_TITLE}>
          {EXPERTS_HUB.pillarsTitle}
        </h2>
        <p className={`${HOME_BLOCK_LEAD} mt-1`}>{EXPERTS_HUB.pillarsLead}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <PillarCard
          icon={BriefcaseIcon}
          title={EXPERTS_HUB.pillarMarketTitle}
          items={EXPERTS_HUB.pillarMarketItems}
          cta={EXPERTS_HUB.pillarMarketCta}
          href="/requests/new"
        />
        <PillarCard
          icon={UserCircleIcon}
          title={EXPERTS_HUB.pillarProfileTitle}
          items={EXPERTS_HUB.pillarProfileItems}
          cta={EXPERTS_HUB.pillarProfileCta}
          href={profileHref}
        />
        <PillarCard
          icon={LinkIcon}
          title={EXPERTS_HUB.pillarNetworkTitle}
          items={EXPERTS_HUB.pillarNetworkItems}
          cta={EXPERTS_HUB.pillarNetworkCta}
          href={EXPERTS_HUB.networkExpertPath}
        />
      </div>
    </section>
  );
}
