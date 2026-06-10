'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { API_ENDPOINTS } from '../../config/api';
import { resolveCityMapConfig, resolveCityMapView } from '../../utils/cityMapConfig';
import { loadCityBoundaryData, cityHasBoundaryMap } from '../../utils/loadCityBoundary';
import MapBoundaryRegionFilters, {
  resolveRegionSearchBoundary,
  resolveRegionSearchCenter,
} from '../map/MapBoundaryRegionFilters';
import { MAP_EXPLORER_MODES, isPlacesExplorerMode } from '../../utils/mapExplorerModes';
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
import MapCategoryFilterFields, {
  MapMainCategorySelect,
  MapSubcategorySelect,
} from './MapCategoryFilterFields';
import HomeCityMap from './HomeCityMap';
import HomeMapFullscreenModal from './HomeMapFullscreenModal';
import HomeMapExplorerIntro from './HomeMapExplorerIntro';
import HomeMapExplorerTabs from './HomeMapExplorerTabs';
import { HOME_CARD_SHELL } from './homePageTheme';
import { useExpertMapSpecializations } from '../../hooks/useExpertMapSpecializations';

const MapPlaceCategoryPanel = dynamic(() => import('../map/MapPlaceCategoryPanel'), { ssr: false });

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
    parts.push(mapLayer === MAP_LAYERS.requests ? 'کارها' : 'متخصصین');
  }
  if (parts.length > 1) return parts.join(' · ');
  return cityName ? cityName : 'نقشه';
}

export default function HomeCityMapExplorer({ city, categories = [], connectBelow = false }) {
  const mapInstanceRef = useRef(null);
  const cityMapConfig = useMemo(
    () => resolveCityMapConfig(city),
    [city?.id, city?.slug, city?.name, city?.latitude, city?.longitude, city?.mapZoom]
  );

  const [explorerMode, setExplorerMode] = useState(MAP_EXPLORER_MODES.work);
  const isPlacesMode = isPlacesExplorerMode(explorerMode);
  const [boundaryData, setBoundaryData] = useState(null);
  const [placesCategoryStatus, setPlacesCategoryStatus] = useState('');

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
    setRegion((prev) => ({
      ...prev,
      sectionId: view?.defaultRegion?.sectionId || '',
      neighborhoodId: view?.defaultRegion?.neighborhoodId || '',
      sectionName: '',
      neighborhoodName: '',
    }));
  }, [city?.id, city?.defaultSectionId, city?.defaultNeighborhoodId, city?.mapShow3D]);

  useEffect(() => {
    if (!isPlacesMode) {
      setPlacesCategoryStatus('');
    }
  }, [isPlacesMode]);

  useEffect(() => {
    if (!isPlacesMode || !city?.slug || !cityHasBoundaryMap(city)) {
      setBoundaryData(null);
      return undefined;
    }

    let cancelled = false;
    loadCityBoundaryData(city.slug)
      .then((data) => {
        if (!cancelled) setBoundaryData(data);
      })
      .catch(() => {
        if (!cancelled) setBoundaryData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [isPlacesMode, city?.slug, city?.id]);

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

  const handlePlacesSectionChange = useCallback(
    (sectionId) => {
      const section = boundaryData?.sections?.find((item) => item.featureId === sectionId);
      handleRegionChange({
        sectionId,
        neighborhoodId: '',
        sectionName: section?.name || '',
        neighborhoodName: '',
      });
    },
    [boundaryData?.sections, handleRegionChange]
  );

  const handlePlacesNeighborhoodChange = useCallback(
    (neighborhoodId) => {
      const section = boundaryData?.sections?.find((item) => item.featureId === region.sectionId);
      const neighborhood = section?.neighborhoods?.find((item) => item.featureId === neighborhoodId);
      handleRegionChange({
        sectionId: region.sectionId,
        neighborhoodId,
        sectionName: section?.name || region.sectionName,
        neighborhoodName: neighborhood?.name || '',
      });
    },
    [boundaryData?.sections, region.sectionId, region.sectionName, handleRegionChange]
  );

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

  const bannerMainCategory = (
    <MapMainCategorySelect {...categoryFilterProps} size="md" />
  );

  const bannerSubCategory = (
    <MapSubcategorySelect {...categoryFilterProps} size="md" />
  );

  const modalMainCategory = (
    <MapMainCategorySelect
      {...categoryFilterProps}
      size="lg"
      mobileTopPicker
      inputId="map-main-category-search-modal"
    />
  );

  const modalSubCategory = (
    <MapSubcategorySelect
      {...categoryFilterProps}
      size="lg"
      mobileTopPicker
      inputId="map-subcategory-search-modal"
    />
  );

  const bannerCategoryFiltersMobile = (
    <MapCategoryFilterFields {...categoryFilterProps} size="md" />
  );

  const modalCategoryFiltersMobile = (
    <MapCategoryFilterFields
      {...categoryFilterProps}
      size="lg"
      mobileTopPicker
      mainInputId="map-main-category-search-modal"
      subInputId="map-subcategory-search-modal"
    />
  );

  const bannerServiceSummary = null;

  const modalServiceSummary = null;

  const searchBoundaryGeometry = useMemo(
    () => resolveRegionSearchBoundary(boundaryData, region.sectionId, region.neighborhoodId),
    [boundaryData, region.sectionId, region.neighborhoodId]
  );

  const searchCenter = useMemo(
    () => resolveRegionSearchCenter(searchBoundaryGeometry, cityMapConfig?.lat, cityMapConfig?.lng),
    [searchBoundaryGeometry, cityMapConfig?.lat, cityMapConfig?.lng]
  );

  const placesRegionControls = boundaryData ? (
    <MapBoundaryRegionFilters
      data={boundaryData}
      cityName={city?.name || 'شهر'}
      sectionId={region.sectionId}
      neighborhoodId={region.neighborhoodId}
      onSectionChange={handlePlacesSectionChange}
      onNeighborhoodChange={handlePlacesNeighborhoodChange}
    />
  ) : null;

  const placesSummaryCopy = useMemo(
    () => ({
      title: city?.name ? `مراکز و اماکن ${city.name}` : 'مراکز و اماکن',
      detail:
        placesCategoryStatus ||
        'دسته را انتخاب کنید، روی نقشه ببینید — یا از جستجو استفاده کنید.',
      tone: 'muted',
    }),
    [city?.name, placesCategoryStatus]
  );

  const placeCategoryPanelProps = useMemo(
    () => ({
      mapRef: mapInstanceRef,
      cityName: city?.name || '',
      centerLat: searchCenter.lat,
      centerLng: searchCenter.lng,
      boundaryGeometry: searchBoundaryGeometry,
      markerEngine: 'maplibre',
      regionKey: `${region.sectionId}-${region.neighborhoodId}`,
      onStatusChange: setPlacesCategoryStatus,
    }),
    [
      city?.name,
      searchCenter.lat,
      searchCenter.lng,
      searchBoundaryGeometry,
      region.sectionId,
      region.neighborhoodId,
    ]
  );

  const workMapProps = {
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
    showMapSettingsBar: true,
    explorerMode: MAP_EXPLORER_MODES.work,
    placeSearchControl: null,
    placeSearchEnabled: false,
    placesRegionControls: null,
    onMapInstanceReady: (map) => {
      mapInstanceRef.current = map;
    },
  };

  const placesMapProps = {
    city,
    expertMarkers: [],
    requestMarkers: [],
    layerToolbar: null,
    mapExplorerSummaryCopy: placesSummaryCopy,
    mapLayer: null,
    onRegionChange: handleRegionChange,
    showBoundaries,
    onShowBoundariesChange: setShowBoundaries,
    show3D,
    onSelect2D: handleSelect2D,
    onSelect3D: handleSelect3D,
    mapRecenterKey,
    map3DApplyKey,
    showMapSettingsBar: true,
    explorerMode: MAP_EXPLORER_MODES.places,
    placeSearchControl: null,
    placeSearchEnabled: true,
    placesRegionControls: null,
    onMapInstanceReady: (map) => {
      mapInstanceRef.current = map;
    },
  };

  const placesMobileSummary = useMemo(
    () =>
      buildRegionLabel({
        cityName: city?.name,
        sectionName: region.sectionName,
        neighborhoodName: region.neighborhoodName,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
      }),
    [
      city?.name,
      region.sectionName,
      region.neighborhoodName,
      region.sectionId,
      region.neighborhoodId,
    ]
  );

  const activeMapProps = isPlacesMode ? placesMapProps : workMapProps;

  const bannerCategoryProps = isPlacesMode
    ? {
        mainCategoryControl: null,
        subCategoryControl: null,
        mobileCategoryControls: null,
        serviceSummary: null,
        mobileControlsSummary: placesMobileSummary,
      }
    : {
        mainCategoryControl: bannerMainCategory,
        subCategoryControl: bannerSubCategory,
        mobileCategoryControls: bannerCategoryFiltersMobile,
        serviceSummary: bannerServiceSummary,
        mobileControlsSummary: mobileSheetSummary,
      };

  const modalCategoryProps = isPlacesMode
    ? {
        mainCategoryControl: null,
        subCategoryControl: null,
        mobileCategoryControls: null,
        serviceSummary: null,
        mobileControlsSummary: placesMobileSummary,
      }
    : {
        mainCategoryControl: modalMainCategory,
        subCategoryControl: modalSubCategory,
        mobileCategoryControls: modalCategoryFiltersMobile,
        serviceSummary: modalServiceSummary,
        mobileControlsSummary: mobileSheetSummary,
      };

  return (
    <>
      <div
        id="home-path-map"
        className={`${HOME_CARD_SHELL}${connectBelow ? ' rounded-b-none border-b-0 shadow-none' : ''}`}
      >
        <HomeMapExplorerIntro
          serviceTitle={isPlacesMode ? null : serviceTitle || parentTitle}
          onOpenMap={openMapFullscreen}
          disabled={!categories.length && !isPlacesMode}
        />

        <HomeMapExplorerTabs value={explorerMode} onChange={setExplorerMode} />

        <HomeCityMap
          variant="banner"
          embedded
          expandOnInteract={false}
          onRequestExpand={openMapFullscreen}
          {...bannerCategoryProps}
          {...activeMapProps}
        />

        {isPlacesMode ? <MapPlaceCategoryPanel {...placeCategoryPanelProps} /> : null}
      </div>

      <HomeMapFullscreenModal
        isOpen={mapFullscreenOpen}
        onClose={closeMapFullscreen}
        title={city?.name || 'نقشه'}
      >
        <div className="flex h-full min-h-0 flex-col">
          <HomeMapExplorerTabs value={explorerMode} onChange={setExplorerMode} className="shrink-0" />
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <HomeCityMap
                variant="fullscreen"
                mapResizeTrigger={mapFullscreenOpen ? mapFullscreenKey : null}
                {...modalCategoryProps}
                {...activeMapProps}
              />
            </div>
            {isPlacesMode ? (
              <MapPlaceCategoryPanel {...placeCategoryPanelProps} compact />
            ) : null}
          </div>
        </div>
      </HomeMapFullscreenModal>
    </>
  );
}
