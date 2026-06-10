'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { filterServiceOptions } from '../../utils/expertMapUtils';
import {
  MAP_FILTER_FIELD,
  MAP_FILTER_INPUT_CLASS,
} from './mapFilterTheme';

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function useVisualViewportBox(active) {
  const [box, setBox] = useState({ top: 0, height: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!active || typeof window === 'undefined') return undefined;

    const update = () => {
      const vv = window.visualViewport;
      if (!vv) {
        setBox({
          top: 12,
          left: 12,
          width: window.innerWidth - 24,
          height: window.innerHeight - 24,
        });
        return;
      }
      setBox({
        top: vv.offsetTop + 12,
        left: vv.offsetLeft + 12,
        width: vv.width - 24,
        height: vv.height - 24,
      });
    };

    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, [active]);

  return box;
}

function ServiceSearchMobilePicker({
  isOpen,
  onClose,
  services,
  value,
  onChange,
  placeholder,
  disabled,
  dialogLabel = 'انتخاب',
  emptyHint = 'چیزی پیدا نشد — یه کلمهٔ دیگه امتحان کنید',
  showParentInList = true,
}) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const viewportBox = useVisualViewportBox(isOpen);

  const selected = useMemo(
    () => services.find((s) => s.slug === value) || null,
    [services, value]
  );

  const filtered = useMemo(() => filterServiceOptions(services, query), [services, query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    if (selected) setQuery(selected.title);
    else setQuery('');
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [isOpen, selected]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleSelect = (service) => {
    onChange?.(service?.slug || '');
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10025] bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      onClick={onClose}
    >
      <div
        className="absolute flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/90"
        style={{
          top: viewportBox.top,
          left: viewportBox.left,
          width: viewportBox.width,
          maxHeight: viewportBox.height,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 px-3 py-2.5">
          <div className="relative min-w-0 flex-1">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              value={query}
              disabled={disabled}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim() && value) onChange?.('');
              }}
              placeholder={placeholder}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="بستن"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1" role="listbox">
          {filtered.length > 0 ? (
            filtered.map((service) => (
              <li key={service.id} role="option" aria-selected={value === service.slug}>
                <button
                  type="button"
                  onClick={() => handleSelect(service)}
                  className={`flex w-full flex-col items-start gap-0.5 px-3 py-3 text-right text-sm transition-colors active:bg-teal-50 ${
                    value === service.slug ? 'bg-teal-50/80 text-teal-800' : 'text-gray-800'
                  }`}
                >
                  <span className="font-medium">{service.title}</span>
                  {showParentInList && service.parentTitle ? (
                    <span className="text-[11px] text-gray-500">{service.parentTitle}</span>
                  ) : null}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-6 text-center text-sm text-gray-500">{emptyHint}</li>
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
}

export { MAP_FILTER_INPUT_CLASS } from './mapFilterTheme';

export default function ServiceSearchSelect({
  services: servicesProp = [],
  options: optionsProp,
  value = null,
  onChange,
  placeholder = 'خدمتتون رو انتخاب کنید',
  disabled = false,
  size = 'md',
  mapToolbar = false,
  previewMode = false,
  onPreviewClick,
  mobileTopPicker = false,
  inputId = 'map-service-search',
  mobileDialogLabel = 'انتخاب سرویس',
  emptyHint = 'چیزی پیدا نشد',
  showParentInList = true,
}) {
  const services = optionsProp ?? servicesProp;
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isMobile = useIsMobileViewport();
  const useMobilePicker = mobileTopPicker && isMobile;

  const selected = useMemo(
    () => services.find((s) => s.slug === value) || null,
    [services, value]
  );

  const filtered = useMemo(() => filterServiceOptions(services, query), [services, query]);

  useEffect(() => {
    if (useMobilePicker) return;
    if (selected) setQuery(selected.title);
    else if (!open) setQuery('');
  }, [selected, open, useMobilePicker]);

  useEffect(() => {
    if (useMobilePicker) return undefined;
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
        if (!value) setQuery('');
        else if (selected) setQuery(selected.title);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, selected, useMobilePicker]);

  const handleSelect = (service) => {
    onChange?.(service?.slug || '');
    setQuery(service?.title || '');
    setOpen(false);
  };

  const handleClear = () => {
    onChange?.('');
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const inputSizeClass = mapToolbar
    ? MAP_FILTER_INPUT_CLASS
    : size === 'lg'
      ? 'py-3 pr-10 pl-10 text-sm sm:text-base'
      : 'py-2 pr-9 pl-9 text-xs sm:text-sm';

  const inputFieldClass = mapToolbar
    ? `${MAP_FILTER_FIELD} flex items-center ${MAP_FILTER_INPUT_CLASS}`
    : `w-full rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm placeholder:text-gray-400 hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 ${inputSizeClass}`;

  if (previewMode) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onPreviewClick}
        className={`relative flex w-full items-center rounded-xl border border-gray-200 bg-white text-right text-gray-800 shadow-sm transition hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${inputSizeClass}`}
        aria-label="انتخاب سرویس — باز کردن نقشه"
      >
        <MagnifyingGlassIcon
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5"
          aria-hidden
        />
        <span className={`flex-1 truncate pl-8 ${selected ? 'font-medium' : 'text-gray-400'}`}>
          {selected?.title || placeholder}
        </span>
        <ChevronDownIcon
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
      </button>
    );
  }

  if (useMobilePicker) {
    const mobileTriggerClass = mapToolbar
      ? `${MAP_FILTER_FIELD} relative flex w-full items-center touch-manipulation ${MAP_FILTER_INPUT_CLASS}`
      : `relative flex w-full items-center rounded-xl border border-gray-200 bg-white text-right text-gray-800 shadow-sm transition hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-60 touch-manipulation ${inputSizeClass}`;

    return (
      <>
        <div className="relative w-full">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setMobilePickerOpen(true)}
            className={`${mobileTriggerClass} ${value ? 'pl-10' : 'pl-8'}`}
            aria-haspopup="dialog"
            aria-expanded={mobilePickerOpen}
          >
            <MagnifyingGlassIcon
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <span className={`min-w-0 flex-1 truncate ${selected ? 'font-medium' : 'text-gray-400'}`}>
              {selected?.title || placeholder}
            </span>
            {!value ? (
              <ChevronDownIcon
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
            ) : null}
          </button>
          {value ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange?.('')}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 touch-manipulation"
              aria-label="پاک کردن سرویس"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <ServiceSearchMobilePicker
          isOpen={mobilePickerOpen}
          onClose={() => setMobilePickerOpen(false)}
          services={services}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          dialogLabel={mobileDialogLabel}
          emptyHint={emptyHint}
          showParentInList={showParentInList}
        />
      </>
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <label htmlFor={inputId} className="sr-only">
        {mobileDialogLabel}
      </label>
      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value.trim() && value) onChange?.('');
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={inputFieldClass}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="پاک کردن سرویس"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        ) : (
          <ChevronDownIcon
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
        )}
      </div>

      {open && !disabled && (
        <ul
          className="absolute top-full left-0 right-0 z-[10010] mt-1 max-h-[min(16rem,40vh)] overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg sm:max-h-60"
          role="listbox"
        >
          {filtered.length > 0 ? (
            filtered.map((service) => (
              <li key={service.id} role="option" aria-selected={value === service.slug}>
                <button
                  type="button"
                  onClick={() => handleSelect(service)}
                  className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-right text-sm transition-colors hover:bg-teal-50 ${
                    value === service.slug ? 'bg-teal-50/80 text-teal-800' : 'text-gray-800'
                  }`}
                >
                  <span className="font-medium">{service.title}</span>
                  {showParentInList && service.parentTitle ? (
                    <span className="text-[11px] text-gray-500">{service.parentTitle}</span>
                  ) : null}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-3 text-center text-xs text-gray-500">{emptyHint}</li>
          )}
        </ul>
      )}
    </div>
  );
}
