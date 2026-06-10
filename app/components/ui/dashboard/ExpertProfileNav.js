'use client';

export const EXPERT_SECTION_OVERVIEW = 'expert-overview';

export const EXPERT_SECTION_IDS = {
  identity: 'expert-identity',
  contacts: 'expert-contacts',
  serviceArea: 'expert-service-area',
  intro: 'expert-intro',
  location: 'expert-location',
  presence: 'expert-presence',
  schedule: 'expert-schedule',
  portfolio: 'expert-portfolio',
  verification: 'expert-verification',
  professional: 'expert-professional',
  specializations: 'expert-specializations',
};

export const EXPERT_SECTION_LABELS = {
  [EXPERT_SECTION_OVERVIEW]: 'مرور کلی',
  [EXPERT_SECTION_IDS.specializations]: 'تخصص‌ها',
  [EXPERT_SECTION_IDS.identity]: 'هویت حرفه‌ای',
  [EXPERT_SECTION_IDS.contacts]: 'راه‌های تماس',
  [EXPERT_SECTION_IDS.serviceArea]: 'پوشش و ارائه',
  [EXPERT_SECTION_IDS.intro]: 'سابقه کاری',
  [EXPERT_SECTION_IDS.location]: 'محل فعالیت',
  [EXPERT_SECTION_IDS.presence]: 'حضور و ساعات',
  [EXPERT_SECTION_IDS.portfolio]: 'نمونه‌کارها',
  [EXPERT_SECTION_IDS.verification]: 'احراز و مدارک',
};

export const EXPERT_NAV_ITEMS = [
  { id: EXPERT_SECTION_OVERVIEW, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_OVERVIEW] },
  { id: EXPERT_SECTION_IDS.specializations, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.specializations] },
  { id: EXPERT_SECTION_IDS.identity, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.identity] },
  { id: EXPERT_SECTION_IDS.contacts, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.contacts] },
  { id: EXPERT_SECTION_IDS.serviceArea, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.serviceArea] },
  { id: EXPERT_SECTION_IDS.intro, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.intro] },
  { id: EXPERT_SECTION_IDS.location, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.location] },
  { id: EXPERT_SECTION_IDS.presence, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.presence] },
  { id: EXPERT_SECTION_IDS.portfolio, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.portfolio] },
  { id: EXPERT_SECTION_IDS.verification, label: EXPERT_SECTION_LABELS[EXPERT_SECTION_IDS.verification] },
];

export function isExpertProfileTab(tab) {
  return tab?.startsWith('expert-');
}

export function resolveExpertSection(value) {
  if (!value) return EXPERT_SECTION_OVERVIEW;
  return EXPERT_NAV_ITEMS.some((item) => item.id === value) ? value : EXPERT_SECTION_OVERVIEW;
}

export function buildExpertDashboardQuery(tab, { userId, section } = {}) {
  const params = new URLSearchParams({ tab });
  if (userId) params.set('userId', userId);
  if (isExpertProfileTab(tab)) {
    const resolved = resolveExpertSection(section);
    if (resolved !== EXPERT_SECTION_OVERVIEW) {
      params.set('section', resolved);
    }
  }
  return `?${params.toString()}`;
}

export default function ExpertProfileNav({
  activeSection = EXPERT_SECTION_OVERVIEW,
  onSectionChange,
  className = '',
}) {
  return (
    <nav
      aria-label="پیمایش بخش‌های پروفایل تخصصی"
      className={`rounded-xl border border-gray-200 bg-white/95 p-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90 ${className}`}
    >
      <ul className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
        {EXPERT_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSectionChange?.(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
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

/** ستون چپ (تخصص‌ها) و راست (فرم) در RTL */
export function ExpertPageLayout({ sidebar, children, className = '' }) {
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

export function ExpertSidebarCard({
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
      className={`flex flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm ring-1 ring-teal-50/80 ${
        unconstrained ? '' : 'max-h-[min(calc(100vh-5.5rem),52rem)]'
      } ${className}`}
    >
      <header className="shrink-0 border-b border-teal-50 bg-gradient-to-bl from-teal-50/80 to-white px-4 py-3.5 sm:px-5">
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
