'use client';

import { useState } from 'react';
import { QuestionMarkCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import MapGuideModal from './MapGuideModal';
import { MAP_GLASS_SURFACE, MAP_GLASS_TEXT } from '../map/mapControlTheme';

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
  cardHeader: {
    className:
      'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200/90 bg-white px-2.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:border-sky-700/80 dark:bg-sky-900/90 dark:text-sky-100 dark:hover:border-sky-600 dark:hover:bg-sky-800/90 sm:h-10 sm:gap-2 sm:px-3 sm:text-sm',
    iconClass: 'h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300',
    label: 'راهنما',
    showLabel: true,
    ariaLabel: 'باز کردن راهنمای نقشه',
  },
  mobileHeader: {
    className:
      'inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:border-sky-700/80 dark:bg-sky-900/90 dark:text-sky-100 dark:hover:border-sky-600 dark:hover:bg-sky-800/90',
    iconClass: 'h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300',
    label: 'راهنما',
    showLabel: true,
    ariaLabel: 'راهنمای نقشه',
  },
  textLink: {
    className:
      'inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-teal-600 underline-offset-2 transition hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:text-sky-300 dark:hover:text-sky-200',
    iconClass: 'h-4 w-4 shrink-0',
    label: 'راهنما',
    showLabel: true,
    showIcon: true,
    ariaLabel: 'راهنمای نقشه',
  },
  mobileOverlay: {
    className:
      'inline-flex shrink-0 items-center gap-1 p-0 text-xs font-semibold text-teal-600 underline-offset-2 transition hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/35 dark:text-sky-300 dark:hover:text-sky-200',
    iconClass: 'h-4 w-4 shrink-0',
    label: 'راهنما',
    showLabel: true,
    showIcon: true,
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
  glassCorner: {
    className: `inline-flex h-9 w-full items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold ${MAP_GLASS_SURFACE} ${MAP_GLASS_TEXT} transition hover:bg-slate-950/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 active:scale-[0.98]`,
    iconClass: 'h-3.5 w-3.5 shrink-0',
    label: 'راهنما',
    showLabel: true,
    ariaLabel: 'راهنمای نقشه',
  },
};

export default function MapGuideTrigger({ variant = 'header', className = '' }) {
  const [open, setOpen] = useState(false);
  const config = VARIANTS[variant] || VARIANTS.header;
  const Icon =
    variant === 'glassMap' || variant === 'glassCorner'
      ? QuestionMarkCircleIcon
      : BookOpenIcon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${config.className} ${className}`.trim()}
        aria-label={config.ariaLabel}
      >
        {config.showIcon !== false ? (
          <Icon className={config.iconClass} aria-hidden />
        ) : null}
        {config.showLabel ? <span>{config.label}</span> : null}
      </button>
      <MapGuideModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
