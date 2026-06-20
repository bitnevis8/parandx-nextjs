'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  DevicePhoneMobileIcon,
  MapPinIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../../config/api';
import { DIVAR_LISTING_DETAIL } from '../../../copy/divarPageFa';
import HomePageSkeleton from '../../../components/home/HomePageSkeleton';
import { HOME_CONTAINER, HOME_MAIN_TOP } from '../../../components/home/homePageTheme';
import {
  formatListingPrice,
  getListingSellerLabel,
  getListingThumb,
} from '../../../utils/listingUtils';

export default function DivarListingDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.listings.getById(id), { credentials: 'include' });
        const json = res.ok ? await res.json() : { data: null };
        setListing(json.data || null);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (!listing) {
    return (
      <div className={`${HOME_CONTAINER} ${HOME_MAIN_TOP} min-h-[50vh] text-right`}>
        <p className="text-sm text-gray-600">آگهی یافت نشد.</p>
        <Link href="/divar" className="mt-4 inline-block text-sm font-semibold text-violet-700">
          بازگشت به دیوار
        </Link>
      </div>
    );
  }

  const thumb = getListingThumb(listing.media);
  const sellerMobile = listing.seller?.mobile;
  const isSold = listing.status === 'sold';

  return (
    <div className={`${HOME_CONTAINER} ${HOME_MAIN_TOP} min-h-screen pb-16 text-right`}>
      <Link
        href={
          listing.subCategory?.slug
            ? `/divar/categories/${listing.subCategory.slug}`
            : '/divar'
        }
        className="mb-6 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
      >
        ← {DIVAR_LISTING_DETAIL.backLabel}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
          <div className="aspect-[4/3] w-full bg-gray-100">
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-gray-300">
                {listing.subCategory?.icon || '📦'}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm ring-1 ring-gray-100/80 sm:p-6">
            {isSold ? (
              <span className="mb-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {DIVAR_LISTING_DETAIL.soldBadge}
              </span>
            ) : null}

            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{listing.title}</h1>
            <p className="mt-3 text-2xl font-bold text-violet-700">{formatListingPrice(listing.fixedPrice)}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="inline-flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-violet-600" aria-hidden />
                {listing.subCategory?.title || listing.category?.title}
              </p>
              {listing.city?.name ? (
                <p className="inline-flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-violet-600" aria-hidden />
                  {DIVAR_LISTING_DETAIL.postedIn}: {listing.city.name}
                </p>
              ) : null}
              <p className="inline-flex items-center gap-2">
                <DevicePhoneMobileIcon className="h-4 w-4 text-violet-600" aria-hidden />
                {getListingSellerLabel(listing)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm ring-1 ring-gray-100/80 sm:p-6">
            <h2 className="text-sm font-bold text-gray-900">{DIVAR_LISTING_DETAIL.contactTitle}</h2>
            {sellerMobile ? (
              <a
                href={`tel:${sellerMobile}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                {DIVAR_LISTING_DETAIL.callSeller}: {sellerMobile}
              </a>
            ) : (
              <p className="mt-2 text-sm text-gray-500">شماره تماس در دسترس نیست.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm ring-1 ring-gray-100/80 sm:p-6">
        <h2 className="text-sm font-bold text-gray-900">توضیحات</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {listing.description}
        </p>
      </div>
    </div>
  );
}
