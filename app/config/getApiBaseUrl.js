/**
 * آدرس API.
 * dev (مرورگر): پروکسی same-origin از Next → /api/* → backend (بدون CORS و مشکل IP).
 * dev (SSR): مستقیم به localhost:3000
 */
export function getApiBaseUrl() {
  // مرورگر: همیشه same-origin — بدون CORS (rewrite در next.config)
  if (typeof window !== 'undefined') {
    return '/api';
  }

  const fromEnv =
    process.env.API_INTERNAL_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (fromEnv) return fromEnv;

  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:3007';
}
