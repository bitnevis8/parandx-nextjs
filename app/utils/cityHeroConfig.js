/** پیش‌فرض تصاویر پس‌زمینه شهر — همگام با ensureCityHeroDefaults در API */
export const CITY_HERO_PRESETS = {
  parand: {
    heroImageDay: '/images/hero/city/parand-day.webp',
    heroImageNight: '/images/hero/city/parand-night.webp',
  },
  ahvaz: {
    heroImageDay: '/images/hero/city/ahvaz-day.webp',
    heroImageNight: '/images/hero/city/ahvaz-night.webp',
  },
};

export const DEFAULT_HERO_TYPE_OVERLAYS = {
  services: {
    image: '/images/hero/type/expert.webp',
    widthPercent: 88,
    heightPercent: 72,
    maxWidthRem: 26,
    aspectRatio: 4 / 3,
  },
  goods: {
    image: '/images/hero/type/shop.webp',
    widthPercent: 85,
    heightPercent: 68,
    maxWidthRem: 21.5,
    aspectRatio: 4 / 3,
  },
};

/** پیش‌فرض نمایش تصویر شهر (fit + حاشیه) */
export const DEFAULT_HERO_CITY_DISPLAY = {
  paddingRem: 0.65,
  radiusRem: 1.15,
};

function normalizePath(value) {
  const trimmed = String(value ?? '').trim();
  return trimmed.startsWith('/') ? trimmed : '';
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeTypeLayer(raw, defaults) {
  if (typeof raw === 'string') {
    return { ...defaults, image: normalizePath(raw) || defaults.image };
  }
  if (!raw || typeof raw !== 'object') return { ...defaults };
  return {
    image: normalizePath(raw.image) || defaults.image,
    widthPercent: clampNumber(raw.widthPercent, 40, 100, defaults.widthPercent),
    heightPercent: clampNumber(raw.heightPercent, 30, 100, defaults.heightPercent),
    maxWidthRem: clampNumber(raw.maxWidthRem, 10, 40, defaults.maxWidthRem),
    aspectRatio: clampNumber(raw.aspectRatio, 0.75, 2, defaults.aspectRatio),
  };
}

/** @param {Partial<typeof DEFAULT_HERO_TYPE_OVERLAYS>|null|undefined} fromApi */
export function mergeHeroTypeOverlays(fromApi) {
  return {
    services: normalizeTypeLayer(fromApi?.services, DEFAULT_HERO_TYPE_OVERLAYS.services),
    goods: normalizeTypeLayer(fromApi?.goods, DEFAULT_HERO_TYPE_OVERLAYS.goods),
  };
}

function resolveHeroPresetKey(city) {
  const slug = String(city?.slug || '').trim().toLowerCase();
  if (slug && CITY_HERO_PRESETS[slug]) return slug;
  const name = String(city?.name || '').trim();
  if (name === 'اهواز') return 'ahvaz';
  if (name === 'پرند') return 'parand';
  return slug;
}

/** @param {{ slug?: string, name?: string, heroImageDay?: string|null, heroImageNight?: string|null }|null|undefined} city */
export function resolveCityHeroBackground(city, isDark = false) {
  const preset = CITY_HERO_PRESETS[resolveHeroPresetKey(city)] || null;

  const day =
    normalizePath(preset?.heroImageDay) ||
    normalizePath(city?.heroImageDay) ||
    '';
  const night =
    normalizePath(preset?.heroImageNight) ||
    normalizePath(city?.heroImageNight) ||
    '';

  return isDark ? night || day : day || night;
}

/** @param {'services'|'goods'} marketplace */
export function resolveHeroTypeLayer(marketplace, overlays = DEFAULT_HERO_TYPE_OVERLAYS) {
  const merged = mergeHeroTypeOverlays(overlays);
  return marketplace === 'goods' ? merged.goods : merged.services;
}

/** @param {'services'|'goods'} marketplace */
export function resolveHeroTypeOverlay(marketplace, overlays = DEFAULT_HERO_TYPE_OVERLAYS) {
  return resolveHeroTypeLayer(marketplace, overlays).image;
}

/**
 * @param {object|null|undefined} city
 * @param {'services'|'goods'} marketplace
 * @param {object} overlays
 */
export function resolveCityHeroLayout(city, marketplace, overlays = DEFAULT_HERO_TYPE_OVERLAYS) {
  const typeLayer = resolveHeroTypeLayer(marketplace, overlays);
  const cityPaddingRem = clampNumber(
    city?.heroCityPaddingRem,
    0,
    3,
    DEFAULT_HERO_CITY_DISPLAY.paddingRem
  );
  const cityRadiusRem = clampNumber(
    city?.heroCityRadiusRem,
    0,
    3,
    DEFAULT_HERO_CITY_DISPLAY.radiusRem
  );
  const maxWidthRem = clampNumber(
    city?.heroFrameMaxWidthRem ?? typeLayer.maxWidthRem,
    10,
    40,
    typeLayer.maxWidthRem
  );
  const aspectRatio = clampNumber(
    city?.heroFrameAspectRatio ?? typeLayer.aspectRatio,
    0.75,
    2,
    typeLayer.aspectRatio
  );

  return {
    maxWidthRem,
    aspectRatio,
    cityPaddingRem,
    cityRadiusRem,
    typeWidthPercent: typeLayer.widthPercent,
    typeHeightPercent: typeLayer.heightPercent,
  };
}

/** @param {string} slug */
export function getCityHeroPresetPaths(slug) {
  const preset = CITY_HERO_PRESETS[String(slug || '').trim().toLowerCase()];
  return preset || { heroImageDay: '', heroImageNight: '' };
}

export const DEFAULT_HERO_CITY_FORM_SIZES = {
  heroFrameMaxWidthRem: '',
  heroFrameAspectRatio: '',
  heroCityPaddingRem: '',
  heroCityRadiusRem: '',
};
