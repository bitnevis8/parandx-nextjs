"use client";

import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import UserAvatar from './UserAvatar';
import { ProfileAddressesEditor } from './ProfileAddressesEditor';
import {
  AvatarChangeButton,
  MobileVerificationBlock,
  uploadPlaceholderMessage,
} from './ProfileVerificationUi';
import {
  normalizeProfileAddresses,
  syncLegacyFieldsFromPrimary,
} from '../../utils/profileAddressUtils';
import {
  DashboardLoading,
  FormField,
  formActionsClass,
  inputClass,
  submitBtnClass,
} from './dashboard/DashboardUi';
import { ProfileFormGroup, ProfileFormPanel } from './dashboard/ProfileViewUi';
import { ProfileModeToggleRow } from './dashboard/ProfileModeAside';
import { useAuth } from '../../context/AuthContext';
import { useProfileTarget } from '../../hooks/useProfileTarget';
import { ManagedUserBanner } from './dashboard/ManagedUserBanner';
import { AdminManagedUserControls } from './dashboard/AdminManagedUserControls';
import { isValidNationalId } from '../../utils/nationalId';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  nationalId: '',
  addresses: [],
};

export default function ProfileEdit({
  targetUserId = null,
  mode = 'edit',
  onSwitchToView,
  onSwitchToEdit,
}) {
  const { refreshUser } = useAuth();
  const { profileFetchUrl, profileSaveUrl, isManagingOther, canManageOther } =
    useProfileTarget(targetUserId);
  const showAdminControls = isManagingOther && canManageOther;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const applyProfile = useCallback((data) => {
    setProfile(data);
    setFormData({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      mobile: data.mobile || '',
      nationalId: data.nationalId || '',
      addresses: normalizeProfileAddresses(data.addresses, data),
      isMobileVerified: !!data.isMobileVerified,
      isEmailVerified: !!data.isEmailVerified,
      isActive: data.isActive !== false,
    });
  }, []);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(profileFetchUrl, {
        credentials: 'include',
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) applyProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [applyProfile, profileFetchUrl]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const touch = () => setSaveMessage(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setSaveMessage({ type: 'error', text: 'نام و نام خانوادگی الزامی است' });
      return;
    }
    if (!formData.mobile.trim()) {
      setSaveMessage({ type: 'error', text: 'شماره موبایل الزامی است' });
      return;
    }
    const nationalIdDigits = formData.nationalId.replace(/\D/g, '');
    if (nationalIdDigits) {
      if (!/^\d{10}$/.test(nationalIdDigits)) {
        setSaveMessage({ type: 'error', text: 'کد ملی باید ۱۰ رقم باشد' });
        return;
      }
      if (!isValidNationalId(nationalIdDigits)) {
        setSaveMessage({ type: 'error', text: 'کد ملی معتبر نیست' });
        return;
      }
    }

    try {
      setSaving(true);
      setSaveMessage(null);
      const legacy = syncLegacyFieldsFromPrimary(formData.addresses, 'address');
      const response = await fetch(profileSaveUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim() || null,
          mobile: formData.mobile.trim(),
          nationalId: nationalIdDigits || null,
          addresses: formData.addresses,
          ...legacy,
          ...(showAdminControls
            ? {
                isMobileVerified: formData.isMobileVerified,
                isEmailVerified: formData.email.trim()
                  ? formData.isEmailVerified
                  : false,
                isActive: formData.isActive,
              }
            : {}),
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSaveMessage({ type: 'success', text: 'تغییرات ذخیره شد' });
        applyProfile(result.data);
        if (!isManagingOther) refreshUser?.();
      } else {
        setSaveMessage({ type: 'error', text: result.message || 'خطا در ذخیره' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'خطا در ارتباط با سرور' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLoading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3 pb-4 sm:px-6">
      {isManagingOther ? (
        <ManagedUserBanner user={profile} targetUserId={targetUserId} />
      ) : null}
      <ProfileModeToggleRow
        mode={mode}
        onSwitchToView={onSwitchToView}
        onSwitchToEdit={onSwitchToEdit}
        className="sticky top-2 z-20"
      />

      {saveMessage ? (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            saveMessage.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {saveMessage.text}
        </div>
      ) : null}

      <ProfileFormPanel flush>
        <ProfileFormGroup
          title="اطلاعات شخصی"
          description={
            showAdminControls
              ? 'ویرایش توسط مدیر — تأیید موبایل و ایمیل را می‌توانید دستی انجام دهید'
              : 'هر کاربر فقط یک پروفایل شخصی دارد'
          }
        >
          <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <UserAvatar
              user={{ ...formData, avatar: profile?.avatar }}
              size="sm"
              className="h-16 w-16 shrink-0 rounded-full ring-2 ring-teal-100"
            />
            <AvatarChangeButton onClick={uploadPlaceholderMessage} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="نام *">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, firstName: e.target.value }));
                  touch();
                }}
                className={inputClass}
                required
              />
            </FormField>
            <FormField label="نام خانوادگی *">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, lastName: e.target.value }));
                  touch();
                }}
                className={inputClass}
                required
              />
            </FormField>
            <FormField label="موبایل *">
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 11) }));
                  touch();
                }}
                className={inputClass}
                placeholder="09xxxxxxxxx"
                dir="ltr"
                required
              />
            </FormField>
            <FormField label="کد ملی (اختیاری)">
              <input
                type="text"
                inputMode="numeric"
                value={formData.nationalId}
                onChange={(e) => {
                  setFormData((p) => ({
                    ...p,
                    nationalId: e.target.value.replace(/\D/g, '').slice(0, 10),
                  }));
                  touch();
                }}
                className={inputClass}
                placeholder="0123456789"
                dir="ltr"
              />
            </FormField>
            <FormField label="ایمیل (اختیاری)">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, email: e.target.value }));
                  touch();
                }}
                className={inputClass}
                placeholder="email@example.com"
                dir="ltr"
              />
            </FormField>
          </div>
        </ProfileFormGroup>

        {showAdminControls ? (
          <AdminManagedUserControls
            email={formData.email}
            isMobileVerified={formData.isMobileVerified}
            isEmailVerified={formData.isEmailVerified}
            isActive={formData.isActive}
            onChange={(fields) => {
              setFormData((p) => ({ ...p, ...fields }));
              touch();
            }}
          />
        ) : (
          <ProfileFormGroup title="احراز هویت" description="تأیید شماره موبایل با پیامک">
            <MobileVerificationBlock
              mobile={formData.mobile}
              isVerified={profile?.isMobileVerified}
              onVerified={() => {
                fetchProfileData();
                refreshUser?.();
              }}
            />
          </ProfileFormGroup>
        )}

        <ProfileAddressesEditor
          variant="personal"
          addresses={formData.addresses}
          onChange={(addresses) => {
            setFormData((p) => ({ ...p, addresses }));
            touch();
          }}
        />
      </ProfileFormPanel>

      <div className={formActionsClass}>
        <button type="submit" disabled={saving} className={submitBtnClass}>
          {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  );
}
