'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'parandx_selected_city_id';

const CityContext = createContext();

export { CityContext };

function readStoredCityId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

/** انتخاب شهر: اول localStorage (انتخاب صریح کاربر)، بعد پروفایل، بعد پیش‌فرض */
function resolveSelectedCity(list, user) {
  if (!list?.length) return null;

  const storedId = readStoredCityId();
  if (storedId) {
    const fromStorage = list.find((c) => String(c.id) === String(storedId));
    if (fromStorage) return fromStorage;
  }

  if (user?.city?.id) {
    const fromProfileCity = list.find((c) => c.id === user.city.id);
    if (fromProfileCity) return fromProfileCity;
  }

  if (user?.cityId) {
    const fromProfileId = list.find((c) => String(c.id) === String(user.cityId));
    if (fromProfileId) return fromProfileId;
  }

  return list.find((c) => c.slug === 'parand') || list[0];
}

export function CityProvider({ children }) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCityState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const applyCity = useCallback((city) => {
    if (!city) return;
    setSelectedCityState(city);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(city.id));
    }
  }, []);

  const fetchCities = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.cities.getAll, { cache: 'no-store' });
      if (!res.ok) {
        console.error('Error fetching cities: HTTP', res.status, API_ENDPOINTS.cities.getAll);
        return [];
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCities(data.data);
        return data.data;
      }
    } catch (err) {
      console.error(
        'Error fetching cities (API در دسترس نیست؟ backend روی پورت 3000 را اجرا کنید):',
        err?.message || err,
        API_ENDPOINTS.cities.getAll
      );
    }
    return [];
  }, []);

  const syncCityToProfile = useCallback(
    async (city) => {
      if (!isAuthenticated || !user?.mobile) return;

      try {
        const body = {
          firstName: user.firstName,
          lastName: user.lastName,
          mobile: user.mobile,
          cityId: city.id,
        };
        if (user.email !== undefined) body.email = user.email || null;
        if (user.nationalId) body.nationalId = user.nationalId;

        const res = await fetch(API_ENDPOINTS.users.updateCurrentProfile, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        });
        if (res.ok) {
          await refreshUser();
        }
      } catch (err) {
        console.error('Error syncing city to profile:', err);
      }
    },
    [isAuthenticated, user, refreshUser]
  );

  const setSelectedCity = useCallback(
    async (city) => {
      if (!city) return;
      applyCity(city);
      setShowPicker(false);
      await syncCityToProfile(city);
    },
    [applyCity, syncCityToProfile]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      const list = await fetchCities();
      if (cancelled) return;

      const city = resolveSelectedCity(list, user);
      if (city) {
        applyCity(city);
      }

      const hadStored = readStoredCityId();
      if (!hadStored && !user?.cityId && list.length > 1) {
        setShowPicker(true);
      }

      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [user?.cityId, user?.city?.id, fetchCities, applyCity]);

  return (
    <CityContext.Provider
      value={{
        cities,
        selectedCity,
        setSelectedCity,
        loading,
        showPicker,
        setShowPicker,
        refreshCities: fetchCities,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}

export function getStoredCityId() {
  return readStoredCityId();
}
