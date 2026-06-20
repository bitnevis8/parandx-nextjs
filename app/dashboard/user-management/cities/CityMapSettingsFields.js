'use client';

import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '../../../config/api';
import { CITY_MAP_MAX_BOUNDS_PADDING_KM } from '../../../utils/mapLibreBounds';
import { readTriStateBool } from '../../../utils/mapBuildingExtrusion';
import { EXPERT_MARKER_STYLE_OPTIONS } from '../../../utils/mapExpertMarkerConfig';

export default function CityMapSettingsFields({ form, updateForm, updateFormFields, citySlug, hasBoundaryMap }) {
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  useEffect(() => {
    if (!hasBoundaryMap || !citySlug) {
      setSections([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingSections(true);

    fetch(API_ENDPOINTS.cities.getGeoJson(citySlug))
      .then((res) => {
        if (!res.ok) throw new Error('geojson');
        return res.json();
      })
      .then((collection) => {
        if (cancelled) return;
        const processed = processBoundaryCollection(collection, citySlug);
        setSections(processed?.sections || []);
      })
      .catch(() => {
        if (!cancelled) setSections([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSections(false);
      });

    return () => {
      cancelled = true;
    };
  }, [citySlug, hasBoundaryMap]);

  const neighborhoodOptions = useMemo(() => {
    if (!form.defaultSectionId) return [];
    const section = sections.find((s) => s.featureId === form.defaultSectionId);
    return section?.neighborhoods || [];
  }, [sections, form.defaultSectionId]);

  const show3D = readTriStateBool(form.mapShow3D, true);
  const useMapDefaultBuildings = readTriStateBool(form.mapBuildingUseMapDefault, true);

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">تنظیمات نقشه (MapLibre / بدون نشان)</h3>
        <p className="mt-1 text-xs text-gray-500">
          مرکز، زوم، زاویه و نمای ۳D برای نقشهٔ شهر در صفحهٔ اصلی (موبایل و دسکتاپ) و فرم‌ها — وقتی از نشان
          استفاده نمی‌شود. با فعال‌کردن «نمای سفارشی» و ذخیره، همین مقادیر جایگزین پیش‌فرض کد می‌شوند.
        </p>
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={Boolean(form.mapUseConfiguredView)}
          onChange={(e) => updateForm('mapUseConfiguredView', e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm text-gray-700">
          استفاده از نمای سفارشی (مرکز/زوم/زاویهٔ زیر) به‌جای fit خودکار روی کل مرز شهر
        </span>
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-xs text-gray-600">عرض جغرافیایی (مرکز)</span>
          <input
            type="text"
            value={form.latitude}
            onChange={(e) => updateForm('latitude', e.target.value)}
            placeholder="31.3183"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            dir="ltr"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-gray-600">طول جغرافیایی (مرکز)</span>
          <input
            type="text"
            value={form.longitude}
            onChange={(e) => updateForm('longitude', e.target.value)}
            placeholder="48.6842"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            dir="ltr"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-gray-600">زوم پیش‌فرض (دسکتاپ)</span>
          <input
            type="number"
            min={4}
            max={20}
            step={0.1}
            value={form.mapZoom}
            onChange={(e) => updateForm('mapZoom', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-gray-600">زوم پیش‌فرض (موبایل)</span>
          <input
            type="number"
            min={4}
            max={20}
            step={0.1}
            value={form.mapZoomMobile ?? ''}
            onChange={(e) => updateForm('mapZoomMobile', e.target.value)}
            placeholder="مثل دسکتاپ"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[11px] text-gray-500">
            خالی = همان زوم دسکتاپ
          </span>
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={show3D}
          onChange={(e) => updateForm('mapShow3D', e.target.checked)}
        />
        <span className="text-sm text-gray-700">نمایش پیش‌فرض سه‌بعدی (۳D)</span>
      </label>

      <label className="block max-w-md">
        <span className="mb-1 block text-xs text-gray-600">نمایش متخصص روی نقشه</span>
        <select
          value={form.mapExpertMarkerStyle || 'pin'}
          onChange={(e) => updateForm('mapExpertMarkerStyle', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {EXPERT_MARKER_STYLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-[11px] text-gray-500">
          مارکر معمولی، عکس پروفایل، یا آیکون دسته/زیردسته — با کلیک، لینک پروفایل نمایش داده می‌شود
        </span>
      </label>

      {show3D ? (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-gray-600">زاویه pitch (۰–۸۵)</span>
            <input
              type="number"
              min={0}
              max={85}
              value={form.mapPitch ?? 60}
              onChange={(e) => updateForm('mapPitch', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-600">چرخش bearing (درجه)</span>
            <input
              type="number"
              min={-180}
              max={180}
              value={form.mapBearing ?? 0}
              onChange={(e) => updateForm('mapBearing', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      ) : null}

      {hasBoundaryMap ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2 max-w-xs">
            <span className="mb-1 block text-xs text-gray-600">
              حاشیهٔ مجاز بیرون مرز شهر (کیلومتر)
            </span>
            <input
              type="number"
              min={0}
              max={50}
              value={form.mapMaxBoundsPaddingKm ?? CITY_MAP_MAX_BOUNDS_PADDING_KM}
              onChange={(e) => updateForm('mapMaxBoundsPaddingKm', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <span className="mt-1 block text-[11px] text-gray-500">
              محدودیت pan/zoom نقشه — پیش‌فرض {CITY_MAP_MAX_BOUNDS_PADDING_KM} (بدون محدودیت)؛
              عدد بیشتر یعنی حاشیهٔ مجاز بیرون مرز به کیلومتر
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-600">بخش پیش‌فرض</span>
            <select
              value={form.defaultSectionId || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (updateFormFields) {
                  updateFormFields({ defaultSectionId: value, defaultNeighborhoodId: '' });
                } else {
                  updateForm('defaultSectionId', value);
                  updateForm('defaultNeighborhoodId', '');
                }
              }}
              disabled={loadingSections}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">کل شهر</option>
              {sections.map((section) => (
                <option key={section.featureId} value={section.featureId}>
                  {section.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-600">محله پیش‌فرض</span>
            <select
              value={form.defaultNeighborhoodId || ''}
              onChange={(e) => updateForm('defaultNeighborhoodId', e.target.value)}
              disabled={!form.defaultSectionId || !neighborhoodOptions.length}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">
                {!form.defaultSectionId
                  ? 'ابتدا بخش را انتخاب کنید'
                  : neighborhoodOptions.length
                    ? 'همه محله‌ها'
                    : 'محله‌ای ثبت نشده'}
              </option>
              {neighborhoodOptions.map((n) => (
                <option key={n.featureId} value={n.featureId}>
                  {n.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <p className="text-xs text-amber-700">
          برای انتخاب بخش/محله پیش‌فرض، ابتدا GeoJSON شهر را آپلود کنید.
        </p>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-800">ساختمان‌های ۳D</p>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={useMapDefaultBuildings}
            onChange={(e) => updateForm('mapBuildingUseMapDefault', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            استفاده از ارتفاع پیش‌فرض نقشه (مثل پرند — بدون تنظیم دستی)
          </span>
        </label>

        {!useMapDefaultBuildings ? (
          <label className="block max-w-xs">
            <span className="mb-1 block text-xs text-gray-600">
              ارتفاع پیش‌فرض ساختمان‌ها بدون دادهٔ OSM (متر)
            </span>
            <input
              type="number"
              min={3}
              max={80}
              value={form.mapBuildingDefaultHeight ?? 12}
              onChange={(e) => updateForm('mapBuildingDefaultHeight', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <span className="mt-1 block text-[11px] text-gray-500">
              برای شهرهایی مثل اهواز که بسیاری از ساختمان‌ها ارتفاع ندارند — مثلاً ۱۲ یا ۱۵
            </span>
          </label>
        ) : null}
      </div>
    </div>
  );
}
