'use client';

/** تخصص‌ها — چیپ‌های خنثی داخل باکس ملایم */
export default function ExpertHeaderSpecializations({ categories, className = '' }) {
  if (!categories?.length) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <span
            className="inline-flex max-w-full items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200/90 sm:text-xs"
            title={cat.title}
          >
            {cat.icon ? (
              <span className="shrink-0 text-sm leading-none" aria-hidden>
                {cat.icon}
              </span>
            ) : null}
            <span className="truncate">{cat.title}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
