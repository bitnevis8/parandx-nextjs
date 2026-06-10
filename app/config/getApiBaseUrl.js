/**
 * آدرس API.
 * dev (مرورگر): پروکسی same-origin از Next → /api/* → backend (بدون CORS و مشکل IP).
 * dev (SSR): مستقیم به localhost:3000
 */
export function getApiBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  const isDev = process.env.NODE_ENV === 'development';

  if (typeof window !== 'undefined' && isDev) {
    return '/api';
  }

  if (isDev) {
    return process.env.API_INTERNAL_URL?.replace(/\/$/, '') || 'http://127.0.0.1:3000';
  }

  return 'https://api.parandx.com';
}
