'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { mergeAddressPayload, resolveProvinceIdForCity } from '../../utils/profileAddressUtils';
import { FormField, inputClass, textareaClass } from './dashboard/DashboardUi';
import { ProfileFormGroup } from './dashboard/ProfileViewUi';

const CityAddressMap = dynamic(() => import('./CityAddressMap'), { ssr: false });

export default function ProfileAddressForm({
  provinceId,
  countyName,
  cityId,
  addressLine,
  plaque,
  unit,
  postalCode,
  addressData,
  mapSelection,
  pinPosition,
  onProvinceChange,
  onProvinceAutoFill,
  onCountyChange,
  onCityChange,
  onAddressLineChange,
  onPlaqueChange,
  onUnitChange,
  onPostalCodeChange,
  onMapChange,
  onPinChange,
  embedded = true,
  title = 'آدرس و موقعیت',
  description = 'استان، شهر، محله و موقعیت دقیق روی نقشه',
}) {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingGeo, setLoadingGeo] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(API_ENDPOINTS.cities.getProvinces).then((r) => r.json()),
      fetch(API_ENDPOINTS.cities.getAll).then((r) => r.json()),
    ])
      .then(([provRes, cityRes]) => {
        if (cancelled) return;
        if (provRes.success) setProvinces(provRes.data || []);
        if (cityRes.success) {
          setCities((cityRes.data || []).filter((c) => c.isActive !== false));
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingGeo(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCities = useMemo(() => {
    if (!provinceId) return [];
    return cities.filter((c) => String(c.provinceId) === String(provinceId));
  }, [cities, provinceId]);

  const selectedCity = useMemo(() => {
    if (!cityId) return null;
    return cities.find((c) => String(c.id) === String(cityId)) || null;
  }, [cityId, cities]);

  // اگر شهر ذخیره‌شده داریم ولی استان خالی است، از جدول شهرها استان را پر کن (بدون پاک کردن شهر)
  useEffect(() => {
    if (loadingGeo || provinceId || !cityId || !cities.length) return;
    const resolved = resolveProvinceIdForCity(cityId, cities);
    if (resolved) {
      (onProvinceAutoFill || onProvinceChange)?.(resolved);
    }
  }, [loadingGeo, provinceId, cityId, cities, onProvinceChange, onProvinceAutoFill]);

  const regionLabel =
    addressData?.displayName ||
    addressData?.locationData?.displayName ||
    addressData?.neighborhoodName ||
    '';

  const handleMapPayload = useCallback(
    (selection, payload) => {
      const merged = mergeAddressPayload(payload, {
        provinceId,
        countyName,
        addressLine,
        plaque,
        unit,
        pinPosition,
        citySlug: selectedCity?.slug || '',
        cityId: selectedCity?.id || cityId || '',
      });
      onMapChange?.(selection, merged);
    },
    [
      provinceId,
      countyName,
      addressLine,
      plaque,
      unit,
      pinPosition,
      onMapChange,
      selectedCity?.slug,
      selectedCity?.id,
      cityId,
    ]
  );

  const handlePin = useCallback(
    (pin) => {
      const payload = mergeAddressPayload(
        addressData || { citySlug: selectedCity?.slug || '' },
        {
          provinceId,
          countyName,
          addressLine,
          plaque,
          unit,
          pinPosition: pin,
          citySlug: selectedCity?.slug || '',
          cityId: selectedCity?.id || cityId || '',
        }
      );
      onMapChange?.(mapSelection, payload);
    },
    [
      addressData,
      mapSelection,
      provinceId,
      countyName,
      addressLine,
      plaque,
      unit,
      onMapChange,
      selectedCity?.slug,
      selectedCity?.id,
      cityId,
    ]
  );

  const fields = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="استان">
          <select
            value={provinceId || ''}
            onChange={(e) => onProvinceChange?.(e.target.value ? Number(e.target.value) : '')}
            disabled={loadingGeo}
            className={inputClass}
          >
            <option value="">{loadingGeo ? 'بارگذاری...' : 'انتخاب استان'}</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="شهرستان">
          <input
            type="text"
            value={countyName || ''}
            onChange={(e) => onCountyChange?.(e.target.value)}
            className={inputClass}
            placeholder="نام شهرستان (اختیاری)"
          />
        </FormField>

        <FormField label="شهر">
          <select
            value={cityId || ''}
            onChange={(e) => {
              const nextId = e.target.value ? Number(e.target.value) : '';
              const nextCity = nextId ? cities.find((c) => c.id === nextId) : null;
              onCityChange?.(nextId, nextCity);
            }}
            disabled={loadingGeo || !provinceId}
            className={inputClass}
          >
            <option value="">
              {!provinceId ? 'ابتدا استان را انتخاب کنید' : 'انتخاب شهر'}
            </option>
            {cityId &&
            provinceId &&
            selectedCity &&
            !filteredCities.some((c) => String(c.id) === String(cityId)) ? (
              <option value={selectedCity.id}>{selectedCity.name}</option>
            ) : null}
            {filteredCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="محله / منطقه">
          <div className="flex min-h-[42px] items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <MapPinIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
            <span className={`text-sm ${regionLabel ? 'text-gray-800' : 'text-gray-400'}`}>
              {regionLabel || 'از نقشه پایین انتخاب کنید'}
            </span>
          </div>
        </FormField>
      </div>

      <FormField label="آدرس کامل">
        <textarea
          value={addressLine || ''}
          onChange={(e) => onAddressLineChange?.(e.target.value)}
          rows={2}
          className={`${textareaClass} min-h-[4.5rem]`}
          placeholder="خیابان، کوچه، بن‌بست..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <FormField label="پلاک">
          <input
            type="text"
            value={plaque || ''}
            onChange={(e) => onPlaqueChange?.(e.target.value)}
            className={inputClass}
            placeholder="مثلاً ۱۲"
          />
        </FormField>
        <FormField label="واحد">
          <input
            type="text"
            value={unit || ''}
            onChange={(e) => onUnitChange?.(e.target.value)}
            className={inputClass}
            placeholder="مثلاً ۳"
          />
        </FormField>
        <FormField label="کد پستی" className="col-span-2 sm:col-span-1">
          <input
            type="text"
            value={postalCode || ''}
            onChange={(e) => onPostalCodeChange?.(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className={inputClass}
            placeholder="اختیاری"
            inputMode="numeric"
            dir="ltr"
          />
        </FormField>
      </div>

      {!selectedCity ? (
        <p className="rounded-lg border border-dashed border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-amber-800">
          برای نقشه و ثبت موقعیت، شهر را انتخاب کنید.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] leading-relaxed text-gray-500">
            روی نقشه زوم کنید و روی محل دقیق آدرس کلیک کنید تا مارکر ثبت شود؛ منطقه (فاز) از همان نقطه
            تشخیص داده می‌شود.
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <CityAddressMap
              key={selectedCity.slug}
              city={selectedCity}
              mode="edit"
              value={mapSelection}
              showPin
              pinPosition={pinPosition}
              onPinChange={handlePin}
              onChange={handleMapPayload}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <ProfileFormGroup title={title} description={description}>
        {fields}
      </ProfileFormGroup>
    );
  }

  return fields;
}
