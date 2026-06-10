'use client';

import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useRole } from './useRole';

export function useExpertMapSpecializations() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isExpert } = useRole();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedInExpert = isAuthenticated && isExpert();

  useEffect(() => {
    if (authLoading || !isLoggedInExpert) {
      setCategories([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetch(API_ENDPOINTS.experts.getSpecializations, { credentials: 'include' })
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
  }, [authLoading, isLoggedInExpert]);

  const slugs = useMemo(
    () =>
      categories
        .map((cat) => cat?.slug)
        .filter(Boolean),
    [categories]
  );

  return {
    slugs,
    categories,
    loading: authLoading || loading,
    hasSpecializations: slugs.length > 0,
    isLoggedInExpert,
  };
}
