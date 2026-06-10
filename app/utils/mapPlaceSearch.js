/** جستجوی مکان روی نقشه — از API داخلی Next.js */

import { resolveSubCategorySearchQueue } from './mapPlaceSearchTerms';

export function buildMapPlaceSearchTerm(term, cityName = '') {
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

export async function searchMapPlaces({
  term,
  lat,
  lng,
  cityName = '',
  categoryId = '',
  subCategoryId = '',
  subCategoryTitle = '',
}) {
  const query = String(term || '').trim();
  if (query.length < 2) {
    return { success: false, items: [], message: 'حداقل ۲ حرف وارد کنید.' };
  }

  const params = new URLSearchParams({
    term: query,
    lat: String(lat),
    lng: String(lng),
  });
  if (cityName) params.set('cityName', cityName);
  if (categoryId) params.set('categoryId', categoryId);
  if (subCategoryId) params.set('subCategoryId', subCategoryId);
  if (subCategoryTitle) params.set('subCategoryTitle', subCategoryTitle);

  const res = await fetch(`/api/map/search?${params.toString()}`);
  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    return {
      success: false,
      items: [],
      message: json.message || 'جستجو انجام نشد.',
    };
  }

  const items = json.items || [];

  return {
    success: true,
    items,
    count: json.count ?? items.length,
    provider: json.provider,
    message: items.length ? '' : json.message || 'نتیجه‌ای پیدا نشد.',
  };
}

export async function searchMapPlacesForSubCategory({
  subItem,
  lat,
  lng,
  cityName = '',
  categoryId = '',
}) {
  const terms = resolveSubCategorySearchQueue(subItem);
  let lastResponse = { success: true, items: [], message: 'نتیجه‌ای پیدا نشد.' };

  for (const term of terms) {
    const response = await searchMapPlaces({
      term,
      lat,
      lng,
      cityName,
      categoryId,
      subCategoryId: subItem?.id || '',
      subCategoryTitle: subItem?.title || '',
    });

    lastResponse = response;

    if (response.success && response.items?.length) {
      return response;
    }
  }

  return lastResponse;
}
