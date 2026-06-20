'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { resolveCityMapView } from '../../utils/cityMapConfig';
import { MAP_EXPLORER_MODES } from '../../utils/mapExplorerModes';
import {
  buildMapExplorerStats,
  buildRegionLabel,
  collectExpertMapMarkers,
  filterExpertsForMap,
  findParentSlugForService,
  flattenServiceOptions,
  getMapExplorerSummaryCopy,
} from '../../utils/expertMapUtils';
import {
  MAP_LAYERS,
  buildRequestMapExplorerStats,
  collectRequestMapMarkers,
  filterRequestsForMap,
  getRequestMapExplorerSummaryCopy,
} from '../../utils/requestMapUtils';
import MapLayerToolbar from './MapLayerToolbar';
import { MapProfessionSearchSelect } from './MapCategoryFilterFields';
import HomeCityMap from './HomeCityMap';
import HomeMapFullscreenModal from './HomeMapFullscreenModal';
import HomeMapBannerChrome from './HomeMapBannerChrome';
import { MAP_INTRO, buildMapSpecialtyTitle } from '../../copy/friendlyFa';
import { HOME_CARD_SHELL } from './homePageTheme';
import { useExpertMapSpecializations } from '../../hooks/useExpertMapSpecializations';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';

function buildMobileSheetSummary({
  serviceTitle,
  parentTitle,
  regionLabel,
  cityName,
  mapLayer,
  requestsMineOnly,
  hasSpecializations,
}) {
  const parts = [];
  const categoryLabel = serviceTitle || parentTitle || 'همه دسته‌ها';
  parts.push(categoryLabel);
  if (regionLabel) parts.push(regionLabel);
  if (mapLayer === MAP_LAYERS.requests && hasSpecializations) {
    parts.push(requestsMineOnly ? 'کارهای تخصص من' : 'همه کارها');
  } else {
    parts.push(mapLayer === MAP_LAYERS.requests ? 'کارها' : 'متخصص‌ها');
  }
  if (parts.length > 1) return parts.join(' · ');
  return cityName ? cityName : 'نقشه';
}

export default function HomeCityMapExplorer({ city, categories = [], connectBelow = false }) {
  const mapInstanceRef = useRef(null);
  const isMobile = useIsMobileViewport();

  const cityMapView = useMemo(() => resolveCityMapView(city), [
    city?.id,
    city?.mapShow3D,
    city?.defaultSectionId,
    city?.defaultNeighborhoodId,
  ]);

  const [parentSlug, setParentSlug] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [mapFullscreenOpen, setMapFullscreenOpen] = useState(false);
  const [mapFullscreenKey, setMapFullscreenKey] = useState(0);
  const [region, setRegion] = useState(() => ({
    sectionId: cityMapView?.defaultRegion?.sectionId || '',
    neighborhoodId: cityMapView?.defaultRegion?.neighborhoodId || '',
    sectionName: '',
    neighborhoodName: '',
  }));
  const [experts, setExperts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingExperts, setLoadingExperts] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [mapLayer, setMapLayer] = useState(MAP_LAYERS.experts);
  const [requestsMineOnly, setRequestsMineOnly] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [show3D, setShow3D] = useState(() => cityMapView?.show3D ?? true);
  const [mapRecenterKey, setMapRecenterKey] = useState(0);
  const [map3DApplyKey, setMap3DApplyKey] = useState(0);

  const handleSelect2D = useCallback(() => {
    setShow3D(false);
    setMapRecenterKey((key) => key + 1);
  }, []);

  const handleSelect3D = useCallback(() => {
    setShow3D(true);
    setMap3DApplyKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!city) return;
    const view = resolveCityMapView(city);
    setShow3D(view?.show3D ?? true);
    if (view?.useConfiguredView && view?.center) {
      setMapRecenterKey((key) => key + 1);
      if (view.show3D) setMap3DApplyKey((key) => key + 1);
    }
    setRegion((prev) => ({
      ...prev,
      sectionId: view?.defaultRegion?.sectionId || '',
      neighborhoodId: view?.defaultRegion?.neighborhoodId || '',
      sectionName: '',
      neighborhoodName: '',
    }));
  }, [
    city?.id,
    city?.defaultSectionId,
    city?.defaultNeighborhoodId,
    city?.mapShow3D,
    city?.mapUseConfiguredView,
    city?.latitude,
    city?.longitude,
    city?.mapZoom,
    city?.mapZoomMobile,
    city?.mapPitch,
    city?.mapBearing,
  ]);

  const services = useMemo(() => flattenServiceOptions(categories), [categories]);

  const {
    slugs: expertSpecializationSlugs,
    hasSpecializations,
    loading: expertSpecsLoading,
    isLoggedInExpert,
  } = useExpertMapSpecializations();

  const handleMapLayerChange = useCallback(
    (layer) => {
      setMapLayer(layer);
      if (layer === MAP_LAYERS.requests && hasSpecializations) {
        setRequestsMineOnly(true);
      }
    },
    [hasSpecializations]
  );

  const handleParentChange = useCallback((slug) => {
    setParentSlug(slug || '');
    setServiceSlug('');
    if (slug) setRequestsMineOnly(false);
  }, []);

  const handleServiceChange = useCallback((slug) => {
    setServiceSlug(slug || '');
    if (slug) setRequestsMineOnly(false);
  }, []);

  const showOnlyMySpecializations = useMemo(
    () =>
      mapLayer === MAP_LAYERS.requests &&
      requestsMineOnly &&
      hasSpecializations &&
      !serviceSlug &&
      !parentSlug,
    [mapLayer, requestsMineOnly, hasSpecializations, serviceSlug, parentSlug]
  );

  const openMapFullscreen = useCallback(() => {
    setMapFullscreenOpen(true);
    setMapFullscreenKey((key) => key + 1);
  }, []);
  const closeMapFullscreen = useCallback(() => setMapFullscreenOpen(false), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const mapParent = params.get('mapParent');
    const mapService = params.get('mapService');
    if (mapParent) {
      setParentSlug(mapParent);
      setRequestsMineOnly(false);
    }
    if (mapService) {
      setServiceSlug(mapService);
      setRequestsMineOnly(false);
    }
  }, []);

  const handleRegionChange = useCallback((next) => {
    setRegion({
      sectionId: next.sectionId || '',
      neighborhoodId: next.neighborhoodId || '',
      sectionName: next.sectionName || '',
      neighborhoodName: next.neighborhoodName || '',
    });
  }, []);

  useEffect(() => {
    if (!serviceSlug || parentSlug) return;
    const inferred = findParentSlugForService(categories, serviceSlug);
    if (inferred) setParentSlug(inferred);
  }, [serviceSlug, parentSlug, categories]);

  useEffect(() => {
    if (!city?.id) {
      setExperts([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingExperts(true);

    const params = new URLSearchParams({
      limit: '200',
    });
    params.set('cityId', String(city.id));
    if (serviceSlug) params.set('category', serviceSlug);

    fetch(`${API_ENDPOINTS.experts.base}?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setExperts(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setExperts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingExperts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceSlug, city?.id]);

  useEffect(() => {
    if (!city?.id) {
      setRequests([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingRequests(true);

    fetch(API_ENDPOINTS.requests.getForMap(city.id, 200))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setRequests(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setRequests([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRequests(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city?.id]);

  const filteredExperts = useMemo(
    () =>
      filterExpertsForMap(experts, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
        citySlug: city?.slug,
        mapCityId: city?.id,
      }),
    [
      experts,
      serviceSlug,
      parentSlug,
      categories,
      region.sectionId,
      region.neighborhoodId,
      city?.slug,
      city?.id,
    ]
  );

  const filteredRequests = useMemo(
    () =>
      filterRequestsForMap(requests, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
        expertSpecializationSlugs,
        showOnlyMySpecializations,
      }),
    [
      requests,
      serviceSlug,
      parentSlug,
      categories,
      region.sectionId,
      region.neighborhoodId,
      expertSpecializationSlugs,
      showOnlyMySpecializations,
    ]
  );

  const expertMarkers = useMemo(
    () =>
      collectExpertMapMarkers(filteredExperts, {
        citySlug: city?.slug,
        mapCityId: city?.id,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
      }),
    [
      filteredExperts,
      city?.slug,
      region.sectionId,
      region.neighborhoodId,
      serviceSlug,
      parentSlug,
      categories,
    ]
  );

  const requestMarkers = useMemo(
    () =>
      collectRequestMapMarkers(filteredRequests, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
      }),
    [filteredRequests, serviceSlug, parentSlug, categories]
  );

  const expertStats = useMemo(
    () => buildMapExplorerStats(filteredExperts, expertMarkers),
    [filteredExperts, expertMarkers]
  );

  const requestStats = useMemo(
    () => buildRequestMapExplorerStats(filteredRequests, requestMarkers),
    [filteredRequests, requestMarkers]
  );

  const regionLabel = buildRegionLabel({
    cityName: city?.name,
    sectionName: region.sectionName,
    neighborhoodName: region.neighborhoodName,
    sectionId: region.sectionId,
    neighborhoodId: region.neighborhoodId,
  });

  const serviceTitle = services.find((s) => s.slug === serviceSlug)?.title;
  const parentTitle = categories.find((c) => c.slug === parentSlug)?.title;
  const filterMode = useMemo(() => {
    if (mapLayer === MAP_LAYERS.requests && showOnlyMySpecializations) return 'mine';
    if (serviceSlug) return 'service';
    if (parentSlug) return 'parent';
    return 'all';
  }, [mapLayer, showOnlyMySpecializations, serviceSlug, parentSlug]);

  const summaryCopy = useMemo(() => {
    if (mapLayer === MAP_LAYERS.requests) {
      return getRequestMapExplorerSummaryCopy({
        stats: requestStats,
        loading: loadingRequests,
        filterMode,
      });
    }

    return getMapExplorerSummaryCopy({
      stats: expertStats,
      loading: loadingExperts,
      filterMode,
    });
  }, [
    mapLayer,
    filterMode,
    expertStats,
    requestStats,
    loadingExperts,
    loadingRequests,
  ]);

  const layerToolbar = (
    <MapLayerToolbar
      stretch
      layer={mapLayer}
      onLayerChange={handleMapLayerChange}
      showRequestScope={isLoggedInExpert && hasSpecializations}
      requestsMineOnly={requestsMineOnly}
      onRequestsMineOnlyChange={setRequestsMineOnly}
      requestScopeLoading={expertSpecsLoading}
    />
  );

  const mobileBannerLayerToolbar = (
    <MapLayerToolbar
      variant="mobileBanner"
      layer={mapLayer}
      onLayerChange={handleMapLayerChange}
      showRequestScope={isLoggedInExpert && hasSpecializations}
      requestsMineOnly={requestsMineOnly}
      onRequestsMineOnlyChange={setRequestsMineOnly}
      requestScopeLoading={expertSpecsLoading}
    />
  );

  const mobileSheetSummary = useMemo(
    () =>
      buildMobileSheetSummary({
        serviceTitle,
        parentTitle,
        regionLabel,
        cityName: city?.name,
        mapLayer,
        requestsMineOnly,
        hasSpecializations,
      }),
    [
      serviceTitle,
      parentTitle,
      regionLabel,
      city?.name,
      mapLayer,
      requestsMineOnly,
      hasSpecializations,
    ]
  );

  const categoryFilterProps = {
    categories,
    parentSlug,
    serviceSlug,
    onParentChange: handleParentChange,
    onServiceChange: handleServiceChange,
    mapToolbar: true,
  };

  const bannerProfessionSearch = (
    <MapProfessionSearchSelect {...categoryFilterProps} size="md" />
  );

  const modalProfessionSearch = (
    <MapProfessionSearchSelect
      {...categoryFilterProps}
      size="lg"
      mobileTopPicker
      inputId="map-profession-search-modal"
    />
  );

  const bannerProfessionSearchCorner = (
    <MapProfessionSearchSelect {...categoryFilterProps} mapGlassCorner />
  );

  const mapProps = {
    city,
    expertMarkers: mapLayer === MAP_LAYERS.experts ? expertMarkers : [],
    requestMarkers: mapLayer === MAP_LAYERS.requests ? requestMarkers : [],
    layerToolbar,
    mapExplorerSummaryCopy: summaryCopy,
    mapLayer,
    onRegionChange: handleRegionChange,
    showBoundaries,
    onShowBoundariesChange: setShowBoundaries,
    show3D,
    onSelect2D: handleSelect2D,
    onSelect3D: handleSelect3D,
    mapRecenterKey,
    map3DApplyKey,
    showMapSettingsBar: false,
    explorerMode: MAP_EXPLORER_MODES.work,
    placeSearchControl: null,
    placeSearchEnabled: false,
    placesRegionControls: null,
    mapCornerCategoryControl: bannerProfessionSearchCorner,
    onMapInstanceReady: (map) => {
      mapInstanceRef.current = map;
    },
    expandHint: {
      label: MAP_INTRO.mobileExpandHint,
      ariaLabel: MAP_INTRO.mobileExpandHintAria,
      mobileOnly: false,
    },
  };

  const categoryProps = {
    mainCategoryControl: bannerProfessionSearch,
    subCategoryControl: null,
    mobileCategoryControls: null,
    serviceSummary: null,
    mobileControlsSummary: mobileSheetSummary,
  };

  const modalCategoryProps = {
    mainCategoryControl: modalProfessionSearch,
    subCategoryControl: null,
    mobileCategoryControls: null,
    serviceSummary: null,
    mobileControlsSummary: mobileSheetSummary,
  };

  const mapSpecialtyTitle = buildMapSpecialtyTitle(city?.name);

  return (
    <>
      <div
        id="home-path-map"
        className={`${HOME_CARD_SHELL}${connectBelow ? ' rounded-b-none border-b-0 shadow-none' : ''}`}
      >
        <HomeMapBannerChrome
          title={mapSpecialtyTitle}
          layerToolbar={isMobile ? null : layerToolbar}
        />
        <HomeCityMap
          variant="banner"
          embedded
          expandOnInteract={false}
          onRequestExpand={openMapFullscreen}
          skipDesktopFilterBar
          {...categoryProps}
          {...mapProps}
          layerToolbar={isMobile ? mobileBannerLayerToolbar : null}
        />
      </div>

      <HomeMapFullscreenModal
        isOpen={mapFullscreenOpen}
        onClose={closeMapFullscreen}
        title={mapSpecialtyTitle}
        headerExtra={isMobile ? modalProfessionSearch : null}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-1">
            <HomeCityMap
              variant="fullscreen"
              skipDesktopFilterBar
              mapResizeTrigger={mapFullscreenOpen ? mapFullscreenKey : null}
              {...modalCategoryProps}
              {...mapProps}
              layerToolbar={isMobile ? mobileBannerLayerToolbar : layerToolbar}
            />
          </div>
        </div>
      </HomeMapFullscreenModal>
    </>
  );
}
