export function formatListingPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return '—';
  return `${n.toLocaleString('fa-IR')} تومان`;
}

export function getListingThumb(media) {
  if (!Array.isArray(media) || !media.length) return null;
  return media[0] || null;
}

export function getListingSellerLabel(listing) {
  if (listing?.merchant?.storeName) return listing.merchant.storeName;
  const seller = listing?.seller;
  if (!seller) return 'فروشنده';
  const name = [seller.firstName, seller.lastName].filter(Boolean).join(' ');
  return name || 'فروشنده';
}

export const LISTING_STATUS_LABELS = {
  draft: 'پیش‌نویس',
  published: 'منتشر شده',
  sold: 'فروخته شد',
  archived: 'بایگانی',
};

export const LISTING_STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-700 ring-gray-200',
  published: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  sold: 'bg-violet-50 text-violet-800 ring-violet-200',
  archived: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export const ACTIVE_LISTING_STATUSES = ['draft', 'published'];
