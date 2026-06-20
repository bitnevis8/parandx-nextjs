'use client';

import ShopProductCard from './ShopProductCard';

export default function ShopVitrineSection({ products = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-amber-50 aspect-[4/5]" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-10 text-center">
        <p className="text-2xl">🛍️</p>
        <p className="mt-2 text-sm text-gray-500">محصولی در ویترین ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <ShopProductCard key={p.id} product={p} compact />
      ))}
    </div>
  );
}
