'use client';

import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { FormField, textareaClass } from '../ui/dashboard/DashboardUi';

const CityAddressMap = dynamic(() => import('../ui/CityAddressMap'), { ssr: false });

const goodsInputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20';

export default function GoodsNeedLocationSection({
  city,
  mapSelection,
  mapPayload,
  pinPosition,
  addressLine,
  showMap,
  onShowMapChange,
  onMapChange,
  onPinChange,
  onAddressChange,
}) {
  if (!city) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
        <input
          type="checkbox"
          checked={showMap}
          onChange={(e) => onShowMapChange?.(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500/30"
        />
        <span className="text-right text-sm leading-relaxed text-gray-700">
          <span className="font-medium text-gray-900">محل تحویل را روی نقشه مشخص کنم</span>
          <span className="mt-0.5 block text-xs text-gray-500">اختیاری — برای فروشگاه‌های نزدیک‌تر</span>
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
          <MapPinIcon className="h-3.5 w-3.5" aria-hidden />
          {city.name}
          {city.province ? ` · ${city.province}` : ''}
        </span>
        {showMap && regionLabel ? (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
            منطقه: {regionLabel}
          </span>
        ) : null}
        {showMap && pinPosition?.lat != null ? (
          <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs text-amber-800">
            نقطه روی نقشه ثبت شد
          </span>
        ) : null}
      </div>

      {showMap ? (
        <>
          <p className="text-xs leading-relaxed text-gray-500">
            روی نقشه زوم کنید و محل تحویل کالا را مشخص کنید؛ فروشگاه‌های نزدیک‌تر مطلع می‌شوند.
          </p>

          <div className="overflow-hidden rounded-2xl border border-amber-100 shadow-sm ring-1 ring-amber-50">
            <CityAddressMap
              key={`${city.slug}-${city.geoJsonUpdatedAt || 'none'}-goods`}
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
        </>
      ) : null}

      <FormField label="آدرس تحویل (متنی)" span="full">
        <textarea
          value={addressLine}
          onChange={(e) => onAddressChange?.(e.target.value)}
          rows={3}
          className={textareaClass.replace('focus:border-teal-500 focus:ring-teal-500/20', 'focus:border-amber-500 focus:ring-amber-500/20')}
          placeholder="خیابان، کوچه، پلاک — یا توضیح محل تحویل (اختیاری)"
        />
      </FormField>

      {showMap ? (
        <FormField label="منطقه (از نقشه)" span="full">
          <input
            type="text"
            readOnly
            value={regionLabel}
            placeholder="با انتخاب روی نقشه پر می‌شود"
            className={`${goodsInputClass} cursor-default bg-gray-50 text-gray-700 placeholder:text-gray-400`}
            tabIndex={-1}
          />
        </FormField>
      ) : null}
    </div>
  );
}
