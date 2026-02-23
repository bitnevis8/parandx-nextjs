"use client";

import { useRole } from '../../hooks/useRole';

export default function ProfileDisplay({ onEditClick }) {
  const userRole = useRole();
  const { user } = userRole;

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">نمایش نمایه شخصی</h3>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>ویرایش نمایه شخصی</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.firstName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.lastName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">موبایل</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.mobile || 'نامشخص'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.username}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">جنسیت</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {user.gender === 'male' ? 'آقا' : user.gender === 'female' ? 'خانم' : 'مشخص نشده'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {user.isActive ? 'فعال' : 'غیرفعال'}
          </p>
        </div>
      </div>
    </div>
  );
}
