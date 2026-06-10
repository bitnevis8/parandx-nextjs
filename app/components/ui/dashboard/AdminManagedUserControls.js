'use client';

import { EXPERT_STATUS_LABELS } from '../../../utils/profileAddressUtils';
import { FormField, inputClass } from './DashboardUi';
import { ProfileFormGroup } from './ProfileViewUi';

const EXPERT_STATUS_OPTIONS = Object.keys(EXPERT_STATUS_LABELS);

const checkboxClass = 'rounded border-gray-300 text-teal-600 focus:ring-teal-500';

/**
 * کنترل‌های مخصوص مدیر هنگام ویرایش پروفایل کاربر دیگر
 */
export function AdminManagedUserControls({
  email = '',
  isMobileVerified = false,
  isEmailVerified = false,
  isActive = true,
  expertStatus,
  showExpertStatus = false,
  onChange,
}) {
  const patch = (fields) => onChange?.(fields);
  const hasEmail = Boolean(String(email || '').trim());

  return (
    <ProfileFormGroup
      title="مدیریت حساب (ادمین)"
      description="تأیید دستی موبایل و ایمیل، وضعیت حساب و در صورت متخصص بودن، وضعیت پروفایل تخصصی"
    >
      <div className="space-y-4 rounded-xl border border-amber-100/90 bg-gradient-to-bl from-amber-50/50 to-white p-4">
        <p className="text-xs font-semibold text-amber-900">دسترسی مدیر</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={!!isMobileVerified}
              onChange={(e) => patch({ isMobileVerified: e.target.checked })}
              className={checkboxClass}
            />
            موبایل تأیید شده
          </label>
          <label
            className={`inline-flex items-center gap-2 text-sm ${
              hasEmail ? 'text-gray-800' : 'text-gray-400'
            }`}
          >
            <input
              type="checkbox"
              checked={!!isEmailVerified}
              disabled={!hasEmail}
              onChange={(e) => patch({ isEmailVerified: e.target.checked })}
              className={checkboxClass}
            />
            ایمیل تأیید شده
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={!!isActive}
              onChange={(e) => patch({ isActive: e.target.checked })}
              className={checkboxClass}
            />
            حساب فعال
          </label>
        </div>

        {!hasEmail ? (
          <p className="text-xs text-gray-500">برای تأیید ایمیل، ابتدا آدرس ایمیل را در فرم بالا ثبت کنید.</p>
        ) : null}

        {showExpertStatus ? (
          <FormField label="وضعیت پروفایل متخصص">
            <select
              value={expertStatus || 'pending'}
              onChange={(e) => patch({ expertStatus: e.target.value })}
              className={inputClass}
            >
              {EXPERT_STATUS_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {EXPERT_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </FormField>
        ) : null}
      </div>
    </ProfileFormGroup>
  );
}
