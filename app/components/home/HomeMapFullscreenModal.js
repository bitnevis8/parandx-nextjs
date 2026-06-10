'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import MapGuideTrigger from './MapGuideTrigger';

export default function HomeMapFullscreenModal({ isOpen, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const fire = () => window.dispatchEvent(new Event('resize'));
    const raf = window.requestAnimationFrame(fire);
    const t1 = window.setTimeout(fire, 150);
    const t2 = window.setTimeout(fire, 450);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10003] flex h-[100dvh] max-h-[100dvh] flex-col bg-slate-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-map-fullscreen-title"
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200/90 bg-white px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:gap-3 sm:px-4 sm:py-3">
        <h2
          id="home-map-fullscreen-title"
          className="min-w-0 truncate text-sm font-bold text-gray-900 sm:text-lg"
        >
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <MapGuideTrigger variant="header" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 touch-manipulation"
            aria-label="بستن نقشه"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>,
    document.body
  );
}
