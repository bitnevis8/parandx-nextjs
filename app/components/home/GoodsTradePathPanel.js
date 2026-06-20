'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';

export const PANEL_SPACE = {
  pad: 'p-6 sm:p-8 lg:p-10',
  stack: 'gap-5 sm:gap-6',
  header: 'space-y-3',
  steps: 'gap-2 sm:gap-3',
};

const VARIANT_CONFIG = {
  need: {
    Icon: ShoppingBagIcon,
    accent: {
      icon: 'bg-amber-50 text-amber-700',
      imageBg: 'bg-amber-50/40',
      stepNum: 'bg-amber-600 text-white',
      btn: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500/40',
    },
  },
  supply: {
    Icon: TagIcon,
    accent: {
      icon: 'bg-violet-50 text-violet-700',
      imageBg: 'bg-violet-50/40',
      stepNum: 'bg-violet-600 text-white',
      btn: 'bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500/40',
    },
  },
};

function Steps({ steps, stepNumClass }) {
  return (
    <ol className={`flex flex-col sm:flex-row sm:flex-wrap ${PANEL_SPACE.steps}`} aria-label="مراحل">
      {steps.map((step, i) => (
        <li
          key={step.key}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:min-w-[8rem]"
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold sm:h-7 sm:w-7 sm:text-xs ${stepNumClass}`}
          >
            {(i + 1).toLocaleString('fa-IR')}
          </span>
          <span className="text-xs font-medium text-gray-800 sm:text-[13px]">{step.label}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * imageSide: start = راست در RTL | end = چپ در RTL
 */
export default function GoodsTradePathPanel({
  id,
  headlineId,
  variant,
  intro,
  href,
  imageSide = 'end',
}) {
  const { Icon, accent } = VARIANT_CONFIG[variant];
  const imageOnStart = imageSide === 'start';
  const contentOrder = imageOnStart ? 'lg:order-2' : 'lg:order-1';
  const imageOrder = imageOnStart ? 'lg:order-1' : 'lg:order-2';

  return (
    <div id={id} className="group/panel bg-white" aria-labelledby={headlineId}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div
          className={`order-2 flex flex-col justify-center ${PANEL_SPACE.pad} ${PANEL_SPACE.stack} ${contentOrder}`}
        >
          <div className={`text-right ${PANEL_SPACE.header}`}>
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 ${accent.icon}`}
                aria-hidden
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <h2
                  id={headlineId}
                  className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl"
                >
                  {intro.title}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-[15px]">{intro.body}</p>
              </div>
            </div>
          </div>

          <Steps steps={intro.steps} stepNumClass={accent.stepNum} />

          <Link
            href={href}
            scroll={false}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto sm:min-w-[12rem] ${accent.btn}`}
            aria-label={intro.ariaLabel}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {intro.cta}
            <ChevronLeftIcon className="h-4 w-4 shrink-0 transition group-hover/panel:-translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div
          className={`order-1 flex min-h-[13rem] items-center justify-center sm:min-h-[15rem] lg:min-h-[17rem] ${PANEL_SPACE.pad} ${imageOrder} ${accent.imageBg}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={intro.illustrationSrc}
            alt={intro.illustrationAlt || ''}
            className="h-auto w-full max-w-[12rem] object-contain sm:max-w-[15rem] lg:max-w-[18rem] xl:max-w-[20rem]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
