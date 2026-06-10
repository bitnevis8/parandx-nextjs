'use client';

import { ArrowsPointingOutIcon, MapIcon } from '@heroicons/react/24/outline';
import { GOODS_MAP_INTRO } from '../../copy/goodsPageFa';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';
import HomeSectionHeader from './HomeSectionHeader';
import MapGuideTrigger from './MapGuideTrigger';
import { HOME_BLOCK_TITLE, HOME_CARD_HEADER } from './homePageTheme';

export default function GoodsMapExplorerIntro({
  categoryTitle,
  onOpenMap,
  disabled = false,
}) {
  const hasCategory = Boolean(categoryTitle);
  const isMobile = useIsMobileViewport();

  const desktopActions = (
    <div className="flex items-center gap-2">
      <MapGuideTrigger variant="header" />
      <button
        type="button"
        disabled={disabled}
        onClick={onOpenMap}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-amber-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm shadow-amber-600/20"
              aria-hidden
            >
              <MapIcon className="h-[1.05rem] w-[1.05rem]" />
            </span>
            <h2 className={`min-w-0 flex-1 truncate ${HOME_BLOCK_TITLE}`}>{GOODS_MAP_INTRO.eyebrow}</h2>
            <MapGuideTrigger variant="mobileHeader" />
          </div>
        </header>
      ) : (
        <HomeSectionHeader
          icon={MapIcon}
          title={GOODS_MAP_INTRO.eyebrow}
          description={GOODS_MAP_INTRO.body}
          action={desktopActions}
          iconClassName="!bg-amber-600 !shadow-amber-600/20 !text-white"
        />
      )}

      {hasCategory ? (
        <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-2 sm:px-5">
          <span className="inline-flex max-w-full items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/80">
            <span className="truncate">{categoryTitle}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
