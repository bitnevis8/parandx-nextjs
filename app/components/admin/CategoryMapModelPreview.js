'use client';

import { useEffect, useState } from 'react';
import { ensureModelViewerLoaded } from '../../utils/mapGlbMarkerUi';

export default function CategoryMapModelPreview({ url, config, mode = '3d' }) {
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureModelViewerLoaded().then((ok) => {
      if (!cancelled) setViewerReady(Boolean(ok));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!url) return null;

  const sizePx = mode === '2d' ? config.sizePx || 56 : config.sizePx3d || 80;
  const scale = Number(config.scale) || 1;

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-gray-500">
        {mode === '2d' ? 'پیش‌نمایش حالت ۲D' : 'پیش‌نمایش حالت ۳D'}
      </p>
      <div className="flex justify-center rounded-xl border border-dashed border-gray-200 bg-gradient-to-b from-sky-50 to-gray-50 p-6">
        <div
          style={{
            width: `${sizePx}px`,
            height: `${sizePx}px`,
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'center bottom',
          }}
        >
          {!viewerReady ? (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              در حال آماده‌سازی…
            </div>
          ) : (
            /* eslint-disable-next-line react/no-unknown-property */
            <model-viewer
              src={url}
              alt=""
              auto-rotate={config.autoRotate ? '' : undefined}
              auto-rotate-delay={
                config.autoRotate && config.autoRotateDelay
                  ? String(config.autoRotateDelay)
                  : undefined
              }
              camera-orbit={config.cameraOrbit || '0deg 68deg auto'}
              rotation-per-second={
                config.autoRotate ? config.rotationPerSecond || '18deg' : undefined
              }
              orientation={config.modelOrientation || '0deg 0deg 0deg'}
              field-of-view={
                config.fieldOfView ? `${config.fieldOfView}deg` : undefined
              }
              shadow-intensity={String(config.shadowIntensity ?? 1)}
              exposure={String(config.exposure ?? 1.15)}
              interaction-prompt="none"
              disable-zoom
              disable-pan
              disable-tap
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
