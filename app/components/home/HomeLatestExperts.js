'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { getExpertPublicName } from '../../utils/expertProfileUtils';
import { HOME_BLOCK_LEAD, HOME_BLOCK_TITLE } from './homePageTheme';
import { EXPERT_BLOCK_TOP, EXPERT_CARD_WIDTH } from './homeExpertTheme';
import LatestExpertsIllustration from './LatestExpertsIllustration';

const LATEST_LIMIT = 5;

const CARD_BASE =
  'group flex flex-col items-center rounded-2xl border border-gray-200/90 bg-white text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/80 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:border-sky-700 dark:bg-sky-900 dark:hover:border-sky-500 dark:focus-visible:ring-sky-500/40';

function expertAvatarSrc(expert) {
  if (expert?.avatar) return expert.avatar;
  const user = expert?.user;
  if (user?.avatar) return user.avatar;
  return user?.gender === 'female'
    ? '/images/default/female.png'
    : '/images/default/male.png';
}

function ExpertCardSkeleton({ compact = false }) {
  if (compact) {
    return (
      <li className="min-w-0 animate-pulse" aria-hidden>
        <div className="mx-auto flex w-full max-w-[3rem] flex-col items-center min-[420px]:max-w-[3.25rem]">
          <div className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-sky-800" />
          <div className="mx-auto mt-1.5 h-2 w-full max-w-[2.75rem] rounded bg-gray-100 dark:bg-sky-800" />
        </div>
      </li>
    );
  }
  return (
    <div
      className={`${EXPERT_CARD_WIDTH} shrink-0 ${CARD_BASE} pointer-events-none px-3 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 sm:pt-4`}
      aria-hidden
    >
      <div className="h-[4.25rem] w-[4.25rem] shrink-0 animate-pulse rounded-full bg-gray-200/80 dark:bg-sky-800 sm:h-[4.75rem] sm:w-[4.75rem]" />
      <div className="mt-3 h-3 w-full max-w-[4rem] animate-pulse rounded-md bg-gray-200/70 dark:bg-sky-700" />
      <div className="mt-1.5 h-2.5 w-12 animate-pulse rounded bg-gray-100 dark:bg-sky-800" />
    </div>
  );
}

function LatestExpertCard({ expert, name }) {
  const avatarSrc = expertAvatarSrc(expert);
  const fallbackAvatar =
    expert.user?.gender === 'female'
      ? '/images/default/female.png'
      : '/images/default/male.png';

  return (
    <Link
      href={`/experts/${expert.id}`}
      className={`${EXPERT_CARD_WIDTH} shrink-0 ${CARD_BASE} px-3 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 sm:pt-4`}
      aria-label={`مشاهده پروفایل ${name}`}
    >
      <span className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={name}
          className="h-[4.25rem] w-[4.25rem] rounded-full object-cover ring-2 ring-gray-100 transition group-hover:ring-teal-300/90 dark:ring-sky-700 dark:group-hover:ring-sky-500 sm:h-[4.75rem] sm:w-[4.75rem]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackAvatar;
          }}
        />
        <span
          className="absolute bottom-0.5 left-0.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500 shadow-sm dark:border-sky-900 dark:bg-sky-400"
          title="فعال"
          aria-hidden
        />
      </span>
      <span className="mt-3 w-full text-xs font-semibold leading-snug text-gray-900 line-clamp-2 transition group-hover:text-teal-900 dark:text-sky-100 dark:group-hover:text-sky-50 sm:text-sm">
        {name}
      </span>
    </Link>
  );
}

/** موبایل — آیتم مربعی در ردیف ۵تایی */
function LatestExpertMobileScrollItem({ expert, name }) {
  const avatarSrc = expertAvatarSrc(expert);
  const fallbackAvatar =
    expert.user?.gender === 'female'
      ? '/images/default/female.png'
      : '/images/default/male.png';

  return (
    <li className="min-w-0">
      <Link
        href={`/experts/${expert.id}`}
        className="group flex flex-col items-center gap-1.5 rounded-lg p-0.5 transition hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
        aria-label={`مشاهده پروفایل ${name}`}
      >
        <span className="relative w-full max-w-[3rem] min-[420px]:max-w-[3.25rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt=""
            className="aspect-square w-full rounded-lg object-cover ring-1 ring-gray-200/90 transition group-hover:ring-teal-300 dark:ring-sky-600 dark:group-hover:ring-sky-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackAvatar;
            }}
          />
          <span
            className="absolute bottom-0.5 left-0.5 h-2 w-2 rounded-sm border border-white bg-teal-500 dark:border-sky-900 dark:bg-sky-400"
            aria-hidden
          />
        </span>
        <span className="w-full max-w-[3.25rem] text-center text-[8px] font-semibold leading-tight text-gray-800 line-clamp-2 dark:text-sky-200 min-[420px]:max-w-[3.5rem] min-[420px]:text-[9px]">
          {name}
        </span>
      </Link>
    </li>
  );
}

function LatestExpertsMobileLayout({ city, experts, loading }) {
  const mobileExperts = experts.slice(0, LATEST_LIMIT);

  return (
    <div className="relative flex min-h-[13.5rem] flex-col sm:hidden min-[420px]:min-h-[15rem]">
      <div className="shrink-0 text-right">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-sky-300 min-[420px]:text-[15px]">
          جدیدترین متخصص‌های{' '}
          <span className="font-semibold text-teal-800 dark:text-sky-100">{city.name}</span>
        </p>
      </div>

      {!loading && mobileExperts.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-gray-200 bg-white px-3 py-4 text-xs leading-relaxed text-gray-500 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-400">
          فعلاً تو {city.name} کسی ثبت‌نام نکرده.
        </p>
      ) : (
        <div className="mt-auto pt-3 min-[420px]:pt-4">
          <div className="flex w-full justify-center">
            <LatestExpertsIllustration placement="mobile-stack" />
          </div>

          <ul
            className="mt-3 grid grid-cols-5 gap-2 px-0.5 pb-2 min-[420px]:mt-3.5 min-[420px]:gap-2.5 min-[420px]:pb-3"
            aria-label="فهرست متخصص‌ها"
          >
            {loading
              ? Array.from({ length: LATEST_LIMIT }).map((_, i) => (
                  <ExpertCardSkeleton key={i} compact />
                ))
              : mobileExperts.map((expert) => {
                  const name =
                    getExpertPublicName(expert) ||
                    [expert.user?.firstName, expert.user?.lastName]
                      .filter(Boolean)
                      .join(' ') ||
                    'متخصص';
                  return (
                    <LatestExpertMobileScrollItem key={expert.id} expert={expert} name={name} />
                  );
                })}
          </ul>
        </div>
      )}
    </div>
  );
}

function LatestExpertsDesktopLayout({ city, experts, loading }) {
  return (
    <div className="hidden sm:block">
      <div className="flex items-center gap-3 text-right">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-200/80 dark:bg-slate-800 dark:text-sky-200 dark:ring-sky-700">
          <UserGroupIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className={HOME_BLOCK_TITLE}>متخصص‌ها</h3>
          <p className={HOME_BLOCK_LEAD}>
            جدیدترین متخصص‌های{' '}
            <span className="font-medium text-teal-800 dark:text-sky-200">{city.name}</span>
          </p>
        </div>
      </div>

      <div className="-mx-1 mt-5 px-1 pb-4 sm:pb-5 lg:pb-6">
        {loading ? (
          <div className="flex min-h-[7.5rem] gap-3 overflow-hidden pb-1 sm:gap-3.5">
            {Array.from({ length: LATEST_LIMIT }).map((_, i) => (
              <ExpertCardSkeleton key={i} />
            ))}
          </div>
        ) : experts.length === 0 ? (
          <p className="flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-400">
            فعلاً تو {city.name} کسی ثبت‌نام نکرده — به‌زودی پر می‌شه.
          </p>
        ) : (
          <ul
            className="flex min-h-[7.5rem] list-none gap-3 overflow-x-auto pb-1 scroll-smooth sm:gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/80 dark:[&::-webkit-scrollbar-thumb]:bg-sky-700"
            aria-label="فهرست متخصص‌ها"
          >
            {experts.map((expert) => {
              const name =
                getExpertPublicName(expert) ||
                [expert.user?.firstName, expert.user?.lastName]
                  .filter(Boolean)
                  .join(' ') ||
                'این متخصص';

              return (
                <li key={expert.id} className="shrink-0">
                  <LatestExpertCard expert={expert} name={name} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function HomeLatestExperts({ city, embedded = false }) {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city?.id) {
      setExperts([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetch(API_ENDPOINTS.experts.getLatestForCity(city.id, LATEST_LIMIT))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json.data) ? json.data : [];
        setExperts(list.slice(0, LATEST_LIMIT));
      })
      .catch(() => {
        if (!cancelled) setExperts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city?.id]);

  if (!city?.id) return null;

  const inner = (
    <div
      className={`relative overflow-hidden px-4 pt-5 sm:px-8 sm:pt-7 ${
        embedded ? `${EXPERT_BLOCK_TOP} pb-5 sm:pb-6 lg:pb-7` : 'py-6 sm:py-7'
      }`}
    >
      <LatestExpertsMobileLayout city={city} experts={experts} loading={loading} />
      <LatestExpertsDesktopLayout city={city} experts={experts} loading={loading} />
    </div>
  );

  if (embedded) return inner;

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80 dark:border-sky-800 dark:bg-sky-900 dark:ring-sky-800/60">
        {inner}
      </div>
    </div>
  );
}
