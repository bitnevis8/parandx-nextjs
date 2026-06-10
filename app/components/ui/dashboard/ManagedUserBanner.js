'use client';

import Link from 'next/link';

export function ManagedUserBanner({ user, targetUserId }) {
  if (!user || !targetUserId) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || `کاربر #${targetUserId}`;

  return (
    <div className="mx-3 mb-4 mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:mx-6">
      <p className="font-medium">
        در حال مدیریت پروفایل: <span className="text-amber-900">{fullName}</span>
        {user.mobile ? (
          <span className="mr-2 font-mono text-xs text-amber-800" dir="ltr">
            ({user.mobile})
          </span>
        ) : null}
      </p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <Link
          href={`/dashboard/user-management/users/${targetUserId}/view`}
          className="font-medium text-teal-700 hover:text-teal-800"
        >
          بازگشت به مدیریت کاربر
        </Link>
        <Link
          href="/dashboard/user-management/users"
          className="text-gray-600 hover:text-gray-800"
        >
          لیست کاربران
        </Link>
      </div>
    </div>
  );
}
