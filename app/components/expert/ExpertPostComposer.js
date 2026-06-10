'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

export default function ExpertPostComposer({ onPosted }) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    setSaving(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.experts.createPost, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, visibility }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || 'خطا در انتشار پست');
        return;
      }
      setContent('');
      onPosted?.(json.data);
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="border-b border-slate-100 p-4 sm:p-5">
      <label htmlFor="expert-post-content" className="sr-only">
        متن پست
      </label>
      <textarea
        id="expert-post-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="چه خبر؟ تجربه، نکته تخصصی یا اعلام آمادگی برای پروژه جدید…"
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <fieldset className="flex flex-wrap gap-3 text-sm">
          <legend className="sr-only">محدوده نمایش</legend>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="post-visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={() => setVisibility('public')}
              className="text-teal-600 focus:ring-teal-500"
            />
            <span className="text-slate-700">عمومی</span>
            <span className="text-xs text-slate-400">(همه می‌بینند)</span>
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="post-visibility"
              value="followers"
              checked={visibility === 'followers'}
              onChange={() => setVisibility('followers')}
              className="text-teal-600 focus:ring-teal-500"
            />
            <span className="text-slate-700">دنبال‌کنندگان</span>
            <span className="text-xs text-slate-400">(فقط دنبال‌کنندگان)</span>
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'در حال انتشار…' : 'انتشار پست'}
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </form>
  );
}
