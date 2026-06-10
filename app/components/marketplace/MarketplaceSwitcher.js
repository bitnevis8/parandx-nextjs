'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { MARKETPLACE } from '../../config/marketplaceConfig';

function isGoodsPath(pathname = '') {
  return pathname === '/goods' || pathname.startsWith('/goods/');
}

const ACCENT = {
  services: {
    icon: 'text-teal-600',
    text: 'text-gray-900',
    focusRing: 'focus-visible:ring-teal-500/30',
  },
  goods: {
    icon: 'text-amber-600',
    text: 'text-gray-900',
    focusRing: 'focus-visible:ring-amber-500/30',
  },
};

function SwitchTab({ href, active, icon: Icon, shortLabel, label, accentKey }) {
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
        sm:gap-2.5
        ${accent.focusRing}
        ${active ? accent.text : 'text-gray-400 hover:text-gray-600'}
      `}
    >
      <Icon
        className={`
          h-[1.15rem] w-[1.15rem] shrink-0 transition-all duration-200 sm:h-5 sm:w-5
          ${active ? `${accent.icon} grayscale-0 opacity-100` : 'text-gray-500 grayscale opacity-55 group-hover:opacity-70'}
        `}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden
      />
      <span
        className={`whitespace-nowrap text-[11px] leading-normal sm:hidden ${active ? 'font-bold' : 'font-medium'}`}
      >
        {shortLabel}
      </span>
      <span
        className={`hidden whitespace-nowrap text-[13px] leading-normal sm:inline ${active ? 'font-bold' : 'font-medium'}`}
      >
        {label}
      </span>
    </Link>
  );
}

export function shouldShowMarketplaceSwitcher(pathname = '') {
  if (!pathname) return true;
  if (pathname.startsWith('/dashboard')) return false;
  if (pathname.startsWith('/auth')) return false;
  return true;
}

export default function MarketplaceSwitcher({ variant = 'header', className = '' }) {
  const pathname = usePathname() || '/';
  const isGoods = isGoodsPath(pathname);
  const isHeader = variant === 'header';

  return (
    <nav
      aria-label="انتخاب نوع بازار"
      dir="rtl"
      className={`
        inline-flex items-center overflow-visible
        ${isHeader ? 'min-h-10 w-auto' : 'min-h-10 w-full max-w-[22rem] justify-center'}
        ${className}
      `}
    >
      <SwitchTab
        href="/"
        active={!isGoods}
        accentKey="services"
        icon={WrenchScrewdriverIcon}
        shortLabel={MARKETPLACE.services.shortLabel}
        label={MARKETPLACE.services.label}
      />
      <div className="flex shrink-0 items-center px-3 sm:px-4" aria-hidden>
        <span className="h-5 w-px bg-gray-200/70 sm:h-6" />
      </div>
      <SwitchTab
        href="/goods"
        active={isGoods}
        accentKey="goods"
        icon={ShoppingBagIcon}
        shortLabel={MARKETPLACE.goods.shortLabel}
        label={MARKETPLACE.goods.label}
      />
    </nav>
  );
}
