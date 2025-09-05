"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRole } from '../../hooks/useRole';
import UserAvatar from './UserAvatar';
import ProfileDisplay from './ProfileDisplay';
import ProfileEdit from './ProfileEdit';
import ExpertDisplay from './ExpertDisplay';
import ExpertEdit from './ExpertEdit';
import Specializations from './Specializations';

export default function DashboardHeader() {
  const [activeTab, setActiveTab] = useState('profile-display');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userRole = useRole();
  const { user, getPrimaryRole } = userRole;

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile-display', 'profile-edit', 'expert-display', 'expert-edit', 'specializations'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Get userId from URL parameters
  const targetUserId = searchParams.get('userId');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
    // اسکرول نکن - فقط تب را تغییر بده
  };

  if (!user) {
    return null;
  }

  // فقط در صفحه اصلی داشبورد نمایش داده شود
  if (pathname !== '/dashboard') {
    return null;
  }

  const primaryRole = getPrimaryRole();
  const userRoles = userRole.getUserRoles();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'مدیر کل';
      case 'moderator': return 'ناظر';
      case 'expert': return 'متخصص';
      case 'customer': return 'مشتری';
      default: return role;
    }
  };

  return (
    <div className="space-y-2">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center">
          {/* User Avatar */}
          <div className="ml-4">
            <UserAvatar user={user} size="md" />
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {userRoles.map((role, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    role === 'admin' ? 'bg-red-100 text-red-700' :
                    role === 'moderator' ? 'bg-orange-100 text-orange-700' :
                    role === 'expert' ? 'bg-blue-100 text-blue-700' :
                    role === 'customer' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {getRoleDisplayName(role)}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span>منطقه زندگی: {user.location || 'نامشخص'}</span>
              <span className="mx-2">•</span>
              <span>موبایل: {user.mobile || 'نامشخص'}</span>
            </div>
            
            {/* Stats Cards - Small squares under location */}
            <div className="flex gap-6">
              <div className="border border-gray-300 rounded-lg p-3 w-24 h-24 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm">📊</span>
                </div>
                <p className="text-xs text-gray-600 text-center">پروژه‌ها</p>
                <p className="text-sm font-bold text-gray-800">12</p>
              </div>

              <div className="border border-gray-300 rounded-lg p-3 w-24 h-24 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm">💰</span>
                </div>
                <p className="text-xs text-gray-600 text-center">درآمد</p>
                <p className="text-sm font-bold text-gray-800">2.5M</p>
              </div>

              <div className="border border-gray-300 rounded-lg p-3 w-24 h-24 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm">⭐</span>
                </div>
                <p className="text-xs text-gray-600 text-center">امتیاز</p>
                <p className="text-sm font-bold text-gray-800">4.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-6">
            <button
              onClick={() => handleTabChange('profile-display')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile-display'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              نمایه شخصی
            </button>
            <button
              onClick={() => handleTabChange('expert-display')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expert-display'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              نمایه تخصصی
            </button>
            <button
              onClick={() => handleTabChange('specializations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specializations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              تخصص‌ها
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile-display' && <ProfileDisplay onEditClick={() => handleTabChange('profile-edit')} />}
          {activeTab === 'profile-edit' && <ProfileEdit targetUserId={targetUserId} />}
          {activeTab === 'expert-display' && <ExpertDisplay onEditClick={() => handleTabChange('expert-edit')} />}
          {activeTab === 'expert-edit' && <ExpertEdit targetUserId={targetUserId} />}
          {activeTab === 'specializations' && <Specializations targetUserId={targetUserId} />}
        </div>
      </div>
    </div>
  );
}