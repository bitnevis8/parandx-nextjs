'use client';

import {
  BuildingOffice2Icon,
  ClockIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  PhotoIcon,
  PlusIcon,
  SignalIcon,
  TrashIcon,
  UserCircleIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import {
  ACTIVITY_TYPE_OPTIONS,
  EXPERT_ACCOUNT_TYPE_OPTIONS,
  MAX_CONTACT_MOBILES,
  MAX_CONTACT_PHONES,
  MAX_PORTFOLIO_ITEMS,
  PRESENCE_STATUS_OPTIONS,
  SERVICE_RADIUS_OPTIONS,
  WEEK_DAYS,
  createContactEntry,
  defaultPortfolioItem,
  formatActivityTypesSummary,
  formatWorkScheduleSummary,
  getAccountTypeLabel,
  getExpertPublicName,
  getPresenceStatusLabel,
  getServiceRadiusLabel,
  normalizeContactMobiles,
  normalizeContactPhones,
  normalizePortfolio,
  normalizeWorkSchedule,
  PERSONAL_MOBILE_CONTACT_ID,
  normalizeSocialLinks,
} from '../../utils/expertProfileUtils';
import { FormField, inputClass, textareaClass } from './dashboard/DashboardUi';
import { ProfileFormGroup, ProfilePanel, ProfilePanelGroup, ProfilePanelRow } from './dashboard/ProfileViewUi';
import {
  AvatarChangeButton,
  UploadPlaceholderButton,
  uploadPlaceholderMessage,
} from './ProfileVerificationUi';
import UserAvatar from './UserAvatar';
import {
  ContactChannelEditor,
  ContactNumberInline,
  ExpertSocialLinksEditor,
  ExpertSocialLinksRow,
} from './ContactChannelToggles';

function OptionPills({ options, value, onChange, ariaLabel }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ring-1 ring-inset ${
              active
                ? opt.activeClass || 'bg-teal-600 text-white ring-teal-600'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:text-teal-700 ring-transparent'
            }`}
          >
            {opt.dotClass ? (
              <span className={`h-2 w-2 shrink-0 rounded-full ${active ? 'bg-white/90' : opt.dotClass}`} aria-hidden />
            ) : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ActivityCheckboxes({ activityTypes, onChange }) {
  const toggle = (key) => {
    onChange({ ...activityTypes, [key]: !activityTypes[key] });
  };

  return (
    <div className="space-y-2" role="group" aria-label="نوع فعالیت">
      {ACTIVITY_TYPE_OPTIONS.map((opt) => (
        <label
          key={opt.key}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition hover:border-teal-200 has-[:checked]:border-teal-300 has-[:checked]:bg-teal-50/50"
        >
          <input
            type="checkbox"
            checked={Boolean(activityTypes?.[opt.key])}
            onChange={() => toggle(opt.key)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm font-medium text-gray-800">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function ExpertServiceAreaEditor({
  sectionId,
  cities,
  activeCityIds,
  serviceRadius,
  activityTypes,
  onToggleCity,
  onRadiusChange,
  onActivityTypesChange,
}) {
  return (
    <ProfileFormGroup
      id={sectionId}
      title="پوشش و نحوه ارائه خدمت"
      description="نحوه ارائه، شهرهای فعالیت و شعاع پوشش"
    >
      <div className="space-y-5">
        <FormField label="نحوه ارائه خدمت">
          <ActivityCheckboxes activityTypes={activityTypes} onChange={onActivityTypesChange} />
        </FormField>

        <FormField label="شهرهای فعالیت">
          <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2.5">
            {cities.length === 0 ? (
              <p className="px-2 py-4 text-sm text-gray-400">شهری یافت نشد</p>
            ) : (
              cities.map((city) => {
                const active = activeCityIds.map(Number).includes(Number(city.id));
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => onToggleCity(city.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-200'
                    }`}
                  >
                    {city.name}
                    {city.province ? (
                      <span className={`mr-1 text-[10px] ${active ? 'text-teal-100' : 'text-gray-400'}`}>
                        ({city.province})
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </FormField>

        <FormField label="حداکثر شعاع خدمت">
          <OptionPills
            ariaLabel="حداکثر شعاع خدمت"
            options={SERVICE_RADIUS_OPTIONS}
            value={serviceRadius}
            onChange={onRadiusChange}
          />
        </FormField>
      </div>
    </ProfileFormGroup>
  );
}

export function ExpertPresenceEditor({ sectionId, presenceStatus, onChange }) {
  return (
    <ProfileFormGroup
      id={sectionId}
      title="وضعیت حضور"
      description="وضعیت فعلی شما برای مشتریان نمایش داده می‌شود"
    >
      <OptionPills
        ariaLabel="وضعیت حضور"
        options={PRESENCE_STATUS_OPTIONS}
        value={presenceStatus}
        onChange={onChange}
      />
    </ProfileFormGroup>
  );
}

export function ExpertWorkScheduleEditor({ sectionId, workSchedule, onChange }) {
  const schedule = normalizeWorkSchedule(workSchedule);

  const updateDay = (key, patch) => {
    onChange({
      ...schedule,
      [key]: { ...schedule[key], ...patch },
    });
  };

  return (
    <ProfileFormGroup
      id={sectionId}
      title="ساعات کاری"
      description="روزها و بازهٔ زمانی فعالیت در هفته"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="hidden grid-cols-[1fr_4.5rem_5rem_5rem] gap-2 border-b border-gray-100 bg-gray-50/80 px-3 py-2 text-[11px] font-medium text-gray-500 sm:grid">
          <span>روز</span>
          <span className="text-center">فعال</span>
          <span>از</span>
          <span>تا</span>
        </div>
        <ul className="divide-y divide-gray-100">
          {WEEK_DAYS.map(({ key, label }) => {
            const day = schedule[key];
            return (
              <li
                key={key}
                className="grid grid-cols-1 gap-2 px-3 py-2.5 sm:grid-cols-[1fr_4.5rem_5rem_5rem] sm:items-center sm:gap-2"
              >
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <label className="flex items-center justify-start gap-2 sm:justify-center">
                  <input
                    type="checkbox"
                    checked={Boolean(day.enabled)}
                    onChange={(e) => updateDay(key, { enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs text-gray-500 sm:hidden">فعال</span>
                </label>
                <input
                  type="time"
                  value={day.start}
                  disabled={!day.enabled}
                  onChange={(e) => updateDay(key, { start: e.target.value })}
                  className={`${inputClass} !py-1.5 text-xs disabled:opacity-40`}
                />
                <input
                  type="time"
                  value={day.end}
                  disabled={!day.enabled}
                  onChange={(e) => updateDay(key, { end: e.target.value })}
                  className={`${inputClass} !py-1.5 text-xs disabled:opacity-40`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </ProfileFormGroup>
  );
}

export function ExpertPortfolioEditor({ sectionId, portfolio, onChange }) {
  const items = normalizePortfolio(portfolio);

  const updateItem = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  };

  const addItem = () => {
    if (items.length >= MAX_PORTFOLIO_ITEMS) return;
    onChange([...items, defaultPortfolioItem()]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <ProfileFormGroup
      id={sectionId}
      title="نمونه کارها"
      description={`حداکثر ${MAX_PORTFOLIO_ITEMS} نمونه — تصویر، ویدئو و لینک (آپلود به‌زودی)`}
    >
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-8 text-center text-sm text-gray-500">
            هنوز نمونه کاری اضافه نکرده‌اید
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gradient-to-bl from-gray-50/60 to-white p-3 sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-500">نمونه {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  حذف
                </button>
              </div>

              <FormField label="عنوان (اختیاری)" className="mb-3">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  className={inputClass}
                  placeholder="مثلاً نقاشی آشپزخانه"
                />
              </FormField>

              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <UploadPlaceholderButton
                  variant="tile"
                  label="عکس"
                  icon={PhotoIcon}
                  hint="به‌زودی"
                  onClick={uploadPlaceholderMessage}
                  className="!min-h-[6.5rem]"
                />
                <UploadPlaceholderButton
                  variant="tile"
                  label="ویدئو"
                  icon={VideoCameraIcon}
                  hint="به‌زودی"
                  onClick={uploadPlaceholderMessage}
                  className="!min-h-[6.5rem]"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <FormField label="لینک اینستاگرام">
                  <input
                    type="url"
                    value={item.instagramUrl}
                    onChange={(e) => updateItem(index, { instagramUrl: e.target.value })}
                    className={inputClass}
                    placeholder="https://instagram.com/..."
                    dir="ltr"
                  />
                </FormField>
                <FormField label="لینک وب‌سایت">
                  <input
                    type="url"
                    value={item.websiteUrl}
                    onChange={(e) => updateItem(index, { websiteUrl: e.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                    dir="ltr"
                  />
                </FormField>
              </div>
            </div>
          ))
        )}

        {items.length < MAX_PORTFOLIO_ITEMS ? (
          <button
            type="button"
            onClick={addItem}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-3 text-sm font-medium text-teal-800 transition hover:bg-teal-50"
          >
            <PhotoIcon className="h-4 w-4" aria-hidden />
            افزودن نمونه کار ({items.length}/{MAX_PORTFOLIO_ITEMS})
          </button>
        ) : null}
      </div>
    </ProfileFormGroup>
  );
}

function ContactNumberListEditor({
  title,
  hint,
  items,
  max,
  numberPlaceholder,
  labelPlaceholder,
  onChange,
  lockedIds = [],
  isLandline = false,
}) {
  const updateItem = (id, patch) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (items.length >= max) return;
    onChange([...items, createContactEntry()]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-gray-700">{title}</p>
        <span className="text-[11px] text-gray-400">
          {items.length}/{max}
        </span>
      </div>
      {hint ? <p className="text-[11px] text-gray-500">{hint}</p> : null}

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400">
          شماره‌ای ثبت نشده
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => {
            const locked = lockedIds.includes(item.id);
            return (
              <li
                key={item.id}
                className={`rounded-xl border p-2.5 ${
                  locked ? 'border-teal-100 bg-teal-50/30' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.2fr_auto]">
                  <FormField label={`عنوان ${index + 1} (اختیاری)`} className="!mb-0">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(item.id, { label: e.target.value })}
                      className={inputClass}
                      placeholder={labelPlaceholder}
                      readOnly={locked}
                    />
                  </FormField>
                  <FormField label="شماره" className="!mb-0">
                    <input
                      type="tel"
                      value={item.number}
                      onChange={(e) =>
                        updateItem(item.id, {
                          number: e.target.value.replace(/\D/g, '').slice(0, 11),
                        })
                      }
                      className={`${inputClass} ${locked ? 'bg-gray-50 text-gray-600' : ''}`}
                      placeholder={numberPlaceholder}
                      dir="ltr"
                      readOnly={locked}
                    />
                  </FormField>
                  <div className="flex items-end pb-0.5">
                    {locked ? (
                      <span className="inline-flex h-[42px] w-full items-center justify-center px-1 text-center text-[10px] leading-tight text-teal-700 sm:w-auto sm:min-w-[4.5rem]">
                        از پروفایل شخصی
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex h-[42px] w-full items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-10"
                        aria-label="حذف شماره"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <ContactChannelEditor
                  entry={item}
                  isLandline={isLandline}
                  onChange={(patch) => updateItem(item.id, patch)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {items.length < max ? (
        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-3 py-2.5 text-xs font-medium text-teal-800 transition hover:bg-teal-50"
        >
          <PlusIcon className="h-4 w-4" aria-hidden />
          افزودن {title}
        </button>
      ) : null}
    </div>
  );
}

export function ExpertContactNumbersEditor({
  sectionId,
  contactMobiles,
  contactPhones,
  socialLinks,
  onMobilesChange,
  onPhonesChange,
  onSocialLinksChange,
}) {
  return (
    <ProfileFormGroup
      id={sectionId}
      title="شماره‌های تماس تخصصی"
      description={`موبایل حداکثر ${MAX_CONTACT_MOBILES} · تلفن حداکثر ${MAX_CONTACT_PHONES} — برای هر شماره پیام‌رسان‌ها را با آیکن فعال کنید`}
    >
      <div className="space-y-6">
        <ContactNumberListEditor
          title="موبایل"
          hint="اولین شماره همان موبایل پروفایل شخصی است؛ در صفحه عمومی متخصص نمایش داده می‌شود"
          items={contactMobiles}
          max={MAX_CONTACT_MOBILES}
          numberPlaceholder="09xxxxxxxxx"
          labelPlaceholder="مثلاً پشتیبانی"
          onChange={onMobilesChange}
          lockedIds={[PERSONAL_MOBILE_CONTACT_ID]}
        />
        <ContactNumberListEditor
          title="تلفن ثابت"
          hint="شماره دفتر یا مرکز تماس"
          items={contactPhones}
          max={MAX_CONTACT_PHONES}
          numberPlaceholder="021xxxxxxx"
          labelPlaceholder="مثلاً دفتر مرکزی"
          onChange={onPhonesChange}
          isLandline
        />
        <ExpertSocialLinksEditor socialLinks={socialLinks} onChange={onSocialLinksChange} />
      </div>
    </ProfileFormGroup>
  );
}

export function ExpertContactNumbersDisplay({
  contactMobiles,
  contactPhones,
  socialLinks,
  linkable = false,
}) {
  const mobiles = normalizeContactMobiles(contactMobiles).filter((i) => i.number);
  const phones = normalizeContactPhones(contactPhones).filter((i) => i.number);
  const normalizedSocial = normalizeSocialLinks(socialLinks);
  const hasSocial = Object.values(normalizedSocial).some((x) => x?.enabled);

  if (!mobiles.length && !phones.length && !hasSocial) {
    return (
      <ProfilePanelGroup title="شماره‌های تماس">
        <ProfilePanelRow icon={PhoneIcon} label="تماس" value={null} emptyText="ثبت نشده" />
      </ProfilePanelGroup>
    );
  }

  return (
    <ProfilePanelGroup title="شماره‌های تماس">
      <div className="divide-y divide-slate-100">
        {mobiles.map((item, index) => (
          <div key={item.id || `m-${index}`} className="px-4 py-3.5 sm:px-5">
            <ContactNumberInline
              item={item}
              label={item.label || `موبایل ${index + 1}`}
              linkable={linkable}
              isLandline={false}
              showLabel
            />
          </div>
        ))}
        {phones.map((item, index) => (
          <div key={item.id || `p-${index}`} className="px-4 py-3.5 sm:px-5">
            <ContactNumberInline
              item={item}
              label={item.label || `تلفن ${index + 1}`}
              linkable={linkable}
              isLandline
              showLabel
            />
          </div>
        ))}
        {hasSocial ? (
          <div className="px-4 py-3.5 sm:px-5">
            <ExpertSocialLinksRow socialLinks={normalizedSocial} linkable={linkable} />
          </div>
        ) : null}
      </div>
    </ProfilePanelGroup>
  );
}

function AccountTypeRadios({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="نوع حساب">
      {EXPERT_ACCOUNT_TYPE_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              active
                ? 'border-teal-300 bg-teal-50/60 ring-1 ring-teal-200'
                : 'border-gray-200 bg-white hover:border-teal-200'
            }`}
          >
            <input
              type="radio"
              name="expertAccountType"
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm font-medium text-gray-900">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function ExpertAccountTypeEditor({
  sectionId,
  accountType,
  displayName,
  avatar,
  bio,
  nationalId,
  companyName,
  companyLogo,
  registrationNumber,
  companyNationalId,
  user,
  onChange,
}) {
  const isIndividual = accountType === 'individual';
  const isBusiness = accountType === 'business';

  const patch = (fields) => onChange(fields);

  return (
    <ProfileFormGroup
      id={sectionId}
      title="هویت حرفه‌ای"
      description="نوع حساب، نام نمایشی، معرفی و مدارک هویتی"
    >
      <div className="space-y-5">
        <FormField label="حقیقی یا حقوقی؟ *">
          <AccountTypeRadios
            value={accountType}
            onChange={(value) => patch({ accountType: value })}
          />
        </FormField>

        <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-xs leading-relaxed text-gray-500">
          نام ثبت‌شده در{' '}
          <span className="font-medium text-gray-700">پروفایل شخصی</span>:{' '}
          {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'}
        </div>

        {isIndividual ? (
          <div className="space-y-4 rounded-xl border border-teal-100/80 bg-gradient-to-bl from-teal-50/40 to-white p-4">
            <p className="text-xs font-semibold text-teal-900">شخص حقیقی</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <UserAvatar
                user={{ avatar, firstName: displayName || user?.firstName, lastName: user?.lastName }}
                size="sm"
                className="h-16 w-16 shrink-0 rounded-full ring-2 ring-teal-100"
              />
              <AvatarChangeButton onClick={uploadPlaceholderMessage} />
            </div>
            <FormField label="نام نمایشی">
              <input
                type="text"
                value={displayName}
                onChange={(e) => patch({ displayName: e.target.value })}
                className={inputClass}
                placeholder="نام و نام خانوادگی"
              />
            </FormField>
            <FormField label="بیوگرافی">
              <textarea
                value={bio}
                onChange={(e) => patch({ bio: e.target.value })}
                rows={3}
                className={`${textareaClass} min-h-[5rem]`}
                placeholder="مثلاً نقاش ساختمان · ۱۰ سال سابقه"
              />
            </FormField>
            <FormField label="کد ملی">
              <input
                type="text"
                value={nationalId}
                onChange={(e) =>
                  patch({ nationalId: e.target.value.replace(/\D/g, '').slice(0, 10) })
                }
                className={inputClass}
                placeholder="۱۰ رقم"
                dir="ltr"
                maxLength={10}
              />
            </FormField>
          </div>
        ) : null}

        {isBusiness ? (
          <div className="space-y-4 rounded-xl border border-indigo-100/80 bg-gradient-to-bl from-indigo-50/40 to-white p-4">
            <p className="text-xs font-semibold text-indigo-900">شرکت / کسب‌وکار</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white ring-2 ring-indigo-100">
                {companyLogo ? (
                  <img src={companyLogo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <BuildingOffice2Icon className="h-8 w-8 text-indigo-400" aria-hidden />
                )}
              </div>
              <UploadPlaceholderButton
                variant="row"
                label="آپلود لوگو"
                hint="به‌زودی"
                onClick={uploadPlaceholderMessage}
                className="flex-1"
              />
            </div>
            <FormField label="نام شرکت *">
              <input
                type="text"
                value={companyName}
                onChange={(e) => patch({ companyName: e.target.value })}
                className={inputClass}
                placeholder="مثلاً شرکت خدمات ساختمانی پارس"
              />
            </FormField>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="شماره ثبت (اختیاری)">
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => patch({ registrationNumber: e.target.value })}
                  className={inputClass}
                  placeholder="شماره ثبت"
                  dir="ltr"
                />
              </FormField>
              <FormField label="شناسه ملی (اختیاری)">
                <input
                  type="text"
                  value={companyNationalId}
                  onChange={(e) =>
                    patch({ companyNationalId: e.target.value.replace(/\D/g, '').slice(0, 11) })
                  }
                  className={inputClass}
                  placeholder="۱۱ رقم"
                  dir="ltr"
                  maxLength={11}
                />
              </FormField>
            </div>
            <FormField label="معرفی شرکت (اختیاری)">
              <textarea
                value={bio}
                onChange={(e) => patch({ bio: e.target.value })}
                rows={2}
                className={`${textareaClass} min-h-[4rem]`}
                placeholder="خدمات و حوزه فعالیت شرکت"
              />
            </FormField>
          </div>
        ) : null}
      </div>
    </ProfileFormGroup>
  );
}

export function ExpertAccountTypeDisplay({ profile, hideBio = false }) {
  if (!profile) return null;
  const isBusiness = profile.accountType === 'business';
  const publicName = getExpertPublicName(profile);

  return (
    <ProfilePanelGroup title="هویت حرفه‌ای">
      <ProfilePanelRow
        icon={isBusiness ? BuildingOffice2Icon : UserCircleIcon}
        label="نوع"
        value={getAccountTypeLabel(profile.accountType)}
        emptyText="—"
      />
      {isBusiness ? (
        <>
          <ProfilePanelRow icon={BuildingOffice2Icon} label="نام شرکت" value={profile.companyName} emptyText="—" />
          <ProfilePanelRow
            icon={IdentificationIcon}
            label="شماره ثبت"
            value={profile.registrationNumber}
            dir="ltr"
            emptyText="—"
          />
          <ProfilePanelRow
            icon={IdentificationIcon}
            label="شناسه ملی"
            value={profile.companyNationalId}
            dir="ltr"
            emptyText="—"
          />
          {!hideBio ? (
            <ProfilePanelRow icon={UserCircleIcon} label="معرفی" value={profile.bio} emptyText="—" />
          ) : null}
        </>
      ) : (
        <>
          <ProfilePanelRow icon={UserCircleIcon} label="نام نمایشی" value={profile.displayName || publicName} emptyText="—" />
          {!hideBio ? (
            <ProfilePanelRow icon={UserCircleIcon} label="بیوگرافی" value={profile.bio} emptyText="—" />
          ) : null}
          <ProfilePanelRow
            icon={IdentificationIcon}
            label="کد ملی"
            value={profile.nationalId || profile.user?.nationalId}
            dir="ltr"
            emptyText="—"
          />
        </>
      )}
    </ProfilePanelGroup>
  );
}

export function ExpertServiceAreaDisplay({ activeCityNames, serviceRadius, activityTypes }) {
  return (
    <ProfilePanelGroup title="پوشش و نحوه ارائه خدمت">
      <ProfilePanelRow
        icon={MapPinIcon}
        label="نحوه ارائه خدمت"
        value={formatActivityTypesSummary(activityTypes)}
        emptyText="—"
      />
      <ProfilePanelRow icon={MapPinIcon} label="شهرهای فعالیت" value={activeCityNames} emptyText="—" />
      <ProfilePanelRow
        icon={MapPinIcon}
        label="حداکثر شعاع"
        value={getServiceRadiusLabel(serviceRadius)}
        emptyText="—"
      />
    </ProfilePanelGroup>
  );
}

export function ExpertPresenceDisplay({ presenceStatus, workSchedule }) {
  const scheduleSummary = formatWorkScheduleSummary(workSchedule);
  return (
    <ProfilePanel flush>
      <ProfilePanelGroup title="وضعیت حضور">
        <ProfilePanelRow
          icon={SignalIcon}
          label="وضعیت"
          value={getPresenceStatusLabel(presenceStatus)}
          emptyText="—"
        />
      </ProfilePanelGroup>
      <ProfilePanelGroup title="ساعات کاری">
        <ProfilePanelRow icon={ClockIcon} label="برنامه هفتگی" value={scheduleSummary} emptyText="—" />
      </ProfilePanelGroup>
    </ProfilePanel>
  );
}

export function ExpertPortfolioDisplay({ portfolio }) {
  const items = normalizePortfolio(portfolio);
  if (!items.length) {
    return (
      <ProfilePanelGroup title="نمونه کارها">
        <ProfilePanelRow icon={PhotoIcon} label="نمونه‌ها" value={null} emptyText="ثبت نشده" />
      </ProfilePanelGroup>
    );
  }

  return (
    <ProfilePanelGroup title="نمونه کارها">
      {items.map((item, index) => {
        const links = [item.instagramUrl, item.websiteUrl].filter(Boolean).join(' · ');
        const value = [item.title, links].filter(Boolean).join(' — ') || '—';
        return (
          <ProfilePanelRow
            key={index}
            icon={item.videoUrl ? VideoCameraIcon : item.imageUrl ? PhotoIcon : LinkIcon}
            label={`نمونه ${index + 1}`}
            value={value}
            emptyText="—"
          />
        );
      })}
    </ProfilePanelGroup>
  );
}
