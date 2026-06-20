'use client';

const OVERLAY_GRADIENT =
  'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.72)_55%,transparent_100%)] dark:bg-[linear-gradient(to_bottom,rgba(2,12,20,0.92)_0%,rgba(2,12,20,0.55)_58%,transparent_100%)]';

/** فیلترهای پیش‌نمایش موبایل — بالای نقشه (بدون جستجو)؛ لمس → بزرگنمایی */
export default function HomeMapMobilePreviewOverlay({
  layerToolbar = null,
  sectionControl = null,
  neighborhoodControl = null,
  onExpand,
}) {
  if (!onExpand) return null;

  const hasRegion = Boolean(sectionControl || neighborhoodControl);
  const hasContent = Boolean(layerToolbar || hasRegion);
  if (!hasContent) return null;

  const stopAndExpand = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onExpand();
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[460] md:hidden">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[min(46%,12.5rem)] ${OVERLAY_GRADIENT}`}
        aria-hidden
      />

      <div className="pointer-events-auto relative px-3 pb-2 pt-2.5">
        {layerToolbar ? (
          <div
            className="mb-2 rounded-xl border border-white/70 bg-white/88 p-2 shadow-sm backdrop-blur-md dark:border-sky-700/80 dark:bg-sky-950/88"
            onPointerDown={stopAndExpand}
            role="button"
            tabIndex={0}
            aria-label="باز کردن نقشه برای تغییر لایه"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') stopAndExpand(event);
            }}
          >
            <div className="pointer-events-none">{layerToolbar}</div>
          </div>
        ) : null}

        {hasRegion ? (
          <div
            className="rounded-xl border border-white/70 bg-white/88 p-2.5 shadow-sm backdrop-blur-md dark:border-sky-700/80 dark:bg-sky-950/88"
            onPointerDown={stopAndExpand}
            role="button"
            tabIndex={0}
            aria-label="باز کردن نقشه برای فیلتر منطقه"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') stopAndExpand(event);
            }}
          >
            <div className="pointer-events-none">
              <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                {sectionControl}
                {neighborhoodControl}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
