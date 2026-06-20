export const MERCHANT_ACTIVITY_TYPE_OPTIONS = [
  { key: 'inStore', label: 'خرید حضوری از مغازه' },
  { key: 'pickup', label: 'تحویل در محل (بدون ارسال)' },
  { key: 'delivery', label: 'ارسال به آدرس مشتری' },
];

/** نوع حساب فروشگاه — برچسب مناسب کاسب، نه متخصص */
export const MERCHANT_ACCOUNT_TYPE_OPTIONS = [
  { value: 'individual', label: 'مغازه / شخص حقیقی' },
  { value: 'business', label: 'شرکت / شخص حقوقی' },
];

export const MERCHANT_DELIVERY_RADIUS_OPTIONS = [
  { value: '', label: 'محدوده مشخص نشده' },
  { value: 'city', label: 'کل شهر' },
  { value: '5km', label: 'تا ۵ کیلومتر' },
  { value: '10km', label: 'تا ۱۰ کیلومتر' },
  { value: '20km', label: 'تا ۲۰ کیلومتر' },
];

export function defaultMerchantActivityTypes() {
  return { inStore: true, delivery: false, pickup: false };
}

export function normalizeMerchantActivityTypes(raw) {
  if (!raw || typeof raw !== 'object') return defaultMerchantActivityTypes();
  return {
    inStore: Boolean(raw.inStore),
    delivery: Boolean(raw.delivery),
    pickup: Boolean(raw.pickup),
  };
}

export function formatMerchantActivityTypesSummary(types) {
  const normalized = normalizeMerchantActivityTypes(types);
  const labels = MERCHANT_ACTIVITY_TYPE_OPTIONS.filter((o) => normalized[o.key]).map((o) => o.label);
  return labels.length ? labels.join('، ') : '—';
}

export function defaultMerchantStoreName(profile) {
  const store = String(profile?.storeName || '').trim();
  if (store) return store;
  const company = String(profile?.companyName || '').trim();
  if (company) return company;
  const user = profile?.user;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  return name || '';
}

/** آدرس کوتاه صفحه فروشگاه — فقط حروف لاتین */
export function normalizeMerchantStoreSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 48);
}

export function isValidMerchantStoreSlug(value) {
  const raw = String(value || '').trim();
  if (!raw) return true;
  return /^[a-z0-9_-]+$/i.test(raw);
}

export function getMerchantDeliveryRadiusLabel(value) {
  return MERCHANT_DELIVERY_RADIUS_OPTIONS.find((o) => o.value === value)?.label || '—';
}

export {
  normalizeAccountType,
  normalizeWorkSchedule,
  defaultWorkSchedule,
  formatWorkScheduleSummary,
  normalizeContactMobiles,
  normalizeContactPhones,
  normalizeSocialLinks,
  defaultSocialLinks,
  contactEntriesForSave,
  mergePersonalMobileIntoContactMobiles,
  getAccountTypeLabel,
  getPresenceStatusLabel,
  PRESENCE_STATUS_OPTIONS,
  normalizePortfolio,
} from './expertProfileUtils';
