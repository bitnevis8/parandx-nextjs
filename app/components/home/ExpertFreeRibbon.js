'use client';

/** روبان گوشه «رایگان» — بلوک متخصصین (موبایل و دسکتاپ) */
export default function ExpertFreeRibbon({ label }) {
  return (
    <div
      className="pointer-events-none absolute top-0 end-0 z-[2] h-[4.5rem] w-[4.5rem] overflow-hidden"
      aria-hidden
    >
      <span
        className="absolute top-[0.95rem] start-[-1.7rem] block w-[8rem] -rotate-45 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-1 text-center text-[10px] font-extrabold leading-none text-white shadow-[0_2px_8px_rgba(180,83,9,0.32)] dark:from-amber-300 dark:via-amber-200 dark:to-amber-300 dark:text-amber-950 dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
      >
        {label}
      </span>
    </div>
  );
}
