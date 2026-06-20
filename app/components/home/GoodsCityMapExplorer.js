'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdjustmentsHorizontalIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { resolveCityMapView } from '../../utils/cityMapConfig';
import { loadCityBoundaryData, cityHasBoundaryMap } from '../../utils/loadCityBoundary';
import { MAP_EXPLORER_MODES } from '../../utils/mapExplorerModes';
import { EXPERT_MARKER_STYLES } from '../../utils/mapExpertMarkerConfig';
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
  getGoodsSupplyMapExplorerSummaryCopy,
} from '../../utils/merchantMapUtils';
import MapGoodsLayerToolbar from './MapGoodsLayerToolbar';
import { MapProfessionSearchSelect } from './MapCategoryFilterFields';
import HomeCityMap from './HomeCityMap';
import HomeMapFullscreenModal from './HomeMapFullscreenModal';
import HomeMapBannerChrome from './HomeMapBannerChrome';
import MapBoundaryRegionFilters from '../map/MapBoundaryRegionFilters';
import { MapSettingToggle, MapViewModeToggle } from './MapSettingsBar';
import { buildGoodsMapSpecialtyTitle, GOODS_MAP_INTRO } from '../../copy/goodsPageFa';
import { HOME_CARD_SHELL } from './homePageTheme';
import { useMerchantMapCategories } from '../../hooks/useMerchantMapCategories';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';

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
  } else if (mapLayer === MAP_GOODS_LAYERS.supplies) {
    parts.push('عرضه‌های کالا');
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
}) {
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
  const [merchants, setMerchants] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [loadingNeeds, setLoadingNeeds] = useState(false);
  const [loadingSupplies, setLoadingSupplies] = useState(false);
  const [mapLayer, setMapLayer] = useState(MAP_GOODS_LAYERS.merchants);
  const [needsMineOnly, setNeedsMineOnly] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [show3D, setShow3D] = useState(() => cityMapView?.show3D ?? true);
  const [mapRecenterKey, setMapRecenterKey] = useState(0);
  const [map3DApplyKey, setMap3DApplyKey] = useState(0);
  const [boundaryData, setBoundaryData] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    slugs: merchantCategorySlugs,
    hasCategories,
    loading: merchantCategoriesLoading,
    isLoggedInMerchant,
  } = useMerchantMapCategories();

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

    fetch(API_ENDPOINTS.requests.getForMap(city.id, 200, 'goods', 'need'))
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

  useEffect(() => {
    if (!city?.id) {
      setSupplies([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingSupplies(true);

    fetch(API_ENDPOINTS.requests.getForMap(city.id, 200, 'goods', 'supply'))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setSupplies(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setSupplies([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSupplies(false);
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
      city?.id,
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

  const filteredSupplies = useMemo(
    () =>
      filterGoodsNeedsForMap(supplies, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
        sectionId: region.sectionId,
        neighborhoodId: region.neighborhoodId,
      }),
    [
      supplies,
      serviceSlug,
      parentSlug,
      categories,
      region.sectionId,
      region.neighborhoodId,
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

  const supplyMarkers = useMemo(
    () =>
      collectGoodsNeedMapMarkers(filteredSupplies, {
        serviceSlug,
        parentSlug: serviceSlug ? '' : parentSlug,
        categories,
      }),
    [filteredSupplies, serviceSlug, parentSlug, categories]
  );

  const merchantStats = useMemo(
    () => buildMerchantMapExplorerStats(filteredMerchants, merchantMarkers),
    [filteredMerchants, merchantMarkers]
  );

  const needStats = useMemo(
    () => buildGoodsNeedMapExplorerStats(filteredNeeds, needMarkers),
    [filteredNeeds, needMarkers]
  );

  const supplyStats = useMemo(
    () => buildGoodsNeedMapExplorerStats(filteredSupplies, supplyMarkers),
    [filteredSupplies, supplyMarkers]
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

    if (mapLayer === MAP_GOODS_LAYERS.supplies) {
      return getGoodsSupplyMapExplorerSummaryCopy({
        stats: supplyStats,
        loading: loadingSupplies,
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
    supplyStats,
    loadingMerchants,
    loadingNeeds,
    loadingSupplies,
  ]);

  const layerToolbar = (
    <MapGoodsLayerToolbar
      stretch
      layer={mapLayer}
      onLayerChange={handleMapLayerChange}
      showNeedScope={isLoggedInMerchant && hasCategories}
      needsMineOnly={needsMineOnly}
      onNeedsMineOnlyChange={setNeedsMineOnly}
      needScopeLoading={merchantCategoriesLoading}
    />
  );

  const mobileBannerLayerToolbar = (
    <MapGoodsLayerToolbar
      variant="mobileBanner"
      layer={mapLayer}
      onLayerChange={handleMapLayerChange}
      showNeedScope={isLoggedInMerchant && hasCategories}
      needsMineOnly={needsMineOnly}
      onNeedsMineOnlyChange={setNeedsMineOnly}
      needScopeLoading={merchantCategoriesLoading}
    />
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
      inputId="goods-map-profession-search-modal"
    />
  );

  const bannerProfessionSearchCorner = (
    <MapProfessionSearchSelect {...categoryFilterProps} mapGlassCorner />
  );

  const mapProps = {
    city,
    expertMarkers: mapLayer === MAP_GOODS_LAYERS.merchants ? merchantMarkers : [],
    requestMarkers:
      mapLayer === MAP_GOODS_LAYERS.needs
        ? needMarkers
        : mapLayer === MAP_GOODS_LAYERS.supplies
          ? supplyMarkers
          : [],
    layerToolbar,
    mapExplorerSummaryCopy: summaryCopy,
    mapLayer,
    onRegionChange: handleRegionChange,
    regionValue,
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
    expertMarkerStyleOverride: EXPERT_MARKER_STYLES.category,
    onMapInstanceReady: (map) => {
      mapInstanceRef.current = map;
    },
    expandHint: {
      label: GOODS_MAP_INTRO.mobileExpandHint,
      ariaLabel: GOODS_MAP_INTRO.mobileExpandHintAria,
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
    mainCategoryControl: null,
    subCategoryControl: null,
    mobileCategoryControls: null,
    serviceSummary: null,
    mobileControlsSummary: mobileSheetSummary,
  };

  const openMobileMapFilters = useCallback(() => {
    setMobileFiltersOpen((open) => !open);
  }, []);

  const mobileHeaderRegionFilters = boundaryData ? (
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
  ) : null;

  const mobileFullscreenHeader = (
    <div className="flex flex-col gap-2.5">
      {mobileBannerLayerToolbar}
      <div className="flex items-stretch gap-2">
        <div className="min-w-0 flex-1">{modalProfessionSearch}</div>
        <button
          type="button"
          onClick={openMobileMapFilters}
          aria-expanded={mobileFiltersOpen}
          className={`inline-flex h-10 shrink-0 touch-manipulation items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-sm transition active:scale-[0.98] ${
            mobileFiltersOpen
              ? 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-600 dark:bg-teal-950/80 dark:text-teal-100'
              : 'border-gray-200/90 bg-white text-teal-700 hover:border-teal-200 hover:bg-teal-50 dark:border-sky-700 dark:bg-sky-900 dark:text-teal-300 dark:hover:border-sky-600 dark:hover:bg-sky-800'
          }`}
          aria-label="فیلتر و تنظیمات نقشه"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 shrink-0" aria-hidden />
          <span>فیلتر</span>
        </button>
      </div>
      {mobileFiltersOpen ? (
        <div className="space-y-2.5 rounded-xl border border-gray-200/90 bg-gray-50/90 p-2.5 dark:border-sky-800 dark:bg-sky-900/50">
          {mobileHeaderRegionFilters}
          <div className="flex flex-wrap items-center gap-2">
            <MapViewModeToggle
              compact
              show3D={show3D}
              onSelect2D={handleSelect2D}
              onSelect3D={handleSelect3D}
            />
            <MapSettingToggle
              compact
              active={showBoundaries}
              onToggle={() => setShowBoundaries((value) => !value)}
              icon={RectangleGroupIcon}
              label="مرزها"
              ariaOn="مخفی کردن مرزها"
              ariaOff="نمایش مرزها"
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  const mapSpecialtyTitle = buildGoodsMapSpecialtyTitle(city?.name);

  return (
    <>
      <div
        id={sectionId}
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
        headerLayerToolbar={layerToolbar}
        headerExtra={mobileFullscreenHeader}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-1">
            <HomeCityMap
              variant="fullscreen"
              skipDesktopFilterBar
              skipMobileFullscreenSheet
              mapResizeTrigger={mapFullscreenOpen ? mapFullscreenKey : null}
              {...modalCategoryProps}
              {...mapProps}
              layerToolbar={null}
              mainCategoryControl={isMobile ? null : bannerProfessionSearch}
            />
          </div>
        </div>
      </HomeMapFullscreenModal>
    </>
  );
}
