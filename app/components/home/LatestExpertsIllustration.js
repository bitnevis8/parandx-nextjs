'use client';

import { useState } from 'react';

const LATEST_EXPERTS_IMAGE_WEBP = '/images/latest-experts-illustration.webp';
const LATEST_EXPERTS_IMAGE_PNG = '/images/latest-experts-illustration.png';

/** چسبیده به بالای باکس سبز / هم‌عرض ستون دکمهٔ ثبت‌نام (۱۷rem) */
export default function LatestExpertsIllustration() {
  const [src, setSrc] = useState(LATEST_EXPERTS_IMAGE_WEBP);
  const [hidden, setHidden] = useState(false);

  const handleError = () => {
    if (src === LATEST_EXPERTS_IMAGE_WEBP) setSrc(LATEST_EXPERTS_IMAGE_PNG);
    else setHidden(true);
  };

  if (hidden) return null;

  return (
    <div
      className="pointer-events-none absolute bottom-full left-1/2 z-20 flex h-[11.5rem] w-[10.5rem] -translate-x-1/2 items-end justify-center sm:end-8 sm:left-auto sm:h-[14rem] sm:w-[13rem] sm:translate-x-0 md:h-[15.5rem] md:w-[15rem] lg:end-10 lg:h-[17.5rem] lg:w-[17rem]"
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
