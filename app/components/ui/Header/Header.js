"use client";
import { useState, useContext } from 'react';
import Link from 'next/link';
import UserDropdown from '../UserDropdown';
import { AuthContext } from '../../../context/AuthContext';
import AuthButtons from '../../AuthButtons';
import MobileMenu from '../../MobileMenu';
import MainNavBar from './MainNavBar';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-[9999] w-full overflow-visible">
      {/* ردیف اول: لوگو، لینک‌های اصلی، احراز هویت — relative z-10 تا منوی کاربر بالای ناوبر رسم شود */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 max-w-[100vw]">
        <div className="flex items-center justify-between h-14 sm:h-16 min-h-[3.5rem]">
          {/* سمت راست - لوگو (عکس شامل لوگو و متن پرندیکس) */}
          <div className="flex items-center min-w-0 flex-1 justify-end md:flex-initial md:justify-start">
            <Link href="/" scroll={false} className="block max-w-[45vw] sm:max-w-[200px]">
              <img
                src="/images/logo_text.jpg"
                alt="پرندیکس"
                width={180}
                height={48}
                className="h-8 sm:h-10 w-auto max-h-10 object-contain object-right"
              />
            </Link>
          </div>

          {/* وسط - خالی در دسکتاپ (منوی کاربر و داشبورد در نوار ناوبری زیر هدر است) */}
          <div className="hidden md:block flex-1 min-w-0" aria-hidden="true" />

          {/* سمت چپ - دکمه‌های ورود/ثبت‌نام یا نام کاربر + منو */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-start md:flex-initial md:justify-end">
            {!isAuthenticated ? (
              <AuthButtons />
            ) : (
              <div className="relative">
                <UserDropdown variant="header" />
              </div>
            )}
          </div>

          {/* دکمه منوی موبایل (موبایل: منو؛ دسکتاپ: مخفی چون احراز هویت در همین هدر است) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* نوار ناوبری اصلی زیر هدر: خدمات پرندیکس، لیست کارشناسان، ایجاد پروژه جدید */}
      <MainNavBar />

      {/* منوی موبایل */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
} 