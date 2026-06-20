'use client';

import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { MAP_INTRO } from '../../copy/friendlyFa';

const EXPAND_HINT_GRADIENT =
  'bg-[linear-gradient(to_top,rgba(255,255,255,0.82)_0%,rgba(240,253,250,0.45)_42%,transparent_100%)] dark:bg-[linear-gradient(to_top,rgba(2,12,20,0.72)_0%,rgba(2,12,20,0.28)_48%,transparent_100%)]';

/** دکمهٔ بزرگنمایی — وسط نقشه (موبایل) */
function CenterExpandHint({ onOpen, label, ariaLabel }) {
  const resolvedLabel = label || MAP_INTRO.mobileExpandHint;
  const resolvedAria = ariaLabel || MAP_INTRO.mobileExpandHintAria;

  return (
    <div className="pointer-events-none absolute inset-0 z-[455] flex items-center justify-center px-6 md:hidden">
      <span
        className="pointer-events-none absolute inset-0 bg-slate-950/[0.04] dark:bg-black/10"
        aria-hidden
      />
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto relative flex max-w-[17.5rem] touch-manipulation flex-col items-center gap-2.5 rounded-2xl border border-white/55 bg-white/58 px-5 py-4 text-center shadow-[0_8px_28px_rgba(15,23,42,0.12)] backdrop-blur-[2px] transition active:scale-[0.98] dark:border-sky-500/35 dark:bg-sky-950/62 dark:shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
        aria-label={resolvedAria}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/30 dark:bg-teal-500">
          <ArrowsPointingOutIcon className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-[13px] font-bold leading-snug text-teal-900 dark:text-sky-50">
          {resolvedLabel}
        </span>
        <span className="text-[11px] font-medium text-teal-700/90 dark:text-sky-300/90">
          برای باز کردن، لمس کنید
        </span>
      </button>
    </div>
  );
}

export default function HomeMapExpandHintBar({
  onOpen,
  label,
  ariaLabel,
  mobileOnly = false,
  decorative = false,
  variant = 'bottom',
}) {
  if (variant === 'center' && onOpen) {
    return <CenterExpandHint onOpen={onOpen} label={label} ariaLabel={ariaLabel} />;
  }

  const resolvedLabel = label || MAP_INTRO.mobileExpandHint;
  const resolvedAria = ariaLabel || MAP_INTRO.mobileExpandHintAria;

  const shellClass = `group absolute inset-x-0 bottom-0 z-[450] flex min-h-[3.5rem] flex-col justify-end md:min-h-[3.25rem] ${
    decorative ? 'pointer-events-none' : 'cursor-pointer touch-manipulation'
  } ${mobileOnly ? 'md:hidden' : ''}`.trim();

  const content = (
    <>
      <span
        className={`pointer-events-none absolute inset-0 ${EXPAND_HINT_GRADIENT}`}
        aria-hidden
      />

      <span className="relative flex w-full items-center justify-center gap-1.5 px-4 pb-3 pt-8 md:pb-2.5 md:pt-7">
        <span className="text-center text-[11px] font-semibold leading-snug text-teal-800 dark:text-sky-100 md:text-xs">
          {resolvedLabel}
        </span>
        <ArrowsPointingOutIcon
          className="h-4 w-4 shrink-0 text-teal-600 dark:text-sky-300"
          aria-hidden
        />
      </span>
    </>
  );

  if (decorative) {
    return (
      <div className={shellClass} aria-hidden>
        {content}
      </div>
    );
  }

  return (
    <button type="button" onClick={onOpen} className={shellClass} aria-label={resolvedAria}>
      {content}
    </button>
  );
}
