import maplibregl from 'maplibre-gl';

/** حاشیهٔ پیش‌فرض بیرون مرز شهر برای pan/zoom (کیلومتر) — ۰ یعنی بدون محدودیت */
export const CITY_MAP_MAX_BOUNDS_PADDING_KM = 0;

export function extendBoundsWithGeometry(bounds, geometry) {
  if (!geometry?.coordinates) return;

  const flat = (ring) => {
    ring.forEach(([lng, lat]) => bounds.extend([lng, lat]));
  };

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(flat);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly) => poly.forEach(flat));
  }
}

export function getFeatureCollectionBounds(geoData) {
  const bounds = new maplibregl.LngLatBounds();
  if (!geoData) return bounds;

  const features =
    geoData.type === 'FeatureCollection'
      ? geoData.features
      : geoData.type === 'Feature'
        ? [geoData]
        : [];

  features.forEach((feature) => extendBoundsWithGeometry(bounds, feature?.geometry));
  return bounds;
}

export function expandLngLatBoundsByKm(bounds, paddingKm = CITY_MAP_MAX_BOUNDS_PADDING_KM) {
  if (!bounds || bounds.isEmpty()) return null;

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const centerLat = (sw.lat + ne.lat) / 2;
  const km = Math.max(0, Number(paddingKm) || 0);
  const latPad = km / 111;
  const lngPad = km / (111 * Math.cos((centerLat * Math.PI) / 180));

  return [
    [sw.lng - lngPad, sw.lat - latPad],
    [ne.lng + lngPad, ne.lat + latPad],
  ];
}

/** [[غرب، جنوب], [شرق، شمال]] برای map.setMaxBounds — paddingKm=0 یعنی بدون محدودیت */
export function getMaxBoundsFromGeoData(geoData, paddingKm = CITY_MAP_MAX_BOUNDS_PADDING_KM) {
  const km = Math.max(0, Number(paddingKm) || 0);
  if (km === 0) return null;

  const bounds = getFeatureCollectionBounds(geoData);
  return expandLngLatBoundsByKm(bounds, km);
}

export function getFitBoundsOptions(mode) {
  if (mode === 'section') {
    return { padding: 40, maxZoom: 13, duration: 350 };
  }
  if (mode === 'neighborhood') {
    return { padding: 48, maxZoom: 14, duration: 350 };
  }
  return { padding: 24, maxZoom: 14, duration: 350 };
}

export function fitMapToGeoData(map, geoData, mode = 'city', view = { pitch: 0, bearing: 0 }) {
  const bounds = getFeatureCollectionBounds(geoData);
  if (bounds.isEmpty()) return;

  const options = getFitBoundsOptions(mode);
  map.fitBounds(bounds, options);
  map.setPitch(view.pitch);
  map.setBearing(view.bearing);
}
