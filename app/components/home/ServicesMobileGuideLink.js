'use client';

import Link from 'next/link';
import { ChevronLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { SITE_GUIDE_MOBILE } from '../../copy/siteGuideFa';
import { HOME_PAGE_LEAD } from './homePageTheme';

export default function ServicesMobileGuideLink() {
  return (
    <Link
      href={SITE_GUIDE_MOBILE.href}
      className={`${HOME_PAGE_LEAD} mx-auto inline-flex items-center justify-center gap-1.5 font-normal text-gray-500 transition active:opacity-65 md:hidden`}
    >
      <QuestionMarkCircleIcon className="h-4 w-4 shrink-0 text-teal-500/90" strokeWidth={1.75} aria-hidden />
      <span className="font-semibold text-teal-700">{SITE_GUIDE_MOBILE.label}</span>
      <ChevronLeftIcon className="h-3.5 w-3.5 shrink-0 text-teal-600/80" strokeWidth={2.5} aria-hidden />
    </Link>
  );
}
