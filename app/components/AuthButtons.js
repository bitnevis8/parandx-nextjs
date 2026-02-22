"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (user) {
    return (
      <Link
        href="/dashboard"
        scroll={false}
        className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded border border-gray-300 bg-white text-sm sm:text-base text-center transition-colors duration-200"
      >
        {user.firstName} {user.lastName}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">

      <Link
        href="/auth/register"
        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2 px-3 rounded text-sm sm:text-base text-center transition-colors duration-200 whitespace-nowrap"
      >
        ثبت نام
      </Link>
      <Link
        href="/auth/login"
        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2 px-3 rounded text-sm sm:text-base text-center transition-colors duration-200 whitespace-nowrap"
      >
        ورود
      </Link>
    </div>
  );
} 