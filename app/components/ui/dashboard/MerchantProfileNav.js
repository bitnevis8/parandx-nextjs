'use client';

export const MERCHANT_SECTION_OVERVIEW = 'merchant-overview';

export const MERCHANT_SECTION_IDS = {
  subcategories: 'merchant-subcategories',
  identity: 'merchant-identity',
  contacts: 'merchant-contacts',
  serviceArea: 'merchant-service-area',
  intro: 'merchant-intro',
  location: 'merchant-location',
  presence: 'merchant-presence',
  portfolio: 'merchant-portfolio',
  verification: 'merchant-verification',
};

/** سازگاری با لینک‌های قدیمی */
const LEGACY_SECTION_ALIASES = {
  'merchant-categories': MERCHANT_SECTION_IDS.subcategories,
  'merchant-service': MERCHANT_SECTION_IDS.serviceArea,
  'merchant-hours': MERCHANT_SECTION_IDS.presence,
};

export const MERCHANT_SECTION_LABELS = {
  [MERCHANT_SECTION_OVERVIEW]: 'مرور کلی',
  [MERCHANT_SECTION_IDS.subcategories]: 'زیردسته‌های کالا',
  [MERCHANT_SECTION_IDS.identity]: 'مشخصات کاسب',
  [MERCHANT_SECTION_IDS.contacts]: 'راه‌های تماس',
  [MERCHANT_SECTION_IDS.serviceArea]: 'پوشش و ارائه',
  [MERCHANT_SECTION_IDS.intro]: 'سابقه کاری',
  [MERCHANT_SECTION_IDS.location]: 'محل فعالیت',
  [MERCHANT_SECTION_IDS.presence]: 'حضور و ساعات',
  [MERCHANT_SECTION_IDS.portfolio]: 'نمونه‌کارها',
  [MERCHANT_SECTION_IDS.verification]: 'احراز و مدارک',
};

export const MERCHANT_NAV_ITEMS = [
  { id: MERCHANT_SECTION_OVERVIEW, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_OVERVIEW] },
  { id: MERCHANT_SECTION_IDS.subcategories, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.subcategories] },
  { id: MERCHANT_SECTION_IDS.identity, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.identity] },
  { id: MERCHANT_SECTION_IDS.contacts, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.contacts] },
  { id: MERCHANT_SECTION_IDS.serviceArea, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.serviceArea] },
  { id: MERCHANT_SECTION_IDS.intro, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.intro] },
  { id: MERCHANT_SECTION_IDS.location, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.location] },
  { id: MERCHANT_SECTION_IDS.presence, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.presence] },
  { id: MERCHANT_SECTION_IDS.portfolio, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.portfolio] },
  { id: MERCHANT_SECTION_IDS.verification, label: MERCHANT_SECTION_LABELS[MERCHANT_SECTION_IDS.verification] },
];

export function isMerchantProfileTab(tab) {
  return tab?.startsWith('merchant-');
}

export function resolveMerchantSection(value) {
  if (!value) return MERCHANT_SECTION_OVERVIEW;
  const normalized = LEGACY_SECTION_ALIASES[value] || value;
  return MERCHANT_NAV_ITEMS.some((item) => item.id === normalized)
    ? normalized
    : MERCHANT_SECTION_OVERVIEW;
}

export function buildMerchantDashboardQuery(tab, { userId, section } = {}) {
  const params = new URLSearchParams({ tab });
  if (userId) params.set('userId', userId);
  if (isMerchantProfileTab(tab)) {
    const resolved = resolveMerchantSection(section);
    if (resolved !== MERCHANT_SECTION_OVERVIEW) {
      params.set('section', resolved);
    }
  }
  return `?${params.toString()}`;
}

export default function MerchantProfileNav({
  activeSection = MERCHANT_SECTION_OVERVIEW,
  onSectionChange,
  className = '',
}) {
  return (
    <nav
      aria-label="پیمایش بخش‌های پروفایل فروشگاه"
      className={`rounded-xl border border-gray-200 bg-white/95 p-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90 ${className}`}
    >
      <ul className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
        {MERCHANT_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSectionChange?.(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MerchantPageLayout({ sidebar, children, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6 xl:gap-8 ${className}`}
    >
      <aside className="order-1 min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:sticky lg:top-[4.5rem] lg:self-start">
        {sidebar}
      </aside>
      <div className="order-2 min-w-0 space-y-4 lg:order-none lg:col-start-1 lg:row-start-1">
        {children}
      </div>
    </div>
  );
}

export function MerchantSidebarCard({
  id,
  title,
  description,
  children,
  className = '',
  unconstrained = false,
}) {
  return (
    <section
      id={id}
      className={`flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm ring-1 ring-amber-50/80 ${
        unconstrained ? '' : 'max-h-[min(calc(100vh-5.5rem),52rem)]'
      } ${className}`}
    >
      <header className="shrink-0 border-b border-amber-50 bg-gradient-to-bl from-amber-50/80 to-white px-4 py-3.5 sm:px-5">
        <h2 className="text-sm font-bold text-gray-900 sm:text-base">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{description}</p>
        ) : null}
      </header>
      <div
        className={`min-h-0 flex-1 px-4 py-4 sm:px-5 ${
          unconstrained ? '' : 'overflow-y-auto overscroll-contain'
        }`}
      >
        {children}
      </div>
    </section>
  );
}
