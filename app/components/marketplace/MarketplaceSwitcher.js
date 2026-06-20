'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBagIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { MARKETPLACE, resolveMarketplaceFromPath } from '../../config/marketplaceConfig';

const ACCENT = {
  services: {
    icon: 'text-teal-600',
    text: 'text-gray-900',
    focusRing: 'focus-visible:ring-teal-500/30',
    segmentOn: 'bg-white text-teal-700 shadow-sm ring-1 ring-teal-100/80',
    segmentOff: 'text-gray-500 hover:text-gray-600',
  },
  goods: {
    icon: 'text-amber-600',
    text: 'text-gray-900',
    focusRing: 'focus-visible:ring-amber-500/30',
    segmentOn: 'bg-white text-amber-700 shadow-sm ring-1 ring-amber-100/80',
    segmentOff: 'text-gray-500 hover:text-gray-600',
  },
};

function SwitchTab({ href, active, icon: Icon, label, accentKey }) {
  const accent = ACCENT[accentKey];

  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={`
        group flex shrink-0 items-center justify-center gap-2 overflow-visible py-0.5
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${accent.focusRing}
        ${active ? accent.text : 'text-gray-400 hover:text-gray-600'}
      `}
    >
      <Icon
        className={`
          h-5 w-5 shrink-0 transition-all duration-200
          ${active ? `${accent.icon} grayscale-0 opacity-100` : 'text-gray-500 grayscale opacity-55 group-hover:opacity-70'}
        `}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden
      />
      <span className={`whitespace-nowrap text-[13px] leading-normal ${active ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </Link>
  );
}

function TabDivider() {
  return (
    <div className="flex shrink-0 items-center px-3" aria-hidden>
      <span className="h-6 w-px bg-gray-200/70" />
    </div>
  );
}

function MobileSegment({ href, active, icon: Icon, label, accentKey }) {
  const accent = ACCENT[accentKey];

  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={`
        flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2
        text-[11px] font-semibold leading-none transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        min-[420px]:gap-1.5 min-[420px]:text-xs
        ${accent.focusRing}
        ${active ? accent.segmentOn : accent.segmentOff}
      `}
    >
      <Icon
        className={`h-3.5 w-3.5 shrink-0 min-[420px]:h-4 min-[420px]:w-4 ${active ? accent.icon : 'text-gray-400'}`}
        strokeWidth={active ? 2.25 : 1.75}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function shouldShowMarketplaceSwitcher(pathname = '') {
  if (!pathname) return true;
  if (pathname.startsWith('/dashboard')) return false;
  if (pathname.startsWith('/auth')) return false;
  if (pathname === '/divar' || pathname.startsWith('/divar/')) return false;
  return true;
}

export default function MarketplaceSwitcher({ variant = 'header', className = '' }) {
  const pathname = usePathname() || '/';
  const market = resolveMarketplaceFromPath(pathname);
  const isGoods = market.type === 'goods';
  const isServices = !isGoods;
  const isHeader = variant === 'header';

  if (isHeader) {
    return (
      <>
        <nav
          aria-label="انتخاب بخش"
          dir="rtl"
          className={`md:hidden grid w-[8.75rem] grid-cols-2 gap-0.5 rounded-xl bg-gray-100 p-0.5 ring-1 ring-gray-200/90 min-[420px]:w-[9.5rem] ${className}`}
        >
          <MobileSegment
            href="/"
            active={isServices}
            accentKey="services"
            icon={WrenchScrewdriverIcon}
            label={MARKETPLACE.services.label}
          />
          <MobileSegment
            href="/goods"
            active={isGoods}
            accentKey="goods"
            icon={ShoppingBagIcon}
            label={MARKETPLACE.goods.label}
          />
        </nav>

        <nav
          aria-label="انتخاب بخش"
          dir="rtl"
          className={`hidden md:inline-flex max-w-full items-center overflow-visible min-h-10 ${className}`}
        >
          <SwitchTab
            href="/"
            active={isServices}
            accentKey="services"
            icon={WrenchScrewdriverIcon}
            label={MARKETPLACE.services.label}
          />
          <TabDivider />
          <SwitchTab
            href="/goods"
            active={isGoods}
            accentKey="goods"
            icon={ShoppingBagIcon}
            label={MARKETPLACE.goods.label}
          />
        </nav>
      </>
    );
  }

  return (
    <nav
      aria-label="انتخاب بخش"
      dir="rtl"
      className={`inline-flex min-h-10 w-full max-w-[18rem] items-center justify-center overflow-visible ${className}`}
    >
      <SwitchTab
        href="/"
        active={isServices}
        accentKey="services"
        icon={WrenchScrewdriverIcon}
        label={MARKETPLACE.services.label}
      />
      <TabDivider />
      <SwitchTab
        href="/goods"
        active={isGoods}
        accentKey="goods"
        icon={ShoppingBagIcon}
        label={MARKETPLACE.goods.label}
      />
    </nav>
  );
}
