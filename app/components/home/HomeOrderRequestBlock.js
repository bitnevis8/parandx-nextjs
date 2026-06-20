'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import RequestQuotesBanner from './RequestQuotesBanner';
import RequestTypewriterQuotes from './RequestTypewriterQuotes';
import RequestGuideTrigger from './RequestGuideTrigger';
import RegisterWorkCtaIllustration from './RegisterWorkCtaIllustration';
import { REQUEST_INTRO } from '../../copy/friendlyFa';
import {
  HOME_BTN_PRIMARY_BLOCK,
  HOME_CARD_HEADER,
  HOME_CARD_SHELL,
} from './homePageTheme';

const REQUEST_HEADER = HOME_CARD_HEADER;

function RequestCtaButton({ className = '', label = REQUEST_INTRO.cta }) {
  return (
    <Link
      href="/requests/new"
      scroll={false}
      className={`${HOME_BTN_PRIMARY_BLOCK} group ${className}`.trim()}
      aria-label={REQUEST_INTRO.ariaLabel}
    >
      {label}
      <SpeakerWaveIcon
        className="h-5 w-5 shrink-0 -scale-x-100 transition group-hover:scale-110 sm:h-[1.35rem] sm:w-[1.35rem]"
        strokeWidth={1.75}
        aria-hidden
      />
    </Link>
  );
}

function RequestHeaderBar({ title }) {
  return (
    <div className="relative flex min-h-[1.75rem] items-center justify-center px-2" dir="rtl">
      <h2 className="text-base font-bold leading-snug text-teal-900 dark:text-sky-50 sm:text-lg md:text-xl">
        {title}
      </h2>
      <RequestGuideTrigger
        variant="mobileOverlay"
        className="absolute inset-y-0 end-0 flex items-center pt-0"
      />
    </div>
  );
}

function RequestMobileHeaderBar() {
  return (
    <div className="flex items-center justify-between gap-3" dir="rtl">
      <div className="flex min-w-0 items-center justify-start gap-3 text-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={REQUEST_INTRO.speakerIconSrc}
          alt={REQUEST_INTRO.speakerIconAlt}
          className="h-12 w-12 shrink-0 -scale-x-100 object-contain object-center -mt-3"
          aria-hidden={!REQUEST_INTRO.speakerIconAlt}
          decoding="async"
        />
        <h2 className="shrink-0 text-base -mr-2 font-bold leading-snug text-teal-900 dark:text-sky-50">
          {REQUEST_INTRO.title}
        </h2>
      </div>
      <RequestGuideTrigger variant="mobileHeader" className="shrink-0 self-center" />
    </div>
  );
}

function RequestBoxHeader({ platform }) {
  const isMobile = platform === 'mobile';

  return (
    <header>
      <div className={REQUEST_HEADER}>
        {isMobile ? <RequestMobileHeaderBar /> : <RequestHeaderBar title={REQUEST_INTRO.title} />}
      </div>

      {!isMobile ? <RequestQuotesBanner embedded platform={platform} /> : null}
    </header>
  );
}

function RequestFlowNodes({ className = '', variant = 'horizontal', align = 'center' }) {
  const steps = REQUEST_INTRO.steps;

  if (variant === 'desktopBottom') {
    return (
      <div
        dir="rtl"
        className={`flex w-full items-end justify-between gap-2 sm:gap-3 ${className}`.trim()}
        role="list"
        aria-label={REQUEST_INTRO.stepsAriaLabel}
      >
        {steps.map((step, index) => (
          <Fragment key={step.title}>
            <div
              className="flex min-w-0 flex-1 flex-col items-center justify-end"
              role="listitem"
            >
              <div className="mb-2.5 flex w-full flex-col items-center justify-center px-1 text-center">
                <span className="text-xs font-bold leading-tight text-teal-900 dark:text-sky-100 sm:text-sm">
                  {step.title}
                </span>
                <span
                  className={`text-[11px] leading-snug text-gray-500 dark:text-sky-400 sm:text-xs ${
                    index === 1 ? 'mt-0 whitespace-nowrap' : 'mt-0.5'
                  }`}
                >
                  {step.detail}
                </span>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm ring-4 ring-teal-100 dark:bg-teal-400 dark:text-sky-950 dark:ring-sky-800 sm:h-10 sm:w-10 sm:text-base">
                {(index + 1).toLocaleString('fa-IR')}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <div
                className="flex w-6 shrink-0 items-center self-end pb-[1.05rem] sm:w-10 sm:pb-[1.15rem]"
                aria-hidden
              >
                <span className="request-desktop-step-line block h-[3px] w-full rounded-full" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    );
  }

  if (variant === 'vertical' || variant === 'mobileLeft') {
    const isCompactLeft = variant === 'mobileLeft';

    return (
      <ol
        className={`${isCompactLeft ? 'space-y-2' : 'space-y-2.5'} ${className}`.trim()}
        aria-label={REQUEST_INTRO.stepsAriaLabel}
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`flex items-start gap-2.5 ${
              isCompactLeft
                ? 'rounded-lg border border-gray-200/80 bg-gray-50/70 px-2.5 py-2 dark:border-sky-700/70 dark:bg-sky-950/40'
                : 'rounded-xl border border-gray-200/90 bg-gray-50/80 px-3.5 py-3 dark:border-sky-700/80 dark:bg-sky-950/50'
            }`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white shadow-sm dark:bg-teal-500 dark:text-sky-950 ${
                isCompactLeft ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm'
              }`}
            >
              {(index + 1).toLocaleString('fa-IR')}
            </span>
            <div className="min-w-0 flex-1 pt-0.5 text-right">
              <p
                className={`font-bold leading-snug text-gray-900 dark:text-sky-50 ${
                  isCompactLeft ? 'text-xs' : 'text-sm'
                }`}
              >
                {step.title}
              </p>
              <p
                className={`mt-0.5 leading-relaxed text-gray-600 dark:text-sky-300 ${
                  isCompactLeft ? 'text-[11px]' : 'mt-1 text-xs'
                }`}
              >
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const justifyClass = align === 'start' ? 'justify-start' : 'justify-center';

  return (
    <div
      dir="ltr"
      className={`flex w-full items-start ${justifyClass} ${className}`.trim()}
      role="list"
      aria-label={REQUEST_INTRO.stepsAriaLabel}
    >
      {steps.map((step, index) => (
        <div key={step.title} className="flex min-w-0 max-w-[11rem] flex-1 items-start sm:max-w-none">
          <div className="flex min-w-0 flex-1 flex-col items-center text-center" role="listitem">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm ring-4 ring-teal-100 dark:bg-teal-400 dark:text-sky-950 dark:ring-sky-800 sm:h-10 sm:w-10 sm:text-base">
              {(index + 1).toLocaleString('fa-IR')}
            </span>
            <span
              dir="rtl"
              className="mt-3 w-full px-1 text-xs font-bold leading-tight text-teal-900 dark:text-sky-100 sm:text-sm"
            >
              {step.title}
            </span>
            <span
              dir="rtl"
              className="mt-1.5 w-full px-1 text-[11px] leading-snug text-gray-500 dark:text-sky-400 sm:text-xs"
            >
              {step.detail}
            </span>
          </div>

          {index < steps.length - 1 ? (
            <span
              className="mt-[1rem] h-0.5 min-w-[0.5rem] flex-[0.55] shrink-0 self-start bg-teal-300 dark:bg-sky-600 sm:mt-[1.125rem]"
              aria-hidden
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

const MOBILE_TYPEWRITER_LABEL =
  'text-right text-[13px] leading-6 font-semibold text-teal-800 dark:text-sky-200';

const DESKTOP_TYPEWRITER_LABEL =
  'text-right text-[15px] leading-7 font-semibold text-teal-800 dark:text-sky-200 sm:text-base sm:leading-8';

function RequestMobileLayout() {
  return (
    <div className="space-y-4 px-4 pb-5 pt-4">
      <div className="w-full">
        <div className="mb-3 py-2">
          <RequestTypewriterQuotes
            platform="mobile"
            variant="stepsLabel"
            className={MOBILE_TYPEWRITER_LABEL}
          />
        </div>
        <RequestFlowNodes variant="vertical" />
      </div>

      <RequestCtaStack platform="mobile" />
    </div>
  );
}

function RequestCtaStack({ platform, buttonClassName = '' }) {
  const isMobile = platform === 'mobile';

  return (
    <div
      className={`flex w-full flex-col gap-3 ${isMobile ? '' : 'h-full max-w-md min-h-0'}`.trim()}
    >
      {!isMobile ? (
        <RegisterWorkCtaIllustration className="hidden sm:flex" />
      ) : null}
      <div className={isMobile ? '' : 'mt-auto pt-1'}>
        <RequestCtaButton
          className={`w-full py-4 ${isMobile ? 'text-[15px] shadow-lg shadow-teal-600/20' : ''} ${buttonClassName}`.trim()}
        />
      </div>
    </div>
  );
}

function RequestDesktopLayout() {
  return (
    <div className="grid gap-8 px-6 pb-8 pt-5 lg:grid-cols-2 lg:items-stretch lg:px-8 lg:pt-6">
      <div className="flex min-h-0 flex-col lg:col-start-1 lg:row-start-1">
        <RequestCtaStack platform="desktop" />
      </div>

      <div className="flex min-h-0 flex-col justify-between gap-5 lg:col-start-2">
        <div className="space-y-2">
          <RequestTypewriterQuotes
            platform="desktop"
            variant="stepsLabel"
            className={DESKTOP_TYPEWRITER_LABEL}
          />
          <p className="text-right text-[15px] leading-7 text-gray-600 dark:text-sky-300 sm:text-base sm:leading-8">
            {REQUEST_INTRO.bodyDesktop}
          </p>
        </div>

        <div className="mt-auto w-full pt-2">
          <RequestFlowNodes variant="desktopBottom" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default function HomeOrderRequestBlock() {
  return (
    <section
      id="home-path-request"
      className={`${HOME_CARD_SHELL} scroll-mt-28`}
      aria-label={REQUEST_INTRO.title}
    >
      <div className="sm:hidden">
        <RequestBoxHeader platform="mobile" />
        <RequestMobileLayout />
      </div>

      <div className="hidden sm:block">
        <RequestBoxHeader platform="desktop" />
        <RequestDesktopLayout />
      </div>
    </section>
  );
}
