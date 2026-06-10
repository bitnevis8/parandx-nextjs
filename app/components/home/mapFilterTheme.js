/** توکن‌های بصری یکپارچه — نوار فیلتر نقشه (دسکتاپ + موبایل) */

export const MAP_FILTER_HEIGHT = 'h-9';

export const MAP_FILTER_INPUT_CLASS = `${MAP_FILTER_HEIGHT} py-0 pr-9 pl-9 text-[13px] leading-normal`;

export const MAP_FILTER_SELECT_CLASS = `${MAP_FILTER_HEIGHT} py-0 pl-2.5 pr-8 text-[13px] leading-normal`;

export const MAP_FILTER_FIELD =
  'w-full rounded-lg border border-gray-200/90 bg-white text-[13px] text-gray-900 shadow-sm transition ' +
  'placeholder:text-gray-400 hover:border-gray-300 ' +
  'focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 ' +
  'disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400';

export const MAP_FILTER_LABEL =
  'mb-1.5 block text-[11px] font-semibold leading-none text-gray-500';

export const MAP_FILTER_SECTION =
  'text-[11px] font-bold leading-none text-gray-700';

export const MAP_FILTER_TOOLBAR =
  'shrink-0 border-b border-gray-200/80 bg-gradient-to-b from-slate-50/95 via-white to-white';

export const MAP_FILTER_TOOLBAR_PAD = 'px-3 py-2 sm:px-4 lg:px-4';

/** نوار ابزار بالای نقشه کالا — پس‌زمینه خنثی یکپارچه */
export const GOODS_MAP_TOOLBAR =
  'border-b border-gray-200/90 bg-gray-50/95';
export const GOODS_MAP_TOOLBAR_PAD = MAP_FILTER_TOOLBAR_PAD;

export function mapFilterFieldClass(sizeClass = '') {
  return [MAP_FILTER_FIELD, MAP_FILTER_HEIGHT, sizeClass].filter(Boolean).join(' ');
}
