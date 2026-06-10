"use client";

import { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import {
  DashboardLoading,
  FormSection,
  ghostBtnClass,
  inputClass,
  pickerGridClass,
  primaryBtnClass,
} from './dashboard/DashboardUi';
import { ProfileViewSection } from './dashboard/ProfileViewUi';

export default function SpecializationsPicker({
  targetUserId,
  readOnly = false,
  showSection = true,
  sectionId = 'expert-specializations',
  displayMode = false,
  layout = 'default',
}) {
  const [specializations, setSpecializations] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetchData();
  }, [targetUserId]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = [];
    groupedCategories.forEach((group) => {
      group.subcategories.forEach((subcategory) => {
        if (subcategory.title.toLowerCase().includes(term)) {
          results.push({
            ...subcategory,
            parentGroup: { id: group.id, title: group.title, icon: group.icon },
          });
        }
      });
    });
    setSearchResults(results);
  }, [searchTerm, groupedCategories]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let specializationsUrl = API_ENDPOINTS.experts.getSpecializations;
      if (targetUserId) {
        specializationsUrl = `${API_ENDPOINTS.experts.getUserSpecializations}?userId=${targetUserId}`;
      }

      const [specRes, catRes] = await Promise.all([
        fetch(specializationsUrl, { credentials: 'include' }),
        fetch(API_ENDPOINTS.categories.getAll('services'), { credentials: 'include' }),
      ]);

      if (specRes.ok) {
        const specResult = await specRes.json();
        if (specResult.success) setSpecializations(specResult.data || []);
      }

      if (catRes.ok) {
        const catResult = await catRes.json();
        if (catResult.success) {
          setGroupedCategories(
            catResult.data.filter((c) => c.subcategories?.length > 0)
          );
        }
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialization = async (categoryId) => {
    try {
      setSaving(true);
      const requestBody = { categoryId, ...(targetUserId ? { userId: targetUserId } : {}) };
      const response = await fetch(API_ENDPOINTS.experts.addSpecialization, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchData();
      } else {
        alert('خطا در اضافه کردن تخصص: ' + (result.message || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error adding specialization:', error);
      alert('خطا در اضافه کردن تخصص');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSpecialization = async (categoryId, categoryTitle) => {
    if (!window.confirm(`تخصص «${categoryTitle}» حذف شود؟`)) return;

    try {
      setSaving(true);
      let removeUrl = API_ENDPOINTS.experts.removeSpecialization(categoryId);
      if (targetUserId) removeUrl += `?userId=${targetUserId}`;

      const response = await fetch(removeUrl, { method: 'DELETE', credentials: 'include' });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchData();
      } else {
        alert('خطا در حذف تخصص: ' + (result.message || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error removing specialization:', error);
      alert('خطا در حذف تخصص');
    } finally {
      setSaving(false);
    }
  };

  const isAdded = (categoryId) => specializations.some((s) => s.id === categoryId);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev[groupId] ? {} : { [groupId]: true }
    );
  };

  const toggleAllGroups = () => {
    const anyOpen = Object.values(expandedGroups).some(Boolean);
    if (anyOpen) {
      setExpandedGroups({});
    } else {
      const next = {};
      groupedCategories.forEach((g) => { next[g.id] = true; });
      setExpandedGroups(next);
    }
  };

  if (loading) {
    return readOnly ? null : <DashboardLoading />;
  }

  const isSidebar = layout === 'sidebar';
  const gridClass = isSidebar
    ? 'grid grid-cols-1 gap-2 sm:grid-cols-2'
    : pickerGridClass;

  const countLabel = specializations.length > 0 ? `${specializations.length} مورد` : null;

  const chipsBlock = (
    <div className="col-span-full">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {!readOnly && !isSidebar && (
          <p className="text-sm text-gray-500">تخصص‌های انتخاب‌شده</p>
        )}
        {countLabel && (
          <span className="inline-flex w-fit rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
            {countLabel}
          </span>
        )}
      </div>

      {specializations.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {specializations.map((spec) => (
            <span
              key={spec.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800"
            >
              {spec.icon && <span aria-hidden className="shrink-0">{spec.icon}</span>}
              <span className="truncate">{spec.title}</span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialization(spec.id, spec.title)}
                  disabled={saving}
                  className="shrink-0 rounded-full p-0.5 text-teal-600 hover:bg-teal-100 disabled:opacity-50"
                  aria-label={`حذف ${spec.title}`}
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
          {readOnly ? 'تخصصی ثبت نشده' : 'هنوز تخصصی انتخاب نکرده‌اید'}
        </p>
      )}
    </div>
  );

  const sectionDescription = readOnly
    ? 'حوزه‌های کاری ثبت‌شده'
    : 'حوزه‌های کاری که در آن‌ها خدمات ارائه می‌دهید';

  if (readOnly) {
    const chips = specializations.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {specializations.map((spec) => (
          <span
            key={spec.id}
            className={`inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-gray-800 ${
              displayMode
                ? 'rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm'
                : 'rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-teal-800'
            }`}
          >
            {spec.icon && <span aria-hidden className="shrink-0">{spec.icon}</span>}
            <span className="truncate">{spec.title}</span>
          </span>
        ))}
      </div>
    ) : (
      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-center text-sm text-gray-500">
        تخصصی ثبت نشده
      </p>
    );

    if (showSection) {
      const Section = displayMode ? ProfileViewSection : FormSection;
      return (
        <Section id={sectionId} title="تخصص‌ها" description={sectionDescription}>
          {displayMode && countLabel && (
            <p className="mb-3 text-xs text-gray-500">{countLabel} ثبت شده</p>
          )}
          {chips}
        </Section>
      );
    }
    return chips;
  }

  const pickerContent = (
    <div className={isSidebar ? 'space-y-3' : ''}>
      {chipsBlock}

      <div className={`col-span-full space-y-4 ${isSidebar ? '' : 'border-t border-gray-200 pt-4'}`}>
        <input
          type="search"
          placeholder="جستجو در تخصص‌ها..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputClass}
        />

        {groupedCategories.length > 0 && !isSidebar && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-600">
              {groupedCategories.length} دسته
              {searchResults.length > 0 && (
                <span className="mr-2 text-teal-600">· {searchResults.length} نتیجه</span>
              )}
            </span>
            <button
              type="button"
              onClick={toggleAllGroups}
              className={`${ghostBtnClass} w-full sm:w-auto`}
            >
              {Object.values(expandedGroups).some(Boolean) ? 'بستن همه' : 'باز کردن همه'}
            </button>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-3 sm:p-4">
            <h4 className="mb-3 text-sm font-semibold text-teal-900">
              نتایج جستجو ({searchResults.length})
            </h4>
            <div className={gridClass}>
              {searchResults.map((result) => (
                <CategoryCard
                  key={result.id}
                  item={result}
                  parentTitle={result.parentGroup.title}
                  isAdded={isAdded(result.id)}
                  saving={saving}
                  compact={isSidebar}
                  onToggle={() =>
                    isAdded(result.id)
                      ? handleRemoveSpecialization(result.id, result.title)
                      : handleAddSpecialization(result.id)
                  }
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {groupedCategories.map((group) => (
            <div key={group.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-right transition hover:bg-gray-50 sm:px-4"
              >
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-gray-400 transition ${expandedGroups[group.id] ? 'rotate-180' : ''}`}
                />
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  {group.icon && <span className="text-lg sm:text-xl">{group.icon}</span>}
                  <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-medium text-gray-900 sm:text-base">{group.title}</p>
                    <p className="text-xs text-gray-500">{group.subcategories.length} تخصص</p>
                  </div>
                </div>
              </button>

              {expandedGroups[group.id] && (
                <div className="border-t border-gray-100 p-3 sm:p-4">
                  <div className={gridClass}>
                    {group.subcategories.map((sub) => (
                      <CategoryCard
                        key={sub.id}
                        item={sub}
                        isAdded={isAdded(sub.id)}
                        saving={saving}
                        compact={isSidebar}
                        onToggle={() =>
                          isAdded(sub.id)
                            ? handleRemoveSpecialization(sub.id, sub.title)
                            : handleAddSpecialization(sub.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {searchResults.length === 0 && searchTerm && (
          <p className="py-4 text-center text-sm text-gray-500">نتیجه‌ای یافت نشد</p>
        )}
      </div>
    </div>
  );

  if (showSection && !isSidebar) {
    return (
      <FormSection id={sectionId} title="تخصص‌ها" description={sectionDescription}>
        {pickerContent}
      </FormSection>
    );
  }

  return pickerContent;
}

function CategoryCard({ item, parentTitle, isAdded, saving, onToggle, compact = false }) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-2.5 transition sm:p-3 ${
        compact ? 'min-h-[6.5rem]' : 'min-h-[7.5rem] sm:min-h-[8rem]'
      } ${
        isAdded
          ? 'border-emerald-200 bg-emerald-50/60'
          : 'border-gray-200 bg-gray-50/50 hover:border-teal-200'
      }`}
    >
      <div className="mb-3 flex items-start gap-2">
        {item.icon && <span className="shrink-0 text-lg">{item.icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.title}</p>
          {parentTitle && (
            <p className="mt-0.5 truncate text-xs text-gray-500">دسته: {parentTitle}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={saving}
        className={`mt-auto w-full rounded-lg py-2 text-xs font-medium transition disabled:opacity-50 sm:text-sm ${
          isAdded
            ? 'bg-red-600 text-white hover:bg-red-700'
            : `${primaryBtnClass} !py-2 !text-xs sm:!text-sm`
        }`}
      >
        {isAdded ? 'حذف' : 'افزودن'}
      </button>
    </div>
  );
}
