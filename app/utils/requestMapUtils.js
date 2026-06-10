import { getMapSelectionFromAddressData } from './geojsonBoundary';
import { extractMapPoint } from './mapShareLinks';
import { addressMatchesRegion } from './expertMapUtils';

export const MAP_LAYERS = {
  experts: 'experts',
  requests: 'requests',
};

export function requestMatchesCategory(request, { serviceSlug, parentSlug, categories = [] } = {}) {
  if (!serviceSlug && !parentSlug) return false;

  if (serviceSlug) {
    return request.subCategory?.slug === serviceSlug;
  }

  const main = categories.find((c) => c.slug === parentSlug);
  if (!main) return false;

  if (request.category?.slug === parentSlug) return true;

  const subSlugs = new Set((main.subcategories || []).map((sub) => sub.slug));
  return subSlugs.has(request.subCategory?.slug);
}

export function requestMatchesRegion(request, sectionId, neighborhoodId) {
  const locationData = request?.locationData;
  if (!sectionId && !neighborhoodId) return true;
  if (!locationData) return false;
  return addressMatchesRegion(locationData, sectionId, neighborhoodId);
}

export function requestMatchesExpertSpecializations(request, specializationSlugs = []) {
  if (!specializationSlugs.length) return true;
  const subSlug = request?.subCategory?.slug;
  return Boolean(subSlug && specializationSlugs.includes(subSlug));
}

export function filterRequestsForMap(
  requests,
  {
    serviceSlug,
    parentSlug,
    categories = [],
    sectionId,
    neighborhoodId,
    expertSpecializationSlugs = [],
    showOnlyMySpecializations = false,
  }
) {
  return (requests || []).filter((request) => {
    if (request.status && request.status !== 'open') return false;

    let matchesCategory = true;
    if (serviceSlug || parentSlug) {
      matchesCategory = requestMatchesCategory(request, {
        serviceSlug,
        parentSlug,
        categories,
      });
    }

    const matchesMine =
      !showOnlyMySpecializations ||
      requestMatchesExpertSpecializations(request, expertSpecializationSlugs);

    return (
      matchesCategory &&
      matchesMine &&
      requestMatchesRegion(request, sectionId, neighborhoodId)
    );
  });
}

function resolveRequestCategoryDisplay(request) {
  const sub = request?.subCategory;
  const main = request?.category;
  if (sub?.title || sub?.icon) {
    return {
      icon: sub.icon || main?.icon || '•',
      title: sub.title || main?.title || '',
    };
  }
  return {
    icon: main?.icon || '•',
    title: main?.title || '',
  };
}

function resolveRequestRegionIds(request) {
  const sel = getMapSelectionFromAddressData(request?.locationData);
  return {
    sectionId: sel.sectionId || '',
    neighborhoodId: sel.neighborhoodId || '',
  };
}

export function collectRequestMapMarkers(
  requests,
  { serviceSlug = '', parentSlug = '', categories = [] } = {}
) {
  const markers = [];

  (requests || []).forEach((request) => {
    const pin = extractMapPoint(request.locationData);
    if (!pin) return;

    const categoryDisplay = resolveRequestCategoryDisplay(request);
    const region = resolveRequestRegionIds(request);
    const title = String(request.title || 'کار ثبت‌شده').trim();
    const subCategoryTitle = String(
      request.subCategory?.title || categoryDisplay.title || ''
    ).trim();

    markers.push({
      requestId: request.id,
      lat: Number(pin.lat),
      lng: Number(pin.lng),
      title,
      subCategoryTitle,
      href: `/requests/${request.id}`,
      categoryIcon: categoryDisplay.icon,
      categoryTitle: categoryDisplay.title,
      locationLabel: request.location || '',
      status: request.status || 'open',
      bidCount: Number(request.bidCount) || 0,
      sectionId: region.sectionId,
      neighborhoodId: region.neighborhoodId,
      serviceSlug: request.subCategory?.slug || '',
      parentSlug: request.category?.slug || '',
    });
  });

  return markers;
}

export function buildRequestMapExplorerStats(filteredRequests, markers) {
  const requestCount = filteredRequests?.length ?? 0;
  const markerCount = markers?.length ?? 0;
  const requestsOnMap = new Set((markers || []).map((m) => m.requestId)).size;
  return { requestCount, markerCount, requestsOnMap };
}

export { requestMapExplorerSummaryCopy as getRequestMapExplorerSummaryCopy } from '../copy/friendlyFa';
