'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClass = className.includes('h-') ? className : `h-10 w-10 ${className}`.trim();

  if (!mounted) {
    return (
      <button
        type="button"
        className={`flex shrink-0 items-center justify-center rounded-xl text-gray-400 ${sizeClass}`}
        aria-label="تغییر تم"
        suppressHydrationWarning
      >
        <SunIcon className="h-5 w-5" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex shrink-0 items-center justify-center rounded-xl transition-colors ${
        isDark
          ? 'text-sky-200 hover:bg-sky-900 hover:text-sky-50'
          : 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'
      } ${sizeClass}`}
      aria-label={isDark ? 'فعال‌سازی حالت روشن' : 'فعال‌سازی حالت تاریک'}
      title={isDark ? 'حالت روشن' : 'حالت تاریک'}
    >
      {isDark ? (
        <MoonIcon className="h-5 w-5" aria-hidden />
      ) : (
        <SunIcon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
