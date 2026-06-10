'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import UserAvatar from '../../../../../components/ui/UserAvatar';
import { DashboardLoading } from '../../../../../components/ui/dashboard/DashboardUi';
import {
  expertDashboardUrl,
  personalDashboardUrl,
  fetchExpertByUserId,
  fetchUserById,
  formatMobile,
  formatUserEmail,
  hasRole,
  userFullName,
  getRoleBadgeClass,
} from '../../../../../components/user-management/userManagementUtils';
import {
  UserMgmtPageHeader,
  UserMgmtAlert,
  UserMgmtCard,
  InfoRow,
} from '../../../../../components/user-management/UserMgmtShell';

function ExpertStatusBadge({ status }) {
  const map = {
    approved: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-200 text-gray-700',
  };
  const labels = {
    approved: 'تأیید شده',
    pending: 'در انتظار',
    rejected: 'رد شده',
    suspended: 'تعلیق',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || map.pending}`}>
      {labels[status] || status}
    </span>
  );
}

function UserViewContent({ id }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await fetchUserById(id);
        if (cancelled) return;
        setUser(userData);
        if (hasRole(userData, 'expert')) {
          const exp = await fetchExpertByUserId(id);
          if (!cancelled) setExpert(exp);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'خطا در بارگذاری');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <DashboardLoading />;
  if (error) {
    return (
      <div className="p-6">
        <UserMgmtAlert>{error}</UserMgmtAlert>
        <button type="button" onClick={() => router.back()} className="mt-4 text-sm text-teal-700">
          بازگشت
        </button>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        کاربر یافت نشد.
        <Link href="/dashboard/user-management/users" className="mt-4 block text-teal-700">
          لیست کاربران
        </Link>
      </div>
    );
  }

  const emailInfo = formatUserEmail(user.email);
  const isExpert = hasRole(user, 'expert');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <UserMgmtPageHeader
          title={userFullName(user)}
          description={`شناسه #${user.id} · ${user.username ? `@${user.username}` : 'بدون نام کاربری'}`}
          actions={
            <>
              <Link
                href={personalDashboardUrl('profile-display', user.id)}
                className="inline-flex items-center rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-800 hover:bg-teal-100"
              >
                پروفایل شخصی
              </Link>
              <Link
                href={personalDashboardUrl('profile-edit', user.id)}
                className="inline-flex items-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
              >
                ویرایش پروفایل شخصی
              </Link>
              {isExpert ? (
                <Link
                  href={expertDashboardUrl('expert-edit', user.id)}
                  className="inline-flex items-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-800 hover:bg-violet-100"
                >
                  پروفایل متخصص
                </Link>
              ) : null}
            </>
          }
        />

        <UserMgmtCard className="mb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <UserAvatar user={user} size="sm" className="rounded-2xl border-2 border-gray-100" />
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                {user.userRoles?.map((role) => (
                  <span
                    key={role.id}
                    className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${getRoleBadgeClass(role.name)}`}
                  >
                    {role.nameFa || role.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'حساب فعال' : 'غیرفعال'}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    user.isMobileVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  موبایل {user.isMobileVerified ? 'تأیید شده' : 'تأیید نشده'}
                </span>
                {user.email ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.isEmailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    ایمیل {user.isEmailVerified ? 'تأیید شده' : 'تأیید نشده'}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </UserMgmtCard>

        <UserMgmtCard title="اطلاعات تماس و ورود" className="mb-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="موبایل (شناسه ورود)" value={formatMobile(user.mobile)} />
            <InfoRow label="ایمیل">
              <span className={emailInfo.muted ? 'text-gray-400' : ''}>{emailInfo.text}</span>
            </InfoRow>
            <InfoRow label="نام کاربری" value={user.username || '—'} />
            <InfoRow label="تلفن ثابت" value={user.phone || '—'} />
            <InfoRow
              label="جنسیت"
              value={
                user.gender === 'male' ? 'آقا' : user.gender === 'female' ? 'خانم' : 'مشخص نشده'
              }
            />
            <InfoRow
              label="تاریخ عضویت"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '—'}
            />
          </dl>
        </UserMgmtCard>

        {user.nationalId ? (
          <UserMgmtCard title="احراز هویت" className="mb-6">
            <InfoRow label="کد ملی" value={user.nationalId} />
            <InfoRow label="وضعیت احراز" value={user.identityVerificationStatus || 'none'} />
          </UserMgmtCard>
        ) : null}

        {expert ? (
          <UserMgmtCard title="پروفایل متخصص" className="mb-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <ExpertStatusBadge status={expert.status} />
              {expert.isShop ? (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">مغازه</span>
              ) : null}
              {expert.isMobile ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">اعزام</span>
              ) : null}
            </div>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow label="بیو" value={expert.bio || '—'} />
              <InfoRow label="تجربه" value={expert.experience || '—'} />
              <InfoRow label="محل کار" value={expert.location || '—'} />
            </dl>
            {expert.categories?.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">تخصص‌ها</p>
                <div className="flex flex-wrap gap-2">
                  {expert.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-800 ring-1 ring-violet-100"
                    >
                      {cat.icon ? <span>{cat.icon}</span> : null}
                      {cat.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-amber-700">هنوز تخصصی ثبت نشده است.</p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={expertDashboardUrl('expert-edit', user.id)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                ویرایش پروفایل تخصصی
              </Link>
              <Link
                href={expertDashboardUrl('expert-display', user.id)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                مشاهده عمومی
              </Link>
            </div>
          </UserMgmtCard>
        ) : isExpert ? (
          <UserMgmtAlert type="info">
            نقش متخصص دارد ولی پروفایل تخصصی هنوز ساخته نشده.
            <Link href={expertDashboardUrl('expert-edit', user.id)} className="mr-2 font-medium underline">
              ایجاد پروفایل
            </Link>
          </UserMgmtAlert>
        ) : null}
      </div>
    </div>
  );
}

export default function UserViewPage({ params }) {
  const { id } = use(params);
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <UserViewContent id={id} />
    </ProtectedRoute>
  );
}
