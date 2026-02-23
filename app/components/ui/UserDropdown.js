"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function UserDropdown({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const auth = useAuth();
  const { user, setUser } = auth || { user: null, setUser: undefined };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (setUser) setUser(null);
      if (typeof window !== 'undefined') localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleMenuClick = (action) => {
    console.log('Menu clicked:', action);
    setIsOpen(false);
    switch (action) {
      case 'dashboard':
        router.push('/dashboard', { scroll: false });
        break;
      case 'user-profile':
        router.push('/dashboard?tab=profile-edit', { scroll: false });
        break;
      case 'expert-profile':
        router.push('/dashboard?tab=expert-edit', { scroll: false });
        break;
      case 'expert-specializations':
        router.push('/dashboard?tab=specializations', { scroll: false });
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  if (!user) return null;

  if (isMobile) {
    return (
      <div className="w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="py-2">
              <button
                onClick={() => handleMenuClick('dashboard')}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
                <span className="font-medium">داشبورد</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => handleMenuClick('user-profile')}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="font-medium">پروفایل کاربری</span>
                  <span className="text-xs text-gray-500 group-hover:text-green-600">ویرایش اطلاعات شخصی</span>
                </div>
              </button>
              
              {user.userRoles && user.userRoles.some(role => role.name === 'expert') && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={() => handleMenuClick('expert-profile')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                  >
                    <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 011 1v1z" />
                    </svg>
                                      <div className="flex flex-col items-start">
                    <span className="font-medium">پروفایل متخصص</span>
                    <span className="text-xs text-gray-500 group-hover:text-purple-600">ویرایش اطلاعات تخصصی</span>
                  </div>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('expert-specializations')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group"
                  >
                    <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">تخصص‌ها</span>
                      <span className="text-xs text-gray-500 group-hover:text-orange-600">مدیریت مهارت‌ها</span>
                    </div>
                  </button>
                </>
              )}
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => handleMenuClick('logout')}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 ml-3 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">خروج</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          console.log('Button clicked, isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 sm:w-52 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-[99999] border border-gray-200">
          <div className="py-2">
            <button
              onClick={() => handleMenuClick('dashboard')}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              <span className="font-medium">داشبورد</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => handleMenuClick('user-profile')}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="flex flex-col items-start">
                <span className="font-medium">پروفایل کاربری</span>
                <span className="text-xs text-gray-500 group-hover:text-green-600">ویرایش اطلاعات شخصی</span>
              </div>
            </button>
            
            {user.userRoles && user.userRoles.some(role => role.name === 'expert') && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={() => handleMenuClick('expert-profile')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                >
                  <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 011 1v1z" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">پروفایل متخصص</span>
                    <span className="text-xs text-gray-500 group-hover:text-purple-600">ویرایش اطلاعات تخصصی</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleMenuClick('expert-specializations')}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group"
                >
                  <svg className="w-4 h-4 ml-3 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">تخصص‌ها</span>
                    <span className="text-xs text-gray-500 group-hover:text-orange-600">مدیریت مهارت‌ها</span>
                  </div>
                </button>
              </>
            )}
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => handleMenuClick('logout')}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 ml-3 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">خروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
