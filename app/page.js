"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from './config/api';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(API_ENDPOINTS.categories.getAll);
        const catData = await catRes.json();
        const mainCats = (catData.data || []).filter(c => !c.parentId);
        setCategories(mainCats);

        const expRes = await fetch(API_ENDPOINTS.experts.getAll);
        const expData = await expRes.json();
        // نمایش تمام متخصصان (نه فقط تایید شده‌ها) تا 8 تا
        const topExperts = (expData.data || []).slice(0, 8);
        setExperts(topExperts);
      } catch (err) {
        console.error('Error fetching data for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            به <span className="text-blue-600">پرندیکس</span> خوش آمدید
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            بهترین پلتفرم برای پیدا کردن متخصصان خدمات در شهر پرند
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experts" scroll={false} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              مشاهده متخصصان
            </Link>
            <Link href="/requests/new" scroll={false} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              ثبت درخواست جدید
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">دسته‌بندی خدمات</h2>
          <p className="text-gray-600">خدمات مورد نیاز خود را از دسته‌بندی‌های زیر انتخاب کنید</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} scroll={false} className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center border-2 border-transparent hover:border-blue-200">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {category.subcategories?.length || 0} زیردسته
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/categories" scroll={false} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
            مشاهده همه دسته‌بندی‌ها
          </Link>
        </div>
      </div>

      {/* Top Experts Section */}
      {experts.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">برترین متخصصان</h2>
              <p className="text-gray-600">متخصصان تایید شده و با تجربه</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
              {experts.map((expert) => (
                <Link key={expert.id} href={`/experts/${expert.id}`} scroll={false} className="group">
                  <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">
                        {expert.user?.firstName?.charAt(0) || 'م'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {expert.user?.firstName} {expert.user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{expert.experience} سال تجربه</p>
                    <p className="text-sm text-blue-600 mt-2">{expert.location}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/experts" scroll={false} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
                مشاهده همه متخصصان
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">چرا پرندیکس؟</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">متخصصان تایید شده</h3>
            <p className="text-gray-600">همه متخصصان ما بررسی و تایید شده‌اند</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">سریع و آسان</h3>
            <p className="text-gray-600">در کمترین زمان بهترین متخصص را پیدا کنید</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">محلی و نزدیک</h3>
            <p className="text-gray-600">متخصصان محلی شهر پرند</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">آماده شروع هستید؟</h2>
          <p className="text-blue-100 mb-8 text-lg">همین حالا درخواست خود را ثبت کنید و بهترین متخصصان را پیدا کنید</p>
          <Link href="/requests/new" scroll={false} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            ثبت درخواست رایگان
          </Link>
        </div>
      </div>
    </div>
  );
}
