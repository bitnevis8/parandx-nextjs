'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { DASHBOARD_MAP_VIEW_DEFAULTS } from '../../utils/cityMapConfig';

const AhvazAddressPicker = dynamic(() => import('./AhvazAddressPicker'), { ssr: false });

/**
 * نقشهٔ یکپارچه آدرس / پروفایل — همان تجربهٔ صفحهٔ اصلی + مارکر در حالت ثبت.
 * @param {'edit' | 'preview'} mode
 */
export default function CityAddressMap({
  city,
  mode = 'edit',
  value,
  onChange,
  onPinChange,
  showPin,
  pinPosition,
  pinMarkerGlb = null,
  focusOnPin,
  className = '',
  mapViewportHeightClass = 'h-52 sm:h-64 md:h-72',
  autoFitBoundsOnSelect = false,
  panOnSelect = false,
  autoFitBoundsOnLoad = false,
  lockMapView = true,
  mapViewPitch = DASHBOARD_MAP_VIEW_DEFAULTS.pitch,
  mapViewBearing = DASHBOARD_MAP_VIEW_DEFAULTS.bearing,
  showBoundaries: showBoundariesProp,
  onShowBoundariesChange: onShowBoundariesChangeProp,
  ...rest
}) {
  const isEdit = mode === 'edit';
  const isPreview = mode === 'preview';
  const hasPin = pinPosition?.lat != null && pinPosition?.lng != null;

  const [internalShowBoundaries, setInternalShowBoundaries] = useState(false);
  const showBoundaries =
    showBoundariesProp !== undefined ? showBoundariesProp : internalShowBoundaries;
  const onShowBoundariesChange =
    onShowBoundariesChangeProp ||
    (showBoundariesProp === undefined ? setInternalShowBoundaries : undefined);

  return (
    <AhvazAddressPicker
      city={city}
      className={`w-full ${className}`.trim()}
      mapViewportHeightClass={mapViewportHeightClass}
      value={value}
      onChange={onChange}
      onPinChange={onPinChange}
      interactive={isEdit}
      selectable={isEdit}
      enableGestures
      showPin={showPin ?? (isEdit || hasPin)}
      pinPosition={pinPosition}
      pinMarkerGlb={pinMarkerGlb}
      focusOnPin={focusOnPin ?? (isPreview && hasPin)}
      boundaryVariant="outline"
      showBoundaries={showBoundaries}
      onShowBoundariesChange={onShowBoundariesChange}
      showMapTools
      showViewModeToggle
      autoFitBoundsOnSelect={autoFitBoundsOnSelect}
      panOnSelect={panOnSelect}
      autoFitBoundsOnLoad={autoFitBoundsOnLoad}
      lockMapView={lockMapView}
      mapViewPitch={mapViewPitch}
      mapViewBearing={mapViewBearing}
      {...rest}
    />
  );
}
