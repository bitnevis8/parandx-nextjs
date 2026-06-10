/** عبارت جستجوی بهینه برای زیردسته‌های بازار کالا */

const GOODS_SEARCH_OVERRIDES = {
  supermarket: ['سوپرمارکت', 'فروشگاه مواد غذایی'],
  hypermarket: ['هایپرمارکت'],
  restaurant: ['رستوران'],
  'fast-food': ['فست فود'],
  cafe: ['کافه'],
  'coffee-shop': ['کافی شاپ', 'کافه'],
  pharmacy: ['داروخانه'],
  'mobile-store': ['فروشگاه موبایل'],
  'auto-parts-store': ['قطعات خودرو', 'لوازم یدکی خودرو'],
  'gold-shop': ['طلافروشی'],
  'pet-shop': ['پت شاپ', 'فروشگاه حیوانات'],
  bookstore: ['کتابفروشی'],
  'flower-shop': ['گل فروشی'],
  'sportswear': ['پوشاک ورزشی'],
  'home-appliance-store': ['لوازم خانگی'],
};

export function resolveGoodsSubCategorySearchQueue(subItem) {
  const title = String(subItem?.title || '').trim();
  const slug = String(subItem?.slug || '').trim();
  const overrides = GOODS_SEARCH_OVERRIDES[slug];
  const queue = [];

  if (Array.isArray(overrides)) {
    overrides.forEach((term) => {
      const t = String(term || '').trim();
      if (t && !queue.includes(t)) queue.push(t);
    });
  }

  if (title && !queue.includes(title)) queue.push(title);

  return queue.length ? queue : title ? [title] : [];
}
