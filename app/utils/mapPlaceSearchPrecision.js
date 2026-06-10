/**
 * فیلتر دقیق نتایج جستجوی مکان — جلوگیری از تطابق جزئی (پارک ≠ پارکینگ، کوه ≠ خیابان زردکوه)
 */

const STREET_PREFIXES = [
  'خیابان',
  'کوچه',
  'بلوار',
  'جاده',
  'آیت',
  'بن بست',
  'قطعه',
  'پلاک',
  'جنب',
  'روبرو',
  'نبش',
  'بزرگراه',
  'مسیر',
  'گذر',
  'کمربندی',
];

const COLOR_WORDS =
  'سفید|زرد|سبز|سیاه|قرمز|آبی|نارنجی|بنفش|طلایی|نقره|سرو|کاج|نسیم|صبا|شمال|جنوب|شرق|غرب|الماس|یاقوت|مروارید';

const STREET_OSM_VALUES = new Set([
  'residential',
  'primary',
  'secondary',
  'tertiary',
  'living_street',
  'pedestrian',
  'service',
  'track',
  'road',
  'trunk',
  'motorway',
  'motorway_link',
  'primary_link',
  'secondary_link',
  'tertiary_link',
  'unclassified',
  'path',
  'footway',
  'steps',
]);

/** @typedef {{ matchTerms?: string[]; excludeTerms?: string[]; requireTitleMatch?: boolean; excludeStreets?: boolean }} PlaceSearchProfile */

/** @type {Record<string, PlaceSearchProfile>} */
export const PLACE_SUBCATEGORY_SEARCH_PROFILES = {
  park: {
    matchTerms: ['پارک', 'park'],
    excludeTerms: ['پارکینگ', 'parking', 'پاركینگ'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  garden: {
    matchTerms: ['بوستان', 'باغ', 'garden'],
    excludeTerms: ['پارکینگ'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  'green-space': {
    matchTerms: ['فضای سبز', 'فضای‌سبز', 'green space'],
    excludeTerms: ['پارکینگ'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  square: {
    matchTerms: ['میدان'],
    excludeTerms: ['خیابان', 'کوچه', 'بلوار', 'پلاک'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  beach: {
    matchTerms: ['ساحل', 'beach'],
    excludeTerms: ['خیابان', 'کوچه'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  recreation: {
    matchTerms: ['تفرجگاه', 'منطقه تفریحی', 'تفریحگاه'],
    excludeTerms: ['پارکینگ'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  waterfall: {
    matchTerms: ['آبشار'],
    excludeTerms: ['خیابان', 'کوچه', 'بلوار'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  lake: {
    matchTerms: ['دریاچه', 'برکه', 'تالاب'],
    excludeTerms: ['خیابان', 'کوچه', 'بلوار', 'پلاک'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  mountain: {
    matchTerms: ['کوهستان', 'قله', 'ارتفاعات'],
    excludeTerms: ['خیابان', 'کوچه', 'بلوار', 'جاده', 'کامیون', 'پلاک', 'جنب', 'بن بست', 'آیت'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  forest: {
    matchTerms: ['جنگل', 'جنگلات', 'درختستان'],
    excludeTerms: ['خیابان', 'کوچه', 'بلوار'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  parking: {
    matchTerms: ['پارکینگ', 'parking'],
    excludeTerms: [],
    requireTitleMatch: true,
  },
  'parking-multi': {
    matchTerms: ['پارکینگ طبقاتی', 'پارکینگ'],
    excludeTerms: [],
    requireTitleMatch: true,
  },
  'parking-247': {
    matchTerms: ['پارکینگ'],
    excludeTerms: [],
    requireTitleMatch: true,
  },
  bazaar: {
    matchTerms: ['بازار'],
    excludeTerms: ['بازارچه'],
    requireTitleMatch: true,
  },
  bazaarche: {
    matchTerms: ['بازارچه'],
    excludeTerms: [],
    requireTitleMatch: true,
  },
  metro: {
    matchTerms: ['مترو', 'ایستگاه مترو', 'شهر زیرزمینی'],
    excludeTerms: ['متروپل'],
    requireTitleMatch: true,
  },
  'metro-station': {
    matchTerms: ['ایستگاه مترو', 'مترو'],
    excludeTerms: ['متروپل'],
    requireTitleMatch: true,
  },
  'police-110': {
    matchTerms: ['پلیس +۱۰', 'پلیس ۱۰', 'پلیس+10', 'پلیس 10', 'پلیس+۱۰'],
    excludeTerms: ['پلیس راه', 'راهور', 'کلانتری', 'پاسگاه'],
    requireTitleMatch: true,
  },
  institute: {
    matchTerms: ['آموزشگاه', 'موسسه آموزش'],
    excludeTerms: ['دانشگاه'],
    requireTitleMatch: true,
  },
  university: {
    matchTerms: ['دانشگاه'],
    excludeTerms: ['آموزشگاه'],
    requireTitleMatch: true,
  },
  mosque: {
    matchTerms: ['مسجد', 'مساجد'],
    excludeTerms: [],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  gym: {
    matchTerms: [
      'باشگاه',
      'بدنسازی',
      'فیتنس',
      'fitness',
      'gym',
      'ورزشی',
      'کشتی',
      'کاراته',
      'تکواندو',
      'یوگا',
      'پیلاتس',
      'کراس',
    ],
    excludeTerms: ['اتوبوس', 'کفش'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  'sport-hall': {
    matchTerms: ['سالن ورزشی', 'سالن', 'چندمنظوره', 'ورزشی'],
    excludeTerms: ['خیابان', 'کوچه'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  pool: {
    matchTerms: ['استخر', 'آبی', 'شنا', 'spa', 'اسپا'],
    excludeTerms: ['استخراج', 'استخراجی'],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  football: {
    matchTerms: ['فوتبال', 'چمن', 'زمین'],
    excludeTerms: [],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  tennis: {
    matchTerms: ['تنیس', 'tennis'],
    excludeTerms: [],
    requireTitleMatch: true,
    excludeStreets: true,
  },
  stadium: {
    matchTerms: ['ورزشگاه', 'stadium'],
    excludeTerms: [],
    requireTitleMatch: true,
    excludeStreets: true,
  },
};

const TERM_INFERRED_PROFILES = {
  پارک: 'park',
  park: 'park',
  کوه: 'mountain',
  کوهستان: 'mountain',
  دریاچه: 'lake',
  جنگل: 'forest',
  بازار: 'bazaar',
  بازارچه: 'bazaarche',
  پارکینگ: 'parking',
  parking: 'parking',
  باشگاه: 'gym',
  gym: 'gym',
  fitness: 'gym',
};

export function normalizePersianSearchText(value) {
  return String(value || '')
    .replace(/[\u200c\u200f\u0640]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function containsWholeTerm(text, term) {
  const norm = normalizePersianSearchText(text);
  const token = normalizePersianSearchText(term);
  if (!token) return false;
  if (norm === token) return true;

  const pattern = new RegExp(`(^|[\\s،,.\\-\\/()])${escapeRegExp(token)}($|[\\s،,.\\-\\/()])`);
  if (pattern.test(norm)) return true;
  if (norm.startsWith(`${token} `)) return true;
  if (norm.endsWith(` ${token}`)) return true;

  return false;
}

function termMatchesText(text, token) {
  const norm = normalizePersianSearchText(text);
  const t = normalizePersianSearchText(token);
  if (!t) return false;
  if (containsWholeTerm(text, token)) return true;
  if (t.includes(' ') && norm.includes(t)) return true;
  return false;
}

function containsExcludedTerm(text, excludeTerms) {
  if (!excludeTerms?.length) return false;
  const norm = normalizePersianSearchText(text);
  return excludeTerms.some((term) => {
    const ex = normalizePersianSearchText(term);
    return ex && norm.includes(ex);
  });
}

export function isLikelyStreetOrAlleyName(title) {
  const norm = normalizePersianSearchText(title);
  if (!norm) return false;

  if (STREET_PREFIXES.some((prefix) => norm.startsWith(`${prefix} `) || norm.includes(` ${prefix} `))) {
    return true;
  }

  if (/^\d/.test(norm)) return true;

  const colorMountain = new RegExp(`^(${COLOR_WORDS})\\s+کوه$`, 'u');
  if (colorMountain.test(norm)) return true;

  const mountainColor = new RegExp(`^کوه\\s+(${COLOR_WORDS})$`, 'u');
  if (mountainColor.test(norm)) return true;

  if (/\s+\d+$/.test(norm) && norm.includes('کوه')) return true;

  return false;
}

export function isOsmStreetItem(item) {
  if (!item) return false;
  if (item.osmKey === 'highway') return true;
  return STREET_OSM_VALUES.has(String(item.osmValue || '').toLowerCase());
}

export function resolvePlaceSearchProfile({ subCategoryId = '', term = '', title = '' }) {
  if (subCategoryId && PLACE_SUBCATEGORY_SEARCH_PROFILES[subCategoryId]) {
    return PLACE_SUBCATEGORY_SEARCH_PROFILES[subCategoryId];
  }

  const normTerm = normalizePersianSearchText(term);
  const inferredId = TERM_INFERRED_PROFILES[normTerm];
  if (inferredId && PLACE_SUBCATEGORY_SEARCH_PROFILES[inferredId]) {
    return PLACE_SUBCATEGORY_SEARCH_PROFILES[inferredId];
  }

  const matchTerms = [term, title].filter(Boolean);
  return {
    matchTerms,
    excludeTerms: [],
    requireTitleMatch: Boolean(subCategoryId),
    excludeStreets: Boolean(subCategoryId),
  };
}

/** @param {Array<{ title?: string; address?: string; osmKey?: string; osmValue?: string }>} items */
export function filterPlaceSearchResults(items, profile) {
  if (!profile || !items?.length) return items || [];

  const matchTerms = profile.matchTerms?.length ? profile.matchTerms : [];

  return items.filter((item) => {
    const title = String(item.title || '').trim();
    const address = String(item.address || '').trim();
    const combined = `${title} ${address}`.trim();

    if (!title) return false;

    if (profile.excludeStreets && (isOsmStreetItem(item) || isLikelyStreetOrAlleyName(title))) {
      return false;
    }

    if (containsExcludedTerm(title, profile.excludeTerms)) return false;
    if (containsExcludedTerm(combined, profile.excludeTerms)) return false;

    if (!matchTerms.length) return true;

    const titleHit = matchTerms.some((token) => termMatchesText(title, token));

    if (profile.requireTitleMatch) {
      return titleHit;
    }

    const combinedHit = matchTerms.some((token) => termMatchesText(combined, token));

    return titleHit || combinedHit;
  });
}
