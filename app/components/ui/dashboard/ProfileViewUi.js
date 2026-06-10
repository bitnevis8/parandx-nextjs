'use client';

import { StatusBadge } from './DashboardUi';

export function ProfileViewVerifyBadge({ ok, okText, failText }) {
  return <StatusBadge ok={ok} okText={okText} failText={failText} />;
}

/** یک کارت واحد برای نمایش پروفایل */
export function ProfilePanel({ children, className = '', flush = false }) {
  return (
    <div
      className={
        flush
          ? className
          : `overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`
      }
    >
      {children}
    </div>
  );
}

/** گروه فیلدها با عنوان کوچک */
export function ProfilePanelGroup({ title, children }) {
  return (
    <section className="border-b border-gray-100 last:border-b-0">
      {title ? (
        <div className="border-b border-gray-50 bg-gray-50/70 px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500">{title}</h3>
        </div>
      ) : null}
      <dl className="divide-y divide-gray-100">{children}</dl>
    </section>
  );
}

/** یک ردیف فشرده: برچسب | مقدار | (اختیاری) وضعیت */
export function ProfilePanelRow({
  icon: Icon,
  label,
  value,
  dir,
  trailing,
  emptyText = 'ثبت نشده',
}) {
  const hasValue =
    value !== null && value !== undefined && String(value).trim() !== '';

  return (
    <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50/60 sm:items-center sm:py-2.5">
      {Icon ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 sm:mt-0">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      ) : (
        <span className="hidden h-8 w-8 shrink-0 sm:block" aria-hidden />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <dt className="shrink-0 text-xs font-medium text-gray-500 sm:w-20">{label}</dt>
        <dd
          className={`min-w-0 flex-1 break-words text-sm leading-snug ${
            hasValue ? 'font-medium text-gray-900' : 'text-gray-400'
          }`}
          dir={dir}
        >
          {hasValue ? value : emptyText}
        </dd>
      </div>
      {trailing ? <div className="shrink-0 pt-0.5 sm:pt-0">{trailing}</div> : null}
    </div>
  );
}

/** کارت فرم ویرایش — هم‌استایل با ProfilePanel */
export function ProfileFormPanel({ children, className = '', flush = false }) {
  return (
    <div
      className={
        flush
          ? className
          : `overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`
      }
    >
      {children}
    </div>
  );
}

export function ProfileFormGroup({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-gray-100 p-4 last:border-b-0 sm:p-5">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function ProfileGenderPills({ value, onChange, name = 'gender' }) {
  const options = [
    { value: '', label: 'نامشخص' },
    { value: 'male', label: 'آقا' },
    { value: 'female', label: 'خانم' },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="جنسیت">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value || 'unset'}
            type="button"
            name={name}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              active
                ? 'bg-teal-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:text-teal-700'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProfileViewEmpty({
  title,
  description,
  actionLabel = null,
  onAction = null,
  actionLoading = false,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-5 py-10 text-center sm:px-8">
      <p className="text-base font-semibold text-gray-800">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">{description}</p>
      )}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={actionLoading}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-60"
        >
          {actionLoading ? 'لطفاً صبر کنید…' : actionLabel}
        </button>
      ) : null}
    </div>
  );
}

/* ——— کامپوننت‌های مشترک (درخواست، پروفایل تخصصی و …) ——— */

export const profileViewGridClass =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4';

export const profileViewIntroGridClass =
  'grid grid-cols-1 gap-3 sm:grid-cols-2';

export const profileViewLocationGridClass =
  'grid grid-cols-2 gap-3 sm:grid-cols-4';

export function ProfileViewSection({ id, title, description, children, className = '' }) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-5">
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function ProfileViewCompactField({ label, value }) {
  const hasContent = value && String(value).trim();

  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/40 px-3 py-2.5">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      {hasContent ? (
        <p className="mt-1 break-words text-sm leading-snug text-gray-800">{value}</p>
      ) : (
        <p className="mt-1 text-sm text-gray-400">ثبت نشده</p>
      )}
    </div>
  );
}

export function ProfileViewTextBlock({ label, value }) {
  const hasContent = value && String(value).trim();

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
      <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>
      {hasContent ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{value}</p>
      ) : (
        <p className="text-sm text-gray-400">ثبت نشده</p>
      )}
    </div>
  );
}
