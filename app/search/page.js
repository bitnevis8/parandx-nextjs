"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "../config/api";
import { MagnifyingGlassIcon, Squares2X2Icon, UserCircleIcon } from "@heroicons/react/24/outline";

function normalizeForSearch(text) {
  if (text == null) return "";
  return String(text).trim().replace(/\s+/g, " ");
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [filteredCats, setFilteredCats] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);

  useEffect(() => {
    const query = normalizeForSearch(q);
    if (!query) {
      setFilteredCats([]);
      setFilteredExperts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(API_ENDPOINTS.search(q))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        setFilteredCats(json.data.categories || []);
        setFilteredExperts(json.data.experts || []);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Search fetch error:", err);
          setFilteredCats([]);
          setFilteredExperts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [q]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-teal-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">در حال جستجو...</p>
        </div>
      </div>
    );
  }

  const hasQuery = q.trim().length > 0;
  const hasResults = filteredCats.length > 0 || filteredExperts.length > 0;

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <MagnifyingGlassIcon className="w-6 h-6 text-teal-600" />
          نتایج جستجو
        </h1>
        {hasQuery ? (
          <p className="text-gray-600 mb-6">
            برای «<span className="font-medium text-gray-800">{q}</span>»
          </p>
        ) : (
          <p className="text-gray-600 mb-6">واژه‌ای برای جستجو وارد کنید.</p>
        )}

        {!hasQuery && (
          <div className="text-center py-12 text-gray-500">
            از باکس جستجو در صفحهٔ اصلی یا از آدرس با پارامتر <code className="bg-gray-100 px-1 rounded">?q=</code> استفاده کنید.
          </div>
        )}

        {hasQuery && !hasResults && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">نتیجه‌ای یافت نشد</h2>
            <p className="text-gray-600">واژهٔ دیگری امتحان کنید یا از دسته‌بندی‌ها و لیست متخصصان استفاده کنید.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/categories" className="text-teal-600 hover:text-teal-700 font-medium">
                دسته‌بندی خدمات
              </Link>
              <Link href="/experts" className="text-teal-600 hover:text-teal-700 font-medium">
                لیست متخصصان
              </Link>
            </div>
          </div>
        )}

        {hasQuery && hasResults && (
          <div className="space-y-8">
            {filteredCats.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Squares2X2Icon className="w-5 h-5 text-teal-600" />
                  دسته‌ها و خدمات ({filteredCats.length})
                </h2>
                <ul className="space-y-2">
                  {filteredCats.map((c) => (
                    <li key={c.type === "sub" ? `sub-${c.id}` : `cat-${c.id}`}>
                      <Link
                        href={c.parentSlug ? `/categories/${c.parentSlug}` : `/categories/${c.slug || c.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition-colors"
                      >
                        <span className="text-2xl shrink-0">{c.icon || "📂"}</span>
                        <span className="font-medium text-gray-800">{c.title}</span>
                        {c.type === "sub" && c.parentTitle && (
                          <span className="text-sm text-gray-500">در {c.parentTitle}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {filteredExperts.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-teal-600" />
                  متخصصان ({filteredExperts.length})
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredExperts.map((expert) => (
                    <li key={expert.id}>
                      <Link
                        href={`/experts/${expert.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition-colors"
                      >
                        <img
                          src={expert.user?.avatar || (expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png')}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {expert.user?.firstName} {expert.user?.lastName}
                          </p>
                          {expert.bio && (
                            <p className="text-sm text-gray-500 truncate">{expert.bio}</p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
