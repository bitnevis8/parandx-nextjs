'use client';

import { MapIcon } from '@heroicons/react/24/outline';
import MapGuideTrigger from './MapGuideTrigger';
import { HOME_BLOCK_TITLE, HOME_CARD_HEADER } from './homePageTheme';

/** هدر + لایه — پیش‌نمایش نقشه صفحهٔ اصلی (موبایل و دسکتاپ) */
export default function HomeMapBannerChrome({ title, layerToolbar = null }) {
  return (
    <div>
      <header className={HOME_CARD_HEADER}>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/20 dark:bg-teal-500 dark:shadow-teal-900/30 sm:h-10 sm:w-10"
            aria-hidden
          >
            <MapIcon className="h-[1.05rem] w-[1.05rem] sm:h-[1.15rem] sm:w-[1.15rem]" />
          </span>
          <h2 className={`min-w-0 flex-1 truncate ${HOME_BLOCK_TITLE}`}>{title}</h2>
          <MapGuideTrigger variant="cardHeader" />
        </div>
      </header>

      {layerToolbar ? (
        <div className="border-b border-gray-100/90 bg-gray-50/80 px-4 py-2.5 dark:border-sky-800/90 dark:bg-sky-950/55 sm:px-5 sm:py-3">
          {layerToolbar}
        </div>
      ) : null}
    </div>
  );
}
