'use client';

import { FormField, inputClass, textareaClass } from './dashboard/DashboardUi';
import { ProfileFormGroup, ProfilePanelRow } from './dashboard/ProfileViewUi';
import {
  MERCHANT_ACTIVITY_TYPE_OPTIONS,
  MERCHANT_DELIVERY_RADIUS_OPTIONS,
  MERCHANT_ACCOUNT_TYPE_OPTIONS,
  formatMerchantActivityTypesSummary,
  getMerchantDeliveryRadiusLabel,
} from '../../utils/merchantProfileUtils';

export function MerchantIdentityEditor({
  sectionId,
  accountType,
  storeName,
  storeSlug,
  description,
  logo,
  companyName,
  companyLogo,
  registrationNumber,
  companyNationalId,
  nationalId,
  onChange,
}) {
  const isBusiness = accountType === 'business';

  return (
    <ProfileFormGroup
      id={sectionId}
      title="مشخصات کاسب"
      description="نام فروشگاه، نوع حساب و معرفی کسب‌وکار"
    >
      <div className="space-y-4">
        <FormField label="نوع حساب">
          <div className="flex flex-wrap gap-2">
            {MERCHANT_ACCOUNT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ accountType: opt.value })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ring-inset ${
                  accountType === opt.value
                    ? 'bg-amber-600 text-white ring-amber-600'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-amber-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="نام فروشگاه">
          <input
            type="text"
            value={storeName}
            onChange={(e) => onChange({ storeName: e.target.value })}
            className={inputClass}
            placeholder="نام نمایشی روی نقشه و جستجو"
          />
        </FormField>

        <FormField label="آدرس صفحه (لاتین)">
          <div className="relative">
            <span
              className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-sm text-gray-400"
              dir="ltr"
              aria-hidden
            >
              /
            </span>
            <input
              type="text"
              value={storeSlug}
              onChange={(e) => onChange({ storeSlug: e.target.value })}
              className={`${inputClass} ps-7`}
              dir="ltr"
              placeholder="pourdian-mobile"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            فقط حروف انگلیسی، عدد، خط‌تیره — مثلاً{' '}
            <span className="font-mono text-amber-700" dir="ltr">
              /pourdian-mobile
            </span>
          </p>
        </FormField>

        <FormField label="معرفی فروشگاه">
          <textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={textareaClass}
            rows={4}
            placeholder="چه کالاهایی می‌فروشید؟"
          />
        </FormField>

        {isBusiness ? (
          <>
            <FormField label="نام شرکت (اختیاری)">
              <input
                type="text"
                value={companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                className={inputClass}
                placeholder="اگر شرکت ثبت‌شده دارید؛ در غیر این صورت همان نام فروشگاه کافی است"
              />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="شناسه ملی شرکت">
                <input
                  type="text"
                  value={companyNationalId}
                  onChange={(e) => onChange({ companyNationalId: e.target.value })}
                  className={inputClass}
                  dir="ltr"
                />
              </FormField>
              <FormField label="شماره ثبت">
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => onChange({ registrationNumber: e.target.value })}
                  className={inputClass}
                  dir="ltr"
                />
              </FormField>
            </div>
          </>
        ) : (
          <FormField label="کد ملی">
            <input
              type="text"
              value={nationalId}
              onChange={(e) => onChange({ nationalId: e.target.value })}
              className={inputClass}
              dir="ltr"
              maxLength={10}
            />
          </FormField>
        )}
      </div>
    </ProfileFormGroup>
  );
}

export function MerchantIdentityDisplay({ profile }) {
  return (
    <ProfileFormGroup title="مشخصات کاسب">
      <ProfilePanelRow label="نام فروشگاه" value={profile?.storeName} />
      <ProfilePanelRow
        label="آدرس صفحه"
        value={profile?.storeSlug ? `/${profile.storeSlug}` : '—'}
      />
      <ProfilePanelRow label="معرفی" value={profile?.description} />
      <ProfilePanelRow
        label="نوع حساب"
        value={
          profile?.accountType === 'business' ? 'شرکت / شخص حقوقی' : 'مغازه / شخص حقیقی'
        }
      />
      {profile?.accountType === 'business' ? (
        <ProfilePanelRow label="نام شرکت" value={profile?.companyName} />
      ) : null}
    </ProfileFormGroup>
  );
}

export function MerchantServiceEditor({
  sectionId,
  cities,
  activeCityIds,
  deliveryRadius,
  activityTypes,
  onToggleCity,
  onRadiusChange,
  onActivityTypesChange,
}) {
  const toggleActivity = (key) => {
    onActivityTypesChange({ ...activityTypes, [key]: !activityTypes?.[key] });
  };

  return (
    <ProfileFormGroup
      id={sectionId}
      title="پوشش و ارائه"
      description="روش‌های فروش، شهرهای فعالیت و محدوده ارسال"
    >
      <div className="space-y-5">
        <FormField label="روش‌های فروش">
          <div className="space-y-2">
            {MERCHANT_ACTIVITY_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.key}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 has-[:checked]:border-amber-300 has-[:checked]:bg-amber-50/50"
              >
                <input
                  type="checkbox"
                  checked={Boolean(activityTypes?.[opt.key])}
                  onChange={() => toggleActivity(opt.key)}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="شهرهای فعالیت">
          <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2.5">
            {cities.map((city) => {
              const active = activeCityIds.map(Number).includes(Number(city.id));
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => onToggleCity(city.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-amber-200'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="محدوده ارسال">
          <select
            value={deliveryRadius || ''}
            onChange={(e) => onRadiusChange(e.target.value)}
            className={inputClass}
          >
            {MERCHANT_DELIVERY_RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'none'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </ProfileFormGroup>
  );
}

export function MerchantServiceDisplay({ profile, cities = [] }) {
  const activeCityNames = (profile?.activeCityIds || [])
    .map((id) => cities.find((c) => Number(c.id) === Number(id))?.name)
    .filter(Boolean)
    .join('، ');

  return (
    <ProfileFormGroup title="پوشش و ارائه">
      <ProfilePanelRow
        label="روش‌های فروش"
        value={formatMerchantActivityTypesSummary(profile?.activityTypes)}
      />
      <ProfilePanelRow label="شهرهای فعالیت" value={activeCityNames || '—'} />
      <ProfilePanelRow
        label="محدوده ارسال"
        value={getMerchantDeliveryRadiusLabel(profile?.deliveryRadius)}
      />
    </ProfileFormGroup>
  );
}

export function MerchantIntroEditor({ sectionId, experience, onChange }) {
  return (
    <ProfileFormGroup
      id={sectionId}
      title="سابقه کاری"
      description="سابقه فروشندگی و تجربه کسب‌وکار"
    >
      <FormField label="سابقه فروشندگی">
        <input
          type="text"
          value={experience}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass.replace('focus:border-teal-500 focus:ring-teal-500/20', 'focus:border-amber-500 focus:ring-amber-500/20')}
          placeholder="مثلاً ۸ سال فروش لوازم خانگی"
        />
      </FormField>
    </ProfileFormGroup>
  );
}

export function MerchantIntroDisplay({ experience }) {
  return (
    <ProfileFormGroup title="سابقه کاری">
      <ProfilePanelRow label="سابقه فروشندگی" value={experience} />
    </ProfileFormGroup>
  );
}

export {
  ExpertPortfolioEditor as MerchantPortfolioEditor,
  ExpertPortfolioDisplay as MerchantPortfolioDisplay,
  ExpertContactNumbersEditor as MerchantContactNumbersEditor,
  ExpertContactNumbersDisplay as MerchantContactNumbersDisplay,
  ExpertPresenceEditor as MerchantPresenceEditor,
  ExpertPresenceDisplay as MerchantPresenceDisplay,
  ExpertWorkScheduleEditor as MerchantWorkScheduleEditor,
} from './ExpertProfileSections';
