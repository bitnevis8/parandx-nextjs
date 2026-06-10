import maplibregl from 'maplibre-gl';
import { pointInGeometry } from './geojsonBoundary';
import {
  buildPlaceMarkerElement,
  resolvePlaceMapViewOptions,
} from './placeMapMarkerUi';

let activeMarkers = [];

export function clearPlaceMarkers() {
  activeMarkers.forEach((marker) => marker.remove());
  activeMarkers = [];
}

function resolveMarkerLib(engine) {
  if (engine === 'neshan') {
    // eslint-disable-next-line global-require
    return require('@neshan-maps-platform/mapbox-gl');
  }
  return maplibregl;
}

export function createPlaceMarkerElement(title) {
  const wrap = document.createElement('button');
  wrap.type = 'button';
  wrap.className = 'map-place-search-marker';
  wrap.setAttribute('aria-label', title);
  wrap.title = title;

  const pin = document.createElement('span');
  pin.className = 'map-place-search-marker-pin';
  pin.setAttribute('aria-hidden', 'true');
  pin.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';

  const label = document.createElement('span');
  label.className = 'map-place-search-marker-label';
  label.textContent = title;

  wrap.appendChild(pin);
  wrap.appendChild(label);
  return wrap;
}

export function filterPlacesWithinBoundary(items, boundaryGeometry) {
  if (!boundaryGeometry || !items.length) return items;
  return items.filter((item) => pointInGeometry([item.lng, item.lat], boundaryGeometry));
}

function fitMapToPlaces(map, items, markerEngine) {
  if (!map || !items.length) return;

  if (items.length === 1) {
    map.flyTo({
      center: [items[0].lng, items[0].lat],
      zoom: Math.max(map.getZoom(), 16),
      duration: 700,
    });
    return;
  }

  const lib = resolveMarkerLib(markerEngine);
  const bounds = new lib.LngLatBounds();
  items.forEach((item) => bounds.extend([item.lng, item.lat]));
  map.fitBounds(bounds, { padding: 56, maxZoom: 16, duration: 700 });
}

export function showPlacesOnMap(
  map,
  items,
  { markerEngine = 'maplibre', subCategory = null } = {}
) {
  if (!map || !items.length) return;

  clearPlaceMarkers();
  const lib = resolveMarkerLib(markerEngine);
  const viewOptions = resolvePlaceMapViewOptions(map);

  items.forEach((item) => {
    const itemSubCategory = item.subCategory || subCategory;
    let element;
    let clickTarget;

    if (itemSubCategory) {
      const { wrap, button } = buildPlaceMarkerElement(item, itemSubCategory, viewOptions);
      element = wrap;
      clickTarget = button;
    } else {
      element = createPlaceMarkerElement(item.title);
      clickTarget = element;
    }

    clickTarget.addEventListener('click', (event) => {
      event.stopPropagation();
      map.flyTo({
        center: [item.lng, item.lat],
        zoom: Math.max(map.getZoom(), 17),
        duration: 500,
      });
    });

    const marker = new lib.Marker({
      element,
      anchor: 'bottom',
      pitchAlignment: 'viewport',
      rotationAlignment: 'viewport',
    })
      .setLngLat([item.lng, item.lat])
      .addTo(map);
    activeMarkers.push(marker);
  });

  fitMapToPlaces(map, items, markerEngine);
}
