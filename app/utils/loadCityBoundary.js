import { API_ENDPOINTS } from '../config/api';
import { processBoundaryCollection } from './geojsonBoundary';

const cache = new Map();
const loadPromises = new Map();

/** فقط وقتی API فیلد hasBoundaryMap را برگردانده true است — slug به‌تنهایی کافی نیست */
export function cityHasBoundaryMap(cityOrSlug) {
  if (!cityOrSlug || typeof cityOrSlug !== 'object') return false;
  return Boolean(cityOrSlug.hasBoundaryMap);
}

function getCacheKey(citySlug, version) {
  return version != null ? `${citySlug}:${version}` : citySlug;
}

async function fetchGeoJsonCollection(citySlug, version) {
  const query = version != null ? `?v=${encodeURIComponent(version)}` : '';
  const urls = [
    `/geojson/${encodeURIComponent(citySlug)}.geojson${query}`,
    `${API_ENDPOINTS.cities.getGeoJson(citySlug)}${query}`,
  ];

  let lastError = null;

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return res.json();
      if (res.status === 404) {
        lastError = new Error('boundary-not-found');
        continue;
      }
      lastError = new Error(`Failed to load ${citySlug} geojson (${res.status})`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to load ${citySlug} geojson`);
}

export async function loadCityBoundaryData(citySlug, version) {
  if (!citySlug) {
    throw new Error('city slug is required');
  }

  const cacheKey = getCacheKey(citySlug, version);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (loadPromises.has(cacheKey)) {
    return loadPromises.get(cacheKey);
  }

  const promise = fetchGeoJsonCollection(citySlug, version)
    .then((collection) => {
      const processed = processBoundaryCollection(collection, citySlug);
      cache.set(cacheKey, processed);
      return processed;
    })
    .catch((err) => {
      cache.delete(cacheKey);
      loadPromises.delete(cacheKey);
      throw err;
    });

  loadPromises.set(cacheKey, promise);
  return promise;
}

export function clearCityBoundaryCache(citySlug) {
  if (citySlug) {
    for (const key of [...cache.keys(), ...loadPromises.keys()]) {
      if (key === citySlug || key.startsWith(`${citySlug}:`)) {
        cache.delete(key);
        loadPromises.delete(key);
      }
    }
    return;
  }
  cache.clear();
  loadPromises.clear();
}
