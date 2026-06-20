"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BellAlertIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../hooks/useRole";

export default function RequestAlertsMenu({ variant = 'desktop' }) {
  const [count, setCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { canAccessExpert } = useRole();
  const expertAccess = canAccessExpert();

  const fetchCount = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.requests.alertCount, { credentials: "include" });
      const data = await res.json();
      if (data?.success) setCount(data.data?.count || 0);
    } catch (_) {}
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.requests.alerts, { credentials: "include" });
      const data = await res.json();
      if (data?.success) setAlerts(data.data || []);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !expertAccess) {
      setCount((prev) => (prev === 0 ? prev : 0));
      setAlerts((prev) => (prev.length === 0 ? prev : []));
      return undefined;
    }
    fetchCount();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchCount();
    }, 45000);
    const onRefresh = () => fetchCount();
    window.addEventListener("refresh-request-alerts", onRefresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-request-alerts", onRefresh);
    };
  }, [isAuthenticated, expertAccess]);

  useEffect(() => {
    if (open) fetchAlerts();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDismiss = async (alertId) => {
    try {
      const res = await fetch(API_ENDPOINTS.requests.dismissAlert(alertId), {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        setCount((prev) => Math.max(0, prev - 1));
        window.dispatchEvent(new Event("refresh-request-alerts"));
      }
    } catch (_) {}
  };

  const handleView = (requestId) => {
    setOpen(false);
    router.push(`/requests/${requestId}`);
  };

  const isMobile = variant === 'mobile';
  const wrapperClass = isMobile ? 'relative md:hidden' : 'relative hidden md:block';
  const buttonClass = isMobile
    ? 'relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600 active:bg-gray-100'
    : 'relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600';
  const iconClass = isMobile ? 'h-[1.35rem] w-[1.35rem] shrink-0' : 'h-5 w-5 shrink-0';
  const badgePos = isMobile ? 'top-1 left-1' : 'top-1.5 left-1.5';

  if (!isAuthenticated || !expertAccess) {
    if (!isMobile) return null;
    return (
      <Link
        href="/auth"
        scroll={false}
        className={buttonClass}
        title="اعلان‌ها"
        aria-label="اعلان‌ها — ورود"
      >
        <BellAlertIcon className={iconClass} strokeWidth={1.75} aria-hidden />
      </Link>
    );
  }

  return (
    <div className={wrapperClass} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={buttonClass}
        title="کارهای جدید"
        aria-label="کارهای جدید"
        aria-expanded={open}
      >
        <BellAlertIcon className={iconClass} aria-hidden />
        {count > 0 && (
          <span
            className={`absolute ${badgePos} flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-0.5 text-[9px] font-bold text-white md:h-[1.125rem] md:min-w-[1.125rem] md:px-1 md:text-[10px]`}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute z-[10000] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60 ${
            isMobile
              ? 'fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] top-auto left-auto mt-0 w-auto max-h-[min(70vh,24rem)]'
              : 'left-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-amber-50/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">سفارش‌های جدید</p>
              <p className="text-xs text-gray-500">مربوط به تخصص‌های شما</p>
            </div>
            {count > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {count} مورد
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">در حال بارگذاری...</p>
            ) : alerts.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">اعلان جدیدی ندارید</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {alerts.map((alert) => {
                  const req = alert.request;
                  const catLabel = req?.subCategory?.title || req?.category?.title;
                  return (
                    <li key={alert.id} className="p-3 hover:bg-gray-50/80">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {req?.title || req?.description?.slice(0, 60) || "درخواست کار"}
                      </p>
                      {catLabel && (
                        <p className="mt-1 text-xs text-teal-700">
                          {req?.subCategory?.icon || req?.category?.icon} {catLabel}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(req?.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-teal-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          مشاهده
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDismiss(alert.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                          رد کردن
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <Link
              href="/dashboard/expert/requests"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              همه درخواست‌های دریافتی
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
