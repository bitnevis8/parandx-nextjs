/** درخواست‌های احراز هویت‌شده از مرورگر — از پروکسی same-origin استفاده می‌کند */
export const fetchAuth = { credentials: 'include' };

export async function parseApiResponse(res) {
  const text = await res.text();
  if (!text) {
    return { success: false, message: `پاسخ خالی از سرور (${res.status})` };
  }
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: `خطا در پردازش پاسخ سرور (${res.status})`,
    };
  }
}

export function clientBidStatusUrl(bidId) {
  return `/api/bid/${bidId}/status`;
}

export function clientRequestStatusUrl(requestId) {
  return `/api/request/${requestId}/status`;
}

export function clientMessageSendUrl() {
  return '/api/message/send';
}

export function clientConversationUrl(userId, requestId) {
  const params = new URLSearchParams({ limit: '100', offset: '0' });
  if (requestId) params.set('requestId', String(requestId));
  return `/api/message/conversation/${userId}?${params.toString()}`;
}
