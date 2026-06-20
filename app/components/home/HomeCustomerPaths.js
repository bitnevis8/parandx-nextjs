'use client';

import { useCallback, useEffect, useState } from 'react';
import { SERVICES_CUSTOMER_PATHS_INTRO } from '../../copy/friendlyFa';
import {
  SERVICES_CUSTOMER_PATHS,
  activateServicesCustomerPath,
} from '../../config/servicesCustomerPathsConfig';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersianStep(n) {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export default function HomeCustomerPaths() {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (!activeKey) return undefined;
    const timer = window.setTimeout(() => setActiveKey(null), 3200);
    return () => window.clearTimeout(timer);
  }, [activeKey]);

  const handleSelect = useCallback((key) => {
    setActiveKey(key);
    activateServicesCustomerPath(key);
  }, []);

  return (
    <nav className="hidden w-full text-right md:block" aria-label="راه‌های پیدا کردن متخصص در بازار خدمات">
      <p className="mb-3 text-xs leading-relaxed text-gray-500 sm:text-[13px]">
        {SERVICES_CUSTOMER_PATHS_INTRO}
      </p>

      <ul className="relative flex flex-col">
        <div
          className="pointer-events-none absolute top-5 bottom-5 right-4 w-px -translate-x-1/2 bg-gradient-to-b from-gray-200 via-teal-300/70 to-gray-200"
          aria-hidden
        />

        {SERVICES_CUSTOMER_PATHS.map((path) => {
          const isActive = activeKey === path.key;

          return (
            <li key={path.key} className="relative">
              <button
                type="button"
                onClick={() => handleSelect(path.key)}
                className={`group flex w-full items-start gap-3 py-2.5 text-right transition sm:py-3 ${
                  isActive ? 'text-teal-900' : 'text-gray-700 hover:text-teal-800'
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold tabular-nums transition sm:h-9 sm:w-9 sm:text-sm ${
                    isActive
                      ? 'border-teal-500 bg-teal-600 text-white shadow-md shadow-teal-500/25 ring-4 ring-teal-500/15'
                      : 'border-gray-200/90 bg-white text-gray-600 group-hover:border-teal-400 group-hover:bg-teal-50 group-hover:text-teal-800'
                  }`}
                  aria-hidden
                >
                  {toPersianStep(path.step)}
                </span>

                <span className="min-w-0 flex-1 pt-0.5">
                  <span
                    className={`block text-sm font-semibold leading-snug transition sm:text-[15px] ${
                      isActive ? 'text-teal-800' : 'text-gray-800 group-hover:text-teal-800'
                    }`}
                  >
                    {path.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs leading-relaxed transition ${
                      isActive ? 'text-teal-600/90' : 'text-gray-500 group-hover:text-teal-600/80'
                    }`}
                  >
                    {path.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" role="status" aria-live="polite">
        {activeKey
          ? `راه ${SERVICES_CUSTOMER_PATHS.find((item) => item.key === activeKey)?.step} انتخاب شد`
          : ''}
      </p>
    </nav>
  );
}
