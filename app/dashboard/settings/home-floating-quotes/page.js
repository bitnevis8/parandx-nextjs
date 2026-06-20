'use client';

import { useCallback, useEffect, useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { API_ENDPOINTS } from '../../../config/api';

const fetchOpts = { credentials: 'include' };

const DEFAULT_BANNER_ANIMATION = {
  speedMin: 0.25,
  speedMax: 0.8,
  maxAngle: 14,
  maxRotationSpeed: 0.35,
};

const DEFAULT_TYPEWRITER_ANIMATION = {
  typeMs: 28,
  deleteMs: 14,
  pauseAfterTypeMs: 1600,
  pauseAfterDeleteMs: 280,
  maxAngle: 0,
};

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

function QuotesEditor({ quotes, onChange, placeholder }) {
  const updateQuote = (index, value) => {
    onChange(quotes.map((item, i) => (i === index ? value : item)));
  };

  const addQuote = () => onChange([...quotes, '']);

  const removeQuote = (index) => {
    onChange(quotes.length <= 1 ? [''] : quotes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {quotes.map((quote, index) => (
          <li key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={quote}
              onChange={(e) => updateQuote(index, e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-teal-500/30 focus:border-teal-400 focus:ring-2 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-50"
            />
            <button
              type="button"
              onClick={() => removeQuote(index)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-sky-700 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              aria-label="حذف جمله"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={addQuote}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-teal-300 px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50 dark:border-sky-600 dark:text-sky-200 dark:hover:bg-sky-950"
      >
        <PlusIcon className="h-4 w-4" />
        افزودن جمله
      </button>
    </div>
  );
}

function SettingsSection({ title, description, children, onSave, saving, message, error }) {
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-sky-800 dark:bg-sky-900 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-sky-50">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-sky-300">{description}</p>
      </div>
      {children}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 dark:border-sky-800">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره…' : 'ذخیره این بخش'}
        </button>
        {message ? <span className="text-sm text-teal-700 dark:text-teal-300">{message}</span> : null}
        {error ? <span className="text-sm text-red-600 dark:text-red-300">{error}</span> : null}
      </div>
    </section>
  );
}

function HomeFloatingQuotesContent() {
  const [bannerQuotes, setBannerQuotes] = useState(['']);
  const [bannerAnim, setBannerAnim] = useState(DEFAULT_BANNER_ANIMATION);
  const [bannerDisplay, setBannerDisplay] = useState({ mobile: false, desktop: false });
  const [typewriterQuotes, setTypewriterQuotes] = useState(['']);
  const [typewriterAnim, setTypewriterAnim] = useState(DEFAULT_TYPEWRITER_ANIMATION);
  const [typewriterDisplay, setTypewriterDisplay] = useState({ mobile: false, desktop: false });

  const [loading, setLoading] = useState(true);
  const [savingBanner, setSavingBanner] = useState(false);
  const [savingTypewriter, setSavingTypewriter] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [typewriterMessage, setTypewriterMessage] = useState('');
  const [typewriterError, setTypewriterError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setBannerError('');
    setTypewriterError('');
    try {
      const [bannerRes, typewriterRes] = await Promise.all([
        fetch(API_ENDPOINTS.siteSetting.adminHomeRequestBanner, fetchOpts),
        fetch(API_ENDPOINTS.siteSetting.adminHomeRequestTypewriter, fetchOpts),
      ]);
      const bannerJson = await bannerRes.json();
      const typewriterJson = await typewriterRes.json();

      if (!bannerJson.success) throw new Error(bannerJson.message || 'خطا در دریافت تنظیمات هدر');
      if (!typewriterJson.success) {
        throw new Error(typewriterJson.message || 'خطا در دریافت تنظیمات نوشته تایپی');
      }

      const bannerList = Array.isArray(bannerJson.data?.quotes) ? bannerJson.data.quotes : [];
      const typewriterList = Array.isArray(typewriterJson.data?.quotes) ? typewriterJson.data.quotes : [];

      setBannerQuotes(bannerList.length ? bannerList : ['']);
      setTypewriterQuotes(typewriterList.length ? typewriterList : ['']);
      setBannerAnim({ ...DEFAULT_BANNER_ANIMATION, ...bannerJson.data?.animation });
      setBannerDisplay({
        mobile: bannerJson.data?.display?.mobile === true,
        desktop: bannerJson.data?.display?.desktop === true,
      });
      setTypewriterAnim({ ...DEFAULT_TYPEWRITER_ANIMATION, ...typewriterJson.data?.animation });
      setTypewriterDisplay({
        mobile: typewriterJson.data?.display?.mobile === true,
        desktop: typewriterJson.data?.display?.desktop === true,
      });
    } catch (err) {
      setBannerError(err.message || 'خطا در بارگذاری');
      setTypewriterError(err.message || 'خطا در بارگذاری');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const cleanQuotes = (list) => list.map((item) => item.trim()).filter(Boolean);

  const handleSaveBanner = async () => {
    setSavingBanner(true);
    setBannerMessage('');
    setBannerError('');
    try {
      const quotes = cleanQuotes(bannerQuotes);
      if (!quotes.length) throw new Error('حداقل یک جمله برای هدر وارد کنید');

      const res = await fetch(API_ENDPOINTS.siteSetting.adminHomeRequestBanner, {
        ...fetchOpts,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotes, animation: bannerAnim, display: bannerDisplay }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در ذخیره');

      setBannerQuotes(json.data.quotes);
      setBannerAnim({ ...DEFAULT_BANNER_ANIMATION, ...json.data.animation });
      setBannerDisplay({
        mobile: json.data.display?.mobile === true,
        desktop: json.data.display?.desktop === true,
      });
      setBannerMessage('تنظیمات هدر ذخیره شد');
    } catch (err) {
      setBannerError(err.message || 'خطا در ذخیره');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleSaveTypewriter = async () => {
    setSavingTypewriter(true);
    setTypewriterMessage('');
    setTypewriterError('');
    try {
      const quotes = cleanQuotes(typewriterQuotes);
      if (!quotes.length) throw new Error('حداقل یک جمله تایپی وارد کنید');

      const res = await fetch(API_ENDPOINTS.siteSetting.adminHomeRequestTypewriter, {
        ...fetchOpts,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotes,
          animation: typewriterAnim,
          display: typewriterDisplay,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'خطا در ذخیره');

      setTypewriterQuotes(json.data.quotes);
      setTypewriterAnim({ ...DEFAULT_TYPEWRITER_ANIMATION, ...json.data.animation });
      setTypewriterDisplay({
        mobile: json.data.display?.mobile === true,
        desktop: json.data.display?.desktop === true,
      });
      setTypewriterMessage('تنظیمات نوشته تایپی ذخیره شد');
    } catch (err) {
      setTypewriterError(err.message || 'خطا در ذخیره');
    } finally {
      setSavingTypewriter(false);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-sky-50">باکس استخدام — جملات و انیمیشن</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-sky-300">
          جملات و سرعت/زاویه هدر شناور و نوشته تایپی زیر «اعلان کار | استخدام جدید» را جداگانه تنظیم
          کنید.
        </p>
      </div>

      <SettingsSection
        title="جملات شناور هدر"
        description="جملات کوتاه متحرک زیر عنوان باکس. نمایش در موبایل و دسکتاپ جداگانه — پیش‌فرض هر دو مخفی."
        onSave={handleSaveBanner}
        saving={savingBanner}
        message={bannerMessage}
        error={bannerError}
      >
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-sky-800 dark:bg-sky-950/60">
            <input
              type="checkbox"
              checked={bannerDisplay.mobile}
              onChange={(e) =>
                setBannerDisplay((prev) => ({ ...prev, mobile: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800 dark:text-sky-100">
                نمایش در موبایل
              </span>
              <span className="mt-0.5 block text-xs text-gray-500 dark:text-sky-400">
                جملات شناور هدر — پیش‌فرض: مخفی
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-sky-800 dark:bg-sky-950/60">
            <input
              type="checkbox"
              checked={bannerDisplay.desktop}
              onChange={(e) =>
                setBannerDisplay((prev) => ({ ...prev, desktop: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800 dark:text-sky-100">
                نمایش در دسکتاپ
              </span>
              <span className="mt-0.5 block text-xs text-gray-500 dark:text-sky-400">
                جملات شناور هدر — پیش‌فرض: مخفی
              </span>
            </span>
          </label>
        </div>

        <QuotesEditor
          quotes={bannerQuotes}
          onChange={setBannerQuotes}
          placeholder="مثلاً: پنچرگیری می‌خوام"
        />

        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 dark:border-sky-800 sm:grid-cols-2">
          <NumberField
            label="سرعت حرکت — حداقل"
            hint="عدد کوچک‌تر = آهسته‌تر (۰٫۰۵ تا ۲)"
            value={bannerAnim.speedMin}
            onChange={(v) => setBannerAnim((prev) => ({ ...prev, speedMin: v }))}
            min={0.05}
            max={2}
            step={0.05}
          />
          <NumberField
            label="سرعت حرکت — حداکثر"
            hint="عدد بزرگ‌تر = سریع‌تر (۰٫۰۵ تا ۳)"
            value={bannerAnim.speedMax}
            onChange={(v) => setBannerAnim((prev) => ({ ...prev, speedMax: v }))}
            min={0.05}
            max={3}
            step={0.05}
          />
          <NumberField
            label="حداکثر زاویه متن"
            hint="درجه چرخش اولیه هر جمله (۰ تا ۴۵)"
            value={bannerAnim.maxAngle}
            onChange={(v) => setBannerAnim((prev) => ({ ...prev, maxAngle: v }))}
            min={0}
            max={45}
          />
          <NumberField
            label="سرعت چرخش"
            hint="سرعت چرخش در حین حرکت (۰ تا ۲)"
            value={bannerAnim.maxRotationSpeed}
            onChange={(v) => setBannerAnim((prev) => ({ ...prev, maxRotationSpeed: v }))}
            min={0}
            max={2}
            step={0.05}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="نوشته تایپی (زیر اعلان کار)"
        description="جملات بلند با افکت تایپ و پاک‌شدن. نمایش در موبایل و دسکتاپ جداگانه قابل تنظیم است — پیش‌فرض هر دو مخفی."
        onSave={handleSaveTypewriter}
        saving={savingTypewriter}
        message={typewriterMessage}
        error={typewriterError}
      >
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-sky-800 dark:bg-sky-950/60">
            <input
              type="checkbox"
              checked={typewriterDisplay.mobile}
              onChange={(e) =>
                setTypewriterDisplay((prev) => ({ ...prev, mobile: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800 dark:text-sky-100">
                نمایش در موبایل
              </span>
              <span className="mt-0.5 block text-xs text-gray-500 dark:text-sky-400">
                عرض کمتر از ۷۶۸px — پیش‌فرض: مخفی
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-sky-800 dark:bg-sky-950/60">
            <input
              type="checkbox"
              checked={typewriterDisplay.desktop}
              onChange={(e) =>
                setTypewriterDisplay((prev) => ({ ...prev, desktop: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800 dark:text-sky-100">
                نمایش در دسکتاپ
              </span>
              <span className="mt-0.5 block text-xs text-gray-500 dark:text-sky-400">
                نمایشگر ۷۶۸px به بالا — پیش‌فرض: مخفی
              </span>
            </span>
          </label>
        </div>

        <QuotesEditor
          quotes={typewriterQuotes}
          onChange={setTypewriterQuotes}
          placeholder="مثلاً: پنچر شدی؟ آدرس بده، پنچرگیری میاد"
        />

        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 dark:border-sky-800 sm:grid-cols-2">
          <NumberField
            label="سرعت تایپ"
            hint="میلی‌ثانیه بین هر حرف — کمتر = سریع‌تر (۸ تا ۱۲۰)"
            value={typewriterAnim.typeMs}
            onChange={(v) => setTypewriterAnim((prev) => ({ ...prev, typeMs: v }))}
            min={8}
            max={120}
          />
          <NumberField
            label="سرعت پاک‌کردن"
            hint="میلی‌ثانیه بین حذف هر حرف (۵ تا ۸۰)"
            value={typewriterAnim.deleteMs}
            onChange={(v) => setTypewriterAnim((prev) => ({ ...prev, deleteMs: v }))}
            min={5}
            max={80}
          />
          <NumberField
            label="مکث بعد از تایپ"
            hint="میلی‌ثانیه نگه‌داشتن جمله کامل (۳۰۰ تا ۸۰۰۰)"
            value={typewriterAnim.pauseAfterTypeMs}
            onChange={(v) => setTypewriterAnim((prev) => ({ ...prev, pauseAfterTypeMs: v }))}
            min={300}
            max={8000}
            step={100}
          />
          <NumberField
            label="مکث بین جملات"
            hint="قبل از شروع جمله بعدی (۱۰۰ تا ۳۰۰۰)"
            value={typewriterAnim.pauseAfterDeleteMs}
            onChange={(v) => setTypewriterAnim((prev) => ({ ...prev, pauseAfterDeleteMs: v }))}
            min={100}
            max={3000}
            step={50}
          />
          <NumberField
            label="حداکثر زاویه متن"
            hint="کج‌شدن تصادفی هر جمله (۰ = بدون کجی، تا ۲۰ درجه)"
            value={typewriterAnim.maxAngle}
            onChange={(v) => setTypewriterAnim((prev) => ({ ...prev, maxAngle: v }))}
            min={0}
            max={20}
          />
        </div>
      </SettingsSection>
    </div>
  );
}

export default function HomeFloatingQuotesSettingsPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'moderator']}>
      <HomeFloatingQuotesContent />
    </ProtectedRoute>
  );
}
