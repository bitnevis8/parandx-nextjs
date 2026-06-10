'use client';

import Link from 'next/link';

export default function HomeCtaSection({ cityName = 'شهر شما' }) {
  return (
    <section className="py-10 sm:py-14 px-3 sm:px-4 bg-gradient-to-l from-teal-600 to-cyan-600">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">آماده شروع هستید؟</h2>
          <p className="text-teal-50 text-sm sm:text-lg">همین حالا به جمع پرندیکس بپیوندید</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2">دنبال متخصصید؟</h3>
            <p className="text-teal-50 text-sm mb-4">یه درخواست بذارید یا توی خدمات بگردید؛ همون که به‌دردتون می‌خوره رو انتخاب کنید.</p>
            <Link
              href="/requests/new"
              scroll={false}
              className="inline-block bg-white text-teal-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors"
            >
              ثبت کار و دریافت پیشنهاد
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2">خودتون متخصصید؟</h3>
            <p className="text-teal-50 text-sm mb-4">رایگان ثبت‌نام کنید و توی {cityName} معرفی بشید — مستقیم سفارش بگیرید.</p>
            <Link
              href="/auth"
              scroll={false}
              className="inline-block bg-white text-teal-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors"
            >
              ثبت‌نام رایگان
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
