'use client';

import Link from 'next/link';
import { PhoneIcon, DevicePhoneMobileIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function TrustSection() {
  return (
    <section className="py-8 sm:py-10 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-3 text-gray-700">
            <ShieldCheckIcon className="w-8 h-8 text-teal-600 shrink-0" />
            <div className="text-right">
              <p className="font-semibold text-sm sm:text-base">پشتیبانی و اعتماد</p>
              <p className="text-xs sm:text-sm text-gray-500">پاسخگویی سریع به درخواست‌های شما</p>
            </div>
          </div>

          <Link
            href="https://parandx.com"
            className="flex flex-col items-center justify-center w-[100px] h-[100px] bg-white rounded-xl border border-gray-200 shadow-sm hover:border-teal-300 transition-colors text-center p-2"
            title="نماد اعتماد الکترونیکی"
          >
            <span className="text-teal-600 font-bold text-xs">e-Namad</span>
            <span className="text-gray-500 text-[10px] mt-1">کد: ۷۰۴۲۹۰۶۰</span>
          </Link>

          <div className="flex flex-col gap-2">
            <a
              href="tel:09380910512"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-teal-700 transition-colors"
            >
              <DevicePhoneMobileIcon className="w-5 h-5 text-teal-600 shrink-0" />
              <span dir="ltr">۰۹۳۸-۰۹۱۰۵۱۲</span>
            </a>
            <a
              href="tel:02156956691"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-teal-700 transition-colors"
            >
              <PhoneIcon className="w-5 h-5 text-teal-600 shrink-0" />
              <span dir="ltr">۰۲۱-۵۶۹۵۶۶۹۱</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
