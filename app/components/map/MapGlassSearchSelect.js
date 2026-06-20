'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MAP_GLASS_SURFACE, MAP_GLASS_TEXT } from './mapControlTheme';
import { computeMapCornerPanelStyle } from './mapCornerPanelPosition';

function filterOptions(options, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return options;
  return options.filter((opt) => {
    const haystack = `${opt.label} ${opt.searchText || ''} ${opt.detail || ''}`.toLowerCase();
    return haystack.includes(q);
  });
}

export default function MapGlassSearchSelect({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  searchPlaceholder = 'جستجو…',
  emptyHint = 'چیزی پیدا نشد',
}) {
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const selectedItemRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [panelStyle, setPanelStyle] = useState(null);
  const panelId = useId();

  const selected = useMemo(
    () => options.find((opt) => opt.value === value) ?? options[0] ?? null,
    [options, value]
  );
  const filtered = useMemo(() => filterOptions(options, query), [options, query]);

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === 'undefined') return;

    const rect = trigger.getBoundingClientRect();
    setPanelStyle(computeMapCornerPanelStyle(rect, 280));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setPanelStyle(null);
      return undefined;
    }

    updatePanelPosition();

    const timerId = window.setTimeout(() => searchRef.current?.focus(), 40);
    const scrollTimerId = window.setTimeout(() => {
      selectedItemRef.current?.scrollIntoView({ block: 'nearest' });
    }, 60);

    const handlePointerDown = (event) => {
      if (wrapRef.current?.contains(event.target)) return;
      if (panelRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.clearTimeout(timerId);
      window.clearTimeout(scrollTimerId);
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open, label, updatePanelPosition]);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  const displayLabel = selected?.label || '—';

  const dropdownPanel =
    open && !disabled && panelStyle ? (
      <div
        ref={panelRef}
        id={panelId}
        style={panelStyle}
        className="overflow-hidden rounded-xl border border-gray-200/95 bg-white text-right shadow-2xl ring-1 ring-black/10 dark:border-sky-700/80 dark:bg-sky-950"
        role="dialog"
        aria-label={`${label} — جستجو و انتخاب`}
      >
        <div className="border-b border-gray-100 px-2.5 py-2 dark:border-sky-800">
          <div className="relative">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-sky-400"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100 dark:placeholder:text-sky-500"
              autoComplete="off"
            />
          </div>
        </div>
        <ul className="max-h-[min(15rem,42vh)] overflow-y-auto overscroll-contain py-1" role="listbox" aria-label={label}>
          {filtered.length > 0 ? (
            filtered.map((opt, index) => {
              const isSelected = value === opt.value;
              const isDefault = opt.value === '';

              return (
                <li
                  key={opt.value === '' ? '__default__' : opt.value}
                  role="option"
                  aria-selected={isSelected}
                  ref={isSelected ? selectedItemRef : null}
                  className={isDefault && index === 0 && filtered.length > 1 ? 'border-b border-gray-100 dark:border-sky-800' : ''}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-right transition-colors ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 dark:bg-teal-500/20 dark:text-teal-50'
                        : 'text-gray-800 hover:bg-gray-50 dark:text-sky-100 dark:hover:bg-sky-900/80'
                    }`}
                  >
                    <span
                      className={`min-w-0 flex-1 truncate ${
                        isDefault
                          ? isSelected
                            ? 'text-[13px] font-bold'
                            : 'text-[13px] font-medium text-gray-600 dark:text-sky-300'
                          : isSelected
                            ? 'text-[13px] font-semibold'
                            : 'text-[13px]'
                      }`}
                    >
                      <span className="block truncate">{opt.label}</span>
                      {opt.detail ? (
                        <span className="block truncate text-[10px] font-normal text-gray-500 dark:text-sky-400">
                          {opt.detail}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <CheckIcon className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" strokeWidth={2.25} aria-hidden />
                    ) : (
                      <span className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-3 py-4 text-center text-[12px] text-gray-500 dark:text-sky-400">{emptyHint}</li>
          )}
        </ul>
      </div>
    ) : null;

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${displayLabel}`}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        className={`flex h-9 w-full min-w-0 items-center gap-1.5 rounded-lg px-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 disabled:cursor-not-allowed disabled:opacity-50 ${MAP_GLASS_SURFACE} hover:bg-slate-950/55 ${open ? 'ring-1 ring-white/25' : ''}`}
      >
        <span className={`shrink-0 text-[10px] font-medium leading-none ${MAP_GLASS_TEXT} opacity-60`}>{label}</span>
        <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold leading-none text-white">
          {displayLabel}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 text-white/70 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {mounted && dropdownPanel ? createPortal(dropdownPanel, document.body) : null}
    </div>
  );
}
