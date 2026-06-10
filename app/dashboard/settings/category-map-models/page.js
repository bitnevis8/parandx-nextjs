'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../config/api';
import {
  DEFAULT_CATEGORY_MAP_MODEL_3D,
  isMapModelUploadFile,
  normalizeCategoryMapModel3d,
} from '../../../utils/categoryMapModelUtils';
import { MAP_MODEL_COMPRESSION_OPTIONS } from '../../../config/categoryMapModelCompression';

const ModelPreview = dynamic(
  () => import('../../../components/admin/CategoryMapModelPreview'),
  { ssr: false }
);
const SettingsForm = dynamic(
  () => import('../../../components/admin/CategoryMapModelSettingsForm'),
  { ssr: false }
);

const fetchOpts = { credentials: 'include' };

function CategoryMapModelsContent() {
  const [tree, setTree] = useState([]);
  const [flat, setFlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marketplaceType, setMarketplaceType] = useState('goods');
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ ...DEFAULT_CATEGORY_MAP_MODEL_3D });
  const [selectedRow, setSelectedRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.categories.adminMapModels(marketplaceType), fetchOpts);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در دریافت دسته‌ها');
      setTree(Array.isArray(json.data?.tree) ? json.data.tree : []);
      setFlat(Array.isArray(json.data?.flat) ? json.data.flat : []);
    } catch (err) {
      setError(err.message || 'خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  }, [marketplaceType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectCategory = useCallback((row) => {
    setSelectedId(row.id);
    setSelectedRow(row);
    setForm(normalizeCategoryMapModel3d(row.mapModel3d));
    setMessage('');
  }, []);

  useEffect(() => {
    if (!selectedId && flat.length) {
      selectCategory(flat[0]);
    }
  }, [flat, selectedId, selectCategory]);

  const previewUrl = selectedRow?.hasFile
    ? selectedRow.modelUrl || selectedRow.glbUrl
    : null;

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(API_ENDPOINTS.categories.updateMapModel(selectedId), {
        ...fetchOpts,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapModel3d: form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در ذخیره');
      setMessage('تنظیمات ذخیره شد');
      await loadData();
      if (json.data) {
        setSelectedRow(json.data);
        setForm(normalizeCategoryMapModel3d(json.data.mapModel3d));
      }
    } catch (err) {
      setMessage(err.message || 'خطا در ذخیره');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !selectedId || !selectedRow) return;

    if (!isMapModelUploadFile(file)) {
      setMessage('فقط فایل GLB یا glTF (.glb / .gltf) مجاز است');
      return;
    }

    setUploading(true);
    setMessage('');
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('uploadCompressEnabled', form.uploadCompressEnabled ? '1' : '0');
      body.append('uploadCompressMode', form.uploadCompressMode || 'meshopt-medium');
      const res = await fetch(API_ENDPOINTS.categories.uploadMapModel(selectedId), {
        ...fetchOpts,
        method: 'POST',
        body,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در آپلود');
      setMessage(json.message || 'فایل آپلود شد');
      await loadData();
      if (json.data) {
        setSelectedRow(json.data);
      }
    } catch (err) {
      setMessage(err.message || 'خطا در آپلود');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedId || !selectedRow?.hasFile) return;
    if (!window.confirm(`فایل ${selectedRow.modelFileName || selectedRow.glbFileName || selectedRow.slug} حذف شود؟`)) return;

    setUploading(true);
    setMessage('');
    try {
      const res = await fetch(API_ENDPOINTS.categories.deleteMapModelFile(selectedId), {
        ...fetchOpts,
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در حذف');
      setMessage('فایل حذف شد');
      await loadData();
      if (json.data) setSelectedRow(json.data);
    } catch (err) {
      setMessage(err.message || 'خطا در حذف');
    } finally {
      setUploading(false);
    }
  };

  const listItems = useMemo(() => {
    const items = [];
    tree.forEach((main) => {
      items.push({ type: 'main', row: main });
      (main.subcategories || []).forEach((sub) => {
        items.push({ type: 'sub', row: sub, parentTitle: main.title });
      });
    });
    return items;
  }, [tree]);

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">مدل‌های ۳D نقشه</h1>
        <p className="mt-1 text-sm text-gray-600">
          برای هر دسته یا زیردسته فایل <strong>GLB</strong> یا <strong>glTF</strong> آپلود کنید.
          فشرده‌سازی اختیاری است — نوع آن را در بخش «فشرده‌سازی آپلود» انتخاب کنید.
          فایل در <code className="rounded bg-gray-100 px-1">public/3D Icons</code> ذخیره می‌شود.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={marketplaceType}
          onChange={(e) => {
            setMarketplaceType(e.target.value);
            setSelectedId(null);
            setSelectedRow(null);
          }}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="goods">بازار کالا</option>
          <option value="services">بازار خدمات</option>
        </select>
        <button
          type="button"
          onClick={loadData}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
        >
          بروزرسانی لیست
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <aside className="rounded-xl border border-gray-200 bg-white p-3">
            <h2 className="mb-3 text-sm font-bold text-gray-800">دسته‌ها</h2>
            <div className="max-h-[32rem] space-y-1 overflow-y-auto">
              {listItems.map(({ type, row, parentTitle }) => {
                const active = row.id === selectedId;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => selectCategory(row)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-right text-sm transition ${
                      active ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="min-w-0 truncate">
                      {type === 'sub' ? (
                        <span className="text-gray-500">{parentTitle} / </span>
                      ) : null}
                      {row.title}
                    </span>
                    <span
                      className={`mr-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        row.hasFile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {row.hasFile ? 'دارد' : 'ندارد'}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            {!selectedRow ? (
              <p className="text-sm text-gray-500">یک دسته را انتخاب کنید.</p>
            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedRow.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    slug: <code className="rounded bg-gray-100 px-1">{selectedRow.slug}</code>
                  </p>
                  <p className="mt-1 text-sm">
                    وضعیت فایل:{' '}
                    <strong className={selectedRow.hasFile ? 'text-green-700' : 'text-amber-700'}>
                      {selectedRow.hasFile
                        ? `${selectedRow.modelFileName || selectedRow.glbFileName || `${selectedRow.slug}.glb`}`
                        : 'فایل مدل وجود ندارد'}
                    </strong>
                  </p>
                </div>

                <SettingsForm form={form} onChange={setForm} />

                <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-3">
                  <p className="text-sm text-amber-950">
                    {form.uploadCompressEnabled ? (
                      <>
                        فشرده‌سازی آپلود:{' '}
                        <strong>
                          {
                            MAP_MODEL_COMPRESSION_OPTIONS.find(
                              (o) => o.id === form.uploadCompressMode
                            )?.label
                          }
                        </strong>
                      </>
                    ) : (
                      <>آپلود بدون فشرده‌سازی — فایل خام ذخیره می‌شود.</>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-amber-800/80">
                    برای ذخیرهٔ پیش‌فرض این دسته، «ذخیره تنظیمات» را بزنید.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700">
                    {uploading ? 'در حال آپلود...' : 'آپلود GLB / glTF'}
                    <input
                      type="file"
                      accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                      className="hidden"
                      disabled={uploading}
                      onChange={handleUpload}
                    />
                  </label>
                  {selectedRow.hasFile ? (
                    <button
                      type="button"
                      onClick={handleDeleteFile}
                      disabled={uploading}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      حذف فایل
                    </button>
                  ) : null}
                </div>

                {previewUrl ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ModelPreview url={previewUrl} config={form} mode="2d" />
                    <ModelPreview url={previewUrl} config={form} mode="3d" />
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    برای دیدن پیش‌نمایش، ابتدا فایل GLB یا glTF را آپلود کنید.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
                  >
                    {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                  </button>
                  {message ? <span className="text-sm text-gray-600">{message}</span> : null}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default function CategoryMapModelsPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <CategoryMapModelsContent />
    </ProtectedRoute>
  );
}
