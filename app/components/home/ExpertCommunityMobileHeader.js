'use client';

import { buildExpertCommunityMobileTitle, EXPERT_COMMUNITY_HEADER } from '../../copy/friendlyFa';
import ExpertFreeRibbon from './ExpertFreeRibbon';

/** هدر موبایل بلوک متخصصین — عنوان + روبان «رایگان» */
export default function ExpertCommunityMobileHeader({ cityName = '' }) {
  const title = buildExpertCommunityMobileTitle(cityName);

  return (
    <header
      className="relative flex min-h-[3.5rem] items-center overflow-hidden border-b border-gray-200/90 bg-gradient-to-l from-teal-50/90 via-white to-white px-4 py-4 dark:border-sky-800/90 dark:from-sky-950 dark:via-sky-900 dark:to-sky-900 sm:hidden"
      dir="rtl"
    >
      <ExpertFreeRibbon label={EXPERT_COMMUNITY_HEADER.mobileRibbon} />
      <h2 className="relative z-[1] w-full pe-1 text-right text-base font-bold leading-snug text-gray-900 dark:text-sky-50">
        {title}
      </h2>
    </header>
  );
}
