'use client';

import { PhoneIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import GoodsCityMapExplorer from './GoodsCityMapExplorer';
import GoodsHeroLead from './GoodsHeroLead';
import GoodsMarketOverview from './GoodsMarketOverview';
import CityWeatherBadge from './CityWeatherBadge';
import HomeOrderGoodsNeedBlock from './HomeOrderGoodsNeedBlock';
import HomeGoodsSellerBlock from './HomeGoodsSellerBlock';
import { GOODS_HERO_INTRO } from '../../copy/goodsPageFa';
import {
  HOME_BTN_SECONDARY,
  HOME_CONTAINER,
  HOME_MAIN_BOTTOM,
  HOME_MAIN_TOP,
  HOME_PAGE_TITLE,
  HOME_SECTION_STACK,
} from './homePageTheme';

export default function GoodsHero({ city, cityName = 'شما', categories = [] }) {
  return (
    <section className="relative w-full bg-white">
      <div className={`${HOME_CONTAINER} ${HOME_SECTION_STACK} ${HOME_MAIN_TOP}`}>
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.08fr_0.92fr] md:gap-8 lg:gap-10">
          <div className="flex min-w-0 flex-col gap-4 text-center md:gap-5 md:text-right">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <h1 className={HOME_PAGE_TITLE}>
                <span className="text-amber-600">{GOODS_HERO_INTRO.titleBrand}</span>
                {' '}
                {GOODS_HERO_INTRO.titleRest}
              </h1>
              <GoodsHeroLead />
            </div>

            <div className="flex flex-col items-center gap-2 md:hidden">
              <CityWeatherBadge city={city} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/good.png"
                alt="بازار کالا در پرندیکس"
                className="h-auto w-full max-w-[15rem] object-contain opacity-90 sm:max-w-[18rem]"
              />
            </div>
          </div>

          <div className="hidden w-full flex-col items-center justify-center gap-2 md:flex md:items-start">
            <CityWeatherBadge city={city} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/good.png"
              alt="بازار کالا در پرندیکس"
              className="h-auto w-full max-w-[15rem] object-contain opacity-90 sm:max-w-[18rem] md:max-w-[19.5rem] lg:max-w-[21rem] xl:max-w-[22.5rem]"
            />
          </div>
          </div>

          <div className="flex flex-col gap-0">
            <GoodsCityMapExplorer city={city} categories={categories} connectBelow enableMerchantGlbMarkers />
            <HomeOrderGoodsNeedBlock connectTop />
          </div>
        </div>

        <GoodsMarketOverview />
      </div>

      <div className={`${HOME_CONTAINER} ${HOME_SECTION_STACK} ${HOME_MAIN_BOTTOM}`}>
        <HomeGoodsSellerBlock cityName={cityName} />

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
          <a href="tel:02156956691" className={`${HOME_BTN_SECONDARY} hidden sm:inline-flex`}>
            <PhoneIcon className="h-5 w-5 shrink-0" aria-hidden />
            <span dir="ltr">۰۲۱-۵۶۹۵۶۶۹۱</span>
          </a>
          <a href="tel:09380910512" className={HOME_BTN_SECONDARY}>
            <DevicePhoneMobileIcon className="h-5 w-5 shrink-0" aria-hidden />
            <span dir="ltr">۰۹۳۸-۰۹۱۰۵۱۲</span>
          </a>
        </div>
      </div>
    </section>
  );
}
