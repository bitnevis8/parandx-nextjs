'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import { getExpertPublicName } from '../../utils/expertProfileUtils';
import { HOME_BLOCK_LEAD, HOME_BLOCK_TITLE } from './homePageTheme';
import { EXPERT_BLOCK_TOP, EXPERT_CARD_WIDTH } from './homeExpertTheme';

const LATEST_LIMIT = 5;

const CARD_BASE =
  'group flex flex-col items-center rounded-2xl border border-gray-200/90 bg-white text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/80 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40';

function expertAvatarSrc(expert) {
  if (expert?.avatar) return expert.avatar;
  const user = expert?.user;
  if (user?.avatar) return user.avatar;
  return user?.gender === 'female'
    ? '/images/default/female.png'
    : '/images/default/male.png';
}

function ExpertCardSkeleton() {
  return (
    <div
      className={`${EXPERT_CARD_WIDTH} shrink-0 ${CARD_BASE} pointer-events-none px-3 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 sm:pt-4`}
      aria-hidden
    >
      <div className="h-[4.25rem] w-[4.25rem] shrink-0 animate-pulse rounded-full bg-gray-200/80 sm:h-[4.75rem] sm:w-[4.75rem]" />
      <div className="mt-3 h-3 w-full max-w-[4rem] animate-pulse rounded-md bg-gray-200/70" />
      <div className="mt-1.5 h-2.5 w-12 animate-pulse rounded bg-gray-100" />
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
          className="h-[4.25rem] w-[4.25rem] rounded-full object-cover ring-2 ring-gray-100 transition group-hover:ring-teal-300/90 sm:h-[4.75rem] sm:w-[4.75rem]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackAvatar;
          }}
        />
        <span
          className="absolute bottom-0.5 left-0.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500 shadow-sm"
          title="فعال"
          aria-hidden
        />
      </span>
      <span className="mt-3 w-full text-xs font-semibold leading-snug text-gray-900 line-clamp-2 transition group-hover:text-teal-900 sm:text-sm">
        {name}
      </span>
    </Link>
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
      className={`relative px-4 pt-6 sm:px-8 sm:pt-7 ${
        embedded ? `${EXPERT_BLOCK_TOP} pb-2 sm:pb-3 lg:pb-4` : 'py-6 sm:py-7'
      }`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-right">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-200/80">
            <UserGroupIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className={HOME_BLOCK_TITLE}>تازه‌پیوسته‌ها</h3>
            <p className={HOME_BLOCK_LEAD}>
              جدیدترین متخصص‌های{' '}
              <span className="font-medium text-teal-800">{city.name}</span>
            </p>
          </div>
        </div>

        <div className="-mx-1 px-1 pb-4 sm:pb-5 lg:pb-6">
          {loading ? (
            <div className="flex min-h-[7.5rem] gap-3 overflow-hidden pb-1 sm:gap-3.5">
              {Array.from({ length: LATEST_LIMIT }).map((_, i) => (
                <ExpertCardSkeleton key={i} />
              ))}
            </div>
          ) : experts.length === 0 ? (
            <p className="flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500">
              فعلاً تو {city.name} کسی ثبت‌نام نکرده — به‌زودی پر می‌شه.
            </p>
          ) : (
            <ul
              className="flex min-h-[7.5rem] list-none gap-3 overflow-x-auto pb-1 scroll-smooth sm:gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/80"
              aria-label="فهرست تازه‌پیوسته‌ها"
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
    </div>
  );

  if (embedded) return inner;

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
        {inner}
      </div>
    </div>
  );
}
