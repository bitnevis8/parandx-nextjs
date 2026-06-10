'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  applyWalkCameraLook,
  applyWalkStreetView,
  isMapReadyForWalk,
  isWalkMovementKey,
  MAP_WALK_LOOK_SENSITIVITY,
  MAP_WALK_MAX_PITCH,
  MAP_WALK_MIN_PITCH,
  moveWalkCamera,
  readWalkInput,
} from '../../utils/mapWalkExplorer';

export default function useMapWalkExplorer(
  mapRef,
  {
    active = false,
    show3D = false,
    speedMultiplier = 1,
    speedId = 'normal',
    onExit,
    onPointerLockChange,
    onActiveChange,
  }
) {
  const keysRef = useRef(new Set());
  const speedRef = useRef(speedMultiplier);
  const speedIdRef = useRef(speedId);
  const onExitRef = useRef(onExit);
  const onPointerLockChangeRef = useRef(onPointerLockChange);
  const onActiveChangeRef = useRef(onActiveChange);
  const lastFrameRef = useRef(0);
  const walkActiveRef = useRef(false);
  const lastWalkSpeedIdRef = useRef('normal');

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    onPointerLockChangeRef.current = onPointerLockChange;
  }, [onPointerLockChange]);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    speedIdRef.current = speedId;
  }, [speedId]);

  useLayoutEffect(() => {
    onActiveChangeRef.current?.(active && show3D);
  }, [active, show3D]);

  useEffect(() => {
    if (!active || !show3D) {
      walkActiveRef.current = false;
      lastWalkSpeedIdRef.current = speedId;
      return undefined;
    }

    const map = mapRef?.current;
    if (!map) return undefined;

    let cancelled = false;

    const enterStreetView = () => {
      if (cancelled || !isMapReadyForWalk(map)) return false;
      applyWalkStreetView(map, { speedId: speedIdRef.current, animate: true });
      walkActiveRef.current = true;
      lastWalkSpeedIdRef.current = speedIdRef.current;
      return true;
    };

    if (!enterStreetView()) {
      const onLoad = () => {
        enterStreetView();
      };
      map.once?.('load', onLoad);
      return () => {
        cancelled = true;
        map.off?.('load', onLoad);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [active, show3D, mapRef]);

  useEffect(() => {
    if (!active || !show3D || !walkActiveRef.current) return undefined;
    if (lastWalkSpeedIdRef.current === speedId) return undefined;

    lastWalkSpeedIdRef.current = speedId;

    const map = mapRef?.current;
    if (!map) return undefined;

    const updateSpeedView = () => {
      if (!isMapReadyForWalk(map)) return false;
      applyWalkCameraLook(map, map.getBearing(), map.getPitch());
      return true;
    };

    if (!updateSpeedView()) {
      const onLoad = () => {
        updateSpeedView();
      };
      map.once?.('load', onLoad);
      return () => {
        map.off?.('load', onLoad);
      };
    }

    return undefined;
  }, [speedId, active, show3D, mapRef]);

  useEffect(() => {
    if (!active || !show3D) return undefined;

    const map = mapRef?.current;
    if (!map) return undefined;

    const keys = keysRef.current;
    keys.clear();
    lastFrameRef.current = performance.now();

    const prev = {
      keyboard: map.keyboard?.isEnabled?.() ?? true,
      dragPan: map.dragPan.isEnabled(),
      dragRotate: map.dragRotate.isEnabled(),
      scrollZoom: map.scrollZoom.isEnabled(),
      doubleClickZoom: map.doubleClickZoom.isEnabled(),
    };

    map.keyboard?.disable?.();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.scrollZoom.disable();
    map.doubleClickZoom.disable();

    const canvas = map.getCanvas();
    canvas.classList.add('map-walk-active');

    const syncPointerLockState = () => {
      const locked = document.pointerLockElement === canvas;
      canvas.classList.toggle('map-walk-pointer-lock', locked);
      onPointerLockChangeRef.current?.(locked);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onExitRef.current?.();
        return;
      }
      if (!isWalkMovementKey(event.key)) return;
      event.preventDefault();
      keys.add(event.key.toLowerCase());
    };

    const onKeyUp = (event) => {
      if (!isWalkMovementKey(event.key)) return;
      keys.delete(event.key.toLowerCase());
    };

    const onBlur = () => keys.clear();

    const applyLookDelta = (dx, dy) => {
      if (dx === 0 && dy === 0) return;

      const bearing = map.getBearing() + dx * MAP_WALK_LOOK_SENSITIVITY.bearing;
      const pitch = Math.min(
        MAP_WALK_MAX_PITCH,
        Math.max(MAP_WALK_MIN_PITCH, map.getPitch() - dy * MAP_WALK_LOOK_SENSITIVITY.pitch)
      );

      applyWalkCameraLook(map, bearing, pitch);
    };

    const onMouseMove = (event) => {
      if (document.pointerLockElement !== canvas) return;
      applyLookDelta(event.movementX || 0, event.movementY || 0);
    };

    const onPointerLockChange = () => {
      syncPointerLockState();
      if (document.pointerLockElement !== canvas) {
        keys.clear();
      }
    };

    const onCanvasClick = () => {
      if (document.pointerLockElement === canvas) return;
      canvas.requestPointerLock?.();
    };

    let rafId = 0;
    const tick = (now) => {
      const last = lastFrameRef.current || now;
      const dtSec = Math.min(0.05, (now - last) / 1000);
      lastFrameRef.current = now;

      const { forward, strafe } = readWalkInput(keys);
      if (forward !== 0 || strafe !== 0) {
        moveWalkCamera(map, {
          forward,
          strafe,
          dtSec,
          speedMultiplier: speedRef.current,
        });
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    canvas.addEventListener('click', onCanvasClick);

    syncPointerLockState();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      canvas.removeEventListener('click', onCanvasClick);
      canvas.classList.remove('map-walk-active', 'map-walk-pointer-lock');
      keys.clear();

      if (document.pointerLockElement === canvas) {
        document.exitPointerLock?.();
      }

      if (prev.keyboard) map.keyboard?.enable?.();
      if (prev.dragPan) map.dragPan.enable();
      if (prev.dragRotate) map.dragRotate.enable();
      if (prev.scrollZoom) map.scrollZoom.enable();
      if (prev.doubleClickZoom) map.doubleClickZoom.enable();
    };
  }, [active, show3D, mapRef]);
}
