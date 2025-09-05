"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfessionalDisplayPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">نمایش اطلاعات تخصصی</h1>
          <div className="flex space-x-4 space-x-reverse">
            <Link 
              href="/dashboard/user/professional-edit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              ویرایش اطلاعات
            </Link>
            <Link 
              href="/dashboard?tab=profile-edit"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              بازگشت به پروفایل
            </Link>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">اطلاعات تخصصی</h3>
          <p className="text-gray-600 mb-4">در حال حاضر اطلاعات تخصصی ثبت نشده است</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              این بخش برای نمایش تخصص‌ها، مهارت‌ها، تجربه کاری و مدارک حرفه‌ای شما طراحی شده است.
            </p>
          </div>
          <Link 
            href="/dashboard/user/professional-edit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            افزودن اطلاعات تخصصی
          </Link>
        </div>
      </div>

      {/* Placeholder for future professional content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">قابلیت‌های آینده</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-medium text-gray-900 mb-1">تحصیلات</h3>
            <p className="text-sm text-gray-600">مدارک تحصیلی و دوره‌های آموزشی</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="font-medium text-gray-900 mb-1">تجربه کاری</h3>
            <p className="text-sm text-gray-600">سوابق شغلی و پروژه‌ها</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-medium text-gray-900 mb-1">مهارت‌ها</h3>
            <p className="text-sm text-gray-600">تخصص‌ها و توانایی‌های حرفه‌ای</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">📜</div>
            <h3 className="font-medium text-gray-900 mb-1">گواهینامه‌ها</h3>
            <p className="text-sm text-gray-600">مدارک و گواهینامه‌های تخصصی</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🌟</div>
            <h3 className="font-medium text-gray-900 mb-1">دستاوردها</h3>
            <p className="text-sm text-gray-600">جوایز و افتخارات حرفه‌ای</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-medium text-gray-900 mb-1">لینک‌ها</h3>
            <p className="text-sm text-gray-600">پروفایل‌های حرفه‌ای و شبکه‌های اجتماعی</p>
          </div>
        </div>
      </div>
    </div>
  );
}
