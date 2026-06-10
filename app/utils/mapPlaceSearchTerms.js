/**
 * عبارت جستجوی بهینه برای هر زیردسته — مستقل از عنوان نمایشی UI
 * منابع: Neshan / Photon (OSM) / Nominatim — نام‌های رایج در ایران
 */

/** @typedef {{ term: string; fallbacks?: string[] }} PlaceSubCategorySearchConfig */

/** @type {Record<string, PlaceSubCategorySearchConfig>} */
export const PLACE_SUBCATEGORY_SEARCH = {
  hospital: { term: 'بیمارستان' },
  'clinic-center': { term: 'درمانگاه', fallbacks: ['مرکز درمانی'] },
  clinic: { term: 'کلینیک', fallbacks: ['درمانگاه'] },
  pharmacy: { term: 'داروخانه' },
  lab: { term: 'آزمایشگاه', fallbacks: ['آزمایشگاه پاتولوژی'] },
  radiology: { term: 'رادیولوژی', fallbacks: ['سونوگرافی'] },
  physio: { term: 'فیزیوتراپی' },
  emergency: { term: 'اورژانس', fallbacks: ['115'] },
  blood: { term: 'اهدای خون', fallbacks: ['انتقال خون', 'پایگاه انتقال خون'] },

  fire: { term: 'آتش نشانی', fallbacks: ['آتش‌نشانی', '125'] },
  'police-station': { term: 'کلانتری', fallbacks: ['پلیس'] },
  'police-post': { term: 'پاسگاه', fallbacks: ['پاسگاه انتظامی'] },
  'traffic-police': { term: 'پلیس راهور', fallbacks: ['راهور'] },
  'police-110': { term: 'پلیس 10', fallbacks: ['پلیس+10', 'پلیس 110'] },
  'red-crescent': { term: 'هلال احمر', fallbacks: ['جمعیت هلال احمر'] },
  crisis: { term: 'مدیریت بحران' },
  roadside: { term: 'امداد خودرو', fallbacks: ['یدک کش'] },

  municipality: { term: 'شهرداری' },
  governor: { term: 'فرمانداری' },
  district: { term: 'بخشداری' },
  ostandar: { term: 'استانداری' },
  post: { term: 'اداره پست', fallbacks: ['پست'] },
  'civil-reg': { term: 'ثبت احوال' },
  'deed-reg': { term: 'ثبت اسناد' },
  tax: { term: 'اداره مالیات', fallbacks: ['مالیات'] },
  labor: { term: 'اداره کار', fallbacks: ['تامین اجتماعی'] },
  power: { term: 'اداره برق', fallbacks: ['برق'] },
  water: { term: 'اداره آب', fallbacks: ['آب و فاضلاب'] },
  gas: { term: 'اداره گاز' },
  telecom: { term: 'مخابرات', fallbacks: ['اداره مخابرات'] },
  egov: { term: 'دفتر خدمات', fallbacks: ['خدمات الکترونیک', 'قوه مجریه'] },

  bank: { term: 'بانک' },
  atm: { term: 'خودپرداز', fallbacks: ['ATM'] },
  exchange: { term: 'صرافی' },
  insurance: { term: 'بیمه' },
  loan: { term: 'قرض الحسنه', fallbacks: ['صندوق قرض الحسنه'] },

  kindergarten: { term: 'مهدکودک', fallbacks: ['مهد کودک'] },
  school: { term: 'مدرسه', fallbacks: ['دبستان'] },
  highschool: { term: 'دبیرستان' },
  vocational: { term: 'هنرستان', fallbacks: ['فنی حرفه ای'] },
  university: { term: 'دانشگاه' },
  institute: { term: 'آموزشگاه', fallbacks: ['موسسه آموزشی'] },
  library: { term: 'کتابخانه' },

  mosque: { term: 'مسجد' },
  husseiniya: { term: 'حسینیه', fallbacks: ['تکیه'] },
  imamzadeh: { term: 'امامزاده' },
  musalla: { term: 'مصلی' },
  seminary: { term: 'حوزه علمیه', fallbacks: ['مدرسه علمیه'] },
  cemetery: { term: 'قبرستان', fallbacks: ['آرامستان'] },

  airport: { term: 'فرودگاه' },
  'train-station': { term: 'ایستگاه قطار', fallbacks: ['راه آهن'] },
  rail: { term: 'راه آهن' },
  metro: { term: 'مترو' },
  'metro-station': { term: 'ایستگاه مترو', fallbacks: ['مترو'] },
  terminal: { term: 'ترمینال', fallbacks: ['پایانه'] },
  'bus-station': { term: 'ایستگاه اتوبوس', fallbacks: ['پایانه اتوبوس'] },
  taxi: { term: 'ایستگاه تاکسی', fallbacks: ['تاکسی'] },
  pier: { term: 'اسکله' },
  port: { term: 'بندر' },

  'gas-station': { term: 'پمپ بنزین', fallbacks: ['جایگاه سوخت'] },
  cng: { term: 'CNG', fallbacks: ['جایگاه CNG'] },
  'ev-charge': { term: 'شارژ خودرو', fallbacks: ['ایستگاه شارژ'] },

  parking: { term: 'پارکینگ' },
  'parking-multi': { term: 'پارکینگ', fallbacks: ['پارکینگ طبقاتی'] },
  'parking-247': { term: 'پارکینگ' },
  toll: { term: 'عوارضی' },
  inspection: { term: 'معاینه فنی', fallbacks: ['مرکز معاینه فنی'] },

  park: { term: 'پارک', fallbacks: ['بوستان'] },
  garden: { term: 'بوستان', fallbacks: ['باغ'] },
  'green-space': { term: 'بوستان', fallbacks: ['فضای سبز', 'پارک'] },
  square: { term: 'میدان' },
  beach: { term: 'ساحل' },
  recreation: { term: 'تفرجگاه', fallbacks: ['منطقه تفریحی'] },
  waterfall: { term: 'آبشار' },
  lake: { term: 'دریاچه', fallbacks: ['برکه'] },
  mountain: { term: 'کوهستان', fallbacks: ['قله'] },
  forest: { term: 'جنگل' },

  'culture-center': { term: 'فرهنگسرا' },
  cinema: { term: 'سینما', fallbacks: ['پردیس سینما'] },
  theater: { term: 'تئاتر' },
  museum: { term: 'موزه' },
  gallery: { term: 'نگارخانه', fallbacks: ['گالری'] },
  'house-of-culture': { term: 'خانه فرهنگ' },

  stadium: { term: 'ورزشگاه' },
  gym: { term: 'باشگاه', fallbacks: ['باشگاه بدنسازی', 'fitness', 'بدنسازی'] },
  pool: { term: 'استخر', fallbacks: ['مجتمع آبی', 'استخر شنا'] },
  'sport-hall': { term: 'سالن ورزشی', fallbacks: ['سالن'] },
  football: { term: 'زمین فوتبال', fallbacks: ['زمین چمن', 'فوتبال'] },
  tennis: { term: 'زمین تنیس', fallbacks: ['تنیس'] },

  passage: { term: 'پاساژ' },
  mall: { term: 'مجتمع تجاری', fallbacks: ['مرکز تجاری'] },
  bazaar: { term: 'بازار' },
  bazaarche: { term: 'بازارچه' },
  'shopping-center': { term: 'مرکز خرید', fallbacks: ['مجتمع تجاری'] },

  hotel: { term: 'هتل' },
  'apart-hotel': { term: 'هتل آپارتمان' },
  guesthouse: { term: 'مهمانپذیر', fallbacks: ['مهمانسرا'] },
  ecolodge: { term: 'بومگردی', fallbacks: ['اقامتگاه بومگردی'] },
  camp: { term: 'کمپ', fallbacks: ['کمپینگ'] },
  'travel-agency': { term: 'آژانس مسافرتی', fallbacks: ['آژانس مسافرت'] },
};

export function resolveSubCategorySearchQueue(subItem) {
  const cfg = subItem?.id ? PLACE_SUBCATEGORY_SEARCH[subItem.id] : null;
  const queue = cfg
    ? [cfg.term, ...(cfg.fallbacks || [])]
    : [subItem?.term, subItem?.title].filter(Boolean);

  const seen = new Set();
  return queue
    .map((value) => String(value || '').trim())
    .filter((value) => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
}
