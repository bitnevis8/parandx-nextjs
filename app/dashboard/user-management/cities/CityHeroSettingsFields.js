'use client';

import {
  DEFAULT_HERO_CITY_DISPLAY,
  getCityHeroPresetPaths,
} from '../../../utils/cityHeroConfig';

function HeroImageField({ label, hint, value, onChange, presetPath = '' }) {
  const previewSrc = String(value || '').trim() || presetPath;

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {hint ? <span className="block text-xs text-gray-500">{hint}</span> : null}
      <input
        type="text"
        dir="ltr"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={presetPath || '/images/hero/city/...'}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
      />
      {previewSrc ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt=""
            className="mx-auto h-24 w-full max-w-[12rem] rounded-md object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : null}
    </label>
  );
}

function SizeField({ label, hint, value, onChange, min, max, step = 0.05, placeholder = '' }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {hint ? <span className="block text-xs text-gray-500">{hint}</span> : null}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
      />
    </label>
  );
}

/** تنظیمات تصویر هیرو — پس‌زمینه شهر (روز/شب) + اندازه */
export default function CityHeroSettingsFields({ form, updateForm, citySlug }) {
  const preset = getCityHeroPresetPaths(citySlug);

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">تصاویر هیرو (صفحه اصلی)</h3>
        <p className="mt-1 text-xs text-gray-500">
          پس‌زمینه شهر با fit و حاشیه — روز/شب. خالی = پیش‌فرض slug.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <HeroImageField
          label="تصویر روز"
          hint="حالت روشن سایت"
          value={form.heroImageDay}
          onChange={(v) => updateForm('heroImageDay', v)}
          presetPath={preset.heroImageDay}
        />
        <HeroImageField
          label="تصویر شب"
          hint="حالت تاریک (دارک مود)"
          value={form.heroImageNight}
          onChange={(v) => updateForm('heroImageNight', v)}
          presetPath={preset.heroImageNight}
        />
      </div>

      <div className="rounded-lg border border-amber-100 bg-white/70 p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-700">اندازه قاب و تصویر شهر</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SizeField
            label="عرض قاب (rem)"
            hint="حداکثر عرض"
            value={form.heroFrameMaxWidthRem}
            onChange={(v) => updateForm('heroFrameMaxWidthRem', v)}
            min={10}
            max={40}
            step={0.5}
            placeholder="پیش‌فرض نوع"
          />
          <SizeField
            label="نسبت تصویر"
            hint="مثلاً 1.33 = 4:3"
            value={form.heroFrameAspectRatio}
            onChange={(v) => updateForm('heroFrameAspectRatio', v)}
            min={0.75}
            max={2}
            step={0.01}
            placeholder="1.33"
          />
          <SizeField
            label="حاشیه داخلی (rem)"
            hint="فاصله دور عکس شهر"
            value={form.heroCityPaddingRem}
            onChange={(v) => updateForm('heroCityPaddingRem', v)}
            min={0}
            max={3}
            step={0.05}
            placeholder={String(DEFAULT_HERO_CITY_DISPLAY.paddingRem)}
          />
          <SizeField
            label="گردی گوشه (rem)"
            hint="border-radius"
            value={form.heroCityRadiusRem}
            onChange={(v) => updateForm('heroCityRadiusRem', v)}
            min={0}
            max={3}
            step={0.05}
            placeholder={String(DEFAULT_HERO_CITY_DISPLAY.radiusRem)}
          />
        </div>
      </div>
    </div>
  );
}
