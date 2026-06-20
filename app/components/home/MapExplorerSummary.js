'use client';

import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { MAP_LAYERS } from '../../utils/requestMapUtils';
import { MAP_GOODS_LAYERS } from '../../utils/merchantMapUtils';

function isListLayer(layer) {
  return (
    layer === MAP_LAYERS.requests ||
    layer === MAP_GOODS_LAYERS.needs ||
    layer === MAP_GOODS_LAYERS.supplies
  );
}

const toneStyles = {
  empty: {
    wrap: 'border-gray-200/90 bg-gray-50/95',
    iconWrap: 'bg-gray-100 text-gray-500',
    dot: 'bg-gray-400',
  },
  muted: {
    wrap: 'border-amber-200/90 bg-amber-50/90',
    iconWrap: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
  },
  success: {
    wrap: 'border-teal-200/90 bg-teal-50/85',
    iconWrap: 'bg-teal-100 text-teal-700',
    dot: 'bg-teal-500',
  },
};

function resolveBarIcon(layer, tone) {
  if (tone === 'empty') return MapPinIcon;
  if (isListLayer(layer)) return ClipboardDocumentListIcon;
  return UserGroupIcon;
}

export default function MapExplorerSummary({
  copy,
  compact = false,
  inline = false,
  bar = false,
  footer = false,
  overlay = false,
  layer = MAP_LAYERS.experts,
}) {
  if (!copy?.title) return null;

  const tone = toneStyles[copy.tone] || toneStyles.success;

  if (footer) {
    return (
      <div className="min-w-0 text-right" role="status">
        <p className="truncate text-xs font-bold leading-tight text-gray-900 sm:text-[13px]">
          {copy.title}
        </p>
        {copy.detail ? (
          <p className="mt-0.5 truncate text-[11px] leading-tight text-gray-600">{copy.detail}</p>
        ) : null}
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        className="pointer-events-none max-w-[min(18rem,calc(100%-5.5rem))] rounded-xl border border-white/55 bg-white/92 px-3 py-2 text-right shadow-md backdrop-blur-sm dark:border-sky-700/75 dark:bg-sky-950/88 dark:shadow-black/20"
        role="status"
      >
        <p className="text-xs font-bold leading-snug text-gray-900 dark:text-sky-50 sm:text-[13px]">
          {copy.title}
        </p>
        {copy.detail ? (
          <p className="mt-0.5 text-[11px] leading-snug text-gray-600 dark:text-sky-300">
            {copy.detail}
          </p>
        ) : null}
      </div>
    );
  }

  if (bar) {
    const BarIcon = resolveBarIcon(layer, copy.tone);
    const isList = isListLayer(layer);

    return (
      <div
        className={`flex h-12 min-w-0 items-center gap-3 rounded-2xl border px-3.5 shadow-sm ${tone.wrap}`}
        role="status"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tone.iconWrap}`}
          aria-hidden
        >
          <BarIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-sm font-bold leading-tight text-gray-900">{copy.title}</p>
          {copy.detail ? (
            <p className="mt-0.5 truncate text-[11px] leading-tight text-gray-600 sm:text-xs">
              {copy.detail}
            </p>
          ) : null}
        </div>
        <span
          className={`hidden h-2 w-2 shrink-0 rounded-full sm:block ${
            isList && copy.tone === 'success' ? 'bg-amber-400' : tone.dot
          }`}
          aria-hidden
        />
      </div>
    );
  }

  if (inline) {
    return (
      <div
        className={`inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border px-3 py-1.5 ${tone.wrap}`}
        role="status"
      >
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} aria-hidden />
        <p className="min-w-0 truncate text-xs font-semibold leading-tight text-gray-900 sm:text-[13px]">
          {copy.title}
        </p>
        {copy.detail ? (
          <span className="hidden min-w-0 truncate text-[11px] font-normal text-gray-600 lg:inline">
            · {copy.detail}
          </span>
        ) : null}
      </div>
    );
  }

  const padding = compact ? 'px-3 py-2' : 'px-3.5 py-2.5';
  const titleSize = compact ? 'text-xs' : 'text-sm';

  return (
    <div className={`rounded-xl border ${padding} ${tone.wrap}`} role="status">
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={`font-semibold leading-snug text-gray-900 ${titleSize}`}>{copy.title}</p>
          {copy.detail ? (
            <p
              className={`mt-0.5 leading-snug text-gray-600 ${compact ? 'text-[11px]' : 'text-xs'}`}
            >
              {copy.detail}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
