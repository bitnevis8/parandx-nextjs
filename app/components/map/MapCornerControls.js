'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Square3Stack3DIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { MAP_STYLE_PRESETS, resolveMapStylePreset } from '../../utils/mapStylePresets';
import { MapSettingToggle, MapViewModeToggle } from '../home/MapSettingsBar';
import MapGuideTrigger from '../home/MapGuideTrigger';

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

export default function MapCornerControls({
  mapStats,
  show3D = true,
  mapStyleId,
  onMapStyleChange,
  showViewModeToggle = false,
  onSelect2D,
  onSelect3D,
  showBoundaries = false,
  onShowBoundariesChange = null,
  layout = 'corner',
  showMapGuide = false,
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const wrapRef = useRef(null);
  const infoPanelId = useId();
  const layersPanelId = useId();
  const activeStyle = resolveMapStylePreset(mapStyleId);

  useEffect(() => {
    if (!infoOpen && !layersOpen) return undefined;

    const handlePointerDown = (event) => {
      if (wrapRef.current?.contains(event.target)) return;
      setInfoOpen(false);
      setLayersOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [infoOpen, layersOpen]);

  const viewLabel = show3D ? 'سه‌بعدی' : 'دوبعدی';

  const toggleInfo = () => {
    setLayersOpen(false);
    setInfoOpen((prev) => !prev);
  };

  const toggleLayers = () => {
    setInfoOpen(false);
    setLayersOpen((prev) => !prev);
  };

  const selectStyle = (styleId) => {
    onMapStyleChange?.(styleId);
    setLayersOpen(false);
  };

  if (layout === 'splitBottom') {
    return (
      <div className="absolute bottom-3 end-3 z-[1002] flex max-w-[calc(100%-5.5rem)] items-center gap-1.5">
        {showMapGuide ? <MapGuideTrigger variant="glassMap" /> : null}
        {onShowBoundariesChange ? (
          <MapSettingToggle
            glass
            compact
            active={showBoundaries}
            onToggle={() => onShowBoundariesChange(!showBoundaries)}
            icon={RectangleGroupIcon}
            label="مرزها"
            ariaOn="مخفی کردن مرزبندی"
            ariaOff="نمایش مرزبندی"
          />
        ) : null}
        {showViewModeToggle ? (
          <MapViewModeToggle
            glass
            compact
            show3D={show3D}
            onSelect2D={onSelect2D}
            onSelect3D={onSelect3D}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="absolute bottom-3 end-3 z-[1002] flex flex-col items-end gap-2">
      {layersOpen ? (
        <div
          id={layersPanelId}
          role="dialog"
          aria-label="انتخاب لایه نقشه"
          className="w-[min(15.5rem,calc(100vw-2rem))] rounded-xl border border-gray-200/90 bg-white/95 px-3 py-2.5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
        >
          <p className="mb-2 text-[11px] font-bold text-gray-700">لایهٔ نقشه</p>
          <ul className="space-y-1">
            {MAP_STYLE_PRESETS.map((preset) => {
              const selected = preset.id === activeStyle.id;
              return (
                <li key={preset.id}>
                  <button
                    type="button"
                    onClick={() => selectStyle(preset.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-right transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
                      selected
                        ? 'bg-teal-50 ring-1 ring-teal-200/90'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-md border border-gray-200/80 shadow-inner"
                      style={{ backgroundColor: preset.swatch }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-gray-800">{preset.label}</span>
                      <span className="block text-[10px] text-gray-500">{preset.description}</span>
                    </span>
                    {selected ? (
                      <span className="shrink-0 text-[10px] font-bold text-teal-700">فعال</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {infoOpen ? (
        <div
          id={infoPanelId}
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
            <div className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-gray-500">لایه</dt>
              <dd className="font-semibold text-gray-800">{activeStyle.label}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {onShowBoundariesChange ? (
          <MapSettingToggle
            compact
            active={showBoundaries}
            onToggle={() => onShowBoundariesChange(!showBoundaries)}
            icon={RectangleGroupIcon}
            label="مرزها"
            ariaOn="مخفی کردن مرزبندی"
            ariaOff="نمایش مرزبندی"
          />
        ) : null}
        {showViewModeToggle ? (
          <MapViewModeToggle
            show3D={show3D}
            onSelect2D={onSelect2D}
            onSelect3D={onSelect3D}
          />
        ) : null}
        <button
          type="button"
          aria-expanded={layersOpen}
          aria-controls={layersPanelId}
          aria-label={layersOpen ? 'بستن انتخاب لایه' : 'انتخاب لایه نقشه'}
          title="لایه‌های نقشه"
          onClick={toggleLayers}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
            layersOpen
              ? 'border-teal-300 bg-teal-50 text-teal-700'
              : 'border-gray-200/90 bg-white/95 text-gray-600 hover:bg-white hover:text-teal-700'
          }`}
        >
          <Square3Stack3DIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </button>

        <button
          type="button"
          aria-expanded={infoOpen}
          aria-controls={infoPanelId}
          aria-label={infoOpen ? 'بستن اطلاعات نقشه' : 'نمایش اطلاعات نقشه'}
          title="اطلاعات نقشه"
          onClick={toggleInfo}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
            infoOpen
              ? 'border-teal-300 bg-teal-50 text-teal-700'
              : 'border-gray-200/90 bg-white/95 text-gray-600 hover:bg-white hover:text-teal-700'
          }`}
        >
          <span className="text-xs font-bold leading-none" aria-hidden>
            i
          </span>
        </button>
      </div>
    </div>
  );
}
