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
    latitude: 35.4754,
    longitude: 50.9584,
    mapZoom: 14.2,
    mapZoomMobile: 14,
    mapShow3D: true,
    mapPitch: 58,
    mapBearing: 0,
    mapUseConfiguredView: true,
  },
  ahvaz: {
    latitude: 31.3119,
    longitude: 48.6721,
    mapZoom: 10.7,
    mapShow3D: true,
    mapPitch: 52,
    mapBearing: 0,
    mapUseConfiguredView: true,
  },
};

const CITY_MAP_FALLBACK = {
  parand: CITY_MAP_VIEW_PRESETS.parand,
  ahvaz: CITY_MAP_VIEW_PRESETS.ahvaz,
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

/** مقادیر پیشنهادی فرم داشبورد — preset کد یا دیتابیس */
export function getCityMapFormDefaults(city) {
  if (!city) return null;

  const useConfigured = readTriStateBool(city?.mapUseConfiguredView, false);
  const preset = getCityMapViewPreset(city) || getCityFallback(city);
  const effective = useConfigured ? city : preset ? { ...city, ...preset } : city;

  return {
    latitude: effective.latitude ?? '',
    longitude: effective.longitude ?? '',
    mapZoom: effective.mapZoom ?? 13,
    mapZoomMobile: effective.mapZoomMobile ?? '',
    mapShow3D: readTriStateBool(effective.mapShow3D, true),
    mapPitch: effective.mapPitch ?? 60,
    mapBearing: effective.mapBearing ?? 0,
    mapUseConfiguredView: useConfigured,
  };
}

/** پیش‌فرض کد شهر — تا ذخیرهٔ «نمای سفارشی» در داشبورد */
function resolveEffectiveCityMap(city) {
  if (!city) return city;

  if (readTriStateBool(city?.mapUseConfiguredView, false)) {
    return city;
  }

  const preset = getCityMapViewPreset(city) || getCityFallback(city);
  if (!preset) return city;

  const hasDbViewConfig =
    city?.mapPitch != null ||
    city?.mapBearing != null ||
    (city?.latitude != null && city?.longitude != null && city?.mapZoom != null);

  if (hasDbViewConfig && !preset.mapUseConfiguredView) return city;

  return { ...city, ...preset };
}

export function resolveCityMapConfig(city, { mobile = false } = {}) {
  if (!city) return null;

  const effective = resolveEffectiveCityMap(city);
  const preset = getCityMapViewPreset(city);
  const fallback = getCityFallback(city);
  const lat =
    parseCoord(effective?.latitude) ??
    fallback?.latitude ??
    null;
  const lng =
    parseCoord(effective?.longitude) ??
    fallback?.longitude ??
    null;
  const zoomDesktopRaw = parseCoord(effective?.mapZoom) ?? fallback?.mapZoom ?? 13;
  const zoomDesktop = Number.isFinite(zoomDesktopRaw) ? zoomDesktopRaw : 13;
  const zoomMobileRaw =
    parseCoord(effective?.mapZoomMobile) ??
    preset?.mapZoomMobile ??
    fallback?.mapZoomMobile ??
    null;
  const zoomMobile = Number.isFinite(zoomMobileRaw) ? zoomMobileRaw : zoomDesktop;
  const zoom = mobile ? zoomMobile : zoomDesktop;

  if (lat == null || lng == null) return null;

  return { lat, lng, zoom, zoomDesktop, zoomMobile };
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
