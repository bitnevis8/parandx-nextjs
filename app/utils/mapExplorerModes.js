export const MAP_EXPLORER_MODES = {
  work: 'work',
  places: 'places',
};

export function isPlacesExplorerMode(mode) {
  return mode === MAP_EXPLORER_MODES.places;
}
