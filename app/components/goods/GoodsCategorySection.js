'use client';

import Link from 'next/link';

function merchantSubcategories(category) {
  return (category.subcategories || category.subCategories || []).filter(
    (s) => !s.categoryUsage || s.categoryUsage === 'merchant'
  );
}

export default function GoodsCategorySection({ category }) {
  const subCategories = merchantSubcategories(category);

  return (
    <div className="mb-7 break-inside-avoid sm:mb-8">
      <Link
        href={`/goods/categories/${category.slug}`}
        className="mb-2.5 inline-block text-sm font-bold text-gray-900 transition hover:text-amber-800 sm:text-[15px]"
      >
        {category.title}
      </Link>

      {subCategories.length > 0 ? (
        <ul className="space-y-1 border-r-2 border-amber-200/80 pr-3">
          {subCategories.map((sub) => (
            <li key={sub.slug}>
              <Link
                href={`/goods/categories/${sub.slug}`}
                className="block py-0.5 text-[13px] leading-snug text-gray-600 transition hover:text-amber-700"
              >
                {sub.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
