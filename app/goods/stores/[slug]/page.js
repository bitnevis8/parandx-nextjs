'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import MerchantPublicProfile from '../../../components/merchant/MerchantPublicProfile';

function StorePageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-amber-50/50">
      <div className="h-[7.5rem] bg-amber-900/30 sm:h-[9.5rem]" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-[3.25rem] rounded-2xl border border-amber-100 bg-white p-4 shadow-lg sm:-mt-[3.75rem] sm:p-6">
          <div className="flex gap-4">
            <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl bg-amber-100 sm:h-24 sm:w-24" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-6 w-48 rounded-lg bg-amber-100" />
              <div className="h-4 w-32 rounded bg-amber-50" />
              <div className="h-4 w-full max-w-sm rounded bg-gray-50" />
            </div>
          </div>
          <div className="mt-5 h-11 rounded-xl bg-amber-50" />
        </div>
      </div>
    </div>
  );
}

export default function MerchantStorePage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_ENDPOINTS.merchants.getPublicProfile(slug));
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || 'فروشگاه یافت نشد');
        }
        if (!cancelled) setMerchant(result.data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'خطا در بارگذاری');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!merchant?.storeSlug) return;
    const canonical = String(merchant.storeSlug).trim().toLowerCase();
    const current = String(slug || '').trim().toLowerCase();
    if (canonical && current !== canonical) {
      router.replace(`/goods/stores/${canonical}`, { scroll: false });
    }
  }, [merchant, slug, router]);

  if (loading) return <StorePageSkeleton />;

  if (error || !merchant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-amber-50/40 px-4 text-center">
        <p className="text-base font-medium text-slate-800">{error || 'فروشگاه یافت نشد'}</p>
        <Link
          href="/goods"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
        >
          <ArrowRightIcon className="h-4 w-4" aria-hidden />
          بازگشت به بازار کالا
        </Link>
      </div>
    );
  }

  return <MerchantPublicProfile merchant={merchant} />;
}
