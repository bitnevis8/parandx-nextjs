'use client';

import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export function useCategoryMapModels(marketplaceType = 'goods') {
  const [registry, setRegistry] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(API_ENDPOINTS.categories.getMapModelsRegistry(marketplaceType))
      .then((res) => (res.ok ? res.json() : { data: {} }))
      .then((json) => {
        if (cancelled) return;
        setRegistry(json?.data && typeof json.data === 'object' ? json.data : {});
      })
      .catch(() => {
        if (!cancelled) setRegistry({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [marketplaceType]);

  return useMemo(
    () => ({
      registry,
      loading,
    }),
    [registry, loading]
  );
}
