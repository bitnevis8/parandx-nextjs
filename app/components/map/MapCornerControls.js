'use client';

import { useMemo } from 'react';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { MAP_STYLE_PRESETS, resolveMapStylePreset } from '../../utils/mapStylePresets';
import { MapSettingToggle, MapViewModeToggle } from '../home/MapSettingsBar';
import MapGuideTrigger from '../home/MapGuideTrigger';
import MapUserLocationControl from './MapUserLocationControl';
import MapGlassSearchSelect from './MapGlassSearchSelect';
import MapViewInfoOverlay from './MapViewInfoOverlay';

const MAP_CORNER_ANCHOR = 'absolute bottom-3 end-3 z-[1002]';
const COLUMN_CLASS = 'pointer-events-auto flex h-full w-[9.25rem] flex-col justify-between';

export default function MapCornerControls({
  mapStats,
  show3D = true,
  mapStyleId,
  onMapStyleChange,
  showViewModeToggle = false,
  onSelect2D = null,
  onSelect3D = null,
  showBoundaries = false,
  onShowBoundariesChange = null,
  layout = 'corner',
  showMapGuide = false,
  showMapViewInfo = false,
  useGlass = false,
  mapRef = null,
  showUserLocation = false,
  regionFilters = null,
  categorySearch = null,
  floating = true,
  compactColumn = false,
}) {
  const activeStyle = resolveMapStylePreset(mapStyleId);
  const glass = useGlass || layout === 'splitBottom';

  const columnClass = compactColumn
    ? 'pointer-events-auto flex w-[9.25rem] flex-col gap-1.5'
    : COLUMN_CLASS;

  const layerOptions = useMemo(
    () =>
      MAP_STYLE_PRESETS.map((preset) => ({
        value: preset.id,
        label: preset.label,
        detail: preset.description,
        searchText: `${preset.label} ${preset.description}`.toLowerCase(),
      })),
    []
  );

  const GROUP_CLASS = 'flex flex-col gap-1.5';

  const columnStack = compactColumn ? (
    <div className={columnClass}>
      {categorySearch}
      {regionFilters}
      {showViewModeToggle && onSelect2D && onSelect3D ? (
        <MapViewModeToggle
          glass={glass}
          fullWidth={glass}
          compact
          show3D={show3D}
          onSelect2D={onSelect2D}
          onSelect3D={onSelect3D}
        />
      ) : null}
      {onShowBoundariesChange ? (
        <MapSettingToggle
          glass={glass}
          compact
          fullWidth
          active={showBoundaries}
          onToggle={() => onShowBoundariesChange(!showBoundaries)}
          icon={RectangleGroupIcon}
          label="مرزها"
          ariaOn="مخفی کردن مرزها"
          ariaOff="نمایش مرزها"
        />
      ) : null}
      <MapGlassSearchSelect
        label="لایه"
        value={activeStyle.id}
        onChange={(styleId) => onMapStyleChange?.(styleId)}
        options={layerOptions}
        searchPlaceholder="جستجوی لایه…"
        emptyHint="لایه‌ای پیدا نشد"
      />
      {showUserLocation && mapRef ? (
        <MapUserLocationControl
          mapRef={mapRef}
          markerEngine="maplibre"
          inline
          labeled
          anchoredPortal
          label="موقعیت من"
          appearance={glass ? 'glass' : 'solid'}
          className="w-full"
        />
      ) : null}
      {showMapViewInfo ? (
        <MapViewInfoOverlay
          variant="glassCorner"
          mapStats={mapStats}
          show3D={show3D}
          className="pointer-events-auto w-full"
        />
      ) : null}
      {showMapGuide ? (
        <MapGuideTrigger variant="glassCorner" className="pointer-events-auto w-full" />
      ) : null}
    </div>
  ) : (
    <div className={columnClass}>
      <div className={GROUP_CLASS}>
        {categorySearch}
        {regionFilters}
      </div>
      <div className={GROUP_CLASS}>
        {showViewModeToggle && onSelect2D && onSelect3D ? (
          <MapViewModeToggle
            glass={glass}
            fullWidth={glass}
            compact
            show3D={show3D}
            onSelect2D={onSelect2D}
            onSelect3D={onSelect3D}
          />
        ) : null}
        {onShowBoundariesChange ? (
          <MapSettingToggle
            glass={glass}
            compact
            fullWidth
            active={showBoundaries}
            onToggle={() => onShowBoundariesChange(!showBoundaries)}
            icon={RectangleGroupIcon}
            label="مرزها"
            ariaOn="مخفی کردن مرزها"
            ariaOff="نمایش مرزها"
          />
        ) : null}
        <MapGlassSearchSelect
          label="لایه"
          value={activeStyle.id}
          onChange={(styleId) => onMapStyleChange?.(styleId)}
          options={layerOptions}
          searchPlaceholder="جستجوی لایه…"
          emptyHint="لایه‌ای پیدا نشد"
        />
        {showUserLocation && mapRef ? (
          <MapUserLocationControl
            mapRef={mapRef}
            markerEngine="maplibre"
            inline
            labeled
            anchoredPortal
            label="موقعیت من"
            appearance={glass ? 'glass' : 'solid'}
            className="w-full"
          />
        ) : null}
        {showMapViewInfo ? (
          <MapViewInfoOverlay
            variant="glassCorner"
            mapStats={mapStats}
            show3D={show3D}
            className="pointer-events-auto w-full"
          />
        ) : null}
        {showMapGuide ? (
          <MapGuideTrigger variant="glassCorner" className="pointer-events-auto w-full" />
        ) : null}
      </div>
    </div>
  );

  const rootClass = floating
    ? `${MAP_CORNER_ANCHOR} flex flex-col items-stretch`
    : 'relative flex h-full flex-col items-stretch';

  return <div className={rootClass}>{columnStack}</div>;
}
