"use client";
import Image from 'next/image';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PhoneIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from './config/api';

const TYPEWRITER_TEXT = 'چه دنبال کارشناس باشی ، چه دنبال کارفرما، اینجا براحتی به هم می‌رسید.';
/** فاصلهٔ هر حرف هنگام تایپ (میلی‌ثانیه) — عدد کمتر = تایپ سریع‌تر. مثلاً 80 یا 150 */
const TYPE_SPEED = 40;
/** مدت مکث بعد از تمام شدن متن قبل از پاک کردن (میلی‌ثانیه) */
const PAUSE_AFTER_TYPING = 60000;
/** مدت مکث قبل از شروع دوبارهٔ تایپ (میلی‌ثانیه) */
const PAUSE_BEFORE_RESTART = 80;

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isPausing) return;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typewriterIndex < TYPEWRITER_TEXT.length) {
          setTypewriterIndex((i) => i + 1);
        } else {
          setIsPausing(true);
          setTimeout(() => {
            setIsPausing(false);
            setIsDeleting(true);
          }, PAUSE_AFTER_TYPING);
        }
      } else {
        if (typewriterIndex > 0) {
          setTypewriterIndex((i) => i - 1);
        } else {
          setIsDeleting(false);
          setIsPausing(true);
          setTimeout(() => {
            setIsPausing(false);
          }, PAUSE_BEFORE_RESTART);
        }
      }
    }, isDeleting ? TYPE_SPEED / 2 : typewriterIndex === 0 ? 400 : TYPE_SPEED);

    return () => clearTimeout(timeout);
  }, [loading, typewriterIndex, isDeleting, isPausing]);

  useEffect(() => {
    if (loading) setTypewriterIndex(0);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(API_ENDPOINTS.categories.getAll);
        const catData = catRes.ok ? await catRes.json() : { data: [] };
        const mainCats = Array.isArray(catData.data) ? catData.data.filter(c => !c.parentId) : [];
        setCategories(mainCats);

        const expRes = await fetch(API_ENDPOINTS.experts.getAll);
        const expData = expRes.ok ? await expRes.json() : { data: [] };
        const list = Array.isArray(expData.data) ? expData.data : [];
        setExperts(list.slice(0, 8));
      } catch (err) {
        console.error('Error fetching data for homepage:', err);
        setCategories([]);
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 md:py-20 text-center px-3 sm:px-4">
        <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-1 break-words">
            <span className="text-teal-600">پرندیکس</span>؛ پل ارتباطی بین کارشناس و کارفرما
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto min-h-[2.5rem] flex justify-center items-center flex-wrap px-2" dir="rtl">
            <span className="inline-block w-0.5 h-5 sm:h-6 bg-blue-600 animate-pulse ml-0.5 align-middle shrink-0" style={{ animationDuration: '0.8s' }} aria-hidden />
            <span className="inline break-words text-center">{TYPEWRITER_TEXT.slice(0, typewriterIndex)}</span>
          </p>
          {/* لوگو */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <Image
              src="/images/logo_1.png"
              alt="لوگو پرندیکس"
              width={400}
              height={400}
              className="object-contain w-full max-w-[85vw] sm:max-w-[320px] h-auto max-h-40 sm:max-h-52"
              priority
              unoptimized
            />
          </div>
          {/* شماره‌های تماس زیر لوگو */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
            <a
              href="tel:02156956691"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-blue-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <span dir="ltr">۰۲۱-۵۶۹۵۶۶۹۱</span>
              <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" aria-hidden />
            </a>
            <a
              href="tel:09380910512"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-blue-600 px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto text-sm sm:text-base"
            >
              <span dir="ltr">۰۹۳۸-۰۹۱۰۵۱۲</span>
              <DevicePhoneMobileIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="container mx-auto px-3 sm:px-4 py-10 sm:py-16 max-w-[100vw]">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">دسته‌بندی خدمات</h2>
          <p className="text-sm sm:text-base text-gray-600 px-2">خدمات مورد نیاز خود را از دسته‌بندی‌های زیر انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug ?? category.id}`} scroll={false} className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 p-4 sm:p-6 text-center border-2 border-transparent hover:border-blue-200">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{category.icon}</div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors break-words">
                  {category.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  {category.subcategories?.length || 0} زیردسته
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/categories" scroll={false} className="bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors inline-block">
            مشاهده همه دسته‌بندی‌ها
          </Link>
        </div>
      </div>

      {/* Top Experts Section */}
      {experts.length > 0 && (
        <div className="bg-white py-10 sm:py-16">
          <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">برترین متخصصان</h2>
              <p className="text-sm sm:text-base text-gray-600">متخصصان تایید شده و با تجربه</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {experts.map((expert) => (
                <Link key={expert.id} href={`/experts/${expert.id}`} scroll={false} className="group">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                      <span className="text-white text-lg sm:text-2xl font-bold">
                        {expert.user?.firstName?.charAt(0) || 'م'}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                      {expert.user?.firstName} {expert.user?.lastName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{expert.experience != null ? `${expert.experience} سال` : '—'}</p>
                    <p className="text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2 truncate">{expert.location || '—'}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/experts" scroll={false} className="bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors inline-block">
                مشاهده همه متخصصان
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-3 sm:px-4 py-10 sm:py-16 max-w-[100vw]">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">چرا پرندیکس؟</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">متخصصان تایید شده</h3>
            <p className="text-sm sm:text-base text-gray-600">همه متخصصان ما بررسی و تایید شده‌اند</p>
          </div>

          <div className="text-center px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">سریع و آسان</h3>
            <p className="text-sm sm:text-base text-gray-600">در کمترین زمان بهترین متخصص را پیدا کنید</p>
          </div>

          <div className="text-center px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">محلی و نزدیک</h3>
            <p className="text-sm sm:text-base text-gray-600">متخصصان محلی شهر پرند</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-10 sm:py-16 px-3 sm:px-4">
        <div className="container mx-auto text-center max-w-[100vw]">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">آماده شروع هستید؟</h2>
          <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-lg px-2">همین حالا درخواست خود را ثبت کنید و بهترین متخصصان را پیدا کنید</p>
          <Link href="/requests/new" scroll={false} className="bg-white text-blue-600 px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors inline-block">
            ثبت درخواست رایگان
          </Link>
        </div>
      </div>
    </div>
  );
}
