'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../../config/api';
import { useCity } from '../../../context/CityContext';
import GoodsCityMapExplorer from '../../../components/home/GoodsCityMapExplorer';
import HomePageSkeleton from '../../../components/home/HomePageSkeleton';

export default function GoodsMapDashboardPage() {
  const { selectedCity, loading: cityLoading } = useCity();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cityLoading || !selectedCity?.id) return;

    let cancelled = false;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.categories.getAll('goods'));
        const json = res.ok ? await res.json() : { data: [] };
        if (!cancelled) {
          setCategories(Array.isArray(json.data) ? json.data : []);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [selectedCity?.id, cityLoading]);

  if (cityLoading || loading || !selectedCity) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:py-6">
      <GoodsCityMapExplorer
        city={selectedCity}
        categories={categories}
        sectionId="dashboard-goods-map"
      />
    </div>
  );
}
