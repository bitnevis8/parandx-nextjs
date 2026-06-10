/**
 * توکن‌های بصری یکپارچه — صفحه اصلی
 */

export const HOME_CONTAINER = 'container mx-auto w-full max-w-6xl px-4 sm:px-6';

/** فاصله بین بلوک‌های اصلی (هیرو، نقشه، ثبت کار، متخصصین، تماس) — ۳۲px موبایل، ۴۰px دسکتاپ */
export const HOME_SECTION_STACK = 'flex flex-col gap-8 sm:gap-10';

/** بالای ستون سفید، بعد از نوار دسته‌ها */
export const HOME_MAIN_TOP = 'pt-8 sm:pt-10';

/** پایین ستون سفید، قبل از بخش خاکستری «خدمات» */
export const HOME_MAIN_BOTTOM = 'pb-10 sm:pb-12';

/** نوار دسته‌های سریع — padding داخلی */
export const HOME_CATEGORY_BAND = 'scroll-mt-28 border-b border-gray-200 bg-gray-50';

export const HOME_CATEGORY_BAND_PAD = 'py-4 sm:py-5';

/** بخش تمام‌عرض با پس‌زمینه خاکستری (لیست خدمات) */
export const HOME_ALT_SECTION = 'border-t border-gray-200 bg-gray-50 py-10 sm:py-12';

/** فاصله زیر تیتر داخل بخش خاکستری */
export const HOME_ALT_SECTION_HEADER_MB = 'mb-8 sm:mb-10';

export const HOME_CARD_SHELL =
  'scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80';

/** پوسته باکس نقشه کالا — هم‌عرض کارت‌های صفحه (بدون border بالا) */
export const HOME_GOODS_MAP_SHELL =
  'overflow-hidden rounded-2xl border border-t-0 border-gray-200/90 bg-white shadow-sm scroll-mt-28 md:scroll-mt-32';

/** @deprecated — بخش نقشه دیگر breakout تمام‌عرض نیست؛ از HOME_CONTAINER استفاده کنید */
export const HOME_GOODS_MAP_SECTION = HOME_CONTAINER;

export const HOME_CARD_HEADER =
  'border-b border-gray-200/90 bg-gradient-to-l from-teal-50/80 via-white to-white px-4 py-3.5 sm:px-5 sm:py-4';

export const HOME_CARD_BODY = 'px-4 py-4 sm:px-5 sm:py-5';

export const HOME_CARD_FOOTER =
  'border-t border-gray-200/90 bg-teal-50/40 px-4 py-4 sm:px-5 sm:py-5';

export const HOME_PAGE_TITLE =
  'text-xl font-bold leading-snug tracking-tight text-gray-900 sm:text-2xl lg:text-[1.65rem]';

/** زیرتیتر هیرو — راهنمای کوتاه سه مسیر */
export const HOME_PAGE_LEAD =
  'max-w-md text-sm leading-relaxed text-gray-600 sm:max-w-lg sm:text-[15px] md:mx-0 mx-auto';

export const HOME_BLOCK_TITLE =
  'text-base font-bold leading-snug text-gray-900 sm:text-lg';

export const HOME_BLOCK_LEAD = 'mt-1 text-sm leading-relaxed text-gray-600 sm:text-[15px]';

export const HOME_BADGE =
  'inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800 ring-1 ring-teal-200/80 sm:text-xs';

export const HOME_ICON_BOX =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/20 sm:h-11 sm:w-11';

export const HOME_BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 active:scale-[0.995]';

/** همان اندازهٔ HOME_BTN_PRIMARY — برای CTA تمام‌عرض بلوک (کمی برجسته‌تر) */
export const HOME_BTN_PRIMARY_BLOCK =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-600/25 ring-1 ring-teal-700/10 transition hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 active:scale-[0.995]';

export const HOME_BTN_SECONDARY =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-teal-300 hover:text-teal-700';
