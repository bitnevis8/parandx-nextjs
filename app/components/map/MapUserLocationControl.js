'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import maplibregl from 'maplibre-gl';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';
import MapLocationPermissionHelp from './MapLocationPermissionHelp';
import {
  formatAccuracyLabel,
  formatCoordsLabel,
  formatGeoErrorMessage,
  getCurrentPosition,
  isNativeCapacitorApp,
  openNativeLocationSettings,
  shouldShowGeoError,
} from '../../utils/geolocation';

function createUserLocationMarkerElement() {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'map-user-location-marker';
  el.setAttribute('aria-label', 'موقعیت فعلی شما');
  return el;
}

function resolveMarkerLib(engine) {
  if (engine === 'neshan') {
    // eslint-disable-next-line global-require
    return require('@neshan-maps-platform/mapbox-gl');
  }
  return maplibregl;
}

export default function MapUserLocationControl({
  mapRef,
  markerEngine = 'maplibre',
  className = '',
  buttonClassName = '',
  anchor = 'auto',
  appearance = 'solid',
  inline = false,
}) {
  const isMobile = useIsMobileViewport();
  const markerRef = useRef(null);
  const errorTimerRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [needsSettingsHint, setNeedsSettingsHint] = useState(false);

  const clearMarker = useCallback(() => {
    markerRef.current?.remove();
    markerRef.current = null;
  }, []);

  const clearErrorLater = useCallback((message, ms = 4500) => {
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }
    setError(message);
    errorTimerRef.current = window.setTimeout(() => {
      setError(null);
      errorTimerRef.current = null;
    }, ms);
  }, []);

  const syncMarker = useCallback(
    (pos) => {
      const map = mapRef?.current;
      if (!map || pos?.lat == null || pos?.lng == null) return;

      clearMarker();
      const lib = resolveMarkerLib(markerEngine);
      const el = createUserLocationMarkerElement();
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        setShowCard(true);
      });

      markerRef.current = new lib.Marker({ element: el, anchor: 'center' })
        .setLngLat([pos.lng, pos.lat])
        .addTo(map);

      map.flyTo({
        center: [pos.lng, pos.lat],
        zoom: Math.max(map.getZoom(), 15),
        duration: 700,
      });
    },
    [mapRef, markerEngine, clearMarker]
  );

  useEffect(() => {
    if (position) syncMarker(position);
  }, [position, syncMarker]);

  useEffect(
    () => () => {
      clearMarker();
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    },
    [clearMarker]
  );

  const handleLocate = () => {
    if (!mapRef?.current || loading) return;

    setShowCard(false);
    setNeedsSettingsHint(false);
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
    setError(null);
    setLoading(true);

    getCurrentPosition({ isMobile })
      .then((pos) => {
        setPosition(pos);
        setShowCard(true);
        setNeedsSettingsHint(false);
      })
      .catch(async (err) => {
        setPosition(null);
        clearMarker();

        if (err?.code === 'PERMISSION_DENIED') {
          if (isNativeCapacitorApp()) {
            await openNativeLocationSettings();
            return;
          }
          setNeedsSettingsHint(true);
          return;
        }

        const message = formatGeoErrorMessage(err, { mobile: isMobile });
        if (shouldShowGeoError(err, { mobile: isMobile }) && message) {
          clearErrorLater(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const controlAnchorClass = inline
    ? 'relative shrink-0'
    : anchor === 'start'
      ? 'bottom-3 start-3 sm:bottom-3 sm:start-3'
      : anchor === 'end'
        ? 'bottom-3 end-3 sm:bottom-3 sm:end-3'
        : isMobile
          ? 'bottom-3 end-3 sm:bottom-3 sm:end-3'
          : 'bottom-3 start-3 sm:bottom-3 sm:start-3';

  const panelAnchorClass = inline
    ? 'bottom-full z-[1004] mb-2 start-0 max-w-[min(20rem,calc(100vw-1.5rem))]'
    : anchor === 'start'
      ? 'bottom-[3.25rem] start-3 max-w-[calc(100%-1.5rem)] sm:max-w-xs'
      : anchor === 'end'
        ? 'bottom-[3.25rem] end-3 max-w-[calc(100%-1.5rem)] sm:max-w-xs'
        : isMobile
          ? 'bottom-[3.25rem] end-3 max-w-[calc(100%-1.5rem)] sm:max-w-xs'
          : 'bottom-[3.25rem] start-3 max-w-[calc(100%-1.5rem)] sm:max-w-sm';

  const buttonSurfaceClass =
    appearance === 'glass'
      ? 'h-9 w-9 rounded-lg border border-white/40 bg-white/20 text-white shadow-sm backdrop-blur-md hover:bg-white/30 focus-visible:ring-white/45'
      : 'h-11 w-11 rounded-xl border border-white bg-white text-sky-700 shadow-md hover:bg-sky-50';

  return (
    <div
      className={`pointer-events-none ${inline ? 'relative shrink-0' : 'absolute inset-0 z-[1001]'} ${className}`.trim()}
    >
      <button
        type="button"
        onClick={handleLocate}
        disabled={loading}
        className={`pointer-events-auto ${inline ? 'relative' : 'absolute'} flex items-center justify-center transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 ${buttonSurfaceClass} ${controlAnchorClass} ${needsSettingsHint ? 'ring-2 ring-amber-300' : ''} ${buttonClassName}`.trim()}
        aria-label="نمایش موقعیت من"
        title="موقعیت من"
      >
        <ViewfinderCircleIcon
          className={`${appearance === 'glass' ? 'h-4 w-4' : 'h-5 w-5'} ${loading ? 'animate-pulse' : ''}`}
          strokeWidth={2}
        />
      </button>

      {error ? (
        <div
          role="status"
          className={`pointer-events-auto absolute rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow-sm ${panelAnchorClass}`}
        >
          {error}
        </div>
      ) : null}

      {needsSettingsHint && !isNativeCapacitorApp() ? (
        <MapLocationPermissionHelp
          isMobile={isMobile}
          className={`absolute ${panelAnchorClass}`}
          onClose={() => setNeedsSettingsHint(false)}
          onRetry={() => {
            setNeedsSettingsHint(false);
            handleLocate();
          }}
        />
      ) : null}

      {showCard && position ? (
        <div
          className={`pointer-events-auto absolute rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-right shadow-lg ${panelAnchorClass}`}
        >
          <p className="text-sm font-semibold text-sky-900">موقعیت فعلی شما</p>
          <p className="mt-1 text-xs text-gray-700" dir="ltr">
            {formatCoordsLabel(position.lat, position.lng)}
          </p>
          {formatAccuracyLabel(position.accuracy) ? (
            <p className="mt-1 text-[11px] text-gray-500">{formatAccuracyLabel(position.accuracy)}</p>
          ) : null}
          <button
            type="button"
            onClick={() => setShowCard(false)}
            className="mt-2 text-xs font-medium text-sky-700 hover:text-sky-800"
          >
            بستن
          </button>
        </div>
      ) : null}
    </div>
  );
}
