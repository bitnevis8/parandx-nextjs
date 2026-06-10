'use client';

import {
  CATEGORY_MAP_MODEL_FIELD_SECTIONS,
  CATEGORY_MAP_MODEL_FIELDS,
} from '../../config/categoryMapModelFieldMeta';
import { MAP_MODEL_COMPRESSION_OPTIONS } from '../../config/categoryMapModelCompression';
import { DEFAULT_CATEGORY_MAP_MODEL_3D } from '../../utils/categoryMapModelUtils';

function FieldHint({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs leading-relaxed text-gray-500">{children}</p>;
}

function SettingField({ fieldKey, field, form, onChange }) {
  if (field.showWhen && !field.showWhen(form)) return null;

  const value = form[fieldKey];

  if (field.type === 'checkbox') {
    return (
      <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-3">
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(fieldKey, e.target.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm font-medium text-gray-800">{field.label}</span>
            <FieldHint>{field.hint}</FieldHint>
          </span>
        </label>
      </div>
    );
  }

  if (field.type === 'text') {
    return (
      <div className={field.colSpan === 2 ? 'sm:col-span-2' : undefined}>
        <label className="mb-1 block text-sm font-medium text-gray-800">{field.label}</label>
        <input
          type="text"
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          dir="ltr"
        />
        <FieldHint>{field.hint}</FieldHint>
      </div>
    );
  }

  if (field.type === 'select') {
    const options =
      field.optionsKey === 'compressionModes' ? MAP_MODEL_COMPRESSION_OPTIONS : field.options || [];

    return (
      <div className={field.colSpan === 2 ? 'sm:col-span-2' : undefined}>
        <label className="mb-1 block text-sm font-medium text-gray-800">{field.label}</label>
        <select
          value={value ?? ''}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldHint>
          {options.find((opt) => opt.id === value)?.hint || field.hint}
        </FieldHint>
      </div>
    );
  }

  return (
    <div className={field.colSpan === 2 ? 'sm:col-span-2' : undefined}>
      <label className="mb-1 block text-sm font-medium text-gray-800">
        {field.label}
        {field.unit ? (
          <span className="mr-1 text-xs font-normal text-gray-400">({field.unit})</span>
        ) : null}
      </label>
      <input
        type="number"
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        value={value ?? ''}
        onChange={(e) => onChange(fieldKey, Number(e.target.value))}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <FieldHint>{field.hint}</FieldHint>
    </div>
  );
}

export default function CategoryMapModelSettingsForm({ form, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...form, [key]: value });
  };

  const fieldsBySection = CATEGORY_MAP_MODEL_FIELD_SECTIONS.map((section) => ({
    ...section,
    fields: Object.entries(CATEGORY_MAP_MODEL_FIELDS).filter(
      ([, meta]) => meta.section === section.id
    ),
  }));

  return (
    <div className="space-y-6">
      {fieldsBySection.map((section) => {
        if (!section.fields.length) return null;

        return (
          <section key={section.id} className="rounded-xl border border-gray-200 p-4">
            <header className="mb-4">
              <h3 className="text-sm font-bold text-gray-900">{section.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{section.description}</p>
            </header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {section.fields.map(([key, meta]) => (
                <SettingField
                  key={key}
                  fieldKey={key}
                  field={meta}
                  form={form}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>
        );
      })}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...DEFAULT_CATEGORY_MAP_MODEL_3D })}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          بازنشانی به پیش‌فرض
        </button>
      </div>
    </div>
  );
}
