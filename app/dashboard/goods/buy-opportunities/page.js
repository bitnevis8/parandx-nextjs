'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BellAlertIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import RequestListCard from '../../../components/requests/RequestListCard';
import { cardClass, DashboardLoading } from '../../../components/ui/dashboard/DashboardUi';
import { fetchAuth } from '../../../utils/requestFormat';

const FILTERS = [
  { id: 'all', label: 'همه' },
  { id: 'pending', label: 'جدید' },
  { id: 'participated', label: 'شرکت‌کرده' },
];

function filterList(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((r) => {
    const haystack = [r.title, r.description, r.location, r.category?.title, r.subCategory?.title]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export default function GoodsBuyOpportunitiesPage() {
  const [pending, setPending] = useState([]);
  const [participated, setParticipated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const loadInvolvements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.requests.buyerInvolvements, fetchAuth);
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'خطا در بارگذاری');
        setPending([]);
        setParticipated([]);
        return;
      }
      setPending(data.data?.pending || []);
      setParticipated(data.data?.participated || []);
    } catch {
      setError('خطا در ارتباط با سرور');
      setPending([]);
      setParticipated([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvolvements();
  }, [loadInvolvements]);

  const displayedRequests = useMemo(() => {
    if (filter === 'pending') return filterList(pending, query);
    if (filter === 'participated') return filterList(participated, query);
    return filterList(
      [...pending.map((r) => ({ ...r, _source: 'pending' })), ...participated.map((r) => ({ ...r, _source: 'participated' }))],
      query
    );
  }, [pending, participated, filter, query]);

  if (loading) return <DashboardLoading />;

  const isEmpty = pending.length === 0 && participated.length === 0;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-6">
      <div className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-violet-100 bg-gradient-to-bl from-violet-50/70 to-white px-4 py-5 sm:px-6">
          <p className="text-xs font-medium text-violet-800">بازار کالا</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">فرصت‌های خرید</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
            عرضه‌های کالای ثبت‌شده در دسته‌هایی که نیاز دارید — پیشنهاد خرید بفرستید.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!isEmpty ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === f.id ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-9 pl-3 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </label>
          </div>

          {displayedRequests.length > 0 ? (
            <div className="space-y-4">
              {displayedRequests.map((request) => (
                <RequestListCard
                  key={request.id}
                  request={{ ...request, bids: [] }}
                  myBid={request.myBid}
                  showChat={Boolean(request.myBid)}
                  theme="goods"
                />
              ))}
            </div>
          ) : (
            <div className={`${cardClass} px-4 py-8 text-center text-sm text-gray-600`}>موردی با این فیلتر یافت نشد.</div>
          )}
        </>
      ) : (
        <div className={`${cardClass} px-4 py-12 text-center sm:px-6`}>
          <BellAlertIcon className="mx-auto h-12 w-12 text-violet-300" />
          <h2 className="mt-4 text-lg font-bold text-gray-900">فرصت خریدی ندارید</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
            وقتی عرضه‌ای در دسته‌های مرتبط با نیازهای شما ثبت شود، اینجا نمایش داده می‌شود.
          </p>
          <Link href="/goods/needs/new" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-800">
            <ClipboardDocumentListIcon className="h-4 w-4" />
            ثبت نیاز کالا
          </Link>
        </div>
      )}
    </div>
  );
}
