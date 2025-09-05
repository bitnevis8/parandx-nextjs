"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 relative z-50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} پرندیکس. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
} 