'use client';

import { MapPinIcon } from '@heroicons/react/24/outline';
import { useCity } from '../../context/CityContext';

export default function CityPickerModal() {
  const { cities, showPicker, setShowPicker, setSelectedCity, selectedCity } = useCity();

  if (!showPicker || !cities.length) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-picker-title"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center">
            <MapPinIcon className="w-7 h-7 text-teal-600" />
          </div>
        </div>
        <h2 id="city-picker-title" className="text-xl font-bold text-gray-800 text-center mb-2">
          شهر خود را انتخاب کنید
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          متخصص‌ها و خدمات بر اساس شهری که انتخاب می‌کنید نشون داده می‌شن.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cities.map((city) => {
            const active = selectedCity?.id === city.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`rounded-xl border-2 p-4 text-right transition-all ${
                  active
                    ? 'border-teal-600 bg-teal-50 shadow-sm'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
              >
                <span className="block font-bold text-gray-800">{city.name}</span>
                <span className="block text-xs text-gray-500 mt-1">{city.province}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowPicker(false)}
          className="mt-5 w-full text-sm text-gray-500 hover:text-gray-700"
        >
          بعداً
        </button>
      </div>
    </div>
  );
}
