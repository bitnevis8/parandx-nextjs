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
  variant = 'default',
}) {
  const showScope = showRequestScope && layer === MAP_LAYERS.requests;
  const isMobileBanner = variant === 'mobileBanner';

  return (
    <div className={`flex w-full ${isMobileBanner ? 'flex-col gap-2' : 'items-center gap-2'}`}>
      <div className={isMobileBanner ? 'w-full' : 'min-w-0 flex-1'}>
        <MapLayerToggle
          compact={!isMobileBanner}
          stretch={stretch && !isMobileBanner}
          variant={variant}
          value={layer}
          onChange={onLayerChange}
        />
      </div>
      {showScope ? (
        <MapRequestScopeToggle
          compact
          fullWidth={isMobileBanner}
          mineOnly={requestsMineOnly}
          onChange={onRequestsMineOnlyChange}
          disabled={requestScopeLoading}
        />
      ) : null}
    </div>
  );
}
