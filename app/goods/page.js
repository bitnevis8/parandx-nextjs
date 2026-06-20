"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../config/api';
import { useCity } from '../context/CityContext';
import GoodsHero from '../components/home/GoodsHero';
import HomePageSkeleton from '../components/home/HomePageSkeleton';
import GoodsCategoryBrowse from '../components/goods/GoodsCategoryBrowse';
import HomeCategoryQuickNav from '../components/home/HomeCategoryQuickNav';
import { GOODS_POPULAR_CATEGORY_SLUGS } from '../config/goodsPopularCategories';
import {
  HOME_CATEGORY_BAND,
  HOME_CATEGORY_BAND_PAD,
  HOME_CONTAINER,
} from '../components/home/homePageTheme';

export default function GoodsPage() {
  const router = useRouter();
  const { selectedCity, loading: cityLoading } = useCity();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cityLoading || !selectedCity?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(API_ENDPOINTS.categories.getAll('goods'));
        const catData = catRes.ok ? await catRes.json() : { data: [] };
        const mainCats = Array.isArray(catData.data) ? catData.data : [];
        setCategories(mainCats);
      } catch (err) {
        console.error('Error fetching goods categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity?.id, cityLoading]);

  const handleSelectSubcategory = useCallback(
    (subcategoryOrMatch) => {
      const sub = subcategoryOrMatch?.subcategory ?? subcategoryOrMatch;
      if (sub?.slug) router.push(`/goods/categories/${sub.slug}`);
    },
    [router]
  );

  const handleSelectMainWithoutSubs = useCallback(
    (category) => {
      router.push(`/goods/categories/${category.slug}`);
    },
    [router]
  );

  if (cityLoading || loading || !selectedCity) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <div id="goods-path-categories" className={HOME_CATEGORY_BAND}>
        <div className={`${HOME_CONTAINER} ${HOME_CATEGORY_BAND_PAD}`}>
          <HomeCategoryQuickNav
            categories={categories}
            useEmojiIcons
            accent="amber"
            expandable
            drillDownSubcategories
            popularSlugs={GOODS_POPULAR_CATEGORY_SLUGS}
            onSelectCategory={handleSelectMainWithoutSubs}
            onSelectSubcategory={handleSelectSubcategory}
          />
        </div>
      </div>

      <GoodsHero
        city={selectedCity}
        cityName={selectedCity.name}
        categories={categories}
      />

      <GoodsCategoryBrowse categories={categories} />
    </div>
  );
}
