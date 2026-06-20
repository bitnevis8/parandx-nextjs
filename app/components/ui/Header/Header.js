"use client";

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import UserDropdown from '../UserDropdown';
import { AuthContext } from '../../../context/AuthContext';
import AuthButtons from '../../AuthButtons';
import MainNavBar from './MainNavBar';
import HeaderMobileSearch from './HeaderMobileSearch';
import HeaderMobileMessagesButton from './HeaderMobileMessagesButton';
import CitySelector from '../CitySelector';
import RequestAlertsMenu from '../RequestAlertsMenu';
import MarketplaceSwitcher, {
  shouldShowMarketplaceSwitcher,
} from '../../marketplace/MarketplaceSwitcher';
import { API_ENDPOINTS } from '../../../config/api';
import ThemeToggle from '../ThemeToggle';

/** عرض هدر — کمی بیشتر از بدنه صفحه برای تنفس بهتر سوئیچ */
export const HEADER_CONTAINER =
  'mx-auto w-full max-w-7xl px-2 min-[420px]:px-3 sm:px-5 lg:px-6';

export default function Header() {
  const pathname = usePathname() || '/';
  const { isAuthenticated } = useContext(AuthContext);
  const showMarketplaceSwitcher = shouldShowMarketplaceSwitcher(pathname);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.messages.unreadCount, { credentials: 'include' });
      const data = await res.json();
      if (data?.success && typeof data?.data?.count === 'number') return data.data.count;
    } catch (_) {}
    return 0;
  };

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    let cancelled = false;
    const refresh = async () => {
      const count = await fetchUnreadCount();
      if (!cancelled) setUnreadCount(count);
    };
    refresh();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') refresh();
    }, 45000);
    const onRefresh = () => refresh();
    window.addEventListener('refresh-unread-count', onRefresh);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('refresh-unread-count', onRefresh);
    };
  }, [isAuthenticated]);

  const authCluster = (
    <>
      <ThemeToggle />
      <CitySelector />

      {isAuthenticated && (
        <>
          <RequestAlertsMenu />
          <Link
            href="/dashboard/messages"
            className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600 dark:text-sky-300 dark:hover:bg-sky-900 dark:hover:text-teal-300"
            title="پیام‌ها"
            aria-label="پیام‌ها"
          >
            <EnvelopeIcon className="h-5 w-5 shrink-0" aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 left-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          <UserDropdown variant="header" />
        </>
      )}

      {!isAuthenticated && (
        <div className="hidden items-center md:flex">
          <AuthButtons />
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-transparent dark:shadow-none">
      <div className={HEADER_CONTAINER}>
        {/* موبایل: لوگو راست — چپ: چت + آلارم */}
        <div className="flex h-12 min-h-12 items-center justify-between gap-2 md:hidden">
          <Link href="/" scroll={false} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_text.jpg"
              alt="پرندیکس"
              className="h-7 w-auto max-w-[5.25rem] object-contain object-right min-[420px]:h-8 min-[420px]:max-w-[7rem]"
            />
          </Link>

          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle className="h-9 w-9" />
            <HeaderMobileMessagesButton
              href={isAuthenticated ? '/dashboard/messages' : '/auth'}
              unreadCount={isAuthenticated ? unreadCount : 0}
            />
            <RequestAlertsMenu variant="mobile" />
          </div>
        </div>

        {/* دسکتاپ */}
        <div className="hidden h-14 min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 md:grid">
          <Link href="/" scroll={false} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_text.jpg"
              alt="پرندیکس"
              className="h-9 w-auto max-w-[9.5rem] object-contain object-right"
            />
          </Link>

          <div className="flex min-w-0 items-center justify-center overflow-hidden px-0.5">
            {showMarketplaceSwitcher ? (
              <MarketplaceSwitcher variant="header" />
            ) : null}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">{authCluster}</div>
        </div>
      </div>

      <HeaderMobileSearch />
    </header>
  );
}
