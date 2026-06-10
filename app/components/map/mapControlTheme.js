/** دکمه‌های شناور روی نقشه — ظاهر شیشه‌ای یکپارچه */

export const MAP_GLASS_SURFACE =
  'border border-white/40 bg-white/20 shadow-sm backdrop-blur-md';

export const MAP_GLASS_ICON_BTN =
  `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${MAP_GLASS_SURFACE} text-white transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 active:scale-[0.98]`;

export const MAP_GLASS_GROUP =
  `inline-flex h-9 items-center gap-1 rounded-lg p-0.5 ${MAP_GLASS_SURFACE}`;

export const MAP_GLASS_TEXT = 'text-white/95';

export const MAP_GLASS_MUTED = 'text-white/75';
