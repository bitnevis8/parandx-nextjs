'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../config/api';
import {
  FETCH_OPTS,
  buildUsersListUrl,
  formatMobile,
  formatUserEmail,
  hasRole,
  normalizeUsersListResponse,
  userFullName,
  getRoleBadgeClass,
  expertDashboardUrl,
  personalDashboardUrl,
} from '../../../components/user-management/userManagementUtils';
import {
  UserMgmtPageHeader,
  UserMgmtAlert,
} from '../../../components/user-management/UserMgmtShell';
import {
  DashboardLoading,
  ghostBtnClass,
  primaryBtnClass,
  inputClass,
} from '../../../components/ui/dashboard/DashboardUi';

function VerificationDots({ user }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
          user.isMobileVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        موبایل {user.isMobileVerified ? '✓' : '—'}
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
          user.email
            ? user.isEmailVerified
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        ایمیل {user.email ? (user.isEmailVerified ? '✓' : '؟') : 'ندارد'}
      </span>
    </div>
  );
}

function UserRowActions({ user, onDelete }) {
  const isExpert = hasRole(user, 'expert');

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/dashboard/user-management/users/${user.id}/view`}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        مشاهده
      </Link>
      <Link
        href={personalDashboardUrl('profile-edit', user.id)}
        className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-100"
      >
        پروفایل شخصی
      </Link>
      {isExpert ? (
        <Link
          href={expertDashboardUrl('expert-edit', user.id)}
          className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100"
        >
          پروفایل متخصص
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => onDelete(user.id)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
      >
        حذف
      </button>
    </div>
  );
}

function UsersListContent() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchUsers = useCallback(async (query = '', sort = sortBy, order = sortOrder) => {
    setLoading(true);
    setError(null);
    try {
      const url = buildUsersListUrl({ q: query, sortBy: sort, sortOrder: order });
      const response = await fetch(url, FETCH_OPTS);
      const data = await response.json();
      setUsers(normalizeUsersListResponse(data));
      if (!data.success) {
        throw new Error(data.message || 'خطا در دریافت لیست کاربران');
      }
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers(appliedQuery, sortBy, sortOrder);
  }, [fetchUsers, appliedQuery, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const experts = users.filter((u) => hasRole(u, 'expert')).length;
    const noEmail = users.filter((u) => !u.email).length;
    return { total: users.length, experts, noEmail };
  }, [users]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setAppliedQuery(searchTerm.trim());
  };

  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newOrder);
  };

  const handleDelete = async (userId) => {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟ این عمل قابل بازگشت نیست.')) return;
    try {
      const response = await fetch(API_ENDPOINTS.users.delete(userId), {
        method: 'DELETE',
        ...FETCH_OPTS,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'خطا در حذف کاربر');
      fetchUsers(appliedQuery, sortBy, sortOrder);
    } catch (err) {
      alert(err.message || 'خطا در حذف');
    }
  };

  const sortIcon = (col) => (sortBy === col ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <UserMgmtPageHeader
          title="مدیریت کاربران"
          description="جستجو، مشاهده و ویرایش حساب‌ها. ورود اکثر کاربران فقط با موبایل است؛ ایمیل اختیاری است."
          backHref="/dashboard"
          backLabel="بازگشت به داشبورد"
          actions={
            <button type="button" className={primaryBtnClass} onClick={() => router.push('/dashboard/user-management/users/create')}>
              + کاربر جدید
            </button>
          }
        />

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">کل کاربران</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 shadow-sm">
            <p className="text-xs text-teal-700">متخصص</p>
            <p className="mt-1 text-2xl font-bold text-teal-900">{stats.experts}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-1">
            <p className="text-xs text-gray-500">بدون ایمیل</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.noEmail}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="نام، موبایل، ایمیل، نام کاربری..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputClass} flex-1`}
          />
          <div className="flex gap-2">
            <button type="submit" className={primaryBtnClass}>
              جستجو
            </button>
            {appliedQuery ? (
              <button
                type="button"
                className={ghostBtnClass}
                onClick={() => {
                  setSearchTerm('');
                  setAppliedQuery('');
                }}
              >
                پاک کردن
              </button>
            ) : null}
          </div>
        </form>

        {error ? <UserMgmtAlert>{error}</UserMgmtAlert> : null}

        {loading ? (
          <DashboardLoading />
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-gray-600">کاربری یافت نشد.</p>
            <button type="button" className={`${primaryBtnClass} mt-4`} onClick={() => router.push('/dashboard/user-management/users/create')}>
              افزودن اولین کاربر
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="cursor-pointer px-4 py-3 text-right font-medium text-gray-600" onClick={() => handleSort('firstName')}>
                      کاربر{sortIcon('firstName')}
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">موبایل</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">ایمیل</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">نقش‌ها</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">وضعیت</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const emailInfo = formatUserEmail(user.email);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{userFullName(user)}</p>
                          <p className="text-xs text-gray-500">@{user.username || '—'}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-800" dir="ltr">
                          {formatMobile(user.mobile)}
                        </td>
                        <td className={`px-4 py-3 text-xs ${emailInfo.muted ? 'text-gray-400' : 'text-gray-800'}`}>
                          {emailInfo.text}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.userRoles?.map((role) => (
                              <span
                                key={role.id}
                                className={`rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${getRoleBadgeClass(role.name)}`}
                              >
                                {role.nameFa || role.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <VerificationDots user={user} />
                        </td>
                        <td className="px-4 py-3">
                          <UserRowActions user={user} onDelete={handleDelete} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {users.map((user) => {
                const emailInfo = formatUserEmail(user.email);
                return (
                  <article key={user.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{userFullName(user)}</h3>
                        <p className="font-mono text-xs text-gray-600" dir="ltr">
                          {formatMobile(user.mobile)}
                        </p>
                        <p className={`mt-1 text-xs ${emailInfo.muted ? 'text-gray-400' : 'text-gray-600'}`}>
                          {emailInfo.text}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {user.userRoles?.map((role) => (
                        <span
                          key={role.id}
                          className={`rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${getRoleBadgeClass(role.name)}`}
                        >
                          {role.nameFa || role.name}
                        </span>
                      ))}
                    </div>
                    <UserRowActions user={user} onDelete={handleDelete} />
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <UsersListContent />
    </ProtectedRoute>
  );
}
