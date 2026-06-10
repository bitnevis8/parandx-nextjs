import { getPinFromAddressData } from './profileAddressUtils';

export function extractMapPoint(locationData) {
  return getPinFromAddressData(locationData);
}

export function buildMapShareLinks(lat, lng, label = '') {
  const latN = Number(lat);
  const lngN = Number(lng);
  if (!Number.isFinite(latN) || !Number.isFinite(lngN)) return null;

  const encodedLabel = encodeURIComponent(label || `${latN},${lngN}`);

  return {
    google: `https://www.google.com/maps/search/?api=1&query=${latN},${lngN}`,
    waze: `https://waze.com/ul?ll=${latN},${lngN}&navigate=yes`,
    neshan: `https://neshan.org/maps/@${latN},${lngN},16.0z,0.0p`,
    balad: `https://balad.ir/location?latitude=${latN}&longitude=${lngN}`,
    googleLabel: `https://www.google.com/maps/search/?api=1&query=${encodedLabel}&query_place_id=`,
  };
}

export const MAP_SHARE_PROVIDERS = [
  { id: 'neshan', label: 'نشان', color: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' },
  { id: 'balad', label: 'بلد', color: 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100' },
  { id: 'google', label: 'Google Maps', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' },
  { id: 'waze', label: 'Waze', color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' },
];
