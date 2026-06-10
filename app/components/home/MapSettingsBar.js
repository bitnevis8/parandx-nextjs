'use client';

import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import MapExplorerSummary from './MapExplorerSummary';
import { MAP_GLASS_GROUP, MAP_GLASS_MUTED, MAP_GLASS_SURFACE, MAP_GLASS_TEXT } from '../map/mapControlTheme';

export function MapSettingToggle({
  active,
  onToggle,
  icon: Icon,
  label,
  ariaOn,
  ariaOff,
  compact = false,
  glass = false,
}) {
  const glassClass = glass
    ? `h-9 gap-1.5 rounded-lg px-2 text-[11px] font-semibold ${MAP_GLASS_SURFACE} ${MAP_GLASS_TEXT} hover:bg-white/30`
    : `rounded-lg font-semibold ${
        compact ? 'px-2 py-1.5 text-[10px]' : 'gap-2 px-3 py-2 text-xs'
      } ${
        active
          ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-200/90 hover:bg-teal-100/80'
          : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
      }`;

  const switchTrackClass = glass
    ? `h-4 w-7 ${active ? 'bg-white/45' : 'bg-white/20'}`
    : `${compact ? 'h-4 w-7' : 'h-5 w-9'} ${active ? 'bg-teal-500' : 'bg-gray-300'}`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={active ? ariaOn : ariaOff}
      onClick={onToggle}
      className={`inline-flex items-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 ${glassClass}`}
    >
      <Icon className={`shrink-0 ${compact || glass ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} strokeWidth={1.75} aria-hidden />
      <span className={compact && !glass ? 'max-w-[4.5rem] truncate sm:max-w-none' : ''}>{label}</span>
      <span className={`relative shrink-0 rounded-full transition-colors ${switchTrackClass}`} aria-hidden>
        <span
          className={`absolute top-0.5 rounded-full bg-white shadow-sm transition-all h-3 w-3 ${
            active ? 'start-0.5' : 'start-[0.875rem]'
          }`}
        />
      </span>
    </button>
  );
}

export function MapViewModeToggle({ show3D, onSelect2D, onSelect3D, compact = false, glass = false }) {
  const shellClass = glass
    ? MAP_GLASS_GROUP
    : `inline-flex rounded-lg bg-white/95 p-0.5 shadow-md ring-1 ring-gray-200/90 backdrop-blur-sm ${
        compact ? '' : ''
      }`;

  const activeClass = glass
    ? 'bg-white/35 text-white shadow-sm'
    : 'bg-teal-500 text-white shadow-sm';
  const idleClass = glass
    ? `${MAP_GLASS_MUTED} hover:bg-white/15`
    : 'text-gray-600 hover:bg-gray-50';

  const btnSize = glass || compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';

  return (
    <div className={shellClass} role="group" aria-label="نمای نقشه">
      <button
        type="button"
        aria-pressed={!show3D}
        onClick={onSelect2D}
        className={`rounded-md font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 ${btnSize} ${
          !show3D ? activeClass : idleClass
        }`}
      >
        2D
      </button>
      <button
        type="button"
        aria-pressed={show3D}
        onClick={onSelect3D}
        className={`rounded-md font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 ${btnSize} ${
          show3D ? activeClass : idleClass
        }`}
      >
        3D
      </button>
    </div>
  );
}

export default function MapSettingsBar({
  showBoundaries = true,
  onShowBoundariesChange,
  show3D = true,
  onSelect2D,
  onSelect3D,
  summaryCopy = null,
  mapLayer = null,
  compact = false,
}) {
  const hasSummary = Boolean(summaryCopy?.title);

  return (
    <div
      className={`border-t border-gray-200/90 bg-gray-50/95 ${
        compact ? 'space-y-2 px-3 py-2' : 'flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:px-4'
      }`}
      aria-label="تنظیمات نقشه"
    >
      {compact ? (
        <>
          {hasSummary ? (
            <MapExplorerSummary copy={summaryCopy} footer layer={mapLayer} />
          ) : null}
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <MapViewModeToggle compact show3D={show3D} onSelect2D={onSelect2D} onSelect3D={onSelect3D} />
            <MapSettingToggle
              compact
              active={showBoundaries}
              onToggle={() => onShowBoundariesChange?.(!showBoundaries)}
              icon={RectangleGroupIcon}
              label="مرزها"
              ariaOn="مخفی کردن مرزها"
              ariaOff="نمایش مرزها"
            />
          </div>
        </>
      ) : (
        <>
          {hasSummary ? (
            <div className="hidden min-w-0 flex-1 md:block">
              <MapExplorerSummary copy={summaryCopy} footer layer={mapLayer} />
            </div>
          ) : null}
          <div
            className={`flex flex-wrap items-center gap-2 ${hasSummary ? 'ms-auto' : 'ms-auto w-full justify-end'}`}
          >
            <MapViewModeToggle show3D={show3D} onSelect2D={onSelect2D} onSelect3D={onSelect3D} />
            <MapSettingToggle
              active={showBoundaries}
              onToggle={() => onShowBoundariesChange?.(!showBoundaries)}
              icon={RectangleGroupIcon}
              label="نمایش مرزها"
              ariaOn="مخفی کردن مرزها"
              ariaOff="نمایش مرزها"
            />
          </div>
        </>
      )}
    </div>
  );
}
