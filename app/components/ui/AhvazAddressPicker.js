'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { loadCityBoundaryData, cityHasBoundaryMap } from '../../utils/loadCityBoundary';
import {
  buildMapAddressPayload,
  getGeometryArea,
  getGeometryCentroid,
  resolveCityBoundaryFeature,
} from '../../utils/geojsonBoundary';
import {
  BOUNDARY_CLUSTER_MAX_ZOOM,
  BOUNDARY_CLUSTER_SECTION_MAX_ZOOM,
} from '../../utils/boundaryMapLabel';
import { getMaxBoundsFromGeoData } from '../../utils/mapLibreBounds';
import { resolveDefaultMapStyleId } from '../../utils/mapStylePresets';
import { resolveCityMapConfig, resolveCityMapView } from '../../utils/cityMapConfig';
import { resolveCityExpertMarkerStyle } from '../../utils/mapExpertMarkerConfig';
import { useTheme } from '../../context/ThemeContext';
import HomeMapMobileBottomBar from '../home/HomeMapMobileBottomBar';
import HomeMapMobileControlsSheet from '../home/HomeMapMobileControlsSheet';
import HomeMapMobileFullscreenSheet from '../home/HomeMapMobileFullscreenSheet';
import HomeMapMobilePreviewOverlay from '../home/HomeMapMobilePreviewOverlay';
import HomeMapDesktopFilterBar from '../home/HomeMapDesktopFilterBar';
import HomeMapExpandHintBar from '../home/HomeMapExpandHintBar';
import { MAP_INTRO } from '../../copy/friendlyFa';
import HomeMapMobileTopBar from '../home/HomeMapMobileTopBar';
import MapExplorerSummaryTypewriter from '../home/MapExplorerSummaryTypewriter';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';
import {
  MAP_FILTER_FIELD,
  MAP_FILTER_LABEL,
  MAP_FILTER_SECTION,
  MAP_FILTER_SELECT_CLASS,
} from '../home/mapFilterTheme';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import MapWalkExplorerControl from '../map/MapWalkExplorerControl';
import MapPlayerScoreHud from '../map/MapPlayerScoreHud';
import MapPinCoordinatesBar from '../map/MapPinCoordinatesBar';

const MapLibreMap = dynamic(() => import('../map/MapLibreMap'), { ssr: false });
const MapCornerControls = dynamic(() => import('../map/MapCornerControls'), { ssr: false });
const MapGlassSearchSelect = dynamic(() => import('../map/MapGlassSearchSelect'), { ssr: false });
const MapUserLocationControl = dynamic(() => import('../map/MapUserLocationControl'), { ssr: false });
const MapPlaceSearchControl = dynamic(() => import('../map/MapPlaceSearchControl'), { ssr: false });

const MIN_PIN_ZOOM_WITH_REGION = 12;
const MIN_PIN_ZOOM_OPEN_MAP = 14;
const MIN_PIN_ZOOM_PROFILE = 10;
const PREVIEW_PIN_ZOOM = 16;

function getMinPinZoom(sectionId, neighborhoodId, cityZoom = 13, pinMode = false) {
  if (pinMode) return MIN_PIN_ZOOM_PROFILE;
  if (sectionId || neighborhoodId) return MIN_PIN_ZOOM_WITH_REGION;
  const configuredZoom = Math.max(12, Math.round(Number(cityZoom)) || 13);
  return Math.min(MIN_PIN_ZOOM_OPEN_MAP, configuredZoom);
}

function canPlacePinAtZoom(zoom, sectionId, neighborhoodId, cityZoom = 13, pinMode = false) {
  return zoom >= getMinPinZoom(sectionId, neighborhoodId, cityZoom, pinMode);
}

/** در حالت مارکر: فقط تغییر بخش/منطقه؛ بدون drill-down خودکار به محله */
function shouldApplyRegionSelection(
  nextSectionId,
  nextNeighborhoodId,
  sectionId,
  neighborhoodId,
  pinMode
) {
  if (!nextSectionId && !nextNeighborhoodId) return false;
  if (nextSectionId === sectionId && nextNeighborhoodId === neighborhoodId) return false;

  if (pinMode) {
    if (nextSectionId !== sectionId) return true;
    return false;
  }

  return true;
}

function BoundarySelect({
  label,
  value,
  onChange,
  options,
  disabled,
  size = 'md',
  showLabel = false,
  mapToolbar = false,
}) {
  const sizeClass = mapToolbar
    ? MAP_FILTER_SELECT_CLASS
    : size === 'lg'
      ? 'min-h-[2.75rem] py-2.5 pl-3 pr-10 text-sm'
      : 'min-h-[2.75rem] px-3 py-2 text-xs sm:text-sm pr-9';

  const fieldClass = mapToolbar
    ? `${MAP_FILTER_FIELD} cursor-pointer appearance-none ${sizeClass}`
    : `w-full appearance-none rounded-xl border border-gray-200 bg-white/95 text-gray-800 shadow-sm backdrop-blur-sm hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 ${sizeClass}`;

  return (
    <label className={`block min-w-0 ${mapToolbar ? 'w-full' : ''}`}>
      <span className={showLabel ? MAP_FILTER_LABEL : 'sr-only'}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={fieldClass}
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
      </div>
    </label>
  );
}

function getFeatureDisplayName(feature) {
  const name = String(feature?.properties?.name || '').trim();
  if (!name || name === 'unknown') return null;
  return name;
}

function getClusterHint(data, sectionId) {
  if (!sectionId) {
    const hasNeighborhoods =
      Boolean(data?.hasNeighborhoods) &&
      (data?.sections || []).some((section) => (section.neighborhoods?.length ?? 0) > 0);
    return hasNeighborhoods ? 'محله' : 'بخش';
  }
  const section = data?.sections?.find((s) => s.featureId === sectionId);
  return (section?.neighborhoods?.length ?? 0) > 0 ? 'محله' : 'منطقه';
}

function getFeatureCenter(data, sectionId, neighborhoodId) {
  const feature = data.getActiveFeature(sectionId, neighborhoodId);
  const centroid = getGeometryCentroid(feature?.geometry);
  if (!centroid) return { lat: null, lng: null };
  return { lat: centroid[1], lng: centroid[0] };
}

export default function AhvazAddressPicker({
  city,
  className = '',
  value,
  onChange,
  interactive = false,
  selectable,
  controlsOutside = false,
  controlsLayout = 'compact',
  enableGestures = false,
  headerControls = null,
  mainCategoryControl = null,
  mapCornerCategoryControl = null,
  subCategoryControl = null,
  mobileCategoryControls = null,
  serviceSummary = null,
  expertMarkers = [],
  requestMarkers = [],
  layerControl = null,
  layerToolbar = null,
  merchantGlbMarkers = false,
  onRegionChange,
  expandOnMapClick = false,
  expandOnControlsClick = false,
  onRequestExpand,
  mapResizeTrigger = null,
  mobileControlsSummary = '',
  showPin = false,
  pinPosition,
  pinMarkerGlb = null,
  onPinChange,
  focusOnPin = false,
  boundaryVariant = 'filled',
  autoFitBoundsOnSelect = true,
  panOnSelect = true,
  autoFitBoundsOnLoad = true,
  lockMapView = false,
  mapViewPitch = null,
  mapViewBearing = null,
  showBoundaries = true,
  onShowBoundariesChange = null,
  show3D: show3DProp,
  onMapSelect2D = null,
  onMapSelect3D = null,
  mapRecenterKey: mapRecenterKeyProp = 0,
  map3DApplyKey: map3DApplyKeyProp = 0,
  mapFooter = null,
  mapExplorerSummaryCopy = null,
  mapLayer = null,
  mapViewportHeightClass = 'h-full',
  showMapTools = false,
  showViewModeToggle = false,
  placeSearchControl = null,
  placeSearchEnabled = false,
  onMapInstanceReady = null,
  skipDesktopFilterBar = false,
  expandHint = null,
  cornerControlsLayout = 'corner',
  showWalkExplorer = false,
  expertMarkerStyleOverride = null,
  skipMobileFullscreenSheet = false,
}) {
  const cityMapView = useMemo(
    () => resolveCityMapView(city),
    [
      city?.id,
      city?.latitude,
      city?.longitude,
      city?.mapZoom,
      city?.mapZoomMobile,
      city?.mapShow3D,
      city?.mapPitch,
      city?.mapBearing,
      city?.mapUseConfiguredView,
      city?.defaultSectionId,
      city?.defaultNeighborhoodId,
      city?.mapBuildingUseMapDefault,
      city?.mapBuildingDefaultHeight,
      city?.mapMaxBoundsPaddingKm,
    ]
  );
  const defaultRegion = cityMapView?.defaultRegion ?? { sectionId: '', neighborhoodId: '' };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalSectionId, setInternalSectionId] = useState(() => defaultRegion.sectionId);
  const [internalNeighborhoodId, setInternalNeighborhoodId] = useState(
    () => defaultRegion.neighborhoodId
  );
  const [boundsKey, setBoundsKey] = useState(0);
  const [panKey, setPanKey] = useState(0);
  const [pinNotice, setPinNotice] = useState(null);
  const [localPin, setLocalPin] = useState(null);
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
  const mapInstanceRef = useRef(null);
  const isMobile = useIsMobileViewport();
  const { isDark } = useTheme();
  const [mapViewStats, setMapViewStats] = useState(null);
  const [walkExplorerActive, setWalkExplorerActive] = useState(false);
  const mapStyleTouchedRef = useRef(false);
  const [mapStyleId, setMapStyleId] = useState(() => {
    if (typeof document === 'undefined') return resolveDefaultMapStyleId(false);
    return resolveDefaultMapStyleId(document.documentElement.classList.contains('dark'));
  });
  const show3DControlled = show3DProp !== undefined;
  const [internalShow3D, setInternalShow3D] = useState(() => cityMapView?.show3D ?? false);
  const [internalRecenterKey, setInternalRecenterKey] = useState(0);
  const [internal3DApplyKey, setInternal3DApplyKey] = useState(0);

  const show3D = show3DControlled ? Boolean(show3DProp) : internalShow3D;
  const mapRecenterKey = mapRecenterKeyProp > 0 ? mapRecenterKeyProp : internalRecenterKey;
  const map3DApplyKey = map3DApplyKeyProp > 0 ? map3DApplyKeyProp : internal3DApplyKey;

  const handleMapViewChange = useCallback((stats) => {
    setMapViewStats(stats);
  }, []);

  useEffect(() => {
    if (mapStyleTouchedRef.current) return;
    setMapStyleId(resolveDefaultMapStyleId(isDark));
  }, [isDark]);

  const handleMapStyleChange = useCallback((styleId) => {
    mapStyleTouchedRef.current = true;
    setMapStyleId(styleId);
  }, []);

  const handleMapReady = useCallback(
    (map) => {
      mapInstanceRef.current = map;
      onMapInstanceReady?.(map);
    },
    [onMapInstanceReady]
  );

  const handleSelect2D = useCallback(() => {
    if (show3DControlled) return;
    setInternalShow3D(false);
    setInternalRecenterKey((key) => key + 1);
  }, [show3DControlled]);

  const handleSelect3D = useCallback(() => {
    if (show3DControlled) return;
    setInternalShow3D(true);
    setInternal3DApplyKey((key) => key + 1);
  }, [show3DControlled]);

  const hasMobileMapSettings =
    Boolean(onShowBoundariesChange && onMapSelect2D && onMapSelect3D);

  const handleMapSelect2D = useCallback(() => {
    if (onMapSelect2D) {
      onMapSelect2D();
      return;
    }
    handleSelect2D();
  }, [onMapSelect2D, handleSelect2D]);

  const handleMapSelect3D = useCallback(() => {
    if (onMapSelect3D) {
      onMapSelect3D();
      return;
    }
    handleSelect3D();
  }, [onMapSelect3D, handleSelect3D]);

  useEffect(() => {
    if (show3DControlled) return;
    setInternalShow3D(cityMapView?.show3D ?? false);
  }, [city?.id, city?.mapShow3D, show3DControlled, cityMapView?.show3D]);

  const isControlled = value != null;
  const sectionId = isControlled ? (value.sectionId || '') : internalSectionId;
  const neighborhoodId = isControlled ? (value.neighborhoodId || '') : internalNeighborhoodId;
  const controlledRegionRef = useRef({ sectionId, neighborhoodId });
  const canSelectOnMap = selectable ?? (interactive || Boolean(onChange));
  const gesturesEnabled = enableGestures || interactive;
  const showInteractiveMapTools = gesturesEnabled && !expandOnMapClick;
  const showUserLocation = showInteractiveMapTools;
  const useConfiguredView = Boolean(cityMapView?.useConfiguredView);

  useEffect(() => {
    if (!isControlled) return;
    const prev = controlledRegionRef.current;
    if (prev.sectionId === sectionId && prev.neighborhoodId === neighborhoodId) return;
    controlledRegionRef.current = { sectionId, neighborhoodId };
    if (autoFitBoundsOnSelect) {
      setBoundsKey((k) => k + 1);
    } else if (panOnSelect && (sectionId || neighborhoodId)) {
      setPanKey((k) => k + 1);
    }
  }, [isControlled, sectionId, neighborhoodId, autoFitBoundsOnSelect, panOnSelect]);

  useEffect(() => {
    if (isControlled) return;
    setInternalSectionId(defaultRegion.sectionId);
    setInternalNeighborhoodId(defaultRegion.neighborhoodId);
    if (defaultRegion.sectionId || defaultRegion.neighborhoodId) {
      setPanKey((k) => k + 1);
    }
  }, [
    city?.id,
    defaultRegion.sectionId,
    defaultRegion.neighborhoodId,
    isControlled,
  ]);

  useEffect(() => {
    const slug = city?.slug;
    if (!slug) {
      setData(null);
      setLoading(false);
      setError(null);
      return undefined;
    }

    if (!cityHasBoundaryMap(city)) {
      setData(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    loadCityBoundaryData(slug, city?.geoJsonUpdatedAt)
      .then((processed) => {
        if (cancelled) return;
        setData(processed);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'boundary-not-found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city, city?.slug, city?.geoJsonUpdatedAt, city?.hasBoundaryMap]);

  useEffect(() => {
    if (data && autoFitBoundsOnLoad && !lockMapView) {
      setBoundsKey((k) => k + 1);
    }
  }, [autoFitBoundsOnLoad, data, lockMapView]);

  const emitChange = useCallback(
    (nextSectionId, nextNeighborhoodId, lat, lng) => {
      if (!data || !onChange) return;
      const center = lat != null && lng != null
        ? { lat, lng }
        : getFeatureCenter(data, nextSectionId, nextNeighborhoodId);
      const payload = buildMapAddressPayload(
        data,
        nextSectionId,
        nextNeighborhoodId,
        center.lat,
        center.lng
      );
      onChange(
        { sectionId: nextSectionId, neighborhoodId: nextNeighborhoodId },
        payload
      );
    },
    [data, onChange]
  );

  const notifyRegionChange = useCallback(
    (nextSectionId, nextNeighborhoodId) => {
      if (!onRegionChange) return;
      const section = data?.sections?.find((s) => s.featureId === nextSectionId);
      const neighborhood = section?.neighborhoods?.find((n) => n.featureId === nextNeighborhoodId);
      onRegionChange({
        sectionId: nextSectionId || '',
        neighborhoodId: nextNeighborhoodId || '',
        sectionName: section?.name || '',
        neighborhoodName: neighborhood?.name || '',
      });
    },
    [data, onRegionChange]
  );

  const applySelection = useCallback(
    (nextSectionId, nextNeighborhoodId, lat, lng, { moveMap = true } = {}) => {
      const selectionChanged =
        nextSectionId !== sectionId || nextNeighborhoodId !== neighborhoodId;

      if (!isControlled) {
        setInternalSectionId(nextSectionId);
        setInternalNeighborhoodId(nextNeighborhoodId);
      }
      if (selectionChanged) {
        if (moveMap && !lockMapView) {
          if (autoFitBoundsOnSelect) {
            setBoundsKey((k) => k + 1);
          } else if (panOnSelect && (nextSectionId || nextNeighborhoodId)) {
            setPanKey((k) => k + 1);
          }
        }
        notifyRegionChange(nextSectionId, nextNeighborhoodId);
      }
      emitChange(nextSectionId, nextNeighborhoodId, lat, lng);
    },
    [
      autoFitBoundsOnSelect,
      emitChange,
      isControlled,
      lockMapView,
      panOnSelect,
      sectionId,
      neighborhoodId,
      notifyRegionChange,
    ]
  );

  useEffect(() => {
    if (!data || !onRegionChange) return;
    notifyRegionChange(sectionId, neighborhoodId);
  }, [data, sectionId, neighborhoodId, notifyRegionChange, onRegionChange]);

  const neighborhoodOptions = useMemo(() => {
    if (!data || !sectionId) return [];
    const section = data.sections.find((s) => s.featureId === sectionId);
    return section?.neighborhoods || [];
  }, [data, sectionId]);

  const handleFeatureSelect = useCallback(
    (feature, lat, lng) => {
      if (!data || !feature) return;
      const { sectionId: sId, neighborhoodId: nId } = data.getSelectionFromFeature(feature);
      applySelection(sId, nId, lat, lng);
    },
    [applySelection, data]
  );

  const hasBoundaryLayers = Boolean(data?.collection?.features?.some(
    (f) => f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon'
  ));
  const cityMapZoom = cityMapView?.center?.zoom ?? 13;

  useEffect(() => {
    if (!pinNotice) return undefined;
    const timer = setTimeout(() => setPinNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [pinNotice]);

  const pinMode = Boolean(showPin && onPinChange);

  useEffect(() => {
    if (pinPosition?.lat != null && pinPosition?.lng != null) {
      setLocalPin(pinPosition);
      return;
    }
    setLocalPin(null);
  }, [pinPosition?.lat, pinPosition?.lng]);

  const effectivePin =
    pinPosition?.lat != null && pinPosition?.lng != null
      ? pinPosition
      : localPin?.lat != null && localPin?.lng != null
        ? localPin
        : null;

  const resolveMapClick = useCallback(
    (lat, lng, zoom) => {
      if (pinMode) {
        let nextSectionId = sectionId;
        let nextNeighborhoodId = neighborhoodId;

        if (showBoundaries && data) {
          const feature = data.findFeatureAtPoint(lat, lng);
          if (feature) {
            const { sectionId: sId, neighborhoodId: nId } = data.getSelectionFromFeature(feature);
            if (sId || nId) {
              nextSectionId = sId;
              nextNeighborhoodId = nId;
              if (sId !== sectionId || nId !== neighborhoodId) {
                applySelection(sId, nId, lat, lng, { moveMap: false });
              }
            }
          }
        }

        if (!canPlacePinAtZoom(zoom, nextSectionId, nextNeighborhoodId, cityMapZoom, true)) {
          setPinNotice('برای ثبت مارکر، کمی بیشتر روی نقشه زوم کنید.');
          return true;
        }

        setPinNotice(null);
        const nextPin = { lat, lng };
        setLocalPin(nextPin);
        onPinChange?.(nextPin);
        return true;
      }

      if (showBoundaries && data) {
        const feature = data.findFeatureAtPoint(lat, lng);
        if (feature) {
          const { sectionId: sId, neighborhoodId: nId } = data.getSelectionFromFeature(feature);
          if (shouldApplyRegionSelection(sId, nId, sectionId, neighborhoodId, pinMode)) {
            handleFeatureSelect(feature, lat, lng);
            return true;
          }
        }
      }

      if (!showBoundaries || !data) return false;
      const feature = data.findFeatureAtPoint(lat, lng);
      if (!feature) return false;
      const { sectionId: sId, neighborhoodId: nId } = data.getSelectionFromFeature(feature);
      if (!sId && !nId) return false;
      if (sId === sectionId && nId === neighborhoodId) return false;
      handleFeatureSelect(feature, lat, lng);
      return true;
    },
    [
      cityMapZoom,
      data,
      handleFeatureSelect,
      onPinChange,
      applySelection,
      pinMode,
      sectionId,
      neighborhoodId,
      showBoundaries,
    ]
  );

  const handleMapPointSelect = useCallback(
    (lat, lng, zoom) => {
      resolveMapClick(lat, lng, zoom);
    },
    [resolveMapClick]
  );

  const selectedFeatureId = neighborhoodId || sectionId || null;

  /** همیشه همه مرزها — بزرگ‌ترها پایین، کوچک‌ترها روی نقشه */
  const baseGeoData = useMemo(() => {
    if (!data) return null;

    const drawable = (data.collection?.features || []).filter(
      (f) => f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon'
    );

    if (!drawable.length) return null;

    const sorted = [...drawable].sort(
      (a, b) => getGeometryArea(b.geometry) - getGeometryArea(a.geometry)
    );

    if (sorted.length === 1) return sorted[0];
    return { type: 'FeatureCollection', features: sorted };
  }, [data]);

  const highlightFeature = useMemo(() => {
    if (!data || !selectedFeatureId) return null;
    const selected = data.getActiveFeature(sectionId, neighborhoodId);
    if (
      !selected?.geometry ||
      (selected.geometry.type !== 'Polygon' && selected.geometry.type !== 'MultiPolygon')
    ) {
      return null;
    }
    if (selected.properties?.featureId === data.city?.featureId) return null;
    return selected;
  }, [data, sectionId, neighborhoodId, selectedFeatureId]);

  const boundaryMapLabels = useMemo(() => {
    if (!data) return [];

    const labels = [];
    const activeSection = sectionId
      ? data.sections?.find((section) => section.featureId === sectionId)
      : null;

    const allNeighborhoods = data.hasNeighborhoods
      ? (data.sections || []).flatMap((section) => section.neighborhoods || [])
      : [];

    const neighborhoodItems = sectionId
      ? activeSection?.neighborhoods || []
      : allNeighborhoods.length
        ? allNeighborhoods
        : null;

    const labelTargets = neighborhoodItems?.length
      ? neighborhoodItems.map((item) => ({
          featureId: item.featureId,
          name: item.name,
        }))
      : (data.sections || []).map((section) => ({
          featureId: section.featureId,
          name: section.name,
        }));

    labelTargets.forEach(({ featureId, name }) => {
      if (!featureId || selectedFeatureId === featureId) return;

      const feature = data.byId?.get(featureId);
      const displayName = getFeatureDisplayName(feature) || name;
      const centroid = getGeometryCentroid(feature?.geometry);
      if (!displayName || !centroid) return;

      labels.push({
        lng: centroid[0],
        lat: centroid[1],
        name: displayName,
        selected: false,
      });
    });

    if (selectedFeatureId && selectedFeatureId !== data.city?.featureId) {
      const selected = data.getActiveFeature(sectionId, neighborhoodId);
      const name = getFeatureDisplayName(selected);
      const centroid = getGeometryCentroid(selected?.geometry);
      if (name && centroid) {
        labels.push({ lng: centroid[0], lat: centroid[1], name, selected: true });
      }
    }

    return labels;
  }, [data, sectionId, neighborhoodId, selectedFeatureId]);

  const fitBoundsFeature = useMemo(() => {
    if (!data) return null;

    if (neighborhoodId) {
      const selected = data.getActiveFeature(sectionId, neighborhoodId);
      if (selected?.geometry) return selected;
    }

    if (sectionId && highlightFeature) {
      return highlightFeature;
    }

    return baseGeoData;
  }, [data, baseGeoData, highlightFeature, sectionId, neighborhoodId]);

  const fitBoundsMode = neighborhoodId ? 'neighborhood' : sectionId ? 'section' : 'city';
  const boundaryClusterHint = getClusterHint(data, sectionId);

  const cityBoundaryFeature = useMemo(() => resolveCityBoundaryFeature(data), [data]);

  const placeSearchBoundaryGeometry = useMemo(() => {
    if (neighborhoodId || sectionId) {
      const active = data?.getActiveFeature?.(sectionId, neighborhoodId);
      if (active?.geometry) return active.geometry;
    }
    return cityBoundaryFeature?.geometry ?? null;
  }, [data, sectionId, neighborhoodId, cityBoundaryFeature]);

  const mapMaxBounds = useMemo(() => {
    if (!cityBoundaryFeature) return null;
    return getMaxBoundsFromGeoData(cityBoundaryFeature, cityMapView?.maxBoundsPaddingKm);
  }, [cityBoundaryFeature, cityMapView?.maxBoundsPaddingKm]);

  const mapConfig = useMemo(
    () => resolveCityMapConfig(city, { mobile: isMobile }),
    [
    city?.id,
    city?.slug,
    city?.name,
    city?.latitude,
    city?.longitude,
    city?.mapZoom,
    city?.mapZoomMobile,
    isMobile,
  ]);

  const pinFocusActive = Boolean(
    focusOnPin && pinPosition?.lat != null && pinPosition?.lng != null
  );

  const mapCenter = useMemo(() => {
    if (pinFocusActive) return [pinPosition.lat, pinPosition.lng];
    if (mapConfig) return [mapConfig.lat, mapConfig.lng];
    return [32.4279, 53.688];
  }, [pinFocusActive, pinPosition, mapConfig]);

  const mapZoom = useMemo(() => {
    if (pinFocusActive) return PREVIEW_PIN_ZOOM;
    return mapConfig?.zoom ?? 6;
  }, [pinFocusActive, mapConfig]);

  const boundaryClusterMaxZoom = sectionId
    ? BOUNDARY_CLUSTER_SECTION_MAX_ZOOM
    : BOUNDARY_CLUSTER_MAX_ZOOM;

  const resolvedMapPitch = mapViewPitch ?? cityMapView?.pitch ?? null;
  const resolvedMapBearing = mapViewBearing ?? cityMapView?.bearing ?? null;
  const expertMarkerStyle = useMemo(
    () => expertMarkerStyleOverride || resolveCityExpertMarkerStyle(city),
    [expertMarkerStyleOverride, city?.id, city?.mapExpertMarkerStyle]
  );

  const cityLabel = city?.name || data?.city?.name || 'شهر';

  const placeSearchCenter = useMemo(() => {
    const centroid = getGeometryCentroid(placeSearchBoundaryGeometry);
    if (centroid) return { lat: centroid[1], lng: centroid[0] };
    return { lat: mapConfig?.lat, lng: mapConfig?.lng };
  }, [placeSearchBoundaryGeometry, mapConfig?.lat, mapConfig?.lng]);

  const activePlaceSearchControl = useMemo(() => {
    if (placeSearchControl) return placeSearchControl;
    if (!placeSearchEnabled || !mapConfig) return null;

    return (
      <MapPlaceSearchControl
        variant="toolbar"
        mapRef={mapInstanceRef}
        cityName={cityLabel}
        centerLat={placeSearchCenter.lat}
        centerLng={placeSearchCenter.lng}
        boundaryGeometry={placeSearchBoundaryGeometry}
        markerEngine="maplibre"
        regionKey={`${sectionId}-${neighborhoodId}`}
      />
    );
  }, [
    placeSearchControl,
    placeSearchEnabled,
    mapConfig,
    cityLabel,
    placeSearchCenter.lat,
    placeSearchCenter.lng,
    placeSearchBoundaryGeometry,
    sectionId,
    neighborhoodId,
  ]);

  const boundaryNotice =
    !mapConfig
      ? 'مختصات این شهر در سیستم ثبت نشده — نقشه کلی نمایش داده می‌شود.'
      : error === 'boundary-not-found'
        ? 'مرزبندی GeoJSON برای این شهر موجود نیست — نقشه پایه نمایش داده می‌شود.'
        : error
          ? 'خطا در بارگذاری مرزبندی — نقشه پایه نمایش داده می‌شود.'
          : null;

  const noticeClass = controlsOutside
    ? 'rounded-lg border px-3 py-2 text-xs shadow-sm'
    : 'absolute bottom-3 left-3 right-3 z-[1000] rounded-lg border px-3 py-2 text-xs shadow-sm';

  const isMapFullscreen = controlsLayout === 'fullscreen';
  const isMapBannerHeader = controlsLayout === 'banner-header';
  const isEmbeddedMobileMapPreview = isMapBannerHeader && isMobile && !isMapFullscreen;
  const isEmbeddedBannerPreview = isMapBannerHeader && !isMapFullscreen;
  const hideEmbeddedPreviewMapControls = isEmbeddedMobileMapPreview && Boolean(expandHint);
  const useFullscreenMapOverlayControls = isMapFullscreen && !pinMode && !isMobile;
  const useGlassCornerControls = (isMapBannerHeader && !isMobile) || useFullscreenMapOverlayControls;
  const showCornerMapGuide =
    (isMapBannerHeader && !isMobile) || (useFullscreenMapOverlayControls && !isMobile);
  const showCornerMapInfo = showCornerMapGuide;
  const isMapToolbarLayout = isMapFullscreen || isMapBannerHeader;
  const useGoodsRegionToolbar =
    !skipDesktopFilterBar &&
    isMapBannerHeader &&
    !mainCategoryControl &&
    !subCategoryControl &&
    !placeSearchControl;
  const selectSize = isMapToolbarLayout ? 'lg' : 'md';
  const focusGoodsCategorySearch = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('goods-map-open-search'));
    window.setTimeout(() => {
      document.getElementById('goods-map-category-search')?.focus({ preventScroll: true });
    }, 80);
  }, []);
  const regionExpandHandlers = expandOnControlsClick
    ? {
        onMouseDown: (event) => {
          event.preventDefault();
          onRequestExpand?.();
        },
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onRequestExpand?.();
          }
        },
        role: 'button',
        tabIndex: 0,
        'aria-label': 'باز کردن نقشه تمام‌صفحه برای انتخاب منطقه',
      }
    : {};

  const useCornerRegionFilters =
    hasBoundaryLayers &&
    canSelectOnMap &&
    (data?.sections?.length ?? 0) > 0 &&
    ((isMapBannerHeader &&
      !isMobile &&
      !hideEmbeddedPreviewMapControls &&
      (mapFooter || showMapTools || hasMobileMapSettings)) ||
      (useFullscreenMapOverlayControls && !isMobile));

  const sectionControl =
    hasBoundaryLayers && (data?.sections?.length ?? 0) > 0 && canSelectOnMap ? (
      <div {...(useCornerRegionFilters || isMapToolbarLayout ? {} : regionExpandHandlers)}>
        <BoundarySelect
          label="بخش"
          size={selectSize}
          showLabel={!isMapToolbarLayout}
          mapToolbar={isMapToolbarLayout}
          value={sectionId}
          onChange={(v) => applySelection(v, '')}
          options={[
            { value: '', label: `کل ${cityLabel}` },
            ...(data?.sections || []).map((s) => ({ value: s.featureId, label: s.name })),
          ]}
        />
      </div>
    ) : null;

  const neighborhoodControl =
    hasBoundaryLayers && (data?.sections?.length ?? 0) > 0 && canSelectOnMap ? (
      <div {...(useCornerRegionFilters || isMapToolbarLayout ? {} : regionExpandHandlers)}>
        <BoundarySelect
          label="محله"
          size={selectSize}
          showLabel={!isMapToolbarLayout}
          mapToolbar={isMapToolbarLayout}
          value={neighborhoodId}
          onChange={(v) => applySelection(sectionId, v)}
          disabled={!sectionId}
          options={[
            { value: '', label: sectionId ? 'همه محله‌ها' : 'محله' },
            ...neighborhoodOptions.map((n) => ({ value: n.featureId, label: n.name })),
          ]}
        />
      </div>
    ) : null;

  const cornerRegionFilters = useCornerRegionFilters ? (
    <>
      <MapGlassSearchSelect
          label="بخش"
          value={sectionId}
          onChange={(v) => applySelection(v, '')}
          options={[
            { value: '', label: `کل ${cityLabel}` },
            ...(data?.sections || []).map((s) => ({ value: s.featureId, label: s.name })),
          ]}
          searchPlaceholder="جستجوی بخش…"
        />
        <MapGlassSearchSelect
          label="محله"
          value={neighborhoodId}
          onChange={(v) => applySelection(sectionId, v)}
          disabled={!sectionId}
          options={[
            { value: '', label: sectionId ? 'همه محله‌ها' : 'محله' },
            ...neighborhoodOptions.map((n) => ({ value: n.featureId, label: n.name })),
          ]}
          searchPlaceholder="جستجوی محله…"
      />
    </>
  ) : null;

  const cornerCategorySearch =
    useCornerRegionFilters && mapCornerCategoryControl ? mapCornerCategoryControl : null;

  const regionControls =
    !useCornerRegionFilters && (sectionControl || neighborhoodControl) ? (
      <div
        className={
          controlsOutside
            ? isMapToolbarLayout
              ? 'contents'
              : 'grid grid-cols-1 gap-2 sm:grid-cols-2'
            : 'absolute top-3 right-3 z-[1000] flex w-[calc(100%-1.5rem)] max-w-[11.5rem] flex-col gap-2 sm:max-w-[12.5rem]'
        }
        {...(!isMapToolbarLayout ? regionExpandHandlers : {})}
      >
        {sectionControl}
        {neighborhoodControl}
      </div>
    ) : null;

  const mapCategoryControls =
    mainCategoryControl || subCategoryControl ? (
      <>
        {mainCategoryControl}
        {subCategoryControl}
      </>
    ) : null;

  const mobileFilterCategoryControls = mobileCategoryControls || mapCategoryControls;

  const isFullscreenControls = controlsLayout === 'fullscreen';

  const mapViewportClass = controlsOutside
    ? isFullscreenControls
      ? `relative w-full min-h-0 flex-1 overflow-hidden bg-gray-100 ${className}`
      : controlsLayout === 'banner-header'
        ? `relative w-full overflow-hidden bg-gray-100 dark:bg-sky-950/35 ${className}`
        : `relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-gray-100 dark:border-sky-800 dark:bg-sky-950/35 ${className}`
    : `relative w-full min-h-0 overflow-hidden bg-gray-100 ${mapViewportHeightClass} ${className}`;

  const mapClickEnabled =
    (canSelectOnMap || showPin) && !pinFocusActive && !expandOnMapClick;

  const mapOverlay = (
    <>
      {isEmbeddedBannerPreview && expandHint && onRequestExpand ? (
        <>
          {isEmbeddedMobileMapPreview ? (
            <button
              type="button"
              className="absolute inset-0 z-[440] cursor-pointer touch-manipulation md:hidden"
              aria-label={expandHint.ariaLabel || MAP_INTRO.mobileExpandHintAria}
              onClick={onRequestExpand}
            />
          ) : null}
          <HomeMapExpandHintBar
            variant={isEmbeddedMobileMapPreview ? 'center' : 'bottom'}
            onOpen={onRequestExpand}
            label={expandHint.label}
            ariaLabel={expandHint.ariaLabel}
            mobileOnly={expandHint.mobileOnly}
          />
        </>
      ) : null}

      {!controlsOutside && regionControls}

      {!controlsOutside && boundaryNotice && (
        <div className={`${noticeClass} border-amber-200 bg-amber-50/95 text-amber-800`}>
          {boundaryNotice}
        </div>
      )}

      {!controlsOutside && pinNotice && (
        <div className={`${noticeClass} z-[1001] border-sky-200 bg-sky-50/95 text-sky-900`}>
          {pinNotice}
        </div>
      )}

    </>
  );

  const pinCoordinatesBar =
    pinMode && effectivePin ? <MapPinCoordinatesBar pin={effectivePin} /> : null;

  const mapResizeKey =
    controlsLayout === 'fullscreen' && mapResizeTrigger != null
      ? `${mapResizeTrigger}-${mobileSheetExpanded ? '1' : '0'}`
      : mapResizeTrigger;

  const mapLibreProps = {
    center: mapCenter,
    zoom: mapZoom,
    show3D,
    boundaryData: baseGeoData,
    showBoundaries: Boolean(baseGeoData && showBoundaries),
    boundaryVariant,
    boundaryLabels: hasBoundaryLayers && !pinFocusActive ? boundaryMapLabels : [],
    boundaryClusterHint,
    boundaryClusterMaxZoom,
    highlightFeature,
    expertMarkers,
    requestMarkers,
    expertMarkerStyle,
    merchantGlbMarkers,
    pinPosition: effectivePin,
    pinMarkerGlb,
    pinPreviewActive: pinMode && !effectivePin,
    focusOnPin: pinFocusActive,
    pinFocusZoom: PREVIEW_PIN_ZOOM,
    panKey: lockMapView || autoFitBoundsOnSelect ? 0 : panKey,
    fitBoundsKey:
      lockMapView || pinFocusActive || useConfiguredView || !autoFitBoundsOnSelect ? 0 : boundsKey,
    fitBoundsFeature:
      lockMapView || pinFocusActive || useConfiguredView || !autoFitBoundsOnSelect
        ? null
        : fitBoundsFeature,
    fitBoundsMode: autoFitBoundsOnSelect ? fitBoundsMode : 'city',
    fitBoundsOnce: lockMapView || useConfiguredView ? true : !autoFitBoundsOnSelect,
    skipInitialFitBounds: lockMapView || useConfiguredView,
    syncCameraFromProps: !lockMapView && !walkExplorerActive,
    freezeDisplayModeSync: walkExplorerActive,
    viewPitch: show3D ? resolvedMapPitch : null,
    viewBearing: show3D ? resolvedMapBearing : null,
    buildingConfig: cityMapView?.buildings,
    gesturesEnabled,
    mapClickEnabled,
    onMapClick: handleMapPointSelect,
    onMapReady: showInteractiveMapTools || onMapInstanceReady || placeSearchEnabled || showWalkExplorer
      ? handleMapReady
      : undefined,
    mapResizeTrigger: mapResizeKey ?? mapResizeTrigger,
    mapRecenterKey,
    map3DApplyKey,
    onMapViewChange: mapFooter || showMapTools || hasMobileMapSettings ? handleMapViewChange : undefined,
    showNavigationControl: interactive && !enableGestures,
    maxBounds: mapMaxBounds,
    mapStyleId,
  };

  if (loading) {
    const loadingMap = (
      <div className={mapViewportClass}>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gray-100 animate-pulse"
          aria-hidden
        />
        {mapOverlay}
        <MapLibreMap {...mapLibreProps} showBoundaries={false} boundaryLabels={[]} />
      </div>
    );

    if (controlsOutside) {
      return <div className="flex w-full flex-col gap-2.5">{loadingMap}</div>;
    }

    return loadingMap;
  }

  const isMobileFullscreenMap = isFullscreenControls && isMobile && hasMobileMapSettings;
  const showMapViewModeToggle =
    Boolean(onMapSelect2D && onMapSelect3D) || Boolean(showViewModeToggle);
  const showMapSummaryOverlay =
    Boolean(mapExplorerSummaryCopy?.title) && !mapFooter && !isMobile && isMapBannerHeader;

  const showMapCornerControls =
    !hideEmbeddedPreviewMapControls &&
    (useFullscreenMapOverlayControls ||
      (!isMobileFullscreenMap && (mapFooter || showMapTools || hasMobileMapSettings)));

  const hideMapViewportUserLocation = isMapFullscreen && isMobile;

  const cornerControlsWrapperClass =
    useFullscreenMapOverlayControls && isMobile
      ? 'absolute bottom-[5.75rem] start-3 z-[1002] max-h-[min(52dvh,20rem)] overflow-y-auto overscroll-contain pb-1'
      : 'absolute inset-y-3 start-3 z-[1002]';

  const cornerControlsProps = {
    mapStats: mapViewStats,
    show3D,
    mapStyleId,
    onMapStyleChange: handleMapStyleChange,
    showViewModeToggle: showMapViewModeToggle,
    onSelect2D: handleMapSelect2D,
    onSelect3D: handleMapSelect3D,
    showBoundaries,
    onShowBoundariesChange,
    layout: cornerControlsLayout,
    showMapGuide: showCornerMapGuide,
    showMapViewInfo: showCornerMapInfo,
    useGlass: useGlassCornerControls,
    mapRef: mapInstanceRef,
    showUserLocation: true,
    regionFilters: useCornerRegionFilters ? cornerRegionFilters : null,
    categorySearch:
      useCornerRegionFilters || (useFullscreenMapOverlayControls && !isMobile)
        ? cornerCategorySearch
        : null,
    floating: false,
    compactColumn: useFullscreenMapOverlayControls && isMobile,
  };

  const mapViewport = (
    <div className={mapViewportClass}>
      {mapOverlay}
      <MapLibreMap {...mapLibreProps} />
      {showMapSummaryOverlay ? (
        <div
          className={`pointer-events-none absolute end-3 z-[1001] ${
            isEmbeddedBannerPreview && expandHint ? 'bottom-14 md:bottom-12' : 'bottom-3'
          }`}
        >
          <MapExplorerSummaryTypewriter copy={mapExplorerSummaryCopy} />
        </div>
      ) : null}
      {showMapCornerControls ? (
        <div className={cornerControlsWrapperClass}>
          <MapCornerControls {...cornerControlsProps} />
        </div>
      ) : null}
      {isEmbeddedMobileMapPreview && onRequestExpand ? (
        <HomeMapMobilePreviewOverlay
          layerToolbar={layerToolbar}
          sectionControl={sectionControl}
          neighborhoodControl={neighborhoodControl}
          onExpand={onRequestExpand}
        />
      ) : null}
      {showWalkExplorer ? (
        <MapPlayerScoreHud expertScore={88} merchantScore={72} memberScore={88} />
      ) : null}
      {showWalkExplorer || (showUserLocation && !showMapCornerControls && !hideMapViewportUserLocation) ? (
        cornerControlsLayout === 'splitBottom' ? (
          <div className="pointer-events-none absolute bottom-3 start-3 z-[1002] flex max-w-[calc(100%-5.5rem)] items-center gap-1.5">
            {showWalkExplorer ? (
              <MapWalkExplorerControl
                mapRef={mapInstanceRef}
                show3D={show3D}
                enabled={gesturesEnabled}
                onActiveChange={setWalkExplorerActive}
                className="pointer-events-auto min-w-0 shrink"
              />
            ) : null}
            {showUserLocation ? (
              <MapUserLocationControl
                mapRef={mapInstanceRef}
                markerEngine="maplibre"
                inline
                appearance="glass"
                className="pointer-events-auto shrink-0"
              />
            ) : null}
          </div>
        ) : (
          <>
            {showWalkExplorer ? (
              <MapWalkExplorerControl
                mapRef={mapInstanceRef}
                show3D={show3D}
                enabled={gesturesEnabled}
                onActiveChange={setWalkExplorerActive}
                className="pointer-events-auto absolute bottom-3 start-3 z-[1002]"
              />
            ) : null}
            {showUserLocation ? (
              <MapUserLocationControl
                mapRef={mapInstanceRef}
                markerEngine="maplibre"
                anchor="auto"
                appearance="solid"
              />
            ) : null}
          </>
        )
      ) : null}
    </div>
  );

  const resolvedMapFooter = mapFooter;

  const mapBlockShellClass = isFullscreenControls
    ? 'flex h-full min-h-0 w-full flex-1 flex-col'
    : 'flex w-full flex-col overflow-hidden';

  const mapBlock = mapFooter ? (
    <div className={mapBlockShellClass}>
      {mapViewport}
      {pinCoordinatesBar}
      <div className="shrink-0">{resolvedMapFooter}</div>
    </div>
  ) : (
    <div className={mapBlockShellClass}>
      {mapViewport}
      {pinCoordinatesBar}
    </div>
  );

  if (controlsOutside) {
    const controlsGap = controlsLayout === 'fullscreen' ? 'gap-3 sm:gap-4' : 'gap-2.5';

    const layerPanel = layerToolbar || layerControl;
    const isFullscreenLayout = controlsLayout === 'fullscreen';
    const pinLayerToolbarOnTop = isFullscreenLayout && isMobile && layerToolbar;
    const isBannerHeaderMobilePreview =
      controlsLayout === 'banner-header' && isMobile && !isFullscreenLayout;
    const showMobileFilterSheet =
      !isBannerHeaderMobilePreview && (!expandOnMapClick || isFullscreenLayout);

    const filterControls = activePlaceSearchControl ? (
      <div className="space-y-3">
        {activePlaceSearchControl}
        {sectionControl || neighborhoodControl ? (
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:hidden">
            {sectionControl}
            {neighborhoodControl}
          </div>
        ) : null}
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {layerPanel && !pinLayerToolbarOnTop ? (
          <div className={layerToolbar ? '' : 'space-y-2'}>
            {!layerToolbar ? <p className={MAP_FILTER_SECTION}>نوع نمایش</p> : null}
            {layerPanel}
          </div>
        ) : null}

        {mobileFilterCategoryControls || (!useGoodsRegionToolbar && (sectionControl || neighborhoodControl)) ? (
          <div className="space-y-2.5">
            <p className={MAP_FILTER_SECTION}>فیلتر دسته و منطقه</p>
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              {mobileFilterCategoryControls ? (
                <div className="contents md:hidden">{mobileFilterCategoryControls}</div>
              ) : null}
              {!useGoodsRegionToolbar && sectionControl ? (
                <div className="md:hidden">{sectionControl}</div>
              ) : null}
              {!useGoodsRegionToolbar && neighborhoodControl ? (
                <div className="md:hidden">{neighborhoodControl}</div>
              ) : null}
            </div>
          </div>
        ) : null}

        {headerControls ? (
          <div
            onMouseDown={
              expandOnControlsClick && onRequestExpand
                ? (event) => {
                    event.preventDefault();
                    onRequestExpand();
                  }
                : undefined
            }
          >
            {headerControls}
          </div>
        ) : null}

        {regionControls && !isMapToolbarLayout ? regionControls : null}

        {boundaryNotice ? (
          <p className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-3 py-2 text-[11px] leading-relaxed text-amber-900 sm:text-xs">
            {boundaryNotice}
          </p>
        ) : null}
        {pinNotice ? (
          <p className="rounded-xl border border-sky-200/90 bg-sky-50/90 px-3 py-2 text-[11px] leading-relaxed text-sky-900 sm:text-xs">
            {pinNotice}
          </p>
        ) : null}
      </div>
    );

    if (controlsLayout === 'fullscreen' || controlsLayout === 'banner-header') {
      const activeSection = data?.sections?.find((s) => s.featureId === sectionId);
      const activeNeighborhood = activeSection?.neighborhoods?.find(
        (n) => n.featureId === neighborhoodId
      );
      const regionParts = [
        activeSection?.name,
        activeNeighborhood?.name,
      ].filter(Boolean);
      const sheetSummary =
        mobileControlsSummary ||
        (regionParts.length ? regionParts.join(' · ') : `کل ${cityLabel}`);

      const hasFilters = Boolean(
        activePlaceSearchControl ||
          (layerToolbar && !pinLayerToolbarOnTop) ||
          layerControl ||
          headerControls ||
          mainCategoryControl ||
          subCategoryControl ||
          sectionControl ||
          neighborhoodControl ||
          mobileFilterCategoryControls ||
          serviceSummary
      );

      const isMobileFullscreen =
        isFullscreenLayout && isMobile && !skipMobileFullscreenSheet;

      if (isMobileFullscreen) {
        const mobileFullscreenSearch = mainCategoryControl || mobileFilterCategoryControls;
        const mobileFullscreenRegion =
          sectionControl || neighborhoodControl ? (
            <div className="grid grid-cols-1 gap-2.5">
              {sectionControl}
              {neighborhoodControl}
            </div>
          ) : null;

        return (
          <div className="relative flex h-full min-h-0 w-full flex-col">
            <div className="relative min-h-0 flex-1">
              {mapViewport}
              {pinCoordinatesBar}
              <HomeMapMobileFullscreenSheet
                summary={sheetSummary}
                statusCopy={mapExplorerSummaryCopy}
                mapLayer={mapLayer}
                layerToolbar={layerToolbar}
                searchControl={mobileFullscreenSearch}
                regionControls={mobileFullscreenRegion}
                show3D={show3D}
                onSelect2D={handleMapSelect2D}
                onSelect3D={handleMapSelect3D}
                showBoundaries={showBoundaries}
                onShowBoundariesChange={onShowBoundariesChange}
                onExpandedChange={setMobileSheetExpanded}
              />
              {showUserLocation ? (
                <div className="pointer-events-none absolute bottom-3 start-3 z-[520] pb-[max(0px,env(safe-area-inset-bottom))]">
                  <MapUserLocationControl
                    mapRef={mapInstanceRef}
                    markerEngine="maplibre"
                    inline
                    labeled
                    label="موقعیت من"
                    appearance="glass"
                    anchor="start"
                    className="pointer-events-auto min-w-[8.25rem] shadow-md [&_button]:!h-10 [&_button]:!w-auto [&_button]:px-3"
                  />
                </div>
              ) : null}
            </div>
          </div>
        );
      }

      return (
        <div
          className={
            isFullscreenLayout ? 'flex h-full min-h-0 w-full flex-col' : 'flex w-full flex-col'
          }
        >
          {pinLayerToolbarOnTop ? (
            <HomeMapMobileTopBar>{layerToolbar}</HomeMapMobileTopBar>
          ) : null}

          {!skipDesktopFilterBar ? (
            <HomeMapDesktopFilterBar
              placeSearchControl={activePlaceSearchControl}
              layerToolbar={pinLayerToolbarOnTop ? null : layerToolbar}
              layerControl={layerControl}
              mainCategoryControl={useCornerRegionFilters ? null : mainCategoryControl}
              subCategoryControl={subCategoryControl}
              sectionControl={useCornerRegionFilters ? null : sectionControl}
              neighborhoodControl={useCornerRegionFilters ? null : neighborhoodControl}
              serviceControl={headerControls}
              regionControl={useCornerRegionFilters ? null : regionControls}
              summary={serviceSummary}
              variant={useGoodsRegionToolbar ? 'goodsRegionRow' : 'default'}
              onCategorySearchFocus={useGoodsRegionToolbar ? focusGoodsCategorySearch : null}
            />
          ) : null}

          <div className={isFullscreenLayout ? 'relative min-h-0 flex-1' : 'relative'}>
            {mapBlock}
            {hasFilters && showMobileFilterSheet && !skipMobileFullscreenSheet ? (
              <div className="md:hidden">
                <HomeMapMobileControlsSheet
                  summary={sheetSummary}
                  onExpandedChange={setMobileSheetExpanded}
                  variant={isFullscreenLayout ? 'fullscreen' : 'default'}
                >
                  {filterControls}
                </HomeMapMobileControlsSheet>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex h-full w-full flex-col ${controlsGap}`}>
        {headerControls ? (
          <div
            onMouseDown={
              expandOnControlsClick && onRequestExpand
                ? (event) => {
                    event.preventDefault();
                    onRequestExpand();
                  }
                : undefined
            }
          >
            {headerControls}
          </div>
        ) : null}
        {regionControls}
        {serviceSummary}
        {mapBlock}
        {boundaryNotice && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {boundaryNotice}
          </p>
        )}
        {pinNotice && (
          <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
            {pinNotice}
          </p>
        )}
      </div>
    );
  }

  return mapBlock;
}
