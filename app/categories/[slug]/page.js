"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../config/api';

export default function CategoryDetailPage({ params }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug;

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.categories.getBySlug(categorySlug));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCategory(data.data);
        } else {
          setError('دسته‌بندی یافت نشد');
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('خطا در دریافت اطلاعات دسته‌بندی');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryData();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">خطا</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/categories" scroll={false} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            بازگشت به دسته‌بندی‌ها
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">دسته‌بندی یافت نشد</h1>
          <p className="text-gray-600 mb-4">دسته‌بندی مورد نظر شما وجود ندارد یا حذف شده است.</p>
          <Link href="/categories" scroll={false} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            بازگشت به دسته‌بندی‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/categories" scroll={false} className="text-blue-600 hover:text-blue-800 transition-colors">
              ← بازگشت به دسته‌بندی‌ها
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{category.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{category.subcategories?.length || 0} زیردسته</span>
                <span className="flex items-center space-x-1">
                  <span>👨‍🔧</span>
                  <span>{category.expertCount || 0} متخصص</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {category.subcategories && category.subcategories.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">زیردسته‌های {category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl p-3 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:scale-110 transition-transform duration-300">
                        {subcategory.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                          {subcategory.title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          زیردسته {category.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 text-blue-600 bg-blue-50 rounded-lg p-4 min-w-[80px]">
                      <span className="text-4xl">👨‍🔧</span>
                      <span className="text-sm font-bold">{subcategory.expertCount || 0}</span>
                      <span className="text-xs text-blue-500">متخصص</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/experts?category=${subcategory.slug}`}
                      scroll={false}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 text-center flex items-center justify-center space-x-2"
                    >
                      <span>👨‍🔧</span>
                      <span>مشاهده متخصصان</span>
                    </Link>
                    <Link
                      href={`/requests/new?category=${subcategory.slug}`}
                      scroll={false}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 text-center flex items-center justify-center space-x-2"
                    >
                      <span>📝</span>
                      <span>درخواست جدید</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">زیردسته‌ای موجود نیست</h2>
            <p className="text-gray-600 mb-6">
              برای این دسته‌بندی هنوز زیردسته‌ای تعریف نشده است.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/experts?category=${category.slug}`}
                scroll={false}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                مشاهده متخصصان
              </Link>
              <Link
                href={`/requests/new?category=${category.slug}`}
                scroll={false}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ثبت درخواست جدید
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

