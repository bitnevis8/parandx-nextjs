'use client';

import { useMemo } from 'react';
import {
  flattenMainCategoryOptions,
  flattenProfessionSearchOptions,
  flattenServiceOptions,
  flattenSubcategoryOptions,
  encodeProfessionSearchValue,
  applyProfessionSearchSelection,
} from '../../utils/expertMapUtils';
import ServiceSearchSelect from './ServiceSearchSelect';
import MapGlassSearchSelect from '../map/MapGlassSearchSelect';

const ALL_MAIN_OPTION = {
  id: 'all-main',
  slug: '',
  title: 'همه دسته‌ها',
  searchText: 'همه دسته‌ها',
};

export function useMapCategoryOptions(categories = [], parentSlug = '') {
  const mainOptions = useMemo(() => {
    const options = flattenMainCategoryOptions(categories);
    return [ALL_MAIN_OPTION, ...options];
  }, [categories]);

  const subOptions = useMemo(() => {
    if (parentSlug) {
      return flattenSubcategoryOptions(categories, parentSlug);
    }
    return flattenServiceOptions(categories);
  }, [categories, parentSlug]);

  return { mainOptions, subOptions };
}

export function MapMainCategorySelect({
  categories = [],
  parentSlug = '',
  serviceSlug = '',
  onParentChange,
  onServiceChange,
  mapToolbar = true,
  size = 'md',
  mobileTopPicker = false,
  inputId = 'map-main-category-search',
}) {
  const { mainOptions } = useMapCategoryOptions(categories, parentSlug);

  const handleParentChange = (slug) => {
    onParentChange?.(slug || '');
    onServiceChange?.('');
  };

  return (
    <ServiceSearchSelect
      options={mainOptions}
      value={parentSlug || null}
      onChange={handleParentChange}
      disabled={!mainOptions.length}
      mapToolbar={mapToolbar}
      size={size}
      mobileTopPicker={mobileTopPicker}
      inputId={inputId}
      mobileDialogLabel="انتخاب دسته اصلی"
      placeholder="همه دسته‌ها"
      emptyHint="دسته‌ای پیدا نشد"
      showParentInList={false}
    />
  );
}

export function MapSubcategorySelect({
  categories = [],
  parentSlug = '',
  serviceSlug = '',
  onServiceChange,
  mapToolbar = true,
  size = 'md',
  mobileTopPicker = false,
  inputId = 'map-subcategory-search',
}) {
  const { subOptions } = useMapCategoryOptions(categories, parentSlug);

  const subPlaceholder = parentSlug
    ? 'همه زیردسته‌ها'
    : 'جستجوی زیردسته (اختیاری)';

  return (
    <ServiceSearchSelect
      options={subOptions}
      value={serviceSlug || null}
      onChange={onServiceChange}
      disabled={!subOptions.length}
      mapToolbar={mapToolbar}
      size={size}
      mobileTopPicker={mobileTopPicker}
      inputId={inputId}
      mobileDialogLabel="انتخاب زیردسته"
      placeholder={subPlaceholder}
      emptyHint="زیردسته‌ای پیدا نشد"
      showParentInList={!parentSlug}
    />
  );
}

/** جستجوی یکپارچه — دسته اصلی و زیردسته */
export function MapProfessionSearchSelect({
  categories = [],
  parentSlug = '',
  serviceSlug = '',
  onParentChange,
  onServiceChange,
  mapToolbar = true,
  size = 'md',
  mobileTopPicker = false,
  inputId = 'map-profession-search',
  mapGlassCorner = false,
}) {
  const options = useMemo(() => flattenProfessionSearchOptions(categories), [categories]);
  const glassOptions = useMemo(
    () =>
      options.map((opt) => ({
        value: opt.slug,
        label: opt.title,
        detail: opt.parentTitle,
        searchText: opt.searchText,
      })),
    [options]
  );
  const value = encodeProfessionSearchValue(parentSlug, serviceSlug);

  const handleChange = (slug) => {
    applyProfessionSearchSelection(slug, categories, { onParentChange, onServiceChange });
  };

  if (mapGlassCorner) {
    return (
      <MapGlassSearchSelect
        label="جستجو"
        value={value}
        onChange={handleChange}
        options={glassOptions}
        disabled={!options.length}
        searchPlaceholder="جستجوی حرفه…"
        emptyHint="حرفه یا دسته‌ای پیدا نشد"
      />
    );
  }

  return (
    <ServiceSearchSelect
      options={options}
      value={value || null}
      onChange={handleChange}
      disabled={!options.length}
      mapToolbar={mapToolbar}
      size={size}
      mobileTopPicker={mobileTopPicker}
      inputId={inputId}
      mobileDialogLabel="جستجوی حرفه یا دسته"
      placeholder="جستجوی حرفه یا دسته…"
      emptyHint="حرفه یا دسته‌ای پیدا نشد"
      showParentInList
    />
  );
}

/** موبایل — یک فیلد جستجو */
export default function MapCategoryFilterFields(props) {
  return <MapProfessionSearchSelect {...props} />;
}
