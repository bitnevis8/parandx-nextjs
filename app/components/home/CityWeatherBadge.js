'use client';

import { useEffect, useMemo, useState } from 'react';
import { getWeatherIcon } from '../../config/weather';
import { resolveCityMapConfig } from '../../utils/cityMapConfig';
import {
  PARAND_WEATHER_CITY,
  buildWeatherQueryParams,
} from '../../utils/iranWeather';

function formatTemp(temp, tempRaw) {
  if (tempRaw) return `${tempRaw}°`;
  if (temp == null) return '—°';
  return `${Math.round(temp)}°`;
}

function emojiFromCondition(status, iconUrl) {
  if (iconUrl) return null;
  const lower = String(status || '').toLowerCase();
  if (lower.includes('آفتاب') || lower.includes('صاف')) return '☀️';
  if (lower.includes('ابر')) return '☁️';
  if (lower.includes('باران')) return '🌧️';
  if (lower.includes('برف')) return '❄️';
  if (lower.includes('رعد')) return '⛈️';
  if (lower.includes('مه')) return '🌫️';
  return getWeatherIcon('Clear');
}

const BADGE_SHELL =
  'inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-slate-800 shadow-[0_4px_18px_rgba(15,23,42,0.07)] backdrop-blur-sm';

export default function CityWeatherBadge({
  city = null,
  cityName: cityNameProp = '',
  className = '',
  compact = false,
}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const resolvedCityName = city?.name || cityNameProp || PARAND_WEATHER_CITY;
  const mapCenter = useMemo(() => resolveCityMapConfig(city), [city]);
  const weatherKey = useMemo(
    () =>
      buildWeatherQueryParams({
        cityName: resolvedCityName,
        lat: mapCenter?.lat,
        lng: mapCenter?.lng,
      }),
    [resolvedCityName, mapCenter?.lat, mapCenter?.lng]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch(`/api/weather?${weatherKey}`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          setWeather(json.data);
          setFailed(false);
        } else if (!cancelled) {
          setWeather(null);
          setFailed(true);
        }
      } catch {
        if (!cancelled) {
          setWeather(null);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [weatherKey]);

  const badgeClass = `${BADGE_SHELL} ${className}`.trim();
  const tempClass = compact
    ? 'text-base font-bold tabular-nums text-slate-900'
    : 'text-lg font-bold tabular-nums text-slate-900 sm:text-xl';
  const statusClass = compact
    ? 'text-[11px] font-medium text-slate-500'
    : 'text-xs font-medium text-slate-500 sm:text-sm';

  if (loading) {
    return (
      <div
        className={`${badgeClass} min-w-[7.5rem] justify-center`}
        aria-busy="true"
        aria-label={`در حال دریافت آب و هوای ${resolvedCityName}`}
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  if (failed || !weather) {
    return (
      <div
        className={badgeClass}
        title={`آب و هوای ${resolvedCityName} در دسترس نیست`}
        aria-label={`آب و هوای ${resolvedCityName} نامشخص`}
      >
        <span className={compact ? 'text-base' : 'text-lg'} aria-hidden>
          🌤️
        </span>
        <span className={tempClass}>—°</span>
      </div>
    );
  }

  const fallbackEmoji = emojiFromCondition(weather.status, weather.iconUrl);
  const ariaLabel = weather.status
    ? `آب و هوای ${resolvedCityName}: ${formatTemp(weather.temp, weather.tempRaw)}، ${weather.status}`
    : `آب و هوای ${resolvedCityName}: ${formatTemp(weather.temp, weather.tempRaw)}`;

  return (
    <div className={badgeClass} title={weather.status || undefined} aria-label={ariaLabel}>
      {weather.iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={weather.iconUrl}
          alt=""
          className={`shrink-0 object-contain drop-shadow-sm ${compact ? 'h-6 w-6' : 'h-7 w-7 sm:h-8 sm:w-8'}`}
          aria-hidden
        />
      ) : (
        <span className={compact ? 'text-lg' : 'text-xl sm:text-2xl'} aria-hidden>
          {fallbackEmoji}
        </span>
      )}
      <span className={tempClass}>{formatTemp(weather.temp, weather.tempRaw)}</span>
      {weather.status ? (
        <span className={`max-w-[9rem] truncate ${statusClass}`}>{weather.status}</span>
      ) : null}
    </div>
  );
}
