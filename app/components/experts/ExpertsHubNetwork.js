'use client';

import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  LinkIcon,
  NewspaperIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { EXPERTS_HUB } from '../../copy/expertsPageFa';
import { HOME_BTN_PRIMARY, HOME_CARD_SHELL, HOME_PAGE_TITLE, HOME_BLOCK_LEAD } from '../home/homePageTheme';

const STEP_ICONS = [UserPlusIcon, LinkIcon, NewspaperIcon, HandThumbUpIcon];

export default function ExpertsHubNetwork() {
  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="experts-network-title">
      <div className={`${HOME_CARD_SHELL} overflow-hidden`}>
        <div className="border-b border-gray-200/90 bg-gradient-to-l from-slate-50 via-white to-teal-50/40 px-5 py-6 sm:px-8 sm:py-8">
          <h2 id="experts-network-title" className={HOME_PAGE_TITLE}>
            {EXPERTS_HUB.networkTitle}
          </h2>
          <p className={`${HOME_BLOCK_LEAD} mt-2 max-w-3xl`}>{EXPERTS_HUB.networkLead}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-8 lg:grid-cols-4">
          {EXPERTS_HUB.networkSteps.map((step, index) => {
            const Icon = STEP_ICONS[index] || ChatBubbleLeftRightIcon;
            return (
              <div
                key={step.title}
                className="relative rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-right"
              >
                <span className="absolute -top-2.5 start-4 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <Icon className="mt-2 h-8 w-8 text-teal-600" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-3 text-sm font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 bg-teal-50/50 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
          <p className="text-sm text-gray-600">
            پیام مستقیم، پست در پروفایل و درخواست ارتباط — همه در یک بستر.
          </p>
          <Link href={EXPERTS_HUB.networkExpertPath} className={`${HOME_BTN_PRIMARY} shrink-0`}>
            {EXPERTS_HUB.networkExpertCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
