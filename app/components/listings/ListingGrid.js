'use client';

import ListingCard from './ListingCard';

export default function ListingGrid({ listings = [], emptyMessage = 'هنوز آگهی در این دسته ثبت نشده است.' }) {
  if (!listings.length) {
    return (
      <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-10 text-center text-sm text-gray-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}
