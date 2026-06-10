'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../../config/api';
import { DashboardLoading } from '../../../components/ui/dashboard/DashboardUi';

const fetchAuth = { credentials: 'include' };

function userName(u) {
  if (!u) return 'کاربر';
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.mobile || 'کاربر';
}

export default function ExpertConnectionsPage() {
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.experts.connectionsIncoming, fetchAuth);
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'خطا در بارگذاری');
        return;
      }
      setPending(data.data?.pending || []);
      setAccepted(data.data?.accepted || []);
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const respond = async (connectionId, action) => {
    setBusyId(connectionId);
    try {
      const url =
        action === 'accept'
          ? API_ENDPOINTS.experts.connectionAccept(connectionId)
          : API_ENDPOINTS.experts.connectionReject(connectionId);
      const res = await fetch(url, { method: 'POST', ...fetchAuth });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'عملیات ناموفق بود');
        return;
      }
      await load();
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">شبکه حرفه‌ای</h1>
        <p className="mt-1 text-sm text-slate-600">
          درخواست‌های ارتباط حرفه‌ای با سایر متخصص‌ها — پس از تأیید، طرف مقابل می‌تواند اعتماد ثبت کند.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-bold text-slate-900">
            در انتظار تأیید
            <span className="mr-2 text-sm font-normal text-slate-500">
              ({pending.length.toLocaleString('fa-IR')})
            </span>
          </h2>
        </header>
        <ul className="divide-y divide-slate-100">
          {pending.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-slate-500 sm:px-5">
              درخواست جدیدی نیست.
            </li>
          ) : (
            pending.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div>
                  <p className="font-semibold text-slate-900">{userName(row.requester)}</p>
                  <p className="mt-0.5 text-xs text-slate-500">درخواست ارتباط حرفه‌ای</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => respond(row.id, 'accept')}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                  >
                    تأیید
                  </button>
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => respond(row.id, 'reject')}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    رد
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-bold text-slate-900">
            ارتباط‌های تأییدشده
            <span className="mr-2 text-sm font-normal text-slate-500">
              ({accepted.length.toLocaleString('fa-IR')})
            </span>
          </h2>
        </header>
        <ul className="divide-y divide-slate-100">
          {accepted.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-500 sm:px-5">
              هنوز ارتباط تأییدشده‌ای ندارید.
            </li>
          ) : (
            accepted.map((row) => (
              <li key={row.id} className="px-4 py-3 sm:px-5">
                <p className="font-medium text-slate-800">{userName(row.requester)}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <p className="text-center text-xs text-slate-500">
        <Link href="/dashboard?tab=expert-display" className="text-teal-700 hover:underline">
          بازگشت به پروفایل تخصصی
        </Link>
      </p>
    </div>
  );
}
