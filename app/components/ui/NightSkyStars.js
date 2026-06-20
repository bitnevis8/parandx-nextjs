'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { useTheme } from '../../context/ThemeContext';
import {
  buildStars,
  DEFAULT_NIGHT_SKY_STARS,
  mergeNightSkyConfig,
} from '../../lib/nightSkyStars';

function subscribeDark(onStoreChange) {
  if (typeof document === 'undefined') return () => {};
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getDarkSnapshot() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

function getDarkServerSnapshot() {
  return false;
}

function subscribeMobile(onStoreChange) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getMobileSnapshot() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

function getMobileServerSnapshot() {
  return false;
}

export default function NightSkyStars() {
  const [mounted, setMounted] = useState(false);
  const { isDark: themeDark } = useTheme();
  const htmlDark = useSyncExternalStore(subscribeDark, getDarkSnapshot, getDarkServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot);
  const isDark = themeDark || htmlDark;

  const [config, setConfig] = useState(DEFAULT_NIGHT_SKY_STARS);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(API_ENDPOINTS.siteSetting.nightSkyStars)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        setConfig(mergeNightSkyConfig(json.data));
      })
      .catch(() => {
        /* defaults */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const profile = isMobile ? config.mobile : config.desktop;

  const stars = useMemo(
    () => (profile.enabled ? buildStars(profile) : []),
    [profile]
  );

  if (!mounted || !isDark || !profile.enabled || !stars.length) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[1]"
      style={{
        height: `clamp(${profile.minHeightPx}px, ${profile.heightVh}vh, ${profile.maxHeightPx}px)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0c1830 0%, #071018 55%, #020617 88%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 75% 45% at 70% 8%, rgba(129,140,248,0.28) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 20% 25%, rgba(56,189,248,0.15) 0%, transparent 50%)',
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 360"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#ffffff"
            opacity={star.twinkle ? undefined : star.o}
            className={star.twinkle ? 'px-star-twinkle' : undefined}
            style={
              star.twinkle
                ? {
                    ['--star-opacity']: star.o,
                    animationDelay: `${star.delay}s`,
                    animationDuration: `${star.duration}s`,
                  }
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  );
}
