"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, UserCircleIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { API_ENDPOINTS } from "../config/api";

function normalizeForSearch(text) {
  if (text == null) return "";
  return String(text).trim().replace(/\s+/g, " ");
}
function matchesQuery(text, q) {
  const a = normalizeForSearch(text);
  const b = normalizeForSearch(q);
  if (!b) return true;
  return a.includes(b) || a.replace(/\s/g, "").includes(b.replace(/\s/g, ""));
}

export default function CategoriesPage() {
  const router = useRouter();
  const searchWrapRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [expertsByCategory, setExpertsByCategory] = useState({});
  const [allExpertsList, setAllExpertsList] = useState([]); // لیست تخت برای پیشنهاد جستجو
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

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
        const expertIdsSeen = new Set();
        const flatExperts = [];
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
          list.forEach((expert) => {
            if (!expertIdsSeen.has(expert.id)) {
              expertIdsSeen.add(expert.id);
              flatExperts.push(expert);
            }
          });
        });
        setExpertsByCategory(byCategory);
        setAllExpertsList(flatExperts);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("خطا در اتصال به سرور");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchCategoriesFlat = useMemo(() => {
    const flat = [];
    categories.forEach((main) => {
      flat.push({ type: "main", id: main.id, title: main.title, slug: main.slug, icon: main.icon });
      (main.subcategories || []).forEach((sub) => {
        flat.push({ type: "sub", id: sub.id, title: sub.title, slug: sub.slug, parentSlug: main.slug, icon: sub.icon });
      });
    });
    return flat;
  }, [categories]);

  const suggestions = useMemo(() => {
    const q = normalizeForSearch(searchQuery);
    if (!q || q.length < 1) return { categories: [], experts: [] };
    const catMatches = searchCategoriesFlat
      .filter((c) => matchesQuery(c.title, q) || matchesQuery(c.slug, q))
      .slice(0, 6);
    const expMatches = allExpertsList
      .filter(
        (e) =>
          matchesQuery(e.user?.firstName, q) ||
          matchesQuery(e.user?.lastName, q) ||
          matchesQuery(e.bio, q) ||
          matchesQuery([e.user?.firstName, e.user?.lastName].filter(Boolean).join(" "), q)
      )
      .slice(0, 5);
    return { categories: catMatches, experts: expMatches };
  }, [searchQuery, searchCategoriesFlat, allExpertsList]);

  const hasSuggestions = suggestions.categories.length > 0 || suggestions.experts.length > 0;
  const showDropdown = suggestionsOpen && searchQuery.trim().length >= 1;

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery?.trim();
    setSuggestionsOpen(false);
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
          {/* باکس جستجو */}
          <div ref={searchWrapRef} className="w-full max-w-2xl mx-auto mb-4 sm:mb-6 relative">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg ring-1 ring-gray-200/80 hover:ring-teal-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 transition-all duration-200 overflow-visible">
                <label htmlFor="categories-search" className="sr-only">
                  جستجو در خدمات و متخصصان
                </label>
                <input
                  id="categories-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSuggestionsOpen(true)}
                  placeholder="جستجو در خدمات و متخصصان..."
                  className="w-full py-3 sm:py-3.5 pl-20 sm:pl-24 pr-12 sm:pr-14 text-base text-gray-800 placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0 rounded-2xl"
                  dir="rtl"
                  autoComplete="off"
                />
                <div className="absolute right-3 sm:right-4 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500 text-white pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </div>
                <button
                  type="submit"
                  className="absolute left-2 sm:left-3 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  جستجو
                </button>
              </div>
            </form>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden" role="listbox">
                {hasSuggestions ? (
                  <>
                    {suggestions.categories.length > 0 && (
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                          <Squares2X2Icon className="w-4 h-4" /> دسته‌ها و خدمات
                        </span>
                      </div>
                    )}
                    {suggestions.categories.map((c) => (
                      <Link
                        key={c.type === "sub" ? `sub-${c.id}` : `cat-${c.id}`}
                        href={c.parentSlug ? `/categories/${c.parentSlug}` : `/categories/${c.slug || c.id}`}
                        onClick={() => { setSuggestionsOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-right border-b border-gray-50 last:border-b-0"
                        role="option"
                      >
                        <span className="text-lg shrink-0">{c.icon || "📂"}</span>
                        <span className="text-gray-800 font-medium">{c.title}</span>
                      </Link>
                    ))}
                    {suggestions.experts.length > 0 && (
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                          <UserCircleIcon className="w-4 h-4" /> متخصصان
                        </span>
                      </div>
                    )}
                    {suggestions.experts.map((expert) => {
                      const avatar = expert.user?.avatar || (expert.user?.gender === "female" ? "/images/default/female.png" : "/images/default/male.png");
                      return (
                        <Link
                          key={expert.id}
                          href={`/experts/${expert.id}`}
                          onClick={() => { setSuggestionsOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-right border-b border-gray-50 last:border-b-0"
                          role="option"
                        >
                          <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" onError={(e) => { e.target.onerror = null; e.target.src = "/images/default/male.png"; }} />
                          <span className="text-gray-800 font-medium">{expert.user?.firstName || ""} {expert.user?.lastName || ""}</span>
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">نتیجه‌ای یافت نشد</div>
                )}
              </div>
            )}
          </div>

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
          <div className="space-y-6">
            {categories.map((category) => {
              const experts = expertsByCategory[category.id] || [];
              const defaultAvatar = (u) => {
                if (u?.avatar) return u.avatar;
                return u?.gender === "female" ? "/images/default/female.png" : "/images/default/male.png";
              };
              return (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* بالای باکس: عنوان دسته + تخصص‌ها */}
                  <div className="flex flex-col sm:flex-row sm:items-stretch min-h-0">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 lg:min-w-[220px] border-b sm:border-b-0 sm:border-l border-gray-100 hover:bg-gray-50/50 transition-colors shrink-0"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center text-2xl sm:text-3xl shrink-0 border border-teal-100">
                        {category.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 break-words">
                          {category.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {category.subcategories?.length || 0} تخصص
                        </p>
                      </div>
                    </Link>
                    <div className="flex-1 flex items-center p-4 sm:p-5 lg:p-6 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/30 min-w-0">
                      {(category.subcategories || []).length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 w-full">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${category.slug}`}
                              className="flex items-center justify-center gap-1.5 bg-white border border-teal-100 text-teal-700 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-teal-50 hover:border-teal-200 transition-colors min-w-0"
                            >
                              <span className="shrink-0">{sub.icon}</span>
                              <span className="truncate text-center flex-1 min-w-0">{sub.title}</span>
                              {sub.expertCount != null && (
                                <span className="text-teal-500 text-xs shrink-0 hidden sm:inline">({sub.expertCount})</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">زیردسته‌ای ثبت نشده</span>
                      )}
                    </div>
                  </div>

                  {/* داخل همان باکس: بخش متخصصان (۳ تا ۵ نفر) */}
                  {experts.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/30">
                      <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-semibold text-gray-700">متخصصان این دسته</span>
                        <Link
                          href={`/experts?category=${encodeURIComponent(category.slug)}`}
                          className="text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                        >
                          همه
                        </Link>
                      </div>
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                          {experts.map((expert) => (
                            <Link
                              key={expert.id}
                              href={`/experts/${expert.id}`}
                              className="flex items-center gap-3 bg-white hover:bg-teal-50/50 border border-gray-200 hover:border-teal-200 rounded-xl p-3 min-w-0 w-full sm:w-auto sm:min-w-[200px] transition-colors shadow-sm"
                            >
                              <img
                                src={defaultAvatar(expert.user)}
                                alt=""
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 border-2 border-white shadow"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = expert.user?.gender === "female" ? "/images/default/female.png" : "/images/default/male.png";
                                }}
                              />
                              <div className="min-w-0 flex-1 text-right">
                                <p className="text-sm font-medium text-gray-800 truncate" title={`${expert.user?.firstName || ""} ${expert.user?.lastName || ""}`.trim()}>
                                  {expert.user?.firstName || ""} {expert.user?.lastName || ""}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
