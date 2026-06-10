'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { isValidMapCenter } from '../../../utils/cityMapConfig';

const MapLibreMap = dynamic(() => import('../../map/MapLibreMap'), { ssr: false });

const Map = ({
  center = [35.7219, 51.3347],
  zoom = 13,
  markers = [],
  onMarkerClick,
  onMapClick,
  height = '400px',
  width = '100%',
  className = '',
  showControls = true,
  draggable = true,
  scrollWheelZoom = false,
  doubleClickZoom = false,
  touchZoom = false,
  boxZoom = false,
  keyboard = false,
}) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const safeCenter = useMemo(
    () => (isValidMapCenter(center) ? center : [35.7219, 51.3347]),
    [center]
  );
  const safeZoom = Number.isFinite(Number(zoom)) ? Number(zoom) : 13;

  const expertMarkers = useMemo(() => {
    const items = markers
      .filter(
        (marker) =>
          Number.isFinite(Number(marker.latitude)) && Number.isFinite(Number(marker.longitude))
      )
      .map((marker, index) => ({
        expertId: marker.id ?? `marker-${index}`,
        lat: Number(marker.latitude),
        lng: Number(marker.longitude),
        name: marker.name || `موقعیت ${index + 1}`,
        href: '#',
        raw: marker,
      }));

    if (selectedPosition) {
      items.push({
        expertId: 'selected-position',
        lat: selectedPosition[0],
        lng: selectedPosition[1],
        name: 'موقعیت انتخاب شده',
        href: '#',
      });
    }

    return items;
  }, [markers, selectedPosition]);

  const gesturesEnabled =
    draggable || scrollWheelZoom || doubleClickZoom || touchZoom || boxZoom || keyboard;

  const handleMapClick = onMapClick
    ? (lat, lng) => {
        setSelectedPosition([lat, lng]);
        onMapClick({ latitude: lat, longitude: lng });
      }
    : undefined;

  if (!isValidMapCenter(center)) {
    return (
      <div
        style={{ height, width }}
        className={`rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-sm text-gray-500 ${className}`}
      >
        مختصات نقشه برای این شهر تنظیم نشده است.
      </div>
    );
  }

  return (
    <div style={{ height, width }} className={`rounded-lg overflow-hidden ${className}`}>
      <MapLibreMap
        center={safeCenter}
        zoom={safeZoom}
        show3D={false}
        showBoundaries={false}
        expertMarkers={expertMarkers}
        gesturesEnabled={gesturesEnabled}
        mapClickEnabled={Boolean(handleMapClick)}
        onMapClick={handleMapClick}
        showNavigationControl={showControls}
      />
    </div>
  );
};

export default Map;
