'use client';

import { useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapComponent, MapTypes } from '@neshan-maps-platform/mapbox-gl-react';
import '@neshan-maps-platform/mapbox-gl-react/dist/style.css';
import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';

const MapUserLocationControl = dynamic(() => import('../map/MapUserLocationControl'), { ssr: false });

export default function HomeCityMapNeshan({
  mapKey,
  center,
  zoom,
  cityId,
  expertMarkers = [],
  onMapInstanceReady = null,
}) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const syncMarkers = useCallback((map) => {
    if (!map) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!expertMarkers.length) return;

    const mapboxgl = require('@neshan-maps-platform/mapbox-gl');

    expertMarkers.forEach((item) => {
      const el = document.createElement('a');
      el.href = item.href;
      el.className = 'expert-map-marker-neshan';
      el.title = item.name;
      el.setAttribute('aria-label', item.name);

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([item.lng, item.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [expertMarkers]);

  const handleMapReady = useCallback(
    (map) => {
      mapRef.current = map;
      onMapInstanceReady?.(map);
      syncMarkers(map);
    },
    [onMapInstanceReady, syncMarkers]
  );

  useEffect(() => {
    syncMarkers(mapRef.current);
  }, [syncMarkers]);

  useEffect(
    () => () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    },
    []
  );

  return (
    <div className="relative h-full w-full">
      <MapComponent
        key={cityId}
        className="h-full w-full"
        style={{ width: '100%', height: '100%' }}
        mapSetter={handleMapReady}
        options={{
          mapKey,
          mapType: MapTypes.neshanVector,
          center,
          zoom,
          poi: true,
          traffic: false,
          scrollZoom: true,
          mapTypeControllerStatus: { show: false },
        }}
      />
      <MapUserLocationControl mapRef={mapRef} markerEngine="neshan" />
    </div>
  );
}
