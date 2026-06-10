'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { MAP_GUIDE, MAP_GUIDE_SECTIONS, MAP_GUIDE_TIPS } from '../../copy/mapGuideFa';
import MapGuideImage from './MapGuideImage';

export default function MapGuideModal({ isOpen, onClose }) {
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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10004] flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-guide-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88dvh] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="shrink-0 border-b border-gray-100 bg-gradient-to-l from-teal-50/80 to-white px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-right">
              <h2 id="map-guide-title" className="text-base font-bold text-gray-900 sm:text-lg">
                {MAP_GUIDE.modalTitle}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{MAP_GUIDE.modalLead}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
              aria-label={MAP_GUIDE.closeLabel}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          <ol className="space-y-8">
            {MAP_GUIDE_SECTIONS.map((section) => (
              <li key={section.id} className="scroll-mt-4">
                <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">{section.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-700">{section.body}</p>
                <MapGuideImage
                  src={section.imageSrc}
                  alt={section.imageAlt}
                  caption={section.imageCaption}
                />
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-amber-200/90 bg-amber-50/80 px-4 py-3.5">
            <div className="mb-2 flex items-center gap-2 text-amber-900">
              <LightBulbIcon className="h-5 w-5 shrink-0" aria-hidden />
              <p className="text-sm font-bold">نکته‌های سریع</p>
            </div>
            <ul className="list-disc space-y-1.5 pr-5 text-sm leading-relaxed text-amber-950/90">
              {MAP_GUIDE_TIPS.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-center text-[11px] text-gray-400">
            تصاویر:{' '}
            <span className="font-mono" dir="ltr">
              {MAP_GUIDE.imageFolderHint}
            </span>
          </p>
        </div>

        <footer className="shrink-0 border-t border-gray-100 bg-gray-50/80 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
          >
            {MAP_GUIDE.closeLabel}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
