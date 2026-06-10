'use client';

import { PhoneIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import HomeCityMapExplorer from './HomeCityMapExplorer';
import HomeCategoryQuickNav from './HomeCategoryQuickNav';
import HomeHeroLead from './HomeHeroLead';
import HomeCustomerPaths from './HomeCustomerPaths';
import ServicesMarketOverview from './ServicesMarketOverview';
import HomeHeroSearch from './HomeHeroSearch';
import HomeExpertCommunityBlock from './HomeExpertCommunityBlock';
import HomeOrderRequestBlock from './HomeOrderRequestBlock';
import { HERO_INTRO } from '../../copy/friendlyFa';
import {
  HOME_BTN_SECONDARY,
  HOME_CATEGORY_BAND,
  HOME_CATEGORY_BAND_PAD,
  HOME_CONTAINER,
  HOME_MAIN_BOTTOM,
  HOME_MAIN_TOP,
  HOME_PAGE_TITLE,
  HOME_SECTION_STACK,
} from './homePageTheme';

export default function HomeHero({ city, cityName = 'شما', categories = [] }) {
  return (
    <section className="relative bg-white">
      <div id="home-path-categories" className={HOME_CATEGORY_BAND}>
        <div className={`${HOME_CONTAINER} ${HOME_CATEGORY_BAND_PAD}`}>
          <HomeCategoryQuickNav categories={categories} />
        </div>
      </div>

      <div
        className={`${HOME_CONTAINER} ${HOME_SECTION_STACK} ${HOME_MAIN_TOP} ${HOME_MAIN_BOTTOM}`}
      >
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.08fr_0.92fr] md:gap-8 lg:gap-10">
          <div className="flex min-w-0 flex-col gap-4 text-center md:gap-5 md:text-right">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <h1 className={HOME_PAGE_TITLE}>
                <span className="text-teal-600">{HERO_INTRO.titleBrand}</span>
                {' '}
                {HERO_INTRO.titleRest}
              </h1>
              <HomeHeroLead />
            </div>

            <div id="home-path-search" className="w-full scroll-mt-28">
              <HomeHeroSearch />
            </div>

            <HomeCustomerPaths />

            <div className="flex justify-center md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/clent_expert.webp"
                alt="کارفرما و متخصص در پرندیکس"
                className="h-auto w-full max-w-xs object-contain sm:max-w-sm"
              />
            </div>
          </div>

          <div className="hidden w-full items-center justify-center md:flex md:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clent_expert.webp"
              alt="کارفرما و متخصص در پرندیکس"
              className="h-auto w-full max-w-xs object-contain sm:max-w-sm md:max-w-[26rem] lg:max-w-[28rem] xl:max-w-[30rem]"
            />
          </div>
        </div>

        <ServicesMarketOverview />

        <div className="flex flex-col gap-0">
          <HomeCityMapExplorer city={city} categories={categories} connectBelow />
          <HomeOrderRequestBlock connectTop />
        </div>

        <HomeExpertCommunityBlock city={city} cityName={cityName} />

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
