"use client";

import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { ProfileAddressesEditor } from './ProfileAddressesEditor';
import SpecializationsPicker from './SpecializationsPicker';
import ExpertProfileNav, {
  EXPERT_NAV_ITEMS,
  EXPERT_SECTION_IDS,
  EXPERT_SECTION_OVERVIEW,
  ExpertPageLayout,
  ExpertSidebarCard,
} from './dashboard/ExpertProfileNav';
import { ProfileModeToggleRow } from './dashboard/ProfileModeAside';
import {
  ExpertIdentityVerificationGrid,
  ExpertProfessionalDocsGrid,
  ExpertStatusBadge,
  VerificationBadgeList,
  buildExpertBadges,
  uploadPlaceholderMessage,
} from './ProfileVerificationUi';
import {
  ExpertAccountTypeEditor,
  ExpertContactNumbersEditor,
  ExpertPortfolioEditor,
  ExpertPresenceEditor,
  ExpertServiceAreaEditor,
  ExpertWorkScheduleEditor,
} from './ExpertProfileSections';
import {
  normalizeProfileAddresses,
  syncLegacyFieldsFromPrimary,
} from '../../utils/profileAddressUtils';
import {
  defaultActivityTypes,
  defaultWorkSchedule,
  normalizeAccountType,
  normalizeActivityTypes,
  normalizeContactMobiles,
  normalizeContactPhones,
  contactEntriesForSave,
  mergePersonalMobileIntoContactMobiles,
  normalizePortfolio,
  normalizeWorkSchedule,
  defaultExpertDisplayName,
  normalizeSocialLinks,
  defaultSocialLinks,
} from '../../utils/expertProfileUtils';
import {
  DashboardLoading,
  FormField,
  formActionsClass,
  inputClass,
  submitBtnClass,
} from './dashboard/DashboardUi';
import { ProfileFormGroup, ProfileFormPanel } from './dashboard/ProfileViewUi';
import { useProfileTarget } from '../../hooks/useProfileTarget';
import { ManagedUserBanner } from './dashboard/ManagedUserBanner';
import { AdminManagedUserControls } from './dashboard/AdminManagedUserControls';

export default function ExpertEdit({
  targetUserId,
  mode = 'edit',
  onSwitchToView,
  onSwitchToEdit,
  activeSection = EXPERT_SECTION_OVERVIEW,
  onSectionChange,
}) {
  const { isManagingOther, canManageOther } = useProfileTarget(targetUserId);
  const showAdminControls = isManagingOther && canManageOther;
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [formData, setFormData] = useState({
    accountType: 'individual',
    displayName: '',
    avatar: '',
    companyName: '',
    companyLogo: '',
    registrationNumber: '',
    companyNationalId: '',
    nationalId: '',
    bio: '',
    experience: '',
    contactMobiles: [],
    contactPhones: [],
    socialLinks: defaultSocialLinks(),
    addresses: [],
    activeCityIds: [],
    serviceRadius: '',
    activityTypes: defaultActivityTypes(),
    presenceStatus: 'offline',
    workSchedule: defaultWorkSchedule(),
    portfolio: [],
    verificationDocs: {},
    professionalDocs: {},
    expertStatus: 'pending',
    isMobileVerified: false,
    isEmailVerified: false,
    isActive: true,
  });

  const applyProfile = useCallback((data) => {
    setProfile(data);
    setFormData({
      accountType: normalizeAccountType(data.accountType, data),
      displayName: defaultExpertDisplayName(data),
      avatar: data.avatar || '',
      companyName: data.companyName || data.shopInfo?.name || '',
      companyLogo: data.companyLogo || '',
      registrationNumber: data.registrationNumber || '',
      companyNationalId: data.companyNationalId || '',
      nationalId: data.nationalId || data.user?.nationalId || '',
      bio: data.bio || '',
      experience: data.experience || '',
      contactMobiles: mergePersonalMobileIntoContactMobiles(
        data.contactMobiles,
        data.user?.mobile
      ),
      contactPhones: normalizeContactPhones(data.contactPhones),
      socialLinks: normalizeSocialLinks(data.socialLinks),
      addresses: normalizeProfileAddresses(data.addresses, data, {
        lineField: 'location',
        dataField: 'locationData',
      }),
      activeCityIds: Array.isArray(data.activeCityIds) ? data.activeCityIds : [],
      serviceRadius: data.serviceRadius || '',
      activityTypes: normalizeActivityTypes(data.activityTypes, data),
      presenceStatus: data.presenceStatus || 'offline',
      workSchedule: normalizeWorkSchedule(data.workSchedule),
      portfolio: normalizePortfolio(data.portfolio),
      verificationDocs: data.verificationDocs || {},
      professionalDocs: data.professionalDocs || {},
      expertStatus: data.status || 'pending',
      isMobileVerified: !!data.user?.isMobileVerified,
      isEmailVerified: !!data.user?.isEmailVerified,
      isActive: data.user?.isActive !== false,
    });
  }, []);

  useEffect(() => {
    fetch(API_ENDPOINTS.cities.getAll)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCities((res.data || []).filter((c) => c.isActive !== false));
      })
      .catch(console.error);
  }, []);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      let url = API_ENDPOINTS.experts.getCurrentProfile;
      if (targetUserId) url = `${API_ENDPOINTS.experts.getUserProfile}?userId=${targetUserId}`;
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) applyProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, applyProfile]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const touch = () => setSaveMessage(null);
  const user = profile?.user;
  const isOverview = activeSection === EXPERT_SECTION_OVERVIEW;
  const showSaveButton = activeSection !== EXPERT_SECTION_IDS.specializations;
  const activeNavItem = EXPERT_NAV_ITEMS.find((item) => item.id === activeSection);

  const toggleActiveCity = (cityId) => {
    setFormData((prev) => {
      const ids = prev.activeCityIds.map(Number);
      const id = Number(cityId);
      return { ...prev, activeCityIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] };
    });
    touch();
  };

  const markDoc = (bucket, key) => {
    setFormData((prev) => ({
      ...prev,
      [bucket]: { ...(prev[bucket] || {}), [key]: true, uploadedAt: new Date().toISOString() },
    }));
    uploadPlaceholderMessage();
    touch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.accountType === 'business' && !formData.companyName.trim()) {
      setSaveMessage({ type: 'error', text: 'نام شرکت الزامی است' });
      return;
    }

    try {
      setSaving(true);
      setSaveMessage(null);
      const legacy = syncLegacyFieldsFromPrimary(formData.addresses, 'location');

      const body = {
        accountType: formData.accountType,
        displayName:
          formData.displayName.trim() ||
          (formData.accountType === 'individual'
            ? defaultExpertDisplayName({ user: profile?.user }) || null
            : null),
        avatar: formData.avatar.trim() || null,
        companyName: formData.companyName.trim() || null,
        companyLogo: formData.companyLogo.trim() || null,
        registrationNumber: formData.registrationNumber.trim() || null,
        companyNationalId: formData.companyNationalId.trim() || null,
        nationalId: formData.accountType === 'individual' ? formData.nationalId.trim() || null : null,
        bio: formData.bio.trim() || null,
        experience: formData.experience.trim() || null,
        ...legacy,
        activeCityIds: formData.activeCityIds,
        serviceRadius: formData.serviceRadius || null,
        activityTypes: formData.activityTypes,
        presenceStatus: formData.presenceStatus || null,
        workSchedule: formData.workSchedule,
        portfolio: formData.portfolio,
        addresses: formData.addresses,
        contactMobiles: mergePersonalMobileIntoContactMobiles(
          contactEntriesForSave(formData.contactMobiles, 5),
          profile?.user?.mobile
        ),
        contactPhones: contactEntriesForSave(formData.contactPhones, 5),
        socialLinks: normalizeSocialLinks(formData.socialLinks),
        verificationDocs: formData.verificationDocs,
        professionalDocs: formData.professionalDocs,
        ...(showAdminControls
          ? {
              status: formData.expertStatus,
              isMobileVerified: formData.isMobileVerified,
              isEmailVerified: formData.isEmailVerified,
              isActive: formData.isActive,
            }
          : {}),
      };

      let url = API_ENDPOINTS.experts.updateCurrentProfile;
      if (showAdminControls) {
        url = API_ENDPOINTS.experts.updateUserProfile(targetUserId);
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSaveMessage({ type: 'success', text: 'پروفایل تخصصی ذخیره شد' });
        applyProfile(result.data);
      } else {
        setSaveMessage({ type: 'error', text: result.message || 'خطا در ذخیره' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'خطا در ارتباط با سرور' });
    } finally {
      setSaving(false);
    }
  };

  const renderAccountType = () => (
    <ExpertAccountTypeEditor
      sectionId={EXPERT_SECTION_IDS.identity}
      accountType={formData.accountType}
      displayName={formData.displayName}
      avatar={formData.avatar}
      bio={formData.bio}
      nationalId={formData.nationalId}
      companyName={formData.companyName}
      companyLogo={formData.companyLogo}
      registrationNumber={formData.registrationNumber}
      companyNationalId={formData.companyNationalId}
      user={user}
      onChange={(fields) => {
        setFormData((p) => ({ ...p, ...fields }));
        touch();
      }}
    />
  );

  const renderContacts = () => (
    <ExpertContactNumbersEditor
      sectionId={EXPERT_SECTION_IDS.contacts}
      contactMobiles={formData.contactMobiles}
      contactPhones={formData.contactPhones}
      socialLinks={formData.socialLinks}
      onMobilesChange={(contactMobiles) => {
        setFormData((p) => ({ ...p, contactMobiles }));
        touch();
      }}
      onPhonesChange={(contactPhones) => {
        setFormData((p) => ({ ...p, contactPhones }));
        touch();
      }}
      onSocialLinksChange={(socialLinks) => {
        setFormData((p) => ({ ...p, socialLinks }));
        touch();
      }}
    />
  );

  const renderServiceArea = () => (
    <ExpertServiceAreaEditor
      sectionId={EXPERT_SECTION_IDS.serviceArea}
      cities={cities}
      activeCityIds={formData.activeCityIds}
      serviceRadius={formData.serviceRadius}
      activityTypes={formData.activityTypes}
      onToggleCity={toggleActiveCity}
      onRadiusChange={(value) => {
        setFormData((p) => ({ ...p, serviceRadius: value }));
        touch();
      }}
      onActivityTypesChange={(value) => {
        setFormData((p) => ({ ...p, activityTypes: value }));
        touch();
      }}
    />
  );

  const renderIntro = () => (
    <ProfileFormGroup id={EXPERT_SECTION_IDS.intro} title="سابقه کاری">
      <FormField label="سابقه کار">
        <input
          type="text"
          value={formData.experience}
          onChange={(e) => {
            setFormData((p) => ({ ...p, experience: e.target.value }));
            touch();
          }}
          className={inputClass}
          placeholder="مثلاً ۱۰ سال"
        />
      </FormField>
    </ProfileFormGroup>
  );

  const renderLocation = () => (
    <div id={EXPERT_SECTION_IDS.location}>
      <ProfileAddressesEditor
        variant="expert"
        sectionId={EXPERT_SECTION_IDS.location}
        addresses={formData.addresses}
        onChange={(addresses) => {
          setFormData((p) => ({ ...p, addresses }));
          touch();
        }}
      />
    </div>
  );

  const renderPresence = () => (
    <>
      <ExpertPresenceEditor
        sectionId={EXPERT_SECTION_IDS.presence}
        presenceStatus={formData.presenceStatus}
        onChange={(value) => {
          setFormData((p) => ({ ...p, presenceStatus: value }));
          touch();
        }}
      />
      {isOverview ? (
        <ExpertWorkScheduleEditor
          sectionId={EXPERT_SECTION_IDS.schedule}
          workSchedule={formData.workSchedule}
          onChange={(value) => {
            setFormData((p) => ({ ...p, workSchedule: value }));
            touch();
          }}
        />
      ) : null}
    </>
  );

  const renderSchedule = () => (
    <ExpertWorkScheduleEditor
      sectionId={EXPERT_SECTION_IDS.schedule}
      workSchedule={formData.workSchedule}
      onChange={(value) => {
        setFormData((p) => ({ ...p, workSchedule: value }));
        touch();
      }}
    />
  );

  const renderPortfolio = () => (
    <ExpertPortfolioEditor
      sectionId={EXPERT_SECTION_IDS.portfolio}
      portfolio={formData.portfolio}
      onChange={(value) => {
        setFormData((p) => ({ ...p, portfolio: value }));
        touch();
      }}
    />
  );

  const renderVerification = () => (
    <>
      {showAdminControls ? (
        <p className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          تأیید موبایل، ایمیل و وضعیت متخصص در بخش «مدیریت حساب (ادمین)» در مرور کلی قابل تنظیم است.
        </p>
      ) : (
        <ProfileFormGroup id={EXPERT_SECTION_IDS.verification} title="احراز هویت">
          <ExpertIdentityVerificationGrid
            mobile={user?.mobile}
            isMobileVerified={user?.isMobileVerified}
            onMobileVerified={fetchProfileData}
            onUploadNationalId={() => markDoc('verificationDocs', 'nationalIdFront')}
            onUploadSelfie={() => markDoc('verificationDocs', 'selfie')}
          />
        </ProfileFormGroup>
      )}
      {isOverview ? (
        <ProfileFormGroup id={EXPERT_SECTION_IDS.professional} title="احراز حرفه‌ای (اختیاری)">
          <ExpertProfessionalDocsGrid
            onUploadLicense={() => markDoc('professionalDocs', 'businessLicense')}
            onUploadVocational={() => markDoc('professionalDocs', 'vocationalCard')}
            onUploadCertificate={() => markDoc('professionalDocs', 'specialtyCertificate')}
          />
        </ProfileFormGroup>
      ) : null}
    </>
  );

  const renderProfessional = () => (
    <ProfileFormGroup id={EXPERT_SECTION_IDS.professional} title="احراز حرفه‌ای (اختیاری)">
      <ExpertProfessionalDocsGrid
        onUploadLicense={() => markDoc('professionalDocs', 'businessLicense')}
        onUploadVocational={() => markDoc('professionalDocs', 'vocationalCard')}
        onUploadCertificate={() => markDoc('professionalDocs', 'specialtyCertificate')}
      />
    </ProfileFormGroup>
  );

  const renderSpecializations = (layout = 'sidebar') => (
    <SpecializationsPicker
      targetUserId={targetUserId}
      layout={layout}
      showSection={false}
    />
  );

  const renderFocusedSection = () => {
    switch (activeSection) {
      case EXPERT_SECTION_IDS.specializations:
        return (
          <ExpertSidebarCard
            id={EXPERT_SECTION_IDS.specializations}
            title="تخصص‌ها"
            description="حوزه‌های کاری — برقکار، لوله‌کش، نقاش و …"
            unconstrained
          >
            {renderSpecializations('default')}
          </ExpertSidebarCard>
        );
      case EXPERT_SECTION_IDS.identity:
        return <ProfileFormPanel flush>{renderAccountType()}</ProfileFormPanel>;
      case EXPERT_SECTION_IDS.contacts:
        return <ProfileFormPanel flush>{renderContacts()}</ProfileFormPanel>;
      case EXPERT_SECTION_IDS.serviceArea:
        return <ProfileFormPanel flush>{renderServiceArea()}</ProfileFormPanel>;
      case EXPERT_SECTION_IDS.intro:
        return <ProfileFormPanel flush>{renderIntro()}</ProfileFormPanel>;
      case EXPERT_SECTION_IDS.location:
        return <ProfileFormPanel flush>{renderLocation()}</ProfileFormPanel>;
      case EXPERT_SECTION_IDS.presence:
        return (
          <ProfileFormPanel flush>
            {renderPresence()}
            {renderSchedule()}
          </ProfileFormPanel>
        );
      case EXPERT_SECTION_IDS.portfolio:
        return <ProfileFormPanel flush>{renderPortfolio()}</ProfileFormPanel>;
      case EXPERT_SECTION_IDS.verification:
        return (
          <ProfileFormPanel flush>
            {renderVerification()}
            {renderProfessional()}
          </ProfileFormPanel>
        );
      default:
        return null;
    }
  };

  if (loading) return <DashboardLoading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3 pb-4 sm:px-6">
      {showAdminControls ? (
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
        <ExpertStatusBadge status={profile?.status} />
        <VerificationBadgeList items={buildExpertBadges(profile, user)} />
      </div>

      {!isOverview && activeNavItem ? (
        <p className="text-xs text-gray-500 sm:text-sm">
          در حال ویرایش: <span className="font-medium text-gray-700">{activeNavItem.label}</span>
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

      {saveMessage ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            saveMessage.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {saveMessage.text}
        </div>
      ) : null}

      {isOverview ? (
        <ExpertPageLayout
          sidebar={
            <ExpertSidebarCard
              id={EXPERT_SECTION_IDS.specializations}
              title="تخصص‌ها"
              description="حوزه‌های کاری — برقکار، لوله‌کش، نقاش و …"
            >
              {renderSpecializations('sidebar')}
            </ExpertSidebarCard>
          }
        >
          <ProfileFormPanel flush>
            {showAdminControls ? (
              <AdminManagedUserControls
                email={user?.email}
                isMobileVerified={formData.isMobileVerified}
                isEmailVerified={formData.isEmailVerified}
                isActive={formData.isActive}
                expertStatus={formData.expertStatus}
                showExpertStatus
                onChange={(fields) => {
                  if (fields.expertStatus !== undefined) {
                    setFormData((p) => ({ ...p, expertStatus: fields.expertStatus }));
                  } else {
                    setFormData((p) => ({ ...p, ...fields }));
                  }
                  touch();
                }}
              />
            ) : null}
            {renderAccountType()}
            {renderContacts()}
            {renderServiceArea()}
            {renderIntro()}
            {renderLocation()}
            {renderPresence()}
            {renderSchedule()}
            {renderPortfolio()}
            {renderVerification()}
          </ProfileFormPanel>

          {showSaveButton ? (
            <div className={`${formActionsClass} lg:justify-start`}>
              <button type="submit" disabled={saving} className={submitBtnClass}>
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          ) : null}
        </ExpertPageLayout>
      ) : (
        <>
          {renderFocusedSection()}

          {showSaveButton ? (
            <div className={formActionsClass}>
              <button type="submit" disabled={saving} className={submitBtnClass}>
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          ) : (
            <p className="rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3 text-sm text-teal-800">
              تخصص‌ها بلافاصله پس از افزودن یا حذف ذخیره می‌شوند.
            </p>
          )}
        </>
      )}
    </form>
  );
}
