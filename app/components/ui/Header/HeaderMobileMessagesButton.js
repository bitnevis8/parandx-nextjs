'use client';

import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const BTN =
  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600 active:bg-gray-100';

export default function HeaderMobileMessagesButton({ href, unreadCount = 0, ariaLabel = 'پیام‌ها' }) {
  return (
    <Link href={href} scroll={false} className={BTN} title={ariaLabel} aria-label={ariaLabel}>
      <EnvelopeIcon className="h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={1.75} aria-hidden />
      {unreadCount > 0 ? (
        <span className="absolute top-1 left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
