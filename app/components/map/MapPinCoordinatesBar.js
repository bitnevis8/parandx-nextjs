'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

function formatCoord(value, decimals = 5) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(decimals);
}

/**
 * نمایش خطی مختصات مارکر — زیر نقشه + دکمه کپی
 */
export default function MapPinCoordinatesBar({ pin, className = '' }) {
  const [copied, setCopied] = useState(false);

  if (pin?.lat == null || pin?.lng == null) return null;

  const lat = formatCoord(pin.lat);
  const lng = formatCoord(pin.lng);
  const copyText = `عرض جغرافیایی: ${lat}° | طول جغرافیایی: ${lng}°`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ممکن است در HTTP غیرامن در دسترس نباشد */
    }
  };

  return (
    <div
      className={`flex items-center gap-2 border-t border-gray-200 bg-gray-50/90 px-3 py-2 ${className}`.trim()}
      aria-live="polite"
    >
      <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-gray-700 sm:text-xs">
        <span className="text-gray-500">عرض جغرافیایی</span>{' '}
        <span className="font-semibold tabular-nums text-gray-900" dir="ltr">
          {lat}°
        </span>
        <span className="mx-1.5 text-gray-300" aria-hidden>
          ·
        </span>
        <span className="text-gray-500">طول جغرافیایی</span>{' '}
        <span className="font-semibold tabular-nums text-gray-900" dir="ltr">
          {lng}°
        </span>
      </p>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-medium text-gray-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 sm:text-[11px]"
        aria-label={copied ? 'مختصات کپی شد' : 'کپی مختصات مارکر'}
        title={copied ? 'کپی شد' : 'کپی مختصات'}
      >
        {copied ? (
          <>
            <CheckIcon className="h-3.5 w-3.5 text-teal-600" aria-hidden />
            <span className="hidden text-teal-700 sm:inline">کپی شد</span>
          </>
        ) : (
          <>
            <ClipboardDocumentIcon className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">کپی</span>
          </>
        )}
      </button>
    </div>
  );
}
