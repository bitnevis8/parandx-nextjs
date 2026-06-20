'use client';

import HomeLatestMerchants from './HomeLatestMerchants';
import HomeGoodsMerchantSignupCta from './HomeGoodsMerchantSignupCta';
import HomeGoodsMerchantJoinPitch from './HomeGoodsMerchantJoinPitch';
import GoodsStonePavement from './GoodsStonePavement';
import { GOODS_MERCHANT_BLOCK_SHELL } from './homeGoodsTheme';

/** بلوک یکپارچه: آخرین فروشگاه‌ها + دعوت به ثبت‌نام */
export default function HomeGoodsMerchantCommunityBlock({ city, cityName }) {
  if (!city?.id) return null;

  return (
    <div id="home-path-merchant" className={GOODS_MERCHANT_BLOCK_SHELL}>
      <div className="relative group" data-goods-pavement-stage>
        <div className="relative z-[60] px-4 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6 xl:gap-10">
            <HomeLatestMerchants city={city} embedded pavementStage />
            <HomeGoodsMerchantJoinPitch />
          </div>
        </div>

        <div className="relative z-20 pb-4 sm:pb-5">
          <div className="relative">
            <div className="pointer-events-none relative z-[1] h-0">
              <GoodsStonePavement />
            </div>
            <div className="relative z-10">
              <HomeGoodsMerchantSignupCta cityName={cityName} embedded />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
