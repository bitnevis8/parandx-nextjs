import maplibregl from 'maplibre-gl';

const RTL_PLUGIN_URL = '/map/mapbox-gl-rtl-text.js';

let rtlPluginPromise = null;

/** پلاگین RTL برای اتصال درست حروف فارسی/عربی روی برچسب‌های vector tile */
export function ensureMapLibreRtlPlugin() {
  if (typeof window === 'undefined') return Promise.resolve();

  const status = maplibregl.getRTLTextPluginStatus();

  if (status === 'loaded' || status === 'deferred') {
    return Promise.resolve();
  }

  if (status === 'loading' && rtlPluginPromise) {
    return rtlPluginPromise;
  }

  rtlPluginPromise = maplibregl.setRTLTextPlugin(RTL_PLUGIN_URL, false);
  return rtlPluginPromise;
}

/**
 * تنظیم symbol layerها برای فارسی و خوانایی در ۳D
 * faceViewer=true → متن رو به دوربین (مثل تابلو مقابل چشم)
 */
export function enhancePersianSymbolLayers(map, options = {}) {
  const pitch = Number.isFinite(map?.getPitch?.()) ? map.getPitch() : 0;
  const faceViewer = options.faceViewer ?? pitch > 5;
  const pitchAlignment = faceViewer ? 'viewport' : 'map';
  const rotationAlignment = faceViewer ? 'viewport' : 'map';

  const layers = map.getStyle()?.layers || [];

  layers.forEach((layer) => {
    if (layer.type !== 'symbol') return;

    const hasText = Boolean(layer.layout?.['text-field']);
    const hasIcon = Boolean(layer.layout?.['icon-image']);
    if (!hasText && !hasIcon) return;

    try {
      if (hasText) {
        map.setLayoutProperty(layer.id, 'text-pitch-alignment', pitchAlignment);
        map.setLayoutProperty(layer.id, 'text-rotation-alignment', rotationAlignment);
        map.setLayoutProperty(layer.id, 'text-letter-spacing', 0);
        map.setPaintProperty(layer.id, 'text-halo-width', 1.4);
        map.setPaintProperty(layer.id, 'text-halo-blur', 0.25);
      }

      if (hasIcon) {
        map.setLayoutProperty(layer.id, 'icon-pitch-alignment', pitchAlignment);
        map.setLayoutProperty(layer.id, 'icon-rotation-alignment', rotationAlignment);
      }
    } catch {
      /* layer may not allow override */
    }
  });
}
