'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import { MARKETPLACE } from '../../../config/marketplaceConfig';
import { DIVAR_CATEGORY_PLACEHOLDER } from '../../../copy/divarPageFa';
import HomePageSkeleton from '../../../components/home/HomePageSkeleton';
import ListingDigitalCategoriesSection from '../../../components/listings/ListingDigitalCategoriesSection';
import ListingGrid from '../../../components/listings/ListingGrid';
import { HOME_CONTAINER, HOME_MAIN_TOP } from '../../../components/home/homePageTheme';
import { useCity } from '../../../context/CityContext';

export default function DivarCategoryPage() {
  const params = useParams();
  const slug = params?.slug;
  const { selectedCity } = useCity();
  const [category, setCategory] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(
          API_ENDPOINTS.categories.getBySlug(slug, {
            marketplaceType: 'goods',
            categoryUsage: MARKETPLACE.divar.listingCategoryUsage,
          })
        );
        const catJson = catRes.ok ? await catRes.json() : { data: null };
        const cat = catJson.data || null;
        setCategory(cat);

        const isParentWithSubs = cat?.subcategories?.length > 0;
        if (!isParentWithSubs && cat) {
          const listRes = await fetch(
            API_ENDPOINTS.listings.getAll({
              subCategorySlug: slug,
              cityId: selectedCity?.id,
              limit: 24,
            }),
            { cache: 'no-store' }
          );
          const listJson = listRes.ok ? await listRes.json() : { data: [] };
          setListings(Array.isArray(listJson.data) ? listJson.data : []);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error('Error fetching category page:', err);
        setCategory(null);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, selectedCity?.id]);

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (!category) {
    return (
      <div className={`${HOME_CONTAINER} ${HOME_MAIN_TOP} min-h-[50vh] text-right`}>
        <p className="text-sm text-gray-600">دستهٔ آگهی یافت نشد.</p>
        <Link href="/divar" className="mt-4 inline-block text-sm font-semibold text-violet-700">
          {DIVAR_CATEGORY_PLACEHOLDER.backLabel}
        </Link>
      </div>
    );
  }

  const isParentWithSubs = category.subcategories?.length > 0;
  const newListingHref = isParentWithSubs
    ? '/divar/new'
    : `/divar/new?category=${encodeURIComponent(slug)}`;

  return (
    <div className={`${HOME_CONTAINER} ${HOME_MAIN_TOP} min-h-screen pb-16 text-right`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/divar"
          className="inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          ← {DIVAR_CATEGORY_PLACEHOLDER.backLabel}
        </Link>
        <Link
          href={newListingHref}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <PlusIcon className="h-4 w-4" aria-hidden />
          {DIVAR_CATEGORY_PLACEHOLDER.postCta}
        </Link>
      </div>

      <div className="mb-6 flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden>
          {category.icon || '📦'}
        </span>
        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{category.title}</h1>
          {selectedCity?.name ? (
            <p className="mt-1 text-sm text-gray-500">شهر: {selectedCity.name}</p>
          ) : null}
        </div>
      </div>

      {isParentWithSubs ? (
        <ListingDigitalCategoriesSection
          parentCategory={category}
          subcategories={category.subcategories}
        />
      ) : (
        <ListingGrid listings={listings} emptyMessage={DIVAR_CATEGORY_PLACEHOLDER.emptyListings} />
      )}
    </div>
  );
}
