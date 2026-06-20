'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../../config/api';
import { formatListingPrice } from '../../../utils/listingUtils';

const STATUS_LABEL = { published: 'در دیوار', archived: 'آرشیو', draft: 'پیش‌نویس' };

function ProductModal({ open, onClose, product, onSaved, merchantId }) {
  const isEdit = Boolean(product?.id);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    media: '',
    isAvailable: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        description: product.description || '',
        price: product.price ? String(product.price) : '',
        media: product.media?.[0] || '',
        isAvailable: product.isAvailable !== false,
      });
    } else {
      setForm({ title: '', description: '', price: '', media: '', isAvailable: true });
    }
    setError('');
  }, [product, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('عنوان الزامی است'); return; }
    setSaving(true);
    setError('');
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        price: form.price ? Number(String(form.price).replace(/[^\d]/g, '')) || null : null,
        media: form.media.trim() ? [form.media.trim()] : null,
        isAvailable: form.isAvailable,
      };
      const url = isEdit ? API_ENDPOINTS.shopProducts.update(product.id) : API_ENDPOINTS.shopProducts.create;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'خطا');
      onSaved(data.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-base font-bold text-gray-800">{isEdit ? 'ویرایش محصول' : 'افزودن محصول'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">عنوان *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              placeholder="مثلاً: گوشی سامسونگ A54"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">توضیحات</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              placeholder="شرح مختصر محصول"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">قیمت (تومان)</label>
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              placeholder="مثلاً: 8500000"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">لینک تصویر</label>
            <input
              value={form.media}
              onChange={(e) => setForm((f) => ({ ...f, media: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
              className="h-4 w-4 rounded"
            />
            <span>موجود است</span>
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'در حال ذخیره...' : isEdit ? 'به‌روزرسانی' : 'افزودن'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VitrineDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    fetch(API_ENDPOINTS.shopProducts.mine, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => { if (res.success) setProducts(res.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaved = (saved) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    showToast(editProduct ? 'محصول به‌روز شد' : 'محصول افزوده شد');
  };

  const handleDelete = async (id) => {
    if (!confirm('محصول حذف شود؟')) return;
    setActionLoading(id + '-del');
    try {
      const res = await fetch(API_ENDPOINTS.shopProducts.remove(id), {
        method: 'DELETE', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('محصول حذف شد');
      } else throw new Error(data.message);
    } catch (err) { showToast('خطا: ' + err.message); }
    finally { setActionLoading(null); }
  };

  const handlePublish = async (product) => {
    if (!product.price) {
      showToast('برای انتشار در دیوار، قیمت الزامی است');
      return;
    }
    if (!product.subCategoryId) {
      showToast('برای انتشار در دیوار، زیردسته الزامی است');
      return;
    }
    setActionLoading(product.id + '-pub');
    try {
      const res = await fetch(API_ENDPOINTS.shopProducts.publishToDivar(product.id), {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => p.id === product.id
          ? { ...p, listingId: data.data.listing.id, listing: { ...data.data.listing } }
          : p
        ));
        showToast(data.message);
      } else throw new Error(data.message);
    } catch (err) { showToast('خطا: ' + err.message); }
    finally { setActionLoading(null); }
  };

  const handleUnpublish = async (product) => {
    if (!confirm('آگهی از دیوار حذف شود؟')) return;
    setActionLoading(product.id + '-unpub');
    try {
      const res = await fetch(API_ENDPOINTS.shopProducts.unpublishFromDivar(product.id), {
        method: 'DELETE', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => p.id === product.id
          ? { ...p, listingId: null, listing: null }
          : p
        ));
        showToast('آگهی از دیوار حذف شد');
      } else throw new Error(data.message);
    } catch (err) { showToast('خطا: ' + err.message); }
    finally { setActionLoading(null); }
  };

  const openAdd = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProduct(p); setModalOpen(true); };

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 sm:p-6">
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editProduct}
        onSaved={handleSaved}
      />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">ویترین فروشگاه</h1>
          <p className="mt-0.5 text-xs text-gray-500">محصولات خود را مدیریت کنید و در دیوار منتشر کنید</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
        >
          + افزودن محصول
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-200 bg-white py-16 text-center">
          <p className="text-3xl">🛍️</p>
          <p className="mt-2 font-medium text-gray-700">ویترین خالی است</p>
          <p className="mt-1 text-sm text-gray-400">محصولات فروشگاه خود را اضافه کنید</p>
          <button
            onClick={openAdd}
            className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            افزودن اولین محصول
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const isPublished = p.listingId && p.listing?.status === 'published';
            const pubLoading = actionLoading === p.id + '-pub';
            const unpubLoading = actionLoading === p.id + '-unpub';
            const delLoading = actionLoading === p.id + '-del';
            return (
              <div
                key={p.id}
                className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                  {p.media?.[0] ? (
                    <img src={p.media[0]} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">📦</div>
                  )}
                  {isPublished && (
                    <span className="absolute bottom-0 left-0 right-0 bg-emerald-500 py-0.5 text-center text-[9px] font-bold text-white">
                      دیوار
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{p.title}</p>
                  {p.price ? (
                    <p className="mt-0.5 text-xs font-medium text-amber-600">{formatListingPrice(p.price)}</p>
                  ) : (
                    <p className="mt-0.5 text-xs text-gray-400">بدون قیمت</p>
                  )}
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {p.isAvailable ? 'موجود' : 'ناموجود'}
                    {isPublished && (
                      <>
                        {' · '}
                        <Link href={`/divar/listings/${p.listingId}`} className="text-emerald-600 hover:underline">
                          مشاهده در دیوار
                        </Link>
                      </>
                    )}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                    >
                      ویرایش
                    </button>

                    {isPublished ? (
                      <button
                        onClick={() => handleUnpublish(p)}
                        disabled={unpubLoading}
                        className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600 disabled:opacity-60 hover:bg-red-100"
                      >
                        {unpubLoading ? '...' : 'حذف از دیوار'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublish(p)}
                        disabled={pubLoading}
                        className="rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 disabled:opacity-60 hover:bg-emerald-100"
                      >
                        {pubLoading ? '...' : 'انتشار در دیوار'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={delLoading}
                      className="rounded-lg border border-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-400 disabled:opacity-60 hover:text-red-500"
                    >
                      {delLoading ? '...' : 'حذف'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
