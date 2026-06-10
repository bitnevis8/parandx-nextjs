/** MapLibre + OpenFreeMap — تنظیمات مشترک ۲D/۳D */

export const OPENFREEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

export const MAP_2D_PITCH = 0;
export const MAP_2D_BEARING = 0;
export const MAP_3D_PITCH = 60;
export const MAP_MAX_PITCH = 85;

export const BOUNDARY_LINE_MUTED = '#7dd3c7';
export const BOUNDARY_LINE_SELECTED = '#0d9488';
export const BOUNDARY_LINE_HOVER = '#2dd4bf';

export const FILLED_BOUNDARY_PAINT = {
  light: {
    lineColor: '#94a3b8',
    lineWidth: 1.25,
    fillColor: '#cbd5e1',
    fillOpacity: 0.18,
  },
  selected: {
    lineColor: '#0891b2',
    lineWidth: 2.5,
    fillColor: '#06b6d4',
    fillOpacity: 0.38,
  },
  hover: {
    lineColor: '#64748b',
    lineWidth: 2,
    fillColor: '#94a3b8',
    fillOpacity: 0.28,
  },
};

export const OUTLINE_BOUNDARY_PAINT = {
  light: {
    lineColor: BOUNDARY_LINE_MUTED,
    lineWidth: 1.75,
    fillColor: BOUNDARY_LINE_MUTED,
    fillOpacity: 0,
  },
  selected: {
    lineColor: BOUNDARY_LINE_SELECTED,
    lineWidth: 3,
    fillColor: BOUNDARY_LINE_SELECTED,
    fillOpacity: 0,
  },
  hover: {
    lineColor: BOUNDARY_LINE_HOVER,
    lineWidth: 2.25,
    fillColor: BOUNDARY_LINE_HOVER,
    fillOpacity: 0,
  },
};

export function resolveBoundaryPaint(variant = 'filled') {
  return variant === 'outline' ? OUTLINE_BOUNDARY_PAINT : FILLED_BOUNDARY_PAINT;
}

export function getMapView(show3D, overrides = {}) {
  if (!show3D) {
    return { pitch: MAP_2D_PITCH, bearing: MAP_2D_BEARING };
  }

  const pitchOverride = parseCoord(overrides.pitch);
  const bearingOverride = parseCoord(overrides.bearing);

  if (pitchOverride != null || bearingOverride != null) {
    return {
      pitch: pitchOverride > 0 ? pitchOverride : MAP_3D_PITCH,
      bearing: bearingOverride ?? MAP_2D_BEARING,
    };
  }

  return { pitch: MAP_3D_PITCH, bearing: MAP_2D_BEARING };
}

function parseCoord(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
