import { getMapSelectionFromAddressData } from './geojsonBoundary';

function toCoord(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function getPinFromAddressData(data) {
  if (!data || typeof data !== 'object') return null;

  if (data.pin?.lat != null && data.pin?.lng != null) {
    const lat = toCoord(data.pin.lat);
    const lng = toCoord(data.pin.lng);
    if (lat != null && lng != null) return { lat, lng };
  }

  if (data.latitude != null && data.longitude != null) {
    const lat = toCoord(data.latitude);
    const lng = toCoord(data.longitude);
    if (lat != null && lng != null) return { lat, lng };
  }

  if (data.lat != null && data.lng != null) {
    const lat = toCoord(data.lat);
    const lng = toCoord(data.lng);
    if (lat != null && lng != null) return { lat, lng };
  }

  if (data.locationData?.lat != null && data.locationData?.lng != null) {
    const lat = toCoord(data.locationData.lat);
    const lng = toCoord(data.locationData.lng);
    if (lat != null && lng != null) return { lat, lng };
  }

  const mapPayload = data.mapPayload;
  if (mapPayload?.latitude != null && mapPayload?.longitude != null) {
    const lat = toCoord(mapPayload.latitude);
    const lng = toCoord(mapPayload.longitude);
    if (lat != null && lng != null) return { lat, lng };
  }

  const mapNested = mapPayload?.locationData;
  if (mapNested?.lat != null && mapNested?.lng != null) {
    const lat = toCoord(mapNested.lat);
    const lng = toCoord(mapNested.lng);
    if (lat != null && lng != null) return { lat, lng };
  }

  return null;
}

/** یکسان‌سازی ساختار ذخیره‌شده برای نمایش روی نقشه و API */
export function normalizeStoredAddressData(data, { citySlug, cityId } = {}) {
  if (!data || typeof data !== 'object') return null;

  const pin = getPinFromAddressData(data);
  const lat = pin?.lat ?? null;
  const lng = pin?.lng ?? null;
  const resolvedCitySlug =
    data.citySlug || data.locationData?.citySlug || citySlug || null;
  const resolvedCityId = data.cityId || cityId || null;
  const displayName =
    data.displayName || data.locationData?.displayName || data.neighborhoodName || null;
  const geoFeatureIds =
    data.geoFeatureIds ||
    data.locationData?.geoFeatureIds ||
    (data.sectionId || data.neighborhoodId
      ? {
          section: data.sectionId || null,
          neighborhood: data.neighborhoodId || null,
        }
      : null);

  return {
    ...data,
    citySlug: resolvedCitySlug,
    cityId: resolvedCityId,
    sectionId:
      data.sectionId || geoFeatureIds?.section || data.locationData?.geoFeatureIds?.section || null,
    neighborhoodId:
      data.neighborhoodId ||
      geoFeatureIds?.neighborhood ||
      data.locationData?.geoFeatureIds?.neighborhood ||
      null,
    displayName,
    geoFeatureIds,
    pin: pin || data.pin || null,
    latitude: lat ?? data.latitude ?? null,
    longitude: lng ?? data.longitude ?? null,
    locationData: {
      ...(data.locationData || {}),
      lat: lat ?? data.locationData?.lat ?? data.lat ?? null,
      lng: lng ?? data.locationData?.lng ?? data.lng ?? null,
      citySlug: resolvedCitySlug,
      displayName,
      geoFeatureIds: geoFeatureIds || data.locationData?.geoFeatureIds || null,
    },
  };
}

export function resolveProvinceIdForCity(cityId, cities = []) {
  if (!cityId || !Array.isArray(cities) || cities.length === 0) return '';
  const city = cities.find((c) => String(c.id) === String(cityId));
  return city?.provinceId || '';
}

export function parseProfileAddress(profile) {
  const data = profile?.addressData || profile?.locationData || {};
  const city = profile?.city;
  const cityId = profile?.cityId || data.cityId || '';

  return {
    provinceId: data.provinceId || city?.provinceId || '',
    countyName: data.countyName || '',
    cityId,
    addressLine: profile?.address || profile?.location || data.addressLine || '',
    plaque: profile?.plaque || data.plaque || '',
    unit: profile?.unit || data.unit || '',
    postalCode: profile?.postalCode || '',
    mapSelection: getMapSelectionFromAddressData(data),
    pinPosition: getPinFromAddressData(data),
    regionLabel:
      data.displayName ||
      data.locationData?.displayName ||
      data.neighborhoodName ||
      null,
    latitude: data.latitude ?? data.lat ?? data.pin?.lat ?? data.locationData?.lat ?? null,
    longitude: data.longitude ?? data.lng ?? data.pin?.lng ?? data.locationData?.lng ?? null,
    rawData: data,
  };
}

export function mergeAddressPayload(mapPayload, extras = {}) {
  const {
    provinceId,
    countyName,
    addressLine,
    plaque,
    unit,
    pinPosition,
    citySlug,
    cityId,
  } = extras;

  const pin = pinPosition?.lat != null ? pinPosition : mapPayload?.pin || null;
  const lat = pin?.lat ?? mapPayload?.latitude ?? mapPayload?.lat ?? null;
  const lng = pin?.lng ?? mapPayload?.longitude ?? mapPayload?.lng ?? null;
  const resolvedCitySlug =
    citySlug || mapPayload?.citySlug || mapPayload?.locationData?.citySlug || null;

  return normalizeStoredAddressData(
    {
      ...(mapPayload || {}),
      provinceId: provinceId || mapPayload?.provinceId || null,
      countyName: countyName || mapPayload?.countyName || null,
      addressLine: addressLine || mapPayload?.addressLine || null,
      plaque: plaque || mapPayload?.plaque || null,
      unit: unit || mapPayload?.unit || null,
      pin,
      latitude: lat,
      longitude: lng,
      citySlug: resolvedCitySlug,
      cityId: cityId || mapPayload?.cityId || null,
    },
    { citySlug: resolvedCitySlug, cityId: cityId || mapPayload?.cityId || null }
  );
}

export function formatFullAddressLine({ addressLine, plaque, unit, postalCode }) {
  const parts = [addressLine].filter(Boolean);
  if (plaque) parts.push(`پلاک ${plaque}`);
  if (unit) parts.push(`واحد ${unit}`);
  if (postalCode) parts.push(`کدپستی ${postalCode}`);
  return parts.join(' · ') || null;
}

export const EXPERT_STATUS_LABELS = {
  pending: 'در انتظار بررسی',
  approved: 'تایید شده',
  rejected: 'رد شده',
  suspended: 'تعلیق شده',
};

export const IDENTITY_STATUS_LABELS = {
  none: 'ثبت نشده',
  pending: 'در انتظار بررسی',
  approved: 'تایید شده',
  rejected: 'رد شده',
};

export const MAX_PROFILE_ADDRESSES = 10;

export function createAddressId() {
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyAddress({ title = 'آدرس اصلی', isPrimary = false } = {}) {
  return {
    id: createAddressId(),
    title,
    isPrimary,
    provinceId: '',
    countyName: '',
    cityId: '',
    addressLine: '',
    plaque: '',
    unit: '',
    postalCode: '',
    addressData: null,
  };
}

/** تبدیل فیلدهای تکی قدیمی به آرایهٔ آدرس */
export function addressesFromLegacyProfile(profile, { lineField = 'address', dataField = 'addressData' } = {}) {
  const parsed = parseProfileAddress({
    ...profile,
    address: profile?.[lineField],
    addressData: profile?.[dataField],
  });

  const hasContent =
    parsed.cityId ||
    parsed.addressLine ||
    parsed.provinceId ||
    parsed.rawData;

  if (!hasContent) return [];

  return [
    {
      id: createAddressId(),
      title: 'آدرس اصلی',
      isPrimary: true,
      provinceId: parsed.provinceId || '',
      countyName: parsed.countyName || '',
      cityId: parsed.cityId || '',
      addressLine: parsed.addressLine || '',
      plaque: parsed.plaque || '',
      unit: parsed.unit || '',
      postalCode: parsed.postalCode || '',
      addressData: parsed.rawData
        ? normalizeStoredAddressData(parsed.rawData, { cityId: parsed.cityId })
        : null,
    },
  ];
}

export function normalizeProfileAddresses(raw, legacyProfile, legacyOptions) {
  const legacyDataField = legacyOptions?.dataField || 'locationData';
  const legacyLocation =
    legacyProfile?.[legacyDataField] || legacyProfile?.locationData || null;
  const legacyCitySlug = legacyProfile?.city?.slug || null;

  if (Array.isArray(raw) && raw.length > 0) {
    const list = raw.slice(0, MAX_PROFILE_ADDRESSES).map((item, index) => {
      const source =
        item?.addressData || (item?.isPrimary || index === 0 ? legacyLocation : null);
      const addressData = source
        ? normalizeStoredAddressData(source, {
            cityId: item?.cityId,
            citySlug: legacyCitySlug,
          })
        : null;

      return {
        id: item?.id || createAddressId(),
        title: item?.title || (index === 0 ? 'آدرس اصلی' : `آدرس ${index + 1}`),
        isPrimary: Boolean(item?.isPrimary),
        provinceId: item?.provinceId || '',
        countyName: item?.countyName || '',
        cityId: item?.cityId || '',
        addressLine: item?.addressLine || '',
        plaque: item?.plaque || '',
        unit: item?.unit || '',
        postalCode: item?.postalCode || '',
        addressData,
      };
    });

    if (!list.some((a) => a.isPrimary)) {
      list[0].isPrimary = true;
    }
    return list;
  }

  const legacy = addressesFromLegacyProfile(legacyProfile, legacyOptions);
  return legacy.length ? legacy : [createEmptyAddress({ title: 'آدرس اصلی', isPrimary: true })];
}

export function getPrimaryAddress(addresses = []) {
  if (!Array.isArray(addresses) || !addresses.length) return null;
  return addresses.find((a) => a.isPrimary) || addresses[0];
}

export function setPrimaryAddress(addresses, primaryId) {
  return addresses.map((a) => ({ ...a, isPrimary: a.id === primaryId }));
}

export function syncLegacyFieldsFromPrimary(addresses, lineField = 'address') {
  const primary = getPrimaryAddress(addresses);
  if (!primary) {
    return {
      cityId: null,
      [lineField]: null,
      postalCode: null,
      plaque: null,
      unit: null,
      addressData: null,
      locationData: null,
    };
  }

  const formatted = formatFullAddressLine(primary) || primary.addressLine?.trim() || null;
  const normalizedData = primary.addressData
    ? normalizeStoredAddressData(primary.addressData, { cityId: primary.cityId })
    : null;

  return {
    cityId: primary.cityId ? Number(primary.cityId) : null,
    [lineField]: formatted,
    postalCode: primary.postalCode?.trim() || null,
    plaque: primary.plaque?.trim() || null,
    unit: primary.unit?.trim() || null,
    addressData: normalizedData,
    locationData: normalizedData,
  };
}

export function formatAddressSummary(address, cities = []) {
  if (!address) return null;
  const cityName = cities.find((c) => String(c.id) === String(address.cityId))?.name;
  const parts = [
    address.title !== 'آدرس اصلی' ? address.title : null,
    cityName,
    address.addressLine,
  ].filter(Boolean);
  return parts.join(' · ') || null;
}
