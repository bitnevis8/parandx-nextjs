import { API_ENDPOINTS } from '../../config/api';

export const FETCH_OPTS = { credentials: 'include' };

export function formatUserEmail(email) {
  if (!email || !String(email).trim()) {
    return { text: 'بدون ایمیل', muted: true };
  }
  return { text: email, muted: false };
}

export function formatMobile(mobile) {
  if (!mobile) return '—';
  return mobile;
}

export function userFullName(user) {
  if (!user) return '';
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'بدون نام';
}

export function hasRole(user, roleName) {
  return user?.userRoles?.some((r) => r.name === roleName) ?? false;
}

export function getRoleBadgeClass(roleName) {
  switch (roleName) {
    case 'admin':
      return 'bg-red-50 text-red-700 ring-red-200';
    case 'moderator':
      return 'bg-orange-50 text-orange-700 ring-orange-200';
    case 'expert':
      return 'bg-teal-50 text-teal-700 ring-teal-200';
    case 'customer':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-200';
  }
}

export async function fetchUserById(id) {
  const res = await fetch(API_ENDPOINTS.users.getById(id), FETCH_OPTS);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'خطا در دریافت کاربر');
  }
  return data.data;
}

export async function fetchExpertByUserId(userId) {
  const url = `${API_ENDPOINTS.experts.getUserProfile}?userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url, FETCH_OPTS);
  if (res.status === 404) return null;
  const data = await res.json();
  if (!data.success) return null;
  return data.data;
}

export async function fetchRoles() {
  const res = await fetch(API_ENDPOINTS.roles.getAll, FETCH_OPTS);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'خطا در دریافت نقش‌ها');
  }
  return data.data || [];
}

export function expertDashboardUrl(tab, userId, section) {
  const params = new URLSearchParams({ tab });
  if (userId) params.set('userId', String(userId));
  if (section) params.set('section', section);
  return `/dashboard?${params.toString()}`;
}

export function personalDashboardUrl(tab, userId) {
  const params = new URLSearchParams({ tab });
  if (userId) params.set('userId', String(userId));
  return `/dashboard?${params.toString()}`;
}

export function buildUsersListUrl({ q = '', sortBy = 'createdAt', sortOrder = 'desc' }) {
  if (q.trim()) {
    const params = new URLSearchParams({
      q: q.trim(),
      limit: '200',
      sortBy,
      sortOrder,
    });
    return `${API_ENDPOINTS.users.search}?${params.toString()}`;
  }
  const params = new URLSearchParams({ sortBy, sortOrder });
  return `${API_ENDPOINTS.users.getAll}?${params.toString()}`;
}

export function normalizeUsersListResponse(data) {
  if (!data.success) return [];
  const payload = data.data;
  if (Array.isArray(payload)) return payload;
  if (payload?.rows) return payload.rows;
  return [];
}
