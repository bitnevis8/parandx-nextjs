'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { API_ENDPOINTS } from '../../config/api';

function formatTrustLabel(count) {
  const n = Number(count) || 0;
  return `${n.toLocaleString('fa-IR')} نفر اعتماد`;
}

/** نمایش کوتاه: ۳۸ نفر اعتماد */
export default function ExpertTrustBadge({ expertId, initialCount }) {
  const [count, setCount] = useState(
    typeof initialCount === 'number' ? initialCount : null
  );

  useEffect(() => {
    if (typeof initialCount === 'number') setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (!expertId) return undefined;

    const refresh = () => {
      fetch(API_ENDPOINTS.experts.trustStatus(expertId), { credentials: 'include' })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) {
            setCount(Number(res.data.trustCount ?? res.data.followerCount) || 0);
          }
        })
        .catch(() => {});
    };

    refresh();

    const onTrustChange = (e) => {
      if (Number(e.detail?.expertId) === Number(expertId)) refresh();
    };
    window.addEventListener('expert-trust-changed', onTrustChange);
    window.addEventListener('expert-follow-changed', onTrustChange);
    return () => {
      window.removeEventListener('expert-trust-changed', onTrustChange);
      window.removeEventListener('expert-follow-changed', onTrustChange);
    };
  }, [expertId]);

  if (count === null || count < 1) return null;

  return (
    <p
      className="mt-2 inline-flex items-center gap-1 text-xs text-amber-800 sm:text-sm"
      title={`${count} نفر بهش اعتماد کردن`}
    >
      <StarIcon className="h-3.5 w-3.5 shrink-0 text-amber-500 sm:h-4 sm:w-4" aria-hidden />
      <span className="font-medium tabular-nums">{formatTrustLabel(count)}</span>
    </p>
  );
}
