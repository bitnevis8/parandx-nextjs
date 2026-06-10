/** ده دستهٔ اصلی پرتقاضا در بازار کالا — ترتیب = اولویت نمایش */
export const GOODS_POPULAR_CATEGORY_SLUGS = [
  'food-grocery',
  'restaurant-food',
  'fashion-clothing',
  'mobile-computer-digital',
  'household-appliances',
  'beauty-health',
  'vehicle-motorcycle',
  'furniture-decoration',
  'bags-shoes-leather',
  'books-stationery',
];

export function pickPopularCategories(categories = [], popularSlugs = GOODS_POPULAR_CATEGORY_SLUGS) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  return popularSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);
}
