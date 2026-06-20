'use client';

import { useState } from 'react';
import {
  GOODS_PAVEMENT_SHIFT_Y,
  GOODS_STONE_WIDTH_OVERSCAN,
  goodsStoneEdgeFadeMaskStyle,
} from './homeGoodsTheme';

/** سنگ‌فرش پرسپکتیو — زیر باکس ثبت‌نام (z پایین‌تر)، لبه جلو داخل باکس */
export const GOODS_STONE_IMAGE = '/images/ston.png';

export default function GoodsStonePavement() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className="goods-stone-pavement pointer-events-none absolute bottom-0 z-[1] hidden h-[21rem] overflow-hidden group-data-[pavement-active=true]:block sm:h-[23rem] md:h-[25rem]"
      style={{
        width: `calc(var(--goods-card-row-width, 0px) * ${1 + GOODS_STONE_WIDTH_OVERSCAN * 2})`,
        left: `calc(var(--goods-card-row-offset, 0px) - var(--goods-card-row-width, 0px) * ${GOODS_STONE_WIDTH_OVERSCAN})`,
        transform: `translateY(${GOODS_PAVEMENT_SHIFT_Y})`,
      }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={GOODS_STONE_IMAGE}
        alt=""
        className="absolute bottom-0 left-1/2 h-[125%] w-full max-w-none -translate-x-1/2 object-contain object-bottom select-none mix-blend-screen"
        style={goodsStoneEdgeFadeMaskStyle}
        onError={() => setHidden(true)}
      />
    </div>
  );
}
