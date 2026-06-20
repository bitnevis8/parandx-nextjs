'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

function hasHorizontalOverflow(el) {
  return el.scrollWidth > el.clientWidth + 6;
}

export default function CategoryScrollRow({
  children,
  className = '',
  dir = 'rtl',
  showHint = false,
  accent = 'teal',
}) {
  const scrollRef = useRef(null);
  const [hintVisible, setHintVisible] = useState(false);

  const refreshHint = useCallback(() => {
    const el = scrollRef.current;
    if (!showHint || !el) {
      setHintVisible(false);
      return;
    }
    setHintVisible(hasHorizontalOverflow(el));
  }, [showHint]);

  useEffect(() => {
    refreshHint();
    const el = scrollRef.current;
    if (!el) return undefined;

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refreshHint) : null;
    ro?.observe(el);
    window.addEventListener('resize', refreshHint);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', refreshHint);
    };
  }, [refreshHint, children]);

  const dismissHint = useCallback(() => setHintVisible(false), []);

  const iconClass = accent === 'amber' ? 'text-amber-500' : 'text-teal-500';

  return (
    <div className="relative overflow-visible">
      <div
        ref={scrollRef}
        dir={dir}
        className={className}
        onScroll={dismissHint}
        onTouchStart={dismissHint}
        onPointerDown={dismissHint}
      >
        {children}
      </div>

      {showHint && hintVisible ? (
        <span
          className="pointer-events-none absolute bottom-0 left-4 z-20 translate-y-[calc(1rem+50%)] sm:hidden"
          aria-hidden
        >
          <span className={`category-scroll-hint-swipe inline-block ${iconClass}`}>
            <ArrowsRightLeftIcon className="h-4 w-4 opacity-75" strokeWidth={2} />
          </span>
          <span className="sr-only">برای دیدن بقیه دسته‌ها، افقی بکشید</span>
        </span>
      ) : null}
    </div>
  );
}
