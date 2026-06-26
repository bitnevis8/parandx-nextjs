import { HOME_CARD_SHELL } from './homePageTheme';

/** پالت بازار مغازه — کرم سنگی، سبز سدری، فیروزه کاشی */
export const GOODS_MARKET_PALETTE = {
  warmWhite: '#FAF7F0',
  pearlWhite: '#FAF8F2',
  pearlWhiteDeep: '#F8F4EA',
  stoneGreyCream: '#E5E1D8',
  cedarSoft: '#D8DDCE',
  cedarMid: '#5A6B4E',
  cedarDark: '#4F5F48',
  cedarDeep: '#3A4534',
  titleOnDark: '#F8F5EF',
  bodyOnDark: '#D4DCC8',
  mutedOnDark: '#B8C4AD',
  titleGreen: '#44513E',
  bodyGreen: '#5A6355',
  mutedGreen: '#6B7564',
  tileTurquoise: '#2E8B83',
  tileTurquoiseHover: '#267A73',
};

export const GOODS_FLOATING_PANEL_SHADOW = 'shadow-[0_15px_40px_rgba(0,0,0,0.08)]';

/** جابه‌جایی عمودی سنگ‌فرش و کارت‌های مغازه (هم‌اندازه) */
export const GOODS_PAVEMENT_SHIFT_Y = '50px';

/** گسترش عرض سنگ‌فرش — ۲٪ اضافه از هر طرف نسبت به ردیف مغازه‌ها */
export const GOODS_STONE_WIDTH_OVERSCAN = 0.02;
export const GOODS_STONE_EDGE_FADE_MASK =
  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)';

export const GOODS_MERCHANT_EDGE_FADE_MASK =
  'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)';

/** @deprecated — از GOODS_STONE_EDGE_FADE_MASK / GOODS_MERCHANT_EDGE_FADE_MASK */
export const GOODS_EDGE_FADE_MASK = GOODS_STONE_EDGE_FADE_MASK;

export const goodsStoneEdgeFadeMaskStyle = {
  WebkitMaskImage: GOODS_STONE_EDGE_FADE_MASK,
  maskImage: GOODS_STONE_EDGE_FADE_MASK,
};

export const goodsMerchantEdgeFadeMaskStyle = {
  WebkitMaskImage: GOODS_MERCHANT_EDGE_FADE_MASK,
  maskImage: GOODS_MERCHANT_EDGE_FADE_MASK,
};

/** @deprecated */
export const goodsEdgeFadeMaskStyle = goodsStoneEdgeFadeMaskStyle;

/** پالت بلوک فروشگاه‌ها — هم‌خوان با amber بازار کالا */
export const GOODS_BLOCK_SHELL = `${HOME_CARD_SHELL} overflow-x-hidden`;

/** بلوک فروشگاه‌ها — هم‌خوان با بلوک متخصصین */
export const GOODS_MERCHANT_BLOCK_SHELL = `${GOODS_BLOCK_SHELL} scroll-mt-28`;

export const GOODS_BLOCK_TOP = 'relative bg-gray-50 dark:bg-slate-950';

/** پایین بلوک فروشگاه — طلایی در روشن، slate در تاریک */
export const GOODS_BLOCK_BOTTOM =
  'relative border-t border-transparent bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950';

/** باکس ثبت فروشگاه — embedded */
export const GOODS_MERCHANT_SIGNUP_SHELL = 'relative text-white';
