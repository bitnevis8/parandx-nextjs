'use client';

import { useSyncExternalStore } from 'react';

const MOBILE_MQ = '(max-width: 767px)';

function subscribe(onChange) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function getServerSnapshot() {
  return false;
}

/** max-width 767px — هم‌تراز با Tailwind md */
export function useIsMobileViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
