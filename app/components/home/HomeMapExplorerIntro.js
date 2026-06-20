'use client';

import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { MAP_INTRO } from '../../copy/friendlyFa';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';
import { HOME_CARD_HEADER } from './homePageTheme';
import MapGuideTrigger from './MapGuideTrigger';

export default function HomeMapExplorerIntro({
  serviceTitle,
  onOpenMap,
  disabled = false,
}) {
  const hasService = Boolean(serviceTitle);
  const isMobile = useIsMobileViewport();

  return (
    <div>
      <header className={HOME_CARD_HEADER}>
        <div className="relative flex min-h-[1.75rem] items-center justify-center px-2" dir="rtl">
          <h2 className="text-center text-base font-bold leading-snug text-teal-900 dark:text-sky-50 sm:text-lg">
            {MAP_INTRO.mobileTitle}
          </h2>
          <MapGuideTrigger
            variant="mobileOverlay"
            className="absolute inset-y-0 end-0 flex items-center pt-0"
          />
          {!isMobile ? (
            <button
              type="button"
              disabled={disabled}
              onClick={onOpenMap}
              className="absolute inset-y-0 start-0 flex items-center pt-0"
              aria-label="بزرگنمایی نقشه"
              title="بزرگنمایی نقشه"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-teal-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100 dark:hover:border-sky-600 dark:hover:bg-sky-800">
                <ArrowsPointingOutIcon className="h-4 w-4" aria-hidden />
              </span>
            </button>
          ) : null}
        </div>
      </header>

      {hasService ? (
        <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-2 sm:px-5 dark:border-sky-800 dark:bg-sky-950/40">
          <span className="inline-flex max-w-full items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-teal-900 ring-1 ring-teal-200/80 dark:bg-sky-900 dark:text-sky-100 dark:ring-sky-700">
            <span className="truncate">{serviceTitle}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
