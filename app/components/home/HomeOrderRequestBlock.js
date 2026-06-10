'use client';

import Link from 'next/link';
import { ChevronLeftIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { REQUEST_INTRO } from '../../copy/friendlyFa';
import { HOME_BTN_PRIMARY_BLOCK, HOME_PAGE_TITLE } from './homePageTheme';
import RegisterWorkSideIllustration from './RegisterWorkSideIllustration';

export default function HomeOrderRequestBlock({ connectTop = false }) {
  const shellClass = connectTop
    ? 'scroll-mt-28 relative flex flex-col overflow-hidden bg-white border-0 rounded-b-2xl'
    : 'scroll-mt-28 relative flex flex-col overflow-hidden bg-white border border-gray-200/90 border-b-0 rounded-2xl shadow-sm ring-1 ring-gray-100/80';

  return (
    <section
      id="home-path-request"
      className={shellClass}
      aria-labelledby="home-request-headline"
    >
      <RegisterWorkSideIllustration />

      <div className="relative z-10 flex min-h-[22rem] flex-1 flex-col px-4 pt-12 pb-4 sm:min-h-[24rem] sm:px-6 sm:pt-14 sm:pb-6 lg:min-h-[26rem] lg:px-8 lg:pt-16 lg:pb-6 lg:ps-[min(46%,24rem)]">
        <div className="w-full space-y-3 text-right sm:space-y-4">
          <SpeakerWaveIcon
            className="h-8 w-8 -scale-x-100 text-teal-600 sm:h-9 sm:w-9"
            strokeWidth={1.5}
            aria-hidden
          />

          <h2 id="home-request-headline" className={HOME_PAGE_TITLE}>
            {REQUEST_INTRO.title}
          </h2>

          <p className="w-full text-sm leading-relaxed text-justify text-gray-600 sm:text-[15px]">
            {REQUEST_INTRO.body}
          </p>
        </div>

        <div className="mt-auto w-full pt-6 sm:pt-8">
          <div className="mb-4 flex justify-center sm:mb-5 lg:hidden">
            <div className="relative h-[10.35rem] w-full max-w-[16.1rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={REQUEST_INTRO.illustrationSrc}
                alt=""
                className="h-full w-full object-contain object-bottom"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = REQUEST_INTRO.illustrationSrcFallback;
                }}
              />
            </div>
          </div>

          <Link
            href="/requests/new"
            scroll={false}
            className={`${HOME_BTN_PRIMARY_BLOCK} group`}
            aria-label={REQUEST_INTRO.ariaLabel}
          >
            <span>{REQUEST_INTRO.cta}</span>
            <ChevronLeftIcon
              className="h-5 w-5 shrink-0 transition group-hover:-translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
