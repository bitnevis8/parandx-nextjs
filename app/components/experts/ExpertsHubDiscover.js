'use client';

import Link from 'next/link';
import {
  ListBulletIcon,
  MagnifyingGlassIcon,
  MapIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import { HOME_CARD_SHELL, HOME_PAGE_TITLE, HOME_BLOCK_LEAD } from '../home/homePageTheme';

const PATHS = [
  {
    key: 'search',
    href: EXPERTS_HUB.discoverSearchHref,
    title: EXPERTS_HUB.discoverSearchTitle,
    desc: EXPERTS_HUB.discoverSearchDesc,
    Icon: MagnifyingGlassIcon,
  },
  {
    key: 'map',
    href: EXPERTS_HUB.discoverMapHref,
    title: EXPERTS_HUB.discoverMapTitle,
    desc: EXPERTS_HUB.discoverMapDesc,
    Icon: MapIcon,
  },
  {
    key: 'cat',
    href: EXPERTS_HUB.discoverCatHref,
    title: EXPERTS_HUB.discoverCatTitle,
    desc: EXPERTS_HUB.discoverCatDesc,
    Icon: Squares2X2Icon,
  },
  {
    key: 'list',
    href: EXPERTS_HUB.discoverListHref,
    title: EXPERTS_HUB.discoverListTitle,
    desc: EXPERTS_HUB.discoverListDesc,
    Icon: ListBulletIcon,
  },
];

export default function ExpertsHubDiscover() {
  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="experts-discover-title">
      <div className="mb-5 text-right sm:mb-6">
        <h2 id="experts-discover-title" className={HOME_PAGE_TITLE}>
          {EXPERTS_HUB.discoverTitle}
        </h2>
        <p className={`${HOME_BLOCK_LEAD} mt-1`}>{EXPERTS_HUB.discoverLead}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {PATHS.map(({ key, href, title, desc, Icon }) => (
          <Link
            key={key}
            href={href}
            className={`${HOME_CARD_SHELL} group flex min-h-[7.5rem] flex-col p-4 transition hover:border-teal-300/80 hover:shadow-md sm:min-h-[8.5rem] sm:p-5`}
          >
            <Icon
              className="h-8 w-8 text-teal-600 transition group-hover:scale-105"
              strokeWidth={1.5}
              aria-hidden
            />
            <h3 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">{title}</h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-gray-600 sm:text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
