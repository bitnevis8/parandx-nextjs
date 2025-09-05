"use client";

import { useState, useEffect } from 'react';
import { useRole } from '../../../hooks/useRole';
import { API_ENDPOINTS } from '../../../config/api';
import UserAvatar from '../../../components/ui/UserAvatar';
import Link from 'next/link';

export default function PersonalDisplayPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = useRole();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.users.getCurrentProfile, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setProfile(result.data);
        }
      } else if (response.status === 404) {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      {/* Header with navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">نمایش اطلاعات شخصی</h1>
          <div className="flex space-x-4 space-x-reverse">
            <Link 
              href="/dashboard/user/personal-edit"
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

        {profile ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <UserAvatar 
                user={profile} 
                size="lg" 
                className="rounded-full border border-gray-300" 
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500">{profile.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">اطلاعات تماس</h4>
                <p className="text-sm text-gray-600">موبایل: {profile.mobile || 'ثبت نشده'}</p>
                <p className="text-sm text-gray-600">تلفن: {profile.phone || 'ثبت نشده'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">اطلاعات شخصی</h4>
                <p className="text-sm text-gray-600">تاریخ تولد: {profile.birthDate || 'ثبت نشده'}</p>
                <p className="text-sm text-gray-600">جنسیت: {profile.gender === 'male' ? 'مرد' : profile.gender === 'female' ? 'زن' : profile.gender || 'ثبت نشده'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">وضعیت حساب</h4>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${profile.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    ایمیل: {profile.isEmailVerified ? 'تأیید شده' : 'تأیید نشده'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${profile.isMobileVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    موبایل: {profile.isMobileVerified ? 'تأیید شده' : 'تأیید نشده'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    حساب: {profile.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">نقش‌ها</h4>
                <p className="text-sm text-gray-600">
                  {profile.userRoles && profile.userRoles.length > 0 
                    ? profile.userRoles.map(role => role.name).join(', ')
                    : 'نقش خاصی تعریف نشده'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">اطلاعات کاربر یافت نشد</h3>
            <p className="text-gray-600 mb-4">لطفاً ابتدا اطلاعات خود را تکمیل کنید</p>
            <Link 
              href="/dashboard/user/personal-edit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              افزودن اطلاعات شخصی
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
