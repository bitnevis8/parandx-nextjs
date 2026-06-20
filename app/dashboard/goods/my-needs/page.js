'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import RequestListCard from '../../../components/requests/RequestListCard';
import {
  cardClass,
  DashboardLoading,
  primaryBtnClass,
} from '../../../components/ui/dashboard/DashboardUi';
import {
  ACTIVE_REQUEST_STATUSES,
  countPendingBids,
  fetchAuth,
  REQUEST_STATUS_LABELS,
} from '../../../utils/requestFormat';

const FILTERS = [
  { id: 'active', label: 'فعال' },
  { id: 'open', label: REQUEST_STATUS_LABELS.open },
  { id: 'in_progress', label: REQUEST_STATUS_LABELS.in_progress },
  { id: 'with_bids', label: 'دارای پیشنهاد' },
  { id: 'all', label: 'همه' },
];

function filterRequests(requests, filter, query) {
  let list = [...requests];

  if (filter === 'active') {
    list = list.filter((r) => ACTIVE_REQUEST_STATUSES.includes(r.status));
  } else if (filter === 'open' || filter === 'in_progress') {
    list = list.filter((r) => r.status === filter);
  } else if (filter === 'with_bids') {
    list = list.filter((r) => (r.bids?.length || 0) > 0);
  }

  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter((r) => {
      const haystack = [r.title, r.description, r.location, r.category?.title, r.subCategory?.title]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return list;
}

export default function GoodsMyNeedsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active');
  const [query, setQuery] = useState('');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.requests.mine('goods', 'need'), fetchAuth);
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'خطا در بارگذاری');
        setRequests([]);
        return;
      }
      setRequests(data.data || []);
    } catch {
      setError('خطا در ارتباط با سرور');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(
    () => filterRequests(requests, filter, query),
    [requests, filter, query]
  );

  const stats = useMemo(() => {
    const active = requests.filter((r) => ACTIVE_REQUEST_STATUSES.includes(r.status));
    const open = requests.filter((r) => r.status === 'open');
    const withBids = requests.filter((r) => (r.bids?.length || 0) > 0);
    const pendingBids = requests.reduce((sum, r) => sum + countPendingBids(r), 0);
    return { active: active.length, open: open.length, withBids: withBids.length, pendingBids };
  }, [requests]);

  if (loading) return <DashboardLoading />;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-6">
      <div className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-amber-100 bg-gradient-to-bl from-amber-50/70 to-white px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-amber-800">بازار کالا</p>
              <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">نیازهای من</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                نیازهای کالایی که ثبت کرده‌اید و پیشنهادهای فروشگاه‌ها را اینجا پیگیری کنید.
              </p>
            </div>
            <Link href="/goods/needs/new" className={`${primaryBtnClass} shrink-0 bg-amber-600 hover:bg-amber-700`}>
              <PlusIcon className="h-4 w-4" aria-hidden />
              ثبت نیاز جدید
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-gray-100 p-4 sm:grid-cols-4 sm:p-5">
          <StatCard label="فعال" value={stats.active} />
          <StatCard label="باز" value={stats.open} />
          <StatCard label="دارای پیشنهاد" value={stats.withBids} />
          <StatCard label="پیشنهاد جدید" value={stats.pendingBids} accent />
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-xs">
              <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    filter === item.id ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              <button type="button" onClick={loadRequests} className="mr-2 font-medium underline">تلاش مجدد</button>
            </div>
          ) : null}
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestListCard key={request.id} request={request} theme="goods" />
          ))}
        </div>
      ) : (
        <div className={`${cardClass} px-4 py-12 text-center sm:px-6`}>
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-amber-300" />
          <h2 className="mt-4 text-lg font-bold text-gray-900">
            {requests.length === 0 ? 'هنوز نیازی ثبت نکرده‌اید' : 'موردی با این فیلتر یافت نشد'}
          </h2>
          {requests.length === 0 ? (
            <Link href="/goods/needs/new" className={`${primaryBtnClass} mt-5 inline-flex bg-amber-600 hover:bg-amber-700`}>
              <PlusIcon className="h-4 w-4" aria-hidden />
              ثبت اولین نیاز
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div className={`rounded-xl border px-3 py-3 ${accent ? 'border-amber-200 bg-amber-50/60' : 'border-gray-100 bg-gray-50/60'}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent ? 'text-amber-700' : 'text-gray-900'}`}>
        {value.toLocaleString('fa-IR')}
      </p>
    </div>
  );
}
