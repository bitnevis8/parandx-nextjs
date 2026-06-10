/** گزینه‌های فشرده‌سازی آپلود مدل نقشه (هم‌نام با API) */

export const MAP_MODEL_COMPRESSION_MODES = [
  'cleanup',
  'texture',
  'meshopt-low',
  'meshopt-medium',
  'meshopt-high',
  'draco',
];

export const DEFAULT_MAP_MODEL_COMPRESSION_MODE = 'meshopt-medium';

export const MAP_MODEL_COMPRESSION_OPTIONS = [
  {
    id: 'cleanup',
    label: 'پاکسازی (بدون فشرده‌سازی هندسی)',
    hint: 'حذف داده تکراری و بلااستفاده — بدون تغییر کیفیت ظاهری.',
  },
  {
    id: 'texture',
    label: 'فشرده‌سازی بافت (WebP)',
    hint: 'پاکسازی + تبدیل texture به WebP (حداکثر 1024px).',
  },
  {
    id: 'meshopt-low',
    label: 'Meshopt — سبک',
    hint: 'فشرده‌سازی geometry با Meshopt (سطح low) + بافت WebP. مناسب موبایل.',
  },
  {
    id: 'meshopt-medium',
    label: 'Meshopt — متوسط (پیشنهادی)',
    hint: 'تعادل خوب بین حجم و کیفیت. با model-viewer نقشه سازگار است.',
  },
  {
    id: 'meshopt-high',
    label: 'Meshopt — قوی',
    hint: 'بیشترین فشرده‌سازی Meshopt — حجم کمتر، ممکن است جزئیات کمتر شود.',
  },
  {
    id: 'draco',
    label: 'Draco — هندسه',
    hint: 'فشرده‌سازی geometry با Draco + بافت WebP. model-viewer دیکoder Draco را خودش لود می‌کند.',
  },
];

export function normalizeCompressionMode(value, fallback = DEFAULT_MAP_MODEL_COMPRESSION_MODE) {
  const mode = String(value || '').trim();
  if (MAP_MODEL_COMPRESSION_MODES.includes(mode)) return mode;
  return fallback;
}
