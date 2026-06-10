'use client';

import { useEffect, useId, useRef, useState } from 'react';
function formatValue(value, decimals = 4) {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(decimals);
}

const INFO_ROWS = [
  { key: 'lat', label: 'عرض جغرافیایی', unit: '°', decimals: 4 },
  { key: 'lng', label: 'طول جغرافیایی', unit: '°', decimals: 4 },
  { key: 'zoom', label: 'سطح زوم', unit: '', decimals: 1 },
  { key: 'pitch', label: 'زاویه کجی', unit: '°', decimals: 0 },
  { key: 'bearing', label: 'زاویه چرخش', unit: '°', decimals: 0 },
];

export default function MapViewInfoOverlay({ mapStats, show3D = true }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (wrapRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const viewLabel = show3D ? 'سه‌بعدی' : 'دوبعدی';

  return (
    <div ref={wrapRef} className="absolute bottom-3 end-3 z-[1002] flex flex-col items-end gap-2">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="اطلاعات نمای نقشه"
          className="w-[min(16.5rem,calc(100vw-2rem))] rounded-xl border border-gray-200/90 bg-white/95 px-3 py-2.5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
        >
          <p className="mb-2 text-[11px] font-bold text-gray-700">اطلاعات نقشه</p>
          <dl className="space-y-1.5 text-[11px] text-gray-600">
            {INFO_ROWS.map(({ key, label, unit, decimals }) => (
              <div key={key} className="flex items-baseline justify-between gap-3">
                <dt className="shrink-0 text-gray-500">{label}</dt>
                <dd className="font-semibold text-gray-800 tabular-nums" dir="ltr">
                  {formatValue(mapStats?.[key], decimals)}
                  {unit}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 pt-1.5">
              <dt className="shrink-0 text-gray-500">نمای نقشه</dt>
              <dd className="font-semibold text-gray-800">{viewLabel}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'بستن اطلاعات نقشه' : 'نمایش اطلاعات نقشه'}
        title="اطلاعات نقشه"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
          open
            ? 'border-teal-300 bg-teal-50 text-teal-700'
            : 'border-gray-200/90 bg-white/95 text-gray-600 hover:bg-white hover:text-teal-700'
        }`}
      >
        <span className="text-xs font-bold leading-none" aria-hidden>
          i
        </span>
      </button>
    </div>
  );
}
