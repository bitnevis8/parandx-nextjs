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

export function getClustersForViewport(index, map, disableClusteringAtZoom = null) {
  const zoom = Math.floor(map.getZoom());
  if (disableClusteringAtZoom != null && zoom >= disableClusteringAtZoom) {
    return index.getClusters([-180, -85, 180, 85], zoom);
  }

  const bounds = map.getBounds();
  const bbox = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ];
  return index.getClusters(bbox, zoom);
}
