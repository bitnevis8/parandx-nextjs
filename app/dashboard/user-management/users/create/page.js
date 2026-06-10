'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../../config/api';
import RoleCheckboxGroup from '../../../../components/user-management/RoleCheckboxGroup';
import { FETCH_OPTS, fetchRoles } from '../../../../components/user-management/userManagementUtils';
import {
  UserMgmtPageHeader,
  UserMgmtAlert,
  UserMgmtCard,
} from '../../../../components/user-management/UserMgmtShell';
import {
  FormField,
  formActionsClass,
  ghostBtnClass,
  inputClass,
  submitBtnClass,
} from '../../../../components/ui/dashboard/DashboardUi';

export default function CreateUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    phone: '',
    username: '',
    password: '',
    gender: '',
    roleIds: [],
  });

  useEffect(() => {
    fetchRoles().then(setRoles).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.mobile.trim()) {
      setError('شماره موبایل الزامی است.');
      setLoading(false);
      return;
    }
    if (!formData.email.trim() && !formData.mobile.trim()) {
      setError('حداقل موبایل یا ایمیل لازم است.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        email: formData.email.trim() || null,
        mobile: formData.mobile.trim(),
        phone: formData.phone.trim() || null,
        username: formData.username.trim() || null,
      };

      const response = await fetch(API_ENDPOINTS.users.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...FETCH_OPTS,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'خطا در ایجاد کاربر');
      }
      router.push(`/dashboard/user-management/users/${data.data.id}/view`);
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <UserMgmtPageHeader
            title="افزودن کاربر"
            description="موبایل برای ورود الزامی است. ایمیل اختیاری — مطابق کاربران سید (فقط ادمین اصلی ایمیل دارد)."
          />

          {error ? <UserMgmtAlert>{error}</UserMgmtAlert> : null}

          <form onSubmit={handleSubmit}>
            <UserMgmtCard title="اطلاعات پایه" className="mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="نام" required>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required className={inputClass} />
                </FormField>
                <FormField label="نام خانوادگی" required>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required className={inputClass} />
                </FormField>
                <FormField label="موبایل" required>
                  <input
                    name="mobile"
                    type="tel"
                    dir="ltr"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className={`${inputClass} text-left`}
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
                  />
                </FormField>
                <FormField label="نام کاربری">
                  <input name="username" value={formData.username} onChange={handleChange} className={inputClass} />
                </FormField>
                <FormField label="رمز عبور" required>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="جنسیت">
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option value="">—</option>
                    <option value="male">آقا</option>
                    <option value="female">خانم</option>
                  </select>
                </FormField>
              </div>
            </UserMgmtCard>

            <UserMgmtCard title="نقش‌ها" className="mb-6">
              <RoleCheckboxGroup
                roles={roles}
                value={formData.roleIds}
                onChange={(roleIds) => setFormData((p) => ({ ...p, roleIds }))}
              />
            </UserMgmtCard>

            <div className={formActionsClass}>
              <button type="button" className={ghostBtnClass} onClick={() => router.back()}>
                انصراف
              </button>
              <button type="submit" disabled={loading} className={submitBtnClass}>
                {loading ? 'در حال ثبت...' : 'ایجاد کاربر'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
