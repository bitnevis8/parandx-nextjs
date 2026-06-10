'use client';

import { useMemo, useState } from 'react';
import {
  detectBrowserFamily,
  GEOLOCATION_BROWSER_GUIDES,
  GEOLOCATION_HELP_FOOTER,
  GEOLOCATION_HELP_LEAD,
  GEOLOCATION_HELP_TITLE,
  GEOLOCATION_INSECURE_NOTE,
  isSecureWebContext,
} from '../../copy/geolocationPermissionHelpFa';

const BROWSER_ORDER = ['chrome', 'firefox'];

export default function MapLocationPermissionHelp({
  isMobile = false,
  onClose,
  onRetry,
  className = '',
}) {
  const detected = useMemo(() => detectBrowserFamily(), []);
  const [activeId, setActiveId] = useState(detected);

  const activeGuide = GEOLOCATION_BROWSER_GUIDES[activeId] || GEOLOCATION_BROWSER_GUIDES.chrome;
  const steps = isMobile ? activeGuide.mobile : activeGuide.desktop;
  const showInsecureNote = isMobile && !isSecureWebContext();

  return (
    <div
      role="dialog"
      aria-labelledby="map-geo-help-title"
      className={`pointer-events-auto max-h-[min(52dvh,22rem)] overflow-y-auto overscroll-contain rounded-xl border border-sky-200/90 bg-white/98 px-3 py-3 text-right shadow-lg backdrop-blur-sm sm:max-w-sm ${className}`.trim()}
    >
      <p id="map-geo-help-title" className="text-sm font-bold text-sky-900">
        {GEOLOCATION_HELP_TITLE}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600">{GEOLOCATION_HELP_LEAD}</p>

      <div className="mt-3 flex gap-1 rounded-lg bg-gray-100 p-0.5" role="tablist" aria-label="مرورگر">
        {BROWSER_ORDER.map((id) => {
          const guide = GEOLOCATION_BROWSER_GUIDES[id];
          const selected = activeId === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(id)}
              className={`min-w-0 flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold transition sm:text-[11px] ${
                selected
                  ? 'bg-white text-teal-800 shadow-sm ring-1 ring-gray-200/80'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {guide.label}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5" role="tabpanel">
        <p className="mb-1.5 text-[11px] font-semibold text-gray-800">
          {isMobile ? 'روی گوشی / تبلت' : 'روی کامپیوتر'}
          {detected === activeId ? (
            <span className="ms-1.5 rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700">
              مرورگر شما
            </span>
          ) : null}
        </p>
        <ol className="list-decimal space-y-1.5 pe-1 ps-4 text-[11px] leading-relaxed text-gray-700 marker:font-bold marker:text-teal-700">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {showInsecureNote ? (
          <p className="mt-2 rounded-lg border border-red-200/90 bg-red-50/90 px-2 py-1.5 text-[10px] leading-relaxed text-red-900">
            {GEOLOCATION_INSECURE_NOTE}
          </p>
        ) : null}
      </div>

      <p className="mt-2.5 rounded-lg bg-amber-50/90 px-2 py-1.5 text-[10px] leading-relaxed text-amber-900 ring-1 ring-amber-100">
        {GEOLOCATION_HELP_FOOTER}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center justify-end gap-2">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-teal-700"
          >
            دوباره امتحان
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
        >
          بستن
        </button>
      </div>
    </div>
  );
}
