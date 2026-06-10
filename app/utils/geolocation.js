const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
};

const MOBILE_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 22000,
  maximumAge: 120000,
};

function normalizePosition(position) {
  const lat = Number(position?.coords?.latitude ?? position?.latitude);
  const lng = Number(position?.coords?.longitude ?? position?.longitude);
  const accuracy = Number(position?.coords?.accuracy ?? position?.accuracy);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw createGeoError('POSITION_INVALID', 'invalid-coords');
  }

  return {
    lat,
    lng,
    accuracy: Number.isFinite(accuracy) ? accuracy : null,
  };
}

export function createGeoError(code, message = code) {
  return Object.assign(new Error(message), { code });
}

export function isNativeCapacitorApp() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

export function isMobileLikeDevice() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(max-width: 767px)')?.matches) return true;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator?.userAgent || '');
}

export async function queryGeolocationPermissionState() {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'unknown';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'unknown';
  }
}

/** باز کردن تنظیمات اپ — فقط Capacitor native */
export async function openNativeLocationSettings() {
  if (!isNativeCapacitorApp()) return false;

  try {
    const { App } = await import('@capacitor/app');
    if (typeof App.openAppSettings === 'function') {
      await App.openAppSettings();
      return true;
    }
  } catch {
    /* plugin not installed or web build */
  }

  return false;
}

function getBrowserPosition(options) {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(createGeoError('UNSUPPORTED', 'unsupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(normalizePosition(position)),
      (error) => {
        const code =
          error?.code === 1
            ? 'PERMISSION_DENIED'
            : error?.code === 2
              ? 'POSITION_UNAVAILABLE'
              : error?.code === 3
                ? 'TIMEOUT'
                : 'GEO_FAILED';
        reject(createGeoError(code, error?.message || 'geo-failed'));
      },
      options
    );
  });
}

async function getBrowserPositionWithRetry(options) {
  try {
    return await getBrowserPosition(options);
  } catch (error) {
    if (error?.code === 'PERMISSION_DENIED' || error?.code === 'UNSUPPORTED') {
      throw error;
    }

    return getBrowserPosition({
      ...options,
      enableHighAccuracy: false,
      timeout: Math.max(Number(options.timeout) || 15000, 25000),
      maximumAge: Math.max(Number(options.maximumAge) || 0, 300000),
    });
  }
}

async function getCapacitorPosition(options) {
  const { Geolocation } = await import('@capacitor/geolocation');
  const permission = await Geolocation.checkPermissions();

  if (permission.location !== 'granted') {
    const requested = await Geolocation.requestPermissions();
    if (requested.location !== 'granted') {
      await openNativeLocationSettings();
      throw createGeoError('PERMISSION_DENIED', 'permission-denied');
    }
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: options.enableHighAccuracy,
    timeout: options.timeout,
    maximumAge: options.maximumAge,
  });

  return normalizePosition(position);
}

function resolveOptions(options = {}) {
  const mobile = options.isMobile ?? isMobileLikeDevice();
  const base = mobile ? MOBILE_OPTIONS : DEFAULT_OPTIONS;
  return { ...base, ...options, isMobile: mobile };
}

/**
 * موقعیت فعلی — روی وب، getCurrentPosition بلافاصله (بدون await قبلی) برای iOS/Android.
 * @returns {Promise<{ lat: number, lng: number, accuracy: number|null }>}
 */
export function getCurrentPosition(options = {}) {
  const merged = resolveOptions(options);

  if (isNativeCapacitorApp()) {
    return getCapacitorPosition(merged);
  }

  return getBrowserPositionWithRetry(merged);
}

export function formatCoordsLabel(lat, lng, decimals = 5) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '—';
  return `${lat.toFixed(decimals)}°, ${lng.toFixed(decimals)}°`;
}

export function formatAccuracyLabel(accuracyMeters) {
  if (!Number.isFinite(accuracyMeters)) return null;
  if (accuracyMeters < 1000) return `دقت تقریبی: ${Math.round(accuracyMeters)} متر`;
  return `دقت تقریبی: ${(accuracyMeters / 1000).toFixed(1)} کیلومتر`;
}

export function formatGeoErrorMessage(error, { mobile = false } = {}) {
  switch (error?.code) {
    case 'PERMISSION_DENIED':
      return mobile
        ? null
        : 'اجازهٔ موقعیت داده نشد. در نوار آدرس مرورگر روی آیکون قفل بزنید و Location را Allow کنید.';
    case 'POSITION_UNAVAILABLE':
      return mobile
        ? 'GPS فعال نیست یا سیگنال ضعیف است.'
        : 'موقعیت فعلی در دسترس نیست. GPS یا اینترنت را بررسی کنید.';
    case 'TIMEOUT':
      return 'دریافت موقعیت طول کشید. دوباره بزنید.';
    case 'UNSUPPORTED':
      return 'این مرورگر از موقعیت‌یابی پشتیبانی نمی‌کند.';
    default:
      return 'موقعیت دریافت نشد. دوباره تلاش کنید.';
  }
}

export function shouldShowGeoError(error, { mobile = false } = {}) {
  if (!error) return false;
  if (error.code === 'PERMISSION_DENIED' && mobile && !isNativeCapacitorApp()) {
    return false;
  }
  return Boolean(formatGeoErrorMessage(error, { mobile }));
}
