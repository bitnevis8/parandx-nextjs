'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import ListingListCard from '../../../components/listings/ListingListCard';
import {
  cardClass,
  DashboardLoading,
  primaryBtnClass,
} from '../../../components/ui/dashboard/DashboardUi';
import { DIVAR_MY_LISTINGS } from '../../../copy/divarPageFa';
import {
  ACTIVE_LISTING_STATUSES,
  LISTING_STATUS_LABELS,
} from '../../../utils/listingUtils';
import { fetchAuth } from '../../../utils/requestFormat';

const FILTERS = [
  { id: 'active', label: 'فعال' },
  { id: 'published', label: LISTING_STATUS_LABELS.published },
  { id: 'sold', label: LISTING_STATUS_LABELS.sold },
  { id: 'archived', label: LISTING_STATUS_LABELS.archived },
  { id: 'all', label: 'همه' },
];

function filterListings(listings, filter, query) {
  let list = [...listings];

  if (filter === 'active') {
    list = list.filter((item) => ACTIVE_LISTING_STATUSES.includes(item.status));
  } else if (filter !== 'all') {
    list = list.filter((item) => item.status === filter);
  }

  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.category?.title,
        item.subCategory?.title,
        item.city?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return list;
}

export default function DivarMyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.listings.mine, fetchAuth);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'خطا در بارگذاری');
        setListings([]);
        return;
      }
      setListings(data.data || []);
    } catch {
      setError('خطا در ارتباط با سرور');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(API_ENDPOINTS.listings.updateStatus(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setListings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: data.data?.status || status } : item))
        );
      } else {
        setError(data.message || 'خطا در به‌روزرسانی وضعیت');
      }
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredListings = useMemo(
    () => filterListings(listings, filter, query),
    [listings, filter, query]
  );

  const stats = useMemo(() => {
    const active = listings.filter((item) => ACTIVE_LISTING_STATUSES.includes(item.status));
    const published = listings.filter((item) => item.status === 'published');
    const sold = listings.filter((item) => item.status === 'sold');
    return { active: active.length, published: published.length, sold: sold.length, total: listings.length };
  }, [listings]);

  if (loading) return <DashboardLoading />;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-6">
      <div className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-violet-100 bg-gradient-to-bl from-violet-50/70 to-white px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-violet-800">{DIVAR_MY_LISTINGS.badge}</p>
              <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{DIVAR_MY_LISTINGS.title}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">{DIVAR_MY_LISTINGS.lead}</p>
            </div>
            <Link
              href="/divar/new"
              className={`${primaryBtnClass} shrink-0 bg-violet-600 hover:bg-violet-700`}
            >
              <PlusIcon className="h-4 w-4" aria-hidden />
              {DIVAR_MY_LISTINGS.newCta}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-gray-100 p-4 sm:grid-cols-4 sm:p-5">
          <StatCard label="فعال" value={stats.active} />
          <StatCard label="منتشر شده" value={stats.published} />
          <StatCard label="فروخته شده" value={stats.sold} />
          <StatCard label="همه" value={stats.total} accent />
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-xs">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    filter === item.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <button type="button" onClick={loadListings} className="mr-2 font-medium underline">
                تلاش مجدد
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {filteredListings.length > 0 ? (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <ListingListCard
              key={listing.id}
              listing={listing}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          ))}
        </div>
      ) : (
        <div className={`${cardClass} px-4 py-12 text-center sm:px-6`}>
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-violet-300" />
          <h2 className="mt-4 text-lg font-bold text-gray-900">
            {listings.length === 0 ? DIVAR_MY_LISTINGS.emptyTitle : DIVAR_MY_LISTINGS.emptyFilter}
          </h2>
          {listings.length === 0 ? (
            <Link
              href="/divar/new"
              className={`${primaryBtnClass} mt-5 inline-flex bg-violet-600 hover:bg-violet-700`}
            >
              <PlusIcon className="h-4 w-4" aria-hidden />
              {DIVAR_MY_LISTINGS.firstCta}
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        accent ? 'border-violet-200 bg-violet-50/60' : 'border-gray-100 bg-gray-50/60'
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent ? 'text-violet-700' : 'text-gray-900'}`}>
        {value.toLocaleString('fa-IR')}
      </p>
    </div>
  );
}
