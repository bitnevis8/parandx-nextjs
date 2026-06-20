'use client';

import { useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../config/api';
import {
  DEFAULT_NIGHT_SKY_STARS,
  mergeNightSkyConfig,
} from '../../../lib/nightSkyStars';

const fetchOpts = { credentials: 'include' };

function NumberField({ label, hint, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-800 dark:text-sky-100">{label}</span>
      {hint ? <span className="block text-xs text-gray-500 dark:text-sky-400">{hint}</span> : null}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-teal-500/30 focus:border-teal-400 focus:ring-2 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-50"
      />
    </label>
  );
}

function ToggleField({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-sky-800 dark:bg-sky-950/60">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
      />
      <span>
        <span className="block text-sm font-medium text-gray-800 dark:text-sky-100">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-gray-500 dark:text-sky-400">{hint}</span> : null}
      </span>
    </label>
  );
}

function ProfileEditor({ title, description, profile, onChange }) {
  const patch = (key, value) => onChange({ ...profile, [key]: value });

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-sky-800 dark:bg-sky-900 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-sky-50">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-sky-300">{description}</p>
      </div>

      <ToggleField
        label="نمایش ستاره‌ها"
        hint="در حالت شب فعال/غیرفعال"
        checked={profile.enabled}
        onChange={(v) => patch('enabled', v)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="تعداد ستاره"
          hint="۲۰ تا ۴۰۰"
          value={profile.count}
          onChange={(v) => patch('count', v)}
          min={20}
          max={400}
        />
        <NumberField
          label="ارتفاع لایه (vh)"
          hint="درصد ارتفاع viewport — معمولاً ۳۰ تا ۴۰"
          value={profile.heightVh}
          onChange={(v) => patch('heightVh', v)}
          min={15}
          max={65}
        />
        <NumberField
          label="حداقل ارتفاع (px)"
          value={profile.minHeightPx}
          onChange={(v) => patch('minHeightPx', v)}
          min={80}
          max={600}
        />
        <NumberField
          label="حداکثر ارتفاع (px)"
          value={profile.maxHeightPx}
          onChange={(v) => patch('maxHeightPx', v)}
          min={120}
          max={800}
        />
        <NumberField
          label="اندازه کوچک‌ترین ستاره"
          hint="۰٫۲ تا ۳ — واحد SVG"
          value={profile.sizeMin}
          onChange={(v) => patch('sizeMin', v)}
          min={0.2}
          max={2}
          step={0.05}
        />
        <NumberField
          label="اندازه بزرگ‌ترین ستاره"
          value={profile.sizeMax}
          onChange={(v) => patch('sizeMax', v)}
          min={0.3}
          max={3}
          step={0.05}
        />
        <NumberField
          label="حداقل شفافیت"
          hint="۰٫۱ تا ۱"
          value={profile.opacityMin}
          onChange={(v) => patch('opacityMin', v)}
          min={0.1}
          max={1}
          step={0.05}
        />
        <NumberField
          label="حداکثر شفافیت"
          value={profile.opacityMax}
          onChange={(v) => patch('opacityMax', v)}
          min={0.1}
          max={1}
          step={0.05}
        />
        <NumberField
          label="درصد چشمک‌زن"
          hint="۰ = هیچ، ۱۰۰ = همه"
          value={profile.twinklePercent}
          onChange={(v) => patch('twinklePercent', v)}
          min={0}
          max={100}
        />
        <NumberField
          label="سرعت چشمک — حداقل (ثانیه)"
          value={profile.twinkleDurationMin}
          onChange={(v) => patch('twinkleDurationMin', v)}
          min={0.8}
          max={12}
          step={0.1}
        />
        <NumberField
          label="سرعت چشمک — حداکثر (ثانیه)"
          value={profile.twinkleDurationMax}
          onChange={(v) => patch('twinkleDurationMax', v)}
          min={1}
          max={16}
          step={0.1}
        />
        <NumberField
          label="بذر چیدمان (seed)"
          hint="عدد یکسان = چیدمان یکسان"
          value={profile.seed}
          onChange={(v) => patch('seed', v)}
          min={1}
          max={999999}
        />
      </div>
    </section>
  );
}

function NightSkyStarsSettingsContent() {
  const [config, setConfig] = useState(DEFAULT_NIGHT_SKY_STARS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.siteSetting.adminNightSkyStars, fetchOpts);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در دریافت تنظیمات');
      setConfig(mergeNightSkyConfig(json.data));
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.siteSetting.adminNightSkyStars, {
        ...fetchOpts,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در ذخیره');
      setConfig(mergeNightSkyConfig(json.data));
      setMessage('تنظیمات ستاره‌ها ذخیره شد');
    } catch (err) {
      setError(err.message || 'خطا در ذخیره');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <p className="text-sm text-gray-500">در حال بارگذاری…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-sky-50">ستاره‌های آسمان شب</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-sky-300">
          تنظیمات جداگانه برای موبایل (عرض کمتر از ۷۶۸px) و دسکتاپ. بعد از ذخیره، صفحه اصلی را در
          حالت شب رفرش کنید.
        </p>
      </div>

      <ProfileEditor
        title="موبایل"
        description="بالای صفحه در گوشی — هدر و نوار دسته‌های خدمات"
        profile={config.mobile}
        onChange={(mobile) => setConfig((prev) => ({ ...prev, mobile }))}
      />

      <ProfileEditor
        title="دسکتاپ"
        description="بالای صفحه در نمایشگر بزرگ‌تر"
        profile={config.desktop}
        onChange={(desktop) => setConfig((prev) => ({ ...prev, desktop }))}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
        </button>
        {message ? <span className="text-sm text-teal-700 dark:text-teal-300">{message}</span> : null}
        {error ? <span className="text-sm text-red-600 dark:text-red-300">{error}</span> : null}
      </div>
    </div>
  );
}

export default function NightSkyStarsSettingsPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <NightSkyStarsSettingsContent />
    </ProtectedRoute>
  );
}
