"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (user) {
    return (
      <Link
        href="/dashboard"
        scroll={false}
        className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-teal-300 hover:text-teal-700 transition-colors whitespace-nowrap"
      >
        {user.firstName} {user.lastName}
      </Link>
    );
  }

  return (
    <Link
      href="/auth"
      scroll={false}
      className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors whitespace-nowrap"
    >
      ورود / ثبت‌نام
    </Link>
  );
}
