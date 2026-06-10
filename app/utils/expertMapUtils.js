import { getMapSelectionFromAddressData } from './geojsonBoundary';
import { getPinFromAddressData } from './profileAddressUtils';

export function flattenMainCategoryOptions(categories = []) {
  return categories
    .filter((main) => (main.subcategories || []).length > 0)
    .map((main) => ({
      id: main.id,
      title: main.title,
      slug: main.slug,
      searchText: `${main.title} ${main.slug}`.toLowerCase(),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fa'));
}

export function flattenSubcategoryOptions(categories = [], parentSlug = '') {
  if (!parentSlug) return [];
  const main = categories.find((c) => c.slug === parentSlug);
  if (!main) return [];
  return (main.subcategories || [])
    .map((sub) => ({
      id: sub.id,
      title: sub.title,
      slug: sub.slug,
      parentTitle: main.title,
      parentSlug: main.slug,
      searchText: `${sub.title} ${main.title} ${sub.slug}`.toLowerCase(),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fa'));
}

export function flattenServiceOptions(categories = []) {
  const list = [];
  categories.forEach((main) => {
    (main.subcategories || []).forEach((sub) => {
      list.push({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        parentTitle: main.title,
        parentSlug: main.slug,
        searchText: `${sub.title} ${main.title} ${sub.slug}`.toLowerCase(),
      });
    });
  });
  return list.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
}

export function findParentSlugForService(categories = [], serviceSlug = '') {
  if (!serviceSlug) return '';
  const main = categories.find((c) =>
    (c.subcategories || []).some((sub) => sub.slug === serviceSlug)
  );
  return main?.slug || '';
}

function normalizeSearchTerm(text) {
  if (text == null) return '';
  return String(text).trim().replace(/\s+/g, ' ').toLowerCase();
}

export function filterServiceOptions(services, query) {
  const q = normalizeSearchTerm(query);
  if (!q) return services;
  return services.filter((s) => {
    const haystack = (s.searchText || s.title || '').toLowerCase();
    return haystack.includes(q) || haystack.replace(/\s/g, '').includes(q.replace(/\s/g, ''));
  });
}

export function expertProvidesService(expert, serviceSlug) {
  if (!serviceSlug || !expert) return false;
  return (expert.categories || []).some((c) => c.slug === serviceSlug);
}

export function expertProvidesMainCategory(expert, parentSlug, categories = []) {
  if (!parentSlug || !expert) return false;
  const main = categories.find((c) => c.slug === parentSlug);
  if (!main) return false;
  const subSlugs = new Set((main.subcategories || []).map((sub) => sub.slug));
  if (!subSlugs.size) return false;
  return (expert.categories || []).some((c) => subSlugs.has(c.slug));
}

export function addressMatchesCity(addressData, citySlug, { addressCityId, mapCityId } = {}) {
  if (!citySlug) return true;

  if (!addressData) {
    if (addressCityId != null && mapCityId != null) {
      return Number(addressCityId) === Number(mapCityId);
    }
    return false;
  }

  const slug = addressData?.citySlug || addressData?.locationData?.citySlug;
  if (slug) return slug === citySlug;

  if (addressCityId != null && mapCityId != null) {
    return Number(addressCityId) === Number(mapCityId);
  }

  return Boolean(getPinFromAddressData(addressData));
}

export function addressMatchesRegion(addressData, sectionId, neighborhoodId) {
  if (!sectionId && !neighborhoodId) return true;
  if (!addressData) return false;
  const sel = getMapSelectionFromAddressData(addressData);
  if (neighborhoodId) return sel.neighborhoodId === neighborhoodId;
  if (sectionId) return sel.sectionId === sectionId;
  return false;
}

export function expertMatchesRegion(expert, sectionId, neighborhoodId, citySlug, mapCityId) {
  const addressQualifies = (data, addressCityId) => {
    if (!addressMatchesCity(data, citySlug, { addressCityId, mapCityId })) return false;
    return addressMatchesRegion(data, sectionId, neighborhoodId);
  };

  if (Array.isArray(expert.addresses)) {
    for (const addr of expert.addresses) {
      if (addressQualifies(addr?.addressData, addr.cityId)) return true;
    }
  }

  return addressQualifies(expert.locationData, expert.cityId);
}

export function filterExpertsForMap(
  experts,
  { serviceSlug, parentSlug, categories = [], sectionId, neighborhoodId, citySlug, mapCityId }
) {
  return (experts || []).filter((expert) => {
    let matchesCategory = true;
    if (serviceSlug) {
      matchesCategory = expertProvidesService(expert, serviceSlug);
    } else if (parentSlug) {
      matchesCategory = expertProvidesMainCategory(expert, parentSlug, categories);
    }
    return (
      matchesCategory &&
      expertMatchesRegion(expert, sectionId, neighborhoodId, citySlug, mapCityId)
    );
  });
}

function coordsKey(lat, lng) {
  return `${Number(lat).toFixed(4)}-${Number(lng).toFixed(4)}`;
}

function resolveExpertAvatarUrl(expert) {
  if (expert?.avatar) return expert.avatar;
  const user = expert?.user;
  if (user?.avatar) return user.avatar;
  return user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
}

export function resolveExpertCategoryDisplay(
  expert,
  { serviceSlug = '', parentSlug = '', categories = [] } = {}
) {
  const expertCats = expert?.categories || [];

  if (serviceSlug) {
    const matched = expertCats.find((c) => c.slug === serviceSlug);
    if (matched) {
      return { icon: matched.icon || '•', title: matched.title || '' };
    }
    const fromTree = categories
      .flatMap((main) => main.subcategories || [])
      .find((sub) => sub.slug === serviceSlug);
    return { icon: fromTree?.icon || '•', title: fromTree?.title || '' };
  }

  if (parentSlug) {
    const main = categories.find((c) => c.slug === parentSlug);
    const subSlugs = new Set((main?.subcategories || []).map((sub) => sub.slug));
    const matched = expertCats.find((c) => subSlugs.has(c.slug));
    if (matched) {
      return { icon: matched.icon || main?.icon || '•', title: matched.title || '' };
    }
    return { icon: main?.icon || expertCats[0]?.icon || '•', title: main?.title || '' };
  }

  const first = expertCats[0];
  return { icon: first?.icon || '•', title: first?.title || '' };
}

export function collectExpertMapMarkers(
  experts,
  {
    citySlug,
    mapCityId,
    sectionId,
    neighborhoodId,
    serviceSlug = '',
    parentSlug = '',
    categories = [],
  } = {}
) {
  const markers = [];
  const cityMatchOpts = { mapCityId };

  (experts || []).forEach((expert) => {
    const firstName = String(expert.user?.firstName || '').trim();
    const lastName = String(expert.user?.lastName || '').trim();
    const name =
      [firstName, lastName].filter(Boolean).join(' ') ||
      expert.displayName ||
      'این متخصص';

    const candidates = [];

    if (Array.isArray(expert.addresses)) {
      expert.addresses.forEach((addr) => {
        const data = addr?.addressData;
        if (!addressMatchesCity(data, citySlug, { ...cityMatchOpts, addressCityId: addr.cityId })) {
          return;
        }
        if (!addressMatchesRegion(data, sectionId, neighborhoodId)) return;
        const pin = getPinFromAddressData(data);
        if (pin?.lat == null || pin?.lng == null) return;
        candidates.push({ pin, isPrimary: Boolean(addr?.isPrimary) });
      });
    }

    const legacy = expert.locationData;
    if (
      legacy &&
      addressMatchesCity(legacy, citySlug, { ...cityMatchOpts, addressCityId: expert.cityId }) &&
      addressMatchesRegion(legacy, sectionId, neighborhoodId)
    ) {
      const pin = getPinFromAddressData(legacy);
      const legacyKey = pin?.lat != null ? coordsKey(pin.lat, pin.lng) : null;
      const alreadyFromAddress =
        legacyKey && candidates.some((c) => coordsKey(c.pin.lat, c.pin.lng) === legacyKey);
      if (pin?.lat != null && !alreadyFromAddress) {
        candidates.push({ pin, isPrimary: true });
      }
    }

    const chosen = candidates.find((c) => c.isPrimary) || candidates[0];
    if (!chosen) return;

    const categoryDisplay = resolveExpertCategoryDisplay(expert, {
      serviceSlug,
      parentSlug,
      categories,
    });

    markers.push({
      expertId: expert.id,
      lat: Number(chosen.pin.lat),
      lng: Number(chosen.pin.lng),
      name,
      firstName,
      lastName,
      href: `/experts/${expert.id}`,
      avatarUrl: resolveExpertAvatarUrl(expert),
      categoryIcon: categoryDisplay.icon,
      categoryTitle: categoryDisplay.title,
    });
  });

  return markers;
}

export function buildMapExplorerStats(filteredExperts, markers) {
  const expertCount = filteredExperts?.length ?? 0;
  const markerCount = markers?.length ?? 0;
  const expertsOnMap = new Set((markers || []).map((m) => m.expertId)).size;
  return { expertCount, markerCount, expertsOnMap };
}

export { mapExplorerSummaryCopy as getMapExplorerSummaryCopy } from '../copy/friendlyFa';

export function buildRegionLabel({ cityName, sectionName, neighborhoodName, sectionId, neighborhoodId }) {
  if (neighborhoodName) return neighborhoodName;
  if (sectionName) return sectionName;
  if (neighborhoodId || sectionId) return 'منطقه انتخاب‌شده';
  return cityName ? `کل ${cityName}` : 'کل شهر';
}
