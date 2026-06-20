'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getGeometryCentroid } from '../../utils/geojsonBoundary';
import {
  BOUNDARY_LABEL_DIRECT_RENDER_LIMIT,
  createBoundaryClusterHtml,
  createBoundaryLabelSpan,
} from '../../utils/boundaryMapLabel';
import { fitMapToGeoData } from '../../utils/mapLibreBounds';
import {
  BOUNDARY_CLUSTER_MAX_ZOOM,
  BOUNDARY_CLUSTER_SECTION_MAX_ZOOM,
} from '../../utils/boundaryMapLabel';
import { createPointIndex, getClusterExpansionTargetZoom, getClustersForViewport, resolveBoundaryClusterRadius } from '../../utils/mapSupercluster';
import {
  getMapView,
  MAP_2D_BEARING,
  MAP_2D_PITCH,
  MAP_3D_PITCH,
  MAP_MAX_PITCH,
  resolveBoundaryPaint,
} from '../../utils/mapLibre3DConfig';
import { DEFAULT_MAP_STYLE_ID, resolveMapStyleUrl } from '../../utils/mapStylePresets';
import { ensureMapLibreRtlPlugin, enhancePersianSymbolLayers } from '../../utils/mapLibreRtl';
import { applyBuildingExtrusion } from '../../utils/mapBuildingExtrusion';
import { EXPERT_MARKER_STYLES } from '../../utils/mapExpertMarkerConfig';
import {
  buildExpertMarkerElement,
  buildExpertMarkerPopupHtml,
  resolveExpertPoleHeightPx,
} from '../../utils/expertMapMarkerUi';
import { buildMerchantGlbMarkerElement } from '../../utils/mapGlbMarkerUi';
import {
  buildRequestMarkerElement,
  buildRequestMarkerPopupHtml,
  resolveRequestBeaconHeightPx,
} from '../../utils/requestMapMarkerUi';
import { buildGlbAddressPinElement } from '../../utils/mapGlbMarkerUi';

const BOUNDARY_SOURCE_ID = 'px-boundaries';
const BOUNDARY_FILL_LAYER_ID = 'px-boundaries-fill';
const BOUNDARY_LINE_LAYER_ID = 'px-boundaries-line';
const BOUNDARY_HIT_LAYER_ID = 'px-boundaries-hit';
const HIGHLIGHT_SOURCE_ID = 'px-boundary-highlight';
const HIGHLIGHT_FILL_LAYER_ID = 'px-boundary-highlight-fill';
const HIGHLIGHT_LINE_LAYER_ID = 'px-boundary-highlight-line';

function emptyCollection() {
  return { type: 'FeatureCollection', features: [] };
}

const ADDRESS_PIN_MARKER_OPTIONS = {
  anchor: 'bottom',
  pitchAlignment: 'viewport',
  rotationAlignment: 'viewport',
  opacity: 1,
  opacityWhenCovered: 1,
  subpixelPositioning: true,
};

function forceAddressPinVisible(marker) {
  if (!marker) return;
  marker.setOpacity(1, 1);
  const el = marker.getElement();
  if (!el) return;
  el.style.opacity = '1';
  el.classList.remove('maplibregl-marker-covered');
}

function buildAddressPinRoot({ glbSrc, is3DView, preview = false }) {
  let root;
  if (glbSrc) {
    root = buildGlbAddressPinElement(glbSrc, { show3D: is3DView });
  } else {
    const el = document.createElement('span');
    el.className = 'map-pin-marker';
    el.setAttribute('aria-hidden', 'true');
    root = document.createElement('div');
    root.className = is3DView
      ? 'map-pin-marker-wrap map-pin-marker-wrap--3d'
      : 'map-pin-marker-wrap';
    root.appendChild(el);
  }
  if (preview) {
    root.classList.add(
      glbSrc ? 'map-glb-pin-wrap--preview' : 'map-pin-marker-wrap--preview'
    );
  }
  return root;
}

function isMap3DPinView(map, show3D) {
  const pitch = Number(map?.getPitch?.()) || 0;
  return pitch > 10 || Boolean(show3D);
}

export function readMapViewState(map) {
  const center = map.getCenter();
  return {
    lat: center.lat,
    lng: center.lng,
    zoom: map.getZoom(),
    pitch: map.getPitch(),
    bearing: map.getBearing(),
  };
}

function buildViewOverrides(show3D, viewPitch, viewBearing) {
  if (!show3D) return {};
  if (viewPitch == null && viewBearing == null) return {};
  return { pitch: viewPitch, bearing: viewBearing };
}

function isMapDisplayReady(map) {
  return Boolean(map && (typeof map.isStyleLoaded !== 'function' || map.isStyleLoaded()));
}

function readSafeMapCenter(map, fallbackCenter) {
  try {
    const current = map.getCenter();
    if (Number.isFinite(current?.lng) && Number.isFinite(current?.lat)) {
      return [current.lng, current.lat];
    }
  } catch {
    /* map transform may be unavailable during walk/teardown */
  }

  if (fallbackCenter?.[0] != null && fallbackCenter?.[1] != null) {
    return [fallbackCenter[1], fallbackCenter[0]];
  }

  return null;
}

function applyMapDisplayMode(
  map,
  { show3D, center, zoom, viewPitch, viewBearing, recenter = false }
) {
  if (!isMapDisplayReady(map)) return;

  try {
    map.stop();

    const view = getMapView(show3D, buildViewOverrides(show3D, viewPitch, viewBearing));

    if (!show3D) {
      const flatOptions = {
        pitch: MAP_2D_PITCH,
        bearing: MAP_2D_BEARING,
      };

      if (center?.[0] != null && center?.[1] != null) {
        flatOptions.center = [center[1], center[0]];
      }
      if (Number.isFinite(Number(zoom))) {
        flatOptions.zoom = Number(zoom);
      }

      map.jumpTo(flatOptions);
      map.dragRotate.disable();
      map.touchPitch.disable();
      return;
    }

    const tiltedOptions = {
      pitch: view.pitch ?? MAP_3D_PITCH,
      bearing: view.bearing ?? MAP_2D_BEARING,
      zoom: map.getZoom(),
    };

    const safeCenter = recenter
      ? readSafeMapCenter(map, center)
      : readSafeMapCenter(map, null);
    if (safeCenter) {
      tiltedOptions.center = safeCenter;
    }

    if (recenter && Number.isFinite(Number(zoom))) {
      tiltedOptions.zoom = Number(zoom);
    }

    map.setMaxPitch(MAP_MAX_PITCH);
    map.jumpTo(tiltedOptions);
    map.dragRotate.enable();
    map.touchPitch.enable();
  } catch {
    /* ignore camera sync while map is transitioning or walk mode is active */
  }
}

function toCollection(geoData) {
  if (!geoData) return emptyCollection();
  if (geoData.type === 'FeatureCollection') return geoData;
  if (geoData.type === 'Feature') {
    return { type: 'FeatureCollection', features: [geoData] };
  }
  return emptyCollection();
}

function buildFillColorExpression(paint, fallback) {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    paint.hover.fillColor,
    fallback,
  ];
}

function buildFillOpacityExpression(paint, baseOpacity) {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    paint.hover.fillOpacity,
    baseOpacity,
  ];
}

function buildLineColorExpression(paint) {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    paint.hover.lineColor,
    paint.light.lineColor,
  ];
}

function buildLineWidthExpression(paint) {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    paint.hover.lineWidth,
    paint.light.lineWidth,
  ];
}

function ensureBoundaryLayers(map, collection, visible, paint) {
  const data = visible ? collection : emptyCollection();
  const hitOpacity = paint.light.fillOpacity > 0 ? paint.light.fillOpacity : 0.01;

  if (!map.getSource(BOUNDARY_SOURCE_ID)) {
    map.addSource(BOUNDARY_SOURCE_ID, {
      type: 'geojson',
      data,
      promoteId: 'featureId',
    });

    map.addLayer({
      id: BOUNDARY_FILL_LAYER_ID,
      type: 'fill',
      source: BOUNDARY_SOURCE_ID,
      paint: {
        'fill-color': buildFillColorExpression(paint, paint.light.fillColor),
        'fill-opacity': buildFillOpacityExpression(paint, paint.light.fillOpacity),
      },
    });

    map.addLayer({
      id: BOUNDARY_HIT_LAYER_ID,
      type: 'fill',
      source: BOUNDARY_SOURCE_ID,
      paint: {
        'fill-color': '#000',
        'fill-opacity': hitOpacity,
      },
    });

    map.addLayer({
      id: BOUNDARY_LINE_LAYER_ID,
      type: 'line',
      source: BOUNDARY_SOURCE_ID,
      paint: {
        'line-color': buildLineColorExpression(paint),
        'line-width': buildLineWidthExpression(paint),
      },
    });
  } else {
    map.getSource(BOUNDARY_SOURCE_ID).setData(data);
    map.setPaintProperty(
      BOUNDARY_FILL_LAYER_ID,
      'fill-color',
      buildFillColorExpression(paint, paint.light.fillColor)
    );
    map.setPaintProperty(
      BOUNDARY_FILL_LAYER_ID,
      'fill-opacity',
      buildFillOpacityExpression(paint, paint.light.fillOpacity)
    );
    map.setPaintProperty(BOUNDARY_HIT_LAYER_ID, 'fill-opacity', hitOpacity);
    map.setPaintProperty(BOUNDARY_LINE_LAYER_ID, 'line-color', buildLineColorExpression(paint));
    map.setPaintProperty(BOUNDARY_LINE_LAYER_ID, 'line-width', buildLineWidthExpression(paint));
  }

  const visibility = visible ? 'visible' : 'none';
  [BOUNDARY_FILL_LAYER_ID, BOUNDARY_HIT_LAYER_ID, BOUNDARY_LINE_LAYER_ID].forEach((id) => {
    map.setLayoutProperty(id, 'visibility', visibility);
  });
}

function ensureHighlightLayer(map, feature, visible, paint) {
  const data = visible && feature ? feature : emptyCollection();

  if (!map.getSource(HIGHLIGHT_SOURCE_ID)) {
    map.addSource(HIGHLIGHT_SOURCE_ID, { type: 'geojson', data });
    map.addLayer({
      id: HIGHLIGHT_FILL_LAYER_ID,
      type: 'fill',
      source: HIGHLIGHT_SOURCE_ID,
      paint: {
        'fill-color': paint.selected.fillColor,
        'fill-opacity': paint.selected.fillOpacity,
      },
    });
    map.addLayer({
      id: HIGHLIGHT_LINE_LAYER_ID,
      type: 'line',
      source: HIGHLIGHT_SOURCE_ID,
      paint: {
        'line-color': paint.selected.lineColor,
        'line-width': paint.selected.lineWidth,
      },
    });
  } else {
    map.getSource(HIGHLIGHT_SOURCE_ID).setData(data);
    map.setPaintProperty(HIGHLIGHT_FILL_LAYER_ID, 'fill-color', paint.selected.fillColor);
    map.setPaintProperty(HIGHLIGHT_FILL_LAYER_ID, 'fill-opacity', paint.selected.fillOpacity);
    map.setPaintProperty(HIGHLIGHT_LINE_LAYER_ID, 'line-color', paint.selected.lineColor);
    map.setPaintProperty(HIGHLIGHT_LINE_LAYER_ID, 'line-width', paint.selected.lineWidth);
  }

  const visibility = visible && feature ? 'visible' : 'none';
  map.setLayoutProperty(HIGHLIGHT_FILL_LAYER_ID, 'visibility', visibility);
  map.setLayoutProperty(HIGHLIGHT_LINE_LAYER_ID, 'visibility', visibility);
}

function hasPlacedAddressPin(pinPosition) {
  return pinPosition?.lat != null && pinPosition?.lng != null;
}

function clearMarkers(markersRef) {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];
}

function createExpertClusterElement(count) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'expert-map-cluster';
  el.textContent = String(count);
  el.setAttribute('dir', 'ltr');
  el.setAttribute('aria-label', `${count} متخصص`);
  return el;
}

function createRequestClusterElement(count) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'request-map-cluster';
  el.textContent = String(count);
  el.setAttribute('dir', 'ltr');
  el.setAttribute('aria-label', `${count} کار`);
  return el;
}

let activeExpertPopup = null;
let activeRequestPopup = null;

function closeActiveExpertPopup() {
  activeExpertPopup?.remove();
  activeExpertPopup = null;
}

function closeActiveRequestPopup() {
  activeRequestPopup?.remove();
  activeRequestPopup = null;
}

function closeActiveMapPopups() {
  closeActiveExpertPopup();
  closeActiveRequestPopup();
}

function openExpertMarkerPopup(map, lng, lat, item) {
  closeActiveMapPopups();
  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
    offset: 18,
    maxWidth: '220px',
    className: 'expert-map-popup-wrap',
  })
    .setLngLat([lng, lat])
    .setHTML(buildExpertMarkerPopupHtml(item))
    .addTo(map);
  activeExpertPopup = popup;
  popup.on('close', () => {
    if (activeExpertPopup === popup) activeExpertPopup = null;
  });
}

function openRequestMarkerPopup(map, lng, lat, item) {
  closeActiveMapPopups();
  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
    offset: 18,
    maxWidth: '240px',
    className: 'request-map-popup-wrap',
  })
    .setLngLat([lng, lat])
    .setHTML(buildRequestMarkerPopupHtml(item))
    .addTo(map);
  activeRequestPopup = popup;
  popup.on('close', () => {
    if (activeRequestPopup === popup) activeRequestPopup = null;
  });
}

function createBoundaryClusterElement(count, hint) {
  const wrap = document.createElement('div');
  wrap.className = 'boundary-area-cluster-marker';
  wrap.innerHTML = createBoundaryClusterHtml(count, hint);
  return wrap;
}

function createBoundaryLabelMarker(map, element, lng, lat) {
  return new maplibregl.Marker({
    element,
    anchor: 'center',
    pitchAlignment: 'viewport',
    rotationAlignment: 'viewport',
  })
    .setLngLat([lng, lat])
    .addTo(map);
}

export default function MapLibreMap({
  center = [31.3183, 48.6842],
  zoom = 12,
  show3D = false,
  boundaryData = null,
  showBoundaries = true,
  boundaryVariant = 'outline',
  boundaryLabels = [],
  boundaryClusterHint = 'بخش',
  boundaryClusterMaxZoom = 15,
  highlightFeature = null,
  expertMarkers = [],
  requestMarkers = [],
  expertMarkerStyle = EXPERT_MARKER_STYLES.pin,
  merchantGlbMarkers = false,
  pinPosition = null,
  pinMarkerGlb = null,
  pinPreviewActive = false,
  focusOnPin = false,
  pinFocusZoom = 16,
  panKey = 0,
  fitBoundsKey = 0,
  fitBoundsFeature = null,
  fitBoundsMode = 'city',
  fitBoundsOnce = false,
  skipInitialFitBounds = false,
  viewPitch = null,
  viewBearing = null,
  mapRecenterKey = 0,
  map3DApplyKey = 0,
  buildingConfig = null,
  gesturesEnabled = true,
  mapClickEnabled = true,
  syncCameraFromProps = true,
  freezeDisplayModeSync = false,
  onMapClick,
  onMapViewChange,
  onMapReady,
  mapResizeTrigger = null,
  showNavigationControl = true,
  maxBounds = null,
  mapStyleId = DEFAULT_MAP_STYLE_ID,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapIdleTick, setMapIdleTick] = useState(0);
  const bumpMarkerRenderRef = useRef(() => {});
  const appliedMapStyleIdRef = useRef(null);
  const expertMarkersRef = useRef([]);
  const requestMarkersRef = useRef([]);
  const expertMarkerStyleRef = useRef(expertMarkerStyle);
  const merchantGlbMarkersRef = useRef(merchantGlbMarkers);
  const boundaryMarkersRef = useRef([]);
  const pinMarkerRef = useRef(null);
  const pinPreviewMarkerRef = useRef(null);
  const pinPositionRef = useRef(pinPosition);
  const pinMarkerGlbRef = useRef(pinMarkerGlb);
  const pinPreviewActiveRef = useRef(pinPreviewActive);
  const hoveredFeatureIdRef = useRef(null);
  const hasFittedRef = useRef(false);
  const onMapClickRef = useRef(onMapClick);
  const mapClickEnabledRef = useRef(mapClickEnabled);
  const onMapViewChangeRef = useRef(onMapViewChange);
  const onMapReadyRef = useRef(onMapReady);
  const buildingConfigRef = useRef(buildingConfig);
  const show3DRef = useRef(show3D);
  const boundaryDataRef = useRef(boundaryData);
  const showBoundariesRef = useRef(showBoundaries);
  const highlightFeatureRef = useRef(highlightFeature);
  const boundaryPaint = resolveBoundaryPaint(boundaryVariant);
  const boundaryPaintRef = useRef(boundaryPaint);

  pinPositionRef.current = pinPosition;
  pinMarkerGlbRef.current = pinMarkerGlb;
  pinPreviewActiveRef.current = pinPreviewActive;

  useEffect(() => {
    boundaryDataRef.current = boundaryData;
  }, [boundaryData]);

  useEffect(() => {
    showBoundariesRef.current = showBoundaries;
  }, [showBoundaries]);

  useEffect(() => {
    highlightFeatureRef.current = highlightFeature;
  }, [highlightFeature]);

  useEffect(() => {
    boundaryPaintRef.current = boundaryPaint;
  }, [boundaryPaint]);

  useEffect(() => {
    bumpMarkerRenderRef.current = () => {
      setMapIdleTick((tick) => tick + 1);
    };
  }, []);

  useEffect(() => {
    buildingConfigRef.current = buildingConfig;
  }, [buildingConfig]);

  useEffect(() => {
    show3DRef.current = show3D;
  }, [show3D]);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    expertMarkerStyleRef.current = expertMarkerStyle;
  }, [expertMarkerStyle]);

  useEffect(() => {
    merchantGlbMarkersRef.current = merchantGlbMarkers;
  }, [merchantGlbMarkers]);

  useEffect(() => {
    mapClickEnabledRef.current = mapClickEnabled;
  }, [mapClickEnabled]);

  useEffect(() => {
    onMapViewChangeRef.current = onMapViewChange;
    const map = mapRef.current;
    if (map && onMapViewChange) {
      onMapViewChange(readMapViewState(map));
    }
  }, [onMapViewChange]);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
    if (mapRef.current) {
      onMapReady?.(mapRef.current);
    }
  }, [onMapReady]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    let cancelled = false;
    let map = null;
    let reportMapView = null;
    let scheduleMapStyleTweaksHandler = null;
    let onOpenMapTilesLoadedHandler = null;

    const initMap = async () => {
      await ensureMapLibreRtlPlugin();
      if (cancelled || !containerRef.current || mapRef.current) return;

      const initialView = getMapView(show3D, buildViewOverrides(show3D, viewPitch, viewBearing));
      map = new maplibregl.Map({
        container: containerRef.current,
        style: resolveMapStyleUrl(mapStyleId),
        center: [center[1], center[0]],
        zoom,
        pitch: initialView.pitch,
        bearing: initialView.bearing,
        antialias: true,
        attributionControl: false,
        localIdeographFontFamily: "'IRANSans', Tahoma, sans-serif",
        scrollZoom: gesturesEnabled,
        dragPan: gesturesEnabled,
        dragRotate: show3D && gesturesEnabled,
        touchPitch: show3D && gesturesEnabled,
        touchZoomRotate: gesturesEnabled,
        keyboard: gesturesEnabled,
        doubleClickZoom: gesturesEnabled,
        maxPitch: MAP_MAX_PITCH,
      });

      map.setMaxPitch(MAP_MAX_PITCH);

      if (maxBounds) {
        map.setMaxBounds(maxBounds);
      }

      if (showNavigationControl) {
        map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
      }

      const setHoveredFeature = (featureId) => {
        const mapInstance = mapRef.current;
        if (!mapInstance?.getSource(BOUNDARY_SOURCE_ID)) return;

        try {
          if (hoveredFeatureIdRef.current) {
            mapInstance.setFeatureState(
              { source: BOUNDARY_SOURCE_ID, id: hoveredFeatureIdRef.current },
              { hover: false }
            );
          }

          hoveredFeatureIdRef.current = featureId || null;

          if (featureId) {
            mapInstance.setFeatureState(
              { source: BOUNDARY_SOURCE_ID, id: featureId },
              { hover: true }
            );
          }
        } catch {
          /* feature may lack promoteId */
        }
      };

      reportMapView = () => {
        onMapViewChangeRef.current?.(readMapViewState(map));
      };

      map.on('moveend', reportMapView);
      map.on('zoomend', reportMapView);
      map.on('pitchend', reportMapView);
      map.on('rotateend', reportMapView);

      map.on('click', (event) => {
        closeActiveExpertPopup();
        if (!mapClickEnabledRef.current) return;
        onMapClickRef.current?.(event.lngLat.lat, event.lngLat.lng, map.getZoom());
      });

      map.on('mousemove', (event) => {
        if (
          pinPreviewActiveRef.current &&
          !hasPlacedAddressPin(pinPositionRef.current)
        ) {
          return;
        }
        if (!showBoundaries || !map.getLayer(BOUNDARY_HIT_LAYER_ID)) return;
        const features = map.queryRenderedFeatures(event.point, {
          layers: [BOUNDARY_HIT_LAYER_ID],
        });
        const featureId = features[0]?.properties?.featureId;
        if (featureId === hoveredFeatureIdRef.current) return;
        setHoveredFeature(featureId || null);
        map.getCanvas().style.cursor = featureId ? 'pointer' : '';
      });

      map.on('mouseleave', () => {
        setHoveredFeature(null);
        map.getCanvas().style.cursor = '';
      });

      let styleTweaksScheduled = false;

      const reapplyMapStyleTweaks = () => {
        if (!map.isStyleLoaded()) return;
        enhancePersianSymbolLayers(map, { faceViewer: show3DRef.current });
        applyBuildingExtrusion(map, buildingConfigRef.current, show3DRef.current);
      };

      const scheduleMapStyleTweaks = () => {
        if (styleTweaksScheduled) return;
        styleTweaksScheduled = true;
        map.once('idle', () => {
          styleTweaksScheduled = false;
          reapplyMapStyleTweaks();
        });
      };

      scheduleMapStyleTweaksHandler = scheduleMapStyleTweaks;

      map.on('styledata', scheduleMapStyleTweaksHandler);

      onOpenMapTilesLoadedHandler = (event) => {
        if (event.sourceId === 'openmaptiles' && event.isSourceLoaded) {
          scheduleMapStyleTweaks();
        }
      };

      map.on('sourcedata', onOpenMapTilesLoadedHandler);

      map.on('load', () => {
        map.resize();
        bumpMarkerRenderRef.current();
        reportMapView();
        reapplyMapStyleTweaks();
        const collection = toCollection(boundaryData);
        ensureBoundaryLayers(map, collection, showBoundaries, boundaryPaint);
        ensureHighlightLayer(map, highlightFeature, showBoundaries, boundaryPaint);

        if (fitBoundsFeature && (!fitBoundsOnce || !hasFittedRef.current) && !skipInitialFitBounds) {
          fitMapToGeoData(
            map,
            fitBoundsFeature,
            fitBoundsMode,
            getMapView(show3D, buildViewOverrides(show3D, viewPitch, viewBearing))
          );
          if (fitBoundsOnce) hasFittedRef.current = true;
        }
      });

      mapRef.current = map;
      appliedMapStyleIdRef.current = mapStyleId;
      onMapReadyRef.current?.(map);
    };

    initMap();

    return () => {
      cancelled = true;
      clearMarkers(expertMarkersRef);
      clearMarkers(requestMarkersRef);
      clearMarkers(boundaryMarkersRef);
      pinMarkerRef.current?.remove();
      pinMarkerRef.current = null;
      if (map && reportMapView) {
        map.off('moveend', reportMapView);
        map.off('zoomend', reportMapView);
        map.off('pitchend', reportMapView);
        map.off('rotateend', reportMapView);
        if (scheduleMapStyleTweaksHandler) {
          map.off('styledata', scheduleMapStyleTweaksHandler);
        }
        if (onOpenMapTilesLoadedHandler) {
          map.off('sourcedata', onOpenMapTilesLoadedHandler);
        }
      }
      map?.remove();
      mapRef.current = null;
      onMapReadyRef.current?.(null);
      hoveredFeatureIdRef.current = null;
      setMapIdleTick(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || freezeDisplayModeSync) return;

    applyMapDisplayMode(map, {
      show3D,
      center: syncCameraFromProps ? center : undefined,
      zoom: syncCameraFromProps ? zoom : undefined,
      viewPitch,
      viewBearing,
      recenter: syncCameraFromProps && !show3D,
    });
    map.once('idle', () => bumpMarkerRenderRef.current());
  }, [show3D, center, zoom, viewPitch, viewBearing, syncCameraFromProps, freezeDisplayModeSync]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || mapRecenterKey < 1 || freezeDisplayModeSync) return;

    applyMapDisplayMode(map, {
      show3D: false,
      center: syncCameraFromProps ? center : undefined,
      zoom: syncCameraFromProps ? zoom : undefined,
      viewPitch,
      viewBearing,
      recenter: syncCameraFromProps,
    });
  }, [mapRecenterKey, center, zoom, viewPitch, viewBearing, syncCameraFromProps, freezeDisplayModeSync]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || map3DApplyKey < 1 || freezeDisplayModeSync) return;

    applyMapDisplayMode(map, {
      show3D: true,
      center: syncCameraFromProps ? center : undefined,
      zoom: syncCameraFromProps ? zoom : undefined,
      viewPitch,
      viewBearing,
      recenter: false,
    });
    map.once('idle', () => bumpMarkerRenderRef.current());
  }, [map3DApplyKey, center, zoom, viewPitch, viewBearing, syncCameraFromProps, freezeDisplayModeSync]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const collection = toCollection(boundaryData);
      ensureBoundaryLayers(map, collection, showBoundaries, boundaryPaint);
      ensureHighlightLayer(map, highlightFeature, showBoundaries, boundaryPaint);
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [boundaryData, showBoundaries, highlightFeature, boundaryVariant]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      enhancePersianSymbolLayers(map, { faceViewer: show3D });
      applyBuildingExtrusion(map, buildingConfig, show3D);
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [buildingConfig, show3D]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (maxBounds) {
      map.setMaxBounds(maxBounds);
      return;
    }

    map.setMaxBounds(new maplibregl.LngLatBounds([-180, -85], [180, 85]));
  }, [maxBounds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedMapStyleIdRef.current === mapStyleId) return;

    appliedMapStyleIdRef.current = mapStyleId;
    const hoveredFeatureId = hoveredFeatureIdRef.current;

    const reapplyCustomLayers = () => {
      if (!map.isStyleLoaded()) return;

      const collection = toCollection(boundaryDataRef.current);
      ensureBoundaryLayers(
        map,
        collection,
        showBoundariesRef.current,
        boundaryPaintRef.current
      );
      ensureHighlightLayer(
        map,
        highlightFeatureRef.current,
        showBoundariesRef.current,
        boundaryPaintRef.current
      );
      enhancePersianSymbolLayers(map, { faceViewer: show3DRef.current });
      applyBuildingExtrusion(map, buildingConfigRef.current, show3DRef.current);

      if (hoveredFeatureId && map.getSource(BOUNDARY_SOURCE_ID)) {
        try {
          map.setFeatureState(
            { source: BOUNDARY_SOURCE_ID, id: hoveredFeatureId },
            { hover: true }
          );
        } catch {
          /* feature may lack promoteId */
        }
      }
    };

    map.setStyle(resolveMapStyleUrl(mapStyleId));
    map.once('idle', () => {
      reapplyCustomLayers();
      bumpMarkerRenderRef.current();
    });
  }, [mapStyleId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitBoundsKey < 1 || !fitBoundsFeature) return;

    const run = () => {
      if (skipInitialFitBounds) return;
      if (fitBoundsOnce && hasFittedRef.current) return;
      fitMapToGeoData(map, fitBoundsFeature, fitBoundsMode, getMapView(show3D));
      if (fitBoundsOnce) hasFittedRef.current = true;
    };

    if (map.isStyleLoaded()) run();
    else map.once('load', run);
  }, [fitBoundsKey, fitBoundsFeature, fitBoundsMode, fitBoundsOnce, skipInitialFitBounds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || panKey < 1 || !highlightFeature?.geometry) return;

    const centroid = getGeometryCentroid(highlightFeature.geometry);
    if (!centroid) return;

    const view = getMapView(show3D, buildViewOverrides(show3D, viewPitch, viewBearing));
    map.easeTo({
      center: [centroid[0], centroid[1]],
      zoom: map.getZoom(),
      pitch: view.pitch,
      bearing: view.bearing,
      duration: 350,
    });
  }, [panKey, highlightFeature, show3D, viewPitch, viewBearing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusOnPin || pinPosition?.lat == null || pinPosition?.lng == null) return;

    const view = getMapView(show3D, buildViewOverrides(show3D, viewPitch, viewBearing));
    map.jumpTo({
      center: [pinPosition.lng, pinPosition.lat],
      zoom: pinFocusZoom,
      pitch: view.pitch,
      bearing: view.bearing,
    });
  }, [focusOnPin, pinPosition, pinFocusZoom, show3D, viewPitch, viewBearing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || focusOnPin || !syncCameraFromProps) return;

    if (center?.[0] != null && center?.[1] != null) {
      map.setCenter([center[1], center[0]]);
    }
    if (Number.isFinite(zoom)) {
      map.setZoom(zoom);
    }
  }, [focusOnPin, center, zoom, syncCameraFromProps]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const renderBoundaryMarkers = () => {
      clearMarkers(boundaryMarkersRef);
      if (!boundaryLabels.length) return;

      const singles = boundaryLabels.filter((item) => !item.selected);
      const selected = boundaryLabels.filter((item) => item.selected);

      const addBoundaryLabelMarker = (lng, lat, name, isSelected = false) => {
        const wrap = document.createElement('div');
        wrap.className = 'boundary-area-label-marker';
        wrap.style.pointerEvents = 'none';
        wrap.appendChild(createBoundaryLabelSpan(name, isSelected));

        const marker = createBoundaryLabelMarker(map, wrap, lng, lat);
        boundaryMarkersRef.current.push(marker);
      };

      const useDirectLabels =
        singles.length > 0 && singles.length <= BOUNDARY_LABEL_DIRECT_RENDER_LIMIT;

      if (useDirectLabels) {
        singles.forEach(({ lng, lat, name }) => addBoundaryLabelMarker(lng, lat, name, false));
      } else if (singles.length > 0) {
        const mapZoom = map.getZoom();
        const index = createPointIndex(singles, {
          radius: resolveBoundaryClusterRadius(mapZoom),
          maxZoom: boundaryClusterMaxZoom,
        });

        const clusters = getClustersForViewport(index, map);

        clusters.forEach((feature) => {
          const [lng, lat] = feature.geometry.coordinates;
          const props = feature.properties;
          let element;

          if (props.cluster) {
            element = createBoundaryClusterElement(props.point_count, boundaryClusterHint);
            element.addEventListener('click', (event) => {
              event.preventDefault();
              event.stopPropagation();
              const expansionZoom = getClusterExpansionTargetZoom(index, props.cluster_id, map);
              map.easeTo({ center: [lng, lat], zoom: expansionZoom, duration: 350 });
            });
          } else {
            const wrap = document.createElement('div');
            wrap.className = 'boundary-area-label-marker';
            wrap.style.pointerEvents = 'none';
            wrap.appendChild(createBoundaryLabelSpan(props.name, false));
            element = wrap;
          }

          const marker = createBoundaryLabelMarker(map, element, lng, lat);
          boundaryMarkersRef.current.push(marker);
        });
      }

      selected.forEach(({ lng, lat, name }) => addBoundaryLabelMarker(lng, lat, name, true));
    };

    const renderRequestMarkers = () => {
      closeActiveRequestPopup();
      clearMarkers(requestMarkersRef);
      if (!requestMarkers.length) return;

      const is3DMap = Boolean(show3DRef.current);
      const beaconHeightPx = resolveRequestBeaconHeightPx(map, { show3D: is3DMap });

      const index = createPointIndex(
        requestMarkers.map((item) => ({
          ...item,
          id: `${item.requestId}-${item.lat}-${item.lng}`,
        })),
        { radius: 52, maxZoom: 16 }
      );

      const clusters = getClustersForViewport(index, map);

      clusters.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;
        let element;
        let anchor = 'bottom';

        if (props.cluster) {
          element = createRequestClusterElement(props.point_count);
          anchor = 'center';
          element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const expansionZoom = getClusterExpansionTargetZoom(index, props.cluster_id, map);
            map.easeTo({ center: [lng, lat], zoom: expansionZoom, duration: 350 });
          });
        } else {
          const { wrap, button } = buildRequestMarkerElement(props, { beaconHeightPx });
          element = wrap;
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openRequestMarkerPopup(map, lng, lat, props);
          });
        }

        const marker = new maplibregl.Marker({
          element,
          anchor,
          pitchAlignment: 'viewport',
          rotationAlignment: 'viewport',
        })
          .setLngLat([lng, lat])
          .addTo(map);

        requestMarkersRef.current.push(marker);
      });
    };

    const renderExpertMarkers = () => {
      closeActiveExpertPopup();
      clearMarkers(expertMarkersRef);
      if (!expertMarkers.length) return;

      const markerStyle = expertMarkerStyleRef.current || EXPERT_MARKER_STYLES.pin;
      const is3DMap = Boolean(show3DRef.current);
      const poleHeightPx = is3DMap
        ? resolveExpertPoleHeightPx(map, buildingConfigRef.current)
        : 0;

      const index = createPointIndex(
        expertMarkers.map((item) => ({
          ...item,
          id: `${item.expertId}-${item.lat}-${item.lng}`,
        })),
        { radius: 55, maxZoom: 16 }
      );

      const clusters = getClustersForViewport(index, map);

      clusters.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;
        let element;
        let anchor = 'bottom';
        let useGlbMarker = false;

        if (props.cluster) {
          element = createExpertClusterElement(props.point_count);
          anchor = 'center';
          element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const expansionZoom = getClusterExpansionTargetZoom(index, props.cluster_id, map);
            map.easeTo({ center: [lng, lat], zoom: expansionZoom, duration: 350 });
          });
        } else {
          useGlbMarker = Boolean(merchantGlbMarkersRef.current);
          const { wrap, button } = useGlbMarker
            ? buildMerchantGlbMarkerElement(props, {
                show3D: is3DMap,
                poleHeightPx,
              })
            : buildExpertMarkerElement(props, markerStyle, {
                show3D: is3DMap,
                poleHeightPx,
              });
          element = wrap;
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openExpertMarkerPopup(map, lng, lat, props);
          });
        }

        const marker = new maplibregl.Marker({
          element,
          anchor,
          pitchAlignment: 'viewport',
          rotationAlignment: 'viewport',
        })
          .setLngLat([lng, lat])
          .addTo(map);

        expertMarkersRef.current.push(marker);
      });
    };

    const updateMarkers = () => {
      renderBoundaryMarkers();
      renderExpertMarkers();
      renderRequestMarkers();
    };

    const scheduleUpdate = () => {
      if (map.isStyleLoaded()) {
        updateMarkers();
        return;
      }
      map.once('idle', updateMarkers);
    };

    let markerUpdateRaf = null;
    const scheduleUpdateOnZoom = () => {
      if (markerUpdateRaf != null) return;
      markerUpdateRaf = window.requestAnimationFrame(() => {
        markerUpdateRaf = null;
        scheduleUpdate();
      });
    };

    scheduleUpdate();
    map.on('zoom', scheduleUpdateOnZoom);
    map.on('moveend', scheduleUpdate);
    map.on('zoomend', scheduleUpdate);
    map.on('pitchend', scheduleUpdate);
    map.on('rotateend', scheduleUpdate);

    return () => {
      if (markerUpdateRaf != null) {
        window.cancelAnimationFrame(markerUpdateRaf);
      }
      map.off('zoom', scheduleUpdateOnZoom);
      map.off('moveend', scheduleUpdate);
      map.off('zoomend', scheduleUpdate);
      map.off('pitchend', scheduleUpdate);
      map.off('rotateend', scheduleUpdate);
      clearMarkers(boundaryMarkersRef);
      clearMarkers(expertMarkersRef);
      clearMarkers(requestMarkersRef);
    };
  }, [
    boundaryLabels,
    boundaryClusterHint,
    boundaryClusterMaxZoom,
    expertMarkers,
    requestMarkers,
    expertMarkerStyle,
    merchantGlbMarkers,
    showBoundaries,
    show3D,
    mapIdleTick,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const readPinCoords = () => {
      const pos = pinPositionRef.current;
      if (!hasPlacedAddressPin(pos)) return null;
      return [pos.lng, pos.lat];
    };

    const buildPinElement = () => {
      const currentMap = mapRef.current;
      const is3DView = isMap3DPinView(currentMap, show3DRef.current);
      return buildAddressPinRoot({
        glbSrc: pinMarkerGlbRef.current,
        is3DView,
        preview: false,
      });
    };

    const refreshPinVisibility = (marker, currentMap) => {
      if (!marker || !currentMap) return;
      forceAddressPinVisible(marker);
      marker.setLngLat(marker.getLngLat());
      try {
        currentMap.triggerRepaint?.();
      } catch {
        /* optional API */
      }
    };

    const recreatePin = () => {
      const currentMap = mapRef.current;
      const coords = readPinCoords();
      if (!currentMap || !coords) {
        pinMarkerRef.current?.remove();
        pinMarkerRef.current = null;
        return;
      }

      pinMarkerRef.current?.remove();
      pinMarkerRef.current = null;

      pinMarkerRef.current = new maplibregl.Marker({
        element: buildPinElement(),
        ...ADDRESS_PIN_MARKER_OPTIONS,
      })
        .setLngLat(coords)
        .addTo(currentMap);

      const marker = pinMarkerRef.current;
      refreshPinVisibility(marker, currentMap);
      window.requestAnimationFrame(() => refreshPinVisibility(marker, currentMap));
      currentMap.once('render', () => refreshPinVisibility(marker, currentMap));
      currentMap.once('idle', () => refreshPinVisibility(marker, currentMap));
    };

    const updatePin = () => {
      if (!pinMarkerRef.current) {
        recreatePin();
        return;
      }
      const coords = readPinCoords();
      if (!coords) return;
      pinMarkerRef.current.setLngLat(coords);
      forceAddressPinVisible(pinMarkerRef.current);
    };

    if (!hasPlacedAddressPin(pinPosition)) {
      pinMarkerRef.current?.remove();
      pinMarkerRef.current = null;
      return undefined;
    }

    const scheduleRecreatePin = () => {
      if (map.isStyleLoaded()) {
        recreatePin();
        return;
      }
      map.once('load', recreatePin);
    };

    scheduleRecreatePin();
    map.on('move', updatePin);
    map.on('pitchend', recreatePin);
    map.on('zoomend', updatePin);

    return () => {
      map.off('move', updatePin);
      map.off('pitchend', recreatePin);
      map.off('zoomend', updatePin);
      map.off('load', recreatePin);
      pinMarkerRef.current?.remove();
      pinMarkerRef.current = null;
    };
  }, [pinPosition, pinMarkerGlb, mapIdleTick, show3D, map3DApplyKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pinPreviewActive || hasPlacedAddressPin(pinPosition)) {
      pinPreviewMarkerRef.current?.remove();
      pinPreviewMarkerRef.current = null;
      return undefined;
    }

    const ensurePreviewMarker = () => {
      if (pinPreviewMarkerRef.current) return pinPreviewMarkerRef.current;
      const is3DView = isMap3DPinView(map, show3DRef.current);
      const element = buildAddressPinRoot({
        glbSrc: pinMarkerGlbRef.current,
        is3DView,
        preview: true,
      });
      pinPreviewMarkerRef.current = new maplibregl.Marker({
        element,
        ...ADDRESS_PIN_MARKER_OPTIONS,
      }).addTo(map);
      const el = pinPreviewMarkerRef.current.getElement();
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
      forceAddressPinVisible(pinPreviewMarkerRef.current);
      return pinPreviewMarkerRef.current;
    };

    const onMouseMove = (event) => {
      if (!pinPreviewActiveRef.current || hasPlacedAddressPin(pinPositionRef.current)) return;
      const marker = ensurePreviewMarker();
      marker.getElement().style.visibility = 'visible';
      marker.setLngLat(event.lngLat);
      forceAddressPinVisible(marker);
      map.getCanvas().style.cursor = 'none';
    };

    const onMouseLeave = () => {
      const marker = pinPreviewMarkerRef.current;
      if (marker) marker.getElement().style.visibility = 'hidden';
      map.getCanvas().style.cursor = '';
    };

    map.on('mousemove', onMouseMove);
    map.on('mouseleave', onMouseLeave);

    return () => {
      map.off('mousemove', onMouseMove);
      map.off('mouseleave', onMouseLeave);
      pinPreviewMarkerRef.current?.remove();
      pinPreviewMarkerRef.current = null;
      try {
        map.getCanvas().style.cursor = '';
      } catch {
        /* map may be tearing down */
      }
    };
  }, [pinPreviewActive, pinPosition, pinMarkerGlb, mapIdleTick, show3D, map3DApplyKey]);

  useEffect(() => {
    if (mapResizeTrigger == null) return undefined;

    let cancelled = false;
    let clearTimers = null;

    const resize = () => {
      if (cancelled) return;
      const map = mapRef.current;
      if (!map) return;
      try {
        map.resize();
      } catch {
        /* map may be tearing down */
      }
    };

    const scheduleResize = () => {
      clearTimers?.();
      window.requestAnimationFrame(resize);
      const t1 = window.setTimeout(resize, 80);
      const t2 = window.setTimeout(resize, 320);
      clearTimers = () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    };

    const attachLoadResize = (map) => {
      if (map.isStyleLoaded()) {
        scheduleResize();
        return undefined;
      }
      const onLoad = () => scheduleResize();
      map.once('load', onLoad);
      return () => map.off('load', onLoad);
    };

    let detachLoad = null;
    const poll = window.setInterval(() => {
      const map = mapRef.current;
      if (!map || cancelled) return;
      window.clearInterval(poll);
      detachLoad = attachLoadResize(map);
    }, 40);
    const pollTimeout = window.setTimeout(() => window.clearInterval(poll), 4000);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearTimeout(pollTimeout);
      clearTimers?.();
      detachLoad?.();
    };
  }, [mapResizeTrigger]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full [&_.maplibregl-ctrl-attrib]:hidden"
      aria-label={show3D ? 'نقشه سه‌بعدی' : 'نقشه'}
    />
  );
}
