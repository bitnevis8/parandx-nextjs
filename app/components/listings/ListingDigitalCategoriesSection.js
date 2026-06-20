'use client';

import Link from 'next/link';
import { DIVAR_DIGITAL_SECTION } from '../../copy/divarPageFa';

function CategoryTile({ subcategory }) {
  const href = `/divar/categories/${subcategory.slug}`;

  return (
    <Link
      href={href}
      className="group flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm ring-1 ring-gray-100/80 transition hover:border-violet-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
    >
      <span className="text-2xl leading-none" aria-hidden>
        {subcategory.icon || '📦'}
      </span>
      <span className="mt-3 text-sm font-bold leading-snug text-gray-900 group-hover:text-violet-800">
        {subcategory.title}
      </span>
    </Link>
  );
}

export default function ListingDigitalCategoriesSection({ parentCategory, subcategories = [] }) {
  const title = parentCategory?.title || DIVAR_DIGITAL_SECTION.title;

  return (
    <section
      id={DIVAR_DIGITAL_SECTION.sectionId}
      className="scroll-mt-28 w-full text-right"
      aria-labelledby="divar-digital-categories-title"
    >
      <div className="mb-4 flex flex-col gap-1 sm:mb-5">
        <h2 id="divar-digital-categories-title" className="text-base font-bold text-gray-900 sm:text-lg">
          {title}
        </h2>
        <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
          {DIVAR_DIGITAL_SECTION.subtitle}
        </p>
      </div>

      {subcategories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-8 text-center text-sm text-gray-500">
          {DIVAR_DIGITAL_SECTION.emptyText}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {subcategories.map((sub) => (
            <li key={sub.id}>
              <CategoryTile subcategory={sub} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
