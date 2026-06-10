export const GOODS_CATEGORY_SEARCH_MODE = {
  simple: 'simple',
  deep: 'deep',
};

export function filterMainCategoriesByQuery(categories = [], query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return categories;
  return categories.filter((category) => category.title?.toLowerCase().includes(normalized));
}

export function searchCategoriesDeep(categories = [], query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { mains: categories, subs: [] };
  }

  const mains = [];
  const subs = [];

  categories.forEach((category) => {
    if (category.title?.toLowerCase().includes(normalized)) {
      mains.push(category);
      return;
    }

    const subcategories = category.subcategories || category.items || [];
    subcategories.forEach((subcategory) => {
      if (subcategory.title?.toLowerCase().includes(normalized)) {
        subs.push({ subcategory, parent: category });
      }
    });
  });

  return { mains, subs };
}

export function buildCategorySearchSummary({ query, deepResults }) {
  const trimmed = query.trim();
  if (!trimmed) return '';

  const count = deepResults.mains.length + deepResults.subs.length;
  if (count === 0) return 'موردی پیدا نشد';
  return `${count.toLocaleString('fa-IR')} مورد پیدا شد`;
}
