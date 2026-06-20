'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { isPlacesExplorerMode } from '../../utils/mapExplorerModes';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';
import HomeMapDesktopFilterBar from './HomeMapDesktopFilterBar';

const BANNER_MAP_HEIGHT =
  'h-[min(64vw,18rem)] sm:h-[19rem] md:h-[21rem] lg:h-96';

const GOODS_BANNER_MAP_HEIGHT =
  'h-[min(71vw,19rem)] sm:h-[20.8rem] md:h-[22.1rem] lg:h-[24.5rem]';

const MOBILE_PREVIEW_MAP_HEIGHT = 'h-[min(88vw,26rem)]';

const GOODS_MOBILE_PREVIEW_MAP_HEIGHT = 'h-[17.2rem]';

const FULLSCREEN_MAP_HEIGHT = 'h-full min-h-[14rem]';

const MAP_HEIGHT_PRESETS = {
  default: {
    banner: BANNER_MAP_HEIGHT,
    mobilePreview: MOBILE_PREVIEW_MAP_HEIGHT,
  },
  goods: {
    banner: GOODS_BANNER_MAP_HEIGHT,
    mobilePreview: GOODS_MOBILE_PREVIEW_MAP_HEIGHT,
  },
};

function resolveMapHeightPreset(preset) {
  return MAP_HEIGHT_PRESETS[preset] || MAP_HEIGHT_PRESETS.default;
}

const mapLoadingBanner = (
  <div
    className={`w-full ${BANNER_MAP_HEIGHT} bg-gray-100 animate-pulse rounded-2xl`}
    aria-hidden
  />
);

const AhvazBoundaryMap = dynamic(() => import('./AhvazBoundaryMap'), {
  ssr: false,
  loading: () => mapLoadingBanner,
});

const MapSettingsBar = dynamic(() => import('./MapSettingsBar'), { ssr: false });

export default function HomeCityMap({
  city,
  variant = 'banner',
  embedded = false,
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
  regionValue = null,
  skipDesktopFilterBar = false,
  expandOnInteract = false,
  onRequestExpand,
  controlsLayout = 'compact',
  mapResizeTrigger = null,
  mobileControlsSummary = '',
  showBoundaries = true,
  onShowBoundariesChange = null,
  show3D = true,
  onSelect2D = null,
  onSelect3D = null,
  mapRecenterKey = 0,
  map3DApplyKey = 0,
  showMapSettingsBar = false,
  mapExplorerSummaryCopy = null,
  mapLayer = null,
  explorerMode = 'work',
  placeSearchControl = null,
  placeSearchEnabled = false,
  placesRegionControls = null,
  onMapInstanceReady = null,
  mapHeightPreset = 'default',
  expandHint = null,
  mapSettingsOverlay = false,
  showWalkExplorer = false,
  expertMarkerStyleOverride = null,
  skipMobileFullscreenSheet = false,
}) {
  const isMobile = useIsMobileViewport();
  const mapInstanceRef = useRef(null);
  const isPlacesMode = isPlacesExplorerMode(explorerMode);

  const isBanner = variant === 'banner';
  const isFullscreen = variant === 'fullscreen';
  const isEmbeddedBanner = embedded && isBanner;
  const isEmbeddedPreview = isEmbeddedBanner && !isFullscreen;
  const isMobilePreview = isEmbeddedPreview && isMobile;
  const resolvedControlsLayout = isEmbeddedBanner ? 'banner-header' : controlsLayout;
  const expandOnMapClick =
    (isMobilePreview && Boolean(onRequestExpand)) ||
    (expandOnInteract && isBanner && !embedded && Boolean(onRequestExpand));
  const expandOnControlsClick = expandOnInteract && isBanner && !embedded;
  const enableMapGestures = isFullscreen
    ? true
    : isMobilePreview
      ? false
      : !expandOnMapClick;
  const heightPreset = resolveMapHeightPreset(mapHeightPreset);
  const mapHeightClass = isFullscreen
    ? FULLSCREEN_MAP_HEIGHT
    : isMobilePreview
      ? heightPreset.mobilePreview
      : heightPreset.banner;

  if (!city) return null;

  const resolvedExpertMarkers = isPlacesMode ? [] : expertMarkers;
  const resolvedRequestMarkers = isPlacesMode ? [] : requestMarkers;
  const resolvedLayerToolbar = isPlacesMode ? null : layerToolbar;
  const resolvedLayerControl = isPlacesMode ? null : layerControl;
  const resolvedMainCategory = isPlacesMode ? null : mainCategoryControl;
  const resolvedSubCategory = isPlacesMode ? null : subCategoryControl;
  const resolvedMobileCategory = isPlacesMode ? null : mobileCategoryControls;
  const resolvedHeaderControls = isPlacesMode ? null : headerControls;
  const resolvedServiceSummary = isPlacesMode ? null : serviceSummary;
  const resolvedMobileSummary = isPlacesMode
    ? city?.name
      ? `جستجو در ${city.name}`
      : 'جستجوی مراکز'
    : mobileControlsSummary;

  const handleMapInstanceReady = (map) => {
    mapInstanceRef.current = map;
    onMapInstanceReady?.(map);
  };

  const hasMapSettingsControls =
    Boolean(onShowBoundariesChange && onSelect2D && onSelect3D);

  const mapSettingsFooter =
    isMobilePreview || (isMobile && isFullscreen) || mapSettingsOverlay
      ? null
      : showMapSettingsBar && hasMapSettingsControls ? (
          <MapSettingsBar
            showBoundaries={showBoundaries}
            onShowBoundariesChange={onShowBoundariesChange}
            show3D={show3D}
            onSelect2D={onSelect2D}
            onSelect3D={onSelect3D}
            summaryCopy={mapExplorerSummaryCopy}
            mapLayer={mapLayer}
          />
        ) : null;

  const useMapSettingsOverlay = mapSettingsOverlay && hasMapSettingsControls;

  const boundaryMap = (
    <AhvazBoundaryMap
      key={`${city.id}-${city.geoJsonUpdatedAt || 'none'}-${variant}`}
      city={city}
      className={isFullscreen ? 'h-full min-h-0' : mapHeightClass}
      controlsOutside
      controlsLayout={isFullscreen ? 'fullscreen' : resolvedControlsLayout}
      enableGestures={enableMapGestures || isPlacesMode}
      selectable={enableMapGestures || isPlacesMode}
      headerControls={resolvedHeaderControls}
      mainCategoryControl={resolvedMainCategory}
      mapCornerCategoryControl={mapCornerCategoryControl}
      subCategoryControl={resolvedSubCategory}
      mobileCategoryControls={resolvedMobileCategory}
      serviceSummary={resolvedServiceSummary}
      expertMarkers={resolvedExpertMarkers}
      requestMarkers={resolvedRequestMarkers}
      merchantGlbMarkers={merchantGlbMarkers}
      layerControl={resolvedLayerControl}
      layerToolbar={resolvedLayerToolbar}
      onRegionChange={onRegionChange}
      value={regionValue}
      skipDesktopFilterBar={skipDesktopFilterBar}
      expandOnMapClick={expandOnMapClick && !isPlacesMode}
      expandOnControlsClick={expandOnControlsClick}
      onRequestExpand={onRequestExpand}
      mapResizeTrigger={mapResizeTrigger}
      mobileControlsSummary={resolvedMobileSummary}
      showBoundaries={showBoundaries}
      onShowBoundariesChange={onShowBoundariesChange}
      show3D={show3D}
      onSelect2D={onSelect2D}
      onSelect3D={onSelect3D}
      mapRecenterKey={mapRecenterKey}
      map3DApplyKey={map3DApplyKey}
      mapFooter={mapSettingsFooter}
      mapExplorerSummaryCopy={mapExplorerSummaryCopy}
      mapLayer={isPlacesMode ? null : mapLayer}
      placeSearchControl={placeSearchControl}
      placeSearchEnabled={placeSearchEnabled}
      onMapInstanceReady={handleMapInstanceReady}
      expandHint={expandHint}
      showMapTools={useMapSettingsOverlay}
      cornerControlsLayout={useMapSettingsOverlay ? 'splitBottom' : 'corner'}
      showWalkExplorer={showWalkExplorer}
      expertMarkerStyleOverride={expertMarkerStyleOverride}
      skipMobileFullscreenSheet={skipMobileFullscreenSheet}
    />
  );

  if (isFullscreen) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col" aria-label={`نقشه ${city.name}`}>
        {boundaryMap}
      </div>
    );
  }

  if (isBanner) {
    const showPlacesFilterBar =
      isEmbeddedBanner &&
      isPlacesMode &&
      (placeSearchControl || placesRegionControls);

    if (showPlacesFilterBar) {
      return (
        <div className="w-full" aria-label={`نقشه ${city.name}`}>
          <HomeMapDesktopFilterBar
            placeSearchControl={placeSearchControl}
            regionFilters={placesRegionControls}
          />
          {boundaryMap}
        </div>
      );
    }

    const controlsBlock = headerControls || serviceSummary ? (
      <div
        className={
          isEmbeddedBanner
            ? 'flex w-full flex-col'
            : 'mb-3 flex w-full flex-col gap-2.5 sm:mb-4'
        }
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
        {serviceSummary}
      </div>
    ) : null;

    return (
      <div className="w-full" aria-label={`نقشه ${city.name}`}>
        {controlsBlock}
        {boundaryMap}
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8 px-2 max-w-3xl mx-auto w-full">
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-teal-200/60 h-44 sm:h-52 md:h-56 bg-teal-50"
        aria-label={`نقشه ${city.name}`}
      >
        {boundaryMap}
      </div>
    </div>
  );
}
