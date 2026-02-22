'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  Squares2X2Icon,
  UserGroupIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  UserGroupIcon as UserGroupIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconSolid,
} from '@heroicons/react/24/solid';

const navItems = [
  {
    href: '/',
    label: 'صفحه اصلی',
    Icon: HomeIcon,
    IconActive: HomeIconSolid,
    exact: true,
  },
  {
    href: '/categories',
    label: 'خدمات پرندیکس',
    Icon: Squares2X2Icon,
    IconActive: Squares2X2IconSolid,
    exact: false,
  },
  {
    href: '/experts',
    label: 'لیست کارشناسان',
    Icon: UserGroupIcon,
    IconActive: UserGroupIconSolid,
    exact: false,
  },
  {
    href: '/requests/new',
    label: 'ایجاد پروژه جدید',
    Icon: PlusCircleIcon,
    IconActive: PlusCircleIconSolid,
    exact: false,
  },
  {
    href: '/auth/login',
    label: 'ورود',
    Icon: ArrowRightOnRectangleIcon,
    IconActive: ArrowRightOnRectangleIconSolid,
    exact: false,
  },
];

export default function MainNavBar() {
  const pathname = usePathname();

  const linkContent = (item, isActive, Icon) => (
    <>
      <Icon
        className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0"
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span className="whitespace-nowrap">{item.label}</span>
    </>
  );

  return (
    <>
      {/* دسکتاپ: نوار زیر هدر */}
      <nav className="hidden md:block bg-gradient-to-l from-teal-600 to-cyan-600 border-b border-teal-500/50 shadow-lg overflow-x-auto overflow-y-hidden">
        <div className="container mx-auto px-3 sm:px-4 min-w-0">
          <div className="flex items-center justify-center gap-2 md:gap-3 py-2.5 sm:py-3.5 overflow-x-auto scrollbar-hide flex-nowrap md:flex-wrap">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = isActive ? item.IconActive : item.Icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={false}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 py-2 sm:px-5 sm:py-3 md:px-6 rounded-xl shrink-0
                    font-medium text-xs sm:text-sm md:text-base transition-all duration-300 ease-out
                    hover:scale-[1.03] hover:shadow-xl
                    ${isActive
                      ? 'bg-white text-teal-700 shadow-lg ring-2 ring-white/40'
                      : 'text-white/95 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  {linkContent(item, isActive, Icon)}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* موبایل: Bottom Bar ثابت — آیکون بالا، عنوان پایین */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] bg-gradient-to-l from-teal-600 to-cyan-600 border-t border-teal-500/50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
      >
        <div className="flex items-stretch justify-around h-16">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = isActive ? item.IconActive : item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                className={`
                  flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1
                  font-medium text-[10px] sm:text-xs transition-colors
                  active:bg-white/15
                  ${isActive
                    ? 'text-white bg-white/25'
                    : 'text-white/90'
                  }
                `}
              >
                <Icon
                  className="w-6 h-6 flex-shrink-0"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="leading-tight text-center line-clamp-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
