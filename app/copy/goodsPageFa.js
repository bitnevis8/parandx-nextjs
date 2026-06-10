/** متن‌های بازار کالا */

export const GOODS_HERO_INTRO = {
  titleBrand: 'بازار کالا',
  titleRest: 'خرید، فروش و پیدا کردن فروشگاه در شهر شما',
  leadSearch: 'جستجو',
  leadMap: 'نقشه فروشگاه',
  leadNeed: 'ثبت نیاز',
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

export const GOODS_NEED_INTRO = {
  title: 'ثبت نیاز کالا',
  tag: 'ثبت رایگان',
  body: 'کالایی که دنبالش هستید را با جزئیات و محل تحویل ثبت کنید. فروشگاه‌های مرتبط در شهر شما مطلع می‌شوند و پیشنهاد قیمت و موجودی می‌فرستند. پیشنهادها را مقایسه کنید و بهترین گزینه را انتخاب کنید.',
  cta: 'ثبت نیاز کالا',
  ariaLabel: 'رفتن به فرم ثبت نیاز کالا',
  illustrationSrc: '/images/home-register-work.webp',
  illustrationSrcFallback: '/images/home-register-work.png',
};

export const GOODS_NEED_FORM = {
  eyebrow: 'ثبت نیاز کالا',
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

export const GOODS_SELLER_HEADER = {
  title: 'صاحب فروشگاه یا کسب‌وکار کالا؟',
  description: 'فروشگاهت را معرفی کن — در نقشه و دسته‌های مرتبط دیده شو',
};

export const GOODS_SELLER_CTA = {
  badge: 'ثبت فروشگاه',
  title: 'فروشگاهت را در پرندیکس معرفی کن',
  bodyBeforeCity: 'دسته کالا، آدرس، تماس و موقعیت روی نقشه — در ',
  bodyAfterCity:
    ' مشتریان نزدیک را پیدا می‌کنید و وقتی نیاز کالا ثبت می‌شود خبردار می‌شوید.',
  cta: 'ثبت‌نام فروشنده',
  ctaHint: 'ثبت‌نام رایگان است',
  benefitsAriaLabel: 'مزایای ثبت فروشگاه',
  benefits: [
    { key: 'map', title: 'روی نقشه شهر', description: 'موقعیت و دسته کالا' },
    { key: 'reach', title: 'دیده‌شدن', description: 'جستجو و دسته‌بندی' },
    { key: 'needs', title: 'نیاز مشتری', description: 'اعلان درخواست خرید' },
    { key: 'trust', title: 'پروفایل فروشگاه', description: 'تماس و معرفی' },
  ],
};

export const GOODS_MAP_INTRO = {
  ariaLabel: 'پیدا کردن فروشگاه از روی نقشه',
  eyebrow: 'فروشگاه‌ها روی نقشه',
  body: 'دسته کالا را انتخاب کنید؛ فروشگاه‌های ثبت‌شده و نیازهای خریدار روی نقشه نشان داده می‌شوند. محله را فیلتر کنید تا دقیق‌تر جستجو شود.',
  mobileTapHint: 'برای کار با نقشه، بزنید',
  expandHint: 'برای استفاده کامل از نقشه روی بزرگ‌نمایی کلیک کنید',
  expandHintAria: 'باز کردن نقشه در حالت تمام‌صفحه — بزرگ‌نمایی',
};

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

export const GOODS_SECTION = {
  titleSuffix: 'فروشگاه‌های',
  lead: 'همه دسته‌های کالا — از مواد غذایی تا پوشاک و لوازم خانگی. دسته را بزنید و زیردسته‌ها را ببینید.',
  subcategoryLabel: 'زیردسته',
  expertCountLabel: 'فروشنده',
};
