'use client';

import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export function ProfileModeToggle({ mode, onSwitchToView, onSwitchToEdit, className = '' }) {
  const isEdit = mode === 'edit';

  if (isEdit) {
    return (
      <button
        type="button"
        onClick={onSwitchToView}
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 sm:px-4 sm:text-sm ${className}`}
      >
        <EyeIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span>مشاهده</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSwitchToEdit}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-teal-700 sm:px-4 sm:text-sm ${className}`}
    >
      <PencilSquareIcon className="h-4 w-4 shrink-0" aria-hidden />
      <span>ویرایش</span>
    </button>
  );
}

export function ProfileModeToggleRow({ mode, onSwitchToView, onSwitchToEdit, className = '' }) {
  if (!onSwitchToView || !onSwitchToEdit) return null;

  return (
    <div className={`flex justify-end ${className}`}>
      <ProfileModeToggle
        mode={mode}
        onSwitchToView={onSwitchToView}
        onSwitchToEdit={onSwitchToEdit}
      />
    </div>
  );
}
