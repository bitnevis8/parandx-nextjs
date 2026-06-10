'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { TRUST_REASON_OPTIONS } from '../../utils/expertTrustReasons';

/** نمایش تجمیع دلایل اعتماد کاربران */
export default function ExpertTrustReasonsSummary({
  expertId,
  initialSummary,
  variant = 'full',
}) {
  const [summary, setSummary] = useState(initialSummary ?? null);

  useEffect(() => {
    if (initialSummary) setSummary(initialSummary);
  }, [initialSummary]);

  useEffect(() => {
    if (!expertId) return undefined;

    const refresh = () => {
      fetch(API_ENDPOINTS.experts.trustReasons(expertId))
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) setSummary(res.data);
        })
        .catch(() => {});
    };

    if (!initialSummary) refresh();

    const onChange = (e) => {
      if (Number(e.detail?.expertId) === Number(expertId)) refresh();
    };
    window.addEventListener('expert-trust-changed', onChange);
    return () => window.removeEventListener('expert-trust-changed', onChange);
  }, [expertId, initialSummary]);

  const items = summary?.items || [];

  if (variant === 'header') {
    const trustCount = Number(summary?.trustCount) || 0;
    if (trustCount < 1 && !items.length) return null;

    const byKey = Object.fromEntries(items.map((item) => [item.key, item]));
    const rows = TRUST_REASON_OPTIONS.map((opt) => ({
      key: opt.key,
      label: opt.label,
      percent: byKey[opt.key]?.percent ?? 0,
      count: byKey[opt.key]?.count ?? 0,
    }));

    return (
      <ul className="flex w-full min-w-[8.5rem] max-w-[11rem] flex-col gap-2 sm:max-w-[12rem]" aria-label="دلایل اعتماد کاربران">
        {rows.map((row) => (
          <li key={row.key}>
            <div className="mb-0.5 flex items-center justify-between gap-2">
              <span className="truncate text-[10px] font-medium text-slate-600 sm:text-[11px]">
                {row.label}
              </span>
              <span className="shrink-0 text-[10px] font-bold tabular-nums text-teal-700 sm:text-[11px]">
                {row.percent.toLocaleString('fa-IR')}٪
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-slate-100">
              {row.percent > 0 ? (
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, row.percent)}%` }}
                />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-amber-100/90 bg-amber-50/40 p-4 sm:p-5">
      <h3 className="text-sm font-bold text-amber-950">چرا کاربران اعتماد کرده‌اند؟</h3>
      <p className="mt-0.5 text-xs text-amber-800/80">
        بر اساس{' '}
        <span className="font-semibold tabular-nums">
          {(summary.voters || 0).toLocaleString('fa-IR')}
        </span>{' '}
        نفر که دلیل ثبت کرده‌اند
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.key}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-800">{item.label}</span>
              <span className="shrink-0 text-xs font-bold tabular-nums text-amber-900">
                {item.percent.toLocaleString('fa-IR')}٪
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-amber-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${Math.min(100, item.percent)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
