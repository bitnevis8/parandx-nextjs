/**
 * متن‌های کاربرپسند — لحن گرم و راحت (نه رسمی خشک)
 * فقط رشته‌های نمایشی؛ منطق و مسیرها جداست.
 */

/** نام پیش‌فرض وقتی اسم نداریم */
export const EXPERT_FALLBACK_NAME = 'این متخصص';

/** هیرو — صفحه اصلی (بازار خدمات) */
export const HERO_INTRO = {
  titleBrand: 'بازار خدمات',
  titleRest: 'پیدا کردن متخصص و ثبت کار در شهر شما',
  leadSearch: 'جستجو',
  leadMap: 'نقشه',
  leadRequest: 'ثبت کار',
  leadSuffix: 'هر طور راحت‌ترید',
};

export const SERVICES_MARKET_OVERVIEW = {
  tagline:
    'پرندیکس بازار خدمات شهر شماست — متخصص‌ها معرفی می‌شوند، کارفرماها جستجو می‌کنند یا کار ثبت می‌کنند.',
  client: {
    title: 'برای کارفرما',
    items: [
      'جستجو و پیدا کردن متخصص مناسب',
      'دیدن متخصص‌ها و کارهای باز روی نقشه',
      'ثبت کار و دریافت پیشنهاد قیمت',
    ],
  },
  expert: {
    title: 'برای متخصص',
    items: [
      'پروفایل حرفه‌ای و نمونه‌کار',
      'دیده شدن در جستجو و نقشه شهر',
      'خبردار شدن از کارهای ثبت‌شده',
    ],
    ctaScrollTarget: 'home-path-expert',
  },
};

export const SERVICES_CUSTOMER_PATHS_INTRO =
  '۴ راه برای پیدا کردن متخصص — روی هر مورد بزنید تا همان بخش باز شود';

export const SERVICES_SECTION = {
  titleSuffix: 'خدمات',
  lead: 'همه دسته‌های خدمات — از تعمیرات و نظافت تا زیبایی و مشاوره. دسته را بزنید و زیردسته‌ها را ببینید.',
};

/** بلوک ثبت کار — صفحه اصلی */
export const REQUEST_INTRO = {
  title: 'ثبت کار و دریافت پیشنهاد',
  tag: 'ثبت رایگان',
  body: 'خدمتی که نیاز دارید را به‌راحتی، به‌همراه محل انجام کار، ثبت کنید. متخصص‌های مرتبط مطلع می‌شوند و برای انجام کار، قیمت و زمان پیشنهادی خود را ارسال می‌کنند. پیشنهادها را یک‌جا ببینید، با متخصص‌ها گفت‌وگو کنید، نمونه‌کار و امتیازهایشان را بررسی کنید و بهترین گزینه را انتخاب کنید.',
  cta: 'شروع ثبت کار',
  ariaLabel: 'رفتن به فرم ثبت کار',
  illustrationAlt: 'ثبت کار و دریافت پیشنهاد',
  /** تصویر اختیاری — webp یا png در public/images */
  illustrationSrc: '/images/home-register-work.webp',
  illustrationSrcFallback: '/images/home-register-work.png',
  steps: [
    { title: 'کارتو بگید', detail: 'چی می‌خواید و کجا' },
    { title: 'منتشر می‌شه', detail: 'متخصص‌های مرتبط خبر می‌شن' },
    { title: 'پیشنهاد انتخاب کنید', detail: 'قیمت و زمان رو مقایسه کنید' },
  ],
};

/** هدر بلوک متخصصین — صفحه اصلی */
export const EXPERT_COMMUNITY_HEADER = {
  title: 'متخصص هستید؟ در شهر دیده شوید',
  description: 'پروفایل بسازید — در جستجو، نقشه و دسته‌های مرتبط معرفی می‌شوید',
};

/** باکس دعوت ثبت‌نام متخصص — پایین بلوک متخصصین */
export const EXPERT_SIGNUP_CTA = {
  badge: 'ثبت‌نام متخصص',
  title: 'پروفایل حرفه‌ای خودت رو داشته باش',
  bodyBeforeCity:
    'تخصص‌ها، نمونه‌کار، نحوهٔ ارائه خدمت، تماس و موقعیت روی نقشه — همه توی پروفایلت. در ',
  bodyAfterCity:
    ' در جستجو و نقشه دیده می‌شی؛ وقتی کار ثبت می‌شه خبردار می‌شی و با هم‌صنفی‌ها در ارتباطی.',
  cta: 'ثبت‌نام رایگان',
  ctaPageLabel: 'لینک اختصاصی شما',
  ctaPageUrlHost: 'parandx.com',
  ctaPageUrlPath: '/experts/',
  ctaPageUrlSlug: 'نام-شما',
  ctaHint: 'ثبت‌نام رایگان است و رایگان خواهد ماند',
  benefitsAriaLabel: 'مزایای ثبت‌نام متخصص',
  benefits: [
    { key: 'profile', title: 'پروفایل حرفه‌ای', description: 'تخصص‌ها، بیو و تماس' },
    { key: 'portfolio', title: 'نمونه‌کار', description: 'نمایش کارها و اعتماد' },
    { key: 'reach', title: 'معرفی در شهر', description: 'جستجو، نقشه و دیده‌شدن' },
    { key: 'network', title: 'کار و هم‌صنفی‌ها', description: 'اعلان ثبت کار و ارتباط' },
  ],
};

/** بلوک نقشه — صفحه اصلی */
export const MAP_INTRO = {
  ariaLabel: 'پیدا کردن متخصص یا کار ثبت‌شده از روی نقشه',
  eyebrow: 'متخصص‌ها روی نقشه',
  body: 'دسته خدمت را انتخاب کنید؛ متخصص‌ها و کارهای باز اطراف روی نقشه نشان داده می‌شوند. محله را فیلتر کنید تا دقیق‌تر جستجو شود.',
  mobileTapHint: 'برای کار با نقشه، بزنید',
};

/** خلاصه تعداد روی نقشه — از getMapExplorerSummaryCopy استفاده می‌شود */
export function mapExplorerSummaryCopy({
  stats,
  loading,
  filterMode = 'service',
}) {
  if (loading) {
    return { tone: 'muted', title: 'در حال بارگذاری متخصص‌ها…', detail: '' };
  }

  const { expertCount, expertsOnMap } = stats || {};
  const onMap = expertsOnMap > 0 ? expertsOnMap : 0;

  if (!expertCount) {
    if (filterMode === 'all') {
      return {
        tone: 'empty',
        title: 'هنوز متخصصی در این محدوده نیست',
        detail: '',
      };
    }
    return {
      tone: 'empty',
      title: filterMode === 'parent' ? 'در این دسته متخصصی نیست' : 'در این زیردسته متخصصی نیست',
      detail: '',
    };
  }

  if (filterMode === 'parent') {
    if (onMap === 0) {
      return {
        tone: 'muted',
        title: `${expertCount} متخصص · موقعیت روی نقشه ثبت نشده`,
        detail: '',
      };
    }
    return {
      tone: 'success',
      title:
        onMap === 1
          ? '۱ متخصص · زیردسته را انتخاب کنید'
          : `${onMap} متخصص · زیردسته را انتخاب کنید`,
      detail: '',
    };
  }

  if (onMap === 0) {
    return {
      tone: 'muted',
      title: `${expertCount} متخصص · موقعیت روی نقشه ثبت نشده`,
      detail: '',
    };
  }

  return {
    tone: 'success',
    title: onMap === 1 ? '۱ متخصص روی نقشه' : `${onMap} متخصص روی نقشه`,
    detail: '',
  };
}

/** خلاصه تعداد کارها روی نقشه */
export function requestMapExplorerSummaryCopy({
  stats,
  loading,
  filterMode = 'service',
}) {
  if (loading) {
    return { tone: 'muted', title: 'در حال بارگذاری کارها…', detail: '' };
  }

  const { requestCount, requestsOnMap } = stats || {};
  const onMap = requestsOnMap > 0 ? requestsOnMap : 0;

  if (filterMode === 'mine') {
    if (!requestCount) {
      return {
        tone: 'empty',
        title: 'فعلاً کاری در تخصص‌های شما نیست',
        detail: 'می‌توانید همه کارها را ببینید',
      };
    }
    if (onMap === 0) {
      return {
        tone: 'muted',
        title: `${requestCount} کار مرتبط · موقعیت روی نقشه ثبت نشده`,
        detail: 'کارهای هم‌تخصص شما در این محدوده',
      };
    }
    return {
      tone: 'success',
      title:
        onMap === 1
          ? '۱ کار مرتبط با تخصص شما'
          : `${onMap} کار مرتبط با تخصص شما`,
      detail: 'روی مارکر کلیک کنید · یا همه کارها را ببینید',
    };
  }

  if (!requestCount) {
    if (filterMode === 'all') {
      return {
        tone: 'empty',
        title: 'هنوز کار بازی در این محدوده نیست',
        detail: '',
      };
    }
    return {
      tone: 'empty',
      title: filterMode === 'parent' ? 'در این دسته کاری ثبت نشده' : 'در این زیردسته کاری ثبت نشده',
      detail: '',
    };
  }

  if (onMap === 0) {
    return {
      tone: 'muted',
      title: `${requestCount} کار · موقعیت روی نقشه ثبت نشده`,
      detail: '',
    };
  }

  if (filterMode === 'parent') {
    return {
      tone: 'success',
      title:
        onMap === 1
          ? '۱ کار باز · زیردسته را انتخاب کنید'
          : `${onMap} کار باز · زیردسته را انتخاب کنید`,
      detail: '',
    };
  }

  return {
    tone: 'success',
    title: onMap === 1 ? '۱ کار باز روی نقشه' : `${onMap} کار باز روی نقشه`,
    detail: filterMode === 'all' ? '' : 'روی مارکر کلیک کنید و پیشنهاد بدهید',
  };
}
