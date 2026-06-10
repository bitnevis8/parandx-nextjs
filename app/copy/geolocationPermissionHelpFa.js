/** راهنمای فعال‌کردن موقعیت مکانی — Chrome و Firefox */

export const GEOLOCATION_HELP_TITLE = 'فعال‌کردن موقعیت مکانی';

export const GEOLOCATION_HELP_LEAD =
  'اگر پنجرهٔ «اجازه می‌دهید؟» نیامد یا قبلاً «مسدود» زده‌اید، مراحل زیر را انجام دهید و بعد صفحه را یک‌بار رفرش کنید.';

export const GEOLOCATION_HELP_FOOTER =
  'بعد از Allow/اجازه، این پنجره را ببندید، صفحه را رفرش کنید و دوباره روی دکمهٔ «موقعیت من» بزنید.';

export const GEOLOCATION_INSECURE_NOTE =
  'روی http (مثل localhost یا IP بدون قفل) کروم موبایل معمولاً GPS را نمی‌دهد. برای تست روی گوشی از https یا دامنهٔ واقعی استفاده کنید.';

export const GEOLOCATION_BROWSER_GUIDES = {
  chrome: {
    id: 'chrome',
    label: 'Google Chrome (کروم)',
    mobile: [
      'بالای صفحه کنار آدرس، روی آیکون «ⓘ داخل مثلث» بزنید (اگر «اتصال امن نیست» می‌نویسد، همان است).',
      'در این منو ممکن است فقط «کوکی‌ها و داده‌های سایت»، «آخرین بازدید» و وضعیت اتصال را ببینید — روی localhost این طبیعی است و Location اینجا نیست.',
      'منوی ⋮ (سه‌نقطه) بالا → Settings / تنظیمات → Site settings / تنظیمات سایت → Location / موقعیت مکانی.',
      'سایت فعلی را در لیست پیدا کنید (مثلاً localhost یا IP) و روی Allow / اجازه بگذارید؛ یا All sites / همه سایت‌ها → همان آدرس → Location → Allow.',
      'GPS گوشی را روشن کنید (تنظیمات اندروید → Location).',
      'اگر سایت http است و Location اصلاً فعال نمی‌شود، با https یا دامنهٔ واقعی دوباره تست کنید.',
    ],
    desktop: [
      'کنار نوار آدرس (بالای مرورگر) روی آیکون داخل chip / دایره بزنید — معمولاً 🔒 (HTTPS) یا ⓘ.',
      'در منوی بازشده معمولاً مستقیم می‌بینید: Location / موقعیت مکانی، Notifications / اعلان‌ها، Cookies / کوکی‌ها و Site settings / تنظیمات سایت.',
      'روی Location / موقعیت مکانی بزنید و Allow / اجازه را انتخاب کنید.',
      'اگر Location جدا نبود: Site settings / تنظیمات سایت → Location → Allow.',
      'صفحه را رفرش کنید (F5) و دوباره «موقعیت من» را بزنید.',
    ],
  },
  firefox: {
    id: 'firefox',
    label: 'Mozilla Firefox (فایرفاکس)',
    mobile: [
      'کنار آدرس روی آیکون قفل 🔒 یا سپر / ⓘ بزنید.',
      'اگر «اتصال امن نیست» بود، ممکن است Location در همان منو نباشد — منوی ☰ → Settings → Site permissions → Location.',
      'آدرس سایت فعلی را پیدا کنید و Access your location را روی Allow بگذارید.',
      'GPS گوشی را روشن کنید. روی http/local-host گاهی GPS کار نمی‌کند؛ با https تست کنید.',
    ],
    desktop: [
      'کنار آدرس روی آیکون قفل 🔒 یا (i) بزنید.',
      'Permissions / مجوزها → Access your location / دسترسی به موقعیت → Allow / اجازه.',
      'یا: Connection secure → More information → تب Permissions → Location → Allow.',
      'صفحه را رفرش کنید (F5).',
    ],
  },
};

export function detectBrowserFamily() {
  if (typeof navigator === 'undefined') return 'chrome';
  const ua = navigator.userAgent || '';
  if (/Firefox|FxiOS/i.test(ua)) return 'firefox';
  if (/Chrome|CriOS|Chromium/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua)) return 'chrome';
  return 'chrome';
}

export function isSecureWebContext() {
  if (typeof window === 'undefined') return true;
  return Boolean(window.isSecureContext);
}
