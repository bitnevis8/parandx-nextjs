export const MARKETPLACE = {
  services: {
    type: 'services',
    basePath: '/',
    label: 'خدمات',
    shortLabel: 'خدمات',
    categoriesHash: '#home-path-categories',
    mapHash: '#home-path-map',
    requestHash: '#home-path-request',
    categoriesApiType: 'services',
  },
  goods: {
    type: 'goods',
    basePath: '/goods',
    label: 'کالا',
    shortLabel: 'کالا',
    categoriesHash: '#home-path-categories',
    mapHash: '#home-path-map',
    requestHash: '#home-path-need',
    categoriesApiType: 'goods',
  },
  divar: {
    type: 'divar',
    basePath: '/divar',
    label: 'دیوار',
    shortLabel: 'دیوار',
    categoriesHash: '#divar-categories',
    categoriesApiType: 'goods',
    listingCategoryUsage: 'listing',
    digitalParentSlug: 'mobile-computer-digital',
  },
};

export function getMarketplaceConfig(type = 'services') {
  return MARKETPLACE[type] || MARKETPLACE.services;
}

export function resolveMarketplaceFromPath(pathname = '') {
  if (pathname === '/divar' || pathname.startsWith('/divar/')) {
    return MARKETPLACE.divar;
  }
  if (pathname === '/goods' || pathname.startsWith('/goods/')) {
    return MARKETPLACE.goods;
  }
  return MARKETPLACE.services;
}
