import { HOME_CARD_SHELL } from './homePageTheme';

/**
 * پالت بلوک متخصصین — هم‌خوان با کارت‌های صفحه اصلی
 */
export const EXPERT_BLOCK_SHELL = `${HOME_CARD_SHELL} overflow-x-hidden`;

export const EXPERT_BLOCK_TOP = 'relative bg-gray-50 dark:bg-slate-950';

export const EXPERT_BLOCK_DIVIDER =
  'h-px w-full bg-gradient-to-l from-transparent via-gray-200 to-transparent dark:via-sky-700';

/** پایین — light: teal | dark: sky/slate هم‌خوان با سایت */
export const EXPERT_BLOCK_BOTTOM =
  'relative border-t border-transparent bg-gradient-to-br from-teal-900 via-[#0c4a46] to-teal-950 text-white dark:border-sky-800 dark:from-slate-900 dark:via-sky-950 dark:to-sky-900';

/** کارت عمودی آخرین متخصصین — دسکتاپ افقی */
export const EXPERT_CARD_WIDTH =
  'w-[5.75rem] min-w-[5.75rem] sm:w-[7.25rem] sm:min-w-[7.25rem]';

/** عرض ستون آواتار عمودی — موبایل */
export const EXPERT_MOBILE_AVATAR_COL = 'w-[4.25rem] shrink-0';
