"use client";

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from './config/api';
import { useCity } from './context/CityContext';
import HomeHero from './components/home/HomeHero';
import CategoryGroupsSection from './components/home/CategoryGroupsSection';
import HomePageSkeleton from './components/home/HomePageSkeleton';
import { SERVICES_SECTION } from './copy/friendlyFa';
import {
  HOME_ALT_SECTION,
  HOME_ALT_SECTION_HEADER_MB,
  HOME_BLOCK_LEAD,
  HOME_BLOCK_TITLE,
  HOME_CONTAINER,
} from './components/home/homePageTheme';

export default function Home() {
  const { selectedCity, loading: cityLoading } = useCity();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cityLoading || !selectedCity?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(API_ENDPOINTS.categories.getAll('services'));
        const catData = catRes.ok ? await catRes.json() : { data: [] };
        const mainCats = Array.isArray(catData.data) ? catData.data : [];
        setCategories(mainCats);

      } catch (err) {
        console.error('Error fetching data for homepage:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity?.id, cityLoading]);

  if (cityLoading || loading || !selectedCity) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white dark:bg-transparent">
      <HomeHero
        city={selectedCity}
        cityName={selectedCity.name}
        categories={categories}
      />

      <section className={HOME_ALT_SECTION}>
        <div className={HOME_CONTAINER}>
          <header className={`${HOME_ALT_SECTION_HEADER_MB} text-center`}>
            <h2 className={HOME_BLOCK_TITLE}>
              {SERVICES_SECTION.titleSuffix} {selectedCity.name}
            </h2>
            <p className={`${HOME_BLOCK_LEAD} mx-auto mt-2 max-w-2xl text-center`}>
              {SERVICES_SECTION.lead}
            </p>
          </header>
          <CategoryGroupsSection categories={categories} />
        </div>
      </section>
    </div>
  );
}
