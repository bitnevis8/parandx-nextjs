"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRole } from "../../hooks/useRole";
import {
  HomeIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
} from "@heroicons/react/24/solid";

export default function DashboardBottomBar({ onOpenMenu }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userRole = useRole();
  const canCustomer = userRole.canAccessCustomer();

  const isActive = (path, exact = false) => {
    if (exact) return pathname === path && !searchParams.get("tab");
    if (path.includes("?tab=")) {
      const [, tab] = path.split("?tab=");
      return pathname === "/dashboard" && searchParams.get("tab") === tab;
    }
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const items = [
    {
      href: "/dashboard",
      label: "داشبورد",
      Icon: HomeIcon,
      IconActive: HomeIconSolid,
      exact: true,
    },
    {
      href: "/dashboard?tab=profile-display",
      label: "پروفایل",
      Icon: UserCircleIcon,
      IconActive: UserCircleIconSolid,
      exact: false,
    },
    {
      href: "/dashboard/messages",
      label: "پیام‌ها",
      Icon: ChatBubbleLeftRightIcon,
      IconActive: ChatBubbleLeftRightIconSolid,
      exact: false,
    },
    ...(canCustomer
      ? [
          {
            href: "/dashboard/customer/active-requests",
            label: "درخواست‌ها",
            Icon: ClipboardDocumentListIcon,
            IconActive: ClipboardDocumentListIconSolid,
            exact: false,
          },
        ]
      : []),
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0px)" }}
      aria-label="ناوبری داشبورد"
    >
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = active ? item.IconActive : item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={false}
              className={`
                flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1
                font-medium text-[10px] sm:text-xs transition-colors
                ${active ? "text-teal-600" : "text-gray-500 hover:text-gray-700"}
              `}
            >
              <Icon className="h-6 w-6 shrink-0" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
              <span className="leading-tight text-center line-clamp-1">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 font-medium text-[10px] sm:text-xs text-gray-500 hover:text-gray-700"
        >
          <Bars3Icon className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
          <span className="leading-tight text-center line-clamp-1">منو</span>
        </button>
      </div>
    </nav>
  );
}
