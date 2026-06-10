"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRole } from '../../hooks/useRole';
import ProfileDisplay from './ProfileDisplay';
import ProfileEdit from './ProfileEdit';
import { API_ENDPOINTS } from '../../config/api';
import ExpertDisplay from './ExpertDisplay';
import ExpertEdit from './ExpertEdit';
import MerchantDisplay from './MerchantDisplay';
import MerchantEdit from './MerchantEdit';
import { cardClass, DashboardBreadcrumb } from './dashboard/DashboardUi';
import {
  EXPERT_SECTION_OVERVIEW,
  buildExpertDashboardQuery,
  isExpertProfileTab,
  resolveExpertSection,
} from './dashboard/ExpertProfileNav';
import {
  MERCHANT_SECTION_OVERVIEW,
  buildMerchantDashboardQuery,
  isMerchantProfileTab,
  resolveMerchantSection,
} from './dashboard/MerchantProfileNav';

const TABS = [
  { id: 'personal', label: 'پروفایل شخصی', displayTab: 'profile-display', editTab: 'profile-edit' },
  { id: 'expert', label: 'پروفایل تخصصی', displayTab: 'expert-display', editTab: 'expert-edit', expertOnly: true },
  {
    id: 'merchant',
    label: 'پروفایل فروشگاه',
    displayTab: 'merchant-display',
    editTab: 'merchant-edit',
    merchantOnly: true,
  },
];

const TAB_META = {
  'profile-display': { section: 'personal', mode: 'مشاهده' },
  'profile-edit': { section: 'personal', mode: 'ویرایش' },
  'expert-display': { section: 'expert', mode: 'مشاهده' },
  'expert-edit': { section: 'expert', mode: 'ویرایش' },
  'merchant-display': { section: 'merchant', mode: 'مشاهده' },
  'merchant-edit': { section: 'merchant', mode: 'ویرایش' },
};

function getSectionForTab(tab) {
  return TAB_META[tab]?.section || 'personal';
}

function isEditTab(tab) {
  return tab?.endsWith('-edit');
}

export default function DashboardHeader() {
  const [activeTab, setActiveTab] = useState('profile-display');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userRole = useRole();
  const { user, canAccessExpert, canAccessMerchant, canAccessAdmin } = userRole;

  const targetUserId = searchParams.get('userId');
  const [managedUser, setManagedUser] = useState(null);
  const sectionFromUrl = searchParams.get('section');
  const expertSectionFromUrl = resolveExpertSection(sectionFromUrl);
  const merchantSectionFromUrl = resolveMerchantSection(sectionFromUrl);
  const [expertSection, setExpertSection] = useState(expertSectionFromUrl);
  const [merchantSection, setMerchantSection] = useState(merchantSectionFromUrl);

  useEffect(() => {
    setExpertSection(expertSectionFromUrl);
    setMerchantSection(merchantSectionFromUrl);
  }, [expertSectionFromUrl, merchantSectionFromUrl]);

  useEffect(() => {
    if (!targetUserId || !canAccessAdmin()) {
      setManagedUser(null);
      return;
    }
    if (user?.id && String(user.id) === String(targetUserId)) {
      setManagedUser(user);
      return;
    }
    let cancelled = false;
    fetch(API_ENDPOINTS.users.getById(targetUserId), { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) setManagedUser(data.data);
      })
      .catch(() => {
        if (!cancelled) setManagedUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [targetUserId, canAccessAdmin, user]);

  useEffect(() => {
    const tab = searchParams.get('tab');

    if (tab === 'specializations') {
      router.replace(
        buildExpertDashboardQuery('expert-edit', {
          userId: targetUserId,
          section: 'expert-specializations',
        }),
        { scroll: false }
      );
      setActiveTab('expert-edit');
      return;
    }

    if (tab && TAB_META[tab]) {
      setActiveTab(tab);
    }
  }, [searchParams, targetUserId, router]);

  const navigateDashboard = (
    tab,
    { section, resetExpertSection = false, resetMerchantSection = false } = {}
  ) => {
    setActiveTab(tab);

    if (isExpertProfileTab(tab)) {
      const nextSection = resetExpertSection
        ? EXPERT_SECTION_OVERVIEW
        : resolveExpertSection(section ?? expertSection);

      setExpertSection(nextSection);
      router.push(
        buildExpertDashboardQuery(tab, { userId: targetUserId, section: nextSection }),
        { scroll: false }
      );
      return;
    }

    if (isMerchantProfileTab(tab)) {
      const nextSection = resetMerchantSection
        ? MERCHANT_SECTION_OVERVIEW
        : resolveMerchantSection(section ?? merchantSection);

      setMerchantSection(nextSection);
      router.push(
        buildMerchantDashboardQuery(tab, { userId: targetUserId, section: nextSection }),
        { scroll: false }
      );
      return;
    }

    router.push(
      targetUserId ? `?tab=${tab}&userId=${targetUserId}` : `?tab=${tab}`,
      { scroll: false }
    );
  };

  const handleExpertSectionChange = (section) => {
    if (!isExpertProfileTab(activeTab)) return;
    const nextSection = resolveExpertSection(section);
    setExpertSection(nextSection);
    router.push(
      buildExpertDashboardQuery(activeTab, { userId: targetUserId, section: nextSection }),
      { scroll: false }
    );
  };

  const handleMerchantSectionChange = (section) => {
    if (!isMerchantProfileTab(activeTab)) return;
    const nextSection = resolveMerchantSection(section);
    setMerchantSection(nextSection);
    router.push(
      buildMerchantDashboardQuery(activeTab, { userId: targetUserId, section: nextSection }),
      { scroll: false }
    );
  };

  const targetHasExpertRole =
    managedUser?.userRoles?.some((r) => r.name === 'expert') ?? false;
  const targetHasMerchantRole =
    managedUser?.userRoles?.some((r) => r.name === 'merchant') ?? false;

  const visibleTabs = TABS.filter((tab) => {
    if (tab.expertOnly) {
      if (targetUserId && canAccessAdmin()) return targetHasExpertRole;
      return canAccessExpert();
    }
    if (tab.merchantOnly) {
      if (targetUserId && canAccessAdmin()) return targetHasMerchantRole;
      return canAccessMerchant();
    }
    return true;
  });

  const activeSection = getSectionForTab(activeTab);
  const activeSectionConfig = visibleTabs.find((t) => t.id === activeSection);
  const isProfileView =
    activeTab.startsWith('profile-') ||
    activeTab.startsWith('expert-') ||
    activeTab.startsWith('merchant-');
  const isEditMode = isEditTab(activeTab);

  const switchToDisplay = () => {
    if (!activeSectionConfig) return;
    navigateDashboard(activeSectionConfig.displayTab, {
      section: isMerchantProfileTab(activeTab) ? merchantSection : expertSection,
    });
  };

  const switchToEdit = () => {
    if (!activeSectionConfig) return;
    navigateDashboard(activeSectionConfig.editTab, {
      section: isMerchantProfileTab(activeTab) ? merchantSection : expertSection,
    });
  };

  const modeProps = {
    mode: isEditMode ? 'edit' : 'view',
    onSwitchToView: switchToDisplay,
    onSwitchToEdit: switchToEdit,
  };

  const expertSectionProps = {
    activeSection: expertSection,
    onSectionChange: handleExpertSectionChange,
  };

  const merchantSectionProps = {
    activeSection: merchantSection,
    onSectionChange: handleMerchantSectionChange,
  };

  const breadcrumbItems = useMemo(() => {
    const meta = TAB_META[activeTab] || TAB_META['profile-display'];
    const sectionTab = TABS.find((t) => t.id === meta.section);
    const sectionLabel = sectionTab?.label || 'پروفایل شخصی';
    const sectionTarget = sectionTab?.displayTab || 'profile-display';
    const qs = targetUserId ? `&userId=${targetUserId}` : '';

    const managedName = managedUser
      ? [managedUser.firstName, managedUser.lastName].filter(Boolean).join(' ')
      : null;

    return [
      ...(targetUserId && canAccessAdmin()
        ? [
            {
              label: 'مدیریت کاربران',
              href: '/dashboard/user-management/users',
              onClick: (e) => {
                e.preventDefault();
                router.push('/dashboard/user-management/users');
              },
            },
            {
              label: managedName || `کاربر #${targetUserId}`,
              href: `/dashboard/user-management/users/${targetUserId}/view`,
              onClick: (e) => {
                e.preventDefault();
                router.push(`/dashboard/user-management/users/${targetUserId}/view`);
              },
            },
          ]
        : [
            {
              label: 'داشبورد',
              href: `/dashboard${targetUserId ? `?userId=${targetUserId}` : ''}`,
              onClick: (e) => {
                e.preventDefault();
                navigateDashboard('profile-display');
              },
            },
          ]),
      {
        label: sectionLabel,
        href: `/dashboard?tab=${sectionTarget}${qs}`,
        onClick: (e) => {
          e.preventDefault();
          navigateDashboard(sectionTarget, {
            resetExpertSection: true,
            resetMerchantSection: true,
          });
        },
      },
      { label: meta.mode },
    ];
  }, [activeTab, targetUserId, managedUser, canAccessAdmin, router]);

  const renderProfileContent = () => {
    switch (activeTab) {
      case 'profile-display':
        return <ProfileDisplay targetUserId={targetUserId} {...modeProps} />;
      case 'profile-edit':
        return <ProfileEdit targetUserId={targetUserId} {...modeProps} />;
      case 'expert-display':
        return (
          <ExpertDisplay targetUserId={targetUserId} {...modeProps} {...expertSectionProps} />
        );
      case 'expert-edit':
        return <ExpertEdit targetUserId={targetUserId} {...modeProps} {...expertSectionProps} />;
      case 'merchant-display':
        return (
          <MerchantDisplay
            targetUserId={targetUserId}
            {...modeProps}
            {...merchantSectionProps}
          />
        );
      case 'merchant-edit':
        return (
          <MerchantEdit targetUserId={targetUserId} {...modeProps} {...merchantSectionProps} />
        );
      default:
        return null;
    }
  };

  if (!user || pathname !== '/dashboard') {
    return null;
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <DashboardBreadcrumb items={breadcrumbItems} />

      <section className={cardClass}>
        <div className="border-b border-gray-100 px-3 py-3 sm:px-6 sm:py-4">
          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {visibleTabs.map((tab) => {
              const isActive = tab.id === activeSection;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    navigateDashboard(tab.displayTab, {
                      resetExpertSection: true,
                      resetMerchantSection: true,
                    })
                  }
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? tab.id === 'merchant'
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                        : 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={isProfileView ? 'p-0' : 'p-4 sm:p-6'}>
          {renderProfileContent()}
        </div>
      </section>
    </div>
  );
}
