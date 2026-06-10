'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const SCROLL_STEP = 280;

function getScrollState(el) {
  if (!el) return { canScroll: false, canPrev: false, canNext: false };
  const canScroll = el.scrollWidth > el.clientWidth + 4;
  const maxScroll = el.scrollWidth - el.clientWidth;
  const offset = Math.abs(el.scrollLeft);
  return {
    canScroll,
    canPrev: offset > 4,
    canNext: offset < maxScroll - 4,
  };
}

function ServiceImage({ src, alt }) {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-400 px-2 text-center">
        بدون تصویر
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 140px, 168px"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      unoptimized
    />
  );
}

export default function SubcategoryScrollRow({ category }) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    canPrev: false,
    canNext: false,
  });

  const subcategories = category.subcategories || [];
  const categoryHref = `/categories/${category.slug ?? category.id}`;

  const updateScrollState = useCallback(() => {
    setScrollState(getScrollState(scrollRef.current));
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return undefined;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateScrollState)
      : null;
    observer?.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      observer?.disconnect();
    };
  }, [subcategories.length, updateScrollState]);

  const scrollByStep = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
  };

  return (
    <section
      id={`home-category-${category.slug ?? category.id}`}
      className="scroll-mt-24 md:scroll-mt-32 rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 bg-gray-50">
        <Link
          href={categoryHref}
          scroll={false}
          className="min-w-0 group text-right"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-teal-700 transition-colors break-words">
            {category.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {subcategories.length > 0
              ? `${subcategories.length} زیردسته`
              : 'زیردسته‌ای ثبت نشده'}
          </p>
        </Link>

        <Link
          href={categoryHref}
          scroll={false}
          className="shrink-0 text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline whitespace-nowrap"
        >
          مشاهده همه
        </Link>
      </div>

      {subcategories.length > 0 ? (
        <div className="relative px-1 sm:px-2 py-3 sm:py-4">
          {scrollState.canScroll && scrollState.canPrev && (
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-teal-700 shadow-md border border-gray-200 hover:bg-teal-50 transition-colors"
              aria-label="پیمایش به زیردسته‌های قبلی"
            >
              <ChevronRightIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          )}

          {scrollState.canScroll && scrollState.canNext && (
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-teal-700 shadow-md border border-gray-200 hover:bg-teal-50 transition-colors"
              aria-label="پیمایش به زیردسته‌های بعدی"
            >
              <ChevronLeftIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-3 sm:px-4 py-1 snap-x snap-mandatory"
            dir="rtl"
          >
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.slug || sub.id}`}
                scroll={false}
                className="group snap-start shrink-0 flex flex-col w-[140px] sm:w-[168px] rounded-xl border border-gray-200 bg-white hover:border-teal-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                  <ServiceImage src={sub.image} alt={sub.title} />
                </div>
                <div className="flex flex-col gap-1.5 p-2.5 sm:p-3 text-center min-h-[72px]">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-teal-700 line-clamp-2 leading-snug">
                    {sub.title}
                  </span>
                  {sub.expertCount != null && (
                    <span className="text-[10px] sm:text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full self-center">
                      {sub.expertCount} نفر
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 py-6 sm:px-5 text-sm text-gray-500 text-center">
          هنوز زیردسته‌ای برای این دسته تعریف نشده است.
        </div>
      )}
    </section>
  );
}
