'use client';

import ExpertHeaderActivityTypes from './ExpertHeaderActivityTypes';
import ExpertHeaderSpecializations from './ExpertHeaderSpecializations';
import {
  normalizeActivityTypes,
  ACTIVITY_TYPE_OPTIONS,
} from '../../utils/expertProfileUtils';

/** ستون چپ: روش ارائه خدمت · باکس تخصص‌ها */
export default function ExpertHeaderProfileMeta({ expert }) {
  const activityTypes = normalizeActivityTypes(expert?.activityTypes, expert);
  const hasActivity = ACTIVITY_TYPE_OPTIONS.some((o) => activityTypes[o.key]);
  const hasCategories = Boolean(expert?.categories?.length);

  if (!hasActivity && !hasCategories) return null;

  return (
    <div className="mt-3 space-y-3 sm:mt-4">
      {hasActivity ? (
        <div className="flex justify-end">
          <ExpertHeaderActivityTypes expert={expert} />
        </div>
      ) : null}

      {hasCategories ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-3.5 sm:py-3">
          <h2 className="mb-2 text-[11px] font-semibold text-slate-500 sm:text-xs">تخصص‌ها</h2>
          <ExpertHeaderSpecializations categories={expert.categories} />
        </section>
      ) : null}
    </div>
  );
}
