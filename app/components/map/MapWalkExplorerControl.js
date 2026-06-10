'use client';

import { useCallback, useMemo, useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import useMapWalkExplorer from '../../hooks/useMapWalkExplorer';
import {
  MAP_WALK_DEFAULT_SPEED_ID,
  MAP_WALK_SPEED_PRESETS,
} from '../../utils/mapWalkExplorer';
import {
  MAP_GLASS_GROUP,
  MAP_GLASS_ICON_BTN,
} from './mapControlTheme';

const WALK_TEXT = 'text-teal-900';
const WALK_TEXT_MUTED = 'text-teal-800/75';
const WALK_LABEL_SHADOW =
  '[text-shadow:0_1px_2px_rgba(255,255,255,0.92),0_0_10px_rgba(255,255,255,0.72)]';
const WALK_ICON_SHADOW =
  'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] drop-shadow-[0_0_8px_rgba(0,0,0,0.45)]';

const WALK_SPEED_BTN = `rounded-md px-1.5 py-1 text-[10px] font-bold leading-none transition sm:px-2 sm:text-[11px] ${WALK_TEXT} ${WALK_LABEL_SHADOW} hover:bg-white/15`;
const WALK_SPEED_BTN_ACTIVE = 'bg-teal-900/18 text-teal-950 ring-1 ring-teal-700/35';

const WALK_HINT = `rounded-full border border-teal-700/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm sm:text-xs ${WALK_TEXT} ${WALK_LABEL_SHADOW}`;

const WALK_HINT_IDLE = 'روی نقشه کلیک کنید · موس نگاه · فلش‌ها حرکت · Esc خروج';
const WALK_HINT_LOCKED = 'موس: زاویه · فلش‌ها/WASD: گشت · Esc خروج';

export default function MapWalkExplorerControl({
  mapRef,
  show3D = false,
  enabled = true,
  className = '',
  onActiveChange,
}) {
  const [active, setActive] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [speedId, setSpeedId] = useState(MAP_WALK_DEFAULT_SPEED_ID);

  const speedMultiplier = useMemo(() => {
    const preset = MAP_WALK_SPEED_PRESETS.find((item) => item.id === speedId);
    return preset?.multiplier ?? 1;
  }, [speedId]);

  const exitWalk = useCallback(() => {
    setActive(false);
    setPointerLocked(false);
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  }, []);

  const requestWalkPointerLock = useCallback(() => {
    const canvas = mapRef?.current?.getCanvas?.();
    canvas?.requestPointerLock?.();
  }, [mapRef]);

  const handleToggleWalk = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      if (next) {
        window.requestAnimationFrame(() => {
          requestWalkPointerLock();
        });
      } else if (document.pointerLockElement) {
        document.exitPointerLock?.();
      }
      return next;
    });
  }, [requestWalkPointerLock]);

  useMapWalkExplorer(mapRef, {
    active: active && enabled && show3D,
    show3D,
    speedMultiplier,
    speedId,
    onExit: exitWalk,
    onPointerLockChange: setPointerLocked,
    onActiveChange,
  });

  if (!enabled || !show3D) return null;

  const walkHint = pointerLocked ? WALK_HINT_LOCKED : WALK_HINT_IDLE;

  return (
    <>
      <div className={`${MAP_GLASS_GROUP} pointer-events-auto max-w-[calc(100%-1.5rem)] ${className}`.trim()}>
        <button
          type="button"
          onClick={handleToggleWalk}
          className={`${MAP_GLASS_ICON_BTN} border-0 bg-transparent text-white shadow-none ${WALK_ICON_SHADOW} ${
            active ? 'ring-2 ring-amber-300/85 bg-white/30' : ''
          }`}
          aria-pressed={active}
          aria-label={active ? 'خروج از حالت گشت در شهر' : 'فعال‌سازی گشت در شهر'}
          title={active ? 'خروج از گشت' : 'گشت در شهر'}
        >
          <GlobeAltIcon className="h-[18px] w-[18px]" aria-hidden />
        </button>

        <div
          className="flex items-center gap-0.5 border-s border-teal-800/25 ps-0.5"
          role="group"
          aria-label="سرعت گشت"
        >
          {MAP_WALK_SPEED_PRESETS.map((preset) => {
            const selected = speedId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSpeedId(preset.id)}
                className={`${WALK_SPEED_BTN} ${selected ? WALK_SPEED_BTN_ACTIVE : WALK_TEXT_MUTED}`}
                aria-pressed={selected}
                title={`سرعت ${preset.label}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {active ? (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-[1003] flex justify-center px-3">
          <p className={WALK_HINT}>{walkHint}</p>
        </div>
      ) : null}
    </>
  );
}
