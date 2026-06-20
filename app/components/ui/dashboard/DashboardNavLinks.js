'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useRole } from '../../../hooks/useRole';
import { MARKETPLACE } from '../../../config/marketplaceConfig';
import {
  buildDivarNavGroups,
  buildFixedBottomNavGroups,
  buildFixedTopNavGroups,
  buildMarketNavGroups,
  DASHBOARD_MARKET_TABS,
  DASHBOARD_SECTION_THEMES,
  detectMarketFromPath,
  matchDashboardPath,
  SIDEBAR_MARKET_TAB_KEY,
} from './dashboardNavConfig';

function NavItem({ item, active, onNavigate, variant = 'desktop', theme = 'default' }) {
  const Icon = item.icon;
  const isMobile = variant === 'mobile';
  const themeStyles = DASHBOARD_SECTION_THEMES[theme] || DASHBOARD_SECTION_THEMES.default;

  return (
    <Link
      href={item.path}
      scroll={false}
      onClick={onNavigate}
      className={`flex items-center font-medium transition active:scale-[0.99] ${
        isMobile
          ? 'gap-2.5 rounded-lg px-2.5 py-2 text-[0.8125rem]'
          : 'gap-3 rounded-2xl px-3 py-2.5 text-sm'
      } ${active ? themeStyles.activeNavClass : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg ${
          isMobile ? 'h-8 w-8' : 'h-9 w-9'
        } ${active ? themeStyles.iconWrapActive : themeStyles.iconWrapIdle}`}
      >
        <Icon
          className={isMobile ? 'h-4 w-4' : 'h-[1.125rem] w-[1.125rem]'}
          strokeWidth={1.75}
          aria-hidden
        />
      </span>
      <span className="min-w-0 flex-1 truncate text-right leading-tight">{item.title}</span>
      {item.externalMarket ? (
        <ArrowTopRightOnSquareIcon
          className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-white/80' : 'text-slate-400'}`}
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

function GroupLabel({ title, variant = 'desktop' }) {
  return (
    <p
      className={
        variant === 'mobile'
          ? 'px-2 pb-1 pt-2 text-[10px] font-semibold text-slate-400'
          : 'mb-1.5 px-3 pt-1 text-[11px] font-semibold text-slate-400'
      }
    >
      {title}
    </p>
  );
}

function NavGroupSection({ group, isActive, onNavigate, variant }) {
  return (
    <div className={variant === 'mobile' ? 'mt-0.5' : 'mt-3 first:mt-0'}>
      <GroupLabel title={group.title} variant={variant} />
      <div className={variant === 'mobile' ? 'space-y-0.5' : 'space-y-1 px-1'}>
        {group.items.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            active={isActive(item.path, item.exact)}
            onNavigate={onNavigate}
            variant={variant}
            theme={group.theme}
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardMarketplaceTabs({
  activeMarket,
  onChange,
  variant = 'desktop',
  className = '',
}) {
  const isMobile = variant === 'mobile';

  const tabClass = (market) => {
    const isActive = activeMarket === market;
    const isGoods = market === DASHBOARD_MARKET_TABS.goods;
    if (isActive) {
      return isGoods
        ? 'bg-amber-600 text-white shadow-sm'
        : 'bg-teal-600 text-white shadow-sm';
    }
    return 'text-slate-600 hover:bg-slate-50';
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50/80 p-1 ${className}`}
      role="tablist"
      aria-label="انتخاب بازار"
    >
      <div className={`grid grid-cols-2 gap-1 ${isMobile ? '' : ''}`}>
        <button
          type="button"
          role="tab"
          aria-selected={activeMarket === DASHBOARD_MARKET_TABS.services}
          onClick={() => onChange(DASHBOARD_MARKET_TABS.services)}
          className={`rounded-lg px-2 py-2 text-xs font-bold transition sm:text-[13px] ${tabClass(DASHBOARD_MARKET_TABS.services)}`}
        >
          {MARKETPLACE.services.label}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeMarket === DASHBOARD_MARKET_TABS.goods}
          onClick={() => onChange(DASHBOARD_MARKET_TABS.goods)}
          className={`rounded-lg px-2 py-2 text-xs font-bold transition sm:text-[13px] ${tabClass(DASHBOARD_MARKET_TABS.goods)}`}
        >
          {MARKETPLACE.goods.label}
        </button>
      </div>
    </div>
  );
}

function useSidebarMarketTab() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathMarket = useMemo(
    () => detectMarketFromPath(pathname, searchParams),
    [pathname, searchParams]
  );

  const [marketTab, setMarketTabState] = useState(pathMarket);

  useEffect(() => {
    setMarketTabState(pathMarket);
    try {
      localStorage.setItem(SIDEBAR_MARKET_TAB_KEY, pathMarket);
    } catch {
      /* ignore */
    }
  }, [pathMarket]);

  const setMarketTab = useCallback((market) => {
    setMarketTabState(market);
    try {
      localStorage.setItem(SIDEBAR_MARKET_TAB_KEY, market);
    } catch {
      /* ignore */
    }
  }, []);

  return [marketTab, setMarketTab];
}

export default function DashboardNavLinks({
  onNavigate,
  showSiteLink = true,
  variant = 'desktop',
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userRole = useRole();
  const [activeMarket, setActiveMarket] = useSidebarMarketTab();
  const isMobile = variant === 'mobile';

  const topGroups = useMemo(() => buildFixedTopNavGroups(), []);
  const divarGroups = useMemo(() => buildDivarNavGroups(), []);
  const marketGroups = useMemo(
    () => buildMarketNavGroups(activeMarket, userRole),
    [activeMarket, userRole]
  );
  const bottomGroups = useMemo(() => buildFixedBottomNavGroups(userRole), [userRole]);

  const isActive = (path, exact) => matchDashboardPath(pathname, searchParams, path, exact);

  const renderGroups = (groups, { withDivider = false } = {}) =>
    groups.map((group, index) => (
      <div key={group.id}>
        {withDivider && index === 0 ? (
          <div className={`${isMobile ? 'mx-1 my-2' : 'mx-3 my-3'} h-px bg-slate-100`} aria-hidden />
        ) : null}
        <NavGroupSection group={group} isActive={isActive} onNavigate={onNavigate} variant={variant} />
      </div>
    ));

  return (
    <nav
      className={isMobile ? 'flex flex-col px-2' : 'flex flex-col'}
      aria-label="منوی داشبورد"
    >
      {renderGroups(topGroups)}

      <div className={isMobile ? 'mt-2' : 'mt-3 px-1'}>
        {renderGroups(divarGroups)}
      </div>

      <div className={isMobile ? 'mt-3 px-0' : 'mt-4 px-2'}>
        <DashboardMarketplaceTabs
          activeMarket={activeMarket}
          onChange={setActiveMarket}
          variant={variant}
        />
      </div>

      <div className={isMobile ? 'mt-2' : 'mt-3 px-1'}>
        {renderGroups(marketGroups)}
      </div>

      {renderGroups(bottomGroups, { withDivider: true })}

      {showSiteLink ? (
        <div className={isMobile ? 'mt-2 border-t border-slate-100 pt-2' : 'mt-5 px-2 pb-2'}>
          <Link
            href="/"
            scroll={false}
            onClick={onNavigate}
            className={`flex items-center justify-center gap-2 font-medium text-slate-600 transition hover:bg-slate-50 hover:text-teal-800 active:bg-slate-100 ${
              isMobile
                ? 'rounded-lg py-2 text-xs'
                : 'rounded-2xl border border-slate-200 bg-slate-50 py-3.5 text-sm hover:border-teal-200'
            }`}
          >
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden />
            بازگشت به سایت
          </Link>
        </div>
      ) : null}
    </nav>
  );
}

export { useSidebarMarketTab };
