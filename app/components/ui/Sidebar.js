'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '../../hooks/useRole';
import { 
  BuildingOffice2Icon as WarehouseIcon,
  CubeIcon as PackageIcon,
  ClipboardDocumentListIcon as ClipboardListIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

// منوهای مختلف بر اساس نقش
const getMenuItems = (userRole) => {
  const baseItems = [
    {
      title: 'داشبورد',
      path: '/dashboard',
      icon: '🏠',
    },
    {
      title: 'پیام‌ها',
      path: '/dashboard/messages',
      icon: '💬',
    },
  ];

  // منوهای پروفایل کاربر (برای همه کاربران)
  baseItems.push({
    title: 'پروفایل کاربری',
    icon: '👤',
    submenu: [
      { title: 'نمایه شخصی', path: '/dashboard?tab=profile-display', icon: '👁️' },
      { title: 'ویرایش نمایه شخصی', path: '/dashboard?tab=profile-edit', icon: '✏️' },
    ],
  });

  // منوهای متخصص (برای متخصصان، مدیران و ناظران)
  if (userRole.canAccessExpert()) {
    baseItems.push({
      title: 'پروفایل متخصص',
      icon: '🔧',
      submenu: [
        { title: 'نمایه تخصصی', path: '/dashboard?tab=expert-display', icon: '👁️' },
        { title: 'ویرایش نمایه تخصصی', path: '/dashboard?tab=expert-edit', icon: '✏️' },
        { title: 'تخصص‌ها', path: '/dashboard?tab=specializations', icon: '🎯' },
        { title: 'درخواست‌ها', path: '/dashboard/expert/requests', icon: '📋' },
        { title: 'نظرات', path: '/dashboard/expert/reviews', icon: '⭐' },
      ],
    });
  }

  // منوهای مشتری (برای همه کاربران)
  if (userRole.canAccessCustomer()) {
    baseItems.push({
      title: 'درخواست‌های من',
      icon: '📝',
      submenu: [
        { title: 'درخواست‌های جدید', path: '/dashboard/customer/new-request', icon: '➕' },
        { title: 'درخواست‌های فعال', path: '/dashboard/customer/active-requests', icon: '🔄' },
        { title: 'تاریخچه', path: '/dashboard/customer/history', icon: '📊' },
        { title: 'نظرات من', path: '/dashboard/customer/my-reviews', icon: '💬' },
      ],
    });
  }

  // منوهای مدیریت (فقط برای مدیران و ناظران) - در انتها
  const adminItems = [];
  if (userRole.canAccessAdmin()) {
    adminItems.push({
      title: 'مدیریت کاربران',
      icon: '👤',
      submenu: [
        { title: 'لیست کاربران', path: '/dashboard/user-management/users', icon: '🧑‍💼' },
        { title: 'لیست نقش‌ها', path: '/dashboard/user-management/roles', icon: '🛡️' },
      ],
    });

    adminItems.push({
      title: 'تنظیمات',
      icon: '⚙️',
      submenu: [
        { title: 'مدیریت مراکز', path: '/dashboard/settings/unit-locations', icon: '📍' },
        { title: 'مدیریت نرخ‌ها', path: '/dashboard/settings/rate-settings', icon: '💰' },
      ],
    });
  }

  return { baseItems, adminItems };
};

export default function Sidebar({ onLinkClick }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);
  const userRole = useRole();
  
  const { baseItems, adminItems } = getMenuItems(userRole);

  const toggleMenu = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  const isActive = (path) => {
    if (path.includes('?tab=')) {
      const [basePath, tab] = path.split('?tab=');
      const currentTab = new URLSearchParams(window.location.search).get('tab');
      return pathname === basePath && currentTab === tab;
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 h-full min-h-screen max-h-screen flex flex-col bg-white text-gray-800 p-4 shadow-xl border-l border-gray-200 overflow-y-auto">
      {/* داشبورد در بالای سایدبار */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          scroll={false}
          onClick={onLinkClick}
          className={`flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors ${
            isActive('/dashboard') ? 'bg-blue-100 text-blue-700' : ''
          }`}
        >
          <span className="ml-2 text-xl">🏠</span>
          <span className="text-lg font-semibold">داشبورد</span>
        </Link>
      </div>
      
      <nav className="space-y-2">
        {/* Base menu items */}
        {baseItems.filter(item => item.path !== '/dashboard').map((item) => (
          <div key={item.title} className="space-y-1">
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                    openMenu === item.title ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="ml-2">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-lg">
                    {openMenu === item.title ? '▼' : '▶'}
                  </span>
                </button>
                
                {openMenu === item.title && (
                  <div className="mr-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        scroll={false}
                        onClick={onLinkClick}
                        className={`flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                          isActive(subItem.path) ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                      >
                        <span className="ml-2">{subItem.icon}</span>
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.path}
                scroll={false}
                onClick={onLinkClick}
                className={`flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                  isActive(item.path) ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <span className="ml-2">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}

        {/* Separator line for admin items */}
        {adminItems.length > 0 && (
          <div className="border-t border-gray-300 my-4"></div>
        )}

        {/* Admin menu items */}
        {adminItems.map((item) => (
          <div key={item.title} className="space-y-1">
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                    openMenu === item.title ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="ml-2">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-lg">
                    {openMenu === item.title ? '▼' : '▶'}
                  </span>
                </button>
                
                {openMenu === item.title && (
                  <div className="mr-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        scroll={false}
                        onClick={onLinkClick}
                        className={`flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                          isActive(subItem.path) ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                      >
                        <span className="ml-2">{subItem.icon}</span>
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.path}
                scroll={false}
                onClick={onLinkClick}
                className={`flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                  isActive(item.path) ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <span className="ml-2">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
} 