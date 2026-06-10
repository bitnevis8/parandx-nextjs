"use client";

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import SpecializationsPicker from './SpecializationsPicker';
import ExpertProfileNav, {
  EXPERT_NAV_ITEMS,
  EXPERT_SECTION_IDS,
  EXPERT_SECTION_OVERVIEW,
  ExpertPageLayout,
  ExpertSidebarCard,
} from './dashboard/ExpertProfileNav';
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
import { parseProfileAddress, normalizeProfileAddresses, getPrimaryAddress } from '../../utils/profileAddressUtils';
import {
  ExpertAccountTypeDisplay,
  ExpertContactNumbersDisplay,
  ExpertPortfolioDisplay,
  ExpertPresenceDisplay,
  ExpertServiceAreaDisplay,
} from './ExpertProfileSections';
import { ProfileAddressesPanel, getPrimaryAddressMapProps } from './ProfileAddressesDisplay';
import { normalizeActivityTypes } from '../../utils/expertProfileUtils';
import { useProfileTarget } from '../../hooks/useProfileTarget';
import { ManagedUserBanner } from './dashboard/ManagedUserBanner';

const CityAddressMap = dynamic(() => import('./CityAddressMap'), { ssr: false });

export default function ExpertDisplay({
  targetUserId,
  mode = 'view',
  onSwitchToView,
  onSwitchToEdit,
  activeSection = EXPERT_SECTION_OVERVIEW,
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
    let url = API_ENDPOINTS.experts.getCurrentProfile;
    if (targetUserId) url = `${API_ENDPOINTS.experts.getUserProfile}?userId=${targetUserId}`;

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

  const primaryAddr = useMemo(() => getPrimaryAddress(addresses), [addresses]);

  const parsed = useMemo(() => {
    if (!primaryAddr) return null;
    return parseProfileAddress({
      cityId: primaryAddr.cityId,
      address: primaryAddr.addressLine,
      addressData: primaryAddr.addressData,
      plaque: primaryAddr.plaque,
      unit: primaryAddr.unit,
      postalCode: primaryAddr.postalCode,
    });
  }, [primaryAddr]);

  const mapProps = useMemo(
    () => getPrimaryAddressMapProps(addresses, cities),
    [addresses, cities]
  );

  const activityTypes = useMemo(
    () => (profile ? normalizeActivityTypes(profile.activityTypes, profile) : null),
    [profile]
  );

  if (loading) return <DashboardLoading />;

  if (notFound || !profile) {
    return (
      <ProfileViewEmpty
        title="پروفایل تخصصی هنوز ایجاد نشده"
        description="برای تکمیل اطلاعات حرفه‌ای، از تب «ویرایش» استفاده کنید."
      />
    );
  }

  const user = profile.user;
  const { city: activityCity, mapSelection, pinPosition } = mapProps;
  const activeCityNames = (profile.activeCityIds || [])
    .map((id) => cities.find((c) => Number(c.id) === Number(id))?.name)
    .filter(Boolean)
    .join('، ');
  const isOverview = activeSection === EXPERT_SECTION_OVERVIEW;
  const activeNavItem = EXPERT_NAV_ITEMS.find((item) => item.id === activeSection);

  const renderUserAccount = () => (
    <ProfilePanelGroup title="حساب کاربری">
      <ProfilePanelRow
        icon={UserIcon}
        label="نام شخصی"
        value={[user?.firstName, user?.lastName].filter(Boolean).join(' ')}
      />
      <ProfilePanelRow
        icon={PhoneIcon}
        label="موبایل شخصی"
        value={user?.mobile}
        dir="ltr"
        emptyText="—"
      />
    </ProfilePanelGroup>
  );

  const renderMap = () =>
    activityCity ? (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-2 text-xs text-gray-500">
          نقشه موقعیت
        </div>
        <div className="h-52 sm:h-64 lg:h-56">
          <CityAddressMap
            key={activityCity.slug}
            city={activityCity}
            mode="preview"
            value={mapSelection}
            showPin
            pinPosition={pinPosition || parsed?.pinPosition}
          />
        </div>
      </div>
    ) : null;

  const renderOverviewContent = () => (
    <>
      <ProfilePanel flush>
        {renderUserAccount()}
        <ExpertAccountTypeDisplay profile={profile} />
        <ExpertContactNumbersDisplay
          contactMobiles={profile.contactMobiles}
          contactPhones={profile.contactPhones}
          socialLinks={profile.socialLinks}
        />
        <ExpertServiceAreaDisplay
          activeCityNames={activeCityNames}
          serviceRadius={profile.serviceRadius}
          activityTypes={activityTypes}
        />
        <ProfilePanelGroup title="سابقه کاری">
          <ProfilePanelRow icon={UserIcon} label="سابقه" value={profile.experience} emptyText="—" />
        </ProfilePanelGroup>
      </ProfilePanel>

      <ProfileAddressesPanel addresses={addresses} cities={cities} title="آدرس‌های محل فعالیت" />

      <ExpertPresenceDisplay
        presenceStatus={profile.presenceStatus}
        workSchedule={profile.workSchedule}
      />

      <ProfilePanel flush>
        <ExpertPortfolioDisplay portfolio={profile.portfolio} />
      </ProfilePanel>

      {renderMap()}
    </>
  );

  const renderFocusedSection = () => {
    switch (activeSection) {
      case EXPERT_SECTION_IDS.specializations:
        return (
          <ExpertSidebarCard
            id={EXPERT_SECTION_IDS.specializations}
            title="تخصص‌ها"
            description="حوزه‌های کاری ثبت‌شده"
            unconstrained
          >
            <SpecializationsPicker
              targetUserId={targetUserId}
              readOnly
              displayMode
              layout="default"
              showSection={false}
            />
          </ExpertSidebarCard>
        );
      case EXPERT_SECTION_IDS.identity:
        return (
          <ProfilePanel flush>
            {renderUserAccount()}
            <ExpertAccountTypeDisplay profile={profile} />
          </ProfilePanel>
        );
      case EXPERT_SECTION_IDS.contacts:
        return (
          <ProfilePanel flush>
            <ExpertContactNumbersDisplay
              contactMobiles={profile.contactMobiles}
              contactPhones={profile.contactPhones}
              socialLinks={profile.socialLinks}
            />
          </ProfilePanel>
        );
      case EXPERT_SECTION_IDS.serviceArea:
        return (
          <ProfilePanel flush>
            <ExpertServiceAreaDisplay
              activeCityNames={activeCityNames}
              serviceRadius={profile.serviceRadius}
              activityTypes={activityTypes}
            />
          </ProfilePanel>
        );
      case EXPERT_SECTION_IDS.intro:
        return (
          <ProfilePanel flush>
            <ProfilePanelGroup title="سابقه کاری">
              <ProfilePanelRow icon={UserIcon} label="سابقه" value={profile.experience} emptyText="—" />
            </ProfilePanelGroup>
          </ProfilePanel>
        );
      case EXPERT_SECTION_IDS.location:
        return (
          <>
            <ProfileAddressesPanel addresses={addresses} cities={cities} title="آدرس‌های محل فعالیت" />
            {renderMap()}
          </>
        );
      case EXPERT_SECTION_IDS.presence:
        return (
          <ExpertPresenceDisplay
            presenceStatus={profile.presenceStatus}
            workSchedule={profile.workSchedule}
          />
        );
      case EXPERT_SECTION_IDS.portfolio:
        return (
          <ProfilePanel flush>
            <ExpertPortfolioDisplay portfolio={profile.portfolio} />
          </ProfilePanel>
        );
      case EXPERT_SECTION_IDS.verification:
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
      {isManagingOther ? (
        <ManagedUserBanner user={user} targetUserId={targetUserId} />
      ) : null}
      <div className="sticky top-2 z-20 space-y-2">
        <ExpertProfileNav activeSection={activeSection} onSectionChange={onSectionChange} />
        <ProfileModeToggleRow
          mode={mode}
          onSwitchToView={onSwitchToView}
          onSwitchToEdit={onSwitchToEdit}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ExpertStatusBadge status={profile.status} />
        <VerificationBadgeList items={buildExpertBadges(profile, user)} />
      </div>

      {!isOverview && activeNavItem ? (
        <p className="text-xs text-gray-500 sm:text-sm">
          در حال مشاهده: <span className="font-medium text-gray-700">{activeNavItem.label}</span>
          {' · '}
          <button
            type="button"
            onClick={() => onSectionChange?.(EXPERT_SECTION_OVERVIEW)}
            className="font-medium text-teal-700 hover:text-teal-800"
          >
            بازگشت به مرور کلی
          </button>
        </p>
      ) : null}

      {isOverview ? (
        <ExpertPageLayout
          sidebar={
            <ExpertSidebarCard
              id={EXPERT_SECTION_IDS.specializations}
              title="تخصص‌ها"
              description="حوزه‌های کاری ثبت‌شده"
            >
              <SpecializationsPicker
                targetUserId={targetUserId}
                readOnly
                displayMode
                layout="sidebar"
                showSection={false}
              />
            </ExpertSidebarCard>
          }
        >
          {renderOverviewContent()}
        </ExpertPageLayout>
      ) : (
        renderFocusedSection()
      )}
    </div>
  );
}
