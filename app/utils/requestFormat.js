export const REQUEST_STATUS_LABELS = {
  open: 'باز',
  closed: 'بسته',
  cancelled: 'لغو شده',
  in_progress: 'در حال انجام',
  done: 'انجام شده',
};

export const BID_STATUS_LABELS = {
  pending: 'در انتظار بررسی',
  accepted: 'پذیرفته شده',
  rejected: 'رد شده',
  cancelled: 'لغو شده',
};

export const ACTIVE_REQUEST_STATUSES = ['open', 'in_progress'];

export const CUSTOMER_REQUEST_STATUS_OPTIONS = [
  { value: 'open', label: REQUEST_STATUS_LABELS.open },
  { value: 'in_progress', label: REQUEST_STATUS_LABELS.in_progress },
  { value: 'done', label: REQUEST_STATUS_LABELS.done },
  { value: 'closed', label: REQUEST_STATUS_LABELS.closed },
  { value: 'cancelled', label: REQUEST_STATUS_LABELS.cancelled },
];

export const CUSTOMER_BID_STATUS_OPTIONS = [
  { value: 'pending', label: BID_STATUS_LABELS.pending },
  { value: 'accepted', label: BID_STATUS_LABELS.accepted },
  { value: 'rejected', label: BID_STATUS_LABELS.rejected },
  { value: 'cancelled', label: BID_STATUS_LABELS.cancelled },
];

export const REQUEST_STATUS_STYLES = {
  open: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  closed: 'bg-gray-100 text-gray-700 ring-gray-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  in_progress: 'bg-sky-50 text-sky-800 ring-sky-200',
  done: 'bg-teal-50 text-teal-800 ring-teal-200',
};

export const BID_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  accepted: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  cancelled: 'bg-gray-100 text-gray-700 ring-gray-200',
};

export function formatRelativeTime(value) {
  if (!value) return '—';
  try {
    const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });
    const diffSec = (new Date(value).getTime() - Date.now()) / 1000;
    const abs = Math.abs(diffSec);
    if (abs < 60) return 'همین الان';
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
    if (abs < 604800) return rtf.format(Math.round(diffSec / 86400), 'day');
    return formatRequestDate(value);
  } catch {
    return formatRequestDate(value);
  }
}

export function formatRequestDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatPriceToman(value) {
  if (value == null || value === '') return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return `${num.toLocaleString('fa-IR')} تومان`;
}

export function getCategoryLabel(request) {
  return request?.subCategory?.title || request?.category?.title || '—';
}

export function getCategoryIcon(request) {
  return request?.subCategory?.icon || request?.category?.icon || '';
}

export function countPendingBids(request) {
  return (request?.bids || []).filter((b) => b.status === 'pending').length;
}

export function getExpertDisplayName(expert) {
  const user = expert?.user;
  if (!user) return 'متخصص';
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return name || 'متخصص';
}

export const fetchAuth = { credentials: 'include' };
