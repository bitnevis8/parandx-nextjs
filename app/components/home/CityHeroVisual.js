'use client';

import { useTheme } from '../../context/ThemeContext';
import {
  resolveCityHeroBackground,
  resolveCityHeroLayout,
  resolveHeroTypeLayer,
} from '../../utils/cityHeroConfig';
import { useHeroTypeOverlays } from '../../hooks/useHeroTypeOverlays';

/** تصویر هیرو — پس‌زمینه شهر (fit + حاشیه) + لایه خدمات/کالا */
export default function CityHeroVisual({
  city = null,
  marketplace = 'services',
  alt = '',
  className = '',
}) {
  const { isDark } = useTheme();
  const overlays = useHeroTypeOverlays();
  const cityBg = resolveCityHeroBackground(city, isDark);
  const typeLayer = resolveHeroTypeLayer(marketplace, overlays);
  const layout = resolveCityHeroLayout(city, marketplace, overlays);

  const frameStyle = {
    maxWidth: `${layout.maxWidthRem}rem`,
    aspectRatio: String(layout.aspectRatio),
  };

  const cityInsetStyle = {
    padding: `${layout.cityPaddingRem}rem`,
    borderRadius: `${layout.cityRadiusRem}rem`,
  };

  const overlayStyle = {
    width: `${layout.typeWidthPercent}%`,
    height: `${layout.typeHeightPercent}%`,
  };

  return (
    <div
      className={`relative mx-auto w-full ${className}`.trim()}
      style={frameStyle}
      aria-hidden={!alt}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={cityInsetStyle}
      >
        {cityBg ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={cityBg}
            src={cityBg}
            alt=""
            className="h-full w-full object-contain object-center"
            decoding="async"
          />
        ) : (
          <div
            className="flex h-full min-h-[8rem] w-full items-center justify-center"
            aria-hidden
          />
        )}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeLayer.image}
        alt={alt}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] mx-auto max-w-none object-contain object-bottom drop-shadow-[0_8px_18px_rgba(15,23,42,0.22)] dark:drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
        style={overlayStyle}
        decoding="async"
      />
    </div>
  );
}
