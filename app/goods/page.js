"use client";

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useCity } from '../context/CityContext';
import GoodsHero from '../components/home/GoodsHero';
import HomePageSkeleton from '../components/home/HomePageSkeleton';

export default function GoodsPage() {
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

  if (cityLoading || loading || !selectedCity) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <GoodsHero
        city={selectedCity}
        cityName={selectedCity.name}
        categories={categories}
      />
    </div>
  );
}
