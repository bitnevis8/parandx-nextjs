'use client';

import { usePathname } from 'next/navigation';
import SiteSearchBox from '../SiteSearchBox';
import { shouldShowMarketplaceSwitcher } from '../../marketplace/MarketplaceSwitcher';
import { resolveMarketplaceFromPath } from '../../../config/marketplaceConfig';

export default function HeaderMobileSearch() {
  const pathname = usePathname() || '/';

  if (!shouldShowMarketplaceSwitcher(pathname)) return null;

  const market = resolveMarketplaceFromPath(pathname);
  if (market.type === 'divar') return null;

  const marketplaceType = market.categoriesApiType;

  return (
    <div
      className={`md:hidden border-t bg-gray-50 px-2 pb-2 pt-1.5 dark:border-white/10 dark:bg-transparent min-[420px]:px-3 ${
        marketplaceType === 'goods' ? 'border-amber-100/80 dark:border-amber-900/40' : 'border-gray-200'
      }`}
    >
      <SiteSearchBox
        key={marketplaceType}
        variant="mobileHeader"
        marketplaceType={marketplaceType}
        inputId={`mobile-header-search-${marketplaceType}`}
      />
    </div>
  );
}
