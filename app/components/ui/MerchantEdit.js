'use client';

import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { ProfileAddressesEditor } from './ProfileAddressesEditor';
import StoreCategoriesPicker from './StoreCategoriesPicker';
import MerchantProfileNav, {
  MERCHANT_NAV_ITEMS,
  MERCHANT_SECTION_IDS,
  MERCHANT_SECTION_OVERVIEW,
  MerchantPageLayout,
  MerchantSidebarCard,
} from './dashboard/MerchantProfileNav';
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
  MerchantIdentityEditor,
  MerchantContactNumbersEditor,
  MerchantPresenceEditor,
  MerchantServiceEditor,
  MerchantWorkScheduleEditor,
  MerchantIntroEditor,
  MerchantPortfolioEditor,
} from './MerchantProfileSections';
import {
  normalizeProfileAddresses,
  syncLegacyFieldsFromPrimary,
} from '../../utils/profileAddressUtils';
import {
  normalizeAccountType,
  normalizeContactMobiles,
  normalizeContactPhones,
  contactEntriesForSave,
  mergePersonalMobileIntoContactMobiles,
  normalizeWorkSchedule,
  defaultWorkSchedule,
  normalizeSocialLinks,
  defaultSocialLinks,
  defaultMerchantActivityTypes,
  normalizeMerchantActivityTypes,
  defaultMerchantStoreName,
  normalizeMerchantStoreSlug,
  isValidMerchantStoreSlug,
  normalizePortfolio,
} from '../../utils/merchantProfileUtils';
import {
  DashboardLoading,
  formActionsClass,
  submitBtnClass,
} from './dashboard/DashboardUi';
import { ProfileFormPanel, ProfileViewEmpty } from './dashboard/ProfileViewUi';
import { useProfileTarget } from '../../hooks/useProfileTarget';
import { ManagedUserBanner } from './dashboard/ManagedUserBanner';
import { AdminManagedUserControls } from './dashboard/AdminManagedUserControls';

export default function MerchantEdit({
  targetUserId,
  mode = 'edit',
  onSwitchToView,
  onSwitchToEdit,
  activeSection = MERCHANT_SECTION_OVERVIEW,
  onSectionChange,
}) {
  const { isManagingOther, canManageOther } = useProfileTarget(targetUserId);
  const { refreshUser } = useAuth();
  const showAdminControls = isManagingOther && canManageOther;
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [formData, setFormData] = useState({
    accountType: 'individual',
    storeName: '',
    storeSlug: '',
    description: '',
    experience: '',
    logo: '',
    companyName: '',
    companyLogo: '',
    registrationNumber: '',
    companyNationalId: '',
    nationalId: '',
    contactMobiles: [],
    contactPhones: [],
    socialLinks: defaultSocialLinks(),
    addresses: [],
    activeCityIds: [],
    deliveryRadius: '',
    activityTypes: defaultMerchantActivityTypes(),
    presenceStatus: 'offline',
    workSchedule: defaultWorkSchedule(),
    portfolio: [],
    verificationDocs: {},
    professionalDocs: {},
    merchantStatus: 'pending',
    primaryCategorySlug: '',
  });

  const applyProfile = useCallback((data) => {
    setProfile(data);
    setNotFound(false);
    setFormData({
      accountType: normalizeAccountType(data.accountType, data),
      storeName: defaultMerchantStoreName(data),
      storeSlug: data.storeSlug || '',
      description: data.description || '',
      experience: data.experience || '',
      logo: data.logo || '',
      companyName: data.companyName || '',
      companyLogo: data.companyLogo || '',
      registrationNumber: data.registrationNumber || '',
      companyNationalId: data.companyNationalId || '',
      nationalId: data.nationalId || data.user?.nationalId || '',
      contactMobiles: mergePersonalMobileIntoContactMobiles(data.contactMobiles, data.user?.mobile),
      contactPhones: normalizeContactPhones(data.contactPhones),
      socialLinks: normalizeSocialLinks(data.socialLinks),
      addresses: normalizeProfileAddresses(data.addresses, data, {
        lineField: 'location',
        dataField: 'locationData',
      }),
      activeCityIds: Array.isArray(data.activeCityIds) ? data.activeCityIds : [],
      deliveryRadius: data.deliveryRadius || '',
      activityTypes: normalizeMerchantActivityTypes(data.activityTypes),
      presenceStatus: data.presenceStatus || 'offline',
      workSchedule: normalizeWorkSchedule(data.workSchedule),
      portfolio: normalizePortfolio(data.portfolio),
      verificationDocs: data.verificationDocs || {},
      professionalDocs: data.professionalDocs || {},
      merchantStatus: data.status || 'pending',
      primaryCategorySlug: data.primaryCategorySlug || data.categories?.[0]?.slug || '',
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
      let url = API_ENDPOINTS.merchants.getCurrentProfile;
      if (targetUserId) url = `${API_ENDPOINTS.merchants.getUserProfile}?userId=${targetUserId}`;
      const response = await fetch(url, { credentials: 'include' });
      if (response.status === 404) {
        setNotFound(true);
        setProfile(null);
        return;
      }
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) applyProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching merchant profile:', error);
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

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await fetch(API_ENDPOINTS.merchants.registerProfile, {
        method: 'POST',
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        applyProfile(result.data);
        await refreshUser?.();
      } else {
        alert(result.message || 'خطا در ایجاد پروفایل فروشگاه');
      }
    } catch {
      alert('خطا در ارتباط با سرور');
    } finally {
      setRegistering(false);
    }
  };

  const touch = () => setSaveMessage(null);
  const user = profile?.user;
  const isOverview = activeSection === MERCHANT_SECTION_OVERVIEW;
  const showSaveButton = activeSection !== MERCHANT_SECTION_IDS.subcategories;
  const activeNavItem = MERCHANT_NAV_ITEMS.find((item) => item.id === activeSection);

  const toggleActiveCity = (cityId) => {
    setFormData((prev) => {
      const ids = prev.activeCityIds.map(Number);
      const id = Number(cityId);
      return {
        ...prev,
        activeCityIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      };
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
    if (!formData.storeName.trim()) {
      setSaveMessage({ type: 'error', text: 'نام فروشگاه الزامی است' });
      return;
    }

    const normalizedStoreSlug = normalizeMerchantStoreSlug(formData.storeSlug);
    if (formData.storeSlug.trim() && !isValidMerchantStoreSlug(formData.storeSlug)) {
      setSaveMessage({
        type: 'error',
        text: 'آدرس صفحه فقط باید حروف انگلیسی، عدد و خط‌تیره باشد',
      });
      return;
    }

    const resolvedCompanyName =
      formData.accountType === 'business'
        ? formData.companyName.trim() || formData.storeName.trim()
        : formData.companyName.trim() || null;

    try {
      setSaving(true);
      setSaveMessage(null);
      const legacy = syncLegacyFieldsFromPrimary(formData.addresses, 'location');
      const body = {
        accountType: formData.accountType,
        storeName: formData.storeName.trim() || null,
        storeSlug: normalizedStoreSlug || null,
        description: formData.description.trim() || null,
        experience: formData.experience.trim() || null,
        portfolio: formData.portfolio,
        logo: formData.logo.trim() || null,
        companyName: resolvedCompanyName,
        companyLogo: formData.companyLogo.trim() || null,
        registrationNumber: formData.registrationNumber.trim() || null,
        companyNationalId: formData.companyNationalId.trim() || null,
        nationalId: formData.accountType === 'individual' ? formData.nationalId.trim() || null : null,
        ...legacy,
        addresses: formData.addresses,
        activeCityIds: formData.activeCityIds,
        deliveryRadius: formData.deliveryRadius || null,
        activityTypes: formData.activityTypes,
        presenceStatus: formData.presenceStatus || null,
        workSchedule: formData.workSchedule,
        primaryCategorySlug: formData.primaryCategorySlug || null,
        contactMobiles: mergePersonalMobileIntoContactMobiles(
          contactEntriesForSave(formData.contactMobiles, 5),
          profile?.user?.mobile
        ),
        contactPhones: contactEntriesForSave(formData.contactPhones, 5),
        socialLinks: normalizeSocialLinks(formData.socialLinks),
        verificationDocs: formData.verificationDocs,
        professionalDocs: formData.professionalDocs,
        ...(showAdminControls ? { status: formData.merchantStatus } : {}),
      };

      let url = API_ENDPOINTS.merchants.updateCurrentProfile;
      if (showAdminControls) url = API_ENDPOINTS.merchants.updateUserProfile(targetUserId);

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSaveMessage({ type: 'success', text: 'پروفایل فروشگاه ذخیره شد' });
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

  const renderSubcategories = (layout = 'sidebar') => (
    <StoreCategoriesPicker targetUserId={targetUserId} layout={layout} showSection={false} />
  );

  const renderIdentity = () => (
    <MerchantIdentityEditor
      sectionId={MERCHANT_SECTION_IDS.identity}
      {...formData}
      onChange={(fields) => {
        setFormData((p) => ({ ...p, ...fields }));
        touch();
      }}
    />
  );

  const renderContacts = () => (
    <MerchantContactNumbersEditor
      sectionId={MERCHANT_SECTION_IDS.contacts}
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
    <MerchantServiceEditor
      sectionId={MERCHANT_SECTION_IDS.serviceArea}
      cities={cities}
      activeCityIds={formData.activeCityIds}
      deliveryRadius={formData.deliveryRadius}
      activityTypes={formData.activityTypes}
      onToggleCity={toggleActiveCity}
      onRadiusChange={(deliveryRadius) => {
        setFormData((p) => ({ ...p, deliveryRadius }));
        touch();
      }}
      onActivityTypesChange={(activityTypes) => {
        setFormData((p) => ({ ...p, activityTypes }));
        touch();
      }}
    />
  );

  const renderIntro = () => (
    <MerchantIntroEditor
      sectionId={MERCHANT_SECTION_IDS.intro}
      experience={formData.experience}
      onChange={(experience) => {
        setFormData((p) => ({ ...p, experience }));
        touch();
      }}
    />
  );

  const renderLocation = () => (
    <ProfileAddressesEditor
      variant="expert"
      sectionId={MERCHANT_SECTION_IDS.location}
      title="محل فعالیت"
      description="آدرس مغازه و پین روی نقشه — آیکون ۳D بر اساس دسته اصلی کالا"
      addresses={formData.addresses}
      onChange={(addresses) => {
        setFormData((p) => ({ ...p, addresses }));
        touch();
      }}
      embedded
    />
  );

  const renderPresence = () => (
    <MerchantPresenceEditor
      sectionId={MERCHANT_SECTION_IDS.presence}
      presenceStatus={formData.presenceStatus}
      onChange={(presenceStatus) => {
        setFormData((p) => ({ ...p, presenceStatus }));
        touch();
      }}
    />
  );

  const renderSchedule = () => (
    <MerchantWorkScheduleEditor
      sectionId={MERCHANT_SECTION_IDS.presence}
      workSchedule={formData.workSchedule}
      onChange={(workSchedule) => {
        setFormData((p) => ({ ...p, workSchedule }));
        touch();
      }}
    />
  );

  const renderPortfolio = () => (
    <MerchantPortfolioEditor
      sectionId={MERCHANT_SECTION_IDS.portfolio}
      portfolio={formData.portfolio}
      onChange={(portfolio) => {
        setFormData((p) => ({ ...p, portfolio }));
        touch();
      }}
    />
  );

  const renderVerification = () => (
    <>
      <ExpertIdentityVerificationGrid
        sectionId={MERCHANT_SECTION_IDS.verification}
        verificationDocs={formData.verificationDocs}
        onMark={(key) => markDoc('verificationDocs', key)}
      />
      <ExpertProfessionalDocsGrid
        sectionId={MERCHANT_SECTION_IDS.verification}
        professionalDocs={formData.professionalDocs}
        onMark={(key) => markDoc('professionalDocs', key)}
      />
    </>
  );

  const renderFocusedSection = () => {
    switch (activeSection) {
      case MERCHANT_SECTION_IDS.subcategories:
        return (
          <MerchantSidebarCard
            id={MERCHANT_SECTION_IDS.subcategories}
            title="زیردسته‌های کالا"
            description="پوشاک، مواد غذایی، لوازم خانگی و …"
            unconstrained
          >
            {renderSubcategories('default')}
          </MerchantSidebarCard>
        );
      case MERCHANT_SECTION_IDS.identity:
        return <ProfileFormPanel flush>{renderIdentity()}</ProfileFormPanel>;
      case MERCHANT_SECTION_IDS.contacts:
        return <ProfileFormPanel flush>{renderContacts()}</ProfileFormPanel>;
      case MERCHANT_SECTION_IDS.serviceArea:
        return <ProfileFormPanel flush>{renderServiceArea()}</ProfileFormPanel>;
      case MERCHANT_SECTION_IDS.intro:
        return <ProfileFormPanel flush>{renderIntro()}</ProfileFormPanel>;
      case MERCHANT_SECTION_IDS.location:
        return <ProfileFormPanel flush>{renderLocation()}</ProfileFormPanel>;
      case MERCHANT_SECTION_IDS.presence:
        return (
          <ProfileFormPanel flush>
            {renderPresence()}
            {renderSchedule()}
          </ProfileFormPanel>
        );
      case MERCHANT_SECTION_IDS.portfolio:
        return <ProfileFormPanel flush>{renderPortfolio()}</ProfileFormPanel>;
      case MERCHANT_SECTION_IDS.verification:
        return <ProfileFormPanel flush>{renderVerification()}</ProfileFormPanel>;
      default:
        return null;
    }
  };

  if (loading) return <DashboardLoading />;

  if (notFound && !profile) {
    return (
      <ProfileViewEmpty
        title="پروفایل فروشگاه هنوز ایجاد نشده"
        description="برای فروش در بازار کالا، ابتدا پروفایل فروشگاه خود را بسازید."
        actionLabel="ایجاد پروفایل فروشگاه"
        onAction={handleRegister}
        actionLoading={registering}
      />
    );
  }

  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3 pb-4 sm:px-6">
      {isManagingOther ? <ManagedUserBanner user={user} targetUserId={targetUserId} /> : null}

      <div className="sticky top-2 z-20 space-y-2">
        <MerchantProfileNav activeSection={activeSection} onSectionChange={onSectionChange} />
        <ProfileModeToggleRow mode={mode} onSwitchToView={onSwitchToView} onSwitchToEdit={onSwitchToEdit} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ExpertStatusBadge status={formData.merchantStatus} />
        <VerificationBadgeList
          items={buildExpertBadges(
            { status: formData.merchantStatus, verificationDocs: formData.verificationDocs },
            user
          )}
        />
      </div>

      {showAdminControls ? (
        <AdminManagedUserControls
          showExpertStatus
          expertStatus={formData.merchantStatus}
          onChange={({ expertStatus: merchantStatus }) => {
            if (merchantStatus !== undefined) {
              setFormData((p) => ({ ...p, merchantStatus }));
              touch();
            }
          }}
        />
      ) : null}

      {!isOverview && activeNavItem ? (
        <p className="text-xs text-gray-500 sm:text-sm">
          در حال ویرایش: <span className="font-medium text-gray-700">{activeNavItem.label}</span>
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
        <MerchantPageLayout
          sidebar={
            <MerchantSidebarCard
              id={MERCHANT_SECTION_IDS.subcategories}
              title="زیردسته‌های کالا"
              description="پوشاک، مواد غذایی، لوازم خانگی و …"
            >
              {renderSubcategories('sidebar')}
            </MerchantSidebarCard>
          }
        >
          <ProfileFormPanel flush>
            {renderIdentity()}
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
                {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
              </button>
            </div>
          ) : null}
        </MerchantPageLayout>
      ) : (
        <>
          {renderFocusedSection()}

          {showSaveButton ? (
            <div className={formActionsClass}>
              <button type="submit" disabled={saving} className={submitBtnClass}>
                {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
              </button>
            </div>
          ) : (
            <p className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
              زیردسته‌های کالا بلافاصله پس از افزودن یا حذف ذخیره می‌شوند.
            </p>
          )}
        </>
      )}
    </form>
  );
}
