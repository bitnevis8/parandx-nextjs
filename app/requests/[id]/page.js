"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../hooks/useRole";
import RequestBidForm from "../../components/requests/RequestBidForm";
import RequestBidsList from "../../components/requests/RequestBidsList";
import RequestChatLink from "../../components/requests/RequestChatLink";
import RequestLocationPreview from "../../components/requests/RequestLocationPreview";
import RequestStatusControl from "../../components/requests/RequestStatusControl";
import { BidStatusBadge, RequestStatusBadge } from "../../components/requests/RequestStatusBadge";
import { cardClass, primaryBtnClass } from "../../components/ui/dashboard/DashboardUi";
import {
  ProfileViewCompactField,
  ProfileViewSection,
  ProfileViewTextBlock,
  profileViewLocationGridClass,
} from "../../components/ui/dashboard/ProfileViewUi";
import {
  fetchAuth,
  formatPriceToman,
  formatRequestDate,
  getCategoryIcon,
  getCategoryLabel,
  isGoodsRequest,
  isGoodsSupplyRequest,
} from "../../utils/requestFormat";
import { extractMapPoint } from "../../utils/mapShareLinks";

export default function RequestDetailPage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const { canAccessExpert, canAccessMerchant } = useRole();
  const expertAccess = canAccessExpert();
  const merchantAccess = canAccessMerchant();
  const [request, setRequest] = useState(null);
  const [city, setCity] = useState(null);
  const [myBid, setMyBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isGoods = isGoodsRequest(request);
  const isSupply = isGoodsSupplyRequest(request);

  const canBidAsViewer = useMemo(() => {
    if (!request) return false;
    if (!isGoodsRequest(request)) return expertAccess;
    if (request.requestKind === "supply") {
      const uid = user?.id ?? user?.userId;
      return Boolean(isAuthenticated) && Number(uid) !== Number(request.userId);
    }
    return merchantAccess;
  }, [request, isAuthenticated, user, expertAccess, merchantAccess]);

  const loadRequest = useCallback(async () => {
    if (!params?.id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_ENDPOINTS.requests.getById(params.id));
      const result = await res.json();
      if (!result.success) {
        setError(result.message || "درخواست یافت نشد");
        setRequest(null);
        return;
      }
      setRequest(result.data);
    } catch {
      setError("خطا در بارگذاری");
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  const loadMyBid = useCallback(async () => {
    if (!params?.id || !canBidAsViewer) return;
    try {
      const res = await fetch(API_ENDPOINTS.bids.getMy(params.id), fetchAuth);
      const result = await res.json();
      if (result.success) setMyBid(result.data);
    } catch {
      setMyBid(null);
    }
  }, [params?.id, canBidAsViewer]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  useEffect(() => {
    loadMyBid();
  }, [loadMyBid]);

  useEffect(() => {
    if (!request?.cityId) {
      setCity(null);
      return;
    }
    fetch(`${API_ENDPOINTS.cities.getById(request.cityId)}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setCity(result.data);
      })
      .catch(() => setCity(null));
  }, [request?.cityId]);

  const theme = useMemo(
    () =>
      isSupply
        ? {
            accentText: "text-violet-700",
            accentBg: "bg-violet-100",
            accentBorder: "border-violet-100",
            headerFrom: "from-violet-50/70",
            spinner: "border-violet-600",
            backHover: "hover:text-violet-700",
          }
        : isGoods
          ? {
              accentText: "text-amber-700",
              accentBg: "bg-amber-100",
              accentBorder: "border-amber-100",
              headerFrom: "from-amber-50/70",
              spinner: "border-amber-600",
              backHover: "hover:text-amber-700",
            }
          : {
              accentText: "text-teal-700",
              accentBg: "bg-teal-100",
              accentBorder: "border-teal-100",
              headerFrom: "from-teal-50/70",
              spinner: "border-teal-600",
              backHover: "hover:text-teal-700",
            },
    [isGoods, isSupply]
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <div className={`h-10 w-10 animate-spin rounded-full border-2 ${theme.spinner} border-t-transparent`} />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-700">{error || "درخواست یافت نشد"}</p>
        <Link href="/" className={`${primaryBtnClass} mt-4 inline-flex`}>
          بازگشت
        </Link>
      </div>
    );
  }

  const currentUserIdResolved = user?.id ?? user?.userId;
  const isOwnerResolved = Number(currentUserIdResolved) === Number(request.userId);
  const isBidderViewer = canBidAsViewer && !isOwnerResolved;
  const catLabel = getCategoryLabel(request);
  const catIcon = getCategoryIcon(request);
  const mapPoint = extractMapPoint(request.locationData);
  const mapSelection = {
    sectionId: request.locationData?.sectionId || "",
    neighborhoodId: request.locationData?.neighborhoodId || "",
  };

  const backHref = isOwnerResolved
    ? isSupply
      ? "/dashboard/goods/my-supplies"
      : isGoods
        ? "/dashboard/goods/my-needs"
        : "/dashboard/customer/active-requests"
    : isSupply
      ? "/dashboard/goods/buy-opportunities"
      : isGoods
        ? "/dashboard/goods/opportunities"
        : "/dashboard/expert/requests";
  const backLabel = isOwnerResolved
    ? isSupply
      ? "عرضه‌های من"
      : isGoods
        ? "نیازهای من"
        : "درخواست‌های من"
    : isSupply
      ? "فرصت‌های خرید"
      : isGoods
        ? "فرصت‌های فروش"
        : "درخواست‌های متخصصی";

  const detailLabel = isSupply
    ? "جزئیات عرضه کالا"
    : isGoods
      ? "جزئیات نیاز کالا"
      : "جزئیات درخواست";
  const locationSectionTitle = isGoods ? (isSupply ? "محل تحویل / انبار" : "محل تحویل") : "محل انجام کار";
  const bidsTitle = isSupply
    ? "پیشنهادهای خرید"
    : isGoods
      ? "پیشنهادهای فروشگاه‌ها"
      : "پیشنهادها";
  const bidsHint = isSupply
    ? "پیشنهاد خریداران را مقایسه کنید و بهترین گزینه را انتخاب کنید."
    : isGoods
      ? "قیمت و موجودی را مقایسه کنید و بهترین گزینه را انتخاب کنید."
      : `${(request.bids?.length || 0).toLocaleString("fa-IR")} پیشنهاد دریافت شده`;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-3 py-4 sm:px-4">
          <Link
            href={backHref}
            className={`inline-flex items-center gap-1 text-sm text-gray-600 ${theme.backHover}`}
          >
            <ArrowRightIcon className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-3 pt-6 sm:px-4">
        <div className={`${cardClass} overflow-hidden`}>
          <div className={`border-b ${theme.accentBorder} bg-gradient-to-bl ${theme.headerFrom} to-white px-4 py-5 sm:px-6`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={`text-xs font-medium ${theme.accentText}`}>{detailLabel}</p>
                <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{request.title}</h1>
                {catLabel !== "—" ? (
                  <p className={`mt-2 inline-flex items-center gap-1 rounded-full border ${theme.accentBorder} bg-white px-3 py-1 text-xs text-gray-700`}>
                    <TagIcon className={`h-3.5 w-3.5 ${theme.accentText}`} />
                    {catIcon} {catLabel}
                  </p>
                ) : null}
              </div>
              <RequestStatusBadge status={request.status} />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <ProfileViewSection title={isSupply ? "اطلاعات عرضه" : isGoods ? "اطلاعات نیاز" : "اطلاعات درخواست"}>
              <div className={profileViewLocationGridClass}>
                <ProfileViewCompactField
                  label="تاریخ ثبت"
                  value={formatRequestDate(request.createdAt)}
                />
                <ProfileViewCompactField
                  label={isSupply ? "مهلت / آماده‌بودن" : isGoods ? "مهلت تحویل" : "مهلت"}
                  value={formatRequestDate(request.deadline)}
                />
                <ProfileViewCompactField label="موقعیت" value={request.location} />
                {!isOwnerResolved && (
                  <ProfileViewCompactField
                    label={isSupply ? "عرضه‌کننده" : isGoods ? "خریدار" : "مشتری"}
                    value={
                      request.customer
                        ? `${request.customer.firstName || ""} ${request.customer.lastName || ""}`.trim()
                        : null
                    }
                  />
                )}
              </div>
              <div className="mt-4">
                <ProfileViewTextBlock label="توضیحات" value={request.description} />
              </div>
            </ProfileViewSection>

            <ProfileViewSection title={locationSectionTitle} className="mt-6">
              <RequestLocationPreview
                city={city}
                locationData={request.locationData}
                locationLabel={request.location}
                mapSelection={mapSelection}
              />
              {!mapPoint && request.location ? (
                <p className="mt-2 text-sm text-gray-600">{request.location}</p>
              ) : null}
              {request.locationData?.addressLine ? (
                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-medium text-gray-800">آدرس متنی: </span>
                  {request.locationData.addressLine}
                </p>
              ) : null}
            </ProfileViewSection>
          </div>
        </div>

        {isOwnerResolved ? (
          <div className={`${cardClass} p-4 sm:p-5`}>
            <RequestStatusControl
              requestId={request.id}
              status={request.status}
              onUpdated={(updated) => setRequest(updated)}
            />
          </div>
        ) : null}

        {isOwnerResolved ? (
          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:px-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accentText}`}>
                <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">{bidsTitle}</h2>
                <p className="text-xs text-gray-500">{bidsHint}</p>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <RequestBidsList
                bids={request.bids || []}
                requestId={request.id}
                editable
                marketplaceType={request.marketplaceType}
                supplyMode={isSupply}
                onBidUpdated={loadRequest}
              />
            </div>
          </div>
        ) : null}

        {isBidderViewer && myBid ? (
          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accentText}`}>
                  <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-base font-bold text-gray-900">پیشنهاد و گفتگو</h2>
                  <p className="text-xs text-gray-500">
                    {isSupply
                      ? "با عرضه‌کننده درباره قیمت و تحویل صحبت کنید"
                      : isGoods
                        ? "با خریدار درباره قیمت و تحویل صحبت کنید"
                        : "با کاربر درباره این درخواست صحبت کنید"}
                  </p>
                </div>
              </div>
              <RequestChatLink
                otherUserId={request.customer?.id}
                requestId={request.id}
                label={isSupply ? "گفتگو با عرضه‌کننده" : isGoods ? "گفتگو با خریدار" : "گفتگو با کاربر"}
              />
            </div>
            <div className="p-4 sm:p-5">
              <SubmittedBidCard bid={myBid} isGoods={isGoods} isSupply={isSupply} />
            </div>
          </div>
        ) : null}

        {isBidderViewer && !myBid && request.status === "open" ? (
          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:px-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accentText}`}>
                <PaperAirplaneIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {isSupply ? "ارسال پیشنهاد خرید" : isGoods ? "ارسال پیشنهاد قیمت" : "ارسال پیشنهاد"}
                </h2>
                <p className="text-xs text-gray-500">
                  {isSupply
                    ? "قیمت پیشنهادی و شرایط خرید را بنویسید."
                    : isGoods
                      ? "قیمت، موجودی و زمان تحویل را بنویسید."
                      : "توضیحات خود را بنویسید؛ قیمت پیشنهادی اختیاری است."}
                </p>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <RequestBidForm
                requestId={request.id}
                goodsMode={isGoods}
                supplyMode={isSupply}
                onSubmitted={(bid) => {
                  setMyBid(bid);
                  loadRequest();
                }}
              />
            </div>
          </div>
        ) : null}

        {isBidderViewer && !myBid && request.status !== "open" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {isSupply
              ? "این عرضه دیگر باز نیست و امکان ارسال پیشنهاد خرید جدید وجود ندارد."
              : isGoods
                ? "این نیاز دیگر باز نیست و امکان ارسال پیشنهاد قیمت جدید وجود ندارد."
                : "این درخواست دیگر باز نیست و امکان ارسال پیشنهاد جدید وجود ندارد."}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SubmittedBidCard({ bid, isGoods = false, isSupply = false }) {
  const priceLabel = formatPriceToman(bid.price);
  const priceClass = isSupply ? "text-violet-800" : isGoods ? "text-amber-800" : "text-teal-800";

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-emerald-900">پیشنهاد شما ثبت شده است</p>
        <BidStatusBadge status={bid.status} />
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
        {bid.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {priceLabel ? (
          <span className={`font-semibold ${priceClass}`}>
            {priceLabel}
          </span>
        ) : (
          <span className="text-gray-500">بدون قیمت پیشنهادی</span>
        )}
        <span className="text-xs text-gray-500">
          {formatRequestDate(bid.createdAt)}
        </span>
      </div>
    </div>
  );
}
