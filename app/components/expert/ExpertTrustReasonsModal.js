'use client';

import { useEffect, useState } from 'react';
import Modal from '../ui/Modal/Modal';
import { TRUST_REASON_OPTIONS, normalizeTrustReasonKeys } from '../../utils/expertTrustReasons';

export default function ExpertTrustReasonsModal({
  isOpen,
  onClose,
  initialReasons = [],
  onSave,
  onRemoveTrust,
  saving = false,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelected(normalizeTrustReasonKeys(initialReasons));
    }
  }, [isOpen, initialReasons]);

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = () => {
    onSave?.(normalizeTrustReasonKeys(selected));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="دلیل اعتماد شما چیست؟">
      <p className="mb-4 text-sm text-slate-600">می‌توانید چند مورد انتخاب کنید.</p>
      <ul className="space-y-2.5">
        {TRUST_REASON_OPTIONS.map(({ key, label }) => {
          const checked = selected.includes(key);
          return (
            <li key={key}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  checked
                    ? 'border-amber-300 bg-amber-50/80'
                    : 'border-slate-200 bg-white hover:border-amber-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  checked={checked}
                  onChange={() => toggle(key)}
                />
                <span className="text-sm font-medium text-slate-800">{label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-500 px-5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          بستن
        </button>
      </div>
      {onRemoveTrust ? (
        <button
          type="button"
          onClick={onRemoveTrust}
          disabled={saving}
          className="mt-4 w-full text-center text-xs text-slate-400 transition hover:text-red-600"
        >
          حذف از لیست اعتماد
        </button>
      ) : null}
    </Modal>
  );
}
