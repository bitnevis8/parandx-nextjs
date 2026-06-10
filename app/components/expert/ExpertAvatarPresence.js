'use client';

import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { getPresenceStatusMeta } from '../../utils/expertProfileUtils';

function defaultAvatarSrc(user) {
  return user?.gender === 'female'
    ? '/images/default/female.png'
    : '/images/default/male.png';
}

export default function ExpertAvatarPresence({
  expert,
  user,
  alt,
  verified = false,
  className = '',
  imgClassName = 'h-20 w-20 sm:h-[6.5rem] sm:w-[6.5rem]',
}) {
  const presence = getPresenceStatusMeta(expert?.presenceStatus);
  const src = expert?.avatar || user?.avatar || defaultAvatarSrc(user);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      role="img"
      aria-label={`${alt}${verified ? ' — تأیید‌شده' : ''} — وضعیت ${presence.label}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`rounded-2xl border-[3px] border-white bg-slate-100 object-cover shadow-md ring-2 ${imgClassName} ${presence.ringClass}`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultAvatarSrc(user);
        }}
      />

      {verified ? (
        <span
          className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white shadow ring-2 ring-white sm:h-7 sm:w-7"
          title="متخصص تأیید‌شده"
        >
          <CheckBadgeIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
        </span>
      ) : null}

      <span
        className={`absolute bottom-0 left-0 h-3.5 w-3.5 rounded-full border-2 border-white sm:h-4 sm:w-4 ${presence.dotClass} ${
          presence.pulse ? 'animate-pulse' : ''
        }`}
        title={presence.label}
        aria-hidden
      />
    </div>
  );
}
