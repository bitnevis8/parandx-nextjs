'use client';

import Link from 'next/link';
import { ArrowRightIcon, MegaphoneIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DIVAR_HERO } from '../../copy/divarPageFa';
import {
  HOME_CONTAINER,
  HOME_MAIN_TOP,
  HOME_PAGE_TITLE,
  HOME_SECTION_STACK,
} from '../home/homePageTheme';

function DivarHeroLead() {
  return (
    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 md:mx-0 md:text-[15px]">
      {DIVAR_HERO.lead}
    </p>
  );
}

export default function DivarHero({ children }) {
  return (
    <section className="relative w-full bg-white">
      <div className={`${HOME_CONTAINER} ${HOME_SECTION_STACK} ${HOME_MAIN_TOP}`}>
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-4 text-center md:text-right">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <h1 className={HOME_PAGE_TITLE}>
                <span className="text-violet-600">{DIVAR_HERO.titleBrand}</span>
                {' '}
                {DIVAR_HERO.titleRest}
              </h1>
              <DivarHeroLead />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50/80 px-3 py-2 text-xs font-medium text-violet-800 sm:text-sm">
                <MegaphoneIcon className="h-4 w-4 shrink-0" aria-hidden />
                آگهی با قیمت ثابت
              </span>
              <Link
                href="/divar/new"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 sm:text-sm"
              >
                <PlusIcon className="h-4 w-4" aria-hidden />
                ثبت آگهی
              </Link>
              <Link
                href="/divar/categories/listing-mobile-tablet"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 transition hover:text-violet-900 sm:text-sm"
              >
                نمونه: موبایل و تبلت
                <ArrowRightIcon className="h-4 w-4 rotate-180" aria-hidden />
              </Link>
            </div>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
