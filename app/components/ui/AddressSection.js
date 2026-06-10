'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { getMapSelectionFromAddressData } from '../../utils/geojsonBoundary';
import {
  FormField,
  FormSection,
  inputClass,
  textareaClass,
} from './dashboard/DashboardUi';
import { ProfileFormGroup } from './dashboard/ProfileViewUi';

const CityAddressMap = dynamic(() => import('./CityAddressMap'), { ssr: false });

export default function AddressSection({
  title = 'آدرس',
  description = 'شهر، آدرس پستی و انتخاب منطقه روی نقشه',
  sectionId,
  leadingFields = null,
  compactLayout = false,
  embedded = false,
  address = '',
  postalCode = '',
  addressData = null,
  cityId = '',
  initialCity = null,
  onCityChange,
  onAddressChange,
  onPostalCodeChange,
  onMapChange,
  mapSelection: mapSelectionProp,
}) {
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(API_ENDPOINTS.cities.getAll)
      .then((res) => res.json())
      .then((result) => {
        if (cancelled) return;
        if (result.success && Array.isArray(result.data)) {
          setCities(result.data.filter((c) => c.isActive !== false));
        }
      })
      .catch((err) => {
        console.error('Error loading cities:', err);
      })
      .finally(() => {
        if (!cancelled) setCitiesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCity = useMemo(() => {
    if (cityId) {
      const match = cities.find((c) => String(c.id) === String(cityId));
      if (match) return match;
    }
    return initialCity || null;
  }, [cityId, cities, initialCity]);

  const mapSelection = mapSelectionProp || getMapSelectionFromAddressData(addressData);
  const regionLabel =
    addressData?.displayName ||
    addressData?.locationData?.displayName ||
    null;

  const handleCitySelect = (e) => {
    const nextId = e.target.value ? Number(e.target.value) : '';
    const nextCity = nextId ? cities.find((c) => c.id === nextId) : null;
    onCityChange?.(nextId, nextCity);
  };

  const cityField = (
    <FormField label="شهر">
      <select
        value={cityId || ''}
        onChange={handleCitySelect}
        disabled={citiesLoading}
        className={inputClass}
      >
        <option value="">
          {citiesLoading ? 'در حال بارگذاری...' : 'انتخاب شهر'}
        </option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}{c.province ? ` (${c.province})` : ''}
          </option>
        ))}
      </select>
    </FormField>
  );

  const postalField = (
    <FormField label="کد پستی">
      <input
        type="text"
        name="postalCode"
        value={postalCode}
        onChange={(e) => onPostalCodeChange?.(e.target.value.replace(/\D/g, '').slice(0, 10))}
        className={inputClass}
        placeholder="۱۰ رقم"
        inputMode="numeric"
        maxLength={10}
        dir="ltr"
      />
    </FormField>
  );

  const addressField = compactLayout ? (
    <FormField label="آدرس">
      <input
        type="text"
        name="address"
        value={address}
        onChange={(e) => onAddressChange?.(e.target.value)}
        className={inputClass}
        placeholder="خیابان، کوچه، پلاک..."
      />
    </FormField>
  ) : (
    <FormField label="آدرس کامل" span="full">
      <textarea
        name="address"
        value={address}
        onChange={(e) => onAddressChange?.(e.target.value)}
        rows={2}
        className={`${textareaClass} min-h-[4.5rem]`}
        placeholder="خیابان، کوچه، پلاک، واحد..."
      />
    </FormField>
  );

  const regionField = (
    <FormField label="منطقه" span="full">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
        <MapPinIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
        <p className={`min-w-0 flex-1 text-sm ${regionLabel ? 'text-gray-800' : 'text-gray-400'}`}>
          {regionLabel || 'اختیاری — از نقشه انتخاب کنید'}
        </p>
      </div>
    </FormField>
  );

  const mapBlock = !selectedCity ? (
    <p className="col-span-full rounded-lg border border-dashed border-amber-200 bg-amber-50/60 px-3 py-2 text-xs text-amber-800">
      برای نقشه، ابتدا شهر را انتخاب کنید.
    </p>
  ) : (
    <div className="col-span-full space-y-2">
      <p className="text-[11px] text-gray-500">
        نقشه را بکشید و زوم کنید
        {selectedCity.hasBoundaryMap ? '؛ روی منطقه کلیک کنید.' : '.'}
      </p>
      <div className="h-52 overflow-hidden rounded-xl border border-gray-200 sm:h-64">
        <CityAddressMap
          key={`${selectedCity.slug}-${selectedCity.geoJsonUpdatedAt || 'none'}`}
          city={selectedCity}
          mode="edit"
          showPin={false}
          value={mapSelection}
          onChange={(selection, payload) => onMapChange?.(selection, payload)}
        />
      </div>
    </div>
  );

  const fieldsGrid = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {leadingFields}
      {cityField}
      {postalField}
      {compactLayout ? (
        <>
          {regionField}
          {addressField}
        </>
      ) : (
        <>
          {addressField}
          {regionField}
        </>
      )}
      {mapBlock}
    </div>
  );

  if (embedded) {
    return (
      <ProfileFormGroup title={title} description={description}>
        {fieldsGrid}
      </ProfileFormGroup>
    );
  }

  const locationGridClass = compactLayout
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid grid-cols-1 gap-4 sm:grid-cols-2';

  return (
    <FormSection id={sectionId} title={title} description={description} gridClass={locationGridClass}>
      {leadingFields}
      {cityField}
      {postalField}
      {compactLayout ? (
        <>
          {regionField}
          {addressField}
        </>
      ) : (
        <>
          {addressField}
          {regionField}
        </>
      )}
      {mapBlock}
    </FormSection>
  );
}
