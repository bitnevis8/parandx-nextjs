import {
  UserIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  PlusCircleIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  UsersIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  MapIcon,
  CubeIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { MARKETPLACE } from '../../../config/marketplaceConfig';

export const SIDEBAR_MARKET_TAB_KEY = 'parandx-dashboard-market-tab';

export const DASHBOARD_MARKET_TABS = {
  services: 'services',
  goods: 'goods',
};

/** تم بصری هر بخش در سایدبار */
export const DASHBOARD_SECTION_THEMES = {
  default: {
    accent: 'teal',
    headerClass: 'text-slate-500',
    activeNavClass: 'bg-teal-600 text-white',
    iconWrapActive: 'bg-white/20',
    iconWrapIdle: 'bg-slate-100 text-teal-600',
  },
  services: {
    accent: 'teal',
    headerClass: 'text-teal-800',
    activeNavClass: 'bg-teal-600 text-white shadow-sm shadow-teal-600/15',
    iconWrapActive: 'bg-white/20',
    iconWrapIdle: 'bg-teal-50 text-teal-700',
  },
  goods: {
    accent: 'amber',
    headerClass: 'text-amber-900',
    activeNavClass: 'bg-amber-600 text-white shadow-sm shadow-amber-600/15',
    iconWrapActive: 'bg-white/20',
    iconWrapIdle: 'bg-amber-50 text-amber-700',
  },
  divar: {
    accent: 'violet',
    headerClass: 'text-violet-900',
    activeNavClass: 'bg-violet-600 text-white shadow-sm shadow-violet-600/15',
    iconWrapActive: 'bg-white/20',
    iconWrapIdle: 'bg-violet-50 text-violet-700',
  },
};

export function matchDashboardPath(pathname, searchParams, path, exact = false) {
  if (path.includes('?tab=')) {
    const [basePath, tab] = path.split('?tab=');
    return pathname === basePath && searchParams.get('tab') === tab;
  }
  if (path.includes('#')) {
    const [basePath] = path.split('#');
    return pathname === basePath || pathname.startsWith(`${basePath}/`);
  }
  if (exact) {
    return pathname === path && !searchParams.get('tab');
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** تشخیص بازار فعال از مسیر فعلی */
export function detectMarketFromPath(pathname = '', searchParams) {
  const tab = searchParams?.get?.('tab') || '';

  if (pathname === '/goods' || pathname.startsWith('/goods/')) {
    return DASHBOARD_MARKET_TABS.goods;
  }
  if (pathname.startsWith('/dashboard/goods/')) {
    return DASHBOARD_MARKET_TABS.goods;
  }
  if (tab.startsWith('merchant-')) {
    return DASHBOARD_MARKET_TABS.goods;
  }
  if (
    tab.startsWith('expert-') ||
    pathname.startsWith('/dashboard/expert/') ||
    pathname.startsWith('/dashboard/customer/') ||
    pathname.startsWith('/requests')
  ) {
    return DASHBOARD_MARKET_TABS.services;
  }

  return DASHBOARD_MARKET_TABS.services;
}

/** بخش دیوار — همیشه در سایدبار */
export function buildDivarNavGroups() {
  return [
    {
      id: 'divar',
      title: 'دیوار',
      theme: 'divar',
      items: [
        { title: 'آگهی‌های من', path: '/dashboard/divar/my-listings', icon: ClipboardDocumentListIcon },
        { title: 'ثبت آگهی', path: '/divar/new', icon: PlusCircleIcon },
        {
          title: MARKETPLACE.divar.shortLabel,
          path: MARKETPLACE.divar.basePath,
          icon: MegaphoneIcon,
          externalMarket: true,
        },
      ],
    },
  ];
}

/** بخش‌های ثابت بالای سایدبار */
export function buildFixedTopNavGroups() {
  return [
    {
      id: 'account',
      title: 'حساب من',
      theme: 'default',
      items: [
        { title: 'خانه داشبورد', path: '/dashboard', icon: Squares2X2Icon, exact: true },
        { title: 'پروفایل شخصی', path: '/dashboard?tab=profile-display', icon: UserIcon },
      ],
    },
  ];
}

/** زیرمنوهای بازار خدمات — فقط وقتی تب خدمات فعال است */
export function buildServicesMarketGroups(userRole) {
  const groups = [];

  if (userRole.canAccessExpert()) {
    groups.push({
      id: 'services-expert',
      title: 'متخصص',
      theme: 'services',
      items: [
        { title: 'پروفایل تخصصی', path: '/dashboard?tab=expert-display', icon: WrenchScrewdriverIcon },
        { title: 'درخواست‌های دریافتی', path: '/dashboard/expert/requests', icon: ClipboardDocumentListIcon },
        { title: 'شبکه حرفه‌ای', path: '/dashboard/expert/connections', icon: UsersIcon },
        { title: 'نظرات متخصص', path: '/dashboard/expert/reviews', icon: StarIcon },
      ],
    });
  }

  if (userRole.canAccessCustomer()) {
    groups.push({
      id: 'services-customer',
      title: 'کاربر',
      theme: 'services',
      items: [
        { title: 'ثبت کار جدید', path: '/dashboard/customer/new-request', icon: PlusCircleIcon },
        { title: 'درخواست‌های فعال', path: '/dashboard/customer/active-requests', icon: ClipboardDocumentListIcon },
        { title: 'تاریخچه کارها', path: '/dashboard/customer/history', icon: ClockIcon },
        { title: 'نظرات من', path: '/dashboard/customer/my-reviews', icon: ChatBubbleBottomCenterTextIcon },
      ],
    });
  }

  groups.push({
    id: 'services-public',
    title: 'بازار',
    theme: 'services',
    items: [
      {
        title: MARKETPLACE.services.shortLabel,
        path: MARKETPLACE.services.basePath,
        icon: HomeIcon,
        externalMarket: true,
      },
    ],
  });

  return groups;
}

/** زیرمنوهای بازار کالا — فقط وقتی تب کالا فعال است */
export function buildGoodsMarketGroups(userRole) {
  const groups = [];

  if (userRole.canAccessMerchant()) {
    groups.push({
      id: 'goods-merchant',
      title: 'فروشنده',
      theme: 'goods',
      items: [
        { title: 'پروفایل فروشگاه', path: '/dashboard?tab=merchant-display', icon: BuildingStorefrontIcon },
        { title: 'ویرایش فروشگاه', path: '/dashboard?tab=merchant-edit', icon: BuildingStorefrontIcon },
        { title: 'ویترین محصولات', path: '/dashboard/goods/vitrine', icon: ShoppingBagIcon },
        { title: 'فرصت‌های فروش', path: '/dashboard/goods/opportunities', icon: ShoppingBagIcon },
      ],
    });
  }

  groups.push({
    id: 'goods-buyer',
    title: 'خریدار',
    theme: 'goods',
    items: [
      { title: 'ثبت نیاز کالا', path: '/goods/needs/new', icon: PlusCircleIcon },
      { title: 'نیازهای من', path: '/dashboard/goods/my-needs', icon: ClipboardDocumentListIcon },
      { title: 'ثبت عرضه کالا', path: '/goods/supplies/new', icon: CubeIcon },
      { title: 'عرضه‌های من', path: '/dashboard/goods/my-supplies', icon: ClipboardDocumentListIcon },
      { title: 'فرصت‌های خرید', path: '/dashboard/goods/buy-opportunities', icon: ShoppingBagIcon },
      { title: 'نقشه بازار کالا', path: '/dashboard/goods/map', icon: MapIcon },
    ],
  });

  groups.push({
    id: 'goods-public',
    title: 'بازار',
    theme: 'goods',
    items: [
      {
        title: MARKETPLACE.goods.shortLabel,
        path: MARKETPLACE.goods.basePath,
        icon: ShoppingBagIcon,
        externalMarket: true,
      },
    ],
  });

  return groups;
}

export function buildMarketNavGroups(market, userRole) {
  if (market === DASHBOARD_MARKET_TABS.goods) {
    return buildGoodsMarketGroups(userRole);
  }
  return buildServicesMarketGroups(userRole);
}

/** بخش‌های ثابت پایین سایدبار */
export function buildFixedBottomNavGroups(userRole) {
  const groups = [
    {
      id: 'communication',
      title: 'ارتباطات',
      theme: 'default',
      items: [{ title: 'پیام‌ها', path: '/dashboard/messages', icon: ChatBubbleLeftRightIcon }],
    },
  ];

  if (userRole.canAccessAdmin()) {
    groups.push({
      id: 'admin',
      title: 'مدیریت',
      theme: 'default',
      items: [
        { title: 'کاربران', path: '/dashboard/user-management/users', icon: UsersIcon },
        { title: 'نقش‌ها', path: '/dashboard/user-management/roles', icon: ShieldCheckIcon },
        { title: 'استان‌ها و شهرها', path: '/dashboard/user-management/cities', icon: BuildingOffice2Icon },
        { title: 'مراکز', path: '/dashboard/settings/unit-locations', icon: MapPinIcon },
        { title: 'نرخ‌ها', path: '/dashboard/settings/rate-settings', icon: CurrencyDollarIcon },
        { title: 'مدل‌های ۳D نقشه', path: '/dashboard/settings/category-map-models', icon: CubeIcon },
        { title: 'باکس استخدام — جملات و انیمیشن', path: '/dashboard/settings/home-floating-quotes', icon: MegaphoneIcon },
        { title: 'ستاره‌های آسمان شب', path: '/dashboard/settings/night-sky-stars', icon: StarIcon },
      ],
    });
  }

  return groups;
}

/** @deprecated — برای سازگاری با کد قدیمی */
export function buildDashboardSections(userRole) {
  return [
    ...buildFixedTopNavGroups(),
    ...buildServicesMarketGroups(userRole),
    ...buildGoodsMarketGroups(userRole),
    ...buildFixedBottomNavGroups(userRole),
  ];
}

export function buildMobileBottomTabs(userRole) {
  const isExpert = userRole.canAccessExpert();
  const isMerchant = userRole.canAccessMerchant();
  const isCustomer = userRole.canAccessCustomer();

  const tabs = [
    { id: 'home', href: '/dashboard', label: 'خانه', icon: HomeIcon, exact: true },
  ];

  if (isExpert) {
    tabs.push({ id: 'expert-requests', href: '/dashboard/expert/requests', label: 'خدمات', icon: WrenchScrewdriverIcon });
  } else if (isCustomer) {
    tabs.push({ id: 'customer-requests', href: '/dashboard/customer/active-requests', label: 'کارها', icon: ClipboardDocumentListIcon });
  }

  if (isMerchant) {
    tabs.push({ id: 'merchant-profile', href: '/dashboard?tab=merchant-display', label: 'کالا', icon: BuildingStorefrontIcon });
  } else {
    tabs.push({ id: 'goods-market', href: '/goods', label: 'کالا', icon: ShoppingBagIcon });
  }

  tabs.push({ id: 'messages', href: '/dashboard/messages', label: 'پیام‌ها', icon: ChatBubbleLeftRightIcon });

  if (!isExpert && !isMerchant && !isCustomer) {
    tabs.splice(1, 0, { id: 'profile', href: '/dashboard?tab=profile-display', label: 'پروفایل', icon: UserIcon });
  }

  return tabs;
}

export function getDashboardHomeItem() {
  return {
    title: 'خانه داشبورد',
    path: '/dashboard',
    icon: Squares2X2Icon,
    exact: true,
  };
}

const TAB_TITLES = {
  'profile-display': 'پروفایل شخصی',
  'profile-edit': 'ویرایش پروفایل',
  'expert-display': 'پروفایل تخصصی',
  'expert-edit': 'ویرایش تخصصی',
  'merchant-display': 'پروفایل فروشگاه',
  'merchant-edit': 'ویرایش فروشگاه',
};

export function getDashboardMobilePageTitle(pathname, searchParams) {
  const tab = searchParams?.get?.('tab');

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    if (tab && TAB_TITLES[tab]) return TAB_TITLES[tab];
    return 'داشبورد';
  }

  const pathTitles = [
    ['/dashboard/messages', 'پیام‌ها'],
    ['/dashboard/expert/requests', 'درخواست‌های دریافتی'],
    ['/dashboard/expert/connections', 'شبکه حرفه‌ای'],
    ['/dashboard/expert/reviews', 'نظرات'],
    ['/dashboard/customer/new-request', 'ثبت کار'],
    ['/dashboard/customer/active-requests', 'درخواست‌های فعال'],
    ['/dashboard/customer/history', 'تاریخچه'],
    ['/dashboard/customer/my-reviews', 'نظرات من'],
    ['/goods/needs/new', 'ثبت نیاز کالا'],
    ['/goods/supplies/new', 'ثبت عرضه کالا'],
    ['/dashboard/goods/my-needs', 'نیازهای من'],
    ['/dashboard/goods/my-supplies', 'عرضه‌های من'],
    ['/dashboard/goods/opportunities', 'فرصت‌های فروش'],
    ['/dashboard/goods/buy-opportunities', 'فرصت‌های خرید'],
    ['/dashboard/goods/map', 'نقشه بازار کالا'],
    ['/dashboard/goods/vitrine', 'ویترین محصولات'],
    ['/dashboard/divar/my-listings', 'آگهی‌های من'],
    ['/divar/new', 'ثبت آگهی'],
    ['/dashboard/settings/category-map-models', 'مدل‌های ۳D نقشه'],
    ['/dashboard/settings/home-floating-quotes', 'باکس استخدام — جملات و انیمیشن'],
    ['/dashboard/settings/night-sky-stars', 'ستاره‌های آسمان شب'],
    ['/dashboard/user-management/users', 'مدیریت کاربران'],
    ['/dashboard/user-management/roles', 'نقش‌ها'],
    ['/dashboard/user-management/cities', 'شهرها و استان‌ها'],
    ['/dashboard/settings', 'تنظیمات'],
    ['/dashboard/user/personal-edit', 'ویرایش پروفایل'],
    ['/dashboard/user/personal-display', 'پروفایل شخصی'],
    ['/dashboard/user/professional-edit', 'پروفایل تخصصی'],
    ['/dashboard/user/professional-display', 'پروفایل تخصصی'],
  ];

  for (const [prefix, title] of pathTitles) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return title;
  }

  if (pathname === '/goods' || pathname.startsWith('/goods/')) {
    return MARKETPLACE.goods.label;
  }

  if (pathname === '/divar' || pathname.startsWith('/divar/')) {
    return MARKETPLACE.divar.label;
  }

  return 'داشبورد';
}
