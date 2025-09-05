"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfessionalEditPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">ویرایش اطلاعات تخصصی</h1>
          <div className="flex space-x-4 space-x-reverse">
            <Link 
              href="/dashboard/user/professional-display"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              مشاهده اطلاعات
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
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">ویرایش اطلاعات تخصصی</h3>
          <p className="text-gray-600 mb-4">این بخش در حال توسعه است</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              قابلیت‌های تخصصی مانند تخصص‌ها، مهارت‌ها، تجربه کاری و مدارک به زودی اضافه خواهد شد.
            </p>
          </div>
        </div>
      </div>

      {/* Development roadmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">برنامه توسعه</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">فرم تحصیلات</h3>
              <p className="text-sm text-gray-600">افزودن مدارک تحصیلی، دانشگاه، رشته و سال فارغ‌التحصیلی</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">تجربه کاری</h3>
              <p className="text-sm text-gray-600">ثبت سوابق شغلی، نام شرکت، سمت، مدت زمان و توضیحات</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">مهارت‌ها و تخصص‌ها</h3>
              <p className="text-sm text-gray-600">افزودن مهارت‌های فنی و نرم، سطح تخصص و توضیحات</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">4</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">گواهینامه‌ها</h3>
              <p className="text-sm text-gray-600">ثبت مدارک و گواهینامه‌های تخصصی، تاریخ اخذ و اعتبار</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">5</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">پروژه‌ها و نمونه کارها</h3>
              <p className="text-sm text-gray-600">نمایش پروژه‌های انجام شده، لینک‌ها و تصاویر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact for suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">پیشنهادات شما</h3>
        <p className="text-blue-800 text-sm mb-4">
          اگر پیشنهادی برای بهبود این بخش دارید، لطفاً با تیم توسعه در میان بگذارید.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
          ارسال پیشنهاد
        </button>
      </div>
    </div>
  );
}
