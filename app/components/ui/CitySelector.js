'use client';

import { MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCity } from '../../context/CityContext';

/** انتخاب شهر — فقط دسکتاپ؛ موبایل از سرچ‌باکس هدر */
export default function CitySelector() {
  const { selectedCity, setShowPicker, loading, cities } = useCity();

  if (loading || !cities.length || !selectedCity) return null;

  return (
    <div className="hidden md:block shrink-0">
      <button
        type="button"
        onClick={() => setShowPicker(true)}
        className="
          inline-flex max-w-[11rem] items-center gap-1.5 rounded-full border border-gray-200
          bg-gray-50/90 px-3 py-1.5 text-sm font-semibold text-gray-800
          transition-colors hover:border-teal-200 hover:bg-teal-50/80
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 focus-visible:ring-offset-1
          dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100 dark:hover:border-teal-600 dark:hover:bg-sky-800 dark:focus-visible:ring-offset-sky-950
        "
        aria-label={`شهر فعلی: ${selectedCity.name}. برای تغییر شهر بزنید`}
      >
        <MapPinIcon className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
        <span className="truncate">{selectedCity.name}</span>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400 dark:text-sky-400" aria-hidden />
      </button>
    </div>
  );
}
