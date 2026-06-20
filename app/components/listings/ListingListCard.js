'use client';

import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import {
  formatListingPrice,
  getListingThumb,
  LISTING_STATUS_LABELS,
  LISTING_STATUS_STYLES,
} from '../../utils/listingUtils';
import { formatRelativeTime } from '../../utils/requestFormat';

export default function ListingListCard({ listing, onStatusChange, updatingId }) {
  const thumb = getListingThumb(listing?.media);
  const isUpdating = updatingId === listing.id;
  const status = listing.status || 'published';
  const statusStyle = LISTING_STATUS_STYLES[status] || LISTING_STATUS_STYLES.published;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-28">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl text-gray-300">
              {listing.subCategory?.icon || '📦'}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900">{listing.title}</h3>
              <p className="mt-1 text-sm font-semibold text-violet-700">
                {formatListingPrice(listing.fixedPrice)}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyle}`}>
              {LISTING_STATUS_LABELS[status] || status}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {listing.subCategory?.title || listing.category?.title}
            {listing.city?.name ? ` · ${listing.city.name}` : ''}
            {listing.createdAt ? ` · ${formatRelativeTime(listing.createdAt)}` : ''}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/divar/listings/${listing.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4" aria-hidden />
              مشاهده
            </Link>

            {status === 'published' ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusChange?.(listing.id, 'sold')}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                علامت‌گذاری فروخته شد
              </button>
            ) : null}

            {status === 'published' || status === 'draft' ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusChange?.(listing.id, 'archived')}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                بایگانی
              </button>
            ) : null}

            {status === 'sold' || status === 'archived' || status === 'draft' ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStatusChange?.(listing.id, 'published')}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                انتشار مجدد
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
