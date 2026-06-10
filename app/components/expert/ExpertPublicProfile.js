'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  PhotoIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { API_ENDPOINTS } from '../../config/api';
import {
  normalizeActivityTypes,
  normalizePortfolio,
  mergePersonalMobileIntoContactMobiles,
} from '../../utils/expertProfileUtils';
import { normalizeProfileAddresses } from '../../utils/profileAddressUtils';
import {
  ProfilePanel,
  ProfilePanelGroup,
  ProfilePanelRow,
} from '../ui/dashboard/ProfileViewUi';
import {
  ExpertAccountTypeDisplay,
  ExpertContactNumbersDisplay,
  ExpertServiceAreaDisplay,
} from '../ui/ExpertProfileSections';
import ExpertPublicProfileHeader from './ExpertPublicProfileHeader';
import {
  ExpertPublicBioBlock,
  ExpertPublicProfileHighlights,
  ExpertPublicPresenceSection,
  ExpertPublicAddressesList,
} from './ExpertPublicProfileParts';

import ExpertPostFeed from './ExpertPostFeed';

const SECTIONS = [
  { id: 'posts', label: 'پست‌ها' },
  { id: 'about', label: 'درباره' },
  { id: 'specializations', label: 'تخصص‌ها' },
  { id: 'contact', label: 'تماس' },
  { id: 'location', label: 'موقعیت' },
  { id: 'portfolio', label: 'نمونه کار' },
  { id: 'reviews', label: 'نظرات' },
];

function SectionCard({ id, title, description, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{description}</p>
        ) : null}
      </header>
      <div>{children}</div>
    </section>
  );
}

function ExpertPublicCategories({ categories }) {
  if (!categories?.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin sm:flex-wrap sm:overflow-visible sm:pb-0">
      {categories.map((cat) => (
        <span
          key={cat.id}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-teal-100 bg-teal-50/80 px-3.5 py-2 text-sm font-medium text-teal-900"
        >
          {cat.icon ? (
            <span className="text-base leading-none" aria-hidden>
              {cat.icon}
            </span>
          ) : null}
          {cat.title}
        </span>
      ))}
    </div>
  );
}

function ExpertPublicPortfolioGallery({ portfolio }) {
  const items = normalizePortfolio(portfolio).filter(
    (item) => item.title || item.imageUrl || item.videoUrl || item.instagramUrl || item.websiteUrl
  );

  if (!items.length) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-500 sm:px-5">
        هنوز نمونه‌کاری ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 transition hover:border-teal-200 hover:shadow-md"
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title || `نمونه ${index + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-slate-100 to-teal-50 text-slate-400">
              <PhotoIcon className="h-8 w-8" aria-hidden />
              <span className="text-sm">بدون عکس</span>
            </div>
          )}
          <div className="space-y-2 p-3">
            {item.title ? (
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {item.instagramUrl ? (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900"
                >
                  اینستاگرام
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
              {item.websiteUrl ? (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900"
                >
                  وب‌سایت
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ExpertPublicReviews({ reviews }) {
  if (!reviews?.length) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center sm:px-5">
        <ChatBubbleLeftEllipsisIcon className="h-12 w-12 text-slate-300" aria-hidden />
        <p className="mt-3 text-sm font-medium text-slate-600">هنوز نظری ثبت نشده است</p>
        <p className="mt-1 text-xs text-slate-500">پس از همکاری می‌توانید اولین نظر را بگذارید.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {reviews.map((review) => (
        <li key={review.id} className="px-4 py-4 sm:px-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-0.5" aria-label={`امتیاز ${review.rating} از ۵`}>
              {[1, 2, 3, 4, 5].map((n) =>
                n <= review.rating ? (
                  <StarSolidIcon key={n} className="h-4 w-4 text-amber-400" />
                ) : (
                  <StarIcon key={n} className="h-4 w-4 text-slate-200" />
                )
              )}
            </div>
            <time className="text-xs text-slate-500" dateTime={review.createdAt}>
              {new Date(review.createdAt).toLocaleDateString('fa-IR')}
            </time>
          </div>
          {review.comment ? (
            <p className="text-sm leading-relaxed text-slate-700">{review.comment}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const DEFAULT_SECTION = 'about';

export default function ExpertPublicProfile({ expert, reviews = [] }) {
  const [cities, setCities] = useState([]);
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);

  useEffect(() => {
    fetch(API_ENDPOINTS.cities.getAll)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCities(res.data || []);
      })
      .catch(() => {});
  }, []);

  const user = expert?.user;
  const displayContactMobiles = useMemo(
    () => mergePersonalMobileIntoContactMobiles(expert?.contactMobiles, user?.mobile),
    [expert?.contactMobiles, user?.mobile]
  );
  const activityTypes = useMemo(
    () => normalizeActivityTypes(expert?.activityTypes, expert),
    [expert]
  );

  const addresses = useMemo(() => {
    if (!expert) return [];
    return normalizeProfileAddresses(expert.addresses, expert, {
      lineField: 'location',
      dataField: 'locationData',
    });
  }, [expert]);

  const activeCityNames = useMemo(
    () =>
      (expert?.activeCityIds || [])
        .map((id) => cities.find((c) => Number(c.id) === Number(id))?.name)
        .filter(Boolean)
        .join('، '),
    [expert?.activeCityIds, cities]
  );

  const scrollToSection = (id) => {
    setActiveSection(id);
    const scrollTarget = () => {
      const el = document.getElementById(`public-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (id === 'posts') {
      requestAnimationFrame(() => requestAnimationFrame(scrollTarget));
    } else {
      scrollTarget();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-sm">
        <ExpertPublicProfileHeader
          expert={expert}
          sections={SECTIONS}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      </div>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
        {expert?.status && expert.status !== 'approved' ? (
          <div
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            این پروفایل هنوز توسط تیم پرند ایکس تأیید نشده است.
          </div>
        ) : null}

        {activeSection === 'posts' ? (
          <SectionCard
            id="public-posts"
            title="پست‌ها"
            description="به‌روزرسانی‌ها و اعلان‌های متخصص"
          >
            <ExpertPostFeed expertId={expert?.id} />
          </SectionCard>
        ) : null}

        <SectionCard id="public-about" title="آشنایی بیشتر" description="معرفی، اعتماد و مشخصات حرفه‌ای">
          <div className="space-y-5 p-4 sm:p-5">
            <ExpertPublicBioBlock bio={expert?.bio} />

            <ExpertPublicProfileHighlights expert={expert} user={user} />

            <ProfilePanel flush>
              <ExpertAccountTypeDisplay profile={expert} hideBio />
              {expert?.experience ? (
                <ProfilePanelGroup title="سابقه">
                  <ProfilePanelRow label="سابقه کاری" value={expert.experience} />
                </ProfilePanelGroup>
              ) : null}
            </ProfilePanel>
          </div>
        </SectionCard>

        <SectionCard
          id="public-specializations"
          title="تخصص‌ها"
          description="کارهایی که انجام می‌ده"
        >
          <div className="p-4 sm:p-5">
            <ExpertPublicCategories categories={expert?.categories} />
          </div>
        </SectionCard>

        <SectionCard id="public-contact" title="تماس و پوشش خدمت">
          <ProfilePanel flush className="border-0 shadow-none rounded-none">
            <ExpertContactNumbersDisplay
              contactMobiles={displayContactMobiles}
              contactPhones={expert?.contactPhones}
              socialLinks={expert?.socialLinks}
              linkable
            />
            <ExpertServiceAreaDisplay
              activeCityNames={activeCityNames}
              serviceRadius={expert?.serviceRadius}
              activityTypes={activityTypes}
            />
          </ProfilePanel>
          <ExpertPublicPresenceSection
            presenceStatus={expert?.presenceStatus}
            workSchedule={expert?.workSchedule}
          />
        </SectionCard>

        <SectionCard
          id="public-location"
          title="موقعیت و آدرس"
          description={
            addresses.length > 1
              ? `${addresses.length} آدرس ثبت‌شده`
              : 'محل فعالیت و نقشه'
          }
        >
          <ExpertPublicAddressesList addresses={addresses} cities={cities} />
        </SectionCard>

        <SectionCard id="public-portfolio" title="نمونه کارها">
          <ExpertPublicPortfolioGallery portfolio={expert?.portfolio} />
        </SectionCard>

        <SectionCard id="public-reviews" title="نظرات مشتریان">
          <ExpertPublicReviews reviews={reviews} />
        </SectionCard>
      </main>
    </div>
  );
}
