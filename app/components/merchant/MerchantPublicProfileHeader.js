'use client';

import Link from 'next/link';
import { ArrowRightIcon, ChatBubbleLeftRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { defaultMerchantStoreName } from '../../utils/merchantProfileUtils';
import {
  merchantStorePagePath,
  merchantStorePageUrlFull,
  isMerchantStoreOpen,
} from '../../utils/merchantDisplayUtils';
import MerchantRatingBadge from '../goods/MerchantRatingBadge';
import { ContactNumberInline } from '../ui/ContactChannelToggles';
import { getPrimaryExpertContactPhone } from '../../utils/expertProfileUtils';

const MSG_BTN =
  'inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-amber-200 bg-white px-2.5 text-[11px] font-semibold text-amber-900 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 sm:h-9 sm:text-xs';

export default function MerchantPublicProfileHeader({
  merchant,
  sections = [],
  activeSection,
  onSectionClick,
}) {
  const user = merchant?.user;
  const storeName = defaultMerchantStoreName(merchant);
  const storePath = merchantStorePagePath(merchant);
  const storeUrlFull = merchantStorePageUrlFull(merchant);
  const isOpen = isMerchantStoreOpen(merchant);
  const isApproved = merchant?.status === 'approved';

  const primaryContact = getPrimaryExpertContactPhone(
    merchant?.contactMobiles,
    merchant?.contactPhones,
    user?.mobile
  );

  const showSectionNav = sections.length > 0 && typeof onSectionClick === 'function';

  return (
    <header className="bg-amber-50/80">
      <div className="relative isolate overflow-hidden bg-gradient-to-bl from-amber-950 via-amber-800 to-orange-700">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto flex h-[5rem] max-w-4xl items-start justify-between gap-3 px-4 pt-3 sm:h-[6.5rem] sm:px-6">
          <Link
            href="/goods"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/25"
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
            بازار کالا
          </Link>
          {merchant?.city?.name ? (
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs text-white/95 backdrop-blur-md">
              📍 {merchant.city.name}
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-10 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-md sm:-mt-11">
          <div className="relative px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
            <div
              className="absolute left-3 top-3 z-10 flex w-[7.25rem] flex-col gap-1.5 sm:left-4 sm:top-4 sm:w-[8rem]"
              aria-label="تماس"
            >
              {primaryContact ? (
                <ContactNumberInline
                  item={{
                    number: primaryContact.number,
                    channels: primaryContact.channels,
                  }}
                  label={primaryContact.label}
                  linkable
                  showLabel={false}
                  className="w-full rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-center"
                />
              ) : (
                <span className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-[11px] text-gray-400 sm:h-9">
                  بدون شماره
                </span>
              )}
              {user?.id ? (
                <Link href={`/dashboard/messages/${user.id}`} className={MSG_BTN}>
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">پیام</span>
                </Link>
              ) : null}
            </div>

            <div className="flex items-start gap-3 pe-[7.5rem] sm:gap-4 sm:pe-[8.5rem]">
              <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 text-2xl font-bold text-amber-700 shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
                {merchant?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={merchant.logo} alt={storeName} className="h-full w-full object-cover" />
                ) : (
                  storeName.charAt(0)
                )}
                <span
                  className={`absolute bottom-1 left-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                    isOpen ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  title={isOpen ? 'باز' : 'بسته'}
                  aria-hidden
                />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h1 className="text-base font-bold leading-snug text-slate-900 sm:text-xl">
                  {storeName}
                  {!isApproved ? (
                    <span className="ms-1.5 text-[0.72em] font-medium text-amber-700">
                      (در انتظار تأیید)
                    </span>
                  ) : null}
                </h1>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <MerchantRatingBadge merchant={merchant} variant="inline" />
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isOpen
                        ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
                        : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                    }`}
                  >
                    {isOpen ? 'الان باز است' : 'بسته'}
                  </span>
                </div>

                <p
                  className="mt-2 inline-flex max-w-full items-center gap-1 truncate rounded-lg bg-amber-50/80 px-2 py-1 font-mono text-[11px] text-amber-900 ring-1 ring-amber-100 sm:text-xs"
                  dir="ltr"
                  title={storeUrlFull}
                >
                  <GlobeAltIcon className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                  {storePath}
                </p>
              </div>
            </div>
          </div>

          {showSectionNav ? (
            <nav
              className="border-t border-amber-50 bg-amber-50/50 px-2 py-2 sm:px-4"
              aria-label="بخش‌های فروشگاه"
            >
              <ul className="flex gap-1.5 overflow-x-auto scrollbar-thin sm:flex-wrap sm:justify-center">
                {sections.map(({ id, label }) => {
                  const active = activeSection === id;
                  return (
                    <li key={id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => onSectionClick(id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
