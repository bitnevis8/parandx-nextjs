'use client';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import {
  formatPriceToman,
  formatRequestDate,
  getBidderDisplayName,
  getBidderUserId,
} from '../../utils/requestFormat';
import { BidStatusBadge } from './RequestStatusBadge';
import { BidStatusControl } from './RequestStatusControl';
import RequestChatLink from './RequestChatLink';

export default function RequestBidsList({
  bids = [],
  requestId,
  editable = false,
  onBidUpdated,
  marketplaceType = 'services',
  supplyMode = false,
}) {
  const isGoods = marketplaceType === 'goods';
  const emptyHint = supplyMode
    ? 'به‌محض اینکه خریداران پیشنهاد بفرستند، اینجا می‌بینید.'
    : isGoods
      ? 'به‌محض اینکه فروشگاه‌ها پیشنهاد قیمت بفرستند، اینجا می‌بینید.'
      : 'به‌محض اینکه پیشنهاد بیاد، همین‌جا می‌بینیدش.';

  if (!bids.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-700">هنوز پیشنهادی دریافت نشده</p>
        <p className="mt-1 text-xs text-gray-500">{emptyHint}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bids.map((bid) => {
        const bidderName = getBidderDisplayName(bid);
        const bidderUserId = getBidderUserId(bid);
        const priceLabel = formatPriceToman(bid.price);

        return (
          <li
            key={bid.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
              bid.status === 'accepted'
                ? 'border-emerald-200 ring-1 ring-emerald-100'
                : 'border-gray-200'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
                    supplyMode
                      ? 'bg-violet-50 text-violet-700 ring-violet-100'
                      : isGoods
                        ? 'bg-amber-50 text-amber-700 ring-amber-100'
                        : 'bg-teal-50 text-teal-700 ring-teal-100'
                  }`}
                >
                  <UserCircleIcon className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{bidderName}</p>
                  {!isGoods && bid.expert?.experience ? (
                    <p className="mt-0.5 text-xs text-gray-500">{bid.expert.experience}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-gray-400">
                    {formatRequestDate(bid.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!editable ? <BidStatusBadge status={bid.status} /> : null}
                <RequestChatLink
                  otherUserId={bidderUserId}
                  requestId={requestId}
                  compact
                  label={supplyMode ? 'گفتگو با خریدار' : isGoods ? 'گفتگو با فروشگاه' : 'گفتگو با متخصص'}
                />
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {bid.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
              {priceLabel ? (
                <span
                  className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
                    supplyMode ? 'bg-violet-50 text-violet-800' : isGoods ? 'bg-amber-50 text-amber-800' : 'bg-teal-50 text-teal-800'
                  }`}
                >
                  {priceLabel}
                </span>
              ) : (
                <span className="text-xs text-gray-500">قیمت پیشنهادی اعلام نشده</span>
              )}
            </div>

            {editable ? (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                <p className="mb-2 text-xs font-medium text-gray-700">مدیریت وضعیت پیشنهاد</p>
                <BidStatusControl
                  bidId={bid.id}
                  status={bid.status}
                  compact
                  onUpdated={() => onBidUpdated?.()}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
