'use client';

import MapUserLocationControl from './MapUserLocationControl';

/** @deprecated Use MapUserLocationControl */
export default function NeshanUserLocationOverlay({ mapRef }) {
  return <MapUserLocationControl mapRef={mapRef} markerEngine="neshan" />;
}
