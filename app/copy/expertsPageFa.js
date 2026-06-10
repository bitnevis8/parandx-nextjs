/** صفحهٔ `/experts` — راهنما برای مشتری (نه فهرست همه) */
export const EXPERTS_INDEX = {
  badge: 'راهنمای مشتری',
  title: 'اینجا لیست همهٔ متخصص‌ها نیست',
  lead:
    'پرندیکس بازار کار و شبکهٔ حرفه‌ای است؛ برای پیدا کردن متخصص، مسیرهای زیر راحت‌تر از ورق زدن یک فهرست بلند است.',
  profileNote:
    'لینک پروفایل هر متخصص (مثلاً بعد از جستجو یا معرفی) همچنان فعال است — مثل /experts/شناسه یا آدرس اختصاصی پروفایل.',
  categoryTitle: (name, city) => `دنبال متخصص ${name} در ${city} هستید؟`,
  categoryLead:
    'به‌جای لیست، از نقشه، دستهٔ خدمات یا ثبت کار استفاده کنید تا همان‌هایی که مناسب‌اند خودشان پیشنهاد بدهند.',

  pathSearchTitle: 'جستجو',
  pathSearchDesc: 'اسم متخصص یا نوع خدمت',
  pathSearchHref: '/search',

  pathMapTitle: 'نقشه',
  pathMapDesc: 'متخصص‌های نزدیک روی نقشه',
  pathMapHref: '/#home-path-map',

  pathCategoriesTitle: 'دستهٔ خدمات',
  pathCategoriesDesc: 'بر اساس تخصص انتخاب کنید',
  pathCategoriesHref: '/#home-path-categories',

  pathRequestTitle: 'ثبت کار',
  pathRequestDesc: 'پیشنهاد از چند متخصص — بدون لیست زدن',
  pathRequestHref: '/requests/new',

  expertJoinTitle: 'خودتان متخصص هستید؟',
  expertJoinLead: 'ثبت‌نام، پروفایل حرفه‌ای و شبکهٔ هم‌صنفی‌ها در داشبورد است — نه در این صفحه.',
  expertJoinCta: 'عضویت متخصص',
  expertJoinHref: '/auth',
  expertDashboardCta: 'ورود به داشبورد',
  expertDashboardHref: '/dashboard?tab=expert-display',

  homeCta: 'بازگشت به صفحهٔ اصلی',
  homeHref: '/',
};
