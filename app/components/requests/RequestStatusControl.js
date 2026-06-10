'use client';

import { useEffect, useState } from 'react';
import {
  clientBidStatusUrl,
  clientRequestStatusUrl,
  fetchAuth,
  parseApiResponse,
} from '../../utils/apiClient';
import {
  CUSTOMER_BID_STATUS_OPTIONS,
  CUSTOMER_REQUEST_STATUS_OPTIONS,
} from '../../utils/requestFormat';
import { RequestStatusBadge } from './RequestStatusBadge';

export default function RequestStatusControl({ requestId, status, onUpdated, className = '' }) {
  const [value, setValue] = useState(status || 'open');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setValue(status || 'open');
  }, [status]);

  const handleChange = async (nextStatus) => {
    if (!nextStatus || nextStatus === value) return;
    setSaving(true);
    setError('');
    setNotice('');

    try {
      const res = await fetch(clientRequestStatusUrl(requestId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        ...fetchAuth,
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await parseApiResponse(res);
      if (!data.success) {
        setError(data.message || 'خطا در تغییر وضعیت');
        return;
      }
      setValue(nextStatus);
      setNotice(data.message || 'وضعیت ذخیره شد');
      onUpdated?.(data.data);
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-gray-50/80 p-4 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">وضعیت درخواست</p>
          <p className="mt-1 text-xs text-gray-500">
            وضعیت فعلی:
            {' '}
            <RequestStatusBadge status={value} className="mr-1 align-middle" />
          </p>
        </div>
        <label className="min-w-[11rem] flex-1 sm:max-w-xs">
          <span className="sr-only">تغییر وضعیت درخواست</span>
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60"
          >
            {CUSTOMER_REQUEST_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-500">
        {value === 'open' && 'درخواست بازه — متخصص‌ها می‌تونن پیشنهاد بدن.'}
        {value === 'in_progress' && 'کار در حال انجام است.'}
        {value === 'done' && 'کار انجام شده است.'}
        {value === 'closed' && 'درخواست بسته شده و پیشنهاد جدید پذیرفته نمی‌شود.'}
        {value === 'cancelled' && 'درخواست لغو شده است.'}
      </p>

      {saving ? <p className="mt-2 text-xs text-teal-700">در حال ذخیره...</p> : null}
      {notice ? <p className="mt-2 text-xs text-emerald-700">{notice}</p> : null}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function BidStatusControl({ bidId, status, onUpdated, compact = false }) {
  const [value, setValue] = useState(status || 'pending');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(status || 'pending');
  }, [status]);

  const applyStatus = async (nextStatus) => {
    if (!nextStatus || nextStatus === value) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch(clientBidStatusUrl(bidId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        ...fetchAuth,
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await parseApiResponse(res);
      if (!data.success) {
        setError(data.message || 'خطا در تغییر وضعیت');
        return;
      }
      setValue(nextStatus);
      onUpdated?.(data.data);
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={saving || value === 'accepted'}
          onClick={() => applyStatus('accepted')}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          پذیرش
        </button>
        <button
          type="button"
          disabled={saving || value === 'rejected'}
          onClick={() => applyStatus('rejected')}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          رد
        </button>
        <select
          value={value}
          onChange={(e) => applyStatus(e.target.value)}
          disabled={saving}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800"
          aria-label="وضعیت پیشنهاد"
        >
          {CUSTOMER_BID_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700">وضعیت پیشنهاد</label>
      <select
        value={value}
        onChange={(e) => applyStatus(e.target.value)}
        disabled={saving}
        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60"
      >
        {CUSTOMER_BID_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
