'use client';

import Link from 'next/link';
import { formatListingPrice, getListingSellerLabel, getListingThumb } from '../../utils/listingUtils';

export default function ListingCard({ listing }) {
  const thumb = getListingThumb(listing?.media);
  const href = `/divar/listings/${listing.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80 transition hover:border-violet-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">
            {listing?.subCategory?.icon || listing?.category?.icon || '📦'}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-violet-900">
          {listing.title}
        </h3>
        <p className="text-base font-bold text-violet-700">{formatListingPrice(listing.fixedPrice)}</p>
        <p className="mt-auto text-xs text-gray-500">
          {listing.city?.name ? `${listing.city.name} · ` : ''}
          {getListingSellerLabel(listing)}
        </p>
      </div>
    </Link>
  );
}
