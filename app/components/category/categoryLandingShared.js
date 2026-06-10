import Link from 'next/link';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { HOME_BTN_PRIMARY } from '../home/homePageTheme';

export const EXPERT_PREVIEW_LIMIT = 6;

export function ImagePlaceholder({ label, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center ${className}`}
      aria-hidden
    >
      <PhotoIcon className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
      <span className="text-xs font-medium text-gray-400 px-3">{label}</span>
    </div>
  );
}

export function HeroMedia({ image, alt, placeholderLabel }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
        unoptimized
      />
    );
  }
  return <ImagePlaceholder label={placeholderLabel} className="absolute inset-0 rounded-none" />;
}

export function mapHref(parentSlug, serviceSlug, basePath = '/') {
  const q = new URLSearchParams();
  if (parentSlug) q.set('mapParent', parentSlug);
  if (serviceSlug) q.set('mapService', serviceSlug);
  const qs = q.toString();
  const hash = '#home-path-map';
  return qs ? `${basePath}?${qs}${hash}` : `${basePath}${hash}`;
}

export function LandingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
        aria-label="در حال بارگذاری"
      />
    </div>
  );
}

export function LandingNotFound({ marketplaceType = 'services' } = {}) {
  const backHref = marketplaceType === 'goods' ? '/goods#home-path-categories' : '/#home-path-categories';
  const backLabel = marketplaceType === 'goods' ? 'بازگشت به بازار کالا' : 'بازگشت به بازار خدمات';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4" aria-hidden>
          📂
        </p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">صفحه پیدا نشد</h1>
        <p className="text-gray-600 mb-6 text-sm">ممکن است آدرس اشتباه باشد یا این دسته غیرفعال شده باشد.</p>
        <Link href={backHref} className={HOME_BTN_PRIMARY}>
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

export function FeaturedSlotsSection({ title = 'پیشنهاد ویژه', hint }) {
  return (
    <section
      className="mt-10 sm:mt-12 rounded-2xl border border-dashed border-gray-300 bg-white/80 p-4 sm:p-6"
      aria-label={title}
    >
      <h2 className="text-sm font-bold text-gray-500">{title}</h2>
      <p className="text-xs text-gray-400 mt-1 mb-4">
        {hint || 'جایگاه تبلیغ / متخصص ویژه — تصاویر بعداً اضافه می‌شود'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((n) => (
          <ImagePlaceholder key={n} label={`جای تصویر ویژه ${n}`} className="aspect-[4/3] w-full" />
        ))}
      </div>
    </section>
  );
}

export function expertAvatarSrc(expert) {
  if (expert?.avatar) return expert.avatar;
  const user = expert?.user;
  if (user?.avatar) return user.avatar;
  return user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
}

export function filterExpertsForCategory(experts, categoryId) {
  if (!categoryId || !Array.isArray(experts)) return [];
  return experts.filter(
    (expert) =>
      expert.categories &&
      expert.categories.some((c) => c.id === categoryId || String(c.id) === String(categoryId))
  );
}
