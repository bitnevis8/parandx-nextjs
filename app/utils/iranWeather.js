import { WEATHER_CONFIG } from '../config/weather';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ENGLISH_DIGITS = '0123456789';

export const PARAND_WEATHER_CITY = 'پرند';

export const PARAND_COORDS = { lat: 35.483162, lng: 50.930349 };

export const IRAN_WEATHER_CONFIG = {
  cacheTtlMs: 15 * 60 * 1000,
  erisUrl: 'https://weather-api.madadipouya.com/v1/weather/current',
  openMeteoUrl: 'https://api.open-meteo.com/v1/forecast',
};

const WMO_STATUS_FA = {
  0: 'صاف',
  1: 'عمدتاً صاف',
  2: 'نیمه‌ابری',
  3: 'ابری',
  45: 'مه',
  48: 'مه',
  51: 'نم‌نم باران',
  53: 'نم‌نم باران',
  55: 'نم‌نم باران',
  61: 'بارانی',
  63: 'بارانی',
  65: 'باران شدید',
  71: 'برفی',
  73: 'برفی',
  75: 'برف سنگین',
  80: 'رگبار',
  95: 'رعد و برق',
};

export function toEnglishDigits(value) {
  return String(value ?? '').replace(/[۰-۹]/g, (char) => {
    const index = PERSIAN_DIGITS.indexOf(char);
    return index >= 0 ? ENGLISH_DIGITS[index] : char;
  });
}

export function toPersianDigits(value) {
  return String(value ?? '').replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function parsePersianNumber(value) {
  const normalized = toEnglishDigits(value).replace(/[^\d.-]/g, '');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

export function parseWeatherCoord(value) {
  if (value == null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function readXmlTag(xml, tag) {
  const match = String(xml || '').match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

export function parseParsijooWeatherXml(xml, fallbackCityName = PARAND_WEATHER_CITY) {
  const tempRaw = readXmlTag(xml, 'temp');
  const temp = parsePersianNumber(tempRaw);
  const status = readXmlTag(xml, 'status');
  const cityName = readXmlTag(xml, 'city-name') || fallbackCityName;
  const symbol = readXmlTag(xml, 'symbol');

  if (temp == null && !status) return null;

  return {
    temp,
    tempRaw: tempRaw || (temp != null ? toPersianDigits(Math.round(temp)) : null),
    status: status || null,
    cityName,
    iconUrl: symbol
      ? `https://cdn.parsijoo.ir/static/home/source/cdn/images/services/weather/${symbol}.png`
      : null,
    provider: 'parsijoo',
  };
}

function normalizeWeatherPayload({ temp, status, iconUrl, cityName, provider }) {
  if (temp == null) return null;
  const rounded = Math.round(temp);
  return {
    temp,
    tempRaw: toPersianDigits(rounded),
    status: status || null,
    cityName: cityName || PARAND_WEATHER_CITY,
    iconUrl: iconUrl || null,
    provider,
  };
}

function mapMainToPersianStatus(main) {
  const map = {
    Clear: 'آفتابی',
    Clouds: 'ابری',
    Rain: 'بارانی',
    Drizzle: 'نم‌نم باران',
    Snow: 'برفی',
    Thunderstorm: 'رعد و برق',
    Mist: 'مه‌آلود',
    Fog: 'مه',
    Haze: 'غبار',
    Dust: 'گرد و غبار',
  };
  return map[main] || main || 'نامشخص';
}

function resolveCoords({ lat, lng }) {
  const resolvedLat = parseWeatherCoord(lat);
  const resolvedLng = parseWeatherCoord(lng);
  if (resolvedLat == null || resolvedLng == null) return null;
  return { lat: resolvedLat, lng: resolvedLng };
}

async function fetchFromOpenWeather(coords, cityName) {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lng),
    appid: WEATHER_CONFIG.API_KEY,
    units: WEATHER_CONFIG.UNITS,
    lang: WEATHER_CONFIG.LANGUAGE,
  });

  const response = await fetch(`${WEATHER_CONFIG.CURRENT_WEATHER_URL}?${params.toString()}`, {
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`OpenWeather ${response.status}`);

  const data = await response.json();
  const current = data.weather?.[0];
  if (!current || data.main?.temp == null) return null;

  return normalizeWeatherPayload({
    temp: data.main.temp,
    status: current.description,
    iconUrl: current.icon ? `https://openweathermap.org/img/wn/${current.icon}@2x.png` : null,
    cityName,
    provider: 'openweather',
  });
}

async function fetchFromEris(coords, cityName) {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lng),
  });

  const response = await fetch(`${IRAN_WEATHER_CONFIG.erisUrl}?${params.toString()}`, {
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`Eris ${response.status}`);

  const data = await response.json();
  const temp = data.temperature ?? data.main?.temp;
  const current = data.weather?.[0];
  if (temp == null) return null;

  const status =
    current?.description && /[\u0600-\u06FF]/.test(current.description)
      ? current.description
      : mapMainToPersianStatus(current?.main);

  return normalizeWeatherPayload({
    temp,
    status,
    iconUrl: data.icon || (current?.icon ? `https://openweathermap.org/img/wn/${current.icon}@2x.png` : null),
    cityName,
    provider: 'eris',
  });
}

async function fetchFromOpenMeteo(coords, cityName) {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lng),
    current: 'temperature_2m,weather_code',
    timezone: 'Asia/Tehran',
  });

  const response = await fetch(`${IRAN_WEATHER_CONFIG.openMeteoUrl}?${params.toString()}`, {
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`OpenMeteo ${response.status}`);

  const data = await response.json();
  const temp = data.current?.temperature_2m;
  const code = data.current?.weather_code;
  if (temp == null) return null;

  return normalizeWeatherPayload({
    temp,
    status: WMO_STATUS_FA[code] || 'نامشخص',
    iconUrl: null,
    cityName,
    provider: 'open-meteo',
  });
}

/** چند منبع — اول OpenWeather با متن فارسی، بعد Eris، بعد Open-Meteo */
export async function fetchCityWeatherData({ lat, lng, cityName = PARAND_WEATHER_CITY }) {
  const coords = resolveCoords({ lat, lng });
  if (!coords) {
    throw new Error('مختصات شهر نامعتبر است');
  }

  const providers = [
    () => fetchFromOpenWeather(coords, cityName),
    () => fetchFromEris(coords, cityName),
    () => fetchFromOpenMeteo(coords, cityName),
  ];

  let lastError = null;
  for (const provider of providers) {
    try {
      const data = await provider();
      if (data) return data;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return null;
}

/** @deprecated use fetchCityWeatherData */
export async function fetchParandWeatherData() {
  return fetchCityWeatherData({
    lat: PARAND_COORDS.lat,
    lng: PARAND_COORDS.lng,
    cityName: PARAND_WEATHER_CITY,
  });
}

export function buildWeatherCacheKey({ cityName, lat, lng }) {
  return `${cityName}|${lat ?? ''}|${lng ?? ''}`;
}

export function buildParsijooWeatherUrl(cityName) {
  const params = new URLSearchParams({
    serviceType: 'weather-API',
    q: cityName,
  });
  return `http://parsijoo.ir/api?${params.toString()}`;
}

export function buildWeatherQueryParams({ cityName, lat, lng }) {
  const params = new URLSearchParams({ city: cityName });
  if (lat != null && lng != null) {
    params.set('lat', String(lat));
    params.set('lng', String(lng));
  }
  return params.toString();
}
