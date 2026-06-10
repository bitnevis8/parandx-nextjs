"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import JalaliDateField, { jalaliDateToIso } from "../../components/ui/JalaliDateField";
import RequestLocationSection from "../../components/requests/RequestLocationSection";
import {
  cardClass,
  FormField,
  FormSection,
  inputClass,
  primaryBtnClass,
  textareaClass,
} from "../../components/ui/dashboard/DashboardUi";

function NewRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { selectedCity } = useCity();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [deadlineJalali, setDeadlineJalali] = useState(null);
  const [mapSelection, setMapSelection] = useState({ sectionId: "", neighborhoodId: "" });
  const [mapPayload, setMapPayload] = useState(null);
  const [pinPosition, setPinPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    addressLine: "",
  });

  useEffect(() => {
    fetch(API_ENDPOINTS.categories.getAll('services'), { credentials: "include" })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setCategories(result.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const catSlug = searchParams.get("category");
    if (!catSlug || !categories.length) return;

    for (const cat of categories) {
      if (cat.slug === catSlug) {
        setFormData((prev) => ({ ...prev, categoryId: String(cat.id), subCategoryId: "" }));
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
      mapPayload?.displayName || mapPayload?.locationData?.displayName,
    ].filter(Boolean);
    return parts.join(" — ") || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      router.push("/auth?redirect=/requests/new");
      return;
    }

    if (!selectedCity?.id) {
      setError("لطفاً از نوار بالای سایت شهر خود را انتخاب کنید.");
      return;
    }

    try {
      setSubmitting(true);
      const locationData = {
        addressLine: formData.addressLine?.trim() || null,
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        sectionId: mapSelection.sectionId || null,
        neighborhoodId: mapSelection.neighborhoodId || null,
        displayName: mapPayload?.displayName || mapPayload?.locationData?.displayName || null,
        pin: pinPosition,
        mapPayload: mapPayload || null,
      };

      const res = await fetch(API_ENDPOINTS.requests.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: Number(formData.categoryId),
          subCategoryId: formData.subCategoryId ? Number(formData.subCategoryId) : null,
          cityId: selectedCity.id,
          location: buildLocationSummary(),
          locationData,
          deadline: jalaliDateToIso(deadlineJalali),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "خطا در ثبت کار");
      }
    } catch (_) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className={`mx-auto max-w-lg ${cardClass} p-8 text-center`}>
          <CheckCircleIcon className="mx-auto h-14 w-14 text-teal-600" />
          <h1 className="mt-4 text-xl font-bold text-gray-800">درخواست شما ثبت شد</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            خبر به متخصص‌های مرتبط رسید — به‌زودی براتون پیشنهاد می‌فرستن.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/dashboard/customer/active-requests" className={primaryBtnClass}>
              درخواست‌های من
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="border-b border-gray-200 bg-gradient-to-bl from-teal-50 via-white to-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <p className="text-sm font-medium text-teal-700">ثبت کار</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            دریافت پیشنهاد از متخصص‌ها
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            جزئیات کار را بنویسید، محل را روی نقشه مشخص کنید و مهلت انجام را انتخاب کنید؛
            متخصص‌های مناسب پیشنهاد می‌دن.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {!isAuthenticated && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            برای ثبت کار باید وارد حساب شوید.{" "}
            <Link href="/auth?redirect=/requests/new" className="font-semibold text-teal-700 underline">
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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <ClipboardDocumentListIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">جزئیات درخواست</h2>
                <p className="text-xs text-gray-500">عنوان، دسته‌بندی و توضیحات کار</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <FormSection gridClass="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="عنوان درخواست" span="full">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    className={inputClass}
                    placeholder="مثلاً نقاشی ساختمان ۱۰۰ متری"
                    required
                  />
                </FormField>

                <FormField label="دسته اصلی">
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        categoryId: e.target.value,
                        subCategoryId: "",
                      }))
                    }
                    className={inputClass}
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

                <FormField label="زیردسته">
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData((p) => ({ ...p, subCategoryId: e.target.value }))}
                    className={inputClass}
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
                    className={textareaClass}
                    placeholder="جزئیات کار، ابعاد، شرایط دسترسی، زمان ترجیحی و..."
                    required
                  />
                </FormField>
              </FormSection>
            </div>
          </div>

          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <MapPinIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">محل انجام کار</h2>
                <p className="text-xs text-gray-500">نقشه شهر، انتخاب منطقه و آدرس متنی</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <RequestLocationSection
                city={selectedCity}
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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <CalendarDaysIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">زمان‌بندی</h2>
                <p className="text-xs text-gray-500">مهلت مطلوب برای انجام کار</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <FormField label="مهلت انجام (شمسی)" span="full">
                <JalaliDateField
                  value={deadlineJalali}
                  onChange={setDeadlineJalali}
                  placeholder="انتخاب تاریخ شمسی"
                />
              </FormField>
            </div>
          </div>

          <div className={`${cardClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
            <p className="text-sm leading-relaxed text-gray-600">
              بعد از ثبت، متخصص‌های همون دسته خبرشون می‌شه و می‌تونن پیشنهاد بدن.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className={`${primaryBtnClass} w-full gap-2 sm:w-auto sm:min-w-[11rem]`}
            >
              <PaperAirplaneIcon className="h-4 w-4" aria-hidden />
              {submitting ? "در حال ارسال..." : "ثبت کار"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      }
    >
      <NewRequestForm />
    </Suspense>
  );
}
