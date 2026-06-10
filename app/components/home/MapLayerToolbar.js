'use client';

import { MAP_LAYERS } from '../../utils/requestMapUtils';
import MapLayerToggle from './MapLayerToggle';
import MapRequestScopeToggle from './MapRequestScopeToggle';

export default function MapLayerToolbar({
  layer = MAP_LAYERS.experts,
  onLayerChange,
  showRequestScope = false,
  requestsMineOnly = true,
  onRequestsMineOnlyChange,
  requestScopeLoading = false,
  stretch = false,
}) {
  const showScope = showRequestScope && layer === MAP_LAYERS.requests;

  return (
    <div className="flex w-full items-center gap-2">
      <div className="min-w-0 flex-1">
        <MapLayerToggle compact stretch={stretch} value={layer} onChange={onLayerChange} />
      </div>
      {showScope ? (
        <MapRequestScopeToggle
          compact
          mineOnly={requestsMineOnly}
          onChange={onRequestsMineOnlyChange}
          disabled={requestScopeLoading}
        />
      ) : null}
    </div>
  );
}
