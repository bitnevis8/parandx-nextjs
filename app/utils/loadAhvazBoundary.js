import { loadCityBoundaryData } from './loadCityBoundary';

export async function loadAhvazBoundaryData() {
  return loadCityBoundaryData('ahvaz');
}

export function clearAhvazBoundaryCache() {
  import('./loadCityBoundary').then(({ clearCityBoundaryCache }) => {
    clearCityBoundaryCache('ahvaz');
  });
}
