'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import {
  formatMerchantRating,
  getMerchantDisplayRating,
} from '../../utils/merchantDisplayUtils';

const VARIANT_CLASS = {
  card: 'inline-flex items-center gap-0.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-100 backdrop-blur-sm sm:text-[10px]',
  inline:
    'inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-100 sm:text-sm',
};

const STAR_CLASS = {
  card: 'h-3 w-3 shrink-0 text-amber-400',
  inline: 'h-3.5 w-3.5 shrink-0 text-amber-500 sm:h-4 sm:w-4',
};

/** نشان امتیاز فروشگاه — فعلاً عدد فیک تا پیاده‌سازی نظرات واقعی */
export default function MerchantRatingBadge({
  merchant,
  variant = 'card',
  className = '',
}) {
  const rating = getMerchantDisplayRating(merchant);
  const formatted = formatMerchantRating(rating);

  return (
    <span
      className={`${VARIANT_CLASS[variant] || VARIANT_CLASS.card} ${className}`.trim()}
      title={`امتیاز ${formatted} از ۵`}
      aria-label={`امتیاز ${formatted} از ۵`}
    >
      <StarIcon className={STAR_CLASS[variant] || STAR_CLASS.card} aria-hidden />
      <span className="tabular-nums leading-none">{formatted}</span>
    </span>
  );
}
