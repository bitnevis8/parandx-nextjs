/** استایل‌های پایهٔ OpenFreeMap برای MapLibre */

export const DEFAULT_MAP_STYLE_ID = 'liberty';

/** پیش‌فرض در تم تاریک */
export const DARK_DEFAULT_MAP_STYLE_ID = 'fiord';

export function resolveDefaultMapStyleId(isDark = false) {
  return isDark ? DARK_DEFAULT_MAP_STYLE_ID : DEFAULT_MAP_STYLE_ID;
}

export const MAP_STYLE_PRESETS = [
  {
    id: 'liberty',
    label: 'لیبرتی',
    description: 'پیش‌فرض — رنگی و خوانا',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    swatch: '#e8e0d8',
  },
  {
    id: 'bright',
    label: 'روشن',
    description: 'روشن با جزئیات بیشتر',
    url: 'https://tiles.openfreemap.org/styles/bright',
    swatch: '#f5f0e8',
  },
  {
    id: 'positron',
    label: 'مینیمال',
    description: 'ساده و کم‌حجم',
    url: 'https://tiles.openfreemap.org/styles/positron',
    swatch: '#ebebeb',
  },
  {
    id: 'dark',
    label: 'تاریک',
    description: 'مناسب شب',
    url: 'https://tiles.openfreemap.org/styles/dark',
    swatch: '#2a2a2a',
  },
  {
    id: 'fiord',
    label: 'فیورد',
    description: 'آبی تیره',
    url: 'https://tiles.openfreemap.org/styles/fiord',
    swatch: '#1e3a4a',
  },
];

export function resolveMapStyleUrl(styleId = DEFAULT_MAP_STYLE_ID) {
  const preset = MAP_STYLE_PRESETS.find((item) => item.id === styleId);
  return preset?.url || MAP_STYLE_PRESETS[0].url;
}

export function resolveMapStylePreset(styleId = DEFAULT_MAP_STYLE_ID) {
  return MAP_STYLE_PRESETS.find((item) => item.id === styleId) || MAP_STYLE_PRESETS[0];
}
