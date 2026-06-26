'use client';

import { useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../config/api';
import {
  DEFAULT_HERO_TYPE_OVERLAYS,
  mergeHeroTypeOverlays,
} from '../../../lib/heroTypeOverlays';

const fetchOpts = { credentials: 'include' };

function NumberField({ label, hint, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      {hint ? <span className="block text-[11px] text-gray-500">{hint}</span> : null}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
      />
    </label>
  );
}

function TypeLayerEditor({ title, layer, defaults, onChange }) {
  const preview = String(layer.image || '').trim() || defaults.image;

  const patch = (key, value) => onChange({ ...layer, [key]: value });

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-gray-800">مسیر تصویر لایه</span>
        <input
          type="text"
          dir="ltr"
          value={layer.image}
          onChange={(e) => patch('image', e.target.value)}
          placeholder={defaults.image}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
        />
      </label>

      {preview ? (
        <div className="flex justify-center rounded-xl bg-gray-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="h-24 max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField
          label="عرض لایه (%)"
          hint="نسبت به قاب"
          value={layer.widthPercent}
          onChange={(v) => patch('widthPercent', v)}
          min={40}
          max={100}
        />
        <NumberField
          label="ارتفاع لایه (%)"
          value={layer.heightPercent}
          onChange={(v) => patch('heightPercent', v)}
          min={30}
          max={100}
        />
        <NumberField
          label="عرض قاب پیش‌فرض (rem)"
          hint="اگر شهر مقدار نداشت"
          value={layer.maxWidthRem}
          onChange={(v) => patch('maxWidthRem', v)}
          min={10}
          max={40}
          step={0.5}
        />
        <NumberField
          label="نسبت قاب"
          hint="مثلاً 1.33"
          value={layer.aspectRatio}
          onChange={(v) => patch('aspectRatio', v)}
          min={0.75}
          max={2}
          step={0.01}
        />
      </div>
    </section>
  );
}

function HeroTypeOverlaysContent() {
  const [config, setConfig] = useState(DEFAULT_HERO_TYPE_OVERLAYS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.siteSetting.adminHeroTypeOverlays, fetchOpts);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در بارگذاری');
      setConfig(mergeHeroTypeOverlays(json.data));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(API_ENDPOINTS.siteSetting.adminHeroTypeOverlays, {
        ...fetchOpts,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در ذخیره');
      setConfig(mergeHeroTypeOverlays(json.data));
      setMessage({ type: 'success', text: json.message || 'ذخیره شد' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    setConfig(JSON.parse(JSON.stringify(DEFAULT_HERO_TYPE_OVERLAYS)));
  };

  if (loading) {
    return <p className="text-sm text-gray-500">در حال بارگذاری…</p>;
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لایه‌های هیرو (خدمات / کالا)</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          تصویر متخصص/فروشگاه روی پس‌زمینه شهر — مسیر و اندازه هر لایه جداگانه.
        </p>
      </div>

      <TypeLayerEditor
        title="لایه خدمات (متخصص)"
        layer={config.services}
        defaults={DEFAULT_HERO_TYPE_OVERLAYS.services}
        onChange={(next) => setConfig((prev) => ({ ...prev, services: next }))}
      />

      <TypeLayerEditor
        title="لایه کالا (فروشگاه)"
        layer={config.goods}
        defaults={DEFAULT_HERO_TYPE_OVERLAYS.goods}
        onChange={(next) => setConfig((prev) => ({ ...prev, goods: next }))}
      />

      {message ? (
        <p
          className={`rounded-xl px-4 py-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <button
          type="button"
          onClick={resetDefaults}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          بازگشت به پیش‌فرض
        </button>
      </div>
    </form>
  );
}

export default function HeroTypeOverlaysSettingsPage() {
  return (
    <ProtectedRoute roles={['admin', 'moderator']}>
      <div className="p-6">
        <HeroTypeOverlaysContent />
      </div>
    </ProtectedRoute>
  );
}
