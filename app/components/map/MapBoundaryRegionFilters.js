'use client';

import { useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { getGeometryCentroid, resolveCityBoundaryFeature } from '../../utils/geojsonBoundary';
import {
  MAP_FILTER_FIELD,
  MAP_FILTER_LABEL,
  MAP_FILTER_SELECT_CLASS,
} from '../home/mapFilterTheme';

function BoundarySelect({
  label,
  value,
  onChange,
  options,
  disabled,
  size = 'md',
  showLabel = false,
  mapToolbar = false,
}) {
  const sizeClass = mapToolbar
    ? MAP_FILTER_SELECT_CLASS
    : size === 'lg'
      ? 'min-h-[2.75rem] py-2.5 pl-3 pr-10 text-sm'
      : 'min-h-[2.75rem] px-3 py-2 text-xs sm:text-sm pr-9';

  const fieldClass = mapToolbar
    ? `${MAP_FILTER_FIELD} cursor-pointer appearance-none ${sizeClass}`
    : `w-full appearance-none rounded-xl border border-gray-200 bg-white/95 text-gray-800 shadow-sm backdrop-blur-sm hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 ${sizeClass}`;

  return (
    <label className={`block min-w-0 ${mapToolbar ? 'w-full' : ''}`}>
      <span className={showLabel ? MAP_FILTER_LABEL : 'sr-only'}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={fieldClass}
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
      </div>
    </label>
  );
}

export function resolveRegionSearchBoundary(data, sectionId, neighborhoodId) {
  if (!data) return null;

  if (neighborhoodId || sectionId) {
    const active = data.getActiveFeature?.(sectionId, neighborhoodId);
    if (active?.geometry) return active.geometry;
  }

  const cityFeature = resolveCityBoundaryFeature(data);
  return cityFeature?.geometry ?? null;
}

export function resolveRegionSearchCenter(boundaryGeometry, fallbackLat, fallbackLng) {
  const centroid = getGeometryCentroid(boundaryGeometry);
  if (centroid) {
    return { lat: centroid[1], lng: centroid[0] };
  }

  return {
    lat: Number.isFinite(fallbackLat) ? fallbackLat : null,
    lng: Number.isFinite(fallbackLng) ? fallbackLng : null,
  };
}

export default function MapBoundaryRegionFilters({
  data,
  cityName = 'شهر',
  sectionId = '',
  neighborhoodId = '',
  onSectionChange,
  onNeighborhoodChange,
  size = 'md',
  mapToolbar = true,
  layout = 'grid',
  className = '',
}) {
  const neighborhoodOptions = useMemo(() => {
    if (!sectionId || !data?.sections?.length) return [];
    const section = data.sections.find((item) => item.featureId === sectionId);
    return section?.neighborhoods || [];
  }, [data?.sections, sectionId]);

  if (!data?.sections?.length) return null;

  const layoutClass =
    layout === 'row'
      ? 'flex min-w-0 flex-1 gap-1.5 sm:gap-2'
      : 'grid grid-cols-1 gap-2 sm:grid-cols-2';
  const fieldWrapClass = layout === 'row' ? 'min-w-0 flex-1' : '';

  return (
    <div className={`${layoutClass} ${className}`.trim()}>
      <div className={fieldWrapClass}>
        <BoundarySelect
          label="بخش"
          size={size}
          mapToolbar={mapToolbar}
          value={sectionId}
          onChange={onSectionChange}
          options={[
            { value: '', label: `کل ${cityName}` },
            ...data.sections.map((section) => ({ value: section.featureId, label: section.name })),
          ]}
        />
      </div>
      <div className={fieldWrapClass}>
        <BoundarySelect
          label="محله"
          size={size}
          mapToolbar={mapToolbar}
          value={neighborhoodId}
          onChange={onNeighborhoodChange}
          disabled={!sectionId}
          options={[
            { value: '', label: sectionId ? 'همه محله‌ها' : 'محله' },
            ...neighborhoodOptions.map((item) => ({ value: item.featureId, label: item.name })),
          ]}
        />
      </div>
    </div>
  );
}
