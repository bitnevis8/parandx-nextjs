"use client";
import { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';
import AuthButtons from '../../AuthButtons';
import MobileMenu from '../../MobileMenu';
import UserDropdown from '../UserDropdown';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-[9999]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" scroll={false} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">پ</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">پرندیکس</span>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" scroll={false} className="text-gray-600 hover:text-blue-600 transition-colors">
              صفحه اصلی
            </Link>
            <Link href="/categories" scroll={false} className="text-gray-600 hover:text-blue-600 transition-colors">
              دسته‌بندی خدمات
            </Link>
            <Link href="/experts" scroll={false} className="text-gray-600 hover:text-blue-600 transition-colors">
              متخصصان
            </Link>
            <Link href="/requests/new" scroll={false} className="text-gray-600 hover:text-blue-600 transition-colors">
              ثبت درخواست
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" scroll={false} className="text-gray-600 hover:text-blue-600 transition-colors">
                داشبورد
              </Link>
            )}
          </nav>

          {/* Right side - User Dropdown (if authenticated) or Auth Buttons */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
} 