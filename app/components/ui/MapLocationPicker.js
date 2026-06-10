'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapLibreMap = dynamic(() => import('../map/MapLibreMap'), { ssr: false });

export default function MapLocationPicker({
  onLocationSelect,
  initialLocation = null,
  placeholder = 'روی نقشه کلیک کنید تا موقعیت را انتخاب کنید',
  height = '400px',
}) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [pinPosition, setPinPosition] = useState(
    initialLocation?.lat != null && initialLocation?.lng != null ? initialLocation : null
  );

  const handleLocationSelect = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=fa`
      );
      const data = await response.json();

      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      const locationData = {
        lat,
        lng,
        address,
        displayName: data.display_name,
      };

      setPinPosition({ lat, lng });
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error getting address:', error);
      const locationData = {
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      };
      setPinPosition({ lat, lng });
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    }
  };

  const handleManualAddress = async () => {
    const address = prompt('آدرس خود را وارد کنید:');
    if (!address) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1&accept-language=fa`
      );
      const data = await response.json();

      if (data?.length) {
        const { lat, lon } = data[0];
        await handleLocationSelect(parseFloat(lat), parseFloat(lon));
      } else {
        alert('آدرس یافت نشد. لطفاً آدرس دقیق‌تری وارد کنید.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      alert('خطا در جستجوی آدرس');
    }
  };

  const initialCenter =
    initialLocation?.lat != null && initialLocation?.lng != null
      ? [initialLocation.lat, initialLocation.lng]
      : [35.6892, 51.389];

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleManualAddress}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
        >
          جستجوی آدرس
        </button>
        {selectedLocation ? (
          <div className="flex-1 rounded-md bg-gray-50 p-2 text-sm text-gray-700">
            <strong>آدرس انتخاب شده:</strong> {selectedLocation.address}
          </div>
        ) : null}
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-gray-300" style={{ height }}>
        <MapLibreMap
          center={initialCenter}
          zoom={pinPosition ? 15 : 13}
          show3D={false}
          showBoundaries={false}
          pinPosition={pinPosition}
          pinPreviewActive={!pinPosition}
          gesturesEnabled
          mapClickEnabled
          onMapClick={handleLocationSelect}
        />
      </div>

      <p className="mt-2 text-center text-xs text-gray-500">{placeholder}</p>
    </div>
  );
}
