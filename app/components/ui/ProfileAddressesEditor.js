'use client';

import { useMemo } from 'react';
import { ChevronDownIcon, PlusIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import ProfileAddressForm from './ProfileAddressForm';
import { FormField, inputClass } from './dashboard/DashboardUi';
import { ProfileFormGroup } from './dashboard/ProfileViewUi';
import {
  MAX_PROFILE_ADDRESSES,
  createEmptyAddress,
  getPinFromAddressData,
  mergeAddressPayload,
  setPrimaryAddress,
} from '../../utils/profileAddressUtils';
import { getMapSelectionFromAddressData } from '../../utils/geojsonBoundary';

export function ProfileAddressesEditor({
  addresses,
  onChange,
  variant = 'personal',
  sectionId,
  title,
  description,
  embedded = true,
}) {
  const isExpert = variant === 'expert';
  const addLabel = isExpert ? 'افزودن شعبه / آدرس' : 'افزودن آدرس';

  const updateAddress = (id, patch) => {
    onChange(addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeAddress = (id) => {
    if (addresses.length <= 1) return;
    const next = addresses.filter((a) => a.id !== id);
    if (!next.some((a) => a.isPrimary)) next[0].isPrimary = true;
    onChange(next);
  };

  const makePrimary = (id) => {
    onChange(setPrimaryAddress(addresses, id));
  };

  const addAddress = () => {
    if (addresses.length >= MAX_PROFILE_ADDRESSES) return;
    onChange([
      ...addresses,
      createEmptyAddress({
        title: isExpert ? 'شعبه / دفتر' : `آدرس ${addresses.length + 1}`,
        isPrimary: false,
      }),
    ]);
  };

  const cards = addresses.map((addr, index) => (
    <AddressCard
      key={addr.id}
      address={addr}
      index={index}
      isExpert={isExpert}
      canRemove={addresses.length > 1}
      onUpdate={(patch) => updateAddress(addr.id, patch)}
      onRemove={() => removeAddress(addr.id)}
      onMakePrimary={() => makePrimary(addr.id)}
    />
  ));

  const body = (
    <div className="space-y-4">
      {cards}

      {addresses.length < MAX_PROFILE_ADDRESSES ? (
        <button
          type="button"
          onClick={addAddress}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-3 text-sm font-medium text-teal-800 transition hover:bg-teal-50"
        >
          <PlusIcon className="h-4 w-4" aria-hidden />
          {addLabel}
        </button>
      ) : null}
    </div>
  );

  if (embedded) {
    return (
      <ProfileFormGroup
        id={sectionId}
        title={title || (isExpert ? 'آدرس‌های محل فعالیت' : 'آدرس‌ها')}
        description={
          description ||
          (isExpert
            ? 'یک آدرس اصلی + شعبه‌ها با عنوان دلخواه'
            : 'چند آدرس با عنوان دلخواه — یکی اصلی')
        }
      >
        {body}
      </ProfileFormGroup>
    );
  }

  return body;
}

function AddressCard({
  address,
  index,
  isExpert,
  canRemove,
  onUpdate,
  onRemove,
  onMakePrimary,
}) {
  const mapSelection = useMemo(
    () => getMapSelectionFromAddressData(address.addressData),
    [address.addressData]
  );
  const pinPosition = useMemo(
    () => getPinFromAddressData(address.addressData),
    [address.addressData]
  );

  const titlePlaceholder = address.isPrimary
    ? 'آدرس اصلی'
    : isExpert
      ? 'مثلاً دفتر فاز ۲'
      : 'مثلاً منزل دوم';

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        address.isPrimary ? 'border-teal-200 ring-1 ring-teal-100' : 'border-gray-200'
      } bg-white`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-3 py-2.5 sm:px-4">
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <FormField label="" className="min-w-0 flex-1 !mb-0">
          <input
            type="text"
            value={address.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className={`${inputClass} !py-1.5 text-sm font-medium`}
            placeholder={titlePlaceholder}
          />
        </FormField>

        {address.isPrimary ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
            <StarSolidIcon className="h-3 w-3" aria-hidden />
            {isExpert ? 'آدرس اصلی' : 'اصلی'}
          </span>
        ) : (
          <button
            type="button"
            onClick={onMakePrimary}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition hover:border-teal-200 hover:text-teal-700"
          >
            <StarIcon className="h-3 w-3" aria-hidden />
            تنظیم به‌عنوان اصلی
          </button>
        )}

        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`حذف ${address.title || `آدرس ${index + 1}`}`}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="p-3 sm:p-4">
        <ProfileAddressForm
          embedded={false}
          provinceId={address.provinceId}
          countyName={address.countyName}
          cityId={address.cityId}
          addressLine={address.addressLine}
          plaque={address.plaque}
          unit={address.unit}
          postalCode={address.postalCode}
          addressData={address.addressData}
          mapSelection={mapSelection}
          pinPosition={pinPosition}
          onProvinceAutoFill={(id) => onUpdate({ provinceId: id })}
          onProvinceChange={(id) => {
            onUpdate({ provinceId: id, cityId: '', addressData: null });
          }}
          onCountyChange={(v) => onUpdate({ countyName: v })}
          onCityChange={(nextCityId, nextCity) => {
            onUpdate({
              cityId: nextCityId || '',
              provinceId: nextCity?.provinceId || address.provinceId,
              addressData:
                !nextCity || address.addressData?.citySlug !== nextCity.slug
                  ? null
                  : address.addressData,
            });
          }}
          onAddressLineChange={(v) => onUpdate({ addressLine: v })}
          onPlaqueChange={(v) => onUpdate({ plaque: v })}
          onUnitChange={(v) => onUpdate({ unit: v })}
          onPostalCodeChange={(v) => onUpdate({ postalCode: v })}
          onMapChange={(selection, payload) => {
            onUpdate({
              addressData: mergeAddressPayload(payload, {
                provinceId: address.provinceId,
                countyName: address.countyName,
                addressLine: address.addressLine,
                plaque: address.plaque,
                unit: address.unit,
                cityId: address.cityId,
              }),
            });
          }}
          onPinChange={(pin) => {
            onUpdate({
              addressData: mergeAddressPayload(address.addressData || {}, {
                provinceId: address.provinceId,
                countyName: address.countyName,
                addressLine: address.addressLine,
                plaque: address.plaque,
                unit: address.unit,
                pinPosition: pin,
                cityId: address.cityId,
              }),
            });
          }}
        />
      </div>
    </div>
  );
}
