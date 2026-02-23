"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../config/api';

export default function ExpertDetailPage({ params }) {
  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Unwrap params for Next.js 15 compatibility
  const resolvedParams = use(params);
  const expertId = resolvedParams.id;

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.experts.getById(expertId));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setExpert(result.data);
        
        // دریافت نظرات متخصص
        const reviewsResponse = await fetch(`${API_ENDPOINTS.reviews.getAll}?expertId=${expertId}`);
        if (reviewsResponse.ok) {
          const reviewsResult = await reviewsResponse.json();
          setReviews(reviewsResult.data || []);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching expert:', err);
      } finally {
        setLoading(false);
      }
    };

    if (expertId) {
      fetchExpertData();
    }
  }, [expertId]);

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;
  if (error) return <div className="p-8 text-center text-red-600">خطا: {error}</div>;
  if (!expert) return <div className="p-8 text-center">متخصص پیدا نشد</div>;

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-[100vw]">
        {/* اطلاعات کاربر - Hero Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-20 translate-x-20 sm:-translate-y-32 sm:translate-x-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-16 -translate-x-16 sm:translate-y-24 sm:-translate-x-24 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
                  <img
                    src={expert.user?.avatar || (expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png')}
                    alt={`${expert.user?.firstName} ${expert.user?.lastName}` || 'متخصص'}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
                    }}
                  />
                </div>
                {/* Status Badge */}
                <div className="absolute -bottom-2 -right-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {expert.status === 'approved' ? '✅ تایید شده' : expert.status}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-right min-w-0 w-full">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3 break-words">
                  {expert.user?.firstName} {expert.user?.lastName}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-3 sm:mb-4 max-w-2xl mx-auto md:mx-0">
                  {expert.bio}
                </p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 mt-4 sm:mt-6">
                  <div className="bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base">
                    <span className="text-blue-600 font-semibold">⭐ {expert.experience} سال تجربه</span>
                  </div>
                  <div className="bg-green-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base min-w-0">
                    <span className="text-green-600 font-semibold truncate">💰 {expert.basePrice?.toLocaleString()} تومان</span>
                  </div>
                  <div className="bg-purple-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base min-w-0 max-w-full">
                    <span className="text-purple-600 font-semibold truncate block">📍 {expert.location}</span>
                  </div>
                </div>
                {expert.user?.id && (
                  <Link
                    href={`/dashboard/messages/${expert.user.id}`}
                    className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl shadow-md transition-colors"
                  >
                    <span>💬</span>
                    <span>ارسال پیام</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* تخصص‌ها */}
        {expert.categories && expert.categories.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-8">
            <div className="text-center mb-5 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                🔧 تخصص‌ها
              </h2>
              <p className="text-sm sm:text-base text-gray-600">خدماتی که این متخصص ارائه می‌دهد</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {expert.categories.map((category, index) => (
                <div key={category.id} className="group relative">
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-100 hover:shadow-xl sm:hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        {category.icon ? (
                          <span className="text-2xl">{category.icon}</span>
                        ) : (
                          <span className="text-white font-bold text-lg">🔧</span>
                        )}
                      </div>
                      <div className="mr-4">
                        <h3 className="font-bold text-gray-800 text-lg">{category.title}</h3>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* اطلاعات متخصص */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-8">
          <div className="text-center mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              📋 جزئیات متخصص
            </h2>
            <p className="text-sm sm:text-base text-gray-600">اطلاعات کامل درباره این متخصص</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="group relative">
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border border-green-100 hover:shadow-xl sm:hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">تجربه</h3>
                  <p className="text-2xl font-bold text-green-600">{expert.experience} سال</p>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-6 rounded-2xl border border-yellow-100 hover:shadow-xl sm:hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">قیمت پایه</h3>
                  <p className="text-xl font-bold text-yellow-600">{expert.basePrice?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">تومان</p>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 hover:shadow-xl sm:hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🏪</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">نوع کار</h3>
                  <div className="space-y-1">
                    {expert.isShop && (
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        مغازه
                      </span>
                    )}
                    {expert.isMobile && (
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        اعزام به محل
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6 rounded-2xl border border-blue-100 hover:shadow-xl sm:hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">📍</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">موقعیت</h3>
                  <p className="text-sm text-blue-600 font-medium">{expert.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* دکمه درخواست خدمات */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 mb-5 sm:mb-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white opacity-10 rounded-full translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">آماده برای همکاری هستید؟</h3>
            <p className="text-base sm:text-lg md:text-xl mb-5 sm:mb-8 opacity-90">برای دریافت خدمات از این متخصص، درخواست خود را ثبت کنید</p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 sm:py-4 px-6 sm:px-12 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-base sm:text-lg w-full sm:w-auto">
              📝 درخواست خدمات
            </button>
          </div>
        </div>

        {/* نظرات */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              💬 نظرات کاربران
            </h2>
            <p className="text-sm sm:text-base text-gray-600">تجربیات مشتریان از این متخصص</p>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="group">
                  <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-xl sm:hover:scale-105 transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-xl">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="mr-3 text-sm text-gray-600 font-bold bg-yellow-100 px-2 py-1 rounded-full">
                          {review.rating}/5
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg break-words">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">💭</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">هنوز نظری ثبت نشده است</h3>
              <p className="text-gray-500 text-sm sm:text-base md:text-lg">اولین نفری باشید که نظر می‌دهد!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
