"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import { getApiBaseUrl } from "../../../config/getApiBaseUrl";
import {
  clientConversationUrl,
  clientMessageSendUrl,
  fetchAuth,
  parseApiResponse,
} from "../../../utils/apiClient";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useAuth } from "../../../context/AuthContext";

function formatTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function ChatRoomInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params?.userId;
  const requestId = searchParams.get("requestId");
  const [otherUser, setOtherUser] = useState(null);
  const [requestContext, setRequestContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const auth = useAuth();
  const meId = auth?.user?.id ?? auth?.user?.userId;

  const fetchConversation = async () => {
    if (!userId) return;
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(clientConversationUrl(userId, requestId), fetchAuth);
      const data = await parseApiResponse(res);
      if (data.success) {
        setOtherUser(data.data.otherUser);
        setRequestContext(data.data.request || null);
        setMessages(data.data.messages || []);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("refresh-unread-count"));
        }
      } else {
        setError(data.message || "خطا در بارگذاری پیام‌ها");
        if (res.status === 404) setOtherUser(null);
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [userId, requestId]);

  useEffect(() => {
    if (!userId || !meId) return;
    const otherId = Number(userId);
    const socket = io(getApiBaseUrl(), {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("new_message", (msg) => {
      const forThisChat =
        (msg.senderId === otherId && msg.receiverId === meId) ||
        (msg.senderId === meId && msg.receiverId === otherId);
      if (!forThisChat) return;
      if (requestId && msg.requestId && String(msg.requestId) !== String(requestId)) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      requestAnimationFrame(() => scrollToBottom());
    });

    socket.on("messages_read", (payload) => {
      if (payload.readerUserId !== otherId) return;
      const ids = payload.messageIds || [];
      const readAt = payload.readAt ? new Date(payload.readAt) : new Date();
      setMessages((prev) =>
        prev.map((m) => (ids.includes(m.id) ? { ...m, readAt } : m))
      );
    });

    socket.on("unread_count", () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("refresh-unread-count"));
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [userId, meId, requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending || !userId) return;
    setSending(true);
    setError(null);
    try {
      const payload = {
        receiverId: Number(userId),
        body: text,
      };
      if (requestId) payload.requestId = Number(requestId);

      const res = await fetch(clientMessageSendUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...fetchAuth,
        body: JSON.stringify(payload),
      });
      const data = await parseApiResponse(res);
      if (data.success && data.data) {
        const raw = data.data;
        const newMsg = {
          id: raw.id,
          senderId: raw.senderId,
          receiverId: raw.receiverId,
          body: raw.body ?? text,
          readAt: raw.readAt ?? null,
          createdAt: raw.createdAt ?? new Date().toISOString(),
          requestId: raw.requestId ?? (requestId ? Number(requestId) : null),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        requestAnimationFrame(() => scrollToBottom());
      } else {
        setError(data.message || "ارسال پیام ناموفق بود");
      }
    } catch {
      setError("خطا در ارسال پیام");
    } finally {
      setSending(false);
    }
  };

  if (!userId) {
    return (
      <div className="p-4 text-center text-gray-500">
        شناسه کاربر معتبر نیست.
        <Link href="/dashboard/messages" className="mt-2 block text-teal-600 hover:underline">
          بازگشت به لیست پیام‌ها
        </Link>
      </div>
    );
  }

  if (loading && !otherUser) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error && !otherUser) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <Link href="/dashboard/messages" className="text-teal-600 hover:underline">
          بازگشت به لیست پیام‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] max-h-[700px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-gray-50 p-4">
        <Link
          href="/dashboard/messages"
          className="shrink-0 rounded-lg p-1 text-gray-600 hover:bg-gray-200"
          aria-label="بازگشت"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <UserAvatar user={otherUser} size="sm" className="rounded-full border-2 border-white shadow" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-gray-900">
            {otherUser?.firstName} {otherUser?.lastName}
          </h2>
          <p className="text-xs text-gray-500">
            {requestContext?.title
              ? `گفتگو درباره: ${requestContext.title}`
              : "مکالمه خصوصی"}
          </p>
        </div>
      </div>

      {requestContext ? (
        <div className="border-b border-teal-100 bg-teal-50/60 px-4 py-2 text-xs text-teal-900">
          پیام‌های این گفتگو مربوط به درخواست «{requestContext.title}» است.
        </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/50 p-4">
        {messages.length === 0 && !loading ? (
          <p className="text-center text-sm text-gray-500">
            هنوز پیامی رد و بدل نشده. اولین پیام را بفرستید.
          </p>
        ) : null}
        {messages.map((msg) => {
          const isMe = Number(msg.senderId) === Number(meId);
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 sm:max-w-[75%] ${
                  isMe
                    ? "rounded-tl-none bg-teal-500 text-white"
                    : "rounded-tr-none border border-gray-200 bg-white text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm">{msg.body}</p>
                <p className={`mt-1 text-xs ${isMe ? "text-teal-100" : "text-gray-400"}`}>
                  {formatTime(msg.createdAt)}
                  {msg.readAt && isMe ? " • ✓✓" : ""}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="shrink-0 border-t border-gray-200 bg-white p-4">
        {error ? <p className="mb-2 text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={sending}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="shrink-0 rounded-xl bg-teal-500 px-5 py-3 font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "..." : "ارسال"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ChatRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" />
        </div>
      }
    >
      <ChatRoomInner />
    </Suspense>
  );
}
