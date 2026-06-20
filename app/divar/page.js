'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { MARKETPLACE } from '../config/marketplaceConfig';
import DivarHero from '../components/listings/DivarHero';
import ListingDigitalCategoriesSection from '../components/listings/ListingDigitalCategoriesSection';
import HomePageSkeleton from '../components/home/HomePageSkeleton';

export default function DivarPage() {
  const [digitalCategory, setDigitalCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDigitalListingCategories = async () => {
      setLoading(true);
      try {
        const slug = MARKETPLACE.divar.digitalParentSlug;
        const res = await fetch(
          API_ENDPOINTS.categories.getBySlug(slug, {
            marketplaceType: 'goods',
            categoryUsage: MARKETPLACE.divar.listingCategoryUsage,
          })
        );
        const json = res.ok ? await res.json() : { data: null };
        setDigitalCategory(json.data || null);
      } catch (err) {
        console.error('Error fetching listing categories:', err);
        setDigitalCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDigitalListingCategories();
  }, []);

  if (loading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <DivarHero>
        <ListingDigitalCategoriesSection
          parentCategory={digitalCategory}
          subcategories={digitalCategory?.subcategories || []}
        />
      </DivarHero>
    </div>
  );
}
