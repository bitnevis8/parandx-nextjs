'use client';

import { ArrowsPointingOutIcon, MapIcon } from '@heroicons/react/24/outline';
import { MAP_INTRO } from '../../copy/friendlyFa';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';
import HomeSectionHeader from './HomeSectionHeader';
import MapGuideTrigger from './MapGuideTrigger';
import { HOME_BLOCK_TITLE, HOME_CARD_HEADER } from './homePageTheme';

export default function HomeMapExplorerIntro({
  serviceTitle,
  onOpenMap,
  disabled = false,
}) {
  const hasService = Boolean(serviceTitle);
  const isMobile = useIsMobileViewport();

  const desktopActions = (
    <div className="flex items-center gap-2">
      <MapGuideTrigger variant="header" />
      <button
        type="button"
        disabled={disabled}
        onClick={onOpenMap}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-teal-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="بزرگنمایی نقشه"
        title="بزرگنمایی نقشه"
      >
        <ArrowsPointingOutIcon className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );

  return (
    <div>
      {isMobile ? (
        <header className={HOME_CARD_HEADER}>
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/20"
              aria-hidden
            >
              <MapIcon className="h-[1.05rem] w-[1.05rem]" />
            </span>
            <h2 className={`min-w-0 flex-1 truncate ${HOME_BLOCK_TITLE}`}>{MAP_INTRO.eyebrow}</h2>
            <MapGuideTrigger variant="mobileHeader" />
          </div>
        </header>
      ) : (
        <HomeSectionHeader
          icon={MapIcon}
          title={MAP_INTRO.eyebrow}
          description={MAP_INTRO.body}
          action={desktopActions}
        />
      )}

      {hasService ? (
        <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-2 sm:px-5">
          <span className="inline-flex max-w-full items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-teal-900 ring-1 ring-teal-200/80">
            <span className="truncate">{serviceTitle}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
