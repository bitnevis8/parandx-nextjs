"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "../../../config/api";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useAuth } from "../../../context/AuthContext";

function formatTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("fa-IR", { month: "long", day: "numeric", year: "numeric" });
}

export default function ChatRoomPage() {
  const params = useParams();
  const userId = params?.userId;
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversation = async (reset = true) => {
    if (!userId) return;
    try {
      setError(null);
      if (reset) setLoading(true);
      const res = await fetch(
        `${API_ENDPOINTS.messages.conversation(userId)}?limit=100&offset=0`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setOtherUser(data.data.otherUser);
        setMessages(data.data.messages || []);
        setTotal(data.data.total ?? 0);
      } else {
        setError(data.message || "خطا در بارگذاری پیام‌ها");
        if (res.status === 404) setOtherUser(null);
      }
    } catch (e) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending || !userId) return;
    setSending(true);
    try {
      const res = await fetch(API_ENDPOINTS.messages.send, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiverId: Number(userId), body: text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
        setInput("");
        scrollToBottom();
      } else {
        setError(data.message || "ارسال پیام ناموفق بود");
      }
    } catch (e) {
      setError("خطا در ارسال پیام");
    } finally {
      setSending(false);
    }
  };

  if (!userId) {
    return (
      <div className="p-4 text-center text-gray-500">
        شناسه کاربر معتبر نیست.
        <Link href="/dashboard/messages" className="block mt-2 text-teal-600 hover:underline">
          بازگشت به لیست پیام‌ها
        </Link>
      </div>
    );
  }

  const auth = useAuth();
  const meId = auth?.user?.id ?? auth?.user?.userId;

  if (loading && !otherUser) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error && !otherUser) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/dashboard/messages" className="text-teal-600 hover:underline">
          بازگشت به لیست پیام‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[700px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* هدر چت */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 shrink-0">
        <Link
          href="/dashboard/messages"
          className="shrink-0 p-1 rounded-lg hover:bg-gray-200 text-gray-600"
          aria-label="بازگشت"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="shrink-0">
          <UserAvatar user={otherUser} size="sm" className="rounded-full border-2 border-white shadow" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-gray-900 truncate">
            {otherUser?.firstName} {otherUser?.lastName}
          </h2>
          <p className="text-xs text-gray-500">مکالمه خصوصی</p>
        </div>
      </div>

      {/* لیست پیام‌ها */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50"
      >
        {messages.length === 0 && !loading && (
          <p className="text-center text-gray-500 text-sm">هنوز پیامی رد و بدل نشده. اولین پیام را بفرستید.</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === meId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-start" : "justify-end"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMe
                    ? "bg-teal-500 text-white rounded-tl-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tr-none"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-teal-100" : "text-gray-400"}`}>
                  {formatTime(msg.createdAt)}
                  {msg.readAt && isMe && " • ✓✓"}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* فرم ارسال */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white shrink-0">
        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            disabled={sending}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="shrink-0 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 py-3 font-medium transition-colors"
          >
            {sending ? "..." : "ارسال"}
          </button>
        </div>
      </form>
    </div>
  );
}
