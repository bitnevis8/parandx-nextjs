'use client';

import Link from 'next/link';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ghostBtnClass } from '../ui/dashboard/DashboardUi';

export default function RequestChatLink({
  otherUserId,
  requestId,
  label = 'گفتگو',
  className = '',
  compact = false,
}) {
  if (!otherUserId) return null;

  const params = new URLSearchParams();
  if (requestId) params.set('requestId', String(requestId));
  const query = params.toString();
  const href = `/dashboard/messages/${otherUserId}${query ? `?${query}` : ''}`;

  if (compact) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 transition hover:bg-teal-100 ${className}`}
      >
        <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden />
        {label}
      </Link>
    );
  }

  return (
    <Link href={href} className={`${ghostBtnClass} gap-2 text-teal-700 ${className}`}>
      <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );
}
