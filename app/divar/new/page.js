'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { MARKETPLACE } from '../../config/marketplaceConfig';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { DIVAR_LISTING_FORM } from '../../copy/divarPageFa';
import {
  cardClass,
  FormField,
  FormSection,
  textareaClass,
} from '../../components/ui/dashboard/DashboardUi';

const divarInputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20';

const divarPrimaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50';

function DivarListingNewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { selectedCity } = useCity();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    categoryId: '',
    subCategoryId: '',
    title: '',
    description: '',
    fixedPrice: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetch(
      API_ENDPOINTS.categories.getAll('goods', MARKETPLACE.divar.listingCategoryUsage),
      { credentials: 'include' }
    )
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      const q = formData.subCategoryId
        ? `?redirect=/divar/new&category=${subCategories.find((s) => String(s.id) === formData.subCategoryId)?.slug || ''}`
        : '?redirect=/divar/new';
      router.push(`/auth${q}`);
      return;
    }

    if (!selectedCity?.id) {
      setError('لطفاً از نوار بالای سایت شهر خود را انتخاب کنید.');
      return;
    }

    try {
      setSubmitting(true);
      const media = formData.imageUrl.trim() ? [formData.imageUrl.trim()] : null;

      const res = await fetch(API_ENDPOINTS.listings.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: Number(formData.categoryId),
          subCategoryId: Number(formData.subCategoryId),
          fixedPrice: formData.fixedPrice,
          cityId: selectedCity.id,
          media,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedId(data.data?.id || null);
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.message || 'خطا در ثبت آگهی');
      }
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className={`mx-auto max-w-lg ${cardClass} p-8 text-center`}>
          <CheckCircleIcon className="mx-auto h-14 w-14 text-violet-600" />
          <h1 className="mt-4 text-xl font-bold text-gray-800">{DIVAR_LISTING_FORM.successTitle}</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{DIVAR_LISTING_FORM.successBody}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {createdId ? (
              <Link href={`/divar/listings/${createdId}`} className={divarPrimaryBtnClass}>
                مشاهده آگهی
              </Link>
            ) : null}
            <Link href="/divar" className={divarPrimaryBtnClass}>
              {DIVAR_LISTING_FORM.backToDivar}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="border-b border-gray-200 bg-gradient-to-bl from-violet-50 via-white to-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <Link
            href="/divar"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:text-violet-900"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" aria-hidden />
            {DIVAR_LISTING_FORM.backToDivar}
          </Link>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <MegaphoneIcon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{DIVAR_LISTING_FORM.pageTitle}</h1>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{DIVAR_LISTING_FORM.pageLead}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-8">
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <FormSection title="دسته‌بندی">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={DIVAR_LISTING_FORM.fields.category} required>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, categoryId: e.target.value, subCategoryId: '' }))
                }
                className={divarInputClass}
              >
                <option value="">انتخاب کنید</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ''}
                    {cat.title}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label={DIVAR_LISTING_FORM.fields.subCategory} required>
              <select
                required
                value={formData.subCategoryId}
                disabled={!formData.categoryId}
                onChange={(e) => setFormData((p) => ({ ...p, subCategoryId: e.target.value }))}
                className={divarInputClass}
              >
                <option value="">انتخاب کنید</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.icon ? `${sub.icon} ` : ''}
                    {sub.title}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="مشخصات آگهی">
          <div className="space-y-4">
            <FormField label={DIVAR_LISTING_FORM.fields.title} required>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder={DIVAR_LISTING_FORM.fields.titlePlaceholder}
                className={divarInputClass}
              />
            </FormField>

            <FormField label={DIVAR_LISTING_FORM.fields.price} required>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formData.fixedPrice}
                onChange={(e) => setFormData((p) => ({ ...p, fixedPrice: e.target.value }))}
                placeholder={DIVAR_LISTING_FORM.fields.pricePlaceholder}
                className={divarInputClass}
                dir="ltr"
              />
            </FormField>

            <FormField label={DIVAR_LISTING_FORM.fields.description} required>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder={DIVAR_LISTING_FORM.fields.descriptionPlaceholder}
                className={textareaClass}
              />
            </FormField>

            <FormField label={DIVAR_LISTING_FORM.fields.imageUrl}>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder={DIVAR_LISTING_FORM.fields.imageUrlPlaceholder}
                className={divarInputClass}
                dir="ltr"
              />
            </FormField>
          </div>
        </FormSection>

        {selectedCity?.name ? (
          <p className="mb-4 text-xs text-gray-500">
            شهر انتشار: <span className="font-medium text-gray-700">{selectedCity.name}</span>
          </p>
        ) : null}

        <button type="submit" disabled={submitting} className={divarPrimaryBtnClass}>
          {submitting ? 'در حال ثبت…' : DIVAR_LISTING_FORM.submit}
        </button>
      </form>
    </div>
  );
}

export default function DivarNewListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      }
    >
      <DivarListingNewForm />
    </Suspense>
  );
}
