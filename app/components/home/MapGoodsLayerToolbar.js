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
}) {
  const showScope = showNeedScope && layer === MAP_GOODS_LAYERS.needs;

  return (
    <div className="flex w-full items-center gap-2">
      <div className="min-w-0 flex-1">
        <MapGoodsLayerToggle compact stretch={stretch} value={layer} onChange={onLayerChange} />
      </div>
      {showScope ? (
        <MapGoodsNeedScopeToggle
          compact
          mineOnly={needsMineOnly}
          onChange={onNeedsMineOnlyChange}
          disabled={needScopeLoading}
        />
      ) : null}
    </div>
  );
}
