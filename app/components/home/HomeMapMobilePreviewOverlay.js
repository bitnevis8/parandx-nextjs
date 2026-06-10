'use client';

import { ArrowsPointingOutIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import { MAP_INTRO } from '../../copy/friendlyFa';

export default function HomeMapMobilePreviewOverlay({ onOpen, cityName = '' }) {
  return (
    <button
      type="button"
      className="absolute inset-0 z-[450] flex cursor-pointer touch-manipulation flex-col items-center justify-center bg-slate-900/20 p-3 md:hidden"
      aria-label={
        cityName
          ? `باز کردن نقشه ${cityName} — ${MAP_INTRO.mobileTapHint}`
          : MAP_INTRO.mobileTapHint
      }
      onClick={onOpen}
    >
      <span className="pointer-events-none inline-flex max-w-full items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-teal-900 shadow-lg shadow-slate-900/15 ring-1 ring-teal-200/90 backdrop-blur-sm">
        <HandRaisedIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
        <span className="truncate">{MAP_INTRO.mobileTapHint}</span>
        <ArrowsPointingOutIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
      </span>
    </button>
  );
}
