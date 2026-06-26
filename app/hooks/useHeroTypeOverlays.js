'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import {
  mergeHeroTypeOverlays,
  DEFAULT_HERO_TYPE_OVERLAYS,
} from '../utils/cityHeroConfig';

let cachedOverlays = null;
let fetchPromise = null;

function loadHeroTypeOverlays() {
  if (cachedOverlays) return Promise.resolve(cachedOverlays);
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(API_ENDPOINTS.siteSetting.heroTypeOverlays)
    .then((res) => (res.ok ? res.json() : { data: null }))
    .then((json) => {
      cachedOverlays = mergeHeroTypeOverlays(json?.data);
      return cachedOverlays;
    })
    .catch(() => {
      cachedOverlays = { ...DEFAULT_HERO_TYPE_OVERLAYS };
      return cachedOverlays;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function useHeroTypeOverlays() {
  const [overlays, setOverlays] = useState(cachedOverlays || DEFAULT_HERO_TYPE_OVERLAYS);

  useEffect(() => {
    let cancelled = false;
    loadHeroTypeOverlays().then((data) => {
      if (!cancelled) setOverlays(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return overlays;
}
