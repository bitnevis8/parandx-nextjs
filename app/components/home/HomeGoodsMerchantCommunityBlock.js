'use client';

import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { GOODS_MERCHANT_COMMUNITY_HEADER } from '../../copy/goodsPageFa';
import HomeLatestMerchants from './HomeLatestMerchants';
import LatestGoodsIllustration from './LatestGoodsIllustration';
import HomeGoodsMerchantSignupCta from './HomeGoodsMerchantSignupCta';
import HomeSectionHeader from './HomeSectionHeader';
import GoodsMerchantCommunityMobileHeader from './GoodsMerchantCommunityMobileHeader';
import { GOODS_MERCHANT_BLOCK_SHELL } from './homeGoodsTheme';

/** بلوک یکپارچه: آخرین فروشگاه‌ها + دعوت به ثبت‌نام */
export default function HomeGoodsMerchantCommunityBlock({ city, cityName }) {
  if (!city?.id) return null;

  return (
    <div id="home-path-merchant" className={GOODS_MERCHANT_BLOCK_SHELL}>
      <GoodsMerchantCommunityMobileHeader cityName={cityName || city?.name} />

      <HomeSectionHeader
        icon={BuildingStorefrontIcon}
        title={GOODS_MERCHANT_COMMUNITY_HEADER.title}
        description={GOODS_MERCHANT_COMMUNITY_HEADER.description}
        iconClassName="bg-amber-50 text-amber-600 ring-amber-200/80 dark:bg-slate-800 dark:text-amber-400 dark:ring-slate-700"
        className="hidden sm:block"
      />

      <HomeLatestMerchants city={city} embedded />
      <div className="relative">
        <LatestGoodsIllustration />
        <HomeGoodsMerchantSignupCta cityName={cityName} embedded />
      </div>
    </div>
  );
}
