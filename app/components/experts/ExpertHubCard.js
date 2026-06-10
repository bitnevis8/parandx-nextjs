'use client';

import Link from 'next/link';
import {
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  LinkIcon,
  MapPinIcon,
  NewspaperIcon,
  PhotoIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import { getExpertPublicName } from '../../utils/expertProfileUtils';
import { HOME_BADGE, HOME_BTN_SECONDARY } from '../home/homePageTheme';

function expertAvatarSrc(expert) {
  const user = expert?.user;
  if (user?.avatar) return user.avatar;
  return user?.gender === 'female'
    ? '/images/default/female.png'
    : '/images/default/male.png';
}

const CAPABILITY_CHIPS = [
  { Icon: NewspaperIcon, label: 'پست' },
  { Icon: LinkIcon, label: 'شبکه' },
  { Icon: ChatBubbleLeftEllipsisIcon, label: 'پیام' },
  { Icon: PhotoIcon, label: 'نمونه‌کار' },
  { Icon: MapPinIcon, label: 'نقشه' },
];

export default function ExpertHubCard({ expert, featured = false }) {
  const name =
    getExpertPublicName(expert) ||
    [expert?.user?.firstName, expert?.user?.lastName].filter(Boolean).join(' ') ||
    'متخصص';

  const avatarSrc = expertAvatarSrc(expert);
  const fallback =
    expert?.user?.gender === 'female'
      ? '/images/default/female.png'
      : '/images/default/male.png';

  const categories = expert?.categories || [];

  return (
    <article
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? 'border-teal-200/90 ring-teal-100/80 hover:border-teal-400'
          : 'border-gray-200/90 ring-gray-100/80 hover:border-teal-300/80'
      }`}
    >
      <Link href={`/experts/${expert.id}`} className="group flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt=""
            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-teal-300 sm:h-16 sm:w-16"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
          <div className="min-w-0 flex-1 text-right">
            <h3 className="font-bold leading-snug text-gray-900 group-hover:text-teal-900 sm:text-base">
              {name}
            </h3>
            {expert?.bio ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                {expert.bio}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {CAPABILITY_CHIPS.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200/80"
            >
              <Icon className="h-3 w-3 text-teal-600/80" aria-hidden />
              {label}
            </span>
          ))}
        </div>

        {categories.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((cat) => (
              <span key={cat.id} className={HOME_BADGE}>
                {cat.title}
              </span>
            ))}
          </div>
        ) : null}
      </Link>

      <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
        <Link href={`/experts/${expert.id}`} className={`${HOME_BTN_SECONDARY} w-full text-sm`}>
          <UserGroupIcon className="h-4 w-4 text-teal-600" aria-hidden />
          {featured ? EXPERTS_HUB.viewProfileNetwork : EXPERTS_HUB.viewProfile}
          <ArrowLeftIcon className="h-4 w-4 text-teal-600" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function ExpertHubCardSkeleton() {
  return (
    <div
      className="h-full min-h-[12rem] animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
      aria-hidden
    />
  );
}
