"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { DashboardLoading } from './dashboard/DashboardUi';
import {
  ProfilePanel,
  ProfilePanelGroup,
  ProfilePanelRow,
  ProfileViewVerifyBadge,
} from './dashboard/ProfileViewUi';
import {
  VerificationBadgeList,
  buildCustomerBadges,
} from './ProfileVerificationUi';
import { normalizeProfileAddresses } from '../../utils/profileAddressUtils';
import { ProfileAddressesPanel } from './ProfileAddressesDisplay';
import { ProfileModeToggleRow } from './dashboard/ProfileModeAside';
import { useProfileTarget } from '../../hooks/useProfileTarget';
import { ManagedUserBanner } from './dashboard/ManagedUserBanner';

export default function ProfileDisplay({
  targetUserId = null,
  mode = 'view',
  onSwitchToView,
  onSwitchToEdit,
}) {
  const { profileFetchUrl, isManagingOther, canManageOther } = useProfileTarget(targetUserId);
  const showAdminInfo = isManagingOther && canManageOther;
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.cities.getAll)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCities(res.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(profileFetchUrl, { credentials: 'include' })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setProfile(result.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profileFetchUrl]);

  const addresses = useMemo(() => {
    if (!profile) return [];
    return normalizeProfileAddresses(profile.addresses, profile);
  }, [profile]);

  if (loading) return <DashboardLoading />;
  if (!profile) return null;

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || null;

  return (
    <div className="space-y-4 px-3 pb-4 sm:px-6">
      {isManagingOther ? (
        <ManagedUserBanner user={profile} targetUserId={targetUserId} />
      ) : null}
      <ProfileModeToggleRow
        mode={mode}
        onSwitchToView={onSwitchToView}
        onSwitchToEdit={onSwitchToEdit}
        className="sticky top-2 z-20"
      />

      <VerificationBadgeList items={buildCustomerBadges(profile)} />

      {showAdminInfo ? (
        <ProfilePanel flush>
          <ProfilePanelGroup title="وضعیت حساب (مدیر)">
            <p className="px-4 py-3 text-sm text-gray-700">
              حساب: {profile.isActive !== false ? 'فعال' : 'غیرفعال'}
              {' · '}
              موبایل: {profile.isMobileVerified ? 'تأیید شده' : 'تأیید نشده'}
              {profile.email
                ? ` · ایمیل: ${profile.isEmailVerified ? 'تأیید شده' : 'تأیید نشده'}`
                : ''}
            </p>
            <p className="border-t border-gray-100 px-4 pb-3 text-xs text-gray-500">
              برای تأیید دستی به حالت ویرایش بروید.
            </p>
          </ProfilePanelGroup>
        </ProfilePanel>
      ) : null}

      <ProfilePanel flush>
        <ProfilePanelGroup title="اطلاعات شخصی">
          <ProfilePanelRow icon={UserIcon} label="نام" value={fullName} />
          <ProfilePanelRow
            icon={PhoneIcon}
            label="موبایل"
            value={profile.mobile}
            dir="ltr"
            trailing={
              profile.mobile ? (
                <ProfileViewVerifyBadge
                  ok={profile.isMobileVerified}
                  okText="تأیید"
                  failText="تأیید نشده"
                />
              ) : null
            }
          />
          <ProfilePanelRow
            icon={EnvelopeIcon}
            label="ایمیل"
            value={profile.email}
            dir="ltr"
            emptyText="ثبت نشده"
            trailing={
              profile.email ? (
                <ProfileViewVerifyBadge
                  ok={profile.isEmailVerified}
                  okText="تأیید"
                  failText="تأیید نشده"
                />
              ) : null
            }
          />
        </ProfilePanelGroup>
      </ProfilePanel>

      <ProfileAddressesPanel addresses={addresses} cities={cities} />
    </div>
  );
}
