'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import ExpertPublicProfile from '../../components/expert/ExpertPublicProfile';

function ExpertPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-slate-100/80">
      <div className="h-[7.5rem] bg-teal-800/30 sm:h-[9.5rem]" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-[3.25rem] rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:-mt-[3.75rem] sm:p-6">
          <div className="flex gap-4">
            <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl bg-slate-200 sm:h-24 sm:w-24" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-6 w-40 rounded-lg bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-100" />
            </div>
          </div>
          <div className="mt-5 grid h-16 grid-cols-3 gap-2 rounded-xl bg-slate-50" />
          <div className="mt-5 h-11 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function ExpertDetailPage({ params }) {
  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedParams = use(params);
  const expertId = resolvedParams.id;

  useEffect(() => {
    if (!expertId) return undefined;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.experts.getById(expertId));
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'متخصسی با این مشخصات پیدا نشد');
        }
        if (cancelled) return;
        setExpert(result.data);

        const reviewsResponse = await fetch(
          `${API_ENDPOINTS.reviews.getAll}?expertId=${expertId}`
        );
        if (reviewsResponse.ok) {
          const reviewsResult = await reviewsResponse.json();
          if (!cancelled) setReviews(reviewsResult.data || []);
        }
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
  }, [expertId]);

  if (loading) return <ExpertPageSkeleton />;

  if (error || !expert) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <p className="text-base font-medium text-slate-800">
          {error || 'متخصسی با این مشخصات پیدا نشد'}
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
        >
          <ArrowRightIcon className="h-4 w-4" aria-hidden />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  return <ExpertPublicProfile expert={expert} reviews={reviews} />;
}
