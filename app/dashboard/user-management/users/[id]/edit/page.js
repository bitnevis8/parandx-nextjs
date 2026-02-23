"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_ENDPOINTS } from "../../../../../config/api";

const EditUserPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobile: "",
    phone: "",
    avatar: "",
    gender: "",
    businessName: "",
    businessContactInfo: "",
    roleIds: [],
    password: "",
    isActive: true,
    isEmailVerified: false,
    isMobileVerified: false
  });
  const [roles, setRoles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(API_ENDPOINTS.users.getById(id));
        const userData = await userResponse.json();
        if (userData.success) {
          setFormData({
            firstName: userData.data.firstName || "",
            lastName: userData.data.lastName || "",
            username: userData.data.username || "",
            email: userData.data.email || "",
            mobile: userData.data.mobile || "",
            phone: userData.data.phone || "",
            avatar: userData.data.avatar || "",
            gender: userData.data.gender || "",
            businessName: userData.data.businessName || "",
            businessContactInfo: userData.data.businessContactInfo || "",
            roleIds: userData.data.userRoles ? userData.data.userRoles.map(role => role.id) : [],
            password: "",
            isActive: userData.data.isActive !== undefined ? userData.data.isActive : true,
            isEmailVerified: userData.data.isEmailVerified || false,
            isMobileVerified: userData.data.isMobileVerified || false
          });

          // بررسی اینکه آیا کاربر نقش متخصص دارد یا نه
          const hasExpertRole = userData.data.userRoles && userData.data.userRoles.some(role => role.name === 'expert');
          setIsExpert(hasExpertRole);
          
          // بررسی اینکه آیا کاربر نقش مشتری دارد یا نه
          const hasCustomerRole = userData.data.userRoles && userData.data.userRoles.some(role => role.name === 'customer');
          setIsCustomer(hasCustomerRole);
        } else {
          setError(userData.message || "خطا در دریافت اطلاعات کاربر");
        }
      } catch (err) {
        setError(err.message || "خطا در ارتباط با سرور هنگام دریافت کاربر");
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }

      try {
        // Fetch roles data
        const rolesResponse = await fetch(API_ENDPOINTS.roles.getAll);
        const rolesData = await rolesResponse.json();
        if (rolesData.success) {
          setRoles(rolesData.data || []);
        } else {
          setError(rolesData.message || "خطا در دریافت لیست نقش‌ها");
        }
      } catch (err) {
        setError(err.message || "خطا در ارتباط با سرور هنگام دریافت نقش‌ها");
        console.error("Error fetching roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleRoleChange = (e) => {
    const { options } = e.target;
    const selectedRoleIds = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => parseInt(option.value, 10));
    setFormData({ ...formData, roleIds: selectedRoleIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // بررسی نقش متخصص
      const expertRole = roles.find(role => role.id === formData.roleIds.find(roleId => roleId === role.id) && role.name === 'expert');
      if (expertRole) {
        // بررسی اینکه آیا کاربر تخصص دارد یا نه
        const specializationsResponse = await fetch(`${API_ENDPOINTS.users.base}/check-specializations/${id}`);
        const specializationsData = await specializationsResponse.json();
        
        if (!specializationsData.success || !specializationsData.data.hasSpecializations) {
          setError("برای اعطای نقش متخصص، کاربر باید حداقل یک تخصص داشته باشد. لطفاً ابتدا تخصص‌های کاربر را در صفحه پروفایل متخصص اضافه کنید.");
          setSubmitting(false);
          return;
        }
      }

      // فقط فیلدهای غیر خالی را ارسال کن
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }
      
      const response = await fetch(API_ENDPOINTS.users.update(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        alert("کاربر با موفقیت بروزرسانی شد.");
        router.push("/dashboard/user-management/users");
      } else {
        setError(data.message || "خطا در بروزرسانی کاربر");
      }
    } catch (err) {
      setError(err.message || "خطا در ارتباط با سرور");
      console.error("Error updating user:", err);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">ویرایش کاربر</h1>

        {loadingUser || loadingRoles ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* دکمه‌های مدیریت متخصص - برای همه کاربران */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">مدیریت متخصص</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push(`/dashboard?tab=specializations&userId=${id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  ویرایش تخصص‌ها
                </button>
                <button
                  onClick={() => router.push(`/dashboard?tab=expert-edit&userId=${id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  ویرایش پروفایل متخصص
                </button>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                {isExpert 
                  ? "این کاربر نقش متخصص دارد. برای مدیریت اطلاعات تخصصی از دکمه‌های بالا استفاده کنید."
                  : isCustomer 
                    ? "این کاربر نقش مشتری دارد. برای مدیریت اطلاعات تخصصی از دکمه‌های بالا استفاده کنید."
                    : "برای مدیریت اطلاعات تخصصی از دکمه‌های بالا استفاده کنید."
                }
              </p>
            </div>

            {/* فرم پروفایل کاربری */}
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">نام:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">نام کاربری:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">ایمیل:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">موبایل:</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">تلفن:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">جنسیت:</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">مشخص نشده</option>
                  <option value="male">آقا</option>
                  <option value="female">خانم</option>
                </select>
              </div>
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">آواتار (URL):</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="آدرس تصویر پروفایل"
                />
              </div>
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">نام کسب و کار (اختیاری):</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="businessContactInfo" className="block text-sm font-medium text-gray-700 mb-1">اطلاعات تماس کسب و کار (اختیاری):</label>
                <input
                  type="text"
                  id="businessContactInfo"
                  name="businessContactInfo"
                  value={formData.businessContactInfo}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="roleIds" className="block text-sm font-medium text-gray-700 mb-1">نقش‌ها:</label>
                <select
                  id="roleIds"
                  name="roleIds"
                  multiple
                  value={formData.roleIds}
                  onChange={handleRoleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-32"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nameFa}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">برای انتخاب چندگانه، Ctrl (یا Cmd) را نگه دارید و کلیک کنید.</p>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید (اختیاری):</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="رمز عبور جدید (خالی بگذارید تا تغییر نکند)"
                />
                <p className="mt-1 text-xs text-gray-500">اگر می‌خواهید رمز عبور را تغییر دهید، رمز جدید را وارد کنید.</p>
              </div>
            </div>

            {/* بخش وضعیت‌ها */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">وضعیت کاربر</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="mr-2 block text-sm font-medium text-gray-700">
                    کاربر فعال است
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEmailVerified"
                    name="isEmailVerified"
                    checked={formData.isEmailVerified}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isEmailVerified" className="mr-2 block text-sm font-medium text-gray-700">
                    ایمیل تأیید شده
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMobileVerified"
                    name="isMobileVerified"
                    checked={formData.isMobileVerified}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isMobileVerified" className="mr-2 block text-sm font-medium text-gray-700">
                    موبایل تأیید شده
                  </label>
                </div>
              </div>
            </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/user-management/users")}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  بازگشت
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserPage;