/** تنظیم ارتفاع ساختمان‌های ۳D روی نقشهٔ MapLibre / نشان */

export const PX_BUILDING_LAYER_ID = 'px-building-extrusion';
export const DEFAULT_BUILDING_COLOR = '#cfe8e2';
export const DEFAULT_BUILDING_OPACITY = 0.86;
export const DEFAULT_BUILDING_FALLBACK_HEIGHT = 12;
export const BUILDING_EXTRUSION_MIN_ZOOM = 13;
export const NESHAN_NATIVE_3D_LAYER_ID = '3d';
export const NESHAN_BUILDING_TILE_SOURCES = [
  'neshanBaseMapVectorDaySource',
  'neshanBaseMapVectorNightSource',
];

export function readTriStateBool(value, defaultValue = true) {
  if (value === false || value === 0 || value === '0' || value === 'false') return false;
  if (value === true || value === 1 || value === '1' || value === 'true') return true;
  if (value == null || value === '') return defaultValue;
  return Boolean(value);
}

export function resolveCityBuildingConfig(city) {
  const useMapDefault = readTriStateBool(city?.mapBuildingUseMapDefault, true);

  const heightRaw = Number(city?.mapBuildingDefaultHeight);
  const defaultHeight =
    Number.isFinite(heightRaw) && heightRaw > 0
      ? Math.round(heightRaw)
      : DEFAULT_BUILDING_FALLBACK_HEIGHT;

  return {
    useMapDefault,
    defaultHeight,
    color: DEFAULT_BUILDING_COLOR,
    opacity: DEFAULT_BUILDING_OPACITY,
  };
}

/** ارتفاع از OSM (پیش‌فرض نقشه — مثل پرند) */
export function buildOsmExtrusionHeightExpression() {
  return [
    'coalesce',
    ['get', 'render_height'],
    ['get', 'height'],
    ['*', ['coalesce', ['get', 'levels'], ['get', 'building:levels'], 0], 3],
    10,
  ];
}

/** ارتفاع متری با fallback شهر (مثل اهواز) */
export function buildExtrusionHeightExpression(defaultHeightMeters) {
  const fallback = Math.max(3, Math.round(defaultHeightMeters));

  return [
    'let',
    'rh',
    ['to-number', ['coalesce', ['get', 'render_height'], 0]],
    [
      'case',
      ['>', ['var', 'rh'], 0],
      ['var', 'rh'],
      [
        'let',
        'h',
        [
          'coalesce',
          ['to-number', ['get', 'height']],
          ['*', ['to-number', ['coalesce', ['get', 'levels'], ['get', 'building:levels'], 0]], 3],
          0,
        ],
        ['case', ['>', ['var', 'h'], 0], ['var', 'h'], fallback],
      ],
    ],
  ];
}

/** ارتفاع ساختمان در استایل وکتور نشان */
export function buildNeshanExtrusionHeightExpression(defaultHeightMeters, useMapDefault = true) {
  const fallback = useMapDefault ? 10 : Math.max(3, Math.round(defaultHeightMeters));

  return [
    'let',
    'h',
    ['to-number', ['coalesce', ['get', 'height'], 0]],
    ['case', ['>', ['var', 'h'], 0], ['var', 'h'], fallback],
  ];
}

export function resolveBuildingTileset(map) {
  if (!map?.getSource) return null;

  if (map.getSource('openmaptiles')) {
    return {
      provider: 'openfreemap',
      source: 'openmaptiles',
      sourceLayer: 'building',
      nativeLayerIds: ['building-3d', 'building'],
      flatLayerId: 'building',
    };
  }

  const neshanSource = NESHAN_BUILDING_TILE_SOURCES.find((id) => map.getSource(id));
  if (neshanSource) {
    return {
      provider: 'neshan',
      source: neshanSource,
      sourceLayer: 'landuse',
      nativeLayerIds: [NESHAN_NATIVE_3D_LAYER_ID],
      flatLayerId: null,
      filter: ['match', ['get', 'type'], ['building'], true, false],
    };
  }

  return null;
}

function findInsertBeforeLayerId(map) {
  const layers = map.getStyle()?.layers || [];
  const symbol = layers.find((layer) => layer.type === 'symbol');
  return symbol?.id;
}

function setLayerVisibility(map, layerId, visible) {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
}

function hideNativeBuildingLayers(map, tileset) {
  tileset?.nativeLayerIds?.forEach((layerId) => setLayerVisibility(map, layerId, false));
}

function restoreNativeBuildingLayers(map, tileset) {
  if (!tileset) return;

  if (tileset.provider === 'openfreemap') {
    setLayerVisibility(map, 'building-3d', false);
    setLayerVisibility(map, 'building', true);
    return;
  }

  if (tileset.provider === 'neshan') {
    setLayerVisibility(map, NESHAN_NATIVE_3D_LAYER_ID, false);
  }
}

function removePxBuildingLayer(map) {
  if (map.getLayer(PX_BUILDING_LAYER_ID)) {
    map.removeLayer(PX_BUILDING_LAYER_ID);
  }
}

function buildExtrusionPaint(tileset, config) {
  if (tileset.provider === 'neshan') {
    return {
      'fill-extrusion-color': config.color,
      'fill-extrusion-opacity': config.opacity,
      'fill-extrusion-base': ['coalesce', ['to-number', ['get', 'min_height']], 0],
      'fill-extrusion-height': buildNeshanExtrusionHeightExpression(
        config.defaultHeight,
        config.useMapDefault
      ),
    };
  }

  const heightExpression = config.useMapDefault
    ? buildOsmExtrusionHeightExpression()
    : buildExtrusionHeightExpression(config.defaultHeight);

  return {
    'fill-extrusion-color': config.color,
    'fill-extrusion-opacity': config.opacity,
    'fill-extrusion-base': 0,
    'fill-extrusion-height': heightExpression,
  };
}

function ensurePxBuildingLayer(map, tileset, config, show3D) {
  if (!show3D) {
    removePxBuildingLayer(map);
    return;
  }

  hideNativeBuildingLayers(map, tileset);

  const paint = buildExtrusionPaint(tileset, config);

  if (!map.getLayer(PX_BUILDING_LAYER_ID)) {
    const beforeId = findInsertBeforeLayerId(map);
    const layerDef = {
      id: PX_BUILDING_LAYER_ID,
      type: 'fill-extrusion',
      source: tileset.source,
      'source-layer': tileset.sourceLayer,
      minzoom: BUILDING_EXTRUSION_MIN_ZOOM,
      paint,
    };

    if (tileset.filter) {
      layerDef.filter = tileset.filter;
    }

    try {
      if (beforeId) {
        map.addLayer(layerDef, beforeId);
      } else {
        map.addLayer(layerDef);
      }
    } catch {
      restoreNativeBuildingLayers(map, tileset);
    }
    return;
  }

  try {
    map.setLayerZoomRange(PX_BUILDING_LAYER_ID, BUILDING_EXTRUSION_MIN_ZOOM, 24);
    Object.entries(paint).forEach(([key, value]) => {
      map.setPaintProperty(PX_BUILDING_LAYER_ID, key, value);
    });
    setLayerVisibility(map, PX_BUILDING_LAYER_ID, true);
  } catch {
    /* layer update failed */
  }
}

export function applyBuildingExtrusion(map, buildingConfig, show3D = true) {
  if (!map?.getStyle) return;

  const tileset = resolveBuildingTileset(map);

  if (!show3D) {
    removePxBuildingLayer(map);
    restoreNativeBuildingLayers(map, tileset);
    return;
  }

  if (!tileset) return;

  const config = buildingConfig || {
    useMapDefault: true,
    defaultHeight: DEFAULT_BUILDING_FALLBACK_HEIGHT,
    color: DEFAULT_BUILDING_COLOR,
    opacity: DEFAULT_BUILDING_OPACITY,
  };

  ensurePxBuildingLayer(map, tileset, config, show3D);
}

export function isBuildingTileSourceLoaded(event) {
  if (!event?.isSourceLoaded) return false;
  if (event.sourceId === 'openmaptiles') return true;
  return NESHAN_BUILDING_TILE_SOURCES.includes(event.sourceId);
}
