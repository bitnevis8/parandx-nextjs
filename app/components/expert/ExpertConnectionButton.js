'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserPlusIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';

const SHELL_CLASS =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition active:scale-[0.99] sm:h-12';

const COMPACT_CLASS =
  'inline-flex h-8 max-w-full items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-semibold leading-tight transition active:scale-[0.99] sm:h-9 sm:px-2.5 sm:text-xs';

function shellClass(compact, className) {
  return `${compact ? COMPACT_CLASS : SHELL_CLASS} ${className}`;
}

function dispatchConnectionChange(expertId, status) {
  window.dispatchEvent(
    new CustomEvent('expert-connection-changed', { detail: { expertId, status } })
  );
}

export default function ExpertConnectionButton({ expertId, className = '', compact = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState('none');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(() => {
    if (!expertId) return Promise.resolve();
    return fetch(API_ENDPOINTS.experts.connectionStatus(expertId), { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) return;
        const data = res.data || {};
        setStatus(data.status || 'none');
        setIsOwner(Boolean(data.isOwner));
      })
      .catch(() => {});
  }, [expertId]);

  useEffect(() => {
    if (!expertId) return undefined;
    let cancelled = false;
    setLoading(true);
    loadStatus().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [expertId, loadStatus]);

  const ensureAuth = useCallback(async () => {
    const statusRes = await fetch(API_ENDPOINTS.auth.me, { credentials: 'include' });
    const statusJson = await statusRes.json();
    if (!statusJson?.success || !statusJson?.data) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname || '/')}`);
      return false;
    }
    return true;
  }, [pathname, router]);

  const onRequest = useCallback(async () => {
    if (!expertId || busy || status === 'pending' || status === 'accepted') return;
    setBusy(true);
    try {
      if (!(await ensureAuth())) return;

      const res = await fetch(API_ENDPOINTS.experts.connection(expertId), {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (res.status === 401) {
          router.push(`/auth?redirect=${encodeURIComponent(pathname || '/')}`);
        }
        return;
      }
      setStatus(json.data?.status || 'pending');
      dispatchConnectionChange(expertId, 'pending');
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }, [expertId, busy, status, ensureAuth, pathname, router]);

  if (!expertId) return null;
  if (!loading && isOwner) return null;

  if (loading) {
    return (
      <div
        className={shellClass(compact, `border-slate-200 bg-slate-50 text-slate-400 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-500 ${className}`)}
        aria-hidden
      >
        <span className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-sky-800" />
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div
        className={shellClass(compact, `border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-200 ${className}`)}
        title="ارتباط حرفه‌ای تأییدشده"
      >
        <CheckIcon className={`shrink-0 ${compact ? 'h-3.5 w-3.5' : 'h-5 w-5'}`} aria-hidden />
        <span className="truncate">{compact ? 'شبکه حرفه‌ای' : 'ارتباط حرفه‌ای'}</span>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div
        className={shellClass(compact, `border-slate-200 bg-slate-50 text-slate-600 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300 ${className}`)}
        title="در انتظار تأیید متخصص"
      >
        <ClockIcon className={`shrink-0 ${compact ? 'h-3.5 w-3.5' : 'h-5 w-5'}`} aria-hidden />
        <span className="truncate">{compact ? 'در انتظار' : 'در انتظار تأیید'}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onRequest}
      disabled={busy}
      className={shellClass(
        compact,
        `border-teal-500 bg-white text-teal-800 hover:bg-teal-50 dark:border-teal-500 dark:bg-sky-900 dark:text-teal-200 dark:hover:bg-sky-800 ${busy ? 'opacity-70' : ''} ${className}`
      )}
    >
      <UserPlusIcon className={`shrink-0 ${compact ? 'h-3.5 w-3.5' : 'h-5 w-5'}`} aria-hidden />
      <span className="truncate">
        {compact ? 'افزودن به شبکه' : 'افزودن به شبکه حرفه‌ای'}
      </span>
    </button>
  );
}
