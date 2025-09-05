"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../config/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.categories.getAll);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data || []);
        } else {
          setError('خطا در دریافت دسته‌بندی‌ها');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('خطا در اتصال به سرور');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</p>
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
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">دسته‌بندی خدمات</h1>
          <p className="text-gray-600">انتخاب کنید که چه خدماتی نیاز دارید</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-300 p-2 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                          {category.title}
                        </h2>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          {category.subcategories?.length || 0} زیردسته فعال
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 text-blue-600 bg-blue-50 rounded-lg p-4 min-w-[80px]">
                      <span className="text-4xl">👨‍🔧</span>
                      <span className="text-sm font-bold">{category.expertCount || 0}</span>
                      <span className="text-xs text-blue-500">متخصص</span>
                    </div>
                  </div>
                  
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                        زیردسته‌ها
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.subcategories.slice(0, 4).map((sub) => (
                          <div 
                            key={sub.id}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-3 py-3 rounded-lg flex items-center justify-between border border-blue-100 hover:border-blue-200 transition-colors min-h-[60px]"
                          >
                            <span className="text-sm font-medium truncate flex-1 mr-3">{sub.title}</span>
                            <div className="flex flex-col items-center space-y-1 min-w-[40px]">
                              <span className="text-sm">👨‍🔧</span>
                              <span className="text-sm font-bold">{sub.expertCount || 0}</span>
                            </div>
                          </div>
                        ))}
                        {category.subcategories.length > 4 && (
                          <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg flex items-center justify-center text-xs font-medium">
                            +{category.subcategories.length - 4} مورد دیگر
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <span>مشاهده جزئیات</span>
                      <span className="mr-2">→</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        فعال
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">دسته‌بندی موجود نیست</h2>
            <p className="text-gray-600">هنوز دسته‌بندی‌ای تعریف نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}
