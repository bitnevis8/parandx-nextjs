import Supercluster from 'supercluster';

export function createPointIndex(points, options = {}) {
  const index = new Supercluster({
    radius: options.radius ?? 60,
    maxZoom: options.maxZoom ?? 16,
    minZoom: options.minZoom ?? 0,
  });

  index.load(
    points.map((point) => ({
      type: 'Feature',
      properties: { ...point },
      geometry: {
        type: 'Point',
        coordinates: [point.lng, point.lat],
      },
    }))
  );

  return index;
}

/** شعاع خوشه (پیکسل) — با زوم کمتر، خوشه‌های درشت‌تر */
export function resolveBoundaryClusterRadius(mapZoom) {
  const z = Number.isFinite(mapZoom) ? mapZoom : 12;
  if (z < 9.5) return 88;
  if (z < 10.5) return 76;
  if (z < 11.5) return 64;
  if (z < 12.5) return 54;
  if (z < 13.5) return 46;
  if (z < 14.5) return 40;
  return 34;
}

/** خوشه‌های visible — همیشه متناسب با zوم فعلی نقشه */
export function getClustersForViewport(index, map) {
  const zoomLevel = map.getZoom();
  const maxZoom = index.options?.maxZoom ?? 16;
  const clusterZoom = Math.min(Math.max(0, Math.floor(zoomLevel)), maxZoom);
  const bounds = map.getBounds();

  return index.getClusters(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    clusterZoom
  );
}

/** زوم پیشنهادی برای باز کردن یک خوشه */
export function getClusterExpansionTargetZoom(index, clusterId, map) {
  const maxZoom = index.options?.maxZoom ?? 16;
  const mapMax = typeof map.getMaxZoom === 'function' ? map.getMaxZoom() : maxZoom + 2;
  const expansion = index.getClusterExpansionZoom(clusterId);
  return Math.min(Math.max(expansion, Math.floor(map.getZoom()) + 1), mapMax, maxZoom + 1);
}
