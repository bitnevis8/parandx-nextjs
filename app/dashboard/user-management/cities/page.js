'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../config/api';
import { clearCityBoundaryCache } from '../../../utils/loadCityBoundary';
import { getCityMapFormDefaults } from '../../../utils/cityMapConfig';
import { readTriStateBool } from '../../../utils/mapBuildingExtrusion';
import CityMapSettingsFields from './CityMapSettingsFields';

const fetchOpts = { credentials: 'include' };

function parseOptionalMapZoom(value) {
  if (value === '' || value == null) return 13;
  const n = Number(value);
  if (!Number.isFinite(n)) return 13;
  return Math.min(20, Math.max(4, n));
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {active ? 'فعال' : 'غیرفعال'}
    </span>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LocationsManagementContent() {
  const [tab, setTab] = useState('cities');
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [modal, setModal] = useState(null);
  const [geoJsonFile, setGeoJsonFile] = useState(null);
  const [geoJsonUploading, setGeoJsonUploading] = useState(false);
  const [geoJsonMessage, setGeoJsonMessage] = useState(null);

  const provinceOptions = useMemo(
    () => provinces.map((p) => ({ value: String(p.id), label: p.name })),
    [provinces]
  );

  const loadProvinces = useCallback(async () => {
    const res = await fetch(
      API_ENDPOINTS.cities.admin.searchProvinces({ limit: 100 }),
      fetchOpts
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'خطا در دریافت استان‌ها');
    setProvinces(data.data);
    return data.data;
  }, []);

  const loadCities = useCallback(async (page = 1) => {
    const params = { page, limit: 30 };
    if (search.trim()) params.q = search.trim();
    if (activeFilter !== 'all') params.active = activeFilter;
    if (provinceFilter) params.provinceId = provinceFilter;

    const res = await fetch(API_ENDPOINTS.cities.admin.searchCities(params), fetchOpts);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'خطا در دریافت شهرها');
    setCities(data.data);
    setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
  }, [search, activeFilter, provinceFilter]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loadProvinces();
      if (tab === 'cities') await loadCities(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadProvinces, loadCities, tab]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (tab === 'cities') {
      loadCities(1).catch((err) => setError(err.message));
    }
  }, [tab, loadCities]);

  const handleToggleCity = async (city) => {
    try {
      const res = await fetch(API_ENDPOINTS.cities.admin.toggleCityActive(city.id), {
        ...fetchOpts,
        method: 'PATCH',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'خطا در تغییر وضعیت شهر');
      await loadCities(pagination.page);
    } catch (err) {
      alert(err.message || 'خطا در ارتباط با سرور');
    }
  };

  const handleUploadGeoJson = async (cityId) => {
    if (!geoJsonFile) {
      setGeoJsonMessage({ type: 'error', text: 'ابتدا یک فایل .geojson یا .json انتخاب کنید.' });
      return;
    }

    setGeoJsonUploading(true);
    setGeoJsonMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', geoJsonFile, geoJsonFile.name);

      const res = await fetch(API_ENDPOINTS.cities.admin.uploadCityGeoJson(cityId), {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`پاسخ نامعتبر از سرور (کد ${res.status})`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || `خطا در آپلود (کد ${res.status})`);
      }

      setGeoJsonFile(null);
      clearCityBoundaryCache(data.data?.slug || modal?.item?.slug);
      setGeoJsonMessage({ type: 'success', text: data.message || 'GeoJSON با موفقیت ذخیره شد.' });

      await loadCities(pagination.page);
      if (modal?.item?.id === cityId && data.data) {
        setModal((prev) => ({
          ...prev,
          item: { ...prev.item, ...data.data },
          form: {
            ...prev.form,
            hasBoundaryMap: true,
            geoJsonPath: data.data.geoJsonPath || prev.form.geoJsonPath,
          },
        }));
      }
    } catch (err) {
      setGeoJsonMessage({ type: 'error', text: err.message || 'خطا در آپلود' });
    } finally {
      setGeoJsonUploading(false);
    }
  };

  const handleDeleteGeoJson = async (city) => {
    if (!confirm(`فایل GeoJSON شهر «${city.name}» حذف شود؟`)) return;

    try {
      const res = await fetch(API_ENDPOINTS.cities.admin.deleteCityGeoJson(city.id), {
        ...fetchOpts,
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'خطا در حذف GeoJSON');
      clearCityBoundaryCache(city.slug);
      await loadCities(pagination.page);
    } catch (err) {
      alert(err.message || 'خطا در حذف');
    }
  };

  const handleToggleProvince = async (province) => {
    try {
      const res = await fetch(API_ENDPOINTS.cities.admin.toggleProvinceActive(province.id), {
        ...fetchOpts,
        method: 'PATCH',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadProvinces();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCity = async (city) => {
    if (!confirm(`حذف شهر «${city.name}»؟`)) return;
    try {
      const res = await fetch(API_ENDPOINTS.cities.admin.deleteCity(city.id), {
        ...fetchOpts,
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadCities(pagination.page);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProvince = async (province) => {
    if (!confirm(`حذف استان «${province.name}»؟`)) return;
    try {
      const res = await fetch(API_ENDPOINTS.cities.admin.deleteProvince(province.id), {
        ...fetchOpts,
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await loadProvinces();
    } catch (err) {
      alert(err.message);
    }
  };

  const openCityModal = (city = null) => {
    setGeoJsonFile(null);
    setGeoJsonMessage(null);
    setModal({
      type: 'city',
      item: city,
      form: city
        ? (() => {
            const mapDefaults = getCityMapFormDefaults(city);
            return {
            id: city.id,
            name: city.name,
            slug: city.slug,
            provinceId: city.provinceId,
            isActive: city.isActive,
            order: city.order || 0,
            latitude: mapDefaults?.latitude ?? city.latitude ?? '',
            longitude: mapDefaults?.longitude ?? city.longitude ?? '',
            mapZoom: mapDefaults?.mapZoom ?? city.mapZoom ?? 13,
            mapZoomMobile: mapDefaults?.mapZoomMobile ?? city.mapZoomMobile ?? '',
            defaultSectionId: city.defaultSectionId || '',
            defaultNeighborhoodId: city.defaultNeighborhoodId || '',
            mapShow3D: mapDefaults?.mapShow3D ?? readTriStateBool(city.mapShow3D, true),
            mapPitch: mapDefaults?.mapPitch ?? city.mapPitch ?? 60,
            mapBearing: mapDefaults?.mapBearing ?? city.mapBearing ?? 0,
            mapUseConfiguredView: mapDefaults?.mapUseConfiguredView ?? Boolean(city.mapUseConfiguredView),
            mapBuildingUseMapDefault: readTriStateBool(city.mapBuildingUseMapDefault, true),
            mapBuildingDefaultHeight: city.mapBuildingDefaultHeight ?? 12,
            mapMaxBoundsPaddingKm: city.mapMaxBoundsPaddingKm ?? 0,
            mapExpertMarkerStyle: city.mapExpertMarkerStyle || 'pin',
            hasBoundaryMap: city.hasBoundaryMap,
            geoJsonPath: city.geoJsonPath || `city/geojson/${city.slug}.geojson`,
          };
          })()
        : {
            id: '',
            name: '',
            slug: '',
            provinceId: provinceFilter || '',
            isActive: false,
            order: 0,
            latitude: '',
            longitude: '',
            mapZoom: 13,
            mapZoomMobile: '',
            defaultSectionId: '',
            defaultNeighborhoodId: '',
            mapShow3D: true,
            mapPitch: 60,
            mapBearing: 0,
            mapUseConfiguredView: false,
            mapBuildingUseMapDefault: true,
            mapBuildingDefaultHeight: 12,
            mapMaxBoundsPaddingKm: 0,
            mapExpertMarkerStyle: 'pin',
            hasBoundaryMap: false,
            geoJsonPath: '',
          },
    });
  };

  const openProvinceModal = (province = null) => {
    setModal({
      type: 'province',
      item: province,
      form: province
        ? { id: province.id, name: province.name, isActive: province.isActive }
        : { id: '', name: '', isActive: true },
    });
  };

  const saveModal = async (e) => {
    e.preventDefault();
    const { type, item, form } = modal;

    try {
      let url;
      let method;
      let body;

      if (type === 'city') {
        body = {
          ...form,
          id: parseInt(form.id, 10),
          provinceId: parseInt(form.provinceId, 10),
          order: parseInt(form.order, 10) || 0,
          mapZoom: parseOptionalMapZoom(form.mapZoom),
          mapZoomMobile:
            form.mapZoomMobile !== '' && form.mapZoomMobile != null
              ? parseOptionalMapZoom(form.mapZoomMobile)
              : null,
          latitude: form.latitude !== '' ? form.latitude : null,
          longitude: form.longitude !== '' ? form.longitude : null,
          defaultSectionId: form.defaultSectionId || null,
          defaultNeighborhoodId: form.defaultNeighborhoodId || null,
          mapShow3D: readTriStateBool(form.mapShow3D, true),
          mapPitch: form.mapPitch !== '' && form.mapPitch != null ? Number(form.mapPitch) : null,
          mapBearing: form.mapBearing !== '' && form.mapBearing != null ? Number(form.mapBearing) : null,
          mapUseConfiguredView: Boolean(form.mapUseConfiguredView),
          mapBuildingUseMapDefault: readTriStateBool(form.mapBuildingUseMapDefault, true),
          mapBuildingDefaultHeight:
            form.mapBuildingDefaultHeight !== '' && form.mapBuildingDefaultHeight != null
              ? parseInt(form.mapBuildingDefaultHeight, 10) || 12
              : 12,
          mapMaxBoundsPaddingKm:
            form.mapMaxBoundsPaddingKm !== '' && form.mapMaxBoundsPaddingKm != null
              ? Math.min(50, Math.max(0, parseInt(form.mapMaxBoundsPaddingKm, 10) || 0))
              : 0,
          mapExpertMarkerStyle: form.mapExpertMarkerStyle || 'pin',
          isActive: Boolean(form.isActive),
        };
        delete body.hasBoundaryMap;
        delete body.geoJsonPath;

        if (item) {
          url = API_ENDPOINTS.cities.admin.updateCity(item.id);
          method = 'PUT';
          delete body.id;
        } else {
          url = API_ENDPOINTS.cities.admin.createCity;
          method = 'POST';
        }
      } else {
        body = {
          id: parseInt(form.id, 10),
          name: form.name,
          isActive: Boolean(form.isActive),
        };

        if (item) {
          url = API_ENDPOINTS.cities.admin.updateProvince(item.id);
          method = 'PUT';
          delete body.id;
        } else {
          url = API_ENDPOINTS.cities.admin.createProvince;
          method = 'POST';
        }
      }

      const res = await fetch(url, {
        ...fetchOpts,
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setModal(null);
      await loadProvinces();
      if (type === 'city') await loadCities(pagination.page);
      else await loadProvinces();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateForm = (field, value) => {
    setModal((prev) => ({ ...prev, form: { ...prev.form, [field]: value } }));
  };

  const updateFormFields = (patch) => {
    setModal((prev) => ({ ...prev, form: { ...prev.form, ...patch } }));
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-3 sm:p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          مدیریت استان‌ها و شهرها
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          فقط شهرهای فعال در انتخاب شهر کاربر نمایش داده می‌شوند.
        </p>

        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {[
            { id: 'cities', label: 'شهرها' },
            { id: 'provinces', label: 'استان‌ها' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                tab === id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {tab === 'cities' && (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی شهر..."
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">همه استان‌ها</option>
                  {provinceOptions.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="true">فقط فعال</option>
                  <option value="false">فقط غیرفعال</option>
                </select>
                <button
                  type="button"
                  onClick={() => loadCities(1)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
                >
                  اعمال فیلتر
                </button>
              </div>
              <button
                type="button"
                onClick={() => openCityModal()}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                افزودن شهر
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">شناسه</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">نام</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">استان</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">slug</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">GeoJSON</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">وضعیت</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">در حال بارگذاری...</td></tr>
                  ) : cities.length === 0 ? (
                    <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">شهری یافت نشد</td></tr>
                  ) : (
                    cities.map((city) => (
                      <tr key={city.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{city.id}</td>
                        <td className="px-4 py-3 font-medium">{city.name}</td>
                        <td className="px-4 py-3">{city.province}</td>
                        <td className="px-4 py-3 font-mono text-xs">{city.slug}</td>
                        <td className="px-4 py-3">
                          {city.hasBoundaryMap ? (
                            <span className="text-xs text-green-700">دارد</span>
                          ) : (
                            <span className="text-xs text-gray-400">ندارد</span>
                          )}
                        </td>
                        <td className="px-4 py-3"><StatusBadge active={city.isActive} /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleCity(city)}
                              className="rounded-md bg-amber-100 px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-200"
                            >
                              {city.isActive ? 'غیرفعال' : 'فعال'}
                            </button>
                            <button
                              type="button"
                              onClick={() => openCityModal(city)}
                              className="rounded-md bg-blue-100 px-2.5 py-1 text-xs text-blue-800 hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCity(city)}
                              className="rounded-md bg-red-100 px-2.5 py-1 text-xs text-red-800 hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => loadCities(pagination.page - 1)}
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  قبلی
                </button>
                <span className="text-sm text-gray-600">
                  صفحه {pagination.page} از {pagination.pages} ({pagination.total} شهر)
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadCities(pagination.page + 1)}
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'provinces' && (
          <>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => openProvinceModal()}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                افزودن استان
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">شناسه</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">نام</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">وضعیت</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">در حال بارگذاری...</td></tr>
                  ) : provinces.length === 0 ? (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">استانی یافت نشد</td></tr>
                  ) : (
                    provinces.map((province) => (
                      <tr key={province.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{province.id}</td>
                        <td className="px-4 py-3 font-medium">{province.name}</td>
                        <td className="px-4 py-3"><StatusBadge active={province.isActive} /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleProvince(province)}
                              className="rounded-md bg-amber-100 px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-200"
                            >
                              {province.isActive ? 'غیرفعال' : 'فعال'}
                            </button>
                            <button
                              type="button"
                              onClick={() => openProvinceModal(province)}
                              className="rounded-md bg-blue-100 px-2.5 py-1 text-xs text-blue-800 hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProvince(province)}
                              className="rounded-md bg-red-100 px-2.5 py-1 text-xs text-red-800 hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Modal
        open={Boolean(modal)}
        title={
          modal?.type === 'city'
            ? modal.item ? 'ویرایش شهر' : 'افزودن شهر'
            : modal?.item ? 'ویرایش استان' : 'افزودن استان'
        }
        onClose={() => setModal(null)}
      >
        {modal && (
          <form onSubmit={saveModal} className="space-y-4">
            {modal.type === 'province' ? (
              <>
                {!modal.item && (
                  <label className="block">
                    <span className="mb-1 block text-sm text-gray-600">شناسه</span>
                    <input
                      required
                      type="number"
                      value={modal.form.id}
                      onChange={(e) => updateForm('id', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </label>
                )}
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-600">نام استان</span>
                  <input
                    required
                    value={modal.form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={modal.form.isActive}
                    onChange={(e) => updateForm('isActive', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">فعال</span>
                </label>
              </>
            ) : (
              <>
                {!modal.item && (
                  <label className="block">
                    <span className="mb-1 block text-sm text-gray-600">شناسه (از shahr.json)</span>
                    <input
                      required
                      type="number"
                      value={modal.form.id}
                      onChange={(e) => updateForm('id', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </label>
                )}
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-600">نام شهر</span>
                  <input
                    required
                    value={modal.form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-600">slug</span>
                  <input
                    required
                    value={modal.form.slug}
                    onChange={(e) => updateForm('slug', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-600">استان</span>
                  <select
                    required
                    value={modal.form.provinceId}
                    onChange={(e) => updateForm('provinceId', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">انتخاب استان</option>
                    {provinceOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </label>
                <CityMapSettingsFields
                  form={modal.form}
                  updateForm={updateForm}
                  updateFormFields={updateFormFields}
                  citySlug={modal.form.slug}
                  hasBoundaryMap={Boolean(modal.form.hasBoundaryMap)}
                />
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-600">ترتیب نمایش</span>
                  <input
                    type="number"
                    value={modal.form.order}
                    onChange={(e) => updateForm('order', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                {modal.item && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">مرزبندی نقشه (GeoJSON)</p>
                      <p className="mt-1 text-xs text-gray-500 font-mono" dir="ltr">
                        api/src/modules/city/geojson/{modal.form.slug || 'slug'}.geojson
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        وضعیت: {modal.form.hasBoundaryMap ? 'فایل موجود است' : 'فایلی ثبت نشده'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".geojson,.json,application/json,application/geo+json"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setGeoJsonFile(file);
                        setGeoJsonMessage(
                          file
                            ? { type: 'info', text: `فایل انتخاب‌شده: ${file.name}` }
                            : null
                        );
                      }}
                      className="block w-full text-xs text-gray-600 file:mr-2 file:rounded file:border-0 file:bg-teal-50 file:px-2 file:py-1 file:text-teal-700"
                    />
                    {geoJsonMessage && (
                      <p
                        className={`text-xs ${
                          geoJsonMessage.type === 'success'
                            ? 'text-green-700'
                            : geoJsonMessage.type === 'error'
                              ? 'text-red-700'
                              : 'text-gray-600'
                        }`}
                      >
                        {geoJsonMessage.text}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={geoJsonUploading}
                        onClick={() => handleUploadGeoJson(modal.item.id)}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                      >
                        {geoJsonUploading ? 'در حال آپلود...' : 'آپلود / جایگزینی'}
                      </button>
                      {modal.form.hasBoundaryMap && (
                        <button
                          type="button"
                          onClick={() => handleDeleteGeoJson(modal.item)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs text-red-700 hover:bg-red-200"
                        >
                          حذف GeoJSON
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={modal.form.isActive}
                    onChange={(e) => updateForm('isActive', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">فعال (نمایش در انتخاب شهر کاربر)</span>
                </label>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                ذخیره
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function LocationsManagementPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']} showUnauthorized>
      <LocationsManagementContent />
    </ProtectedRoute>
  );
}
