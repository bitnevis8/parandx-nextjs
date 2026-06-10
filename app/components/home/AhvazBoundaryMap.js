'use client';

import AhvazAddressPicker from '../ui/AhvazAddressPicker';

export default function AhvazBoundaryMap({
  city,
  className = '',
  selectable = true,
  controlsOutside = false,
  controlsLayout = 'compact',
  enableGestures = false,
  headerControls = null,
  mainCategoryControl = null,
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
  expandOnMapClick = false,
  expandOnControlsClick = false,
  onRequestExpand,
  mapResizeTrigger = null,
  mobileControlsSummary = '',
  showBoundaries = true,
  onShowBoundariesChange = null,
  show3D = false,
  onSelect2D = null,
  onSelect3D = null,
  mapRecenterKey = 0,
  map3DApplyKey = 0,
  mapFooter = null,
  mapExplorerSummaryCopy = null,
  mapLayer = null,
  placeSearchControl = null,
  placeSearchEnabled = false,
  placesRegionControls = null,
  onMapInstanceReady = null,
  expandHint = null,
  showMapTools = false,
  cornerControlsLayout = 'corner',
  showWalkExplorer = false,
}) {
  return (
    <AhvazAddressPicker
      city={city}
      className={className}
      boundaryVariant="outline"
      autoFitBoundsOnSelect={false}
      showBoundaries={showBoundaries}
      onShowBoundariesChange={onShowBoundariesChange}
      show3D={show3D}
      onMapSelect2D={onSelect2D}
      onMapSelect3D={onSelect3D}
      mapRecenterKey={mapRecenterKey}
      map3DApplyKey={map3DApplyKey}
      mapFooter={mapFooter}
      mapExplorerSummaryCopy={mapExplorerSummaryCopy}
      mapLayer={mapLayer}
      selectable={selectable}
      controlsOutside={controlsOutside}
      controlsLayout={controlsLayout}
      enableGestures={enableGestures}
      headerControls={headerControls}
      mainCategoryControl={mainCategoryControl}
      subCategoryControl={subCategoryControl}
      mobileCategoryControls={mobileCategoryControls}
      serviceSummary={serviceSummary}
      expertMarkers={expertMarkers}
      requestMarkers={requestMarkers}
      merchantGlbMarkers={merchantGlbMarkers}
      layerControl={layerControl}
      layerToolbar={layerToolbar}
      onRegionChange={onRegionChange}
      value={regionValue}
      skipDesktopFilterBar={skipDesktopFilterBar}
      expandOnMapClick={expandOnMapClick}
      expandOnControlsClick={expandOnControlsClick}
      onRequestExpand={onRequestExpand}
      mapResizeTrigger={mapResizeTrigger}
      mobileControlsSummary={mobileControlsSummary}
      placeSearchControl={placeSearchControl}
      placeSearchEnabled={placeSearchEnabled}
      onMapInstanceReady={onMapInstanceReady}
      expandHint={expandHint}
      showMapTools={showMapTools}
      cornerControlsLayout={cornerControlsLayout}
      showWalkExplorer={showWalkExplorer}
    />
  );
}

export { buildMapAddressPayload } from '../../utils/geojsonBoundary';
