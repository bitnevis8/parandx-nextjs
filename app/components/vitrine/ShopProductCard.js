'use client';

import Link from 'next/link';
import { formatListingPrice } from '../../utils/listingUtils';

export default function ShopProductCard({ product, actions, compact = false }) {
  const img = product.media?.[0];
  const hasListing = Boolean(product.listingId && product.listing?.status === 'published');

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:shadow-md">
      {img ? (
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <img
            src={img}
            alt={product.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-amber-50 text-3xl">
          📦
        </div>
      )}

      {hasListing && (
        <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
          در دیوار
        </span>
      )}

      {!product.isAvailable && (
        <span className="absolute left-2 top-2 rounded-full bg-gray-400 px-2 py-0.5 text-[10px] font-bold text-white shadow">
          ناموجود
        </span>
      )}

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-800">
          {product.title}
        </p>

        {!compact && product.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {product.description}
          </p>
        )}

        {product.price ? (
          <p className="mt-2 text-sm font-bold text-amber-600">
            {formatListingPrice(product.price)}
          </p>
        ) : (
          <p className="mt-2 text-xs text-gray-400">قیمت: توافقی</p>
        )}

        {actions && <div className="mt-3">{actions}</div>}
      </div>
    </div>
  );
}
