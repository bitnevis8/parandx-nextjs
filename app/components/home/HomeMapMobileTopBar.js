'use client';

/** نوار فشرده بالای نقشه — موبایل تمام‌صفحه */
export default function HomeMapMobileTopBar({ children }) {
  if (!children) return null;

  return (
    <div className="shrink-0 border-b border-gray-200/90 bg-white px-3 py-2 md:hidden">
      {children}
    </div>
  );
}
