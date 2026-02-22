"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 sm:py-6 pb-20 md:pb-6 relative z-50 w-full overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        <p className="text-xs sm:text-sm text-center break-words px-2">
          &copy; {new Date().getFullYear()} پرندیکس. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
} 