'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import UserDropdown from '../UserDropdown';
import {
  EnvelopeIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
} from '@heroicons/react/24/solid';

function NavTab({ href, label, Icon, IconActive, exact, pathname, badge }) {
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname?.startsWith(`${href}/`);
  const ActiveIcon = isActive ? IconActive : Icon;

  return (
    <Link
      href={href}
      scroll={false}
      className={`
        relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-2
        text-[11px] font-medium transition-colors
        ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}
      `}
    >
      <span className="relative inline-flex">
        <ActiveIcon className="w-6 h-6 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden />
        {badge > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[1rem] h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-1">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span className="leading-none">{label}</span>
    </Link>
  );
}

export default function MainNavBar({ unreadCount = 0 }) {
  const pathname = usePathname();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[9998] bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
      aria-label="ناوبری پایین"
    >
      <div className="flex items-stretch h-14 max-w-lg mx-auto">
        <NavTab
          href="/"
          label="خانه"
          Icon={HomeIcon}
          IconActive={HomeIconSolid}
          exact
          pathname={pathname}
        />

        {isAuthenticated ? (
          <>
            <NavTab
              href="/dashboard/messages"
              label="پیام‌ها"
              Icon={EnvelopeIcon}
              IconActive={EnvelopeIconSolid}
              exact={false}
              pathname={pathname}
              badge={unreadCount}
            />
            <UserDropdown variant="bottomBar" />
          </>
        ) : (
          <NavTab
            href="/auth"
            label="ورود"
            Icon={ArrowRightOnRectangleIcon}
            IconActive={ArrowRightOnRectangleIcon}
            exact
            pathname={pathname}
          />
        )}
      </div>
    </nav>
  );
}
