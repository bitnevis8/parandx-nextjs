'use client';

import { GOODS_NEED_INTRO, GOODS_SUPPLY_INTRO } from '../../copy/goodsPageFa';
import GoodsTradePathConnector from './GoodsTradePathConnector';
import GoodsTradePathPanel from './GoodsTradePathPanel';

export default function HomeGoodsTradePathsSection() {
  return (
    <section
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-gray-100/80 sm:rounded-3xl"
      aria-label="ثبت نیاز و عرضه کالا"
    >
      <GoodsTradePathPanel
        id="home-path-need"
        headlineId="home-goods-need-headline"
        variant="need"
        intro={GOODS_NEED_INTRO}
        href="/goods/needs/new"
        imageSide="start"
      />

      <GoodsTradePathConnector />

      <GoodsTradePathPanel
        id="home-path-supply"
        headlineId="home-goods-supply-headline"
        variant="supply"
        intro={GOODS_SUPPLY_INTRO}
        href="/goods/supplies/new"
        imageSide="end"
      />
    </section>
  );
}
