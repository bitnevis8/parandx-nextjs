'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { MAP_GLASS_ICON_BTN, MAP_GLASS_SURFACE } from './mapControlTheme';
import { computeMapCornerPanelStyle } from './mapCornerPanelPosition';

const HELP_PANEL_WIDTH = 288;
const CARD_PANEL_WIDTH = 248;

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
  labeled = false,
  anchoredPortal = false,
  label = 'موقعیت',
}) {
  const isMobile = useIsMobileViewport();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const markerRef = useRef(null);
  const errorTimerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [needsSettingsHint, setNeedsSettingsHint] = useState(false);

  const usePortalPanels = anchoredPortal || (inline && labeled);

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

  const updatePanelPosition = useCallback((panelHeightEstimate, panelWidth) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setPanelStyle(
      computeMapCornerPanelStyle(
        trigger.getBoundingClientRect(),
        panelHeightEstimate,
        panelWidth,
        usePortalPanels
      )
    );
  }, [usePortalPanels]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const panelOpen = Boolean(error || needsSettingsHint || showCard);

  useEffect(() => {
    if (!usePortalPanels || !panelOpen) {
      setPanelStyle(null);
      return undefined;
    }

    const estimate = needsSettingsHint ? 320 : showCard ? 140 : 80;
    const width = needsSettingsHint ? HELP_PANEL_WIDTH : CARD_PANEL_WIDTH;
    const reposition = () => updatePanelPosition(estimate, width);
    reposition();

    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      if (panelRef.current?.contains(event.target)) return;
      setShowCard(false);
      setNeedsSettingsHint(false);
      setError(null);
    };

    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [usePortalPanels, panelOpen, needsSettingsHint, showCard, error, updatePanelPosition]);

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
    ? 'bottom-full z-[1004] mb-2 start-0 w-[min(18rem,calc(100vw-1.5rem))]'
    : anchor === 'start'
      ? 'bottom-[3.25rem] start-3 max-w-[calc(100%-1.5rem)] sm:max-w-xs'
      : anchor === 'end'
        ? 'bottom-[3.25rem] end-3 max-w-[calc(100%-1.5rem)] sm:max-w-xs'
        : isMobile
          ? 'bottom-[3.25rem] end-3 max-w-[calc(100%-1.5rem)] sm:max-w-xs'
          : 'bottom-[3.25rem] start-3 max-w-[calc(100%-1.5rem)] sm:max-w-sm';

  const buttonSurfaceClass =
    appearance === 'glass'
      ? labeled
        ? `inline-flex h-9 w-full items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold ${MAP_GLASS_SURFACE} text-white/95 transition hover:bg-slate-950/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 disabled:opacity-60`
        : `${MAP_GLASS_ICON_BTN} disabled:opacity-60`
      : labeled
        ? 'inline-flex h-9 w-full items-center gap-1.5 rounded-lg border border-gray-200/90 bg-white/95 px-2 text-[11px] font-semibold text-gray-600 shadow-md hover:bg-white hover:text-teal-700 dark:border-sky-700/80 dark:bg-sky-950/90 dark:text-sky-200'
        : 'h-11 w-11 rounded-xl border border-white bg-white text-sky-700 shadow-md hover:bg-sky-50';

  const portalPanel =
    usePortalPanels && panelOpen && panelStyle ? (
      <div ref={panelRef} style={panelStyle} className="pointer-events-auto">
        {error ? (
          <div
            role="status"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow-lg"
          >
            {error}
          </div>
        ) : null}
        {needsSettingsHint && !isNativeCapacitorApp() ? (
          <MapLocationPermissionHelp
            isMobile={isMobile}
            className="shadow-2xl ring-1 ring-black/10"
            onClose={() => setNeedsSettingsHint(false)}
            onRetry={() => {
              setNeedsSettingsHint(false);
              handleLocate();
            }}
          />
        ) : null}
        {showCard && position ? (
          <div className="rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-right shadow-2xl ring-1 ring-black/10">
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
    ) : null;

  return (
    <div
      className={`pointer-events-none ${inline ? 'relative shrink-0' : 'absolute inset-0 z-[1001]'} ${className}`.trim()}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleLocate}
        disabled={loading}
        className={`pointer-events-auto ${inline ? 'relative' : 'absolute'} flex items-center justify-center transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 ${buttonSurfaceClass} ${labeled ? '' : controlAnchorClass} ${needsSettingsHint ? 'ring-2 ring-amber-300' : ''} ${buttonClassName}`.trim()}
        aria-label="نمایش موقعیت من"
        title="موقعیت من"
      >
        <ViewfinderCircleIcon
          className={`${appearance === 'glass' || labeled ? 'h-3.5 w-3.5 shrink-0' : 'h-5 w-5'} ${loading ? 'animate-pulse' : ''}`}
          strokeWidth={labeled ? 1.75 : 2}
        />
        {labeled ? <span className="min-w-0 flex-1 text-right">{label}</span> : null}
      </button>

      {!usePortalPanels && error ? (
        <div
          role="status"
          className={`pointer-events-auto absolute rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow-sm ${panelAnchorClass}`}
        >
          {error}
        </div>
      ) : null}

      {!usePortalPanels && needsSettingsHint && !isNativeCapacitorApp() ? (
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

      {!usePortalPanels && showCard && position ? (
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

      {mounted && portalPanel ? createPortal(portalPanel, document.body) : null}
    </div>
  );
}
