'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { API_ENDPOINTS } from '../../../config/api';
import { useCity } from '../../../context/CityContext';
import GoodsCategoryLandingView from '../../../components/goods/GoodsCategoryLandingView';
import { HOME_CONTAINER, HOME_MAIN_TOP } from '../../../components/home/homePageTheme';

function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${HOME_CONTAINER} ${HOME_MAIN_TOP}`}>
        <div className="mb-5 h-4 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-52 animate-pulse rounded-2xl bg-gray-200/80" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-200/70" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GoodsCategoryPage({ params }) {
  const { slug } = use(params);
  const { loading: cityLoading } = useCity();

  const [category, setCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [catLoading, setCatLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setCatLoading(true);
    setNotFound(false);
    setParentCategory(null);

    fetch(API_ENDPOINTS.categories.getBySlug(slug, { marketplaceType: 'goods' }))
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.success || !res.data) {
          setNotFound(true);
          return;
        }

        setCategory(res.data);

        if (res.data.parentId) {
          const parentRes = await fetch(
            `${API_ENDPOINTS.categories.getById(res.data.parentId)}?marketplaceType=goods`
          );
          if (parentRes.ok) {
            const parentJson = await parentRes.json();
            if (!cancelled && parentJson.success && parentJson.data) {
              setParentCategory(parentJson.data);
            }
          }
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setCatLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (catLoading || cityLoading) {
    return <CategoryPageSkeleton />;
  }

  if (notFound || !category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm ring-1 ring-gray-100">
          🔍
        </span>
        <p className="text-lg font-bold text-gray-800">دسته‌بندی یافت نشد</p>
        <Link href="/goods" className="text-sm font-medium text-amber-700 hover:text-amber-900">
          بازگشت به بازار کالا
        </Link>
      </div>
    );
  }

  return (
    <GoodsCategoryLandingView
      category={category}
      parentCategory={parentCategory}
      slug={slug}
    />
  );
}
