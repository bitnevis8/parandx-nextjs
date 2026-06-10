'use client';

import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useRole } from './useRole';

export function useMerchantMapCategories() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isMerchant } = useRole();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedInMerchant = isAuthenticated && isMerchant();

  useEffect(() => {
    if (authLoading || !isLoggedInMerchant) {
      setCategories([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetch(API_ENDPOINTS.merchants.getCategories, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        setCategories(Array.isArray(json?.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedInMerchant]);

  const slugs = useMemo(
    () => categories.map((cat) => cat?.slug).filter(Boolean),
    [categories]
  );

  return {
    slugs,
    categories,
    loading: authLoading || loading,
    hasCategories: slugs.length > 0,
    isLoggedInMerchant,
  };
}
