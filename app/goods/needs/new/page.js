'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useCity } from '../../../context/CityContext';
import JalaliDateField, { jalaliDateToIso } from '../../../components/ui/JalaliDateField';
import GoodsNeedLocationSection from '../../../components/goods/GoodsNeedLocationSection';
import { GOODS_NEED_FORM } from '../../../copy/goodsPageFa';
import {
  cardClass,
  FormField,
  FormSection,
  textareaClass,
} from '../../../components/ui/dashboard/DashboardUi';

const goodsInputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20';

const goodsPrimaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50';

function GoodsNeedNewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { selectedCity } = useCity();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [deadlineJalali, setDeadlineJalali] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapSelection, setMapSelection] = useState({ sectionId: '', neighborhoodId: '' });
  const [mapPayload, setMapPayload] = useState(null);
  const [pinPosition, setPinPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    addressLine: '',
  });

  useEffect(() => {
    fetch(API_ENDPOINTS.categories.getAll('goods'), { credentials: 'include' })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setCategories(result.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const catSlug = searchParams.get('category');
    if (!catSlug || !categories.length) return;

    for (const cat of categories) {
      if (cat.slug === catSlug) {
        setFormData((prev) => ({ ...prev, categoryId: String(cat.id), subCategoryId: '' }));
        return;
      }
      const sub = cat.subcategories?.find((s) => s.slug === catSlug);
      if (sub) {
        setFormData((prev) => ({
          ...prev,
          categoryId: String(cat.id),
          subCategoryId: String(sub.id),
        }));
        return;
      }
    }
  }, [searchParams, categories]);

  const subCategories = useMemo(() => {
    if (!formData.categoryId) return [];
    const cat = categories.find((c) => String(c.id) === String(formData.categoryId));
    return cat?.subcategories || [];
  }, [categories, formData.categoryId]);

  const buildLocationSummary = () => {
    const parts = [
      formData.addressLine?.trim(),
      showMap ? mapPayload?.displayName || mapPayload?.locationData?.displayName : null,
    ].filter(Boolean);
    return parts.join(' — ') || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      router.push('/auth?redirect=/goods/needs/new');
      return;
    }

    if (!selectedCity?.id) {
      setError('لطفاً از نوار بالای سایت شهر خود را انتخاب کنید.');
      return;
    }

    try {
      setSubmitting(true);

      const locationData =
        showMap || formData.addressLine?.trim()
          ? {
              addressLine: formData.addressLine?.trim() || null,
              cityId: selectedCity.id,
              cityName: selectedCity.name,
              sectionId: showMap ? mapSelection.sectionId || null : null,
              neighborhoodId: showMap ? mapSelection.neighborhoodId || null : null,
              displayName: showMap
                ? mapPayload?.displayName || mapPayload?.locationData?.displayName || null
                : null,
              pin: showMap ? pinPosition : null,
              mapPayload: showMap ? mapPayload || null : null,
            }
          : null;

      const res = await fetch(API_ENDPOINTS.requests.createGoodsNeed, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          marketplaceType: 'goods',
          title: formData.title,
          description: formData.description,
          categoryId: Number(formData.categoryId),
          subCategoryId: formData.subCategoryId ? Number(formData.subCategoryId) : null,
          cityId: selectedCity.id,
          location: buildLocationSummary(),
          locationData,
          deadline: deadlineJalali ? jalaliDateToIso(deadlineJalali) : null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.message || 'خطا در ثبت نیاز کالا');
      }
    } catch (_) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className={`mx-auto max-w-lg ${cardClass} p-8 text-center`}>
          <CheckCircleIcon className="mx-auto h-14 w-14 text-amber-600" />
          <h1 className="mt-4 text-xl font-bold text-gray-800">{GOODS_NEED_FORM.successTitle}</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{GOODS_NEED_FORM.successBody}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/goods#home-path-need" className={goodsPrimaryBtnClass}>
              بازگشت به بازار کالا
            </Link>
            <Link
              href="/goods"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              صفحه اصلی کالا
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="border-b border-gray-200 bg-gradient-to-bl from-amber-50 via-white to-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <Link
            href="/goods"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            <ArrowRightIcon className="h-4 w-4" />
            بازگشت به بازار کالا
          </Link>
          <p className="text-sm font-medium text-amber-800">{GOODS_NEED_FORM.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {GOODS_NEED_FORM.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{GOODS_NEED_FORM.lead}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {!isAuthenticated && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            برای ثبت نیاز کالا باید وارد حساب شوید.{' '}
            <Link href="/auth?redirect=/goods/needs/new" className="font-semibold text-amber-800 underline">
              ورود / ثبت‌نام
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <ShoppingBagIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">{GOODS_NEED_FORM.detailsTitle}</h2>
                <p className="text-xs text-gray-500">{GOODS_NEED_FORM.detailsHint}</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <FormSection gridClass="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="عنوان نیاز" span="full">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    className={goodsInputClass}
                    placeholder={GOODS_NEED_FORM.titlePlaceholder}
                    required
                  />
                </FormField>

                <FormField label="دسته کالا">
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        categoryId: e.target.value,
                        subCategoryId: '',
                      }))
                    }
                    className={goodsInputClass}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.title}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="زیردسته کالا">
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData((p) => ({ ...p, subCategoryId: e.target.value }))}
                    className={goodsInputClass}
                    disabled={!formData.categoryId}
                  >
                    <option value="">انتخاب کنید (اختیاری)</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.icon} {sub.title}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="توضیحات" span="full">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    rows={5}
                    className={textareaClass.replace(
                      'focus:border-teal-500 focus:ring-teal-500/20',
                      'focus:border-amber-500 focus:ring-amber-500/20'
                    )}
                    placeholder={GOODS_NEED_FORM.descriptionPlaceholder}
                    required
                  />
                </FormField>
              </FormSection>
            </div>
          </div>

          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <MapPinIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">{GOODS_NEED_FORM.locationTitle}</h2>
                <p className="text-xs text-gray-500">{GOODS_NEED_FORM.locationHint}</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <GoodsNeedLocationSection
                city={selectedCity}
                showMap={showMap}
                onShowMapChange={setShowMap}
                mapSelection={mapSelection}
                mapPayload={mapPayload}
                pinPosition={pinPosition}
                addressLine={formData.addressLine}
                onMapChange={(selection, payload) => {
                  setMapSelection(selection);
                  setMapPayload(payload);
                }}
                onPinChange={setPinPosition}
                onAddressChange={(value) => setFormData((p) => ({ ...p, addressLine: value }))}
              />
            </div>
          </div>

          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <CalendarDaysIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">{GOODS_NEED_FORM.scheduleTitle}</h2>
                <p className="text-xs text-gray-500">{GOODS_NEED_FORM.scheduleHint}</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <FormField label="مهلت تحویل (شمسی)" span="full">
                <JalaliDateField
                  value={deadlineJalali}
                  onChange={setDeadlineJalali}
                  placeholder="انتخاب تاریخ — اختیاری"
                />
              </FormField>
            </div>
          </div>

          <div className={`${cardClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
            <p className="text-sm leading-relaxed text-gray-600">{GOODS_NEED_FORM.submitHint}</p>
            <button
              type="submit"
              disabled={submitting}
              className={`${goodsPrimaryBtnClass} w-full gap-2 sm:w-auto sm:min-w-[11rem]`}
            >
              <PaperAirplaneIcon className="h-4 w-4" aria-hidden />
              {submitting ? GOODS_NEED_FORM.submitting : GOODS_NEED_FORM.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GoodsNeedNewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
        </div>
      }
    >
      <GoodsNeedNewForm />
    </Suspense>
  );
}
