"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "../../config/api";
import UserAvatar from "../../components/ui/UserAvatar";

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return "همین الان";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} دقیقه پیش`;
  if (diff < 86400000) return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString("fa-IR", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const fetchConversations = async () => {
    try {
      setError(null);
      const [convRes, unreadRes] = await Promise.all([
        fetch(API_ENDPOINTS.messages.conversations, { credentials: "include" }),
        fetch(API_ENDPOINTS.messages.unreadCount, { credentials: "include" }),
      ]);
      const convData = await convRes.json();
      const unreadData = await unreadRes.json();
      if (convData.success) setConversations(convData.data || []);
      if (unreadData.success) setUnreadTotal(unreadData.data?.count ?? 0);
      if (!convData.success) setError(convData.message || "خطا در بارگذاری مکالمات");
    } catch (e) {
      setError("خطا در ارتباط با سرور");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">پیام‌های من</h1>
        {unreadTotal > 0 && (
          <span className="bg-teal-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            {unreadTotal} خوانده نشده
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {conversations.length === 0 && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
          <p className="text-lg">هنوز مکالمه‌ای ندارید.</p>
          <p className="text-sm mt-2">با ورود به صفحه هر کارشناس یا از طریق درخواست‌ها می‌توانید پیام بفرستید.</p>
        </div>
      )}

      <ul className="space-y-2">
        {conversations.map((conv) => (
          <li key={conv.otherUser?.id}>
            <Link
              href={`/dashboard/messages/${conv.otherUser?.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="shrink-0">
                <UserAvatar
                  user={conv.otherUser}
                  size="sm"
                  className="rounded-full border-2 border-gray-200"
                />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-800 truncate">
                    {conv.otherUser?.firstName} {conv.otherUser?.lastName}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0">
                    {formatDate(conv.lastMessage?.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-0.5">
                  {conv.lastMessage?.senderId === conv.otherUser?.id ? "" : "شما: "}
                  {conv.lastMessage?.body}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="shrink-0 bg-teal-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
