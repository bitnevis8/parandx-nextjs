'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from './UserAvatar';
import { RoleBadge } from './dashboard/DashboardUi';
import DashboardNavLinks, { useSidebarMarketTab } from './dashboard/DashboardNavLinks';
import {
  buildFixedBottomNavGroups,
  buildFixedTopNavGroups,
  buildMarketNavGroups,
  DASHBOARD_MARKET_TABS,
  DASHBOARD_SECTION_THEMES,
  matchDashboardPath,
} from './dashboard/dashboardNavConfig';
import {
  PhoneIcon,
  EnvelopeIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

export const SIDEBAR_WIDTH_EXPANDED = '17.5rem';
export const SIDEBAR_WIDTH_COLLAPSED = '4.75rem';

function CollapsedNavIcon({ item, active, onClick, theme = 'default' }) {
  const Icon = item.icon;
  const themeStyles = DASHBOARD_SECTION_THEMES[theme] || DASHBOARD_SECTION_THEMES.default;
  const idleHover =
    theme === 'goods'
      ? 'text-gray-500 hover:bg-amber-50 hover:text-amber-700'
      : theme === 'services'
        ? 'text-gray-500 hover:bg-teal-50 hover:text-teal-700'
        : 'text-gray-500 hover:bg-gray-100 hover:text-teal-600';

  return (
    <Link
      href={item.path}
      scroll={false}
      onClick={onClick}
      title={item.title}
      aria-label={item.title}
      className={`flex justify-center rounded-xl p-2.5 transition ${
        active ? themeStyles.activeNavClass : idleHover
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
    </Link>
  );
}

function SidebarCollapsedNav({ onLinkClick }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userRole = useRole();
  const [activeMarket, setActiveMarket] = useSidebarMarketTab();
  const isActive = (path, exact) => matchDashboardPath(pathname, searchParams, path, exact);

  const topGroups = useMemo(() => buildFixedTopNavGroups(), []);
  const marketGroups = useMemo(
    () => buildMarketNavGroups(activeMarket, userRole),
    [activeMarket, userRole]
  );
  const bottomGroups = useMemo(() => buildFixedBottomNavGroups(userRole), [userRole]);

  const flatItems = (groups) =>
    groups.flatMap((g) => g.items.map((item) => ({ ...item, theme: g.theme })));

  const themeForMarket =
    activeMarket === DASHBOARD_MARKET_TABS.goods ? 'goods' : 'services';

  return (
    <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-3 scrollbar-thin" aria-label="منو">
      {flatItems(topGroups).map((item) => (
        <CollapsedNavIcon
          key={item.path}
          item={item}
          active={isActive(item.path, item.exact)}
          onClick={onLinkClick}
          theme="default"
        />
      ))}

      <div className="my-2 space-y-1 border-y border-gray-100 py-2">
        <button
          type="button"
          title={DASHBOARD_MARKET_TABS.services === activeMarket ? 'بازار خدمات' : 'رفتن به بازار خدمات'}
          onClick={() => setActiveMarket(DASHBOARD_MARKET_TABS.services)}
          className={`flex w-full justify-center rounded-xl p-2 text-[10px] font-bold ${
            activeMarket === DASHBOARD_MARKET_TABS.services
              ? 'bg-teal-600 text-white'
              : 'text-teal-700 hover:bg-teal-50'
          }`}
        >
          خدمات
        </button>
        <button
          type="button"
          title={DASHBOARD_MARKET_TABS.goods === activeMarket ? 'بازار کالا' : 'رفتن به بازار کالا'}
          onClick={() => setActiveMarket(DASHBOARD_MARKET_TABS.goods)}
          className={`flex w-full justify-center rounded-xl p-2 text-[10px] font-bold ${
            activeMarket === DASHBOARD_MARKET_TABS.goods
              ? 'bg-amber-600 text-white'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          کالا
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {flatItems(marketGroups).map((item) => (
          <CollapsedNavIcon
            key={item.path}
            item={item}
            active={isActive(item.path, item.exact)}
            onClick={onLinkClick}
            theme={themeForMarket}
          />
        ))}
      </div>

      <div className="my-2 h-px bg-gray-200" aria-hidden />

      <div className="flex flex-col gap-1">
        {flatItems(bottomGroups).map((item) => (
          <CollapsedNavIcon
            key={item.path}
            item={item}
            active={isActive(item.path, item.exact)}
            onClick={onLinkClick}
            theme="default"
          />
        ))}
      </div>
    </nav>
  );
}

function SidebarBrand({ collapsed }) {
  return (
    <Link
      href="/dashboard"
      scroll={false}
      className={`flex items-center gap-3 overflow-hidden rounded-xl transition-colors hover:bg-gray-50 ${
        collapsed ? 'justify-center p-2' : 'px-2 py-1.5'
      }`}
      title="داشبورد"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo_text.jpg"
        alt="پرندیکس"
        className={`shrink-0 object-contain ${collapsed ? 'h-8 w-8 rounded-lg' : 'h-8 w-auto max-w-[8.5rem]'}`}
      />
      {!collapsed ? (
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-bold text-gray-900">داشبورد</p>
          <p className="truncate text-[11px] text-gray-500">پرندیکس</p>
        </div>
      ) : null}
    </Link>
  );
}

function SidebarUserCard({ user, roles, collapsed }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'کاربر';

  if (collapsed) {
    return (
      <div className="flex justify-center px-2 py-3">
        <div className="group relative" title={fullName}>
          <UserAvatar
            user={user}
            size="xs"
            className="h-10 w-10 rounded-xl ring-2 ring-teal-100 transition group-hover:ring-teal-200"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-3 rounded-2xl border border-gray-200/80 bg-gradient-to-b from-teal-50/50 to-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <UserAvatar
          user={user}
          size="xs"
          className="h-11 w-11 shrink-0 rounded-xl ring-2 ring-teal-100"
        />
        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-sm font-bold text-gray-900">{fullName}</p>
          {user.mobile ? (
            <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-gray-500">
              <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
              <span dir="ltr" className="truncate">{user.mobile}</span>
            </p>
          ) : user.email ? (
            <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-gray-500">
              <EnvelopeIcon className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
              <span dir="ltr" className="truncate">{user.email}</span>
            </p>
          ) : null}
        </div>
      </div>
      {roles.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap justify-end gap-1 border-t border-gray-100 pt-2.5">
          {roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onLinkClick,
  showCollapseToggle = true,
}) {
  const userRole = useRole();
  const { user } = useAuth();
  const roles = userRole.getUserRoles();

  return (
    <aside dir="rtl" className="flex h-full flex-col bg-white text-gray-800">
      <div
        className={`shrink-0 border-b border-gray-100 ${
          collapsed ? 'px-2 py-3' : 'px-3 py-3'
        }`}
      >
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-2'}`}>
          <div className={collapsed ? 'w-full' : 'min-w-0 flex-1'}>
            <SidebarBrand collapsed={collapsed} />
          </div>
          {showCollapseToggle && onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 ${
                collapsed ? 'h-9 w-full' : 'h-9 w-9'
              }`}
              aria-label={collapsed ? 'باز کردن منو' : 'جمع کردن منو'}
              title={collapsed ? 'باز کردن منو' : 'جمع کردن منو'}
            >
              {collapsed ? (
                <ChevronLeftIcon className="h-4 w-4" aria-hidden />
              ) : (
                <ChevronRightIcon className="h-4 w-4" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {user ? <SidebarUserCard user={user} roles={roles} collapsed={collapsed} /> : null}

      {!collapsed ? (
        <div className="flex-1 overflow-y-auto overscroll-contain px-1 py-2 scrollbar-thin">
          <DashboardNavLinks onNavigate={onLinkClick} showSiteLink />
        </div>
      ) : (
        <SidebarCollapsedNav onLinkClick={onLinkClick} />
      )}
    </aside>
  );
}
