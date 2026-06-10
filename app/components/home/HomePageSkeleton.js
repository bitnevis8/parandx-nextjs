'use client';

function Pulse({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Hero skeleton */}
      <Pulse className="w-full h-52 sm:h-60 md:h-72 border-b border-gray-100 rounded-none" />
      <div className="py-10 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <Pulse className="h-10 w-3/4 max-w-md mx-auto" />
          <Pulse className="h-5 w-full max-w-lg mx-auto" />
          <Pulse className="h-14 w-full max-w-2xl mx-auto rounded-2xl mt-6" />
          <div className="flex justify-center gap-3 mt-6">
            <Pulse className="h-11 w-36 rounded-xl" />
            <Pulse className="h-11 w-36 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-6">
          <Pulse className="h-8 w-48 mx-auto mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
              <Pulse className="h-6 w-40" />
              <div className="flex gap-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Pulse key={j} className="h-32 w-36 shrink-0 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
