'use client';

import Link from 'next/link';

function getAvatar(expert) {
  if (expert.user?.avatar) return expert.user.avatar;
  return expert.user?.gender === 'female' ? '/images/default/female.png' : '/images/default/male.png';
}

export default function TopExpertsSection({ experts = [], cityName = '' }) {
  if (!experts.length) {
    return (
      <section className="py-10 sm:py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">متخصص‌های پرندیکس</h2>
          <p className="text-gray-500 text-sm sm:text-base">به‌زودی اینجا پر می‌شه.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">چند تا از بهترین‌ها</h2>
          <p className="text-sm sm:text-base text-gray-600">
            {cityName ? `فعال‌ها توی ${cityName}` : 'فعال‌ها توی پرندیکس'}
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
          {experts.map((expert) => {
            const specialty = expert.categories?.[0]?.title;
            return (
              <Link
                key={expert.id}
                href={`/experts/${expert.id}`}
                scroll={false}
                className="group snap-start shrink-0 w-[160px] sm:w-[180px] md:w-auto flex flex-col items-center p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white hover:border-teal-200 hover:shadow-md transition-all"
              >
                <img
                  src={getAvatar(expert)}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getAvatar(expert);
                  }}
                />
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-teal-700 transition-colors text-center line-clamp-1 w-full">
                  {expert.user?.firstName} {expert.user?.lastName}
                </h3>
                {expert.experience != null && (
                  <p className="text-xs text-gray-500 mt-1">{expert.experience} سال تجربه</p>
                )}
                {specialty && (
                  <p className="text-xs text-teal-600 mt-1 line-clamp-1 w-full text-center">{specialty}</p>
                )}
                {expert.location && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 w-full text-center">{expert.location}</p>
                )}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/#home-path-map"
            scroll={false}
            className="inline-block bg-teal-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-teal-700 transition-colors"
          >
            بقیه رو هم ببینید
          </Link>
        </div>
      </div>
    </section>
  );
}
