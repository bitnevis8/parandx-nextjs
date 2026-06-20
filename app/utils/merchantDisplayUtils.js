export function merchantDisplayName(merchant) {
  return merchant?.storeName || merchant?.companyName || 'فروشگاه';
}

/** مسیر کوتاه صفحه فروشگاه — مثلاً /pourdian-mobile */
export function merchantStorePagePath(merchant) {
  const slug = String(merchant?.storeSlug || '').trim().toLowerCase();
  return slug ? `/${slug}` : '/your-store';
}

/** لینک کامل صفحه اختصاصی فروشگاه */
export function merchantStorePageUrlFull(merchant) {
  const slug = String(merchant?.storeSlug || '').trim().toLowerCase() || 'your-store';
  return `parandx.com/goods/stores/${slug}`;
}

/** مسیر عمومی صفحه فروشگاه */
export function merchantStorePublicHref(merchant) {
  const slug = String(merchant?.storeSlug || '').trim().toLowerCase();
  if (slug) return `/goods/stores/${slug}`;
  if (merchant?.id != null) return `/goods/stores/${merchant.id}`;
  return '/goods';
}

export function merchantCategoryMeta(merchant) {
  const cats = merchant?.categories || [];
  const primary =
    cats.find((c) => c.slug === merchant.primaryCategorySlug) ||
    cats.find((c) => c.parentId) ||
    cats[0];
  return {
    icon: primary?.icon || '🏪',
    title: primary?.title || '',
  };
}

export function filterMerchantSubcategories(subcategories = []) {
  return subcategories.filter((s) => !s.categoryUsage || s.categoryUsage === 'merchant');
}

/** مغازه باز است — online/open/busy */
export function isMerchantStoreOpen(merchant) {
  const status = String(merchant?.presenceStatus || 'offline').toLowerCase();
  return status === 'online' || status === 'open' || status === 'busy';
}

export function merchantStoreCardImage(merchant) {
  return isMerchantStoreOpen(merchant)
    ? '/images/store-open.png'
    : '/images/store-close.png';
}

/** امتیاز نمایشی — فعلاً فیک؛ بعداً از API نظرات می‌آید */
export function getMerchantDisplayRating(merchant) {
  const fromApi = Number(merchant?.rating);
  if (Number.isFinite(fromApi) && fromApi > 0) {
    return Math.min(5, Math.max(1, Math.round(fromApi * 10) / 10));
  }

  const id = Number(merchant?.id) || 0;
  const seed = (id * 7919 + 104729) % 14;
  return Math.round((3.5 + seed / 10) * 10) / 10;
}

export function formatMerchantRating(rating) {
  return Number(rating).toLocaleString('fa-IR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/** آدرس کوتاه برای نمایش روی کارت فروشگاه */
export function merchantDisplayAddress(merchant) {
  const fromAddresses = merchant?.addresses?.find((a) => a.isPrimary)?.line
    || merchant?.addresses?.find((a) => a.isPrimary)?.addressLine
    || merchant?.addresses?.[0]?.line
    || merchant?.addresses?.[0]?.addressLine;

  const raw = String(fromAddresses || merchant?.location || '').trim();
  if (!raw) return '';

  return raw.replace(/^اهواز[،,\s]+/u, '').trim();
}
