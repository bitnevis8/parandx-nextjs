'use client';

import { useMemo } from 'react';
import {
  flattenMainCategoryOptions,
  flattenServiceOptions,
  flattenSubcategoryOptions,
} from '../../utils/expertMapUtils';
import ServiceSearchSelect from './ServiceSearchSelect';

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

/** موبایل — هر دو فیلد پشت‌سرهم */
export default function MapCategoryFilterFields(props) {
  return (
    <>
      <MapMainCategorySelect {...props} />
      <MapSubcategorySelect {...props} />
    </>
  );
}
