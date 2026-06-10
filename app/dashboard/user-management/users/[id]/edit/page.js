'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../../../config/api';
import RoleCheckboxGroup from '../../../../../components/user-management/RoleCheckboxGroup';
import {
  FETCH_OPTS,
  expertDashboardUrl,
  personalDashboardUrl,
  fetchRoles,
  fetchUserById,
  hasRole,
  userFullName,
} from '../../../../../components/user-management/userManagementUtils';
import {
  UserMgmtPageHeader,
  UserMgmtAlert,
  UserMgmtCard,
} from '../../../../../components/user-management/UserMgmtShell';
import {
  DashboardLoading,
  FormField,
  formActionsClass,
  ghostBtnClass,
  inputClass,
  submitBtnClass,
} from '../../../../../components/ui/dashboard/DashboardUi';

const emptyForm = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  mobile: '',
  phone: '',
  gender: '',
  password: '',
  roleIds: [],
  isActive: true,
  isEmailVerified: false,
  isMobileVerified: false,
};

function UserEditContent({ id }) {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [userName, setUserName] = useState('');
  const [isExpertUser, setIsExpertUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [userData, rolesList] = await Promise.all([fetchUserById(id), fetchRoles()]);
        if (cancelled) return;
        setRoles(rolesList);
        setUserName(userFullName(userData));
        setIsExpertUser(hasRole(userData, 'expert'));
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          phone: userData.phone || '',
          gender: userData.gender || '',
          password: '',
          roleIds: userData.userRoles?.map((r) => r.id) || [],
          isActive: userData.isActive !== false,
          isEmailVerified: !!userData.isEmailVerified,
          isMobileVerified: !!userData.isMobileVerified,
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!formData.mobile?.trim()) {
      setError('شماره موبایل الزامی است.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim() || null,
        email: formData.email.trim() || null,
        mobile: formData.mobile.trim(),
        phone: formData.phone.trim() || null,
        gender: formData.gender || null,
        roleIds: formData.roleIds,
        isActive: formData.isActive,
        isEmailVerified: formData.email.trim() ? formData.isEmailVerified : false,
        isMobileVerified: formData.isMobileVerified,
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await fetch(API_ENDPOINTS.users.update(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'خطا در ذخیره');
      }
      setSuccess('تغییرات با موفقیت ذخیره شد.');
      setTimeout(() => {
        router.push(`/dashboard/user-management/users/${id}/view`);
      }, 800);
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <UserMgmtPageHeader
          title={`ویرایش: ${userName}`}
          description="اطلاعات حساب کاربری. پروفایل تخصصی متخصص در بخش جداگانه ویرایش می‌شود."
          backHref={`/dashboard/user-management/users/${id}/view`}
          backLabel="مشاهده پروفایل"
        />

        {error ? <UserMgmtAlert onDismiss={() => setError(null)}>{error}</UserMgmtAlert> : null}
        {success ? <UserMgmtAlert type="success">{success}</UserMgmtAlert> : null}

        <UserMgmtCard className="mb-6 border-sky-100 bg-sky-50/50">
          <p className="text-sm text-sky-900">
            برای نام، موبایل، آدرس‌ها و کد ملی از <strong>پروفایل شخصی</strong> در داشبورد استفاده کنید
            (همان تجربهٔ پروفایل خودتان، با دادهٔ این کاربر).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={personalDashboardUrl('profile-display', id)}
              className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800"
            >
              مشاهده پروفایل شخصی
            </Link>
            <Link
              href={personalDashboardUrl('profile-edit', id)}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              ویرایش پروفایل شخصی
            </Link>
          </div>
        </UserMgmtCard>

        {isExpertUser ? (
          <UserMgmtCard className="mb-6 border-violet-100 bg-violet-50/40">
            <p className="text-sm text-violet-900">
              این کاربر <strong>متخصص</strong> است. برای بیو، تخصص‌ها، قیمت و مدارک از پنل پروفایل تخصصی استفاده کنید.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={expertDashboardUrl('expert-edit', id)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                ویرایش پروفایل متخصص
              </Link>
              <Link
                href={expertDashboardUrl('expert-edit', id, 'expert-specializations')}
                className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-800"
              >
                مدیریت تخصص‌ها
              </Link>
            </div>
          </UserMgmtCard>
        ) : null}

        <form onSubmit={handleSubmit}>
          <UserMgmtCard title="اطلاعات شخصی" className="mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="نام" required>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </FormField>
              <FormField label="نام خانوادگی" required>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </FormField>
              <FormField label="نام کاربری">
                <input name="username" value={formData.username} onChange={handleChange} className={inputClass} />
              </FormField>
              <FormField label="جنسیت">
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="">مشخص نشده</option>
                  <option value="male">آقا</option>
                  <option value="female">خانم</option>
                </select>
              </FormField>
            </div>
          </UserMgmtCard>

          <UserMgmtCard title="تماس و ورود" className="mb-6">
            <p className="mb-4 text-sm text-gray-600">
              موبایل برای ورود با OTP الزامی است. ایمیل اختیاری است — خالی بگذارید اگر کاربر فقط با موبایل وارد می‌شود.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="موبایل" required>
                <input
                  name="mobile"
                  type="tel"
                  dir="ltr"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className={`${inputClass} text-left`}
                  placeholder="09xxxxxxxxx"
                />
              </FormField>
              <FormField label="ایمیل (اختیاری)">
                <input
                  name="email"
                  type="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass} text-left`}
                  placeholder="خالی = بدون ایمیل"
                />
              </FormField>
              <FormField label="تلفن ثابت">
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClass} />
              </FormField>
              <FormField label="رمز عبور جدید (اختیاری)">
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="برای تغییر وارد کنید"
                  autoComplete="new-password"
                />
              </FormField>
            </div>
          </UserMgmtCard>

          <UserMgmtCard title="نقش‌ها" className="mb-6">
            <RoleCheckboxGroup
              roles={roles}
              value={formData.roleIds}
              onChange={(roleIds) => setFormData((p) => ({ ...p, roleIds }))}
            />
            <p className="mt-3 text-xs text-gray-500">
              برای نقش متخصص، حداقل یک تخصص در پروفایل متخصص لازم است.
            </p>
          </UserMgmtCard>

          <UserMgmtCard title="وضعیت حساب" className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-teal-600"
                />
                حساب فعال
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="isMobileVerified"
                  checked={formData.isMobileVerified}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-teal-600"
                />
                موبایل تأیید شده
              </label>
              <label
                className={`inline-flex items-center gap-2 text-sm ${
                  formData.email.trim() ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  name="isEmailVerified"
                  checked={formData.isEmailVerified}
                  onChange={handleChange}
                  disabled={!formData.email.trim()}
                  className="rounded border-gray-300 text-teal-600"
                />
                ایمیل تأیید شده
              </label>
            </div>
          </UserMgmtCard>

          <div className={formActionsClass}>
            <button type="button" className={ghostBtnClass} onClick={() => router.push(`/dashboard/user-management/users/${id}/view`)}>
              انصراف
            </button>
            <button type="submit" disabled={submitting} className={submitBtnClass}>
              {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditUserPage({ params }) {
  const { id } = use(params);
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <UserEditContent id={id} />
    </ProtectedRoute>
  );
}
