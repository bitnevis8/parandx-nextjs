'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../config/api';

export default function LocationPageClient({ locationData }) {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      if (!locationData) return;
      
      try {
        // دریافت استان‌ها (divisionType = 1) که والدشان ایران است
        const response = await fetch(API_ENDPOINTS.locations.getChildren(locationData.id));
        const data = await response.json();
        
        if (data.success) {
          setProvinces(data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [locationData]);

  if (!locationData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">اطلاعات مکان یافت نشد</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between min-h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <Link href="/" className="text-gray-500 hover:text-gray-700 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="mr-2 sm:mr-4 text-base sm:text-xl font-semibold text-gray-900 truncate">
                {locationData.displayName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-8">
        {/* Location Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-5 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
              {locationData.name}
            </h2>
            {locationData.population && (
              <div className="text-sm text-gray-500">
                جمعیت: {locationData.population.toLocaleString()} نفر
              </div>
            )}
          </div>
          
          {locationData.latitude && locationData.longitude && (
            <div className="text-sm text-gray-600 mb-4">
              مختصات: {locationData.latitude}, {locationData.longitude}
            </div>
          )}
        </div>

        {/* Provinces Box */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            استان‌ها
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {provinces.map((province) => (
                <Link
                  key={province.id}
                  href={`/location/${province.slug || province.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {province.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {province.displayName}
                  </div>
                  {province.population && (
                    <div className="text-xs text-gray-500 mt-1">
                      جمعیت: {province.population.toLocaleString()} نفر
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 