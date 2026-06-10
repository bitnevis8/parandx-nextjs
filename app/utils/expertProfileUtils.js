import {
  defaultPhoneChannels,
  defaultSocialLinks,
  normalizePhoneChannels,
  normalizeSocialLinks,
} from './contactChannelsUtils';

export const SERVICE_RADIUS_OPTIONS = [
  { value: '10km', label: '۱۰ کیلومتر' },
  { value: '20km', label: '۲۰ کیلومتر' },
  { value: '50km', label: '۵۰ کیلومتر' },
  { value: 'city', label: 'تمام شهر' },
  { value: 'province', label: 'تمام استان' },
];

export const PRESENCE_STATUS_OPTIONS = [
  { value: 'online', label: 'آنلاین', dotClass: 'bg-emerald-500', activeClass: 'bg-emerald-600 text-white ring-emerald-600' },
  { value: 'offline', label: 'آفلاین', dotClass: 'bg-gray-400', activeClass: 'bg-gray-700 text-white ring-gray-700' },
  { value: 'busy', label: 'مشغول', dotClass: 'bg-amber-500', activeClass: 'bg-amber-600 text-white ring-amber-600' },
  { value: 'on_leave', label: 'در مرخصی', dotClass: 'bg-sky-500', activeClass: 'bg-sky-600 text-white ring-sky-600' },
];

export const WEEK_DAYS = [
  { key: 'saturday', label: 'شنبه' },
  { key: 'sunday', label: 'یکشنبه' },
  { key: 'monday', label: 'دوشنبه' },
  { key: 'tuesday', label: 'سه‌شنبه' },
  { key: 'wednesday', label: 'چهارشنبه' },
  { key: 'thursday', label: 'پنجشنبه' },
  { key: 'friday', label: 'جمعه' },
];

export const MAX_PORTFOLIO_ITEMS = 5;

export const ACTIVITY_TYPE_OPTIONS = [
  { key: 'mobile', label: 'اعزام به محل مشتری' },
  { key: 'office', label: 'مراجعه به دفتر' },
  { key: 'online', label: 'آنلاین' },
];

export function defaultActivityTypes() {
  return { mobile: true, office: false, online: false };
}

export function normalizeActivityTypes(raw, legacyExpert) {
  if (raw && typeof raw === 'object') {
    return {
      mobile: Boolean(raw.mobile),
      office: Boolean(raw.office),
      online: Boolean(raw.online),
    };
  }
  return {
    mobile: legacyExpert?.isMobile !== false,
    office: Boolean(legacyExpert?.isShop),
    online: false,
  };
}

export function formatActivityTypesSummary(types) {
  if (!types) return null;
  const labels = ACTIVITY_TYPE_OPTIONS.filter((o) => types[o.key]).map((o) => o.label);
  return labels.length ? labels.join(' · ') : null;
}

export function defaultWorkScheduleDay(enabled = false) {
  return { enabled, start: '09:00', end: '18:00' };
}

export function defaultWorkSchedule() {
  return Object.fromEntries(
    WEEK_DAYS.map((d) => [d.key, defaultWorkScheduleDay(d.key !== 'friday')])
  );
}

export function normalizeWorkSchedule(raw) {
  const base = defaultWorkSchedule();
  if (!raw || typeof raw !== 'object') return base;

  WEEK_DAYS.forEach(({ key }) => {
    const day = raw[key];
    if (day && typeof day === 'object') {
      base[key] = {
        enabled: Boolean(day.enabled),
        start: typeof day.start === 'string' ? day.start : base[key].start,
        end: typeof day.end === 'string' ? day.end : base[key].end,
      };
    }
  });
  return base;
}

export function defaultPortfolioItem() {
  return {
    title: '',
    imageUrl: null,
    videoUrl: null,
    instagramUrl: '',
    websiteUrl: '',
  };
}

export function normalizePortfolio(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_PORTFOLIO_ITEMS).map((item) => ({
    title: item?.title || '',
    imageUrl: item?.imageUrl || null,
    videoUrl: item?.videoUrl || null,
    instagramUrl: item?.instagramUrl || '',
    websiteUrl: item?.websiteUrl || '',
  }));
}

export function getServiceRadiusLabel(value) {
  return SERVICE_RADIUS_OPTIONS.find((o) => o.value === value)?.label || null;
}

export function getPresenceStatusLabel(value) {
  return PRESENCE_STATUS_OPTIONS.find((o) => o.value === value)?.label || null;
}

/** رنگ‌ها و برچسب برای نمایش وضعیت روی آواتار */
export function getPresenceStatusMeta(value) {
  const status = value || 'offline';
  const opt =
    PRESENCE_STATUS_OPTIONS.find((o) => o.value === status) ||
    PRESENCE_STATUS_OPTIONS.find((o) => o.value === 'offline');

  const ringClass =
    status === 'online'
      ? 'ring-emerald-400'
      : status === 'busy'
        ? 'ring-amber-400'
        : status === 'on_leave'
          ? 'ring-sky-400'
          : 'ring-slate-300';

  const badgeClass =
    status === 'online'
      ? 'bg-emerald-600'
      : status === 'busy'
        ? 'bg-amber-600'
        : status === 'on_leave'
          ? 'bg-sky-600'
          : 'bg-slate-500';

  const shortLabel = status === 'on_leave' ? 'مرخصی' : opt.label;

  return {
    value: status,
    label: opt.label,
    shortLabel,
    dotClass: opt.dotClass,
    ringClass,
    badgeClass,
    pulse: status === 'online',
  };
}

export function formatWorkScheduleSummary(schedule) {
  const normalized = normalizeWorkSchedule(schedule);
  const active = WEEK_DAYS.filter(({ key }) => normalized[key]?.enabled);
  if (!active.length) return null;

  return active
    .map(({ key, label }) => {
      const day = normalized[key];
      return `${label} ${day.start}–${day.end}`;
    })
    .join(' · ');
}

export const EXPERT_ACCOUNT_TYPE_OPTIONS = [
  { value: 'individual', label: 'شخص حقیقی' },
  { value: 'business', label: 'شخص حقوقی' },
];

export function normalizeAccountType(value, legacyExpert) {
  if (value === 'individual' || value === 'business') return value;
  if (legacyExpert?.isShop && legacyExpert?.shopInfo?.name) return 'business';
  return 'individual';
}

export function getAccountTypeLabel(value) {
  return EXPERT_ACCOUNT_TYPE_OPTIONS.find((o) => o.value === value)?.label || null;
}

export function getUserFullName(user) {
  if (!user) return '';
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
}

/** نام عمومی: نام‌خانوادگی سپس نام (مطابق عرف فارسی) */
export function getUserPublicDisplayName(user) {
  if (!user) return '';
  return [user.lastName, user.firstName].filter(Boolean).join(' ').trim();
}

/** نام نمایشی فرم: مقدار ذخیره‌شده یا نام کامل پروفایل شخصی */
export function defaultExpertDisplayName(profile) {
  const stored = profile?.displayName?.trim();
  if (stored) return stored;
  return getUserFullName(profile?.user);
}

export function getExpertPublicName(profile) {
  if (!profile) return null;
  if (normalizeAccountType(profile?.accountType, profile) === 'business') {
    return profile.companyName || profile.shopInfo?.name || null;
  }
  const stored = profile?.displayName?.trim();
  if (stored) return stored;
  const name = getUserPublicDisplayName(profile?.user);
  return name || null;
}

export const MAX_CONTACT_MOBILES = 5;
export const MAX_CONTACT_PHONES = 5;

export const PERSONAL_MOBILE_CONTACT_ID = 'personal-mobile';
export const PERSONAL_MOBILE_CONTACT_LABEL = 'موبایل شخصی';

/** موبایل پروفایل شخصی به‌عنوان اولین موبایل تماس تخصصی */
export function mergePersonalMobileIntoContactMobiles(contactMobiles, userMobile) {
  const personal = String(userMobile || '').replace(/\D/g, '').slice(0, 11);

  const others = normalizeContactMobiles(contactMobiles).filter(
    (item) => item.number.length >= 10 && item.number !== personal
  );

  if (personal.length < 10) {
    return others.slice(0, MAX_CONTACT_MOBILES);
  }

  const existingPersonal = normalizeContactMobiles(contactMobiles).find(
    (item) => item.id === PERSONAL_MOBILE_CONTACT_ID
  );

  return [
    {
      id: PERSONAL_MOBILE_CONTACT_ID,
      number: personal,
      label: PERSONAL_MOBILE_CONTACT_LABEL,
      channels: normalizePhoneChannels(existingPersonal?.channels),
    },
    ...others,
  ].slice(0, MAX_CONTACT_MOBILES);
}

export function createContactEntry(label = '') {
  return {
    id: `cnt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    number: '',
    label,
    channels: defaultPhoneChannels(),
  };
}

export function normalizeContactEntries(raw, max = MAX_CONTACT_MOBILES) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, max).map((item) => ({
    id: item?.id || createContactEntry().id,
    number: String(item?.number || '').replace(/\D/g, '').slice(0, 11),
    label: typeof item?.label === 'string' ? item.label : '',
    channels: normalizePhoneChannels(item?.channels),
  }));
}

export { normalizeSocialLinks, defaultSocialLinks };

export function normalizeContactMobiles(raw) {
  return normalizeContactEntries(raw, MAX_CONTACT_MOBILES);
}

export function normalizeContactPhones(raw) {
  return normalizeContactEntries(raw, MAX_CONTACT_PHONES);
}

export function contactEntriesForSave(list, max) {
  return normalizeContactEntries(list, max).filter((item) => item.number.length >= 10);
}

export function formatContactEntriesSummary(list) {
  const items = normalizeContactEntries(list);
  const filled = items.filter((item) => item.number);
  if (!filled.length) return null;
  return filled
    .map((item) => (item.label ? `${item.label}: ${item.number}` : item.number))
    .join(' · ');
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toPersianDigits(value) {
  return String(value ?? '').replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** نمایش خوانا برای موبایل/تلفن ایران در هدر و کارت‌ها */
export function formatIranPhoneDisplay(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('09')) {
    return toPersianDigits(`${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`);
  }
  if (digits.length >= 10) {
    return toPersianDigits(digits);
  }
  return '';
}

/** اولین شمارهٔ تماس تخصصی برای نمایش عمومی (ترجیح موبایل ثبت‌شده در پروفایل تخصصی) */
export function getPrimaryExpertContactPhone(contactMobiles, contactPhones, userMobile) {
  const mobiles = mergePersonalMobileIntoContactMobiles(contactMobiles, userMobile).filter(
    (item) => item.number.length >= 10
  );
  const phones = normalizeContactPhones(contactPhones).filter((item) => item.number.length >= 10);

  const specialistMobile = mobiles.find((m) => m.id !== PERSONAL_MOBILE_CONTACT_ID);
  const pick = specialistMobile || mobiles[0] || phones[0];
  if (!pick) return null;

  const isPhone = !specialistMobile && !mobiles[0] && Boolean(phones[0]);
  const label = pick.label?.trim();
  return {
    number: pick.number,
    label: label || (isPhone ? 'تلفن' : 'موبایل'),
    type: isPhone ? 'phone' : 'mobile',
    extraCount: Math.max(0, mobiles.length + phones.length - 1),
    channels: pick.channels,
    id: pick.id,
  };
}
