'use client';

import Link from 'next/link';
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  MapPinIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import {
  countPendingBids,
  formatRequestDate,
  getCategoryIcon,
  getCategoryLabel,
} from '../../utils/requestFormat';
import { BidStatusBadge, RequestStatusBadge } from './RequestStatusBadge';
import RequestChatLink from './RequestChatLink';
import { formatPriceToman } from '../../utils/requestFormat';
import { ghostBtnClass } from '../ui/dashboard/DashboardUi';

export default function RequestListCard({ request, detailHref, myBid, showChat = false }) {
  const catLabel = getCategoryLabel(request);
  const catIcon = getCategoryIcon(request);
  const pendingBids = countPendingBids(request);
  const totalBids = request?.bids?.length || 0;
  const href = detailHref || `/requests/${request.id}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-teal-200 hover:shadow-md">
      <div className="border-b border-gray-100 bg-gradient-to-bl from-gray-50/80 to-white px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <RequestStatusBadge status={request.status} />
              {myBid ? (
                <>
                  <BidStatusBadge status={myBid.status} />
                  {formatPriceToman(myBid.price) ? (
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                      {formatPriceToman(myBid.price)}
                    </span>
                  ) : null}
                </>
              ) : totalBids > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 ring-1 ring-inset ring-teal-200">
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" aria-hidden />
                  {totalBids} پیشنهاد
                  {pendingBids > 0 ? ` (${pendingBids} جدید)` : ''}
                </span>
              ) : request.status === 'open' ? (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                  در انتظار پیشنهاد
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 text-base font-bold text-gray-900 sm:text-lg">{request.title}</h2>
            {catLabel !== '—' ? (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600">
                <TagIcon className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                {catIcon} {catLabel}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
          {request.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDaysIcon className="h-3.5 w-3.5" aria-hidden />
            ثبت: {formatRequestDate(request.createdAt)}
          </span>
          {request.deadline ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDaysIcon className="h-3.5 w-3.5 text-amber-600" aria-hidden />
              مهلت: {formatRequestDate(request.deadline)}
            </span>
          ) : null}
          {request.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5 text-teal-600" aria-hidden />
              {request.location}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-400">شناسه #{request.id}</p>
          <div className="flex flex-wrap items-center gap-2">
            {showChat && myBid ? (
              <RequestChatLink
                otherUserId={request.userId}
                requestId={request.id}
                label="گفتگو با کارفرما"
                compact
              />
            ) : null}
            <Link href={href} className={`${ghostBtnClass} gap-1 text-teal-700`}>
              مشاهده جزئیات
              <ChevronLeftIcon className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
