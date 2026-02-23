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
      className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] bg-gradient-to-l from-slate-700 to-slate-800 border-t border-slate-600/50 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0px)" }}
    >
      <div className="flex items-stretch justify-around h-16">
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
                active:bg-white/10
                ${active ? "text-cyan-300 bg-white/10" : "text-slate-300"}
              `}
            >
              <Icon className="w-6 h-6 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
              <span className="leading-tight text-center line-clamp-1">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 font-medium text-[10px] sm:text-xs text-slate-300 active:bg-white/10"
        >
          <Bars3Icon className="w-6 h-6 flex-shrink-0" strokeWidth={2} />
          <span className="leading-tight text-center line-clamp-1">منو</span>
        </button>
      </div>
    </nav>
  );
}
