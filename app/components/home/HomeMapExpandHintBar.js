'use client';

import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function HomeMapExpandHintBar({ onOpen, label, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group absolute inset-x-0 bottom-0 z-[450] flex h-[42%] min-h-[5.75rem] max-h-[9.5rem] cursor-pointer touch-manipulation flex-col justify-end sm:min-h-[6.5rem] sm:max-h-[10.5rem]"
      aria-label={ariaLabel || label}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.52)_28%,rgba(0,0,0,0.22)_58%,transparent_100%)] transition-opacity group-hover:bg-[linear-gradient(to_top,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.56)_28%,rgba(0,0,0,0.26)_58%,transparent_100%)]"
        aria-hidden
      />

      <span className="relative flex w-full items-center justify-center gap-2 px-[4.75rem] pb-3 pt-6 text-center sm:gap-2.5 sm:px-20 sm:pb-3.5 sm:pt-8">
        <span className="max-w-md text-[11px] font-medium leading-relaxed text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:text-xs sm:leading-snug">
          {label}
        </span>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-amber-300 ring-1 ring-white/25 backdrop-blur-[1px] transition group-hover:bg-white/25 group-hover:text-amber-200 sm:h-9 sm:w-9">
          <ArrowsPointingOutIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
        </span>
      </span>
    </button>
  );
}
