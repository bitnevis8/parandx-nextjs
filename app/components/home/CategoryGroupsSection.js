'use client';

import SubcategoryScrollRow from './SubcategoryScrollRow';

export default function CategoryGroupsSection({ categories }) {
  if (!categories?.length) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-400 text-5xl mb-3">📂</div>
        <p className="text-gray-600">دسته‌بندی‌ای برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {categories.map((category) => (
        <SubcategoryScrollRow key={category.id} category={category} />
      ))}
    </div>
  );
}
