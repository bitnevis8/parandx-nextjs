"use client";

import { useRole } from '../hooks/useRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/dashboard',
  showUnauthorized = true 
}) {
  const userRole = useRole();
  const router = useRouter();
  const { user, loading, hasAnyRole } = userRole;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // اگر کاربر وارد نشده، به صفحه ورود هدایت کن
        router.push('/auth');
        return;
      }

      if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        // اگر کاربر نقش مورد نیاز را ندارد
        if (showUnauthorized) {
          // اگر می‌خواهیم صفحه عدم دسترسی نشان دهیم، کاری نکن
          return;
        } else {
          // در غیر این صورت به fallback path هدایت کن
          router.push(fallbackPath);
          return;
        }
      }
    }
  }, [user, loading, requiredRoles, hasAnyRole, router, fallbackPath, showUnauthorized]);

  // اگر در حال بارگذاری است
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // اگر کاربر وارد نشده
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">دسترسی غیرمجاز</h1>
          <p className="text-gray-600 mb-4">لطفا ابتدا وارد شوید</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            ورود
          </button>
        </div>
      </div>
    );
  }

  // اگر نقش مورد نیاز را ندارد
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">دسترسی غیرمجاز</h1>
          <p className="text-gray-600 mb-4">
            شما دسترسی لازم برای مشاهده این صفحه را ندارید
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              بازگشت
            </button>
            <button
              onClick={() => router.push(fallbackPath)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              داشبورد
            </button>
          </div>
        </div>
      </div>
    );
  }

  // اگر همه چیز درست است، محتوا را نمایش بده
  return children;
}
