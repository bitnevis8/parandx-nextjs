/** حرکت دوربین نقشه — حالت گشت شبیه بازی (MapLibre 3D) */

export const MAP_WALK_MIN_PITCH = 72;
export const MAP_WALK_MAX_PITCH = 89;
export const MAP_WALK_LOOK_PITCH = 87;
export const MAP_WALK_STREET_ZOOM = 18.5;

export const MAP_WALK_CAMERA_ALT_WALK = 2.1;
export const MAP_WALK_CAMERA_ALT_DRIVE = 1.35;

export const MAP_WALK_LOOK_SENSITIVITY = { bearing: 0.32, pitch: 0.22 };

export const MAP_WALK_BASE_PIXELS_PER_SECOND = 340;

export const MAP_WALK_SPEED_PRESETS = [
  { id: 'slow', label: 'آرام', multiplier: 0.55, mode: 'walk' },
  { id: 'normal', label: 'معمول', multiplier: 1, mode: 'walk' },
  { id: 'fast', label: 'تند', multiplier: 1.85, mode: 'drive' },
  { id: 'run', label: 'سریع', multiplier: 3.25, mode: 'drive' },
];

export const MAP_WALK_DEFAULT_SPEED_ID = 'normal';

const METERS_PER_DEG_LAT = 111_320;

export function isMapReadyForWalk(map) {
  if (!map || typeof map.getCenter !== 'function') return false;
  if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return false;

  const center = map.getCenter();
  return Number.isFinite(center?.lng) && Number.isFinite(center?.lat);
}

function normalizeLngLat(value, fallback) {
  const lng = Number(value?.lng ?? value?.[0]);
  const lat = Number(value?.lat ?? value?.[1]);
  if (Number.isFinite(lng) && Number.isFinite(lat)) {
    return { lng, lat };
  }
  return fallback;
}

function safeMapJumpTo(map, options) {
  if (!isMapReadyForWalk(map) || !options) return false;

  const center = normalizeLngLat(options.center, null);
  if (!center) return false;

  const jumpOptions = {
    center: [center.lng, center.lat],
    zoom: Number.isFinite(Number(options.zoom)) ? Number(options.zoom) : map.getZoom(),
    bearing: Number.isFinite(options.bearing) ? options.bearing : map.getBearing(),
    pitch: Number.isFinite(options.pitch) ? options.pitch : map.getPitch(),
  };

  try {
    map.jumpTo(jumpOptions);
    return true;
  } catch {
    return false;
  }
}

function safeMapEaseTo(map, options) {
  if (!isMapReadyForWalk(map) || !options) return false;

  const center = normalizeLngLat(options.center, null);
  if (!center) return false;

  const easeOptions = {
    center: [center.lng, center.lat],
    zoom: Number.isFinite(Number(options.zoom)) ? Number(options.zoom) : map.getZoom(),
    bearing: Number.isFinite(options.bearing) ? options.bearing : map.getBearing(),
    pitch: Number.isFinite(options.pitch) ? options.pitch : map.getPitch(),
    duration: Number.isFinite(options.duration) ? options.duration : 0,
    essential: options.essential ?? true,
  };

  try {
    map.stop();
    map.easeTo(easeOptions);
    return true;
  } catch {
    return false;
  }
}

export function resolveWalkPreset(speedId) {
  return (
    MAP_WALK_SPEED_PRESETS.find((item) => item.id === speedId) ??
    MAP_WALK_SPEED_PRESETS.find((item) => item.id === MAP_WALK_DEFAULT_SPEED_ID)
  );
}

export function resolveWalkModeFromSpeedId(speedId) {
  return resolveWalkPreset(speedId)?.mode === 'drive' ? 'drive' : 'walk';
}

export function resolveWalkCameraAltitude(speedId) {
  return resolveWalkModeFromSpeedId(speedId) === 'drive'
    ? MAP_WALK_CAMERA_ALT_DRIVE
    : MAP_WALK_CAMERA_ALT_WALK;
}

function metersPerPixel(zoom, lat) {
  const z = Number.isFinite(zoom) ? zoom : MAP_WALK_STREET_ZOOM;
  const cosLat = Math.cos(((Number.isFinite(lat) ? lat : 31.3) * Math.PI) / 180) || 1e-6;
  return (156543.03392 * cosLat) / Math.pow(2, z);
}

export function resolveWalkMetersPerSecond(zoom, lat, multiplier = 1) {
  const speedScale = Number.isFinite(multiplier) ? multiplier : 1;
  return MAP_WALK_BASE_PIXELS_PER_SECOND * speedScale * metersPerPixel(zoom, lat);
}

export function readMapCameraPosition(map) {
  if (!isMapReadyForWalk(map)) {
    return null;
  }

  const center = map.getCenter();
  return {
    lng: center.lng,
    lat: center.lat,
  };
}

export function applyWalkCameraView(map, { lng, lat, bearing, pitch, zoom }) {
  safeMapJumpTo(map, {
    center: { lng, lat },
    zoom: Number.isFinite(zoom) ? zoom : map.getZoom(),
    bearing,
    pitch,
  });
}

export function applyWalkStreetView(map, { speedId = MAP_WALK_DEFAULT_SPEED_ID, animate = true } = {}) {
  if (!isMapReadyForWalk(map)) return;

  const seed = readMapCameraPosition(map);
  if (!seed) return;

  safeMapEaseTo(map, {
    center: seed,
    zoom: Math.max(map.getZoom(), MAP_WALK_STREET_ZOOM),
    bearing: map.getBearing(),
    pitch: MAP_WALK_LOOK_PITCH,
    duration: animate ? 720 : 0,
    essential: true,
  });
}

export function applyWalkCameraLook(map, bearing, pitch) {
  if (!isMapReadyForWalk(map)) return;

  try {
    map.setBearing(bearing);
    map.setPitch(pitch);
  } catch {
    /* ignore unstable transform during walk */
  }
}

export function stepWalkCenter({ lat, lng, bearingDeg, forward = 0, strafe = 0, speedMeters = 3 }) {
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const dNorth = forward * Math.cos(bearingRad) - strafe * Math.sin(bearingRad);
  const dEast = forward * Math.sin(bearingRad) + strafe * Math.cos(bearingRad);
  const cosLat = Math.cos((lat * Math.PI) / 180) || 1e-6;

  return {
    lat: lat + (dNorth * speedMeters) / METERS_PER_DEG_LAT,
    lng: lng + (dEast * speedMeters) / (METERS_PER_DEG_LAT * cosLat),
  };
}

export function moveWalkCamera(map, { forward, strafe, dtSec, speedMultiplier }) {
  if (!isMapReadyForWalk(map)) return;

  const camera = readMapCameraPosition(map);
  if (!camera) return;

  const bearing = map.getBearing();
  const pitch = map.getPitch();
  const speedMeters =
    resolveWalkMetersPerSecond(map.getZoom(), camera.lat, speedMultiplier) * dtSec;

  const next = stepWalkCenter({
    lat: camera.lat,
    lng: camera.lng,
    bearingDeg: bearing,
    forward,
    strafe,
    speedMeters,
  });

  applyWalkCameraView(map, {
    lng: next.lng,
    lat: next.lat,
    bearing,
    pitch,
    zoom: map.getZoom(),
  });
}

export function isWalkMovementKey(key) {
  const normalized = String(key || '').toLowerCase();
  return (
    normalized === 'arrowup' ||
    normalized === 'arrowdown' ||
    normalized === 'arrowleft' ||
    normalized === 'arrowright' ||
    normalized === 'w' ||
    normalized === 'a' ||
    normalized === 's' ||
    normalized === 'd'
  );
}

export function readWalkInput(keys) {
  let forward = 0;
  let strafe = 0;

  if (keys.has('arrowup') || keys.has('w')) forward += 1;
  if (keys.has('arrowdown') || keys.has('s')) forward -= 1;
  if (keys.has('arrowleft') || keys.has('a')) strafe -= 1;
  if (keys.has('arrowright') || keys.has('d')) strafe += 1;

  const magnitude = Math.hypot(forward, strafe);
  if (magnitude > 1) {
    forward /= magnitude;
    strafe /= magnitude;
  }

  return { forward, strafe };
}

/** @deprecated — سازگاری با importهای قدیمی */
export const MAP_WALK_PITCH = MAP_WALK_LOOK_PITCH;

/** @deprecated — سازگاری با importهای قدیمی */
export function resolveWalkSpeed(zoom, multiplier = 1) {
  return resolveWalkMetersPerSecond(zoom, 31.3, multiplier);
}
