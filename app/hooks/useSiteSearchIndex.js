'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useCity } from '../context/CityContext';

export function useSiteSearchIndex(marketplaceType = 'services') {
  const { selectedCity, loading: cityLoading } = useCity();
  const [searchCategoriesAll, setSearchCategoriesAll] = useState([]);
  const [searchExpertsAll, setSearchExpertsAll] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (cityLoading || !selectedCity?.id) {
      setSearchCategoriesAll([]);
      setSearchExpertsAll([]);
      setReady(!cityLoading && Boolean(selectedCity?.id));
      return undefined;
    }

    let cancelled = false;
    setReady(false);

    (async () => {
      try {
        const catRes = await fetch(API_ENDPOINTS.categories.getAll(marketplaceType));
        const catData = catRes.ok ? await catRes.json() : { data: [] };
        const mainCats = Array.isArray(catData.data) ? catData.data : [];
        const flatForSearch = [];
        mainCats.forEach((main) => {
          flatForSearch.push({ type: 'main', id: main.id, title: main.title, slug: main.slug });
          (main.subcategories || []).forEach((sub) => {
            flatForSearch.push({
              type: 'sub',
              id: sub.id,
              title: sub.title,
              slug: sub.slug,
              parentSlug: main.slug,
            });
          });
        });

        let list = [];
        if (marketplaceType === 'services') {
          const expRes = await fetch(API_ENDPOINTS.experts.getAllWithLimit(50, selectedCity.id));
          const expData = expRes.ok ? await expRes.json() : { data: [] };
          list = Array.isArray(expData.data) ? expData.data : [];
        }

        if (cancelled) return;
        setSearchCategoriesAll(flatForSearch);
        setSearchExpertsAll(list);
      } catch {
        if (!cancelled) {
          setSearchCategoriesAll([]);
          setSearchExpertsAll([]);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCity?.id, cityLoading, marketplaceType]);

  return {
    searchCategoriesAll,
    searchExpertsAll,
    ready,
    cityName: selectedCity?.name || 'شهر شما',
    cityLoading,
    marketplaceType,
  };
}
