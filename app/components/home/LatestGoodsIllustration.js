'use client';

import { useState } from 'react';

const LATEST_GOODS_IMAGE = '/images/latest-goods-illustration.webp';

const MOBILE_IMG_H = 'h-[10rem] min-[420px]:h-[11.5rem]';

export default function LatestGoodsIllustration({ placement = 'signup' }) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  if (placement === 'mobile-stack') {
    return (
      <div className="relative mx-auto sm:hidden" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LATEST_GOODS_IMAGE}
          alt=""
          className={`${MOBILE_IMG_H} pointer-events-none w-auto max-w-[min(100%,12.8rem)] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)] min-[420px]:max-w-[14.4rem]`}
          onError={() => setHidden(true)}
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
        src={LATEST_GOODS_IMAGE}
        alt=""
        className="h-full w-full object-contain object-bottom"
        onError={() => setHidden(true)}
      />
    </div>
  );
}
