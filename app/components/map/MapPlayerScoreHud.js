'use client';

import { useMemo, useState } from 'react';
import {
  BuildingStorefrontIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import {
  resolveMapPlayerIdentitySummary,
  resolveMapPlayerScoreBars,
} from '../../utils/mapPlayerHudUtils';

export const MAP_PLAYER_SCORE_MIN = 1;
export const MAP_PLAYER_SCORE_MAX = 100;

const BAR_ICONS = {
  member: UserIcon,
  expert: WrenchScrewdriverIcon,
  merchant: BuildingStorefrontIcon,
};

export function clampPlayerScore(value, fallback = 88) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(MAP_PLAYER_SCORE_MAX, Math.max(MAP_PLAYER_SCORE_MIN, Math.round(numeric)));
}

function resolveAvatarSrc(user) {
  if (user?.avatar) return user.avatar;
  if (user?.gender === 'female') return '/images/default/female.png';
  return '/images/default/male.png';
}

function resolveDisplayName(user) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return fullName || 'بازیکن نمونه';
}

function MapPlayerScoreBarRow({ bar }) {
  const Icon = BAR_ICONS[bar.id] || UserIcon;
  const score = clampPlayerScore(bar.score);

  return (
    <div
      className="flex items-center gap-1 sm:gap-1.5"
      aria-label={`${bar.label} — امتیاز ${score} از ${MAP_PLAYER_SCORE_MAX}`}
    >
      <span
        className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center sm:h-5 sm:w-5"
        title={bar.ariaLabel}
      >
        <Icon className={`h-full w-full ${bar.iconClass}`} aria-hidden />
      </span>

      <div className="relative h-3 min-w-0 flex-1 -skew-x-12 overflow-hidden border border-black/70 bg-black/75 shadow-[inset_0_1px_3px_rgba(0,0,0,0.55)] sm:h-3.5">
        <div
          className={`absolute inset-y-0 end-0 transition-[width] duration-500 ease-out ${bar.fillClass}`}
          style={{ width: `${score}%` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_45%,rgba(0,0,0,0.22)_100%)]" />
      </div>

      <span className="w-5 shrink-0 text-center text-[10px] font-black tabular-nums text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:text-[11px]">
        {score}
      </span>
    </div>
  );
}

export default function MapPlayerScoreHud({
  memberScore = 88,
  expertScore = 88,
  merchantScore = 72,
  user: userProp = null,
  className = '',
}) {
  const { user: authUser } = useAuth();
  const user = userProp ?? authUser;
  const [avatarError, setAvatarError] = useState(false);

  const displayName = useMemo(() => resolveDisplayName(user), [user]);
  const avatarSrc = useMemo(() => resolveAvatarSrc(user), [user]);
  const scoreBars = useMemo(
    () =>
      resolveMapPlayerScoreBars(user, {
        memberScore,
        expertScore,
        merchantScore,
      }),
    [user, memberScore, expertScore, merchantScore]
  );
  const identitySummary = useMemo(() => resolveMapPlayerIdentitySummary(user), [user]);
  const initials = useMemo(() => {
    const first = user?.firstName?.charAt(0) || 'ن';
    const last = user?.lastName?.charAt(0) || '';
    return `${first}${last}`.trim();
  }, [user]);

  return (
    <div
      className={`pointer-events-none absolute top-3 start-3 z-[1003] flex items-stretch gap-2 sm:gap-2.5 ${className}`.trim()}
      aria-label={`${displayName} — ${identitySummary}`}
    >
      <div className="relative shrink-0 self-center">
        <div className="relative h-[3.75rem] w-[3.75rem] overflow-hidden rounded-sm border-2 border-white/90 bg-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:h-[4.25rem] sm:w-[4.25rem]">
          {!avatarError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt={displayName}
              className="h-full w-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-700 to-teal-900 text-sm font-black text-white">
              {initials}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-w-[9rem] flex-col justify-center gap-1.5 sm:min-w-[11rem]">
        <p className="truncate text-[10px] font-black uppercase tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:text-[11px]">
          {displayName}
        </p>

        <div className="flex flex-col gap-1 sm:gap-1.5">
          {scoreBars.map((bar) => (
            <MapPlayerScoreBarRow key={bar.id} bar={bar} />
          ))}
        </div>
      </div>
    </div>
  );
}
