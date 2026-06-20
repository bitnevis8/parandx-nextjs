'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { REQUEST_GUIDE } from '../../copy/requestGuideFa';

export default function RequestGuideModal({ isOpen, onClose }) {
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
      aria-labelledby="request-guide-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-sky-900 sm:max-h-[88dvh] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="shrink-0 border-b border-gray-100 bg-gradient-to-l from-teal-50/80 to-white px-4 py-4 dark:border-sky-800 dark:from-sky-950 dark:to-sky-900 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-right">
              <h2
                id="request-guide-title"
                className="text-base font-bold text-gray-900 dark:text-sky-50 sm:text-lg"
              >
                {REQUEST_GUIDE.modalTitle}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-sky-300">
                {REQUEST_GUIDE.modalLead}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-800 dark:hover:text-sky-50"
              aria-label={REQUEST_GUIDE.closeLabel}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-sky-50">
            {REQUEST_GUIDE.stepsTitle}
          </h3>
          <ol className="space-y-3">
            {REQUEST_GUIDE.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-3 rounded-xl border border-gray-200/90 bg-gray-50/80 px-3.5 py-3 dark:border-sky-700/80 dark:bg-sky-950/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm dark:bg-teal-500 dark:text-sky-950">
                  {(index + 1).toLocaleString('fa-IR')}
                </span>
                <div className="min-w-0 flex-1 pt-0.5 text-right">
                  <p className="text-sm font-bold leading-snug text-gray-900 dark:text-sky-50">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-sky-300">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="mb-2 flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <LightBulbIcon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-xs font-bold">{REQUEST_GUIDE.tipsTitle}</span>
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90">
              {REQUEST_GUIDE.tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
