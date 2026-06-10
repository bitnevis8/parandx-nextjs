export const EXPERT_MARKER_STYLES = {
  pin: 'pin',
  avatar: 'avatar',
  category: 'category',
};

export const EXPERT_MARKER_STYLE_OPTIONS = [
  { value: EXPERT_MARKER_STYLES.pin, label: 'مارکر معمولی' },
  { value: EXPERT_MARKER_STYLES.avatar, label: 'تصویر پروفایل متخصص' },
  { value: EXPERT_MARKER_STYLES.category, label: 'آیکون دسته / زیردسته' },
];

const VALID_STYLES = new Set(Object.values(EXPERT_MARKER_STYLES));

export function resolveCityExpertMarkerStyle(city) {
  const raw = String(city?.mapExpertMarkerStyle || '').trim().toLowerCase();
  return VALID_STYLES.has(raw) ? raw : EXPERT_MARKER_STYLES.pin;
}
