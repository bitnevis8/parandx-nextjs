'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { CheckIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import ExpertTrustReasonsModal from './ExpertTrustReasonsModal';
import { normalizeTrustReasonKeys } from '../../utils/expertTrustReasons';

const SHELL_CLASS =
  'flex h-11 w-full overflow-hidden rounded-xl border text-sm font-semibold transition sm:h-12';

function dispatchTrustChange(expertId, extra = {}) {
  window.dispatchEvent(
    new CustomEvent('expert-trust-changed', { detail: { expertId, ...extra } })
  );
}

export default function ExpertTrustButton({ expertId, className = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [trusted, setTrusted] = useState(false);
  const [myReasons, setMyReasons] = useState([]);
  const [canTrust, setCanTrust] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [trustBlockedMessage, setTrustBlockedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadStatus = useCallback(() => {
    if (!expertId) return Promise.resolve();
    return fetch(API_ENDPOINTS.experts.trustStatus(expertId), { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) return;
        const data = res.data || {};
        setTrusted(Boolean(data.trusted ?? data.following));
        setMyReasons(normalizeTrustReasonKeys(data.myReasons));
        setIsOwner(Boolean(data.isOwner));
        setCanTrust(Boolean(data.canTrust));
        setTrustBlockedMessage(
          data.trustBlockedMessage ||
            'برای ثبت اعتماد، پروژه موفق یا ارتباط حرفه‌ای تأییدشده لازم است.'
        );
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

  useEffect(() => {
    const onConnectionChange = (e) => {
      if (Number(e.detail?.expertId) === Number(expertId)) loadStatus();
    };
    window.addEventListener('expert-connection-changed', onConnectionChange);
    return () => window.removeEventListener('expert-connection-changed', onConnectionChange);
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

  const onTrust = useCallback(async () => {
    if (!expertId || busy || trusted) return;
    setBusy(true);
    try {
      if (!(await ensureAuth())) return;
      if (!canTrust) {
        await loadStatus();
        return;
      }

      const res = await fetch(API_ENDPOINTS.experts.trust(expertId), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reasons: [] }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (res.status === 401) {
          router.push(`/auth?redirect=${encodeURIComponent(pathname || '/')}`);
        }
        if (res.status === 403) loadStatus();
        return;
      }
      setTrusted(true);
      setMyReasons(normalizeTrustReasonKeys(json.data?.myReasons));
      dispatchTrustChange(expertId, { trusted: true });
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }, [expertId, busy, trusted, canTrust, ensureAuth, loadStatus, pathname, router]);

  const onUntrust = useCallback(async () => {
    if (!expertId || busy) return;
    setBusy(true);
    try {
      const res = await fetch(API_ENDPOINTS.experts.trust(expertId), {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok || !json.success) return;
      setTrusted(false);
      setMyReasons([]);
      setModalOpen(false);
      dispatchTrustChange(expertId, { trusted: false });
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }, [expertId, busy]);

  const onSaveReasons = useCallback(
    async (reasons) => {
      if (!expertId || busy) return;
      setBusy(true);
      try {
        const res = await fetch(API_ENDPOINTS.experts.trustReasons(expertId), {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reasons }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) return;
        setMyReasons(normalizeTrustReasonKeys(json.data?.myReasons));
        setModalOpen(false);
        dispatchTrustChange(expertId, { trusted: true, reasonsUpdated: true });
      } catch {
        /* ignore */
      } finally {
        setBusy(false);
      }
    },
    [expertId, busy]
  );

  const openReasonsModal = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!(await ensureAuth())) return;
      setModalOpen(true);
    },
    [ensureAuth]
  );

  if (!expertId) return null;
  if (!loading && isOwner) return null;

  if (loading) {
    return (
      <div
        className={`${SHELL_CLASS} border-slate-200 bg-slate-50 text-slate-400 ${className}`}
        aria-hidden
      >
        <span className="m-auto h-5 w-24 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <>
      {!trusted ? (
        <button
          type="button"
          onClick={onTrust}
          disabled={busy}
          title={!canTrust ? trustBlockedMessage : 'بهش اعتماد کنید'}
          className={`${SHELL_CLASS} items-center justify-center gap-2 active:scale-[0.99] ${
            canTrust
              ? 'border-amber-400 bg-amber-500 text-white hover:bg-amber-600'
              : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
          } ${busy ? 'opacity-70' : ''} ${className}`}
        >
          <StarIcon className="h-5 w-5 shrink-0" aria-hidden />
          <span>
            <span aria-hidden>⭐ </span>
            اعتماد دارم
          </span>
        </button>
      ) : (
        <div
          className={`${SHELL_CLASS} border-amber-200 bg-amber-50 text-amber-900 ${className}`}
        >
          <span className="flex min-w-0 flex-1 items-center justify-center gap-2 px-3">
            <CheckIcon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">
              <span aria-hidden>⭐ </span>
              مورد اعتماد شما
            </span>
          </span>
          <button
            type="button"
            onClick={openReasonsModal}
            disabled={busy}
            className="flex w-12 shrink-0 items-center justify-center border-r border-amber-200/90 text-amber-800 transition hover:bg-amber-100/80 active:bg-amber-100"
            aria-label="ثبت یا ویرایش دلیل اعتماد"
            title="دلیل اعتماد شما چیست؟"
          >
            <QuestionMarkCircleIcon className="h-6 w-6" aria-hidden />
          </button>
        </div>
      )}

      <ExpertTrustReasonsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialReasons={myReasons}
        onSave={onSaveReasons}
        onRemoveTrust={onUntrust}
        saving={busy}
      />
    </>
  );
}
