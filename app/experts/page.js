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

  if (loading) return <div className="p-4 sm:p-8 text-center min-h-[200px] flex items-center justify-center">در حال بارگذاری...</div>;
  if (error) return <div className="p-4 sm:p-8 text-center text-red-600">خطا: {error}</div>;

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-[100vw]">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            {selectedCategory ? `متخصصان ${selectedCategory}` : 'متخصصان مجرب'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            {selectedCategory 
              ? `بهترین متخصصان تایید شده در زمینه ${selectedCategory}`
              : 'بهترین متخصصان تایید شده در تمام زمینه‌های خدمات'
            }
          </p>
          {selectedCategory && (
            <div className="mt-3 sm:mt-4">
              <Link 
                href="/experts" 
                className="inline-block bg-blue-100 text-blue-600 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm hover:bg-blue-200 transition-colors"
              >
                ← مشاهده همه متخصصان
              </Link>
            </div>
          )}
        </div>

        {experts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {experts.map((expert) => {
              const avatarSrc = expert.user?.avatar || (expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png');
              return (
              <div key={expert.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 min-w-0">
                <div className="text-center mb-3 sm:mb-4">
                  <img
                    src={avatarSrc}
                    alt={`${expert.user?.firstName} ${expert.user?.lastName}` || 'متخصص'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-2 sm:mb-3 object-cover border-2 border-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
                    }}
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate px-1">
                    {expert.user?.firstName} {expert.user?.lastName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{expert.bio}</p>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  {expert.experience && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <span className="mr-2">⭐</span>
                      <span>تجربه: {expert.experience} سال</span>
                    </div>
                  )}
                  {expert.basePrice && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 truncate">
                      <span className="mr-2 shrink-0">💰</span>
                      <span className="min-w-0">قیمت پایه: {expert.basePrice.toLocaleString()} تومان</span>
                    </div>
                  )}
                  {expert.location && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 truncate">
                      <span className="mr-2 shrink-0">📍</span>
                      <span className="min-w-0 truncate">{expert.location}</span>
                    </div>
                  )}
                </div>

                {/* تخصص‌های متخصص */}
                {expert.categories && expert.categories.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">تخصص‌ها:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.categories.slice(0, 3).map((category) => (
                        <span 
                          key={category.id} 
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center truncate max-w-full"
                        >
                          <span className="mr-1 shrink-0">{category.icon}</span>
                          <span className="truncate">{category.title}</span>
                        </span>
                      ))}
                      {expert.categories.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full shrink-0">
                          +{expert.categories.length - 3} تخصص دیگر
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
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
                  <Link 
                    href={`/experts/${expert.id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 w-full sm:w-auto text-center"
                  >
                    مشاهده پروفایل
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">متخصصی یافت نشد</h3>
            <p className="text-sm sm:text-base text-gray-600">در حال حاضر متخصصی در این دسته‌بندی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}
