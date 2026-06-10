'use client';

import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { FormField, inputClass, textareaClass } from '../ui/dashboard/DashboardUi';
import LocationShareLinks from '../ui/LocationShareLinks';

const CityAddressMap = dynamic(() => import('../ui/CityAddressMap'), { ssr: false });

export default function RequestLocationSection({
  city,
  mapSelection,
  mapPayload,
  pinPosition,
  addressLine,
  onMapChange,
  onPinChange,
  onAddressChange,
}) {
  if (!city) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        شهر انتخاب نشده است. از نوار بالای سایت شهر خود را انتخاب کنید.
      </p>
    );
  }

  const regionLabel =
    mapPayload?.displayName ||
    mapPayload?.locationData?.displayName ||
    '';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
          <MapPinIcon className="h-3.5 w-3.5" aria-hidden />
          {city.name}
          {city.province ? ` · ${city.province}` : ''}
        </span>
        {regionLabel ? (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
            منطقه: {regionLabel}
          </span>
        ) : null}
        {pinPosition?.lat != null ? (
          <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs text-cyan-800">
            نقطه روی نقشه ثبت شد
          </span>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-gray-500">
        روی نقشه زوم کنید و روی محل دقیق کار کلیک کنید تا{' '}
        <strong className="font-medium text-gray-700">مارکر</strong>
        {' '}
        ثبت شود؛ منطقه (فاز) از همان نقطه تشخیص داده می‌شود.
      </p>

      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm ring-1 ring-gray-100">
        <CityAddressMap
          key={`${city.slug}-${city.geoJsonUpdatedAt || 'none'}`}
          city={city}
          mode="edit"
          value={mapSelection}
          showPin
          pinPosition={pinPosition}
          onPinChange={onPinChange}
          onChange={onMapChange}
          mapViewportHeightClass="h-52 sm:h-64 md:h-72 lg:h-80"
        />
      </div>

      <FormField label="آدرس متنی" span="full">
        <textarea
          value={addressLine}
          onChange={(e) => onAddressChange?.(e.target.value)}
          rows={3}
          className={textareaClass}
          placeholder="خیابان، کوچه، پلاک، واحد، توضیح دسترسی..."
        />
      </FormField>

      <FormField label="منطقه (از نقشه)" span="full">
        <input
          type="text"
          readOnly
          value={regionLabel}
          placeholder="اختیاری — با انتخاب روی نقشه پر می‌شود"
          className={`${inputClass} cursor-default bg-gray-50 text-gray-700 placeholder:text-gray-400`}
          tabIndex={-1}
        />
      </FormField>

      {pinPosition?.lat != null && pinPosition?.lng != null ? (
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <p className="mb-2 text-xs font-medium text-gray-700">مسیریابی و اشتراک‌گذاری موقعیت</p>
          <LocationShareLinks
            lat={pinPosition.lat}
            lng={pinPosition.lng}
            label={[city.name, regionLabel, addressLine].filter(Boolean).join('، ')}
          />
        </div>
      ) : null}
    </div>
  );
}
