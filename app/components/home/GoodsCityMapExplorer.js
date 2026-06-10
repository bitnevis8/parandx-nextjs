'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { API_ENDPOINTS } from '../../config/api';
import { resolveCityMapView } from '../../utils/cityMapConfig';
import { MAP_EXPLORER_MODES } from '../../utils/mapExplorerModes';
import {
  MAP_GOODS_LAYERS,
  buildMerchantMapExplorerStats,
  buildGoodsNeedMapExplorerStats,
  buildRegionLabel,
  collectMerchantMapMarkers,
  collectGoodsNeedMapMarkers,
  filterMerchantsForMap,
  filterGoodsNeedsForMap,
  findParentSlugForService,
  flattenServiceOptions,
  getMerchantMapExplorerSummaryCopy,
  getGoodsNeedMapExplorerSummaryCopy,
} from '../../utils/merchantMapUtils';
import MapGoodsLayerToolbar from './MapGoodsLayerToolbar';
import HomeCityMap from './HomeCityMap';
import HomeMapFullscreenModal from './HomeMapFullscreenModal';
import { HOME_GOODS_MAP_SHELL } from './homePageTheme';
import { GOODS_MAP_INTRO } from '../../copy/goodsPageFa';
import { useMerchantMapCategories } from '../../hooks/useMerchantMapCategories';
import { useCategoryMapModels } from '../../hooks/useCategoryMapModels';
import { ensureModelViewerLoaded } from '../../utils/mapGlbMarkerUi';
import { loadCityBoundaryData, cityHasBoundaryMap } from '../../utils/loadCityBoundary';
import MapBoundaryRegionFilters from '../map/MapBoundaryRegionFilters';

const MapGoodsCategoryPanel = dynamic(() => import('../map/MapGoodsCategoryPanel'), { ssr: false });

function buildGoodsMobileSheetSummary({
  serviceTitle,
  parentTitle,
  regionLabel,
  cityName,
  mapLayer,
  needsMineOnly,
  hasCategories,
}) {
  const parts = [];
  const categoryLabel = serviceTitle || parentTitle || 'همه دسته‌ها';
  parts.push(categoryLabel);
  if (regionLabel) parts.push(regionLabel);
  if (mapLayer === MAP_GOODS_LAYERS.needs && hasCategories) {
    parts.push(needsMineOnly ? 'نیازهای دسته من' : 'همه نیازها');
  } else {
    parts.push(mapLayer === MAP_GOODS_LAYERS.needs ? 'نیازهای کالا' : 'فروشگاه‌ها');
  }
  if (parts.length > 1) return parts.join(' · ');
  return cityName ? cityName : 'نقشه';
}

export default function GoodsCityMapExplorer({
  city,
  categories = [],
  connectBelow = false,
  sectionId = 'home-path-map',
  enableMerchantGlbMarkers = false,
}) {
  const mapInstanceRef = useRef(null);

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
  const [merchants, setMerchants] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [loadingNeeds, setLoadingNeeds] = useState(false);
  const [mapLayer, setMapLayer] = useState(MAP_GOODS_LAYERS.merchants);
  const [needsMineOnly, setNeedsMineOnly] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [show3D, setShow3D] = useState(() => cityMapView?.show3D ?? true);
  const [mapRecenterKey, setMapRecenterKey] = useState(0);
  const [map3DApplyKey, setMap3DApplyKey] = useState(0);
  const [boundaryData, setBoundaryData] = useState(null);

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

  const services = useMemo(() => flattenServiceOptions(categories), [categories]);

  const {
    slugs: merchantCategorySlugs,
    hasCategories,
    loading: merchantCategoriesLoading,
    isLoggedInMerchant,
  } = useMerchantMapCategories();

  const { registry: mapModelRegistry } = useCategoryMapModels('goods');

  useEffect(() => {
    if (!enableMerchantGlbMarkers) return;
    ensureModelViewerLoaded();
  }, [enableMerchantGlbMarkers]);

  const handleMapLayerChange = useCallback(
    (layer) => {
      setMapLayer(layer);
      if (layer === MAP_GOODS_LAYERS.needs && hasCategories) {
        setNeedsMineOnly(true);
      }
    },
    [hasCategories]
  );

  const handleParentChange = useCallback((slug) => {
    setParentSlug(slug || '');
    setServiceSlug('');
    if (slug) setNeedsMineOnly(false);
  }, []);

  const handleServiceChange = useCallback((slug) => {
    setServiceSlug(slug || '');
    if (slug) setNeedsMineOnly(false);
  }, []);

  const showOnlyMyCategories = useMemo(
    () =>
      mapLayer === MAP_GOODS_LAYERS.needs &&
      needsMineOnly &&
      hasCategories &&
      !serviceSlug &&
      !parentSlug,
    [mapLayer, needsMineOnly, hasCategories, serviceSlug, parentSlug]
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
      setNeedsMineOnly(false);
    }
    if (mapService) {
      setServiceSlug(mapService);
      setNeedsMineOnly(false);
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
    if (!city?.slug || !cityHasBoundaryMap(city)) {
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
  }, [city?.slug, city?.id]);

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

  const regionValue = useMemo(
    () => ({
      sectionId: region.sectionId,
      neighborhoodId: region.neighborhoodId,
    }),
    [region.sectionId, region.neighborhoodId]
  );

  const goodsRegionFilters = useMemo(
    () =>
      boundaryData ? (
        <MapBoundaryRegionFilters
          data={boundaryData}
          cityName={city?.name || 'شهر'}
          sectionId={region.sectionId}
          neighborhoodId={region.neighborhoodId}
          onSectionChange={handlePlacesSectionChange}
          onNeighborhoodChange={handlePlacesNeighborhoodChange}
          layout="row"
          mapToolbar
        />
      ) : null,
    [
      boundaryData,
      city?.name,
      region.sectionId,
      region.neighborhoodId,
      handlePlacesSectionChange,
      handlePlacesNeighborhoodChange,
    ]
  );

  useEffect(() => {
    if (!serviceSlug || parentSlug) return;
    const inferred = findParentSlugForService(categories, serviceSlug);
    if (inferred) setParentSlug(inferred);
  }, [serviceSlug, parentSlug, categories]);

  useEffect(() => {
    if (!city?.id) {
      setMerchants([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingMerchants(true);

    fetch(API_ENDPOINTS.merchants.getForMap(city.id, 200, serviceSlug || undefined))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setMerchants(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setMerchants([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMerchants(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceSlug, city?.id]);

  useEffect(() => {
    if (!city?.id) {
      setNeeds([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingNeeds(true);

    fetch(API_ENDPOINTS.requests.getForMap(city.id, 200, 'goods'))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setNeeds(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setNeeds([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingNeeds(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city?.id]);

  const filteredMerchants = useMemo(
    () =>
      filterMerchantsForMap(merchants, {
        categorySlug: serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
        citySlug: city?.slug,
        mapCityId: city?.id,
      }),
    [
      merchants,
      serviceSlug,
      parentSlug,
      categories,
      region.sectionId,
      region.neighborhoodId,
      city?.slug,
    ]
  );

  const filteredNeeds = useMemo(
    () =>
      filterGoodsNeedsForMap(needs, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
        expertSpecializationSlugs: merchantCategorySlugs,
        showOnlyMySpecializations: showOnlyMyCategories,
      }),
    [
      needs,
      serviceSlug,
      parentSlug,
      categories,
      region.sectionId,
      region.neighborhoodId,
      merchantCategorySlugs,
      showOnlyMyCategories,
    ]
  );

  const merchantMarkers = useMemo(
    () =>
      collectMerchantMapMarkers(filteredMerchants, {
        citySlug: city?.slug,
        mapCityId: city?.id,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
        categorySlug: serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
        includeGlbModels: enableMerchantGlbMarkers,
        mapModelRegistry,
      }),
    [
      filteredMerchants,
      city?.slug,
      city?.id,
      region.sectionId,
      region.neighborhoodId,
      serviceSlug,
      parentSlug,
      categories,
      enableMerchantGlbMarkers,
      mapModelRegistry,
    ]
  );

  const needMarkers = useMemo(
    () =>
      collectGoodsNeedMapMarkers(filteredNeeds, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
      }),
    [filteredNeeds, serviceSlug, parentSlug, categories]
  );

  const merchantStats = useMemo(
    () => buildMerchantMapExplorerStats(filteredMerchants, merchantMarkers),
    [filteredMerchants, merchantMarkers]
  );

  const needStats = useMemo(
    () => buildGoodsNeedMapExplorerStats(filteredNeeds, needMarkers),
    [filteredNeeds, needMarkers]
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
    if (mapLayer === MAP_GOODS_LAYERS.needs && showOnlyMyCategories) return 'mine';
    if (serviceSlug) return 'service';
    if (parentSlug) return 'parent';
    return 'all';
  }, [mapLayer, showOnlyMyCategories, serviceSlug, parentSlug]);

  const summaryCopy = useMemo(() => {
    if (mapLayer === MAP_GOODS_LAYERS.needs) {
      return getGoodsNeedMapExplorerSummaryCopy({
        stats: needStats,
        loading: loadingNeeds,
        filterMode,
      });
    }

    return getMerchantMapExplorerSummaryCopy({
      stats: merchantStats,
      loading: loadingMerchants,
      filterMode,
    });
  }, [
    mapLayer,
    filterMode,
    merchantStats,
    needStats,
    loadingMerchants,
    loadingNeeds,
  ]);

  const panelLayerToolbar = useMemo(
    () => (
      <MapGoodsLayerToolbar
        layer={mapLayer}
        onLayerChange={handleMapLayerChange}
        showNeedScope={isLoggedInMerchant && hasCategories}
        needsMineOnly={needsMineOnly}
        onNeedsMineOnlyChange={setNeedsMineOnly}
        needScopeLoading={merchantCategoriesLoading}
      />
    ),
    [
      mapLayer,
      handleMapLayerChange,
      isLoggedInMerchant,
      hasCategories,
      needsMineOnly,
      merchantCategoriesLoading,
    ]
  );

  const mobileSheetSummary = useMemo(
    () =>
      buildGoodsMobileSheetSummary({
        serviceTitle,
        parentTitle,
        regionLabel,
        cityName: city?.name,
        mapLayer,
        needsMineOnly,
        hasCategories,
      }),
    [
      serviceTitle,
      parentTitle,
      regionLabel,
      city?.name,
      mapLayer,
      needsMineOnly,
      hasCategories,
    ]
  );

  const categoryPanelProps = useMemo(
    () => ({
      categories,
      parentSlug,
      serviceSlug,
      onParentChange: handleParentChange,
      onServiceChange: handleServiceChange,
      statusDetail: '',
      position: 'aboveMap',
      showSearch: true,
      flushTop: true,
      layerToolbar: panelLayerToolbar,
      regionFilters: goodsRegionFilters,
    }),
    [
      categories,
      parentSlug,
      serviceSlug,
      handleParentChange,
      handleServiceChange,
      panelLayerToolbar,
      goodsRegionFilters,
    ]
  );

  const mapProps = {
    city,
    expertMarkers: mapLayer === MAP_GOODS_LAYERS.merchants ? merchantMarkers : [],
    requestMarkers: mapLayer === MAP_GOODS_LAYERS.needs ? needMarkers : [],
    merchantGlbMarkers: enableMerchantGlbMarkers,
    layerToolbar: null,
    mapExplorerSummaryCopy: summaryCopy,
    mapLayer,
    onRegionChange: handleRegionChange,
    regionValue,
    skipDesktopFilterBar: true,
    showBoundaries,
    onShowBoundariesChange: setShowBoundaries,
    show3D,
    onSelect2D: handleSelect2D,
    onSelect3D: handleSelect3D,
    mapRecenterKey,
    map3DApplyKey,
    showMapSettingsBar: false,
    mapSettingsOverlay: true,
    showWalkExplorer: true,
    explorerMode: MAP_EXPLORER_MODES.work,
    placeSearchControl: null,
    placeSearchEnabled: false,
    placesRegionControls: null,
    mainCategoryControl: null,
    subCategoryControl: null,
    mobileCategoryControls: null,
    serviceSummary: null,
    mobileControlsSummary: mobileSheetSummary,
    onMapInstanceReady: (map) => {
      mapInstanceRef.current = map;
    },
  };

  return (
    <>
      <div
        id={sectionId}
        className={`${HOME_GOODS_MAP_SHELL}${connectBelow ? ' rounded-b-none border-b-0 shadow-none' : ''}`}
      >
        <MapGoodsCategoryPanel {...categoryPanelProps} />

        <HomeCityMap
          variant="banner"
          embedded
          mapHeightPreset="goods"
          expandOnInteract={false}
          onRequestExpand={openMapFullscreen}
          expandHint={{
            label: GOODS_MAP_INTRO.expandHint,
            ariaLabel: GOODS_MAP_INTRO.expandHintAria,
          }}
          {...mapProps}
        />
      </div>

      <HomeMapFullscreenModal
        isOpen={mapFullscreenOpen}
        onClose={closeMapFullscreen}
        title={city?.name ? `نقشه ${city.name}` : 'نقشه بازار کالا'}
      >
        <div className="flex h-full min-h-0 flex-col">
          <MapGoodsCategoryPanel {...categoryPanelProps} compact />
          <div className="min-h-0 flex-1">
            <HomeCityMap
              variant="fullscreen"
              mapResizeTrigger={mapFullscreenOpen ? mapFullscreenKey : null}
              {...mapProps}
            />
          </div>
        </div>
      </HomeMapFullscreenModal>
    </>
  );
}
