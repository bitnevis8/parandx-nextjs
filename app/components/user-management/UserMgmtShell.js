'use client';

import Link from 'next/link';

export function UserMgmtPageHeader({
  title,
  description,
  backHref = '/dashboard/user-management/users',
  backLabel = 'بازگشت به لیست',
  actions,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800"
        >
          <span aria-hidden>→</span>
          {backLabel}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-gray-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function UserMgmtAlert({ type = 'error', children, onDismiss }) {
  const styles =
    type === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : type === 'info'
        ? 'border-sky-200 bg-sky-50 text-sky-800'
        : 'border-red-200 bg-red-50 text-red-800';

  return (
    <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <div className="flex-1">{children}</div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100">
          ✕
        </button>
      ) : null}
    </div>
  );
}

export function UserMgmtCard({ title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2> : null}
      {children}
    </section>
  );
}

export function InfoRow({ label, value, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{children ?? value ?? '—'}</dd>
    </div>
  );
}
