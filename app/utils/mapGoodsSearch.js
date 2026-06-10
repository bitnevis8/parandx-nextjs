import { buildMapPlaceSearchTerm, searchMapPlaces } from './mapPlaceSearch';
import { resolveGoodsSubCategorySearchQueue } from './mapGoodsSearchTerms';

export async function searchMapPlacesForGoodsSubCategory({
  subItem,
  lat,
  lng,
  cityName = '',
  categoryId = '',
}) {
  const terms = resolveGoodsSubCategorySearchQueue(subItem);
  let lastResponse = { success: true, items: [], message: 'نتیجه‌ای پیدا نشد.' };

  for (const term of terms) {
    const response = await searchMapPlaces({
      term: buildMapPlaceSearchTerm(term, cityName),
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
