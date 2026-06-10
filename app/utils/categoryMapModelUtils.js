import { normalizeCompressionMode } from '../config/categoryMapModelCompression';

export const MAP_MODEL_EXTENSIONS = ['glb', 'gltf'];

export const DEFAULT_CATEGORY_MAP_MODEL_3D = {
  enabled: true,
  sizePx: 56,
  sizePx3d: 80,
  scale: 1,
  fieldOfView: 45,
  autoRotate: true,
  cameraOrbit: '0deg 68deg auto',
  modelOrientation: '0deg 0deg 0deg',
  rotationPerSecond: '18deg',
  autoRotateDelay: 0,
  exposure: 1.15,
  shadowIntensity: 1,
  uploadCompressEnabled: false,
  uploadCompressMode: 'meshopt-medium',
};

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

export function normalizeCategoryMapModel3d(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_CATEGORY_MAP_MODEL_3D };
  }

  return {
    enabled: raw.enabled !== false,
    sizePx: clampNumber(raw.sizePx, 24, 200, DEFAULT_CATEGORY_MAP_MODEL_3D.sizePx),
    sizePx3d: clampNumber(raw.sizePx3d, 32, 240, DEFAULT_CATEGORY_MAP_MODEL_3D.sizePx3d),
    scale: clampNumber(raw.scale, 0.4, 2.5, DEFAULT_CATEGORY_MAP_MODEL_3D.scale),
    fieldOfView: clampNumber(raw.fieldOfView, 15, 90, DEFAULT_CATEGORY_MAP_MODEL_3D.fieldOfView),
    autoRotate: raw.autoRotate !== false,
    cameraOrbit:
      String(raw.cameraOrbit || '').trim() || DEFAULT_CATEGORY_MAP_MODEL_3D.cameraOrbit,
    modelOrientation:
      String(raw.modelOrientation || '').trim() ||
      DEFAULT_CATEGORY_MAP_MODEL_3D.modelOrientation,
    rotationPerSecond:
      String(raw.rotationPerSecond || '').trim() ||
      DEFAULT_CATEGORY_MAP_MODEL_3D.rotationPerSecond,
    autoRotateDelay: clampNumber(
      raw.autoRotateDelay,
      0,
      10000,
      DEFAULT_CATEGORY_MAP_MODEL_3D.autoRotateDelay
    ),
    exposure: clampNumber(raw.exposure, 0.4, 2.5, DEFAULT_CATEGORY_MAP_MODEL_3D.exposure),
    shadowIntensity: clampNumber(
      raw.shadowIntensity,
      0,
      2,
      DEFAULT_CATEGORY_MAP_MODEL_3D.shadowIntensity
    ),
    uploadCompressEnabled: raw.uploadCompressEnabled === true,
    uploadCompressMode: normalizeCompressionMode(
      raw.uploadCompressMode,
      DEFAULT_CATEGORY_MAP_MODEL_3D.uploadCompressMode
    ),
  };
}

export function isMapModelUploadFile(file) {
  const name = String(file?.name || '').toLowerCase();
  return name.endsWith('.glb') || name.endsWith('.gltf');
}

export function buildCategoryMapModelPublicUrl(slug, ext = 'glb') {
  const safeSlug = String(slug || '').trim();
  const safeExt = String(ext || '').toLowerCase();
  if (!safeSlug || !MAP_MODEL_EXTENSIONS.includes(safeExt)) return null;
  return `/3D%20Icons/${encodeURIComponent(safeSlug)}.${safeExt}`;
}

/** @deprecated use buildCategoryMapModelPublicUrl */
export function buildCategoryGlbPublicUrl(slug) {
  return buildCategoryMapModelPublicUrl(slug, 'glb');
}

function resolveRegistryModelUrl(entry, slug) {
  return entry?.modelUrl || entry?.glbUrl || null;
}

export function resolveCategoryMapModel(slug, registry = {}) {
  const safeSlug = String(slug || '').trim();
  if (!safeSlug) return null;

  const entry = registry[safeSlug];
  const settings = normalizeCategoryMapModel3d(entry?.mapModel3d || entry);
  if (!settings.enabled) return null;

  const url = resolveRegistryModelUrl(entry, safeSlug);
  const hasFile = Boolean(entry?.hasFile || url);
  if (!hasFile || !url) return null;

  return {
    slug: safeSlug,
    url,
    modelFormat: entry?.modelFormat || null,
    ...settings,
  };
}

export function resolveGoodsGlbModel(categorySlug, registry = {}) {
  return resolveCategoryMapModel(categorySlug, registry)?.url || null;
}

export function resolveMerchantGlbModel(merchant, { categorySlug, registry = {} } = {}) {
  if (!merchant) return null;

  const slugs = [];
  if (categorySlug) slugs.push(categorySlug);
  if (merchant.primaryCategorySlug) slugs.push(merchant.primaryCategorySlug);
  (merchant.categories || []).forEach((cat) => {
    if (cat?.slug) slugs.push(cat.slug);
  });

  for (const slug of slugs) {
    const model = resolveCategoryMapModel(slug, registry);
    if (model) return model;
  }

  return null;
}

export function registryFromAdminRows(rows = []) {
  const registry = {};
  rows.forEach((row) => {
    if (!row?.slug) return;
    registry[row.slug] = {
      mapModel3d: row.mapModel3d,
      hasFile: row.hasFile,
      modelFormat: row.modelFormat,
      modelUrl: row.modelUrl,
      glbUrl: row.glbUrl,
    };
  });
  return registry;
}
