import {
  MAP_2D_BEARING,
  MAP_2D_PITCH,
  MAP_3D_PITCH,
} from './mapLibre3DConfig';
import { CITY_MAP_MAX_BOUNDS_PADDING_KM } from './mapLibreBounds';
import { readTriStateBool, resolveCityBuildingConfig } from './mapBuildingExtrusion';

/** زاویه پیش‌فرض نقشه‌های داشبورد (پروفایل، درخواست، آدرس) */
export const DASHBOARD_MAP_VIEW_DEFAULTS = {
  pitch: 27,
  bearing: 13,
};

/** پیش‌فرض کامل نمای نقشه — برای fallback کد و راهنمای داشبورد */
export const CITY_MAP_VIEW_PRESETS = {
  parand: {
    latitude: 35.4764,
    longitude: 50.9476,
    mapZoom: 13,
    mapShow3D: true,
    mapPitch: 60,
    mapBearing: 13,
    mapUseConfiguredView: true,
  },
};

const CITY_MAP_FALLBACK = {
  parand: CITY_MAP_VIEW_PRESETS.parand,
  ahvaz: { latitude: 31.3183, longitude: 48.6842, mapZoom: 12 },
  bojnord: { latitude: 37.475, longitude: 57.3314, mapZoom: 13 },
  'shahr-228': { latitude: 37.475, longitude: 57.3314, mapZoom: 13 },
  dezful: { latitude: 32.3831, longitude: 48.4019, mapZoom: 13 },
  andimeshk: { latitude: 32.4601, longitude: 48.3592, mapZoom: 13 },
};

const CITY_NAME_FALLBACK = {
  پرند: CITY_MAP_FALLBACK.parand,
  اهواز: CITY_MAP_FALLBACK.ahvaz,
  بجنورد: CITY_MAP_FALLBACK.bojnord,
  دزفول: CITY_MAP_FALLBACK.dezful,
  اندیمشک: CITY_MAP_FALLBACK.andimeshk,
};

export function parseCoord(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getCitySlug(city) {
  if (!city) return '';
  return String(city.slug || '').trim().toLowerCase();
}

function getCityFallback(city) {
  if (!city) return null;

  const slug = getCitySlug(city);
  const slugById = city.id != null ? `shahr-${city.id}` : '';
  const name = String(city.name || '').trim();

  return (
    CITY_MAP_FALLBACK[slug] ||
    CITY_MAP_FALLBACK[slugById] ||
    CITY_NAME_FALLBACK[name] ||
    null
  );
}

export function getCityMapViewPreset(city) {
  const slug = getCitySlug(city);
  return CITY_MAP_VIEW_PRESETS[slug] || null;
}

/** پیش‌فرض کد شهر (مثل پرند) — فقط قبل از اولین ذخیره در دیتابورد */
function resolveEffectiveCityMap(city) {
  const preset = getCityMapViewPreset(city);
  if (!preset || readTriStateBool(city?.mapUseConfiguredView, false)) {
    return city;
  }

  const hasDbViewConfig =
    city?.mapPitch != null ||
    city?.mapBearing != null ||
    (city?.latitude != null && city?.longitude != null && city?.mapZoom != null);

  if (hasDbViewConfig) return city;

  return { ...city, ...preset };
}

export function resolveCityMapConfig(city) {
  if (!city) return null;

  const effective = resolveEffectiveCityMap(city);
  const fallback = getCityFallback(city);
  const lat =
    parseCoord(effective?.latitude) ??
    fallback?.latitude ??
    null;
  const lng =
    parseCoord(effective?.longitude) ??
    fallback?.longitude ??
    null;
  const zoomRaw = parseCoord(effective?.mapZoom) ?? fallback?.mapZoom ?? 13;
  const zoom = Math.round(zoomRaw) || 13;

  if (lat == null || lng == null) return null;

  return { lat, lng, zoom };
}

export function resolveCityDefaultRegion(city) {
  return {
    sectionId: String(city?.defaultSectionId || '').trim(),
    neighborhoodId: String(city?.defaultNeighborhoodId || '').trim(),
  };
}

export function resolveCityMaxBoundsPaddingKm(city) {
  const raw = city?.mapMaxBoundsPaddingKm;
  if (raw == null || raw === '') {
    return CITY_MAP_MAX_BOUNDS_PADDING_KM;
  }
  const num = Number(raw);
  if (Number.isFinite(num) && num >= 0) {
    return Math.min(50, Math.round(num));
  }
  return CITY_MAP_MAX_BOUNDS_PADDING_KM;
}

export function resolveCityMapView(city) {
  const effective = resolveEffectiveCityMap(city);
  const center = resolveCityMapConfig(city);
  const show3D = readTriStateBool(effective?.mapShow3D, true);
  const pitchRaw = parseCoord(effective?.mapPitch);
  const bearingRaw = parseCoord(effective?.mapBearing);
  const pitch = pitchRaw ?? (show3D ? MAP_3D_PITCH : MAP_2D_PITCH);
  const bearing = bearingRaw ?? MAP_2D_BEARING;
  const useConfiguredView = readTriStateBool(effective?.mapUseConfiguredView, false);

  return {
    center,
    show3D: Boolean(show3D),
    pitch,
    bearing,
    useConfiguredView,
    defaultRegion: resolveCityDefaultRegion(city),
    buildings: resolveCityBuildingConfig(city),
    maxBoundsPaddingKm: resolveCityMaxBoundsPaddingKm(city),
  };
}

export function isValidMapCenter(center) {
  return (
    Array.isArray(center) &&
    center.length === 2 &&
    Number.isFinite(center[0]) &&
    Number.isFinite(center[1])
  );
}

export { CITY_MAP_FALLBACK };
