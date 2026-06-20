'use client';


import HomeCityMapExplorer from './HomeCityMapExplorer';
import HomeCategoryQuickNav from './HomeCategoryQuickNav';
import HomeCustomerPaths from './HomeCustomerPaths';
import ServicesMarketOverview, { ServicesMobileRoleCards } from './ServicesMarketOverview';
import ServicesMobileGuideLink from './ServicesMobileGuideLink';
import HomeHeroSearch from './HomeHeroSearch';
import HomeExpertCommunityBlock from './HomeExpertCommunityBlock';
import HomeOrderRequestBlock from './HomeOrderRequestBlock';
import { HERO_INTRO } from '../../copy/friendlyFa';
import {
  HOME_SERVICES_CATEGORY_BAND,
  HOME_CATEGORY_BAND_PAD,
  HOME_CONTAINER,
  HOME_MAIN_BOTTOM,
  HOME_MAIN_TOP,
  HOME_PAGE_TITLE,
  HOME_SECTION_STACK,
} from './homePageTheme';

export default function HomeHero({ city, cityName = 'شما', categories = [] }) {
  return (
    <section className="relative bg-white dark:bg-transparent">
      <div id="home-path-categories" className={HOME_SERVICES_CATEGORY_BAND}>
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
                {HERO_INTRO.titleBeforeExpert}{' '}
                <span className="text-teal-600 dark:text-sky-300">{HERO_INTRO.titleExpert}</span>{' '}
                {HERO_INTRO.titleAfterExpert}
              </h1>
              <ServicesMobileGuideLink />
            </div>

            <div id="home-path-search" className="hidden w-full scroll-mt-28 md:block">
              <HomeHeroSearch />
            </div>

            <HomeCustomerPaths />

            <div className="flex flex-col gap-3 md:hidden">
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/clent_expert.webp"
                  alt="کاربر و متخصص در پرندیکس"
                  className="h-auto w-full max-w-xs object-contain sm:max-w-sm"
                />
              </div>
              <ServicesMobileRoleCards />
            </div>
          </div>

          <div className="hidden w-full items-center justify-center md:flex md:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clent_expert.webp"
              alt="کاربر و متخصص در پرندیکس"
              className="h-auto w-full max-w-xs object-contain sm:max-w-sm md:max-w-[26rem] lg:max-w-[28rem] xl:max-w-[30rem]"
            />
          </div>
        </div>

        <ServicesMarketOverview />

        <HomeCityMapExplorer city={city} categories={categories} />

        <HomeOrderRequestBlock city={city} />

        <HomeExpertCommunityBlock city={city} cityName={cityName} />
      </div>
    </section>
  );
}
