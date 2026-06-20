/**
 * متن‌های کاربرپسند — لحن گرم و راحت (نه رسمی خشک)
 * فقط رشته‌های نمایشی؛ منطق و مسیرها جداست.
 */

/** نام پیش‌فرض وقتی اسم نداریم */
export const EXPERT_FALLBACK_NAME = 'این متخصص';

/** هیرو — صفحه اصلی (بازار خدمات) */
export const HERO_INTRO = {
  titleBeforeExpert: 'پیدا کردن',
  titleExpert: 'متخصص',
  titleAfterExpert: 'ساده‌تر از همیشه',
  leadSearch: 'جستجو',
  leadMap: 'نقشه',
  leadRequest: 'ثبت کار',
  leadSuffix: 'هر طور راحت‌ترید',
};

export const SERVICES_MARKET_OVERVIEW = {
  tagline:
    'پرندیکس بازار خدمات شهر شماست — متخصص‌ها معرفی می‌شوند، کاربران جستجو می‌کنند یا پروژه ثبت می‌کنند.',
  client: {
    title: 'برای کاربر',
    items: [
      'یافتن متخصص مناسب',
      'بررسی روی نقشه شهر',
      'ثبت پروژه و دریافت پیشنهاد',
    ],
  },
  expert: {
    title: 'برای متخصص',
    items: [
      'ساخت پروفایل حرفه‌ای',
      'نمایش در شهر',
      'دریافت پروژه‌های جدید',
    ],
    ctaLabel: 'ثبت‌نام متخصص',
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
  title: 'ثبت کار جدید',
  titleHead: 'ثبت کار',
  titleTail: 'جدید',
  eyebrow: 'ثبت کار جدید',
  eyebrowAccent: '',
  cta: 'شروع به ثبت کار',
  ctaLong: 'شروع به ثبت کار',
  bodyMobile:
    'کار یا خدمت مورد نیازتان را همراه با محل انجام ثبت کنید. متخصص‌های مرتبط مطلع می‌شوند و پیشنهاد قیمت و زمان ارسال می‌کنند.',
  bodyDesktop:
    'کافی است درخواست خود را ثبت کنید و محل انجام کار را مشخص کنید. متخصص‌های مرتبط پیشنهادهای خود را برای شما ارسال می‌کنند و می‌توانید قیمت، زمان و شرایط هر پیشنهاد را مقایسه کرده و بهترین گزینه را انتخاب کنید.',
  stepsAriaLabel: 'مراحل ثبت کار',
  openJobsEmpty: 'هنوز کار بازی نیست',
  bannerQuotes: [
    'وکیل می‌خوام',
    'بازرس می‌خوام',
    'تعمیرکار می‌خوام',
    'پنچرگیری می‌خوام',
    'تاسیساتی میخوام',
  ],
  floatingQuotes: [
    'پنچر شدی؟ آدرس بده، پنچرگیری میاد',
    'کولرت خراب شده؟ تعمیرکار میاد سر محل',
    'بنزین تموم کردی؟ سوخت‌رسان میاد',
    'لوله نشتی داره؟ لوله‌کش میاد',
    'برق خونه قطع شده؟ برق‌کار میاد',
  ],
  tag: 'ثبت رایگان',
  body:
    'خدمتی که نیاز دارید را به‌همراه محل انجام کار ثبت کنید. متخصص‌های مرتبط از درخواست شما مطلع می‌شوند و قیمت و زمان پیشنهادی خود را ارسال می‌کنند. سپس می‌توانید همه پیشنهادها را یک‌جا مشاهده کنید، با متخصص‌ها گفتگو کنید، نمونه‌کارها و امتیازهایشان را بررسی کنید و در نهایت بهترین گزینه را انتخاب کنید.',
  ariaLabel: 'رفتن به فرم ثبت کار جدید',
  illustrationAlt: 'ثبت کار جدید و دریافت پیشنهاد',
  speakerIconSrc: '/images/speaker.png',
  speakerIconAlt: '',
  /** دسکتاپ — عمودی کنار متن (فعلی) */
  illustrationSrc: '/images/home-register-work.webp',
  illustrationSrcFallback: '/images/home-register-work.png',
  /**
   * موبایل — اختیاری؛ بنر افقی کم‌ارتفاع (نه همان عکس عمودی دسکتاپ).
   * پیشنهاد: 720×240px یا 800×260px — webp با پس‌زمینه شفاف یا سفید.
   * مسیر: public/images/home-register-work-mobile.webp
   * وقتی فایل را گذاشتید، مقدار null را به مسیر زیر عوض کنید.
   */
  illustrationSrcMobile: '/images/home-register-work-mobile.webp',
  illustrationSrcMobileFallback: '/images/home-register-work-mobile.png',
  steps: [
    { title: 'ثبت درخواست', detail: 'کارتو ثبت کن' },
    { title: 'منتشر می‌شه', detail: 'متخصص‌هاش با خبر میشن' },
    { title: 'پیشنهادها می‌فرستن', detail: 'مقایسه و انتخاب کن' },
  ],
};

/** @param {number} count */
export function formatOpenJobsCount(count) {
  if (count === 1) return '۱ کار باز';
  return `${count.toLocaleString('fa-IR')} کار باز`;
}

/** هدر بلوک متخصصین — صفحه اصلی */
export const EXPERT_COMMUNITY_HEADER = {
  title: 'متخصص هستید؟ در شهر دیده شوید',
  mobileTitleFallback: 'پیوستن به متخصص‌ها',
  mobileRibbon: 'رایگان',
  description: 'پروفایل بسازید — در جستجو، نقشه و دسته‌های مرتبط معرفی می‌شوید',
};

/** @param {string} cityName */
export function buildExpertCommunityMobileTitle(cityName) {
  const name = String(cityName || '').trim();
  return name
    ? `پیوستن به متخصص‌های ${name}`
    : EXPERT_COMMUNITY_HEADER.mobileTitleFallback;
}

/** باکس دعوت ثبت‌نام متخصص — پایین بلوک متخصصین */
export const EXPERT_SIGNUP_CTA = {
  badge: 'پروفایل حرفه‌ای',
  title: 'پروفایل حرفه‌ای خودت رو داشته باش',
  bodyLines: [
    'تخصص‌ها، نمونه‌کارها، خدمات، تماس و موقعیت شما روی نقشه در پروفایل‌تان نمایش داده می‌شود.',
    'در پرند دیده می‌شوید و از درخواست‌های جدید باخبر می‌شوید.',
  ],
  cta: 'ثبت‌نام — رایگان',
  ctaAriaLabel: 'ثبت‌نام رایگان به‌عنوان متخصص',
  mobileHeader: 'ثبت متخصص‌ها',
  ctaPageLabel: 'صفحه اختصاصی شما',
  ctaPageUrlHost: 'parandx.com',
  ctaPageUrlPath: '/experts/',
  ctaPageUrlSlug: 'نام-شما',
  ctaHint: 'ثبت‌نام رایگان است و رایگان خواهد ماند',
  benefitsAriaLabel: 'امکانات پروفایل حرفه‌ای',
  benefits: [
    { key: 'page', title: 'صفحه اختصاصی', description: 'معرفی، نمونه‌کار و راه تماس' },
    { key: 'visibility', title: 'شناخته‌شدن در شهر', description: 'در جستجو و نقشه دیده شوید' },
    { key: 'network', title: 'شبکه‌سازی', description: 'دوستان و همکاران را دنبال کنید' },
  ],
  benefitJobs: {
    key: 'jobs',
    title: 'کارهای آزاد',
    description: 'کارهای تخصصتان رو در شهر بیابید',
  },
};

/** بلوک نقشه — صفحه اصلی */
export const MAP_INTRO = {
  ariaLabel: 'پیدا کردن متخصص یا کار ثبت‌شده از روی نقشه',
  eyebrow: 'متخصص‌ها روی نقشه',
  mobileTitle: 'نقشه تخصصی شهر',
  mobileLead:
    'دسته خدمت را انتخاب کنید تا متخصص‌ها و کارهای باز اطراف شما روی نقشه نمایش داده شوند.',
  mobileExpandHint: 'برای کار با نقشه، بزرگنمایی کنید',
  mobileExpandHintAria: 'باز کردن نقشه در حالت تمام‌صفحه',
  mobileOpenLabel: 'باز کردن نقشه تمام‌صفحه',
  mobileOpenAria: 'باز کردن نقشه تمام‌صفحه برای جستجو و فیلتر',
  body: 'دسته خدمت را انتخاب کنید؛ متخصص‌ها و کارهای باز اطراف روی نقشه نشان داده می‌شوند. محله را فیلتر کنید تا دقیق‌تر جستجو شود.',
  mobileTapHint: 'برای کار با نقشه، بزنید',
};

/** عنوان بلوک/مودال نقشه — «نقشه تخصصی {شهر}» */
export function buildMapSpecialtyTitle(cityName) {
  const name = String(cityName || '').trim();
  return name ? `نقشه تخصصی ${name}` : MAP_INTRO.mobileTitle;
}

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
