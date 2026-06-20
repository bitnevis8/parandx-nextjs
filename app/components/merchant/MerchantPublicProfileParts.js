'use client';

import dynamic from 'next/dynamic';
import {
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  MapPinIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { getMapSelectionFromAddressData } from '../../utils/geojsonBoundary';
import {
  formatFullAddressLine,
  getPinFromAddressData,
} from '../../utils/profileAddressUtils';
import {
  WEEK_DAYS,
  normalizeWorkSchedule,
  getPresenceStatusLabel,
  PRESENCE_STATUS_OPTIONS,
} from '../../utils/expertProfileUtils';
import { normalizePortfolio } from '../../utils/merchantProfileUtils';

const CityAddressMap = dynamic(() => import('../ui/CityAddressMap'), { ssr: false });

export function MerchantPublicBioBlock({ description, experience }) {
  const text = description?.trim();
  if (!text && !experience?.trim()) return null;

  return (
    <article className="rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-4 sm:p-5">
      {text ? (
        <>
          <h3 className="text-sm font-bold text-amber-950">درباره فروشگاه</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-slate-700 sm:text-[0.9375rem]">
            {text}
          </p>
        </>
      ) : null}
      {experience?.trim() ? (
        <p className={`text-sm text-slate-600 ${text ? 'mt-4 border-t border-amber-100 pt-4' : ''}`}>
          <span className="font-semibold text-amber-950">سابقه: </span>
          {experience}
        </p>
      ) : null}
    </article>
  );
}

export function MerchantPublicCategories({ categories = [] }) {
  const subs = categories.filter((c) => c.parentId);
  const list = subs.length ? subs : categories;
  if (!list.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin sm:flex-wrap sm:overflow-visible sm:pb-0">
      {list.map((cat) => (
        <span
          key={cat.id}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-100 bg-amber-50/90 px-3.5 py-2 text-sm font-medium text-amber-950"
        >
          {cat.icon ? (
            <span className="text-base leading-none" aria-hidden>
              {cat.icon}
            </span>
          ) : null}
          {cat.title}
        </span>
      ))}
    </div>
  );
}

function presenceDotClass(status) {
  return PRESENCE_STATUS_OPTIONS.find((o) => o.value === status)?.dotClass || 'bg-slate-400';
}

export function MerchantPublicPresenceSection({ presenceStatus, workSchedule }) {
  const schedule = normalizeWorkSchedule(workSchedule);
  const statusLabel = getPresenceStatusLabel(presenceStatus);

  return (
    <div className="divide-y divide-slate-100">
      {statusLabel ? (
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${presenceDotClass(presenceStatus)}`}
            aria-hidden
          />
          <div>
            <p className="text-xs text-slate-500">وضعیت فروشگاه</p>
            <p className="text-sm font-semibold text-slate-900">{statusLabel}</p>
          </div>
        </div>
      ) : null}

      <div className="px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-amber-600" aria-hidden />
          <h3 className="text-sm font-bold text-slate-900">ساعات کاری</h3>
        </div>

        <ul className="space-y-2 sm:hidden">
          {WEEK_DAYS.map(({ key, label }) => {
            const day = schedule[key];
            const open = day?.enabled;
            return (
              <li
                key={key}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                  open ? 'border-amber-100 bg-amber-50/50' : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <span className="text-sm font-medium text-slate-800">{label}</span>
                {open ? (
                  <span className="text-xs font-medium text-amber-900" dir="ltr">
                    {day.start} – {day.end}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">تعطیل</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[280px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right text-xs text-slate-500">
                <th className="py-2 pl-3 font-semibold">روز</th>
                <th className="py-2 px-3 font-semibold">وضعیت</th>
                <th className="py-2 pr-3 font-semibold" dir="ltr">
                  ساعات
                </th>
              </tr>
            </thead>
            <tbody>
              {WEEK_DAYS.map(({ key, label }) => {
                const day = schedule[key];
                const open = day?.enabled;
                return (
                  <tr
                    key={key}
                    className={`border-b border-slate-100 last:border-0 ${
                      open ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 pl-3 font-medium text-slate-800">{label}</td>
                    <td className="py-2.5 px-3">
                      {open ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          باز
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">تعطیل</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 text-left font-medium text-slate-700" dir="ltr">
                      {open ? `${day.start} – ${day.end}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddressMapBlock({ city, addressData, title }) {
  if (!city) return null;
  const mapSelection = getMapSelectionFromAddressData(addressData);
  const pinPosition = getPinFromAddressData(addressData);
  if (!mapSelection && !pinPosition) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-amber-100">
      <div className="border-b border-amber-50 bg-amber-50/80 px-3 py-1.5 text-xs text-amber-900/70">
        نقشه — {title}
      </div>
      <div className="h-52 sm:h-64">
        <CityAddressMap
          key={`${city.slug}-${city.id}-merchant-map`}
          city={city}
          mode="preview"
          value={mapSelection}
          showPin
          pinPosition={pinPosition}
        />
      </div>
    </div>
  );
}

export function MerchantPublicAddressesList({ addresses, cities = [] }) {
  const list = Array.isArray(addresses) ? addresses : [];

  if (!list.length) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-5">
        آدرسی ثبت نشده است.
      </p>
    );
  }

  return (
    <ul className="space-y-4 p-4 sm:space-y-5 sm:p-5">
      {list.map((addr, index) => {
        const city = cities.find((c) => String(c.id) === String(addr.cityId));
        const cityName = city?.name;
        const provinceName = city?.province;
        const label = addr.title || (addr.isPrimary ? 'آدرس فروشگاه' : `آدرس ${index + 1}`);
        const fullLine = formatFullAddressLine({
          addressLine: addr.addressLine || addr.line,
          plaque: addr.plaque,
          unit: addr.unit,
          postalCode: addr.postalCode,
        });

        return (
          <li
            key={addr.id || `addr-${index}`}
            className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-50 bg-amber-50/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                <h3 className="text-sm font-bold text-slate-900">{label}</h3>
              </div>
              {addr.isPrimary ? (
                <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  اصلی
                </span>
              ) : null}
            </div>

            <dl className="grid gap-0 divide-y divide-slate-100 px-4 text-sm sm:grid-cols-2 sm:divide-y-0 sm:gap-x-4 sm:py-3">
              {provinceName ? (
                <div className="py-2.5 sm:py-2">
                  <dt className="text-xs text-slate-500">استان</dt>
                  <dd className="mt-0.5 font-medium text-slate-800">{provinceName}</dd>
                </div>
              ) : null}
              {cityName ? (
                <div className="py-2.5 sm:py-2">
                  <dt className="text-xs text-slate-500">شهر</dt>
                  <dd className="mt-0.5 font-medium text-slate-800">{cityName}</dd>
                </div>
              ) : null}
              {fullLine ? (
                <div className="py-2.5 sm:col-span-2 sm:py-2">
                  <dt className="text-xs text-slate-500">نشانی کامل</dt>
                  <dd className="mt-1 leading-relaxed text-slate-800">{fullLine}</dd>
                </div>
              ) : null}
            </dl>

            <div className="px-4 pb-4">
              <AddressMapBlock city={city} addressData={addr.addressData} title={label} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function MerchantPublicPortfolioGallery({ portfolio }) {
  const items = normalizePortfolio(portfolio).filter(
    (item) => item.title || item.imageUrl || item.videoUrl || item.instagramUrl || item.websiteUrl
  );

  if (!items.length) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-500 sm:px-5">
        هنوز نمونه‌کاری ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-xl border border-amber-100 bg-amber-50/30 transition hover:border-amber-200 hover:shadow-md"
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title || `نمونه ${index + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-amber-50 to-orange-50 text-slate-400">
              <PhotoIcon className="h-8 w-8" aria-hidden />
              <span className="text-sm">بدون عکس</span>
            </div>
          )}
          <div className="space-y-2 p-3">
            {item.title ? (
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {item.instagramUrl ? (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-950"
                >
                  اینستاگرام
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
              {item.websiteUrl ? (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-950"
                >
                  وب‌سایت
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
