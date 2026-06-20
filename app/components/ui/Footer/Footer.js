'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import FooterTrustBadges from './FooterTrustBadges';
import {
  FOOTER_CONTACT,
  FOOTER_CUSTOMER_LINKS,
  FOOTER_EXPERT_LINKS,
  FOOTER_QUICK_LINKS,
} from './footerConfig';

const linkClass =
  'text-[13px] leading-6 text-gray-500 transition-colors duration-150 hover:text-teal-600 dark:text-sky-400 dark:hover:text-teal-300';

const headingClass =
  'mb-3 text-[13px] font-semibold tracking-tight text-gray-900 dark:text-sky-100';

function FooterNavGroup({ title, links }) {
  return (
    <nav aria-label={title} className="text-center sm:text-right">
      <h3 className={headingClass}>{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} scroll={false} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterBrand() {
  return (
    <div className="flex flex-col items-center gap-4 sm:items-start">
      <Link
        href="/"
        scroll={false}
        className="inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo_text.jpg"
          alt="پرندیکس"
          className="h-9 w-auto sm:h-10"
        />
      </Link>
      <FooterTrustBadges className="justify-center sm:justify-start" />
    </div>
  );
}

function FooterContact() {
  return (
    <nav aria-label="تماس" className="text-center sm:text-right">
      <h3 className={headingClass}>تماس با ما</h3>
      <ul className="space-y-2.5">
        {FOOTER_CONTACT.map((item) => {
          const Icon =
            item.href.startsWith('tel:') && item.label.startsWith('09')
              ? DevicePhoneMobileIcon
              : item.href.startsWith('tel:')
                ? PhoneIcon
                : GlobeAltIcon;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`${linkClass} inline-flex items-center justify-center gap-2 sm:justify-start`}
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <Icon className="h-4 w-4 shrink-0 text-teal-600/90" strokeWidth={1.75} aria-hidden />
                <span dir={item.dir} className="font-medium text-gray-600 dark:text-sky-300">
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-40 mt-auto hidden w-full border-t border-gray-200/90 bg-white dark:border-sky-800 dark:bg-sky-950 md:block">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-8 sm:py-10 lg:py-11">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
            <div className="col-span-2 lg:col-span-4">
              <FooterBrand />
            </div>

            <div className="lg:col-span-2">
              <FooterNavGroup title="دسترسی سریع" links={FOOTER_QUICK_LINKS} />
            </div>

            <div className="lg:col-span-2">
              <FooterNavGroup title="مشتریان" links={FOOTER_CUSTOMER_LINKS} />
            </div>

            <div className="lg:col-span-2">
              <FooterNavGroup title="متخصصان" links={FOOTER_EXPERT_LINKS} />
            </div>

            <div className="col-span-2 lg:col-span-2">
              <FooterContact />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 py-4 dark:border-sky-800 sm:py-5">
          <p className="text-center text-xs text-gray-400 dark:text-sky-500">
            &copy; {year} پرندیکس · تمامی حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <footer className="relative z-40 hidden w-full border-t border-gray-100 bg-white dark:border-sky-800 dark:bg-sky-950 md:block">
        <div className="container mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <p className="text-center text-xs text-gray-400 dark:text-sky-500">
            &copy; {new Date().getFullYear()} پرندیکس · تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>
    );
  }

  return <PublicFooter />;
}
