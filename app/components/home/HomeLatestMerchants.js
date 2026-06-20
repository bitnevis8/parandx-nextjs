'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import GoodsMerchantCard, {
  GoodsMerchantCardSkeleton,
  STORE_CARD_SCROLL_WIDTH,
} from '../goods/GoodsMerchantCard';
import { GOODS_BLOCK_TOP, goodsMerchantEdgeFadeMaskStyle } from './homeGoodsTheme';

const LATEST_LIMIT = 5;
const PAVEMENT_STAGE_SELECTOR = '[data-goods-pavement-stage]';

function syncPavementLayout(cardRowEl) {
  const stage = cardRowEl?.closest(PAVEMENT_STAGE_SELECTOR);
  if (!stage || !cardRowEl) return;

  const stageRect = stage.getBoundingClientRect();
  const rowRect = cardRowEl.getBoundingClientRect();

  stage.style.setProperty('--goods-card-row-width', `${rowRect.width}px`);
  stage.style.setProperty('--goods-card-row-offset', `${rowRect.left - stageRect.left}px`);
  stage.dataset.pavementActive = 'true';
}

function clearPavementLayout(stage) {
  if (!stage) return;
  stage.style.removeProperty('--goods-card-row-width');
  stage.style.removeProperty('--goods-card-row-offset');
  delete stage.dataset.pavementActive;
}

export default function HomeLatestMerchants({ city, embedded = false, pavementStage = false }) {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const cardRowRef = useRef(null);

  useEffect(() => {
    if (!city?.id) {
      setMerchants([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetch(API_ENDPOINTS.merchants.getBrowse(city.id, null, LATEST_LIMIT))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json.data) ? json.data : [];
        setMerchants(list.slice(0, LATEST_LIMIT));
      })
      .catch(() => {
        if (!cancelled) setMerchants([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city?.id]);

  useLayoutEffect(() => {
    const row = cardRowRef.current;
    const stage = row?.closest(PAVEMENT_STAGE_SELECTOR);

    if (!pavementStage || !row || merchants.length === 0) {
      clearPavementLayout(stage);
      return undefined;
    }

    const update = () => syncPavementLayout(row);
    update();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    observer?.observe(row);
    window.addEventListener('resize', update);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      clearPavementLayout(stage);
    };
  }, [pavementStage, merchants.length, loading]);

  if (!city?.id) return null;

  const inner = (
    <div
      className={`relative z-[60] ${
        embedded
          ? pavementStage
            ? 'pb-0 pt-0'
            : `${GOODS_BLOCK_TOP} px-4 pb-2 pt-6 sm:px-8 sm:pb-3 sm:pt-7 lg:pb-4`
          : 'px-4 py-6 sm:px-8 sm:py-7'
      }`}
    >
        <div className={pavementStage ? '-mx-1 px-1 pb-0' : '-mx-1 px-1 pb-4 sm:pb-5 lg:pb-6'}>
          {loading ? (
            <div className="relative z-10 flex min-h-[13.25rem] gap-3 overflow-hidden pb-1 sm:min-h-[14.75rem] sm:gap-3.5">
              {Array.from({ length: LATEST_LIMIT }).map((_, i) => (
                <GoodsMerchantCardSkeleton
                  key={i}
                  className={`${STORE_CARD_SCROLL_WIDTH} shrink-0`}
                />
              ))}
            </div>
          ) : merchants.length === 0 ? (
            <p className="flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500">
              فعلاً تو {city.name} فروشگاهی ثبت نشده — به‌زودی پر می‌شه.
            </p>
          ) : (
            <div
              ref={cardRowRef}
              className={`relative z-[60] w-fit max-w-full ${
                pavementStage ? '-translate-y-[50px]' : ''
              }`}
              style={pavementStage ? goodsMerchantEdgeFadeMaskStyle : undefined}
            >
              <ul
                className="relative z-[60] inline-flex min-h-[13.25rem] list-none items-end gap-3 overflow-x-auto pb-0 scroll-smooth sm:min-h-[14.75rem] sm:gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/80"
                aria-label="فهرست تازه‌پیوسته‌ها"
              >
                {merchants.map((merchant) => (
                  <li
                    key={merchant.id}
                    className={`relative z-[60] ${STORE_CARD_SCROLL_WIDTH} shrink-0`}
                  >
                    <GoodsMerchantCard
                      merchant={merchant}
                      className={
                        pavementStage
                          ? 'relative z-[60] shadow-md ring-gray-300/60'
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
    </div>
  );

  if (embedded) return inner;

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
        {inner}
      </div>
    </div>
  );
}
