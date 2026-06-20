'use client';

import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { normalizeProfileAddresses } from '../../utils/profileAddressUtils';
import {
  formatMerchantActivityTypesSummary,
  getMerchantDeliveryRadiusLabel,
  mergePersonalMobileIntoContactMobiles,
} from '../../utils/merchantProfileUtils';
import {
  MerchantContactNumbersDisplay,
  MerchantIdentityDisplay,
} from '../ui/MerchantProfileSections';
import { ProfilePanel, ProfilePanelRow } from '../ui/dashboard/ProfileViewUi';
import ShopVitrineSection from '../vitrine/ShopVitrineSection';
import MerchantPublicProfileHeader from './MerchantPublicProfileHeader';
import {
  MerchantPublicAddressesList,
  MerchantPublicBioBlock,
  MerchantPublicCategories,
  MerchantPublicPortfolioGallery,
  MerchantPublicPresenceSection,
} from './MerchantPublicProfileParts';

const SECTIONS = [
  { id: 'vitrine', label: 'ویترین' },
  { id: 'about', label: 'درباره' },
  { id: 'categories', label: 'دسته کالا' },
  { id: 'contact', label: 'تماس' },
  { id: 'location', label: 'موقعیت' },
  { id: 'portfolio', label: 'نمونه‌کار' },
];

function SectionCard({ id, title, description, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-amber-100/90 bg-white shadow-sm"
    >
      <header className="border-b border-amber-50 px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{description}</p>
        ) : null}
      </header>
      <div>{children}</div>
    </section>
  );
}

const DEFAULT_SECTION = 'about';

export default function MerchantPublicProfile({ merchant }) {
  const [cities, setCities] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);

  useEffect(() => {
    fetch(API_ENDPOINTS.cities.getAll)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCities((res.data || []).filter((c) => c.isActive !== false));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!merchant?.id) return;
    setProductsLoading(true);
    fetch(API_ENDPOINTS.shopProducts.byMerchant(merchant.id))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProducts(res.data || []);
      })
      .catch(console.error)
      .finally(() => setProductsLoading(false));
  }, [merchant?.id]);

  const addresses = useMemo(
    () =>
      normalizeProfileAddresses(merchant?.addresses, merchant, {
        lineField: 'location',
        dataField: 'locationData',
      }),
    [merchant]
  );

  const displayContactMobiles = useMemo(
    () => mergePersonalMobileIntoContactMobiles(merchant?.contactMobiles, merchant?.user?.mobile),
    [merchant?.contactMobiles, merchant?.user?.mobile]
  );

  const activeCityNames = useMemo(
    () =>
      (merchant?.activeCityIds || [])
        .map((id) => cities.find((c) => Number(c.id) === Number(id))?.name)
        .filter(Boolean)
        .join('، '),
    [merchant?.activeCityIds, cities]
  );

  const visibleSections = useMemo(() => {
    return SECTIONS.filter((section) => {
      if (section.id === 'vitrine') return products.length > 0 || productsLoading;
      if (section.id === 'portfolio') return (merchant?.portfolio || []).length > 0;
      if (section.id === 'location') return addresses.length > 0;
      return true;
    });
  }, [products.length, productsLoading, merchant?.portfolio, addresses.length]);

  useEffect(() => {
    if (!visibleSections.some((s) => s.id === activeSection)) {
      setActiveSection(visibleSections[0]?.id || DEFAULT_SECTION);
    }
  }, [visibleSections, activeSection]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(`public-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="sticky top-0 z-20 bg-amber-50/95 backdrop-blur-sm">
        <MerchantPublicProfileHeader
          merchant={merchant}
          sections={visibleSections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      </div>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
        {merchant?.status && merchant.status !== 'approved' ? (
          <div
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            این فروشگاه هنوز توسط تیم پرند ایکس تأیید نشده است.
          </div>
        ) : null}

        {(products.length > 0 || productsLoading) && (
          <SectionCard
            id="public-vitrine"
            title="ویترین فروشگاه"
            description="محصولات و کالاهای این مغازه"
          >
            <div className="p-4 sm:p-5">
              <ShopVitrineSection products={products} loading={productsLoading} />
            </div>
          </SectionCard>
        )}

        <SectionCard
          id="public-about"
          title="آشنایی با فروشگاه"
          description="معرفی، سابقه و مشخصات کسب‌وکار"
        >
          <div className="space-y-5 p-4 sm:p-5">
            <MerchantPublicBioBlock
              description={merchant?.description}
              experience={merchant?.experience}
            />
            <ProfilePanel flush className="border border-amber-50 shadow-none">
              <MerchantIdentityDisplay profile={merchant} />
              {activeCityNames ? (
                <ProfilePanelRow label="شهر فعالیت" value={activeCityNames} />
              ) : null}
              {merchant?.deliveryRadius ? (
                <ProfilePanelRow
                  label="محدوده ارسال"
                  value={getMerchantDeliveryRadiusLabel(merchant.deliveryRadius)}
                />
              ) : null}
              {merchant?.activityTypes ? (
                <ProfilePanelRow
                  label="نحوه خرید"
                  value={formatMerchantActivityTypesSummary(merchant.activityTypes)}
                />
              ) : null}
            </ProfilePanel>
          </div>
        </SectionCard>

        <SectionCard
          id="public-categories"
          title="دسته‌های کالا"
          description="کالاهایی که در این فروشگاه پیدا می‌کنید"
        >
          <div className="p-4 sm:p-5">
            <MerchantPublicCategories categories={merchant?.categories} />
          </div>
        </SectionCard>

        <SectionCard id="public-contact" title="تماس و ارتباط">
          <ProfilePanel flush className="border-0 shadow-none rounded-none">
            <MerchantContactNumbersDisplay
              contactMobiles={displayContactMobiles}
              contactPhones={merchant?.contactPhones}
              socialLinks={merchant?.socialLinks}
              linkable
            />
          </ProfilePanel>
          <MerchantPublicPresenceSection
            presenceStatus={merchant?.presenceStatus}
            workSchedule={merchant?.workSchedule}
          />
        </SectionCard>

        {addresses.length > 0 ? (
          <SectionCard
            id="public-location"
            title="موقعیت و آدرس"
            description={
              addresses.length > 1
                ? `${addresses.length} آدرس ثبت‌شده`
                : 'محل فروشگاه روی نقشه'
            }
          >
            <MerchantPublicAddressesList addresses={addresses} cities={cities} />
          </SectionCard>
        ) : null}

        {(merchant?.portfolio || []).length > 0 ? (
          <SectionCard id="public-portfolio" title="نمونه‌کارها">
            <MerchantPublicPortfolioGallery portfolio={merchant.portfolio} />
          </SectionCard>
        ) : null}
      </main>
    </div>
  );
}
