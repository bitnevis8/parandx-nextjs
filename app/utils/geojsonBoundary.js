/** @typedef {{ featureId: string, parentId: string | null, admin_level: string, name: string }} GeoFeatureProps */

export const ADMIN_LEVEL_CITY = '7';
export const ADMIN_LEVEL_CITY_IR = '8';
export const ADMIN_LEVEL_SECTION = '6';
export const ADMIN_LEVEL_NEIGHBORHOOD = '11';

function isDrawableFeature(feature) {
  const type = feature?.geometry?.type;
  return type === 'Polygon' || type === 'MultiPolygon';
}

function pickCityFeature(features, citySlug) {
  const polygons = features.filter(isDrawableFeature);
  if (!polygons.length) return null;

  const byLevel = (level) =>
    polygons.filter((f) => String(f.properties?.admin_level) === level);

  const slugHint = String(citySlug || '').trim().toLowerCase();

  const level8 = byLevel(ADMIN_LEVEL_CITY_IR);
  if (level8.length === 1) return level8[0];
  if (level8.length > 1) {
    const named = level8.find((f) => /شهر/.test(f.properties?.name || ''));
    if (named) return named;
    return level8.sort((a, b) => getGeometryArea(b.geometry) - getGeometryArea(a.geometry))[0];
  }

  const level7 = byLevel(ADMIN_LEVEL_CITY);
  const cityNamed = level7.find((f) => /^شهر\s/.test(f.properties?.name || ''));
  if (cityNamed) return cityNamed;

  if (slugHint) {
    const direct = polygons.find((f) => {
      const nameEn = String(f.properties?.name_en || '').trim().toLowerCase();
      const name = String(f.properties?.name || '').trim();
      if (nameEn && nameEn === slugHint) return true;
      if (slugHint === 'parand' && name === 'پرند') return true;
      if (slugHint === 'dezful' && name === 'شهر دزفول') return true;
      return slugifyFeatureName(name).includes(slugHint);
    });
    if (direct) return direct;
  }

  if (slugHint) {
    const slugMatch = level7.find((f) =>
      slugifyFeatureName(f.properties?.name || '').includes(slugHint)
    );
    if (slugMatch) return slugMatch;
  }

  if (level7.length === 1) return level7[0];

  const sections = byLevel(ADMIN_LEVEL_SECTION);
  if (sections.length) {
    return sections.sort((a, b) => getGeometryArea(b.geometry) - getGeometryArea(a.geometry))[0];
  }

  return polygons.sort((a, b) => getGeometryArea(b.geometry) - getGeometryArea(a.geometry))[0];
}

function needsRoleInfer(features) {
  return !features.some((f) =>
    ['6', '7', '8', '11'].includes(String(f.properties?.admin_level ?? ''))
  );
}

function inferGeoJsonRoles(features, citySlug) {
  const polygons = features.filter(isDrawableFeature);
  if (!polygons.length) return;

  const cityFeature =
    pickCityFeature(polygons, citySlug) ||
    polygons.sort((a, b) => getGeometryArea(b.geometry) - getGeometryArea(a.geometry))[0];

  features.forEach((feature) => {
    if (!isDrawableFeature(feature)) return;
    if (!feature.properties) feature.properties = {};
    if (feature === cityFeature) {
      feature.properties.admin_level = ADMIN_LEVEL_CITY_IR;
      return;
    }
    feature.properties.admin_level = ADMIN_LEVEL_SECTION;
  });
}

export function slugifyFeatureName(name) {
  if (!name || name === 'undefined') return 'unknown';
  return String(name)
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
    .slice(0, 80);
}

export function makeFeatureId(citySlug, adminLevel, name) {
  return `${citySlug}-${adminLevel}-${slugifyFeatureName(name)}`;
}

function ringContainsPoint(point, ring) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

export function pointInGeometry(point, geometry) {
  if (!geometry) return false;
  const [lng, lat] = point;

  if (geometry.type === 'Polygon') {
    const [outer, ...holes] = geometry.coordinates;
    if (!outer || !ringContainsPoint([lng, lat], outer)) return false;
    return holes.every((hole) => !ringContainsPoint([lng, lat], hole));
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some((poly) => {
      const [outer, ...holes] = poly;
      if (!outer || !ringContainsPoint([lng, lat], outer)) return false;
      return holes.every((hole) => !ringContainsPoint([lng, lat], hole));
    });
  }

  return false;
}

export function getGeometryCentroid(geometry) {
  let ring = null;

  if (geometry?.type === 'Polygon') {
    ring = geometry.coordinates[0];
  } else if (geometry?.type === 'MultiPolygon') {
    ring = geometry.coordinates[0]?.[0];
  }

  if (!ring?.length) return null;

  let sumLng = 0;
  let sumLat = 0;
  ring.forEach(([lng, lat]) => {
    sumLng += lng;
    sumLat += lat;
  });

  return [sumLng / ring.length, sumLat / ring.length];
}

function polygonArea(ring) {
  if (!ring?.length) return 0;
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    area += (xj + xi) * (yj - yi);
  }
  return Math.abs(area / 2);
}

/** مرز سطح شهر برای محدود کردن pan نقشه */
export function resolveCityBoundaryFeature(boundaryData) {
  if (!boundaryData) return null;

  if (boundaryData.city?.featureId && boundaryData.byId?.get) {
    const cityFeature = boundaryData.byId.get(boundaryData.city.featureId);
    if (cityFeature?.geometry) return cityFeature;
  }

  const drawable = (boundaryData.collection?.features || []).filter(isDrawableFeature);
  if (!drawable.length) return null;

  return drawable.sort((a, b) => getGeometryArea(b.geometry) - getGeometryArea(a.geometry))[0];
}

export function getGeometryArea(geometry) {
  if (!geometry) return 0;
  if (geometry.type === 'Polygon') {
    return polygonArea(geometry.coordinates[0] || []);
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.reduce(
      (sum, poly) => sum + polygonArea(poly[0] || []),
      0
    );
  }
  return 0;
}

export function getFeatureBounds(feature) {
  const coords = [];
  const geometry = feature?.geometry;
  if (!geometry) return null;

  const pushRing = (ring) => {
    ring.forEach(([lng, lat]) => coords.push([lat, lng]));
  };

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(pushRing);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly) => poly.forEach(pushRing));
  }

  if (!coords.length) return null;

  let minLat = coords[0][0];
  let maxLat = coords[0][0];
  let minLng = coords[0][1];
  let maxLng = coords[0][1];

  coords.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  return [[minLat, minLng], [maxLat, maxLng]];
}

/**
 * @param {import('geojson').FeatureCollection} collection
 * @param {string} citySlug
 */
export function processBoundaryCollection(collection, citySlug) {
  const idCounts = new Map();
  const rawFeatures = [...(collection.features || [])];

  if (needsRoleInfer(rawFeatures)) {
    inferGeoJsonRoles(rawFeatures, citySlug);
  }

  const makeUniqueFeatureId = (adminLevel, name) => {
    const base = makeFeatureId(citySlug, adminLevel, name);
    const seen = idCounts.get(base) || 0;
    idCounts.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  };

  const features = rawFeatures.map((feature) => {
    const adminLevel = String(feature.properties?.admin_level ?? '');
    const name = feature.properties?.name || 'unknown';

    return {
      ...feature,
      properties: {
        ...feature.properties,
        admin_level: adminLevel,
        name,
        featureId: makeUniqueFeatureId(adminLevel, name),
        parentId: null,
      },
    };
  });

  const byId = new Map(features.map((f) => [f.properties.featureId, f]));
  const city = pickCityFeature(features, citySlug);
  let sections = features.filter(
    (f) => String(f.properties.admin_level) === ADMIN_LEVEL_SECTION && isDrawableFeature(f)
  );
  const neighborhoods = features.filter(
    (f) =>
      String(f.properties.admin_level) === ADMIN_LEVEL_NEIGHBORHOOD && isDrawableFeature(f)
  );

  if (!sections.length) {
    const cityFeatureId = city?.properties?.featureId;
    sections = features.filter(
      (f) => isDrawableFeature(f) && f.properties.featureId !== cityFeatureId
    );
  }

  sections.forEach((section) => {
    section.properties.parentId = city?.properties.featureId || null;
  });

  neighborhoods.forEach((neighborhood) => {
    const centroid = getGeometryCentroid(neighborhood.geometry);
    const containingSections = centroid
      ? sections.filter((section) => pointInGeometry(centroid, section.geometry))
      : [];
    const parentSection =
      containingSections.sort(
        (a, b) => getGeometryArea(a.geometry) - getGeometryArea(b.geometry)
      )[0] || null;
    neighborhood.properties.parentId =
      parentSection?.properties.featureId || city?.properties.featureId || null;
  });

  const sectionsById = Object.fromEntries(
    sections.map((s) => [
      s.properties.featureId,
      neighborhoods
        .filter((n) => n.properties.parentId === s.properties.featureId)
        .map((n) => ({
          featureId: n.properties.featureId,
          name: n.properties.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'fa')),
    ])
  );

  return {
    citySlug,
    hasNeighborhoods: neighborhoods.length > 0,
    collection: { type: 'FeatureCollection', features },
    city: city
      ? { featureId: city.properties.featureId, name: city.properties.name }
      : null,
    sections: sections
      .map((s) => ({
        featureId: s.properties.featureId,
        name: s.properties.name,
        neighborhoods: sectionsById[s.properties.featureId] || [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fa')),
    byId,
    findFeatureAtPoint(lat, lng) {
      const point = [lng, lat];
      const hitNeighborhood = neighborhoods.find((f) => pointInGeometry(point, f.geometry));
      if (hitNeighborhood) return hitNeighborhood;
      const hitSection = sections.find((f) => pointInGeometry(point, f.geometry));
      if (hitSection) return hitSection;
      if (city && pointInGeometry(point, city.geometry)) return city;
      return null;
    },
    getActiveFeature(sectionId, neighborhoodId) {
      if (neighborhoodId && byId.has(neighborhoodId)) return byId.get(neighborhoodId);
      if (sectionId && byId.has(sectionId)) return byId.get(sectionId);
      return city;
    },
    getSelectionFromFeature(feature) {
      if (!feature) return { sectionId: '', neighborhoodId: '' };
      const level = feature.properties.admin_level;
      const featureId = feature.properties.featureId;

      if (level === ADMIN_LEVEL_NEIGHBORHOOD) {
        return {
          sectionId: feature.properties.parentId || '',
          neighborhoodId: featureId,
        };
      }
      if (level === ADMIN_LEVEL_SECTION) {
        return { sectionId: featureId, neighborhoodId: '' };
      }
      if (sections.some((s) => s.properties.featureId === featureId)) {
        return { sectionId: featureId, neighborhoodId: '' };
      }
      return { sectionId: '', neighborhoodId: '' };
    },
  };
}

/** استخراج انتخاب نقشه از داده ذخیره‌شده */
export function getMapSelectionFromAddressData(data) {
  if (!data) return { sectionId: '', neighborhoodId: '' };
  return {
    sectionId:
      data.sectionId ||
      data.geoFeatureIds?.section ||
      data.locationData?.geoFeatureIds?.section ||
      '',
    neighborhoodId:
      data.neighborhoodId ||
      data.geoFeatureIds?.neighborhood ||
      data.locationData?.geoFeatureIds?.neighborhood ||
      '',
  };
}

/** ساختار آماده ذخیره در expert.locationData یا user.addressData */
export function buildMapAddressPayload(processed, sectionId, neighborhoodId, lat, lng, extras = {}) {
  const section = sectionId ? processed.byId.get(sectionId) : null;
  const neighborhood = neighborhoodId ? processed.byId.get(neighborhoodId) : null;
  const city = processed.city;

  const parts = [
    neighborhood?.properties.name,
    section?.properties.name,
    city?.name,
  ].filter(Boolean);

  const displayName = parts.join('، ');
  const citySlug = processed.citySlug || 'unknown';
  const pin = extras.pin || (lat != null && lng != null ? { lat, lng } : null);
  const latitude = pin?.lat ?? lat ?? null;
  const longitude = pin?.lng ?? lng ?? null;

  return {
    citySlug,
    provinceId: extras.provinceId || null,
    countyName: extras.countyName || null,
    sectionId: sectionId || null,
    neighborhoodId: neighborhoodId || null,
    sectionName: section?.properties.name || null,
    neighborhoodName: neighborhood?.properties.name || null,
    addressLine: extras.addressLine || null,
    plaque: extras.plaque || null,
    unit: extras.unit || null,
    latitude,
    longitude,
    pin,
    displayName,
    locationData: {
      lat: latitude,
      lng: longitude,
      address: displayName,
      displayName,
      citySlug,
      geoFeatureIds: {
        city: city?.featureId || null,
        section: sectionId || null,
        neighborhood: neighborhoodId || null,
      },
    },
  };
}
