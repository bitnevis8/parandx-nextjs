import Link from 'next/link';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { SITE_GUIDE } from '../copy/siteGuideFa';
import {
  HOME_BTN_PRIMARY,
  HOME_CONTAINER,
  HOME_PAGE_TITLE,
} from '../components/home/homePageTheme';

export const metadata = {
  title: 'راهنمای پرندیکس',
  description: 'راهنمای استفاده از پرندیکس — پیدا کردن متخصص، نقشه، دسته‌ها و ثبت پروژه',
};

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersianStep(n) {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function BulletList({ items }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.25} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white pb-12 pt-6 sm:pt-8">
      <div className={`${HOME_CONTAINER} max-w-3xl`}>
        <header className="text-right">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800 ring-1 ring-teal-200/80 sm:text-xs">
            <BookOpenIcon className="h-3.5 w-3.5" aria-hidden />
            {SITE_GUIDE.badge}
          </span>
          <h1 className={`${HOME_PAGE_TITLE} mt-3`}>{SITE_GUIDE.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">{SITE_GUIDE.lead}</p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm ring-1 ring-gray-100/80 sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <UserIcon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="text-base font-bold text-gray-900">{SITE_GUIDE.userSection.title}</h2>
            </div>
            <BulletList items={SITE_GUIDE.userSection.items} />
          </section>

          <section className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm ring-1 ring-gray-100/80 sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <WrenchScrewdriverIcon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="text-base font-bold text-gray-900">{SITE_GUIDE.expertSection.title}</h2>
            </div>
            <BulletList items={SITE_GUIDE.expertSection.items} />
            <Link
              href={SITE_GUIDE.expertSection.ctaHref}
              className={`${HOME_BTN_PRIMARY} mt-4 w-full text-sm`}
            >
              {SITE_GUIDE.expertSection.cta}
            </Link>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">{SITE_GUIDE.pathsTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{SITE_GUIDE.pathsLead}</p>

          <ul className="mt-4 space-y-2">
            {SITE_GUIDE.paths.map((path) => (
              <li key={path.step}>
                <Link
                  href={path.href}
                  className="group flex items-center gap-3 rounded-xl border border-gray-200/90 bg-white px-3 py-3 shadow-sm ring-1 ring-gray-100/80 transition hover:border-teal-200 hover:bg-teal-50/30 sm:px-4"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-teal-200 bg-white text-sm font-bold text-teal-700 transition group-hover:border-teal-400 group-hover:bg-teal-600 group-hover:text-white"
                    aria-hidden
                  >
                    {toPersianStep(path.step)}
                  </span>
                  <span className="min-w-0 flex-1 text-right">
                    <span className="block text-sm font-semibold text-gray-900 group-hover:text-teal-900">
                      {path.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-gray-500 group-hover:text-teal-700/80">
                      {path.hint}
                    </span>
                  </span>
                  <ArrowRightIcon
                    className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-teal-600"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex justify-center sm:justify-start">
          <Link
            href={SITE_GUIDE.homeHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
            {SITE_GUIDE.homeCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
