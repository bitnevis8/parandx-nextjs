'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import MarketplaceSwitcher, {
  shouldShowMarketplaceSwitcher,
} from './marketplace/MarketplaceSwitcher';

const menuLinks = [
  { href: '/', label: 'صفحه اصلی', exact: true },
  { href: '/location', label: 'مکان‌ها', exact: false },
];

export default function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated } = useContext(AuthContext);
  const pathname = usePathname();
  const showMarketplaceSwitcher = shouldShowMarketplaceSwitcher(pathname);

  if (!isOpen) return null;

  const isLinkActive = (href, exact) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <div className="md:hidden absolute top-full inset-x-0 bg-white border-b border-gray-200 shadow-lg z-[10000]">
      <div className="container mx-auto max-w-6xl px-4 py-3">
        {showMarketplaceSwitcher ? (
          <div className="mb-3 flex justify-center pb-3 border-b border-gray-100">
            <MarketplaceSwitcher variant="menu" className="max-w-[21.5rem]" />
          </div>
        ) : null}

        {!isAuthenticated && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <Link
              href="/auth"
              scroll={false}
              className="inline-flex w-full items-center justify-center h-10 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              onClick={onClose}
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        )}

        <nav className="space-y-1" aria-label="منوی موبایل">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              onClick={onClose}
              className={`
                block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isLinkActive(link.href, link.exact)
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-teal-700'}
              `}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              scroll={false}
              onClick={onClose}
              className={`
                block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${pathname?.startsWith('/dashboard')
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-teal-700'}
              `}
            >
              داشبورد
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
