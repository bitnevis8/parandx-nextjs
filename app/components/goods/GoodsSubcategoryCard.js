'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../config/api';

const CARD_SHELL =
  'group flex h-[8.75rem] w-[8rem] min-w-[8rem] shrink-0 snap-start flex-col items-center justify-between rounded-2xl border px-3 py-3.5 text-center transition duration-200 active:scale-[0.98] sm:h-[9rem] sm:w-[8.5rem] sm:min-w-[8.5rem] sm:px-3.5 sm:py-4';

const CARD_ACTIVE =
  'border-amber-300 bg-amber-50/90 shadow-md ring-1 ring-amber-200/80';

const CARD_IDLE =
  'border-gray-200/90 bg-white shadow-sm hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md';

function useMerchantCount(cityId, slug, enabled) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!enabled || !cityId || !slug) return undefined;
    let cancelled = false;

    fetch(API_ENDPOINTS.merchants.getBrowseCount(cityId, slug))
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res.success) setCount(res.count ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, cityId, slug]);

  return count;
}

function CountLabel({ count }) {
  if (count === null) {
    return <span className="inline-block h-2.5 w-10 animate-pulse rounded bg-gray-100" aria-hidden />;
  }

  if (count === 0) {
    return <span className="text-[10px] text-gray-300">—</span>;
  }

  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 transition group-hover:bg-amber-100 group-hover:text-amber-800">
      {count.toLocaleString('fa-IR')} فروشگاه
    </span>
  );
}

export default function GoodsSubcategoryCard({
  sub,
  href,
  cityId,
  active = false,
  variant = 'subcategory',
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const count = useMerchantCount(cityId, sub.slug, visible);
  const isAll = variant === 'all';

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      className={`${CARD_SHELL} ${
        active
          ? CARD_ACTIVE
          : isAll
            ? 'border-dashed border-gray-200 bg-gray-50/70 hover:bg-white'
            : CARD_IDLE
      }`}
      aria-label={sub.title}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ring-1 transition sm:h-12 sm:w-12 sm:text-2xl ${
          active
            ? 'bg-white text-gray-800 ring-amber-200'
            : isAll
              ? 'bg-white text-gray-500 ring-gray-200 group-hover:ring-amber-200'
              : 'bg-gray-50 text-gray-800 ring-gray-100 group-hover:bg-white group-hover:ring-amber-200'
        }`}
        aria-hidden
      >
        {isAll ? '⋯' : sub.icon || '🛒'}
      </span>

      <p
        className={`flex min-h-[2.25rem] w-full flex-1 items-center justify-center text-[11px] font-semibold leading-snug sm:min-h-[2.5rem] sm:text-xs ${
          active ? 'text-amber-950' : 'text-gray-800'
        } ${isAll ? 'line-clamp-1' : 'line-clamp-2'}`}
      >
        {sub.title}
      </p>

      <div className="flex h-5 shrink-0 items-center justify-center">
        <CountLabel count={count} />
      </div>
    </Link>
  );
}

export function GoodsSubcategoryCardSkeleton() {
  return (
    <div className={`${CARD_SHELL} pointer-events-none border-gray-100 bg-white`} aria-hidden>
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-100 sm:h-12 sm:w-12" />
      <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-12 animate-pulse rounded-full bg-gray-50" />
    </div>
  );
}
