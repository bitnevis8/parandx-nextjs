'use client';

import Link from 'next/link';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import { HOME_BTN_PRIMARY, HOME_CARD_SHELL, HOME_PAGE_TITLE, HOME_BLOCK_LEAD } from '../home/homePageTheme';

export default function ExpertsHubCustomer() {
  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="experts-customer-title">
      <div className={`${HOME_CARD_SHELL} flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
        <div className="min-w-0 flex-1 text-right">
          <h2 id="experts-customer-title" className={HOME_PAGE_TITLE}>
            {EXPERTS_HUB.customerTitle}
          </h2>
          <p className={`${HOME_BLOCK_LEAD} mt-2`}>{EXPERTS_HUB.customerLead}</p>
          <ol className="mt-4 space-y-2 text-sm text-gray-700">
            {EXPERTS_HUB.customerSteps.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <Link href="/requests/new" className={`${HOME_BTN_PRIMARY} shrink-0 sm:px-8`}>
          <ClipboardDocumentListIcon className="h-5 w-5" aria-hidden />
          {EXPERTS_HUB.customerCta}
        </Link>
      </div>
    </section>
  );
}
