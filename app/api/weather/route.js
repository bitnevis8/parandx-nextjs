import { NextResponse } from 'next/server';
import {
  buildWeatherCacheKey,
  fetchCityWeatherData,
  IRAN_WEATHER_CONFIG,
  PARAND_COORDS,
  PARAND_WEATHER_CITY,
  buildParsijooWeatherUrl,
  parseParsijooWeatherXml,
  parseWeatherCoord,
} from '../../utils/iranWeather';

const cache = new Map();

function readCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > IRAN_WEATHER_CONFIG.cacheTtlMs) {
    cache.delete(key);
    return null;
  }
  return hit.payload;
}

function writeCache(key, payload) {
  cache.set(key, { at: Date.now(), payload });
  if (cache.size > 100) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

async function tryParsijoo(cityName) {
  try {
    const response = await fetch(buildParsijooWeatherUrl(cityName), {
      headers: { Accept: 'application/xml, text/xml, */*' },
      next: { revalidate: 900 },
    });
    if (!response.ok) return null;
    const xml = await response.text();
    const parsed = parseParsijooWeatherXml(xml, cityName);
    return parsed ? { ...parsed, city: cityName } : null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cityName = (searchParams.get('city') || PARAND_WEATHER_CITY).trim();
  const lat = parseWeatherCoord(searchParams.get('lat')) ?? PARAND_COORDS.lat;
  const lng = parseWeatherCoord(searchParams.get('lng')) ?? PARAND_COORDS.lng;

  if (!cityName) {
    return NextResponse.json({ success: false, message: 'نام شهر الزامی است.' }, { status: 400 });
  }

  const cacheKey = buildWeatherCacheKey({ cityName, lat, lng });
  const cached = readCache(cacheKey);
  if (cached) {
    return NextResponse.json({ success: true, data: cached, cached: true });
  }

  try {
    const parsijoo = await tryParsijoo(cityName);
    const payload =
      parsijoo ||
      (await fetchCityWeatherData({
        lat,
        lng,
        cityName,
      }));

    if (!payload) {
      throw new Error('هیچ منبع آب‌وهوایی پاسخ نداد');
    }

    writeCache(cacheKey, payload);
    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    console.error('Weather fetch error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: 'دریافت آب و هوا ممکن نشد.' },
      { status: 502 }
    );
  }
}
