'use client';

export const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

export const labelClass = 'mb-2 block text-sm font-medium text-gray-700';

export const cardClass =
  'rounded-2xl border border-gray-200 bg-white shadow-sm';

export const primaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-50';

export const ghostBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700';

const ROLE_STYLES = {
  admin: 'bg-red-100 text-red-700 ring-red-200',
  moderator: 'bg-orange-100 text-orange-700 ring-orange-200',
  expert: 'bg-teal-100 text-teal-700 ring-teal-200',
  customer: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

export function getRoleLabel(role) {
  switch (role) {
    case 'admin':
      return 'مدیر کل';
    case 'moderator':
      return 'ناظر';
    case 'expert':
      return 'متخصص';
    case 'customer':
      return 'مشتری';
    default:
      return role;
  }
}

export function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        ROLE_STYLES[role] || 'bg-gray-100 text-gray-700 ring-gray-200'
      }`}
    >
      {getRoleLabel(role)}
    </span>
  );
}

export function DashboardLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
    </div>
  );
}

export const textareaClass = `${inputClass} min-h-[100px] resize-y`;

export const formGridClass =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4';

export const pickerGridClass =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4';

export const formIntroGridClass =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4';

export const formLocationRowGridClass =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4';

export const formGridWideClass =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3';

export const formActionsClass =
  'flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end';

export const submitBtnClass = `${primaryBtnClass} w-full sm:w-auto sm:min-w-[9rem]`;

const SPAN_CLASS = {
  1: '',
  2: 'sm:col-span-2 md:col-span-2 xl:col-span-2',
  3: 'sm:col-span-2 md:col-span-3 xl:col-span-3',
  full: 'col-span-full',
};

export function FormField({ label, htmlFor, children, span = 1, className = '' }) {
  return (
    <div className={`min-w-0 ${SPAN_CLASS[span] ?? ''} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export function FormSection({ title, description, children, className = '', id, gridClass }) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 col-span-full space-y-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5 ${className}`}
    >
      {(title || description) && (
        <div className="border-b border-gray-200/80 pb-3">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className={gridClass || formGridClass}>{children}</div>
    </section>
  );
}

export function DashboardField({ label, value, span = 1, className = '' }) {
  return (
    <div className={`min-w-0 ${SPAN_CLASS[span] ?? ''} ${className}`}>
      <dt className={labelClass}>{label}</dt>
      <dd className="break-words rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-800">
        {value ?? '—'}
      </dd>
    </div>
  );
}

export function DashboardSectionHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ ok, okText, failText }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
        ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {ok ? okText : failText}
    </span>
  );
}

export function DashboardBreadcrumb({ items }) {
  return (
    <nav aria-label="مسیر صفحه" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-gray-300 select-none" aria-hidden>
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="text-gray-500 transition hover:text-teal-600"
                >
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? 'font-semibold text-gray-800' : 'text-gray-500'}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
