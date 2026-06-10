'use client';

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

export default function StoreCategoriesPicker({
  targetUserId,
  readOnly = false,
  showSection = true,
  sectionId = 'merchant-subcategories',
  displayMode = false,
  layout = 'default',
}) {
  const [categories, setCategories] = useState([]);
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
      let categoriesUrl = API_ENDPOINTS.merchants.getCategories;
      if (targetUserId) {
        categoriesUrl = `${API_ENDPOINTS.merchants.getUserCategories}?userId=${targetUserId}`;
      }

      const [catRes, goodsRes] = await Promise.all([
        fetch(categoriesUrl, { credentials: 'include' }),
        fetch(API_ENDPOINTS.categories.getAll('goods'), { credentials: 'include' }),
      ]);

      if (catRes.ok) {
        const catResult = await catRes.json();
        if (catResult.success) setCategories(catResult.data || []);
      }

      if (goodsRes.ok) {
        const goodsResult = await goodsRes.json();
        if (goodsResult.success) {
          setGroupedCategories(
            goodsResult.data.filter((c) => c.subcategories?.length > 0)
          );
        }
      }
    } catch (error) {
      console.error('Error fetching store categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (categoryId) => {
    try {
      setSaving(true);
      const response = await fetch(API_ENDPOINTS.merchants.addCategory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ categoryId, ...(targetUserId ? { userId: targetUserId } : {}) }),
      });
      const result = await response.json();
      if (response.ok && result.success) fetchData();
      else alert('خطا: ' + (result.message || 'خطای نامشخص'));
    } catch {
      alert('خطا در افزودن دسته');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (categoryId, title) => {
    if (!window.confirm(`دسته «${title}» حذف شود؟`)) return;
    try {
      setSaving(true);
      let removeUrl = API_ENDPOINTS.merchants.removeCategory(categoryId);
      if (targetUserId) removeUrl += `?userId=${targetUserId}`;
      const response = await fetch(removeUrl, { method: 'DELETE', credentials: 'include' });
      const result = await response.json();
      if (response.ok && result.success) fetchData();
      else alert('خطا: ' + (result.message || 'خطای نامشخص'));
    } catch {
      alert('خطا در حذف دسته');
    } finally {
      setSaving(false);
    }
  };

  const isAdded = (categoryId) => categories.some((c) => c.id === categoryId);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => (prev[groupId] ? {} : { [groupId]: true }));
  };

  if (loading) return readOnly ? null : <DashboardLoading />;

  const isSidebar = layout === 'sidebar';
  const gridClass = isSidebar ? 'grid grid-cols-1 gap-2 sm:grid-cols-2' : pickerGridClass;
  const countLabel = categories.length > 0 ? `${categories.length} مورد` : null;

  const chipsBlock = (
    <div className="col-span-full">
      {countLabel ? (
        <span className="mb-3 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
          {countLabel}
        </span>
      ) : null}
      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900"
            >
              {cat.icon && <span aria-hidden>{cat.icon}</span>}
              <span className="truncate">{cat.title}</span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemove(cat.id, cat.title)}
                  disabled={saving}
                  className="rounded-full p-0.5 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                  aria-label={`حذف ${cat.title}`}
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
          {readOnly ? 'دسته‌ای ثبت نشده' : 'هنوز دسته کالایی انتخاب نکرده‌اید'}
        </p>
      )}
    </div>
  );

  if (readOnly) {
    const chips =
      categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                displayMode
                  ? 'rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm text-gray-800'
                  : 'rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-900'
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.title}
            </span>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-center text-sm text-gray-500">
          دسته‌ای ثبت نشده
        </p>
      );

    if (showSection) {
      const Section = displayMode ? ProfileViewSection : FormSection;
      return (
        <Section id={sectionId} title="زیردسته‌های کالا" description="زیردسته‌هایی که فروشگاه در آن‌ها فعال است">
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
          placeholder="جستجو در دسته‌های کالا..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputClass}
        />
        {searchResults.length > 0 && (
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 sm:p-4">
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
                      ? handleRemove(result.id, result.title)
                      : handleAdd(result.id)
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
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-right hover:bg-gray-50 sm:px-4"
              >
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-gray-400 transition ${expandedGroups[group.id] ? 'rotate-180' : ''}`}
                />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {group.icon && <span className="text-lg">{group.icon}</span>}
                  <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-medium text-gray-900">{group.title}</p>
                    <p className="text-xs text-gray-500">{group.subcategories.length} زیردسته</p>
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
                          isAdded(sub.id) ? handleRemove(sub.id, sub.title) : handleAdd(sub.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (showSection && !isSidebar) {
    return (
      <FormSection id={sectionId} title="زیردسته‌های کالا" description="زیردسته‌هایی که فروشگاه در آن‌ها فعال است">
        {pickerContent}
      </FormSection>
    );
  }

  return pickerContent;
}

function CategoryCard({ item, parentTitle, isAdded, saving, onToggle, compact = false }) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-2.5 sm:p-3 ${
        compact ? 'min-h-[6.5rem]' : 'min-h-[7.5rem]'
      } ${isAdded ? 'border-emerald-200 bg-emerald-50/60' : 'border-gray-200 bg-gray-50/50 hover:border-amber-200'}`}
    >
      <div className="mb-3 flex items-start gap-2">
        {item.icon && <span className="text-lg">{item.icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.title}</p>
          {parentTitle ? <p className="mt-0.5 text-xs text-gray-500">دسته: {parentTitle}</p> : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={saving}
        className={`mt-auto w-full rounded-lg py-2 text-xs font-medium sm:text-sm ${
          isAdded ? 'bg-red-600 text-white hover:bg-red-700' : `${primaryBtnClass} !py-2 !text-xs`
        } disabled:opacity-50`}
      >
        {isAdded ? 'حذف' : 'افزودن'}
      </button>
    </div>
  );
}
