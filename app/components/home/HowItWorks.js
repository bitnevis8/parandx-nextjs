'use client';

import {
  DocumentPlusIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    icon: DocumentPlusIcon,
    title: 'درخواست ثبت کنید',
    description: 'بگید چه خدمتی می‌خواید و کار رو توضیح بدید.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'پیشنهاد دریافت کنید',
    description: 'چند تا پیشنهاد قیمت و زمان براتون می‌رسه.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'همون که دوس دارید رو انتخاب کنید',
    description: 'با خیال راحت؛ قیمت، تجربه و نظرات رو ببینید و تصمیم بگیرید.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-10 sm:py-14 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-3 sm:px-4 max-w-5xl">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">چطور کار می‌کند؟</h2>
          <p className="text-sm sm:text-base text-gray-600">سه قدم ساده تا برسید به همون متخصصی که می‌خواید</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative text-center p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white hover:border-teal-200 hover:shadow-sm transition-all"
              >
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 flex items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold">
                  {index + 1}
                </span>
                <div className="flex justify-center mb-4 mt-2">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-teal-600" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
