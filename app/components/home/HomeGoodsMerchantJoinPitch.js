'use client';

import { GOODS_MERCHANT_JOIN_PITCH } from '../../copy/goodsPageFa';
import { HOME_BLOCK_LEAD, HOME_BLOCK_TITLE } from './homePageTheme';

export default function HomeGoodsMerchantJoinPitch({ className = '' }) {
  return (
    <div
      className={`relative z-[60] max-w-md text-center lg:max-w-sm lg:pb-[3.25rem] lg:text-right xl:max-w-md ${className}`.trim()}
    >
      <h3 className={`${HOME_BLOCK_TITLE} text-lg sm:text-xl`}>{GOODS_MERCHANT_JOIN_PITCH.title}</h3>

      <p className={`${HOME_BLOCK_LEAD} mt-2.5 leading-[1.85] sm:mt-3`}>
        {GOODS_MERCHANT_JOIN_PITCH.body}
      </p>
    </div>
  );
}
