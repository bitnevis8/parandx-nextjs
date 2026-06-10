'use client';

import dynamic from 'next/dynamic';
import LocationShareLinks from '../ui/LocationShareLinks';
import { extractMapPoint } from '../../utils/mapShareLinks';

const CityAddressMap = dynamic(() => import('../ui/CityAddressMap'), { ssr: false });

export default function RequestLocationPreview({
  city,
  locationData,
  locationLabel,
  mapSelection,
  className = '',
}) {
  const pin = extractMapPoint(locationData);
  const regionLabel =
    locationData?.displayName ||
    locationData?.mapPayload?.displayName ||
    locationLabel ||
    '';

  if (!city && !pin && !locationLabel) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {locationLabel ? (
        <p className="text-sm text-gray-700">{locationLabel}</p>
      ) : null}

      {city && pin ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <div className="h-48 sm:h-56">
            <CityAddressMap
              key={`preview-${city.slug}-${pin.lat}-${pin.lng}`}
              city={city}
              mode="preview"
              value={mapSelection || { sectionId: locationData?.sectionId || '', neighborhoodId: locationData?.neighborhoodId || '' }}
              showPin
              focusOnPin
              pinPosition={pin}
              className="rounded-2xl"
            />
          </div>
        </div>
      ) : null}

      {pin ? (
        <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4">
          <p className="mb-2 text-xs font-medium text-gray-700">باز کردن در اپلیکیشن نقشه</p>
          <LocationShareLinks
            lat={pin.lat}
            lng={pin.lng}
            label={[city?.name, regionLabel, locationData?.addressLine].filter(Boolean).join('، ')}
          />
        </div>
      ) : null}
    </div>
  );
}
