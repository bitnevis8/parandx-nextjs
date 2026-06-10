import { NextResponse } from 'next/server';
import {
  filterPlaceSearchResults,
  resolvePlaceSearchProfile,
} from '../../../utils/mapPlaceSearchPrecision';

const NOMINATIM_UA = 'ParandX/1.0 (map place search; contact@parandx.local)';
const CACHE_TTL_MS = 5 * 60 * 1000;
const searchCache = new Map();

function cacheKey(term, lat, lng, cityName, subCategoryId) {
  return `v4|${term}|${lat.toFixed(3)}|${lng.toFixed(3)}|${cityName}|${subCategoryId || ''}`;
}

function readCache(key) {
  const hit = searchCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    searchCache.delete(key);
    return null;
  }
  return hit.payload;
}

function writeCache(key, payload) {
  searchCache.set(key, { at: Date.now(), payload });
  if (searchCache.size > 200) {
    const oldest = searchCache.keys().next().value;
    searchCache.delete(oldest);
  }
}

function buildAddress(parts) {
  return parts.filter(Boolean).join('، ');
}

/** عبارت جستجو با نام شهر — مثل «شهر پرند مسجد» */
function buildSearchTerm(term, cityName) {
  const raw = String(term || '').trim();
  const city = String(cityName || '').trim();
  if (!raw || !city) return raw;

  const normalize = (value) =>
    value
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const rawNorm = normalize(raw);
  const cityNorm = normalize(city);

  if (rawNorm.includes(cityNorm)) return raw;

  return `شهر ${city} ${raw}`;
}

function dedupeSearchItems(items, limit = 20) {
  const seen = new Set();
  const merged = [];

  for (const item of items) {
    if (!item || merged.length >= limit) break;
    const key = `${item.lat.toFixed(5)}|${item.lng.toFixed(5)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged;
}

function normalizeNeshanItems(payload) {
  const items = Array.isArray(payload?.items) ? payload.items : [];
  return items
    .map((item, index) => {
      const loc = item?.location || {};
      const lat = Number(loc.y ?? loc.lat);
      const lng = Number(loc.x ?? loc.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const title = String(item?.title || item?.name || '').trim();
      if (!title) return null;
      return {
        id: `neshan-${index}-${lat.toFixed(5)}-${lng.toFixed(5)}`,
        title,
        address: String(item?.address || item?.region || '').trim(),
        lat,
        lng,
      };
    })
    .filter(Boolean);
}

function normalizeNominatimItems(payload) {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((item) => {
      const lat = Number(item?.lat);
      const lng = Number(item?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const title = String(item?.name || item?.display_name?.split(',')[0] || '').trim();
      if (!title) return null;
      return {
        id: String(item?.place_id || `${lat}-${lng}`),
        title,
        address: String(item?.display_name || '').trim(),
        lat,
        lng,
      };
    })
    .filter(Boolean);
}

function normalizePhotonItems(payload) {
  const features = Array.isArray(payload?.features) ? payload.features : [];
  return features
    .map((feature, index) => {
      const coords = feature?.geometry?.coordinates;
      const lng = Number(coords?.[0]);
      const lat = Number(coords?.[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      const props = feature?.properties || {};
      const title = String(props.name || props.city || '').trim();
      if (!title) return null;

      return {
        id: `photon-${props.osm_type || 'x'}-${props.osm_id || index}-${lat.toFixed(5)}-${lng.toFixed(5)}`,
        title,
        address: buildAddress([
          props.street,
          props.district,
          props.city,
          props.state,
          props.country,
        ]),
        lat,
        lng,
        osmKey: String(props.osm_key || props.osmKey || '').trim() || undefined,
        osmValue: String(props.osm_value || props.osmValue || '').trim() || undefined,
      };
    })
    .filter(Boolean);
}

async function searchNeshan(term, lat, lng, key) {
  const url = new URL('https://api.neshan.org/v1/search');
  url.searchParams.set('term', term);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lng', String(lng));

  const res = await fetch(url.toString(), {
    headers: { 'Api-Key': key },
    next: { revalidate: 0 },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const code = json?.code || res.status;
    throw new Error(`neshan-${code}:${String(json?.message || res.statusText).slice(0, 120)}`);
  }

  if (json?.status === 'ERROR') {
    throw new Error(`neshan-${json.code || 'error'}:${String(json.message || 'error').slice(0, 120)}`);
  }

  return normalizeNeshanItems(json);
}

async function searchNominatim(term, lat, lng, { bounded = true } = {}) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', term);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '15');
  url.searchParams.set('countrycodes', 'ir');
  url.searchParams.set('accept-language', 'fa');

  if (bounded && Number.isFinite(lat) && Number.isFinite(lng)) {
    const pad = 0.35;
    url.searchParams.set('viewbox', `${lng - pad},${lat + pad},${lng + pad},${lat - pad}`);
    url.searchParams.set('bounded', '1');
  }

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': NOMINATIM_UA },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`nominatim-${res.status}`);
  }

  const json = await res.json();
  return normalizeNominatimItems(json);
}

async function searchPhoton(term, lat, lng, { bboxPad = 0.35 } = {}) {
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', term);
  url.searchParams.set('limit', '20');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));

  const pad = bboxPad;
  url.searchParams.set('bbox', `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`);

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': NOMINATIM_UA },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`photon-${res.status}`);
  }

  const json = await res.json();
  const items = normalizePhotonItems(json);

  return items.filter((item) => {
    const feature = json.features?.find((f) => {
      const coords = f?.geometry?.coordinates;
      return (
        Math.abs(Number(coords?.[1]) - item.lat) < 1e-6 &&
        Math.abs(Number(coords?.[0]) - item.lng) < 1e-6
      );
    });
    const country = feature?.properties?.countrycode;
    return !country || country === 'IR';
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = String(searchParams.get('term') || '').trim();
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const cityName = String(searchParams.get('cityName') || '').trim();
  const subCategoryId = String(searchParams.get('subCategoryId') || '').trim();
  const categoryId = String(searchParams.get('categoryId') || '').trim();
  const subCategoryTitle = String(searchParams.get('subCategoryTitle') || '').trim();

  if (term.length < 2) {
    return NextResponse.json({ success: false, message: 'حداقل ۲ حرف وارد کنید.' }, { status: 400 });
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ success: false, message: 'مرکز شهر نامعتبر است.' }, { status: 400 });
  }

  const key = cacheKey(term, lat, lng, cityName, subCategoryId);
  const cached = readCache(key);
  if (cached) {
    return NextResponse.json(cached);
  }

  const searchTerm = buildSearchTerm(term, cityName);
  const neshanSearchKey = process.env.NESHAN_SEARCH_KEY;
  const collected = [];
  let provider = 'none';
  const warnings = [];

  if (neshanSearchKey) {
    try {
      collected.push(...(await searchNeshan(searchTerm, lat, lng, neshanSearchKey)));
      if (collected.length) provider = 'neshan';
    } catch (err) {
      warnings.push(String(err.message || 'neshan-failed'));
    }
  }

  try {
    const photonItems = await searchPhoton(searchTerm, lat, lng);
    if (photonItems.length) {
      collected.push(...photonItems);
      if (provider === 'none') provider = 'photon';
    }
  } catch (err) {
    warnings.push(String(err.message || 'photon-failed'));
  }

  try {
    const nominatimBounded = await searchNominatim(searchTerm, lat, lng, { bounded: true });
    if (nominatimBounded.length) {
      collected.push(...nominatimBounded);
      if (provider === 'none') provider = 'nominatim';
    }
  } catch (err) {
    warnings.push(String(err.message || 'nominatim-bounded-failed'));
  }

  let items = dedupeSearchItems(collected, 20);

  if (items.length < 10) {
    try {
      const nominatimWide = await searchNominatim(searchTerm, lat, lng, { bounded: false });
      if (nominatimWide.length) {
        items = dedupeSearchItems([...items, ...nominatimWide], 20);
        if (provider === 'none') provider = 'nominatim';
      }
    } catch (err) {
      warnings.push(String(err.message || 'nominatim-failed'));
    }
  }

  if (items.length > 1 && provider === 'none') {
    provider = 'merged';
  }

  const searchProfile = resolvePlaceSearchProfile({
    subCategoryId,
    term,
    title: subCategoryTitle,
  });

  items = filterPlaceSearchResults(items, searchProfile);

  const payload = {
    success: true,
    provider,
    count: items.length,
    items,
    searchTerm,
    filtered: Boolean(subCategoryId),
    ...(warnings.length ? { warnings } : {}),
    ...(items.length === 0
      ? {
          message:
            provider === 'none'
              ? 'نتیجه‌ای پیدا نشد. اگر کلید جستجوی نشان دارید، NESHAN_SEARCH_KEY را در env تنظیم کنید.'
              : 'نتیجه‌ای در این منطقه پیدا نشد.',
        }
      : {}),
  };

  writeCache(key, payload);
  return NextResponse.json(payload);
}
