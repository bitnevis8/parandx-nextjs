"use client";
import Image from 'next/image';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhoneIcon, DevicePhoneMobileIcon, MagnifyingGlassIcon, UserCircleIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from './config/api';

function normalizeForSearch(text) {
  if (text == null) return '';
  return String(text).trim().replace(/\s+/g, ' ');
}
function matchesQuery(text, q) {
  const a = normalizeForSearch(text);
  const b = normalizeForSearch(q);
  if (!b) return true;
  return a.includes(b) || a.replace(/\s/g, '').includes(b.replace(/\s/g, ''));
}

const TYPEWRITER_TEXT = 'چه دنبال کارشناس باشی ، چه دنبال کارفرما، اینجا براحتی به هم می‌رسید.';
/** فاصلهٔ هر حرف هنگام تایپ (میلی‌ثانیه) — عدد کمتر = تایپ سریع‌تر. مثلاً 80 یا 150 */
const TYPE_SPEED = 40;
/** مدت مکث بعد از تمام شدن متن قبل از پاک کردن (میلی‌ثانیه) */
const PAUSE_AFTER_TYPING = 60000;
/** مدت مکث قبل از شروع دوبارهٔ تایپ (میلی‌ثانیه) */
const PAUSE_BEFORE_RESTART = 80;

const SUGGESTION_CATEGORY_LIMIT = 6;
const SUGGESTION_EXPERT_LIMIT = 5;

export default function Home() {
  const router = useRouter();
  const searchWrapRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [experts, setExperts] = useState([]);
  const [searchCategoriesAll, setSearchCategoriesAll] = useState([]); // دسته + زیردسته برای پیشنهاد
  const [searchExpertsAll, setSearchExpertsAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery?.trim();
    setSuggestionsOpen(false);
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push('/categories');
  };

  const suggestions = useMemo(() => {
    const q = normalizeForSearch(searchQuery);
    if (!q || q.length < 1) return { categories: [], experts: [] };
    const catMatches = searchCategoriesAll.filter(
      (c) => matchesQuery(c.title, q) || matchesQuery(c.slug, q)
    ).slice(0, SUGGESTION_CATEGORY_LIMIT);
    const expMatches = searchExpertsAll.filter(
      (e) =>
        matchesQuery(e.user?.firstName, q) ||
        matchesQuery(e.user?.lastName, q) ||
        matchesQuery(e.bio, q) ||
        matchesQuery([e.user?.firstName, e.user?.lastName].filter(Boolean).join(' '), q)
    ).slice(0, SUGGESTION_EXPERT_LIMIT);
    return { categories: catMatches, experts: expMatches };
  }, [searchQuery, searchCategoriesAll, searchExpertsAll]);

  const hasSuggestions = suggestions.categories.length > 0 || suggestions.experts.length > 0;
  const showDropdown = suggestionsOpen && (searchQuery.trim().length >= 1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        const allCats = Array.isArray(catData.data) ? catData.data : [];
        const mainCats = allCats.filter((c) => !c.parentId);
        setCategories(mainCats);
        const flatForSearch = [];
        mainCats.forEach((main) => {
          flatForSearch.push({ type: 'main', id: main.id, title: main.title, slug: main.slug, icon: main.icon });
          (main.subcategories || []).forEach((sub) => {
            flatForSearch.push({ type: 'sub', id: sub.id, title: sub.title, slug: sub.slug, parentSlug: main.slug, icon: sub.icon });
          });
        });
        setSearchCategoriesAll(flatForSearch);

        const expRes = await fetch(API_ENDPOINTS.experts.getAllWithLimit(50));
        const expData = expRes.ok ? await expRes.json() : { data: [] };
        const list = Array.isArray(expData.data) ? expData.data : [];
        setExperts(list.slice(0, 8));
        setSearchExpertsAll(list);
      } catch (err) {
        console.error('Error fetching data for homepage:', err);
        setCategories([]);
        setExperts([]);
        setSearchCategoriesAll([]);
        setSearchExpertsAll([]);
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

          {/* جستجوی حرفه‌ای با پیشنهاد */}
          <div ref={searchWrapRef} className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 px-2 relative">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg ring-1 ring-gray-200/80 hover:ring-teal-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 transition-all duration-200 overflow-visible">
                <label htmlFor="hero-search" className="sr-only">جستجو در خدمات و متخصصان</label>
                <input
                  id="hero-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSuggestionsOpen(true)}
                  placeholder="جستجو در خدمات و متخصصان..."
                  className="w-full py-3.5 sm:py-4 pl-20 sm:pl-24 pr-12 sm:pr-14 text-base sm:text-lg text-gray-800 placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0 rounded-2xl"
                  dir="rtl"
                  autoComplete="off"
                  aria-label="جستجو در خدمات و متخصصان"
                  aria-expanded={showDropdown}
                  aria-autocomplete="list"
                />
                <div className="absolute right-3 sm:right-4 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500 text-white pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} aria-hidden />
                </div>
                <button
                  type="submit"
                  className="absolute left-2 sm:left-3 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  جستجو
                </button>
              </div>
            </form>

            {/* دراپ‌داون پیشنهادها */}
            {showDropdown && (
              <div
                className="absolute top-full left-2 right-2 mt-1 z-50 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                role="listbox"
              >
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
                        key={c.type === 'sub' ? `sub-${c.id}` : `cat-${c.id}`}
                        href={c.parentSlug ? `/categories/${c.parentSlug}` : `/categories/${c.slug || c.id}`}
                        onClick={() => { setSuggestionsOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-right border-b border-gray-50 last:border-0"
                        role="option"
                      >
                        <span className="text-lg shrink-0">{c.icon || '📂'}</span>
                        <span className="text-gray-800 font-medium">{c.title}</span>
                        {c.type === 'sub' && c.parentSlug && (
                          <span className="text-xs text-gray-400 truncate">در دستهٔ والد</span>
                        )}
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
                      const avatarSrc = expert.user?.avatar || (expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png');
                      return (
                      <Link
                        key={expert.id}
                        href={`/experts/${expert.id}`}
                        onClick={() => { setSuggestionsOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-right border-b border-gray-50 last:border-0"
                        role="option"
                      >
                        <img
                          src={avatarSrc}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                          onError={(e) => { e.target.onerror = null; e.target.src = expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png'; }}
                        />
                        <span className="text-gray-800 font-medium">
                          {expert.user?.firstName} {expert.user?.lastName}
                        </span>
                      </Link>
                      );
                    })}
                    <div className="px-4 py-2 bg-teal-50 border-t border-teal-100">
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="text-sm font-medium text-teal-700 hover:text-teal-800 w-full text-center"
                      >
                        مشاهده همه نتایج برای «{searchQuery.trim()}»
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-4 text-center text-gray-500 text-sm">
                    نتیجه‌ای یافت نشد. Enter بزنید تا جستجوی کامل انجام شود.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* شماره‌های تماس زیر سرچ باکس — موبایل: فقط موبایل؛ دسکتاپ: ثابت + موبایل */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
            <a
              href="tel:02156956691"
              className="hidden sm:inline-flex items-center justify-center gap-2 sm:gap-3 bg-blue-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
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
              {experts.map((expert) => {
                const avatarSrc = expert.user?.avatar || (expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png');
                return (
                <Link key={expert.id} href={`/experts/${expert.id}`} scroll={false} className="group">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-6 text-center hover:shadow-lg transition-all duration-300">
                    <img
                      src={avatarSrc}
                      alt=""
                      className="w-12 h-12 sm:w-20 sm:h-20 rounded-full mx-auto mb-2 sm:mb-4 object-cover border-2 border-white shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
                      }}
                    />
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                      {expert.user?.firstName} {expert.user?.lastName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{expert.experience != null ? `${expert.experience} سال` : '—'}</p>
                    <p className="text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2 truncate">{expert.location || '—'}</p>
                  </div>
                </Link>
                );
              })}
            </div>

            <div className="text-center">
              <Link href="/experts" scroll={false} className="bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors inline-block">
                مشاهده همه متخصصان
              </Link>
            </div>
          </div>
        </div>
      )}

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
