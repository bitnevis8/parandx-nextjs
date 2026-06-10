'use client';

import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {
  ACTIVITY_TYPE_OPTIONS,
  normalizeActivityTypes,
} from '../../utils/expertProfileUtils';

const ACTIVITY_ICONS = {
  mobile: TruckIcon,
  office: BuildingOffice2Icon,
  online: GlobeAltIcon,
};

/** روش‌های ارائه خدمت — بدون عنوان، چیدمان سمت چپ */
export default function ExpertHeaderActivityTypes({ expert, className = '' }) {
  const types = normalizeActivityTypes(expert?.activityTypes, expert);
  const active = ACTIVITY_TYPE_OPTIONS.filter((opt) => types[opt.key]);

  if (!active.length) return null;

  return (
    <ul
      className={`flex flex-col items-start gap-1.5 ${className}`}
      aria-label="روش‌های ارائه خدمت"
    >
      {active.map((opt) => {
        const Icon = ACTIVITY_ICONS[opt.key];
        return (
          <li key={opt.key}>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 sm:text-xs"
              title={opt.label}
            >
              {Icon ? (
                <Icon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
              ) : null}
              <span className="text-start leading-snug">{opt.label}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
