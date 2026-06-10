import { HOME_CARD_SHELL } from './homePageTheme';

/**
 * پالت بلوک متخصصین — هم‌خوان با کارت‌های صفحه اصلی
 */
export const EXPERT_BLOCK_SHELL = `${HOME_CARD_SHELL} overflow-x-hidden`;

export const EXPERT_BLOCK_TOP = 'relative bg-gray-50';

export const EXPERT_BLOCK_DIVIDER =
  'h-px w-full bg-gradient-to-l from-transparent via-gray-200 to-transparent';

/** پایین: teal عمیق هم‌خانواده با teal-600 سایت، نه slate-900 */
export const EXPERT_BLOCK_BOTTOM =
  'relative bg-gradient-to-br from-teal-900 via-[#0c4a46] to-teal-950 text-white';

/** کارت عمودی آخرین متخصصین — آواتار + نام */
export const EXPERT_CARD_WIDTH =
  'w-[5.75rem] min-w-[5.75rem] sm:w-[7.25rem] sm:min-w-[7.25rem]';
