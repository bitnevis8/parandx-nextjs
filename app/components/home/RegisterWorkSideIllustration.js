'use client';

import { useState } from 'react';
import { REQUEST_INTRO } from '../../copy/friendlyFa';

/**
 * تصویر سمت راست بلوک ثبت کار (آینهٔ illustration تازه‌پیوسته‌ها که چپ است)
 * مسیر: public/images/home-register-work.webp | .png
 */
export default function RegisterWorkSideIllustration({ className = '' }) {
  const [src, setSrc] = useState(REQUEST_INTRO.illustrationSrc);
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return (
      <div
        className={`pointer-events-none absolute bottom-6 start-4 z-0 hidden max-w-[9rem] rounded-xl border border-dashed border-teal-200/70 bg-teal-50/50 px-2 py-6 text-center lg:flex lg:items-end ${className}`}
        aria-hidden
      >
        <p className="text-[10px] leading-relaxed text-teal-800/60">
          تصویر
          <br />
          <span dir="ltr" className="font-mono">
            home-register-work.webp
          </span>
        </p>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute bottom-0 start-0 z-0 hidden w-[min(48%,20.7rem)] max-w-[23rem] items-end justify-center px-2 pb-4 pt-10 sm:start-4 sm:px-4 sm:pb-6 sm:pt-12 lg:flex ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-auto max-h-[min(92%,24.15rem)] w-full object-contain object-bottom"
        onError={() => {
          if (src === REQUEST_INTRO.illustrationSrc) {
            setSrc(REQUEST_INTRO.illustrationSrcFallback);
          } else {
            setHidden(true);
          }
        }}
      />
    </div>
  );
}
