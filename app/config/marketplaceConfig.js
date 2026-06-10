export const MARKETPLACE = {
  services: {
    type: 'services',
    basePath: '/',
    label: 'بازار خدمات',
    shortLabel: 'بازار خدمات',
    categoriesHash: '#home-path-categories',
    mapHash: '#home-path-map',
    requestHash: '#home-path-request',
    categoriesApiType: 'services',
  },
  goods: {
    type: 'goods',
    basePath: '/goods',
    label: 'بازار کالا',
    shortLabel: 'بازار کالا',
    categoriesHash: '#home-path-categories',
    mapHash: '#home-path-map',
    requestHash: '#home-path-need',
    categoriesApiType: 'goods',
  },
};

export function getMarketplaceConfig(type = 'services') {
  return MARKETPLACE[type] || MARKETPLACE.services;
}

export function resolveMarketplaceFromPath(pathname = '') {
  if (pathname === '/goods' || pathname.startsWith('/goods/')) {
    return MARKETPLACE.goods;
  }
  return MARKETPLACE.services;
}
