'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { API_ENDPOINTS } from '../../config/api';
import StoreCategoriesPicker from './StoreCategoriesPicker';
import MerchantProfileNav, {
  MERCHANT_NAV_ITEMS,
  MERCHANT_SECTION_IDS,
  MERCHANT_SECTION_OVERVIEW,
  MerchantPageLayout,
  MerchantSidebarCard,
} from './dashboard/MerchantProfileNav';
import { ProfileModeToggleRow } from './dashboard/ProfileModeAside';
import { DashboardLoading } from './dashboard/DashboardUi';
import {
  ProfilePanel,
  ProfilePanelGroup,
  ProfilePanelRow,
  ProfileViewEmpty,
} from './dashboard/ProfileViewUi';
import {
  ExpertStatusBadge,
  VerificationBadgeList,
  buildExpertBadges,
} from './ProfileVerificationUi';
import {
  MerchantIdentityDisplay,
  MerchantContactNumbersDisplay,
  MerchantServiceDisplay,
  MerchantPresenceDisplay,
  MerchantIntroDisplay,
  MerchantPortfolioDisplay,
} from './MerchantProfileSections';
import { ProfileAddressesPanel, getPrimaryAddressMapProps } from './ProfileAddressesDisplay';
import { normalizeProfileAddresses } from '../../utils/profileAddressUtils';
import { defaultMerchantStoreName } from '../../utils/merchantProfileUtils';
import { resolveGoodsGlbModel } from '../../config/mapGoods3dIcons';
import { useCategoryMapModels } from '../../hooks/useCategoryMapModels';
import { useProfileTarget } from '../../hooks/useProfileTarget';
import { ManagedUserBanner } from './dashboard/ManagedUserBanner';

const CityAddressMap = dynamic(() => import('./CityAddressMap'), { ssr: false });

export default function MerchantDisplay({
  targetUserId,
  mode = 'view',
  onSwitchToView,
  onSwitchToEdit,
  activeSection = MERCHANT_SECTION_OVERVIEW,
  onSectionChange,
}) {
  const { isManagingOther } = useProfileTarget(targetUserId);
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(API_ENDPOINTS.cities.getAll)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCities(res.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let url = API_ENDPOINTS.merchants.getCurrentProfile;
    if (targetUserId) url = `${API_ENDPOINTS.merchants.getUserProfile}?userId=${targetUserId}`;

    fetch(url, { credentials: 'include' })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((result) => {
        if (result?.success) setProfile(result.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [targetUserId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const addresses = useMemo(() => {
    if (!profile) return [];
    return normalizeProfileAddresses(profile.addresses, profile, {
      lineField: 'location',
      dataField: 'locationData',
    });
  }, [profile]);

  const mapProps = useMemo(
    () => getPrimaryAddressMapProps(addresses, cities),
    [addresses, cities]
  );

  const { registry: mapModelRegistry } = useCategoryMapModels('goods');

  const pinMarkerGlb = useMemo(
    () =>
      resolveGoodsGlbModel(
        profile?.primaryCategorySlug || profile?.categories?.[0]?.slug,
        mapModelRegistry
      ),
    [profile, mapModelRegistry]
  );

  if (loading) return <DashboardLoading />;

  if (notFound || !profile) {
    return (
      <ProfileViewEmpty
        title="پروفایل فروشگاه هنوز ایجاد نشده"
        description="از تب «ویرایش» برای ایجاد و تکمیل پروفایل فروشگاه استفاده کنید."
      />
    );
  }

  const user = profile.user;
  const isOverview = activeSection === MERCHANT_SECTION_OVERVIEW;
  const activeNavItem = MERCHANT_NAV_ITEMS.find((item) => item.id === activeSection);
  const { city: activityCity, mapSelection, pinPosition } = mapProps;

  const renderMap = () => {
    if (!activityCity) return null;
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-2 text-xs text-gray-500">
          موقعیت فروشگاه روی نقشه
        </div>
        <div className="h-52 sm:h-64 lg:h-56">
          <CityAddressMap
            key={`${activityCity.slug}-${pinMarkerGlb || 'default'}`}
            city={activityCity}
            mode="preview"
            value={mapSelection}
            showPin
            pinPosition={pinPosition}
            pinMarkerGlb={pinMarkerGlb}
          />
        </div>
      </div>
    );
  };

  const renderOverviewContent = () => (
    <>
      <ProfilePanel flush>
        <MerchantIdentityDisplay profile={profile} />
        <MerchantContactNumbersDisplay
          contactMobiles={profile.contactMobiles}
          contactPhones={profile.contactPhones}
          socialLinks={profile.socialLinks}
        />
        <MerchantServiceDisplay profile={profile} cities={cities} />
        <MerchantIntroDisplay experience={profile.experience} />
      </ProfilePanel>

      <ProfileAddressesPanel addresses={addresses} cities={cities} title="محل فعالیت" />
      {renderMap()}

      <MerchantPresenceDisplay
        presenceStatus={profile.presenceStatus}
        workSchedule={profile.workSchedule}
      />

      <ProfilePanel flush>
        <MerchantPortfolioDisplay portfolio={profile.portfolio} />
      </ProfilePanel>
    </>
  );

  const renderFocusedSection = () => {
    switch (activeSection) {
      case MERCHANT_SECTION_IDS.subcategories:
        return (
          <MerchantSidebarCard
            id={MERCHANT_SECTION_IDS.subcategories}
            title="زیردسته‌های کالا"
            description="زیردسته‌های فعال فروشگاه"
            unconstrained
          >
            <StoreCategoriesPicker
              targetUserId={targetUserId}
              readOnly
              displayMode
              layout="default"
              showSection={false}
            />
          </MerchantSidebarCard>
        );
      case MERCHANT_SECTION_IDS.identity:
        return (
          <ProfilePanel flush>
            <MerchantIdentityDisplay profile={profile} />
          </ProfilePanel>
        );
      case MERCHANT_SECTION_IDS.contacts:
        return (
          <ProfilePanel flush>
            <MerchantContactNumbersDisplay
              contactMobiles={profile.contactMobiles}
              contactPhones={profile.contactPhones}
              socialLinks={profile.socialLinks}
            />
          </ProfilePanel>
        );
      case MERCHANT_SECTION_IDS.serviceArea:
        return (
          <ProfilePanel flush>
            <MerchantServiceDisplay profile={profile} cities={cities} />
          </ProfilePanel>
        );
      case MERCHANT_SECTION_IDS.intro:
        return (
          <ProfilePanel flush>
            <MerchantIntroDisplay experience={profile.experience} />
          </ProfilePanel>
        );
      case MERCHANT_SECTION_IDS.location:
        return (
          <>
            <ProfileAddressesPanel addresses={addresses} cities={cities} title="محل فعالیت" />
            {renderMap()}
          </>
        );
      case MERCHANT_SECTION_IDS.presence:
        return (
          <MerchantPresenceDisplay
            presenceStatus={profile.presenceStatus}
            workSchedule={profile.workSchedule}
          />
        );
      case MERCHANT_SECTION_IDS.portfolio:
        return (
          <ProfilePanel flush>
            <MerchantPortfolioDisplay portfolio={profile.portfolio} />
          </ProfilePanel>
        );
      case MERCHANT_SECTION_IDS.verification:
        return (
          <ProfilePanel flush>
            <ProfilePanelGroup title="وضعیت احراز">
              <div className="px-4 py-3">
                <VerificationBadgeList items={buildExpertBadges(profile, user)} />
              </div>
            </ProfilePanelGroup>
          </ProfilePanel>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 px-3 pb-4 sm:px-6">
      {isManagingOther ? <ManagedUserBanner user={user} targetUserId={targetUserId} /> : null}

      <div className="sticky top-2 z-20 space-y-2">
        <MerchantProfileNav activeSection={activeSection} onSectionChange={onSectionChange} />
        <ProfileModeToggleRow mode={mode} onSwitchToView={onSwitchToView} onSwitchToEdit={onSwitchToEdit} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ExpertStatusBadge status={profile.status} />
        <VerificationBadgeList items={buildExpertBadges(profile, user)} />
        <span className="text-sm font-bold text-gray-900">{defaultMerchantStoreName(profile)}</span>
      </div>

      {!isOverview && activeNavItem ? (
        <p className="text-xs text-gray-500 sm:text-sm">
          در حال مشاهده: <span className="font-medium text-gray-700">{activeNavItem.label}</span>
          {' · '}
          <button
            type="button"
            onClick={() => onSectionChange?.(MERCHANT_SECTION_OVERVIEW)}
            className="font-medium text-amber-700 hover:text-amber-800"
          >
            بازگشت به مرور کلی
          </button>
        </p>
      ) : null}

      {isOverview ? (
        <MerchantPageLayout
          sidebar={
            <MerchantSidebarCard
              id={MERCHANT_SECTION_IDS.subcategories}
              title="زیردسته‌های کالا"
              description="زیردسته‌های فعال فروشگاه"
            >
              <StoreCategoriesPicker
                targetUserId={targetUserId}
                readOnly
                displayMode
                layout="sidebar"
                showSection={false}
              />
            </MerchantSidebarCard>
          }
        >
          {renderOverviewContent()}
        </MerchantPageLayout>
      ) : (
        renderFocusedSection()
      )}
    </div>
  );
}
