"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  UserIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

function getAvatarSrc(user) {
  if (user?.avatar) return user.avatar;
  return user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
}

function getInitials(user) {
  const first = user?.firstName?.charAt(0) || '';
  const last = user?.lastName?.charAt(0) || '';
  return `${first}${last}`.trim() || '؟';
}

function UserAvatar({ user, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClass =
    size === 'xs' ? 'w-6 h-6 text-[10px]' :
    size === 'sm' ? 'w-8 h-8 text-xs' :
    'w-10 h-10 text-sm';

  if (imgError) {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-teal-600 text-white font-semibold ring-2 ring-white ${sizeClass}`}>
        {getInitials(user)}
      </span>
    );
  }

  return (
    <span className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-teal-100 ring-2 ring-white ${sizeClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getAvatarSrc(user)}
        alt=""
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </span>
  );
}

function MenuItems({ user, onAction }) {
  const isExpert = user?.userRoles?.some((role) => role.name === 'expert');
  const isMerchant = user?.userRoles?.some((role) => role.name === 'merchant');

  const items = [
    {
      action: 'dashboard',
      label: 'داشبورد',
      description: 'مدیریت حساب و فعالیت‌ها',
      Icon: Squares2X2Icon,
    },
    {
      action: 'user-profile',
      label: 'پروفایل شخصی',
      description: 'مشاهده و ویرایش اطلاعات شخصی',
      Icon: UserIcon,
    },
  ];

  if (isExpert) {
    items.push({
      action: 'expert-profile',
      label: 'پروفایل تخصصی',
      description: 'رزومه، تخصص‌ها و آدرس محل کار',
      Icon: WrenchScrewdriverIcon,
    });
  }

  if (isMerchant) {
    items.push({
      action: 'merchant-profile',
      label: 'پروفایل فروشگاه',
      description: 'دسته کالا، آدرس و موقعیت روی نقشه',
      Icon: BuildingStorefrontIcon,
    });
  }

  return (
    <div className="py-1.5">
      {items.map((item) => (
        <button
          key={item.action}
          type="button"
          onClick={() => onAction(item.action)}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-right text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors group"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600 shrink-0">
            <item.Icon className="w-5 h-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 text-right">
            <span className="block text-sm font-semibold leading-tight">{item.label}</span>
            <span className="block text-xs text-gray-500 group-hover:text-teal-600/80 mt-0.5 truncate">
              {item.description}
            </span>
          </span>
        </button>
      ))}

      <div className="my-1.5 mx-3 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => onAction('logout')}
        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-right text-red-600 hover:bg-red-50 transition-colors group"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 shrink-0">
          <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden />
        </span>
        <span className="text-sm font-semibold">خروج از حساب</span>
      </button>
    </div>
  );
}

function MenuPanel({ user, fullName, onAction, className }) {
  return (
    <div role="menu" className={className}>
      <div className="px-4 py-3 bg-gradient-to-l from-teal-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="sm" />
          <div className="min-w-0 flex-1 text-right">
            <p className="text-sm font-bold text-gray-800 truncate">{fullName}</p>
            {user.email && (
              <p className="text-xs text-gray-500 truncate mt-0.5" dir="ltr">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
      <MenuItems user={user} onAction={onAction} />
    </div>
  );
}

export default function UserDropdown({ variant = 'header' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const auth = useAuth();
  const { user, setUser } = auth || { user: null, setUser: undefined };
  const isBottomBar = variant === 'bottomBar';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || !isBottomBar) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isBottomBar]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (setUser) setUser(null);
      if (typeof window !== 'undefined') localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleMenuClick = (action) => {
    setIsOpen(false);
    switch (action) {
      case 'dashboard':
        router.push('/dashboard', { scroll: false });
        break;
      case 'user-profile':
        router.push('/dashboard?tab=profile-display', { scroll: false });
        break;
      case 'expert-profile':
        router.push('/dashboard?tab=expert-display', { scroll: false });
        break;
      case 'merchant-profile':
        router.push('/dashboard?tab=merchant-display', { scroll: false });
        break;
      case 'expert-specializations':
        router.push('/dashboard?tab=expert-edit', { scroll: false });
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'کاربر';

  if (isBottomBar) {
    return (
      <>
        {isOpen && (
          <button
            type="button"
            className="md:hidden fixed inset-0 z-[9997] bg-black/30"
            aria-label="بستن منو"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className={`
              flex flex-col items-center justify-center gap-1 w-full min-w-0 py-2
              text-[11px] font-medium transition-colors
              ${isOpen ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}
            `}
            aria-label="منوی کاربر"
            aria-expanded={isOpen}
            aria-haspopup="menu"
          >
            <UserAvatar user={user} size="xs" />
            <span className="leading-none">حساب</span>
          </button>

          {isOpen && (
            <MenuPanel
              user={user}
              fullName={fullName}
              onAction={handleMenuClick}
              className="fixed left-4 right-4 bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] z-[9999] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl"
            />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`
          inline-flex items-center justify-center rounded-full p-0.5 transition-all
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
          ${isOpen ? 'ring-2 ring-teal-500/40' : 'hover:ring-2 hover:ring-gray-200'}
        `}
        aria-label="منوی کاربر"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <UserAvatar user={user} size="md" />
      </button>

      {isOpen && (
        <MenuPanel
          user={user}
          fullName={fullName}
          onAction={handleMenuClick}
          className="absolute left-0 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-[99999]"
        />
      )}
    </div>
  );
}
