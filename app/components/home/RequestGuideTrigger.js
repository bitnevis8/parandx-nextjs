'use client';

import { useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import RequestGuideModal from './RequestGuideModal';

const VARIANTS = {
  textLink: {
    className:
      'inline-flex shrink-0 items-center text-xs font-semibold text-teal-600 underline-offset-2 transition hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:text-sky-300 dark:hover:text-sky-200',
    iconClass: 'h-4 w-4 shrink-0',
    label: 'راهنما',
    showLabel: true,
    showIcon: false,
    ariaLabel: 'راهنمای ثبت کار',
  },
  mobileOverlay: {
    className:
      'inline-flex shrink-0 items-center gap-1 p-0 text-xs font-semibold text-teal-600 underline-offset-2 transition hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:text-sky-300 dark:hover:text-sky-200',
    iconClass: 'h-4 w-4 shrink-0',
    label: 'راهنما',
    showLabel: true,
    showIcon: true,
    ariaLabel: 'راهنمای ثبت کار',
  },
  mobileHeader: {
    className:
      'inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100 dark:hover:border-sky-600 dark:hover:bg-sky-800',
    iconClass: 'h-4 w-4 shrink-0 text-teal-600 dark:text-sky-300',
    label: 'راهنما',
    showLabel: true,
    showIcon: true,
    ariaLabel: 'راهنمای ثبت کار',
  },
  header: {
    className:
      'inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100',
    iconClass: 'h-5 w-5 shrink-0 text-teal-600 dark:text-sky-300',
    label: 'راهنما',
    showLabel: true,
    showIcon: true,
    ariaLabel: 'باز کردن راهنمای ثبت کار',
  },
};

export default function RequestGuideTrigger({ variant = 'textLink', className = '' }) {
  const [open, setOpen] = useState(false);
  const config = VARIANTS[variant] || VARIANTS.textLink;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${config.className} ${className}`.trim()}
        aria-label={config.ariaLabel}
      >
        {config.showIcon !== false ? (
          <BookOpenIcon className={config.iconClass} aria-hidden />
        ) : null}
        {config.showLabel ? <span>{config.label}</span> : null}
      </button>
      <RequestGuideModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
