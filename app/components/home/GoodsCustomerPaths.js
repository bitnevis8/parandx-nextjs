'use client';

import { useCallback, useEffect, useState } from 'react';
import { GOODS_CUSTOMER_PATHS_INTRO } from '../../copy/goodsPageFa';
import {
  GOODS_CUSTOMER_PATHS,
  activateGoodsCustomerPath,
} from '../../config/goodsCustomerPathsConfig';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersianStep(n) {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export default function GoodsCustomerPaths() {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (!activeKey) return undefined;
    const timer = window.setTimeout(() => setActiveKey(null), 3200);
    return () => window.clearTimeout(timer);
  }, [activeKey]);

  const handleSelect = useCallback((key) => {
    setActiveKey(key);
    activateGoodsCustomerPath(key);
  }, []);

  return (
    <nav className="w-full text-right" aria-label="راه‌های پیدا کردن کالا در بازار">
      <p className="mb-3 text-xs leading-relaxed text-gray-500 sm:text-[13px]">
        {GOODS_CUSTOMER_PATHS_INTRO}
      </p>

      <ul className="relative flex flex-col">
        <div
          className="pointer-events-none absolute top-5 bottom-5 right-4 w-px -translate-x-1/2 bg-gradient-to-b from-gray-200 via-amber-300/70 to-gray-200"
          aria-hidden
        />

        {GOODS_CUSTOMER_PATHS.map((path) => {
          const isActive = activeKey === path.key;

          return (
            <li key={path.key} className="relative">
              <button
                type="button"
                onClick={() => handleSelect(path.key)}
                className={`group flex w-full items-start gap-3 py-2.5 text-right transition sm:py-3 ${
                  isActive ? 'text-amber-900' : 'text-gray-700 hover:text-amber-800'
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold tabular-nums transition sm:h-9 sm:w-9 sm:text-sm ${
                    isActive
                      ? 'border-amber-500 bg-amber-600 text-white shadow-md shadow-amber-500/25 ring-4 ring-amber-500/15'
                      : 'border-gray-200/90 bg-white text-gray-600 group-hover:border-amber-400 group-hover:bg-amber-50 group-hover:text-amber-800'
                  }`}
                  aria-hidden
                >
                  {toPersianStep(path.step)}
                </span>

                <span className="min-w-0 flex-1 pt-0.5">
                  <span
                    className={`block text-sm font-semibold leading-snug transition sm:text-[15px] ${
                      isActive ? 'text-amber-800' : 'text-gray-800 group-hover:text-amber-800'
                    }`}
                  >
                    {path.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs leading-relaxed transition ${
                      isActive ? 'text-amber-700/90' : 'text-gray-500 group-hover:text-amber-700/80'
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
          ? `راه ${GOODS_CUSTOMER_PATHS.find((item) => item.key === activeKey)?.step} انتخاب شد`
          : ''}
      </p>
    </nav>
  );
}
