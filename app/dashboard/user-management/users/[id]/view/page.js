"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@config/api";

export default function UserViewPage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params Promise
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // دریافت اطلاعات کاربر
        const userResponse = await fetch(`${API_ENDPOINTS.users.getOne(id)}`);
        const userData = await userResponse.json();
        
        if (userData.success) {
          setUser(userData.data);
          
          // بررسی اینکه آیا کاربر متخصص است یا نه
          const hasExpertRole = userData.data.userRoles?.some(role => role.name === 'expert');
          
          if (hasExpertRole) {
            // دریافت اطلاعات متخصص
            const expertResponse = await fetch(`${API_ENDPOINTS.experts.getAll}`);
            const expertData = await expertResponse.json();
            
            if (expertData.success) {
              const userExpert = expertData.data.find(exp => exp.userId === parseInt(params.id));
              if (userExpert) {
                setExpert(userExpert);
              }
            }
          }
        } else {
          throw new Error(userData.message || "خطا در دریافت اطلاعات کاربر");
        }
      } catch (err) {
        setError(err.message || "خطا در ارتباط با سرور");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const getRoleBadgeColor = (roleName) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'guest':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'admin':
        return '👑';
      case 'moderator':
        return '👮';
      case 'expert':
        return '🔧';
      case 'customer':
        return '👤';
      case 'guest':
        return '👥';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری اطلاعات کاربر...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
            <span className="block">{error}</span>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              بازگشت
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">کاربر یافت نشد</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              مشاهده اطلاعات کاربر
            </h1>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              بازگشت
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-6 rtl:space-x-reverse">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-200">
                  <span className="text-3xl text-blue-600 font-bold">
                    {user.firstName?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              {/* Roles */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">نقش‌ها:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.userRoles?.map((role, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(role.name)}`}
                    >
                      <span className="mr-1">{getRoleIcon(role.name)}</span>
                      {role.nameFa}
                    </span>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">نام کاربری:</label>
                  <p className="text-gray-900">{user.username || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">شماره موبایل:</label>
                  <p className="text-gray-900">{user.mobile || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">وضعیت:</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">تاریخ عضویت:</label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Information */}
        {expert && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔧</span>
              اطلاعات متخصص
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">بیوگرافی:</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {expert.bio || 'بیوگرافی ثبت نشده است'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تجربه:</label>
                <p className="text-gray-900">{expert.experience || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت پایه:</label>
                <p className="text-gray-900">
                  {expert.basePrice ? `${expert.basePrice.toLocaleString()} تومان` : '-'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موقعیت:</label>
                <p className="text-gray-900">{expert.location || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع خدمات:</label>
                <div className="flex flex-wrap gap-2">
                  {expert.isShop && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      🏪 مغازه
                    </span>
                  )}
                  {expert.isMobile && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🚗 اعزام به محل
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت تایید:</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  expert.status === 'approved' ? 'bg-green-100 text-green-800' :
                  expert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  expert.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {expert.status === 'approved' ? 'تایید شده' :
                   expert.status === 'pending' ? 'در انتظار تایید' :
                   expert.status === 'rejected' ? 'رد شده' :
                   expert.status === 'suspended' ? 'تعلیق شده' : expert.status}
                </span>
              </div>
            </div>

            {/* Categories */}
            {expert.categories && expert.categories.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">تخصص‌ها:</label>
                <div className="flex flex-wrap gap-2">
                  {expert.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push(`/dashboard/user-management/users/${user.id}/edit`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-150 ease-in-out"
            >
              ویرایش کاربر
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition duration-150 ease-in-out"
            >
              بازگشت به لیست
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}