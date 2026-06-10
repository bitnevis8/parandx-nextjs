'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { fetchAuth } from '../../utils/requestFormat';
import {
  FormField,
  inputClass,
  primaryBtnClass,
  textareaClass,
} from '../ui/dashboard/DashboardUi';

export default function RequestBidForm({ requestId, onSubmitted }) {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!description.trim()) {
      setError('توضیحات پیشنهاد الزامی است.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_ENDPOINTS.bids.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...fetchAuth,
        body: JSON.stringify({
          requestId,
          description: description.trim(),
          price: price.trim() || null,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'خطا در ارسال پیشنهاد');
        return;
      }
      setSuccess(data.message || 'پیشنهاد شما ثبت شد.');
      setDescription('');
      setPrice('');
      onSubmitted?.(data.data);
      window.dispatchEvent(new Event('refresh-request-alerts'));
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="توضیحات پیشنهاد" span="full">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={textareaClass}
          placeholder="زمان تقریبی انجام کار، جزئیات اجرا، مواد مورد نیاز، شرایط دسترسی..."
          required
        />
      </FormField>

      <FormField label="قیمت پیشنهادی (اختیاری)" htmlFor="bid-price">
        <input
          id="bid-price"
          type="text"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^\d,]/g, ''))}
          className={inputClass}
          placeholder="مثلاً ۲٬۵۰۰٬۰۰۰"
        />
        <p className="mt-1.5 text-xs text-gray-500">در صورت تمایل مبلغ را به تومان وارد کنید.</p>
      </FormField>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className={`${primaryBtnClass} w-full sm:w-auto`}>
        <PaperAirplaneIcon className="h-4 w-4" aria-hidden />
        {submitting ? 'در حال ارسال...' : 'ارسال پیشنهاد'}
      </button>
    </form>
  );
}
