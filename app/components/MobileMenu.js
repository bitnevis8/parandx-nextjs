'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import UserDropdown from './ui/UserDropdown';

export default function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="md:hidden">
      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[10000]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <div className="px-3 py-2">
                <UserDropdown isMobile={true} />
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  scroll={false}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  onClick={onClose}
                  prefetch={true}
                >
                  ورود
                </Link>
                <Link
                  href="/auth/register"
                  scroll={false}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  onClick={onClose}
                  prefetch={true}
                >
                  ثبت نام
                </Link>
              </>
            )}
            
            <Link
              href="/"
              scroll={false}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={onClose}
              prefetch={true}
            >
              صفحه اصلی
            </Link>
            <Link
              href="/categories"
              scroll={false}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={onClose}
              prefetch={true}
            >
              خدمات پرندیکس
            </Link>
            <Link
              href="/experts"
              scroll={false}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={onClose}
              prefetch={true}
            >
              لیست کارشناسان
            </Link>
            <Link
              href="/requests/new"
              scroll={false}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={onClose}
              prefetch={true}
            >
              ایجاد پروژه جدید
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                scroll={false}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                onClick={onClose}
                prefetch={true}
              >
                داشبورد
              </Link>
            )}
            <Link
              href="/location"
              scroll={false}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={onClose}
              prefetch={true}
            >
              مکان‌ها
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 