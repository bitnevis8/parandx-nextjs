/** تنظیمات فوتر — لینک‌ها و نمادهای اعتماد */

export const FOOTER_QUICK_LINKS = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/#home-path-categories', label: 'خدمات' },
  { href: '/#home-path-map', label: 'یافتن متخصص' },
  { href: '/search', label: 'جستجو' },
];

export const FOOTER_CUSTOMER_LINKS = [
  { href: '/requests/new', label: 'ثبت کار جدید' },
  { href: '/#home-path-categories', label: 'دسته‌بندی خدمات' },
];

export const FOOTER_EXPERT_LINKS = [
  { href: '/auth', label: 'ثبت‌نام متخصص' },
  { href: '/auth/login', label: 'ورود' },
];

export const FOOTER_CONTACT = [
  {
    href: 'tel:09380910512',
    label: '۰۹۳۸-۰۹۱۰۵۱۲',
    sublabel: 'پشتیبانی موبایل',
    dir: 'ltr',
  },
  {
    href: 'tel:02156956691',
    label: '۰۲۱-۵۶۹۵۶۶۹۱',
    sublabel: 'تلفن ثابت',
    dir: 'ltr',
  },
  {
    href: 'https://parandx.com',
    label: 'parandx.com',
    sublabel: 'وب‌سایت',
    external: true,
    dir: 'ltr',
  },
];

/** enamad id از layout */
export const ENAMAD_ID = '70429060';

/**
 * تصاویر را در public/images/trust/ قرار دهید.
 * پسوند png یا webp — هر دو در کامپوننت امتحان می‌شود.
 */
export const FOOTER_TRUST_BADGES = [
  {
    key: 'enamad',
    label: 'نماد اعتماد الکترونیکی (اینماد)',
    href: `https://trustseal.enamad.ir/?id=${ENAMAD_ID}`,
    src: '/images/trust/enamad.png',
    srcWebp: '/images/trust/enamad.webp',
  },
  {
    key: 'samandehi',
    label: 'نماد ساماندهی',
    href: '#',
    src: '/images/trust/samandehi.png',
    srcWebp: '/images/trust/samandehi.webp',
  },
];
