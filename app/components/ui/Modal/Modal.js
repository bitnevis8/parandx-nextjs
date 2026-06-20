'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10002] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 transition-opacity"
          onClick={onClose}
          aria-hidden
        />

        <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-sky-900 dark:shadow-black/40">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-sky-50">{title}</h3>
            <button
              type="button"
              className="rounded-lg p-1 text-gray-400 transition hover:bg-slate-100 hover:text-gray-600 dark:text-sky-400 dark:hover:bg-sky-800 dark:hover:text-sky-200"
              onClick={onClose}
              aria-label="بستن"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
