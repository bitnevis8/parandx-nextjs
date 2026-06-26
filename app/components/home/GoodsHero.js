'use client';

import GoodsCityMapExplorer from './GoodsCityMapExplorer';
import GoodsHeroLead from './GoodsHeroLead';
import CityWeatherBadge from './CityWeatherBadge';
import HomeGoodsTradePathsRow from './HomeGoodsTradePathsRow';
import HomeGoodsMerchantCommunityBlock from './HomeGoodsMerchantCommunityBlock';
import CityHeroVisual from './CityHeroVisual';
import { GOODS_HERO_INTRO } from '../../copy/goodsPageFa';
import {
  HOME_CONTAINER,
  HOME_MAIN_BOTTOM,
  HOME_MAIN_TOP,
  HOME_PAGE_TITLE,
  HOME_SECTION_STACK,
} from './homePageTheme';

export default function GoodsHero({ city, cityName = 'شما', categories = [] }) {
  return (
    <section className="relative w-full bg-white">
      <div
        className={`${HOME_CONTAINER} ${HOME_SECTION_STACK} ${HOME_MAIN_TOP} ${HOME_MAIN_BOTTOM}`}
      >
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
                <CityHeroVisual
                  city={city}
                  marketplace="goods"
                  alt="بازار کالا در پرندیکس"
                  className="opacity-95"
                />
              </div>
            </div>

            <div className="hidden w-full flex-col items-center justify-center gap-2 md:flex md:items-start">
              <CityWeatherBadge city={city} />
              <CityHeroVisual
                city={city}
                marketplace="goods"
                alt="بازار کالا در پرندیکس"
                className="opacity-95"
              />
            </div>
          </div>

          <GoodsCityMapExplorer city={city} categories={categories} />
        </div>

        <HomeGoodsMerchantCommunityBlock city={city} cityName={cityName} />

        <HomeGoodsTradePathsRow />
      </div>
    </section>
  );
}
