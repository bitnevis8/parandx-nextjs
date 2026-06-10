'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import UserAvatar from './UserAvatar';
import DashboardNavLinks from './dashboard/DashboardNavLinks';
import { getDashboardMobilePageTitle } from './dashboard/dashboardNavConfig';

const ROLE_LABELS = {
  admin: 'مدیر',
  moderator: 'ناظر',
  expert: 'متخصص',
  customer: 'مشتری',
  merchant: 'فروشنده',
};

function MobileMenuPanel({ open, onClose }) {
  const { user } = useAuth();
  const userRole = useRole();
  const roles = userRole.getUserRoles();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'کاربر';
  const roleLine = roles.map((r) => ROLE_LABELS[r] || r).join(' · ');

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] md:hidden ${open ? 'visible' : 'invisible'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="منو"
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="بستن"
        onClick={onClose}
      />

      <div
        className={`absolute inset-y-0 right-0 flex w-[min(17.5rem,92vw)] flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* سرصفحه فشرده */}
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 px-3 py-2">
          <Link href="/dashboard" scroll={false} onClick={onClose} className="min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_text.jpg"
              alt="پرند ایکس"
              className="h-6 w-auto max-w-[6.5rem] object-contain object-right"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 active:bg-slate-100"
            aria-label="بستن منو"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* کاربر — یک خط */}
        {user ? (
          <div className="flex shrink-0 items-center gap-2.5 border-b border-slate-100 px-3 py-2">
            <UserAvatar user={user} size="xs" className="h-9 w-9 shrink-0 rounded-xl ring-1 ring-teal-100" />
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-bold leading-tight text-slate-900">{fullName}</p>
              {roleLine ? (
                <p className="truncate text-[10px] leading-tight text-slate-500">{roleLine}</p>
              ) : user.mobile ? (
                <p className="text-[10px] text-slate-500" dir="ltr">
                  {user.mobile}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* منو — فشرده، بدون خانه داشبورد */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1.5">
          <DashboardNavLinks
            onNavigate={onClose}
            variant="mobile"
            showSiteLink
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function DashboardMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const pageTitle = useMemo(
    () => getDashboardMobilePageTitle(pathname, searchParams),
    [pathname, searchParams]
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, searchParams, close]);

  return (
    <>
      <header
        className="sticky top-0 z-40 flex h-11 items-center gap-2 border-b border-slate-200/80 bg-white px-3 md:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 active:bg-slate-100"
          aria-label="باز کردن منو"
          aria-expanded={open}
        >
          <Bars3Icon className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{pageTitle}</h1>
      </header>

      <MobileMenuPanel open={open} onClose={close} />
    </>
  );
}
