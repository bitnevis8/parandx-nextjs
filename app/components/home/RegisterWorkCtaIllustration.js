'use client';

import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { REQUEST_INTRO } from '../../copy/friendlyFa';

/**
 * تصویر شفاف بالای دکمه ثبت کار (دسکتاپ).
 * فایل: public/images/home-register-work.webp | .png
 * پیشنهاد: PNG/WebP با پس‌زمینه شفاف، حدود ۵۶۰×۴۲۰px
 */
export default function RegisterWorkCtaIllustration({ className = '' }) {
  const [src, setSrc] = useState(REQUEST_INTRO.illustrationSrc);
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div
        className={`mx-auto flex max-w-xs flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-teal-200/70 bg-teal-50/40 px-4 py-8 text-center dark:border-sky-700 dark:bg-sky-950/40 ${className}`}
        aria-hidden
      >
        <PhotoIcon className="h-8 w-8 text-teal-300 dark:text-sky-600" />
        <p className="text-[11px] font-semibold text-teal-800/70 dark:text-sky-300/70">
          جای تصویر ثبت کار
        </p>
        <p className="font-mono text-[10px] text-teal-700/60 dark:text-sky-400/60" dir="ltr">
          public/images/home-register-work.webp
        </p>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none mx-auto flex w-full max-w-sm items-end justify-center px-2 ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-auto max-h-[11.5rem] w-full object-contain object-bottom opacity-95 [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)] dark:brightness-110 dark:opacity-90 dark:saturate-90 sm:max-h-[12.5rem] lg:max-h-[13.5rem]"
        onError={() => {
          if (src === REQUEST_INTRO.illustrationSrc) {
            setSrc(REQUEST_INTRO.illustrationSrcFallback);
          } else {
            setMissing(true);
          }
        }}
      />
    </div>
  );
}
