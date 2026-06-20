'use client';

import dynamic from 'next/dynamic';
import {
  CheckBadgeIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  DocumentCheckIcon,
  IdentificationIcon,
  MapPinIcon,
  ShieldCheckIcon,
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
import { buildExpertBadges } from '../ui/ProfileVerificationUi';

const CityAddressMap = dynamic(() => import('../ui/CityAddressMap'), { ssr: false });

/** بیوگرافی — بلوک جدا و خوانا، نه زیر نام در هدر */
export function ExpertPublicBioBlock({ bio }) {
  const text = bio?.trim();
  if (!text) return null;

  return (
    <article className="rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-50/40 to-white p-4 dark:border-teal-800/50 dark:from-teal-950/30 dark:to-sky-900 sm:p-5">
      <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">درباره من</h3>
      <p className="mt-3 text-sm leading-8 text-slate-700 dark:text-sky-200 whitespace-pre-wrap sm:text-[0.9375rem]">
        {text}
      </p>
    </article>
  );
}

const TRUST_PILL_META = {
  mobile: { title: 'موبایل', Icon: DevicePhoneMobileIcon },
  expert: { title: 'متخصص پرند ایکس', Icon: ShieldCheckIcon },
  nationalId: { title: 'احراز هویت', Icon: IdentificationIcon },
  license: { title: 'پروانه کسب', Icon: DocumentCheckIcon },
};

function TrustPill({ itemKey, ok }) {
  const meta = TRUST_PILL_META[itemKey];
  if (!meta) return null;
  const Icon = meta.Icon;

  if (ok) {
    return (
      <li>
        <span
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/90 dark:bg-sky-900 dark:text-sky-100 dark:ring-sky-700"
          title={meta.title}
        >
          <CheckBadgeIcon className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
          <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-sky-400" aria-hidden />
          <span>{meta.title}</span>
        </span>
      </li>
    );
  }

  return (
    <li>
      <span
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2.5 py-1.5 text-xs text-slate-400 ring-1 ring-slate-200/60 dark:bg-sky-950/60 dark:text-sky-500 dark:ring-sky-800"
        title={`${meta.title} — تکمیل نشده`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
        <span>{meta.title}</span>
      </span>
    </li>
  );
}

/** نشان‌های اعتماد — بدون تکرار «تأیید شده» */
export function ExpertPublicProfileHighlights({ expert, user }) {
  const badges = buildExpertBadges(expert, user);
  const verified = badges.filter((b) => b.ok);
  const expertPending = expert?.status && expert.status !== 'approved';

  if (verified.length === 0 && !expertPending) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white ring-1 ring-slate-100/80 dark:border-sky-800 dark:bg-sky-900 dark:ring-sky-800/60">
      <div className="px-4 py-3.5 sm:px-5">
        <ul className="flex flex-wrap gap-2" aria-label="نشان‌های اعتماد">
          {verified.map((item) => (
            <TrustPill key={item.key} itemKey={item.key} ok />
          ))}
          {expertPending ? (
            <li>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
                <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                در انتظار تأیید
              </span>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}

/** @deprecated — از ExpertPublicProfileHighlights استفاده کنید */
export function ExpertPublicTrustGrid(props) {
  return <ExpertPublicProfileHighlights {...props} />;
}

function presenceDotClass(status) {
  return PRESENCE_STATUS_OPTIONS.find((o) => o.value === status)?.dotClass || 'bg-slate-400';
}

/** حضور + جدول برنامه هفتگی */
export function ExpertPublicPresenceSection({ presenceStatus, workSchedule }) {
  const schedule = normalizeWorkSchedule(workSchedule);
  const statusLabel = getPresenceStatusLabel(presenceStatus);

  return (
    <div className="divide-y divide-slate-100 dark:divide-sky-800">
      {statusLabel ? (
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${presenceDotClass(presenceStatus)}`}
            aria-hidden
          />
          <div>
            <p className="text-xs text-slate-500 dark:text-sky-400">وضعیت فعلی</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-sky-100">{statusLabel}</p>
          </div>
        </div>
      ) : null}

      <div className="px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" aria-hidden />
          <h3 className="text-sm font-bold text-slate-900 dark:text-sky-100">برنامه هفتگی</h3>
        </div>

        {/* موبایل: کارت هر روز */}
        <ul className="space-y-2 sm:hidden">
          {WEEK_DAYS.map(({ key, label }) => {
            const day = schedule[key];
            const open = day?.enabled;
            return (
              <li
                key={key}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                  open
                    ? 'border-teal-100 bg-teal-50/50 dark:border-teal-800/60 dark:bg-teal-950/40'
                    : 'border-slate-100 bg-slate-50/50 dark:border-sky-800 dark:bg-sky-950/60'
                }`}
              >
                <span className="text-sm font-medium text-slate-800 dark:text-sky-100">{label}</span>
                {open ? (
                  <span className="text-xs font-medium text-teal-800 dark:text-teal-300" dir="ltr">
                    {day.start} – {day.end}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-sky-500">تعطیل</span>
                )}
              </li>
            );
          })}
        </ul>

        {/* دسکتاپ و تبلت: جدول */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[280px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-sky-700 dark:text-sky-400">
                <th className="py-2 pl-3 font-semibold">روز</th>
                <th className="py-2 px-3 font-semibold">وضعیت</th>
                <th className="py-2 pr-3 font-semibold" dir="ltr">
                  ساعات کاری
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
                    className={`border-b border-slate-100 last:border-0 dark:border-sky-800 ${
                      open ? 'bg-teal-50/30 dark:bg-teal-950/30' : ''
                    }`}
                  >
                    <td className="py-2.5 pl-3 font-medium text-slate-800 dark:text-sky-100">{label}</td>
                    <td className="py-2.5 px-3">
                      {open ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          باز
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-sky-500">تعطیل</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 text-left font-medium text-slate-700 dark:text-sky-200" dir="ltr">
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
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-sky-700">
      <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 dark:border-sky-800 dark:bg-sky-950/80 dark:text-sky-400">
        نقشه — {title}
      </div>
      <div className="h-48 sm:h-56">
        <CityAddressMap
          key={`${city.slug}-${city.id}-map`}
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

/** همه آدرس‌ها به‌صورت کارت جدا */
export function ExpertPublicAddressesList({ addresses, cities = [] }) {
  const list = Array.isArray(addresses) ? addresses : [];

  if (!list.length) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-sky-400 sm:px-5">
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
        const label = addr.title || (addr.isPrimary ? 'آدرس اصلی' : `آدرس ${index + 1}`);
        const fullLine = formatFullAddressLine({
          addressLine: addr.addressLine,
          plaque: addr.plaque,
          unit: addr.unit,
          postalCode: addr.postalCode,
        });

        return (
          <li
            key={addr.id || `addr-${index}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-sky-800 dark:bg-sky-900 dark:shadow-none"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-sky-800 dark:bg-sky-950/60">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
                <h3 className="text-sm font-bold text-slate-900 dark:text-sky-100">{label}</h3>
              </div>
              {addr.isPrimary ? (
                <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  اصلی
                </span>
              ) : null}
            </div>

            <dl className="grid gap-0 divide-y divide-slate-100 px-4 text-sm dark:divide-sky-800 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-4 sm:py-3">
              {provinceName ? (
                <div className="py-2.5 sm:py-2">
                  <dt className="text-xs text-slate-500 dark:text-sky-400">استان</dt>
                  <dd className="mt-0.5 font-medium text-slate-800 dark:text-sky-100">{provinceName}</dd>
                </div>
              ) : null}
              {cityName ? (
                <div className="py-2.5 sm:py-2">
                  <dt className="text-xs text-slate-500 dark:text-sky-400">شهر</dt>
                  <dd className="mt-0.5 font-medium text-slate-800 dark:text-sky-100">{cityName}</dd>
                </div>
              ) : null}
              {fullLine ? (
                <div className="py-2.5 sm:col-span-2 sm:py-2">
                  <dt className="text-xs text-slate-500 dark:text-sky-400">نشانی کامل</dt>
                  <dd className="mt-1 leading-relaxed text-slate-800 dark:text-sky-200">{fullLine}</dd>
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
