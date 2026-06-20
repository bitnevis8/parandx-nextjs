import { resolveMerchantGlbModel } from '../config/mapGoods3dIcons';
import { merchantStorePublicHref } from './merchantDisplayUtils';
import { getPinFromAddressData } from './profileAddressUtils';
import {
  addressMatchesCity,
  addressMatchesRegion,
} from './expertMapUtils';

function coordsKey(lat, lng) {
  return `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
}

export const MAP_GOODS_LAYERS = {
  merchants: 'merchants',
  needs: 'needs',
  supplies: 'supplies',
};

export function merchantProvidesCategory(merchant, categorySlug) {
  if (!categorySlug || !merchant) return false;
  return (merchant.categories || []).some((c) => c.slug === categorySlug);
}

export function merchantProvidesMainCategory(merchant, parentSlug, categories = []) {
  if (!parentSlug || !merchant) return false;
  const main = categories.find((c) => c.slug === parentSlug);
  if (!main) return false;
  const subSlugs = new Set((main.subcategories || []).map((sub) => sub.slug));
  return (merchant.categories || []).some(
    (c) => c.slug === parentSlug || subSlugs.has(c.slug)
  );
}

export function merchantMatchesRegion(
  merchant,
  sectionId,
  neighborhoodId,
  citySlug,
  mapCityId
) {
  const addressQualifies = (data, addressCityId) => {
    if (!addressMatchesCity(data, citySlug, { addressCityId, mapCityId })) return false;
    return addressMatchesRegion(data, sectionId, neighborhoodId);
  };

  if (Array.isArray(merchant.addresses)) {
    for (const addr of merchant.addresses) {
      if (addressQualifies(addr?.addressData, addr.cityId)) return true;
    }
  }

  if (addressQualifies(merchant.locationData, merchant.cityId)) return true;

  if (merchant.lat != null && merchant.lng != null) {
    if (!addressMatchesCity(null, citySlug, { addressCityId: merchant.cityId, mapCityId })) {
      return false;
    }
    if (!sectionId && !neighborhoodId) return true;
    return true;
  }

  return false;
}

export function filterMerchantsForMap(
  merchants,
  {
    categorySlug,
    parentSlug,
    categories = [],
    sectionId,
    neighborhoodId,
    citySlug,
    mapCityId,
  }
) {
  return (merchants || []).filter((merchant) => {
    let matchesCategory = true;
    if (categorySlug) {
      matchesCategory = merchantProvidesCategory(merchant, categorySlug);
    } else if (parentSlug) {
      matchesCategory = merchantProvidesMainCategory(merchant, parentSlug, categories);
    }

    return (
      matchesCategory &&
      merchantMatchesRegion(merchant, sectionId, neighborhoodId, citySlug, mapCityId)
    );
  });
}

const GOODS_CATEGORY_TONES = ['teal', 'amber', 'violet', 'rose', 'sky', 'emerald'];

function resolveCategoryToneForSlug(slug, categories = []) {
  if (!slug) return 'amber';
  const parentIndex = categories.findIndex(
    (c) =>
      c.slug === slug ||
      (c.subcategories || []).some((sub) => sub.slug === slug)
  );
  if (parentIndex < 0) return 'amber';
  return GOODS_CATEGORY_TONES[parentIndex % GOODS_CATEGORY_TONES.length];
}

function resolveMerchantCategoryDisplay(merchant, { categorySlug, parentSlug, categories = [] }) {
  const cats = merchant.categories || [];
  if (categorySlug) {
    const match = cats.find((c) => c.slug === categorySlug);
    if (match) {
      return {
        icon: match.icon || '🏪',
        title: match.title,
        tone: resolveCategoryToneForSlug(match.slug, categories),
      };
    }
  }
  if (parentSlug) {
    const main = categories.find((c) => c.slug === parentSlug);
    const subSlugs = new Set((main?.subcategories || []).map((s) => s.slug));
    const match = cats.find((c) => c.slug === parentSlug || subSlugs.has(c.slug));
    if (match) {
      return {
        icon: match.icon || main?.icon || '🏪',
        title: match.title,
        tone: resolveCategoryToneForSlug(parentSlug, categories),
      };
    }
  }
  const primary =
    cats.find((c) => c.slug === merchant.primaryCategorySlug) || cats[0];
  return {
    icon: primary?.icon || '🏪',
    title: primary?.title || '',
    tone: resolveCategoryToneForSlug(primary?.slug || merchant.primaryCategorySlug, categories),
  };
}

export function collectMerchantMapMarkers(
  merchants,
  {
    citySlug,
    mapCityId,
    sectionId,
    neighborhoodId,
    categorySlug = '',
    parentSlug = '',
    categories = [],
    includeGlbModels = false,
    mapModelRegistry = {},
  } = {}
) {
  const markers = [];
  const cityMatchOpts = { mapCityId };

  (merchants || []).forEach((merchant) => {
    const candidates = [];

    if (merchant.lat != null && merchant.lng != null) {
      candidates.push({
        pin: { lat: merchant.lat, lng: merchant.lng },
        isPrimary: true,
      });
    }

    if (Array.isArray(merchant.addresses)) {
      merchant.addresses.forEach((addr) => {
        const data = addr?.addressData;
        if (!addressMatchesCity(data, citySlug, { ...cityMatchOpts, addressCityId: addr.cityId })) {
          return;
        }
        if (!addressMatchesRegion(data, sectionId, neighborhoodId)) return;
        const pin = getPinFromAddressData(data);
        if (pin?.lat == null) return;
        candidates.push({ pin, isPrimary: Boolean(addr?.isPrimary) });
      });
    }

    const legacy = merchant.locationData;
    if (
      legacy &&
      addressMatchesCity(legacy, citySlug, { ...cityMatchOpts, addressCityId: merchant.cityId }) &&
      addressMatchesRegion(legacy, sectionId, neighborhoodId)
    ) {
      const pin = getPinFromAddressData(legacy);
      const legacyKey = pin?.lat != null ? coordsKey(pin.lat, pin.lng) : null;
      const already =
        legacyKey && candidates.some((c) => coordsKey(c.pin.lat, c.pin.lng) === legacyKey);
      if (pin?.lat != null && !already) {
        candidates.push({ pin, isPrimary: true });
      }
    }

    const chosen = candidates.find((c) => c.isPrimary) || candidates[0];
    if (!chosen) return;

    const categoryDisplay = resolveMerchantCategoryDisplay(merchant, {
      categorySlug,
      parentSlug,
      categories,
    });

    const glbEntry = includeGlbModels
      ? resolveMerchantGlbModel(merchant, {
          categorySlug: categorySlug || undefined,
          registry: mapModelRegistry,
        })
      : null;

    markers.push({
      expertId: merchant.id,
      lat: Number(chosen.pin.lat),
      lng: Number(chosen.pin.lng),
      href: merchantStorePublicHref(merchant),
      categoryIcon: categoryDisplay.icon,
      categoryTitle: categoryDisplay.title,
      categoryTone: categoryDisplay.tone,
      popupLinkLabel: 'مشاهده فروشگاه',
      ...(glbEntry
        ? { glbModel: glbEntry.url, glbModelConfig: glbEntry }
        : {}),
    });
  });

  return markers;
}

export function buildMerchantMapExplorerStats(filteredMerchants, markers) {
  const merchantCount = filteredMerchants?.length ?? 0;
  const markerCount = markers?.length ?? 0;
  const merchantsOnMap = new Set((markers || []).map((m) => m.expertId)).size;
  return { merchantCount, markerCount, merchantsOnMap };
}

export {
  filterRequestsForMap as filterGoodsNeedsForMap,
  collectRequestMapMarkers as collectGoodsNeedMapMarkers,
  buildRequestMapExplorerStats as buildGoodsNeedMapExplorerStats,
  requestMatchesExpertSpecializations as goodsNeedMatchesMerchantCategories,
} from './requestMapUtils';

export {
  flattenServiceOptions,
  findParentSlugForService,
  buildRegionLabel,
} from './expertMapUtils';

export {
  merchantMapExplorerSummaryCopy as getMerchantMapExplorerSummaryCopy,
  goodsNeedMapExplorerSummaryCopy as getGoodsNeedMapExplorerSummaryCopy,
  goodsSupplyMapExplorerSummaryCopy as getGoodsSupplyMapExplorerSummaryCopy,
} from '../copy/goodsPageFa';
