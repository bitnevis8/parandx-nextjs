'use client';

import { useState } from 'react';

const LATEST_EXPERTS_IMAGE_WEBP = '/images/latest-experts-illustration.webp';
const LATEST_EXPERTS_IMAGE_PNG = '/images/latest-experts-illustration.png';

/** ارتفاع موبایل — ۲۰٪ کوچک‌تر از نسخه قبلی */
const MOBILE_IMG_H = 'h-[10rem] min-[420px]:h-[11.5rem]';
/**
 * placement:
 * - mobile-stack — بالای لیست آواتارها (فقط موبایل)
 * - signup — بالای باکس ثبت‌نام (دسکتاپ/تبلت)
 */
export default function LatestExpertsIllustration({ placement = 'signup' }) {
  const [src, setSrc] = useState(LATEST_EXPERTS_IMAGE_WEBP);
  const [hidden, setHidden] = useState(false);

  const handleError = () => {
    if (src === LATEST_EXPERTS_IMAGE_WEBP) setSrc(LATEST_EXPERTS_IMAGE_PNG);
    else setHidden(true);
  };

  if (hidden) return null;

  if (placement === 'mobile-stack') {
    return (
      <div className="relative mx-auto sm:hidden" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className={`${MOBILE_IMG_H} pointer-events-none w-auto max-w-[min(100%,12.8rem)] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)] min-[420px]:max-w-[14.4rem]`}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute bottom-full left-1/2 z-20 hidden h-[11.5rem] w-[10.5rem] -translate-x-1/2 items-end justify-center sm:flex sm:end-8 sm:left-auto sm:h-[14rem] sm:w-[13rem] sm:translate-x-0 md:h-[15.5rem] md:w-[15rem] lg:end-10 lg:h-[17.5rem] lg:w-[17rem]"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-contain object-bottom"
        onError={handleError}
      />
    </div>
  );
}
