'use client';

import { useEffect, useState, use } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import CategoryMainLandingView from './CategoryMainLandingView';
import SubcategoryLandingView from './SubcategoryLandingView';
import { LandingLoading, LandingNotFound } from './categoryLandingShared';

export default function CategoryLandingPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState(null);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return undefined;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setParent(null);

        const res = await fetch(API_ENDPOINTS.categories.getBySlug(slug));
        if (!res.ok) throw new Error('not-found');
        const json = await res.json();
        if (!json.success || !json.data) throw new Error('not-found');

        const data = json.data;
        let parentData = null;

        if (data.parentId) {
          const parentRes = await fetch(API_ENDPOINTS.categories.getById(data.parentId));
          if (parentRes.ok) {
            const parentJson = await parentRes.json();
            if (parentJson.success) parentData = parentJson.data;
          }
        }

        if (!cancelled) {
          setCategory(data);
          setParent(parentData);
        }
      } catch {
        if (!cancelled) setError('not-found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <LandingLoading />;
  if (error || !category) return <LandingNotFound marketplaceType={category?.marketplaceType} />;

  const marketplaceType = category.marketplaceType || (category.id >= 1000 ? 'goods' : 'services');

  if (category.parentId) {
    return (
      <SubcategoryLandingView
        category={category}
        parent={parent}
        marketplaceType={marketplaceType}
      />
    );
  }

  return <CategoryMainLandingView category={category} marketplaceType={marketplaceType} />;
}
