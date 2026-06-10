/** متن لندینگ زیردسته — در صورت نبود slug از DEFAULT استفاده می‌شود */

export const SUBCATEGORY_LANDING_DEFAULT = {
  intro: (title, parentTitle) =>
    parentTitle
      ? `«${title}» زیرمجموعهٔ «${parentTitle}» است. متخصص‌های مرتبط را ببینید، روی نقشه مقایسه کنید، یا همان‌جا کار ثبت کنید.`
      : `برای «${title}» متخصص مناسب در شهر خود را از نقشه انتخاب کنید یا درخواست ثبت کنید.`,
  bullets: ['متخصص‌های همین خدمت', 'نقشه و ثبت کار در یک کلیک'],
};

/** نمونه — بقیه از DEFAULT با نام خدمت پر می‌شود */
export const SUBCATEGORY_LANDING_BY_SLUG = {
  'building-painting': {
    intro:
      'نقاشی دیوار، سقف و نمای داخلی — رنگ‌آمیزی تمیز با انتخاب متخصص بر اساس محله و زمان.',
    bullets: ['کار روزمزد یا متری', 'مشاوره رنگ و جنس'],
  },
  'home-deep-cleaning': {
    intro: 'نظافت عمیق منزل، آشپزخانه و سرویس — مناسب اسباب‌کشی یا بازگشت به خانه.',
    bullets: ['تیم یا نفر واحد', 'قابل رزرو'],
  },
};

export function getSubcategoryLandingCopy(slug, title, parentTitle) {
  const custom = SUBCATEGORY_LANDING_BY_SLUG[slug];
  if (custom) {
    return {
      intro: custom.intro,
      bullets: custom.bullets || SUBCATEGORY_LANDING_DEFAULT.bullets,
    };
  }
  return {
    intro: SUBCATEGORY_LANDING_DEFAULT.intro(title, parentTitle),
    bullets: SUBCATEGORY_LANDING_DEFAULT.bullets,
  };
}
