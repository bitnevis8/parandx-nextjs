'use client';

import { useState } from 'react';
import { QuestionMarkCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import MapGuideModal from './MapGuideModal';

const VARIANTS = {
  header: {
    className:
      'inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35',
    iconClass: 'h-5 w-5 shrink-0 text-teal-600',
    label: 'راهنما',
    showLabel: true,
    ariaLabel: 'باز کردن راهنمای نقشه',
  },
  pill: {
    className:
      'pointer-events-auto inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-teal-800 shadow-md ring-1 ring-teal-200/80 backdrop-blur-sm transition hover:bg-teal-50 sm:text-xs',
    iconClass: 'h-3.5 w-3.5 shrink-0 text-teal-600',
    label: 'راهنما',
    showLabel: true,
    ariaLabel: 'راهنمای نقشه',
  },
  icon: {
    className:
      'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-teal-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35',
    iconClass: 'h-5 w-5',
    label: '',
    showLabel: false,
    ariaLabel: 'راهنمای نقشه',
  },
  mobileHeader: {
    className:
      'inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35',
    iconClass: 'h-4 w-4 shrink-0 text-teal-600',
    label: 'راهنما',
    showLabel: true,
    ariaLabel: 'راهنمای نقشه',
  },
  glassMap: {
    className:
      'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/40 bg-white/20 text-white shadow-sm backdrop-blur-md transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 active:scale-[0.98]',
    iconClass: 'h-4 w-4 shrink-0',
    label: '',
    showLabel: false,
    ariaLabel: 'راهنمای نقشه',
  },
};

export default function MapGuideTrigger({ variant = 'header', className = '' }) {
  const [open, setOpen] = useState(false);
  const config = VARIANTS[variant] || VARIANTS.header;
  const Icon =
    variant === 'glassMap'
      ? QuestionMarkCircleIcon
      : variant === 'header' || variant === 'mobileHeader'
        ? BookOpenIcon
        : QuestionMarkCircleIcon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${config.className} ${className}`.trim()}
        aria-label={config.ariaLabel}
      >
        <Icon className={config.iconClass} aria-hidden />
        {config.showLabel ? <span>{config.label}</span> : null}
      </button>
      <MapGuideModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
