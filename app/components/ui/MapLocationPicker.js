"use client";

import { useState, useEffect, useRef } from 'react';

export default function MapLocationPicker({ 
  onLocationSelect, 
  initialLocation = null, 
  placeholder = "روی نقشه کلیک کنید تا موقعیت را انتخاب کنید",
  height = "400px"
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          setIsMapLoaded(true);
        };
        document.head.appendChild(script);
      } else if (window.L) {
        setIsMapLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && !map) {
      // Initialize map centered on Tehran
      const initialMap = window.L.map(mapRef.current).setView([35.6892, 51.3890], 13);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(initialMap);

      setMap(initialMap);

      // Add click event to map
      initialMap.on('click', (e) => {
        const { lat, lng } = e.latlng;
        handleLocationSelect(lat, lng);
      });

      // If there's an initial location, set it
      if (initialLocation && initialLocation.lat && initialLocation.lng) {
        const initialMarker = window.L.marker([initialLocation.lat, initialLocation.lng])
          .addTo(initialMap);
        setMarker(initialMarker);
        initialMap.setView([initialLocation.lat, initialLocation.lng], 15);
      }
    }
  }, [isMapLoaded, initialLocation]);

  const handleLocationSelect = async (lat, lng) => {
    try {
      // Remove existing marker
      if (marker) {
        map.removeLayer(marker);
      }

      // Add new marker
      const newMarker = window.L.marker([lat, lng]).addTo(map);
      setMarker(newMarker);

      // Get address from coordinates using reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=fa`
      );
      const data = await response.json();
      
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      const locationData = {
        lat,
        lng,
        address,
        displayName: data.display_name
      };

      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error getting address:', error);
      const locationData = {
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    }
  };

  const handleManualAddress = async () => {
    const address = prompt('آدرس خود را وارد کنید:');
    if (address) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1&accept-language=fa`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          handleLocationSelect(parseFloat(lat), parseFloat(lon));
        } else {
          alert('آدرس یافت نشد. لطفاً آدرس دقیق‌تری وارد کنید.');
        }
      } catch (error) {
        console.error('Error searching address:', error);
        alert('خطا در جستجوی آدرس');
      }
    }
  };

  if (!isMapLoaded) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleManualAddress}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          جستجوی آدرس
        </button>
        {selectedLocation && (
          <div className="flex-1 p-2 bg-gray-50 rounded-md text-sm text-gray-700">
            <strong>آدرس انتخاب شده:</strong> {selectedLocation.address}
          </div>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full rounded-lg border border-gray-300"
        style={{ height }}
      />
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        {placeholder}
      </p>
    </div>
  );
}
