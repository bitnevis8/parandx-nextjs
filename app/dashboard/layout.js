"use client";

import Sidebar, {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '../components/ui/Sidebar';
import DashboardHeader from '../components/ui/DashboardHeader';
import DashboardMobileNav from '../components/ui/DashboardMobileNav';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_COLLAPSED_KEY = 'parandx-dashboard-sidebar-collapsed';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

export default function DashboardLayout({ children }) {
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const auth = useAuth();
  const { user, loading, setUser } = auth || { user: null, loading: false, setUser: undefined };
  const isDesktop = useIsDesktop();

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true');
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const handleVerifyEmail = async () => {
    setVerificationError(null);
    setVerificationSuccess(null);
    if (!user || !user.email) {
      setVerificationError('اطلاعات کاربر یا ایمیل در دسترس نیست.');
      return;
    }
    if (!emailVerificationCode) {
      setVerificationError('لطفا کد تایید را وارد کنید.');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, code: emailVerificationCode }),
      });
      const data = await response.json();
      if (data.success) {
        setVerificationSuccess(data.message);
        if (setUser) setUser({ ...user, isEmailVerified: true });
      } else {
        setVerificationError(data.message || 'خطا در تایید ایمیل.');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationError('خطا در ارتباط با سرور.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setVerificationError(null);
    setVerificationSuccess(null);
    if (!user || !user.email) {
      setVerificationError('اطلاعات کاربر یا ایمیل در دسترس نیست.');
      setResendLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/resend-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      if (data.success) {
        setVerificationSuccess(data.message);
      } else {
        setVerificationError(data.message || 'خطا در ارسال مجدد کد.');
      }
    } catch (error) {
      console.error('Error resending code:', error);
      setVerificationError('خطا در ارتباط با سرور.');
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600" />
      </div>
    );
  }

  const sidebarCollapsedEffective = isDesktop && sidebarCollapsed;
  const sidebarWidth = sidebarCollapsedEffective ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gray-50">
      <aside
        style={{ width: sidebarWidth }}
        className="fixed inset-y-0 right-0 z-50 hidden flex-col border-l border-gray-200 bg-white shadow-sm transition-[width] duration-300 ease-in-out md:flex"
      >
        <Sidebar
          collapsed={sidebarCollapsedEffective}
          onToggleCollapse={toggleSidebarCollapsed}
          showCollapseToggle
        />
      </aside>

      <div
        className="flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out max-md:mr-0 md:mr-[var(--sidebar-width)]"
        style={{ '--sidebar-width': sidebarWidth }}
      >
        <DashboardMobileNav />

        <main className="min-w-0 flex-1 px-3 py-3 sm:px-4 sm:py-4 md:pb-6 md:pl-5 md:pr-6">
          {user && user.email && !user.isEmailVerified ? (
            <div
              className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:mb-6 sm:p-5"
              role="alert"
            >
              <p className="font-semibold text-amber-900">ایمیل شما تأیید نشده است</p>
              <p className="mt-1 break-words text-sm text-amber-800">
                کد تأیید ارسال‌شده به {user.email} را وارد کنید.
              </p>

              {verificationError ? (
                <div className="relative mt-3 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                  {verificationError}
                </div>
              ) : null}
              {verificationSuccess ? (
                <div className="relative mt-3 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                  {verificationSuccess}
                </div>
              ) : null}

              <div className="mt-4 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 rtl:space-x-reverse">
                <input
                  type="text"
                  placeholder="کد تایید را وارد کنید"
                  className="flex-1 rounded-xl border border-amber-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={emailVerificationCode || ''}
                  onChange={(e) => setEmailVerificationCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="rounded-xl bg-amber-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-amber-600"
                >
                  تایید ایمیل
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-50"
                >
                  {resendLoading ? 'در حال ارسال...' : 'ارسال مجدد کد'}
                </button>
              </div>
            </div>
          ) : null}
          <DashboardHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
