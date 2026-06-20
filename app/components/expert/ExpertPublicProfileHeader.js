'use client';

import Link from 'next/link';
import { ArrowRightIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ExpertConnectionButton from './ExpertConnectionButton';
import ExpertAvatarPresence from './ExpertAvatarPresence';
import ExpertHeaderProfileMeta from './ExpertHeaderProfileMeta';
import { ContactNumberInline } from '../ui/ContactChannelToggles';
import {
  getAccountTypeLabel,
  getExpertPublicName,
  getPrimaryExpertContactPhone,
  normalizeAccountType,
} from '../../utils/expertProfileUtils';

const MSG_BTN =
  'inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-slate-50 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100 dark:hover:border-teal-600 dark:hover:bg-sky-800 sm:h-9 sm:text-xs';

export default function ExpertPublicProfileHeader({
  expert,
  sections = [],
  activeSection,
  onSectionClick,
}) {
  const user = expert?.user;
  const publicName = getExpertPublicName(expert) || 'متخصص';
  const isApproved = expert?.status === 'approved';
  const accountLabel = getAccountTypeLabel(normalizeAccountType(expert?.accountType, expert));

  const primaryContact = getPrimaryExpertContactPhone(
    expert?.contactMobiles,
    expert?.contactPhones,
    user?.mobile
  );
  const showMessage = Boolean(user?.id);
  const primaryContactEntry = primaryContact
    ? {
        number: primaryContact.number,
        channels: primaryContact.channels,
        label: primaryContact.label,
      }
    : null;
  const showSectionNav = sections.length > 0 && typeof onSectionClick === 'function';

  return (
    <header className="bg-slate-100/80 dark:bg-sky-950">
      <div className="relative isolate overflow-hidden bg-gradient-to-bl from-teal-900 via-teal-700 to-emerald-600">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto flex h-[5rem] max-w-4xl items-start px-4 pt-3 sm:h-[6.5rem] sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/25"
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
            بازگشت
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-sky-800 dark:bg-sky-900 dark:shadow-none sm:-mt-11">
          <div className="relative px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
            <div
              className="absolute left-3 top-3 z-10 flex w-[7.25rem] flex-col gap-1.5 sm:left-4 sm:top-4 sm:w-[8rem]"
              aria-label="اقدامات"
            >
              <ExpertConnectionButton expertId={expert?.id} compact className="w-full" />
              {showMessage ? (
                <Link href={`/dashboard/messages/${user.id}`} className={MSG_BTN}>
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">ارسال پیام</span>
                </Link>
              ) : null}
            </div>

            <div className="flex items-start gap-3 pe-[7.5rem] sm:gap-4 sm:pe-[8.5rem]">
              <ExpertAvatarPresence
                expert={expert}
                user={user}
                alt={publicName}
                verified={isApproved}
              />
              <div className="min-w-0 flex-1 pt-0.5">
                <h1 className="text-base font-bold leading-snug text-slate-900 dark:text-sky-50 sm:text-xl">
                  {publicName}
                  {accountLabel ? (
                    <span className="ms-1.5 text-[0.72em] font-medium text-slate-500 dark:text-sky-400">
                      ({accountLabel})
                    </span>
                  ) : null}
                </h1>

                {primaryContactEntry ? (
                  <ContactNumberInline
                    className="mt-1.5"
                    item={primaryContactEntry}
                    linkable
                    isLandline={primaryContact.type === 'phone'}
                  />
                ) : null}
              </div>
            </div>

            <ExpertHeaderProfileMeta expert={expert} user={user} publicName={publicName} />
          </div>

          {showSectionNav ? (
            <nav
              className="border-t border-slate-100 bg-slate-50/80 px-2 py-2 dark:border-sky-800 dark:bg-sky-950/80 sm:px-4"
              aria-label="بخش‌های پروفایل"
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
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-sky-300 dark:hover:bg-sky-800 dark:hover:text-sky-50'
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
