'use client';

import { MAP_GOODS_LAYERS } from '../../utils/merchantMapUtils';
import MapGoodsLayerToggle from './MapGoodsLayerToggle';
import MapGoodsNeedScopeToggle from './MapGoodsNeedScopeToggle';

export default function MapGoodsLayerToolbar({
  layer = MAP_GOODS_LAYERS.merchants,
  onLayerChange,
  showNeedScope = false,
  needsMineOnly = true,
  onNeedsMineOnlyChange,
  needScopeLoading = false,
  stretch = false,
  variant = 'default',
}) {
  const showScope = showNeedScope && layer === MAP_GOODS_LAYERS.needs;
  const isMobileBanner = variant === 'mobileBanner';

  return (
    <div className={`flex w-full ${isMobileBanner ? 'flex-col gap-2' : 'items-center gap-2'}`}>
      <div className={isMobileBanner ? 'w-full' : 'min-w-0 flex-1'}>
        <MapGoodsLayerToggle
          compact={!isMobileBanner}
          stretch={stretch && !isMobileBanner}
          value={layer}
          onChange={onLayerChange}
        />
      </div>
      {showScope ? (
        <MapGoodsNeedScopeToggle
          compact
          fullWidth={isMobileBanner}
          mineOnly={needsMineOnly}
          onChange={onNeedsMineOnlyChange}
          disabled={needScopeLoading}
        />
      ) : null}
    </div>
  );
}
