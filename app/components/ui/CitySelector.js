'use client';

import { MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCity } from '../../context/CityContext';

export default function CitySelector({ compact = false }) {
  const { cities, selectedCity, setSelectedCity, loading } = useCity();

  if (loading || !cities.length) return null;

  return (
    <div className="relative shrink-0">
      <label htmlFor="city-selector" className="sr-only">انتخاب شهر</label>
      <div className="relative">
        <MapPinIcon
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none ${compact ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'}`}
          aria-hidden
        />
        <select
          id="city-selector"
          value={selectedCity?.id ?? ''}
          onChange={(e) => {
            const city = cities.find((c) => String(c.id) === e.target.value);
            if (city) setSelectedCity(city);
          }}
          className={`
            appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white text-gray-800
            hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
            pr-8 pl-7 font-medium transition-colors
            ${compact ? 'py-1.5 text-xs min-w-[110px]' : 'py-2 text-xs sm:text-sm min-w-[130px] sm:min-w-[150px]'}
          `}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
          aria-hidden
        />
      </div>
    </div>
  );
}
