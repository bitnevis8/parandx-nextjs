"use client";

import { MapPinIcon } from '@heroicons/react/24/outline';
import { ProfilePanel, ProfilePanelGroup, ProfilePanelRow } from './dashboard/ProfileViewUi';
import { getMapSelectionFromAddressData } from '../../utils/geojsonBoundary';
import { getPrimaryAddress, getPinFromAddressData } from '../../utils/profileAddressUtils';

export function ProfileAddressesPanel({ addresses, cities = [], title = 'آدرس‌ها' }) {
  const list = Array.isArray(addresses) ? addresses : [];

  if (!list.length) {
    return (
      <ProfilePanel flush>
        <ProfilePanelGroup title={title}>
          <ProfilePanelRow icon={MapPinIcon} label="آدرس" value={null} emptyText="ثبت نشده" />
        </ProfilePanelGroup>
      </ProfilePanel>
    );
  }

  return (
    <ProfilePanel flush>
      {list.map((addr, index) => {
        const cityName = cities.find((c) => String(c.id) === String(addr.cityId))?.name;
        const provinceName = cities.find((c) => String(c.id) === String(addr.cityId))?.province;
        const label = addr.title || (addr.isPrimary ? 'آدرس اصلی' : `آدرس ${index + 1}`);
        const summary = [provinceName, cityName, addr.addressLine].filter(Boolean).join(' · ');

        return (
          <ProfilePanelGroup key={addr.id || index} title={label}>
            {addr.isPrimary ? (
              <ProfilePanelRow icon={MapPinIcon} label="نوع" value="آدرس اصلی" />
            ) : null}
            <ProfilePanelRow icon={MapPinIcon} label="استان" value={provinceName} emptyText="—" />
            <ProfilePanelRow icon={MapPinIcon} label="شهر" value={cityName} emptyText="—" />
            <ProfilePanelRow icon={MapPinIcon} label="آدرس" value={addr.addressLine || summary} emptyText="—" />
            <ProfilePanelRow icon={MapPinIcon} label="پلاک" value={addr.plaque} emptyText="—" />
            <ProfilePanelRow icon={MapPinIcon} label="واحد" value={addr.unit} emptyText="—" />
            <ProfilePanelRow
              icon={MapPinIcon}
              label="کد پستی"
              value={addr.postalCode}
              dir="ltr"
              emptyText="—"
            />
          </ProfilePanelGroup>
        );
      })}
    </ProfilePanel>
  );
}

export function getPrimaryAddressMapProps(addresses, cities = []) {
  const primary = getPrimaryAddress(addresses);
  if (!primary) return { city: null, mapSelection: null, pinPosition: null };

  const city =
    cities.find((c) => String(c.id) === String(primary.cityId)) || null;

  return {
    city,
    mapSelection: getMapSelectionFromAddressData(primary.addressData),
    pinPosition: getPinFromAddressData(primary.addressData),
    primary,
  };
}
