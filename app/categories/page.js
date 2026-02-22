"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "../config/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [expertsByCategory, setExpertsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, expRes] = await Promise.all([
          fetch(API_ENDPOINTS.categories.getAll),
          fetch(API_ENDPOINTS.experts.getAll),
        ]);

        if (!catRes.ok) throw new Error(`HTTP error! status: ${catRes.status}`);
        const catData = await catRes.json();
        if (!catData.success) {
          setError("خطا در دریافت دسته‌بندی‌ها");
          return;
        }
        const cats = catData.data || [];
        setCategories(cats);

        let allExperts = [];
        if (expRes.ok) {
          const expData = await expRes.json();
          allExperts = expData.data || [];
        }

        const byCategory = {};
        cats.forEach((category) => {
          const mainId = category.id;
          const subIds = (category.subcategories || []).map((s) => s.id);
          const ids = [mainId, ...subIds];
          const list = allExperts.filter(
            (expert) =>
              expert.categories &&
              expert.categories.some((c) => ids.includes(c.id))
          );
          byCategory[category.id] = list.slice(0, 5);
        });
        setExpertsByCategory(byCategory);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("خطا در اتصال به سرور");
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">خطا</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-[100vw]">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            دسته‌بندی خدمات
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            هر دسته را ببینید؛ تخصص‌ها و ۵ متخصص هر حوزه
          </p>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => {
              const experts = expertsByCategory[category.id] || [];
              return (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-stretch min-h-0">
                    {/* راست: عکس (آیکون) و عنوان کارت */}
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 lg:min-w-[240px] border-b lg:border-b-0 lg:border-l border-gray-100 hover:bg-gray-50/50 transition-colors shrink-0"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center text-2xl sm:text-3xl shrink-0 border border-teal-100">
                        {category.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors break-words">
                          {category.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {category.subcategories?.length || 0} تخصص
                        </p>
                      </div>
                    </Link>

                    {/* وسط: تخصص‌ها (زیردسته‌ها) */}
                    <div className="flex-1 flex items-center p-4 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-l border-gray-100 bg-gray-50/30 min-w-0 overflow-hidden">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
                        {(category.subcategories || []).length > 0 ? (
                          category.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${category.slug}`}
                              className="inline-flex items-center gap-1 bg-white border border-teal-100 text-teal-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-teal-50 hover:border-teal-200 transition-colors"
                            >
                              <span>{sub.icon}</span>
                              <span className="truncate max-w-[120px] sm:max-w-none">{sub.title}</span>
                              {sub.expertCount != null && (
                                <span className="text-teal-500 text-xs hidden sm:inline">
                                  ({sub.expertCount})
                                </span>
                              )}
                            </Link>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">
                            زیردسته‌ای ثبت نشده
                          </span>
                        )}
                      </div>
                    </div>

                    {/* چپ: ۵ متخصص این دسته */}
                    <div className="flex items-center gap-2 p-4 sm:p-5 lg:p-6 lg:min-w-[280px] shrink-0 overflow-x-auto">
                      <div className="flex flex-wrap items-center justify-end gap-2 w-full min-w-0">
                        {experts.length > 0 ? (
                          <>
                            {experts.map((expert) => (
                              <Link
                                key={expert.id}
                                href={`/experts/${expert.id}`}
                                className="flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 hover:border-teal-200 hover:shadow-sm transition-all min-w-0 max-w-full shrink-0"
                              >
                                {expert.user?.avatar ? (
                                  <img
                                    src={expert.user.avatar}
                                    alt=""
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                                    {expert.user?.firstName?.charAt(0) || "م"}
                                  </div>
                                )}
                                <span className="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[80px] sm:max-w-[100px]">
                                  {expert.user?.firstName} {expert.user?.lastName}
                                </span>
                              </Link>
                            ))}
                            <Link
                              href={`/experts?category=${encodeURIComponent(category.slug)}`}
                              className="text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline shrink-0"
                            >
                              همه →
                            </Link>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs sm:text-sm">
                            متخصصی ثبت نشده
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              دسته‌بندی موجود نیست
            </h2>
            <p className="text-gray-600">
              هنوز دسته‌بندی‌ای تعریف نشده است.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
