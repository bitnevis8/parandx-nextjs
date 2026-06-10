"use client";

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import UserDropdown from '../UserDropdown';
import { AuthContext } from '../../../context/AuthContext';
import AuthButtons from '../../AuthButtons';
import MobileMenu from '../../MobileMenu';
import MainNavBar from './MainNavBar';
import CitySelector from '../CitySelector';
import RequestAlertsMenu from '../RequestAlertsMenu';
import MarketplaceSwitcher, {
  shouldShowMarketplaceSwitcher,
} from '../../marketplace/MarketplaceSwitcher';
import { API_ENDPOINTS } from '../../../config/api';

/** عرض هدر — کمی بیشتر از بدنه صفحه برای تنفس بهتر سوئیچ */
export const HEADER_CONTAINER =
  'mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6';

export default function Header() {
  const pathname = usePathname() || '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useContext(AuthContext);
  const showMarketplaceSwitcher = shouldShowMarketplaceSwitcher(pathname);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.messages.unreadCount, { credentials: 'include' });
      const data = await res.json();
      if (data?.success && typeof data?.data?.count === 'number') setUnreadCount(data.data.count);
    } catch (_) {}
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    fetchUnreadCount();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') fetchUnreadCount();
    }, 45000);
    const onRefresh = () => fetchUnreadCount();
    window.addEventListener('refresh-unread-count', onRefresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('refresh-unread-count', onRefresh);
    };
  }, [isAuthenticated]);

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-gray-200 bg-white shadow-sm">
      <div className={HEADER_CONTAINER}>
        <div className="grid h-[3.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-14 sm:gap-4">
          <Link href="/" scroll={false} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_text.jpg"
              alt="پرندیکس"
              className="h-8 w-auto max-w-[7rem] object-contain object-right sm:h-9 sm:max-w-[9.5rem]"
            />
          </Link>

          <div className="flex min-w-0 justify-center overflow-visible">
            {showMarketplaceSwitcher ? (
              <MarketplaceSwitcher variant="header" />
            ) : null}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <CitySelector compact />

            {isAuthenticated && (
              <>
                <RequestAlertsMenu />
                <Link
                  href="/dashboard/messages"
                  className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600"
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

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600 md:hidden"
              aria-label={isMobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={isMobileMenuOpen}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <MainNavBar unreadCount={unreadCount} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
