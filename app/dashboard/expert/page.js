"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRole } from '../../hooks/useRole';
import { API_ENDPOINTS } from '../../config/api';

export default function ExpertDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const userRole = useRole();
  const searchParams = useSearchParams();

  useEffect(() => {
    // دریافت userId از URL
    const userId = searchParams.get('userId');
    setTargetUserId(userId);
    if (userId) {
      fetchUserData(userId);
    }
    fetchData(userId);
  }, [searchParams]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(API_ENDPOINTS.users.getById(userId), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.success) {
          setTargetUser(userData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchData = async (userId = null) => {
    try {
      setLoading(true);
      
      // دریافت پروفایل متخصص
      let profileUrl = `${API_ENDPOINTS.experts.base}/profile/current`;
      if (userId) {
        profileUrl = `${API_ENDPOINTS.experts.getUserProfile}?userId=${userId}`;
      }
      
      const profileResponse = await fetch(profileUrl, {
        credentials: 'include'
      });
      
      if (profileResponse.ok) {
        const profileResult = await profileResponse.json();
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data);
        }
      }

      // دریافت تخصص‌ها
      let specializationsUrl;
      if (userId) {
        specializationsUrl = `${API_ENDPOINTS.experts.getUserSpecializations}?userId=${userId}`;
      } else {
        specializationsUrl = API_ENDPOINTS.experts.getSpecializations;
      }
      
      const specializationsResponse = await fetch(specializationsUrl, {
        credentials: 'include'
      });
      
      if (specializationsResponse.ok) {
        const specializationsResult = await specializationsResponse.json();
        if (specializationsResult.success) {
          setSpecializations(specializationsResult.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {targetUserId ? (
              targetUser ? 
                `داشبورد متخصص ${targetUser.firstName} ${targetUser.lastName}` :
                `داشبورد متخصص (ID: ${targetUserId})`
            ) : 'داشبورد متخصص من'}
          </h1>
          <div className="flex space-x-4 space-x-reverse">
            <Link 
              href="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              بازگشت به داشبورد
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">پروفایل</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile ? 'تکمیل شده' : 'تکمیل نشده'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">تخصص‌ها</p>
                <p className="text-lg font-semibold text-gray-900">{specializations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">وضعیت</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile ? 'فعال' : 'غیرفعال'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href={targetUserId ? `/dashboard?tab=expert-edit&userId=${targetUserId}` : '/dashboard?tab=expert-edit'}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">✏️</div>
            <h3 className="font-semibold">ویرایش پروفایل</h3>
            <p className="text-sm opacity-90">مدیریت اطلاعات شخصی</p>
          </Link>

          <Link 
            href={targetUserId ? `/dashboard?tab=expert-display&userId=${targetUserId}` : '/dashboard?tab=expert-display'}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👁️</div>
            <h3 className="font-semibold">مشاهده پروفایل</h3>
            <p className="text-sm opacity-90">نمایش پروفایل عمومی</p>
          </Link>

          <Link 
            href={targetUserId ? `/dashboard?tab=specializations&userId=${targetUserId}` : '/dashboard?tab=specializations'}
            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold">مدیریت تخصص‌ها</h3>
            <p className="text-sm opacity-90">افزودن و حذف تخصص‌ها</p>
          </Link>

          <Link 
            href={targetUserId ? `/dashboard/expert/requests?userId=${targetUserId}` : '/dashboard/expert/requests'}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">درخواست‌ها</h3>
            <p className="text-sm opacity-90">مدیریت درخواست‌های مشتریان</p>
          </Link>
        </div>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">خلاصه پروفایل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">اطلاعات کلی</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>نام:</strong> {profile.user?.firstName} {profile.user?.lastName}</p>
                <p><strong>ایمیل:</strong> {profile.user?.email}</p>
                <p><strong>تجربه:</strong> {profile.experience || 'ثبت نشده'}</p>
                <p><strong>قیمت پایه:</strong> {profile.basePrice ? `${profile.basePrice.toLocaleString()} تومان` : 'تعیین نشده'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">تخصص‌های فعلی</h3>
              {specializations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {specializations.slice(0, 3).map((spec) => (
                    <span key={spec.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {spec.icon} {spec.title}
                    </span>
                  ))}
                  {specializations.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{specializations.length - 3} بیشتر
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">هنوز تخصصی اضافه نشده است</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action if no profile */}
      {!profile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-4xl ml-4">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">پروفایل متخصص ایجاد نشده</h3>
              <p className="text-yellow-800 mb-4">
                برای شروع کار به عنوان متخصص، ابتدا پروفایل خود را تکمیل کنید.
              </p>
              <Link 
                href={targetUserId ? `/dashboard?tab=expert-edit&userId=${targetUserId}` : '/dashboard?tab=expert-edit'}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
              >
                ایجاد پروفایل متخصص
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
