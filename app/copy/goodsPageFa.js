/** متن‌های بازار کالا */

export const GOODS_HERO_INTRO = {
  titleBrand: 'کالا',
  titleRest: 'خرید، فروش و پیدا کردن فروشگاه در شهر شما',
  leadSearch: 'جستجو',
  leadMap: 'نقشه فروشگاه',
  leadNeed: 'کالا نیاز دارم',
  leadSupply: 'کالا برای فروش دارم',
  leadSuffix: 'هر طور راحت‌ترید',
};

export const GOODS_MARKET_OVERVIEW = {
  tagline:
    'پرندیکس بازار کالای شهر شماست — فروشگاه‌ها معرفی می‌شوند، خریداران جستجو می‌کنند یا نیاز ثبت می‌کنند.',
  buyer: {
    title: 'برای خریدار',
    items: [
      'جستجو و پیدا کردن فروشگاه نزدیک',
      'دیدن فروشگاه‌ها روی نقشه با دسته‌بندی',
      'ثبت نیاز کالا و دریافت پیشنهاد قیمت',
      'ثبت عرضه کالا و دریافت پیشنهاد خرید',
    ],
  },
  seller: {
    title: 'برای صاحب فروشگاه',
    items: [
      'معرفی فروشگاه روی نقشه شهر',
      'دیده شدن در دسته کالای مرتبط',
      'خبردار شدن از نیازهای ثبت‌شده مشتری',
    ],
    ctaScrollTarget: 'home-path-seller',
  },
};

export const GOODS_CUSTOMER_PATHS_INTRO =
  '۴ راه برای پیدا کردن کالا — روی هر مورد بزنید تا همان بخش باز شود';

export const GOODS_CATEGORY_BROWSE = {
  title: 'دسته‌بندی فروشگاه‌ها',
  searchPlaceholder: 'جستجو در دسته و زیردسته…',
  emptySearch: 'دسته‌ای با این نام پیدا نشد',
};

export const GOODS_NEED_INTRO = {
  title: 'کالا نیاز دارم',
  body: 'نیازت رو ثبت کن تا دارنده‌های کالا با خبر بشن و قیمتشون رو برات بفرستن. مناسب‌ترین رو انتخاب کن.',
  cta: 'کالا نیاز دارم',
  ariaLabel: 'رفتن به فرم — کالا نیاز دارم',
  illustrationSrc: '/images/need.png',
  illustrationAlt: 'کالا نیاز دارم',
  steps: [
    { key: 'register', label: 'ثبت نیاز' },
    { key: 'offers', label: 'دریافت پیشنهاد قیمت' },
    { key: 'choose', label: 'نهایی کردن خرید' },
  ],
};

export const GOODS_NEED_FORM = {
  eyebrow: 'کالا نیاز دارم',
  title: 'دریافت پیشنهاد از فروشگاه‌ها',
  lead: 'کالای مورد نظر، دسته و جزئیات را بنویسید. محل تحویل روی نقشه اختیاری است؛ فروشگاه‌های مرتبط در شهر شما خبرشان می‌شود.',
  detailsTitle: 'جزئیات نیاز',
  detailsHint: 'عنوان، دسته کالا و توضیحات',
  locationTitle: 'محل تحویل',
  locationHint: 'آدرس متنی یا نقشه — هر دو اختیاری',
  scheduleTitle: 'زمان‌بندی',
  scheduleHint: 'مهلت مطلوب برای تحویل (اختیاری)',
  submitHint: 'بعد از ثبت، فروشگاه‌های همان دسته کالا مطلع می‌شوند و می‌توانند پیشنهاد بفرستند.',
  submit: 'ثبت نیاز کالا',
  submitting: 'در حال ارسال...',
  successTitle: 'نیاز کالا ثبت شد',
  successBody: 'خبر به فروشگاه‌های مرتبط رسید — به‌زودی پیشنهاد قیمت و موجودی می‌فرستند.',
  titlePlaceholder: 'مثلاً یخچال ۱۸ فوت سفید',
  descriptionPlaceholder: 'برند، مدل، تعداد، وضعیت نو یا دست‌دوم، بودجه تقریبی و...',
};

export const GOODS_SUPPLY_INTRO = {
  title: 'کالا برای فروش دارم',
  body: 'کالاتو ثبت کن، پیشنهادهای خرید رو دریافت کن. پیشنهادها رو ببین و هر کدوم مناسب‌تر بود انتخاب کن.',
  cta: 'کالا برای فروش دارم',
  ariaLabel: 'رفتن به فرم — کالا برای فروش دارم',
  illustrationSrc: '/images/bid.png',
  illustrationAlt: 'کالا برای فروش دارم',
  steps: [
    { key: 'register', label: 'ثبت کالا' },
    { key: 'offers', label: 'دریافت پیشنهاد خرید' },
    { key: 'choose', label: 'نهایی کردن معامله' },
  ],
};

export const GOODS_SUPPLY_FORM = {
  eyebrow: 'کالا برای فروش دارم',
  title: 'دریافت پیشنهاد خرید',
  lead: 'کالای موجود، دسته و جزئیات را بنویسید. محل تحویل یا انبار روی نقشه اختیاری است؛ خریداران مرتبط در شهر شما خبرشان می‌شود.',
  detailsTitle: 'جزئیات عرضه',
  detailsHint: 'عنوان، دسته کالا و توضیحات',
  locationTitle: 'محل تحویل / انبار',
  locationHint: 'آدرس متنی یا نقشه — هر دو اختیاری',
  scheduleTitle: 'زمان‌بندی',
  scheduleHint: 'مهلت فروش یا آماده‌بودن کالا (اختیاری)',
  submitHint: 'بعد از ثبت، خریدارانی که در همان دسته نیاز ثبت کرده‌اند مطلع می‌شوند و می‌توانند پیشنهاد خرید بفرستند.',
  submit: 'ثبت عرضه کالا',
  submitting: 'در حال ارسال...',
  successTitle: 'عرضه کالا ثبت شد',
  successBody: 'خبر به خریداران مرتبط رسید — به‌زودی پیشنهاد خرید می‌فرستند.',
  titlePlaceholder: 'مثلاً ماشین لباسشویی ۷ کیلو سامسونگ',
  descriptionPlaceholder: 'برند، مدل، تعداد، وضعیت، قیمت تقریبی، گارانتی، شرایط تحویل و...',
};

/** هدر بلوک فروشگاه‌ها — صفحه بازار کالا */
export const GOODS_MERCHANT_COMMUNITY_HEADER = {
  title: 'صاحب فروشگاه هستید؟ در شهر دیده شوید',
  mobileTitleFallback: 'فروشگاه‌های شهر',
  mobileRibbon: 'رایگان',
  description: 'فروشگاهت را معرفی کن — در جستجو، نقشه و دسته‌های مرتبط دیده می‌شوید',
};

/** @param {string} cityName */
export function buildGoodsMerchantCommunityMobileTitle(cityName) {
  const name = String(cityName || '').trim();
  return name ? `فروشگاه‌های ${name}` : GOODS_MERCHANT_COMMUNITY_HEADER.mobileTitleFallback;
}

/** متن کنار مغازه‌ها — فضای خالی سمت چپ */
export const GOODS_MERCHANT_JOIN_PITCH = {
  title: 'مغازه‌اتو بیار اینجا',
  body:
    'ثبت‌نام کن — مغازه‌ات روی نقشه می‌شینه و یه صفحه مخصوص خودت هم داری. همکارای دور و برتو فالو کن؛ مشتری‌هاتم می‌تونن فالوت کنن تا وقتی جنس تازه یا تخفیف داری، زودتر بفهمن.',
};

/** باکس دعوت ثبت فروشگاه — پایین بلوک فروشگاه‌ها */
export const GOODS_MERCHANT_SIGNUP_CTA = {
  badge: 'ثبت فروشگاه',
  title: 'صفحه فروشگاه خودت رو داشته باش',
  bodyBeforeCity:
    'دسته کالا، ویترین، تماس و موقعیت روی نقشه — همه توی پروفایل فروشگاهت. در ',
  bodyAfterCity:
    ' در جستجو و نقشه دیده می‌شی؛ وقتی نیاز کالا ثبت می‌شه خبردار می‌شی و مشتریان نزدیکت رو پیدا می‌کنی.',
  cta: 'ثبت فروشگاه',
  ctaAriaLabel: 'ثبت‌نام رایگان به‌عنوان فروشگاه',
  ctaPageLabel: 'لینک اختصاصی فروشگاه',
  ctaPageUrlHost: 'parandx.com',
  ctaPageUrlPath: '/goods/stores/',
  ctaPageUrlSlug: 'فروشگاه-شما',
  ctaHint: 'ثبت‌نام رایگان است و رایگان خواهد ماند',
  benefitsAriaLabel: 'مزایای ثبت فروشگاه',
  benefits: [
    { key: 'profile', title: 'پروفایل فروشگاه', description: 'معرفی، تماس و دسته کالا' },
    { key: 'vitrine', title: 'ویترین کالا', description: 'نمایش محصولات و اعتماد' },
    { key: 'reach', title: 'معرفی در شهر', description: 'جستجو، نقشه و دیده‌شدن' },
    { key: 'needs', title: 'نیاز مشتری', description: 'اعلان درخواست خرید' },
  ],
};

export const GOODS_MAP_INTRO = {
  ariaLabel: 'پیدا کردن فروشگاه از روی نقشه',
  eyebrow: 'فروشگاه‌ها روی نقشه',
  body: 'دسته کالا را انتخاب کنید؛ فروشگاه‌ها، نیازهای خریدار و عرضه‌های ثبت‌شده روی نقشه نشان داده می‌شوند. محله را فیلتر کنید تا دقیق‌تر جستجو شود.',
  mobileTapHint: 'برای کار با نقشه، بزنید',
  mobileExpandHint: 'برای کار با نقشه، بزرگنمایی کنید',
  mobileExpandHintAria: 'باز کردن نقشه در حالت تمام‌صفحه',
  expandHint: 'برای استفاده کامل از نقشه روی بزرگ‌نمایی کلیک کنید',
  expandHintAria: 'باز کردن نقشه در حالت تمام‌صفحه — بزرگ‌نمایی',
};

/** عنوان بلوک/مودال نقشه کالا — «نقشه کالای {شهر}» */
export function buildGoodsMapSpecialtyTitle(cityName) {
  const name = String(cityName || '').trim();
  return name ? `نقشه کالای ${name}` : 'نقشه بازار کالا';
}

export function merchantMapExplorerSummaryCopy({ stats, loading, filterMode = 'service' }) {
  if (loading) {
    return { tone: 'muted', title: 'در حال بارگذاری فروشگاه‌ها…', detail: '' };
  }

  const { merchantCount, merchantsOnMap } = stats || {};
  const onMap = merchantsOnMap > 0 ? merchantsOnMap : 0;

  if (!merchantCount) {
    if (filterMode === 'all') {
      return { tone: 'empty', title: 'هنوز فروشگاهی در این محدوده نیست', detail: '' };
    }
    return {
      tone: 'empty',
      title: filterMode === 'parent' ? 'در این دسته فروشگاهی نیست' : 'در این زیردسته فروشگاهی نیست',
      detail: '',
    };
  }

  if (onMap === 0) {
    return {
      tone: 'muted',
      title: `${merchantCount} فروشگاه · موقعیت روی نقشه ثبت نشده`,
      detail: '',
    };
  }

  return {
    tone: 'success',
    title: onMap === 1 ? '۱ فروشگاه روی نقشه' : `${onMap} فروشگاه روی نقشه`,
    detail: merchantCount > onMap ? `${merchantCount - onMap} مورد بدون پین` : '',
  };
}

export function goodsNeedMapExplorerSummaryCopy({ stats, loading, filterMode = 'service' }) {
  if (loading) {
    return { tone: 'muted', title: 'در حال بارگذاری نیازهای کالا…', detail: '' };
  }

  const { requestCount, requestsOnMap } = stats || {};
  const onMap = requestsOnMap > 0 ? requestsOnMap : 0;

  if (!requestCount) {
    if (filterMode === 'all') {
      return { tone: 'empty', title: 'نیاز کالای باز در این محدوده نیست', detail: '' };
    }
    if (filterMode === 'mine') {
      return { tone: 'empty', title: 'نیاز کالای مرتبط با دسته شما نیست', detail: '' };
    }
    return {
      tone: 'empty',
      title: filterMode === 'parent' ? 'در این دسته نیازی نیست' : 'در این زیردسته نیازی نیست',
      detail: '',
    };
  }

  if (onMap === 0) {
    return {
      tone: 'muted',
      title: `${requestCount} نیاز · بدون موقعیت روی نقشه`,
      detail: '',
    };
  }

  return {
    tone: 'success',
    title: onMap === 1 ? '۱ نیاز کالا روی نقشه' : `${onMap} نیاز کالا روی نقشه`,
    detail: '',
  };
}

export function goodsSupplyMapExplorerSummaryCopy({ stats, loading, filterMode = 'service' }) {
  if (loading) {
    return { tone: 'muted', title: 'در حال بارگذاری عرضه‌های کالا…', detail: '' };
  }

  const { requestCount, requestsOnMap } = stats || {};
  const onMap = requestsOnMap > 0 ? requestsOnMap : 0;

  if (!requestCount) {
    if (filterMode === 'all') {
      return { tone: 'empty', title: 'عرضه کالای باز در این محدوده نیست', detail: '' };
    }
    return {
      tone: 'empty',
      title: filterMode === 'parent' ? 'در این دسته عرضه‌ای نیست' : 'در این زیردسته عرضه‌ای نیست',
      detail: '',
    };
  }

  if (onMap === 0) {
    return {
      tone: 'muted',
      title: `${requestCount} عرضه · بدون موقعیت روی نقشه`,
      detail: '',
    };
  }

  return {
    tone: 'success',
    title: onMap === 1 ? '۱ عرضه کالا روی نقشه' : `${onMap} عرضه کالا روی نقشه`,
    detail: '',
  };
}

export const GOODS_SECTION = {
  titleSuffix: 'فروشگاه‌های',
  lead: 'همه دسته‌های کالا — از مواد غذایی تا پوشاک و لوازم خانگی. دسته را بزنید و زیردسته‌ها را ببینید.',
  subcategoryLabel: 'زیردسته',
  expertCountLabel: 'فروشنده',
};
