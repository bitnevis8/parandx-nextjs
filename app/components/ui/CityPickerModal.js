'use client';

import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCity } from '../../context/CityContext';

export default function CityPickerModal() {
  const { cities, showPicker, setShowPicker, setSelectedCity, selectedCity } = useCity();

  if (!showPicker || !cities.length) return null;

  const close = () => setShowPicker(false);

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-end justify-center bg-black/45 sm:items-center sm:p-4"
      onClick={close}
      role="presentation"
    >
      <div
        className="
          w-full max-h-[min(88vh,32rem)] overflow-y-auto bg-white shadow-2xl
          rounded-t-2xl sm:max-w-md sm:rounded-2xl
          pb-[max(env(safe-area-inset-bottom,0px),0.75rem)]
          dark:bg-sky-900 dark:shadow-black/40
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 dark:border-sky-800 dark:bg-sky-900 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100">
              <MapPinIcon className="h-5 w-5 text-teal-600" aria-hidden />
            </span>
            <div className="min-w-0 text-right">
              <h2 id="city-picker-title" className="text-base font-bold text-gray-900 sm:text-lg">
                انتخاب شهر
              </h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                نتایج بر اساس شهر انتخابی شماست
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-sky-400 dark:hover:bg-sky-800"
            aria-label="بستن"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-gray-200 sm:hidden" aria-hidden />

        <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-2 sm:gap-3 sm:p-6">
          {cities.map((city) => {
            const active = selectedCity?.id === city.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`rounded-xl border-2 p-3.5 text-right transition-all sm:p-4 ${
                  active
                    ? 'border-teal-600 bg-teal-50 shadow-sm dark:border-teal-500 dark:bg-teal-950/40'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50 dark:hover:border-teal-600 dark:hover:bg-sky-800'
                }`}
              >
                <span className="block font-bold text-gray-800">{city.name}</span>
                {city.province ? (
                  <span className="mt-0.5 block text-xs text-gray-500">{city.province}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
