import { redirect } from 'next/navigation';

/** فهرست دسته‌ها روی صفحه اصلی است — `/categories/[slug]` هم به همان بخش می‌رود */
export default function CategoriesPage() {
  redirect('/#home-path-categories');
}
