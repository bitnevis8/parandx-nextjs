'use client';

import {
  BID_STATUS_LABELS,
  BID_STATUS_STYLES,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_STYLES,
} from '../../utils/requestFormat';

export function RequestStatusBadge({ status, className = '' }) {
  const label = REQUEST_STATUS_LABELS[status] || status;
  const style = REQUEST_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 ring-gray-200';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style} ${className}`}
    >
      {label}
    </span>
  );
}

export function BidStatusBadge({ status, className = '' }) {
  const label = BID_STATUS_LABELS[status] || status;
  const style = BID_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 ring-gray-200';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style} ${className}`}
    >
      {label}
    </span>
  );
}
