"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_ENDPOINTS } from '../config/api';

export default function ExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const category = searchParams.get('category');
        setSelectedCategory(category);
        
        // اگر دسته‌بندی انتخاب شده، فقط متخصصان آن دسته را بگیر
        let url = API_ENDPOINTS.experts.getAll;
        if (category) {
          url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          setExperts(result.data || []);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching experts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [searchParams]);

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;
  if (error) return <div className="p-8 text-center text-red-600">خطا: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {selectedCategory ? `متخصصان ${selectedCategory}` : 'متخصصان مجرب'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {selectedCategory 
              ? `بهترین متخصصان تایید شده در زمینه ${selectedCategory}`
              : 'بهترین متخصصان تایید شده در تمام زمینه‌های خدمات'
            }
          </p>
          {selectedCategory && (
            <div className="mt-4">
              <Link 
                href="/experts" 
                className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                ← مشاهده همه متخصصان
              </Link>
            </div>
          )}
        </div>

        {experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="text-center mb-4">
                  {expert.avatar ? (
                    <img 
                      src={expert.avatar} 
                      alt={`${expert.user?.firstName} ${expert.user?.lastName}` || 'متخصص'} 
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {expert.user?.firstName} {expert.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{expert.bio}</p>
                </div>

                <div className="space-y-2 mb-4">
                  {expert.experience && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⭐</span>
                      <span>تجربه: {expert.experience} سال</span>
                    </div>
                  )}
                  {expert.basePrice && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>قیمت پایه: {expert.basePrice.toLocaleString()} تومان</span>
                    </div>
                  )}
                  {expert.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{expert.location}</span>
                    </div>
                  )}
                </div>

                {/* تخصص‌های متخصص */}
                {expert.categories && expert.categories.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">تخصص‌ها:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.categories.slice(0, 3).map((category) => (
                        <span 
                          key={category.id} 
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          <span className="mr-1">{category.icon}</span>
                          {category.title}
                        </span>
                      ))}
                      {expert.categories.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{expert.categories.length - 3} تخصص دیگر
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.isShop && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">مغازه</span>
                  )}
                  {expert.isMobile && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">اعزام به محل</span>
                  )}
                  {expert.status === 'approved' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">تایید شده</span>
                  )}
                </div>

                <div className="text-center">
                  <a 
                    href={`/experts/${expert.id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    مشاهده پروفایل
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">متخصصی یافت نشد</h3>
            <p className="text-gray-600">در حال حاضر متخصصی در این دسته‌بندی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}
