'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function useVisualViewportInset(active) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!active || typeof window === 'undefined' || !window.visualViewport) {
      setInset(0);
      return undefined;
    }

    const update = () => {
      const vv = window.visualViewport;
      if (!vv) {
        setInset(0);
        return;
      }
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setInset(keyboard > 50 ? keyboard : 0);
    };

    update();
    window.visualViewport.addEventListener('resize', update);
    window.visualViewport.addEventListener('scroll', update);
    return () => {
      window.visualViewport.removeEventListener('resize', update);
      window.visualViewport.removeEventListener('scroll', update);
    };
  }, [active]);

  return inset;
}

function SheetToggleButton({ expanded, summary, onClick }) {
  return (
    <button
      type="button"
      className="flex w-full shrink-0 items-center gap-2 px-3 py-2.5 text-right touch-manipulation"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls="home-map-mobile-filters"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
        <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-900">{summary}</span>
      <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
        {expanded ? 'بستن' : 'فیلتر'}
      </span>
      <ChevronUpIcon
        className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${
          expanded ? 'rotate-180' : ''
        }`}
        aria-hidden
      />
    </button>
  );
}

export default function HomeMapMobileControlsSheet({
  summary = 'فیلتر نقشه',
  children,
  defaultExpanded = false,
  onExpandedChange,
  variant = 'default',
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const keyboardInset = useVisualViewportInset(expanded && variant !== 'docked');
  const isDocked = variant === 'docked';

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    onExpandedChange?.(expanded);
  }, [expanded, onExpandedChange]);

  const expandedMaxHeight =
    variant === 'fullscreen'
      ? keyboardInset > 0
        ? `min(calc(100dvh - ${keyboardInset + 120}px), 34rem)`
        : 'min(56dvh, 28rem)'
      : variant === 'docked'
        ? 'min(42dvh, 20rem)'
        : keyboardInset > 0
          ? `min(calc(100dvh - ${keyboardInset + 64}px), 24rem)`
          : 'min(46dvh, 22rem)';

  if (isDocked) {
    return (
      <div className="shrink-0 border-b border-gray-200/90 bg-white/98">
        <SheetToggleButton expanded={expanded} summary={summary} onClick={toggle} />
        <div
          id="home-map-mobile-filters"
          className={`overflow-y-auto overscroll-contain border-t border-gray-100 px-3 pb-3 ${
            expanded ? 'block' : 'hidden'
          }`}
          style={expanded ? { maxHeight: expandedMaxHeight } : undefined}
        >
          <div className="space-y-3 pt-3">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[600] flex flex-col justify-end px-2.5 pt-4 transition-[bottom] duration-200"
      style={{
        bottom: keyboardInset > 0 ? keyboardInset : 0,
        paddingBottom: keyboardInset > 0 ? '0.4rem' : 'max(0.35rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white/98 shadow-[0_-8px_32px_rgba(15,23,42,0.14)] backdrop-blur-md transition-[max-height] duration-300 ease-out ${
          expanded ? '' : 'max-h-[2.875rem]'
        }`}
        style={expanded ? { maxHeight: expandedMaxHeight } : undefined}
      >
        <SheetToggleButton expanded={expanded} summary={summary} onClick={toggle} />
        <div
          id="home-map-mobile-filters"
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-gray-100 px-3 pb-3 ${
            expanded ? 'block' : 'hidden'
          }`}
        >
          <div className="space-y-3 pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
