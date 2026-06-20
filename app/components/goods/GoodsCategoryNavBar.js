'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const SCROLLBAR_HIDE =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const SCROLL_STEP = 280;

const GOODS_TONES = ['amber', 'teal', 'violet', 'rose', 'sky', 'emerald', 'amber'];

const TONE_STYLES = {
  amber: {
    icon: 'border-gray-200/80 bg-white hover:border-amber-200 hover:bg-amber-50/70',
    iconActive: 'border-amber-400 bg-amber-50 ring-2 ring-amber-200/80 shadow-sm',
  },
  teal: {
    icon: 'border-gray-200/80 bg-white hover:border-teal-200 hover:bg-teal-50/70',
    iconActive: 'border-teal-400 bg-teal-50 ring-2 ring-teal-200/80 shadow-sm',
  },
  violet: {
    icon: 'border-gray-200/80 bg-white hover:border-violet-200 hover:bg-violet-50/70',
    iconActive: 'border-violet-400 bg-violet-50 ring-2 ring-violet-200/80 shadow-sm',
  },
  rose: {
    icon: 'border-gray-200/80 bg-white hover:border-rose-200 hover:bg-rose-50/70',
    iconActive: 'border-rose-400 bg-rose-50 ring-2 ring-rose-200/80 shadow-sm',
  },
  sky: {
    icon: 'border-gray-200/80 bg-white hover:border-sky-200 hover:bg-sky-50/70',
    iconActive: 'border-sky-400 bg-sky-50 ring-2 ring-sky-200/80 shadow-sm',
  },
  emerald: {
    icon: 'border-gray-200/80 bg-white hover:border-emerald-200 hover:bg-emerald-50/70',
    iconActive: 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200/80 shadow-sm',
  },
};

function getNormalizedScrollLeft(el) {
  if (!el) return 0;
  const { scrollLeft, scrollWidth, clientWidth } = el;
  const isRtl = getComputedStyle(el).direction === 'rtl';
  if (!isRtl) return scrollLeft;
  if (scrollLeft < 0) return -scrollLeft;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  return maxScroll - scrollLeft;
}

function getScrollState(el) {
  if (!el) return { canScroll: false, canPrev: false, canNext: false };
  const overflow = el.scrollWidth - el.clientWidth;
  if (overflow <= 16) return { canScroll: false, canPrev: false, canNext: false };
  const offset = getNormalizedScrollLeft(el);
  return { canScroll: true, canPrev: offset > 8, canNext: offset < overflow - 8 };
}

function setNormalizedScrollLeft(el, offset) {
  if (!el) return;
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
  const clamped = Math.max(0, Math.min(maxScroll, offset));
  const isRtl = getComputedStyle(el).direction === 'rtl';
  if (isRtl) {
    el.scrollTo({ left: el.scrollLeft <= 0 ? -clamped : maxScroll - clamped, behavior: 'smooth' });
  } else {
    el.scrollTo({ left: clamped, behavior: 'smooth' });
  }
}

export default function GoodsCategoryNavBar({ categories = [], activeCategorySlug, onSelect }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScroll: false, canPrev: false, canNext: false });

  const updateScrollState = useCallback(() => {
    setScrollState(getScrollState(scrollRef.current));
  }, []);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      updateScrollState();
      raf2 = requestAnimationFrame(updateScrollState);
    });
    const el = scrollRef.current;
    if (!el) return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2); };
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null;
    ro?.observe(el);
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      ro?.disconnect();
    };
  }, [categories.length, updateScrollState]);

  useEffect(() => {
    const activeEl = activeRef.current;
    const scrollEl = scrollRef.current;
    if (!activeEl || !scrollEl) return;

    // محاسبه موقعیت در RTL
    const scrollRect = scrollEl.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const isVisible =
      activeRect.right <= scrollRect.right && activeRect.left >= scrollRect.left;

    if (!isVisible) {
      // مرکز کردن آیتم فعال در ناوبار
      const elOffset =
        activeEl.offsetLeft - scrollEl.clientWidth / 2 + activeEl.clientWidth / 2;
      const isRtl = getComputedStyle(scrollEl).direction === 'rtl';
      if (isRtl) {
        const max = scrollEl.scrollWidth - scrollEl.clientWidth;
        scrollEl.scrollTo({ left: -(max - Math.max(0, Math.min(max, elOffset))), behavior: 'smooth' });
      } else {
        scrollEl.scrollTo({ left: Math.max(0, elOffset), behavior: 'smooth' });
      }
    }
  }, [activeCategorySlug]);

  if (!categories.length) return null;

  const arrowClass =
    'pointer-events-auto absolute z-[2] flex h-7 w-7 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-600 shadow-md backdrop-blur-sm transition hover:border-gray-300 hover:bg-gray-50 sm:h-8 sm:w-8';

  return (
    <div
      className="sticky top-[3.25rem] z-30 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 sm:top-14"
      aria-label="دسته‌بندی‌های بازار کالا"
    >
      <div className="mx-auto max-w-screen-xl px-2 sm:px-4">
        <div className="relative">
          {scrollState.canPrev && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-white via-white/80 to-transparent"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setNormalizedScrollLeft(scrollRef.current, getNormalizedScrollLeft(scrollRef.current) - SCROLL_STEP)}
                className={`${arrowClass} right-0.5 top-1/2 -translate-y-1/2`}
                aria-label="دسته‌های قبلی"
              >
                <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </button>
            </>
          )}

          {scrollState.canNext && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-white via-white/80 to-transparent"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setNormalizedScrollLeft(scrollRef.current, getNormalizedScrollLeft(scrollRef.current) + SCROLL_STEP)}
                className={`${arrowClass} left-0.5 top-1/2 -translate-y-1/2`}
                aria-label="دسته‌های بعدی"
              >
                <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            dir="rtl"
            className={`overflow-x-auto overscroll-x-contain scroll-smooth py-2 sm:py-2.5 ${SCROLLBAR_HIDE}`}
          >
            <div className="flex w-max items-start gap-1 sm:gap-1.5">
              {categories.map((cat, idx) => {
                const tone = GOODS_TONES[idx % GOODS_TONES.length];
                const styles = TONE_STYLES[tone];
                const isActive = activeCategorySlug === cat.slug;

                return (
                  <button
                    key={cat.slug}
                    ref={isActive ? activeRef : null}
                    type="button"
                    onClick={() => onSelect?.(cat.slug)}
                    className="group flex w-[4.25rem] shrink-0 snap-start flex-col items-center gap-1 px-0.5 py-0.5 text-center transition active:scale-[0.97] sm:w-[4.75rem]"
                    aria-pressed={isActive}
                  >
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl shadow-sm transition group-hover:shadow-md sm:h-12 sm:w-12 sm:text-2xl ${
                        isActive ? styles.iconActive : styles.icon
                      }`}
                      aria-hidden
                    >
                      {cat.icon || '📦'}
                    </span>
                    <span
                      className={`flex min-h-[1.85rem] w-full items-start justify-center text-[9px] font-medium leading-snug line-clamp-2 sm:text-[10px] ${
                        isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    >
                      {cat.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
