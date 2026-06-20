'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MAP_GLASS_SURFACE, MAP_GLASS_TEXT } from './mapControlTheme';
import { computeMapCornerPanelStyle } from './mapCornerPanelPosition';

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

const PANEL_CLASS =
  'w-full rounded-xl border border-gray-200/90 bg-white/95 px-3 py-2.5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:border-sky-700/80 dark:bg-sky-950/95';

function InfoPanel({ panelId, mapStats, show3D, className = '' }) {
  const viewLabel = show3D ? 'سه‌بعدی' : 'دوبعدی';

  return (
    <div id={panelId} role="dialog" aria-label="اطلاعات نمای نقشه" className={`${PANEL_CLASS} ${className}`.trim()}>
      <p className="mb-2 text-[11px] font-bold text-gray-700 dark:text-sky-100">اطلاعات نقشه</p>
      <dl className="space-y-1.5 text-[11px] text-gray-600 dark:text-sky-300">
        {INFO_ROWS.map(({ key, label, unit, decimals }) => (
          <div key={key} className="flex items-baseline justify-between gap-3">
            <dt className="shrink-0 text-gray-500 dark:text-sky-400">{label}</dt>
            <dd className="font-semibold text-gray-800 tabular-nums dark:text-sky-100" dir="ltr">
              {formatValue(mapStats?.[key], decimals)}
              {unit}
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 pt-1.5 dark:border-sky-800">
          <dt className="shrink-0 text-gray-500 dark:text-sky-400">نمای نقشه</dt>
          <dd className="font-semibold text-gray-800 dark:text-sky-100">{viewLabel}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function MapViewInfoOverlay({
  mapStats,
  show3D = true,
  variant = 'overlay',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState(null);
  const wrapRef = useRef(null);
  const panelId = useId();
  const isGlassCorner = variant === 'glassCorner';

  useLayoutEffect(() => {
    if (!open || !isGlassCorner) {
      setPanelStyle(null);
      return undefined;
    }

    const updatePosition = () => {
      const rect = wrapRef.current?.getBoundingClientRect();
      setPanelStyle(computeMapCornerPanelStyle(rect, 220, 248, true));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, isGlassCorner]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      const panel = document.getElementById(panelId);
      if (wrapRef.current?.contains(event.target) || panel?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, panelId]);

  const toggle = () => setOpen((prev) => !prev);

  if (isGlassCorner) {
    return (
      <>
        <div ref={wrapRef} className={className}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'بستن اطلاعات نقشه' : 'نمایش اطلاعات نقشه'}
            title="اطلاعات نقشه"
            onClick={toggle}
            className={`inline-flex h-9 w-full items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold transition hover:bg-slate-950/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 active:scale-[0.98] ${MAP_GLASS_SURFACE} ${MAP_GLASS_TEXT} ${
              open ? 'ring-1 ring-white/35' : ''
            }`}
          >
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold leading-none">
              i
            </span>
            <span>اطلاعات</span>
          </button>
        </div>

        {open && panelStyle && typeof document !== 'undefined'
          ? createPortal(
              <div style={panelStyle}>
                <InfoPanel panelId={panelId} mapStats={mapStats} show3D={show3D} />
              </div>,
              document.body
            )
          : null}
      </>
    );
  }

  return (
    <div ref={wrapRef} className={`absolute bottom-3 end-3 z-[1002] flex flex-col items-end gap-2 ${className}`.trim()}>
      {open ? (
        <InfoPanel
          panelId={panelId}
          mapStats={mapStats}
          show3D={show3D}
          className="w-[min(16.5rem,calc(100vw-2rem))]"
        />
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'بستن اطلاعات نقشه' : 'نمایش اطلاعات نقشه'}
        title="اطلاعات نقشه"
        onClick={toggle}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
          open
            ? 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-500/50 dark:bg-teal-500/20 dark:text-teal-100'
            : 'border-gray-200/90 bg-white/95 text-gray-600 hover:bg-white hover:text-teal-700 dark:border-sky-700 dark:bg-sky-950/90 dark:text-sky-200 dark:hover:text-teal-300'
        }`}
      >
        <span className="text-xs font-bold leading-none" aria-hidden>
          i
        </span>
      </button>
    </div>
  );
}
