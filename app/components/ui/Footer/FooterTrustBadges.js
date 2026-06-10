'use client';

import { useState } from 'react';
import { FOOTER_TRUST_BADGES } from './footerConfig';

function TrustBadgeImage({ badge, sizeClass }) {
  const sources = [badge.srcWebp, badge.src].filter(Boolean);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || index >= sources.length) {
    return (
      <span
        className={`flex items-center justify-center rounded-md bg-gray-50 text-[9px] text-gray-400 ${sizeClass}`}
      >
        {badge.label}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[index]}
      alt={badge.label}
      className={`object-contain ${sizeClass}`}
      loading="lazy"
      onError={() => {
        if (index + 1 < sources.length) setIndex((i) => i + 1);
        else setFailed(true);
      }}
    />
  );
}

export default function FooterTrustBadges({ className = '' }) {
  return (
    <ul
      className={`flex list-none items-center gap-3 sm:gap-4 ${className}`}
      aria-label="نماد اعتماد الکترونیکی و ساماندهی"
    >
      {FOOTER_TRUST_BADGES.map((badge) => {
        const isEnamad = badge.key === 'enamad';
        const sizeClass = isEnamad
          ? 'h-[3.75rem] w-[3.75rem] sm:h-[4.25rem] sm:w-[4.25rem]'
          : 'h-[3.75rem] w-auto max-w-[5.5rem] sm:h-[4.25rem] sm:max-w-[6.25rem]';
        const isLink = badge.href && badge.href !== '#';

        const inner = <TrustBadgeImage badge={badge} sizeClass={sizeClass} />;

        return (
          <li key={badge.key} className="shrink-0">
            {isLink ? (
              <a
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                title={badge.label}
                className="block rounded-lg opacity-95 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2"
              >
                {inner}
              </a>
            ) : (
              <div title={badge.label} className="rounded-lg">
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
