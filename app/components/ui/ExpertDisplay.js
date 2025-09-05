"use client";

import { useRole } from '../../hooks/useRole';

export default function ExpertDisplay({ onEditClick }) {
  const userRole = useRole();
  const { user, getUserRoles } = userRole;

  if (!user) {
    return null;
  }

  const userRoles = getUserRoles();

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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">نمایش نمایه تخصصی</h3>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>ویرایش نمایه تخصصی</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نقش‌ها</label>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {getRoleDisplayName(role)}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ عضویت</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : 'نامشخص'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">آخرین ورود</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fa-IR') : 'نامشخص'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت تأیید ایمیل</label>
          <p className={`p-3 rounded-lg ${user.isEmailVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {user.isEmailVerified ? 'تأیید شده' : 'تأیید نشده'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت تأیید موبایل</label>
          <p className={`p-3 rounded-lg ${user.isMobileVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {user.isMobileVerified ? 'تأیید شده' : 'تأیید نشده'}
          </p>
        </div>
      </div>
    </div>
  );
}
