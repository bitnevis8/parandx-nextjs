'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { resolveMarketplaceFromPath } from '../../../config/marketplaceConfig';
import {
  HomeIcon,
  MegaphoneIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
} from '@heroicons/react/24/solid';

function isHomeActive(pathname = '') {
  return pathname === '/';
}

function isServicesActive(pathname = '') {
  if (pathname === '/') return false;
  const market = resolveMarketplaceFromPath(pathname);
  if (market.type !== 'services') return false;
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) return false;
  return true;
}

function isGoodsActive(pathname = '') {
  return pathname === '/goods' || pathname.startsWith('/goods/');
}

function isProfileActive(pathname = '', isAuthenticated) {
  if (isAuthenticated) return pathname.startsWith('/dashboard');
  return pathname.startsWith('/auth');
}

function isPostAdActive(pathname = '') {
  return pathname === '/divar/new' || pathname.startsWith('/divar/new');
}

function NavTab({ href, label, Icon, IconActive, active, accent = 'teal' }) {
  const ActiveIcon = active && IconActive ? IconActive : Icon;
  const activeClass =
    accent === 'amber'
      ? 'text-amber-600'
      : 'text-teal-600';
  const idleClass = 'text-gray-500 active:text-gray-700 dark:text-sky-400 dark:active:text-sky-200';

  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={`
        flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2
        text-[10px] font-medium leading-none transition-colors min-[420px]:text-[11px]
        ${active ? activeClass : idleClass}
      `}
    >
      <ActiveIcon
        className="h-6 w-6 shrink-0"
        strokeWidth={active ? 2.25 : 1.75}
        aria-hidden
      />
      <span className="truncate px-0.5">{label}</span>
    </Link>
  );
}

function PostAdFab({ active }) {
  return (
    <Link
      href="/divar/new"
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className="relative z-[1] flex w-[4.25rem] shrink-0 flex-col items-center justify-end pb-1.5 -mt-5 min-[420px]:w-[4.5rem]"
    >
      <span
        className={`
          flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]
          ring-4 ring-white transition-transform active:scale-95 min-[420px]:h-12 min-[420px]:w-12 dark:ring-slate-950
          ${active ? 'bg-violet-600' : 'bg-teal-600'}
        `}
      >
        <MegaphoneIcon className="h-5 w-5 min-[420px]:h-[1.35rem] min-[420px]:w-[1.35rem]" strokeWidth={2.25} aria-hidden />
      </span>
      <span className={`mt-1 text-[10px] font-bold leading-none min-[420px]:text-[11px] ${active ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-sky-200'}`}>
        ثبت آگهی
      </span>
    </Link>
  );
}

export default function MainNavBar() {
  const pathname = usePathname() || '/';
  const { isAuthenticated } = useContext(AuthContext);

  const profileHref = isAuthenticated ? '/dashboard' : '/auth';

  return (
    <nav
      dir="rtl"
      className="md:hidden fixed bottom-0 inset-x-0 z-[200] border-t border-gray-200 bg-white/95 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#020617]/75 dark:shadow-[0_-2px_16px_rgba(0,0,0,0.45)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
      aria-label="ناوبری پایین"
    >
      <div className="mx-auto flex h-[3.75rem] max-w-lg items-stretch px-1 min-[420px]:px-2">
        <NavTab
          href="/"
          label="خانه"
          Icon={HomeIcon}
          IconActive={HomeIconSolid}
          active={isHomeActive(pathname)}
        />
        <NavTab
          href="/#home-path-categories"
          label="خدمات"
          Icon={WrenchScrewdriverIcon}
          IconActive={WrenchScrewdriverIconSolid}
          active={isServicesActive(pathname)}
        />
        <PostAdFab active={isPostAdActive(pathname)} />
        <NavTab
          href="/goods"
          label="کالا"
          Icon={ShoppingBagIcon}
          IconActive={ShoppingBagIconSolid}
          active={isGoodsActive(pathname)}
          accent="amber"
        />
        <NavTab
          href={profileHref}
          label={isAuthenticated ? 'پروفایل' : 'ورود'}
          Icon={UserCircleIcon}
          IconActive={UserCircleIconSolid}
          active={isProfileActive(pathname, isAuthenticated)}
        />
      </div>
    </nav>
  );
}
