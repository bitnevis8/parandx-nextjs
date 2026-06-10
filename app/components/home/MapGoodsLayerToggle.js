'use client';

import { BuildingStorefrontIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { MAP_GOODS_LAYERS } from '../../utils/merchantMapUtils';

const LAYER_OPTIONS = [
  {
    id: MAP_GOODS_LAYERS.merchants,
    label: 'فروشگاه‌ها',
    icon: BuildingStorefrontIcon,
    ariaLabel: 'نمایش فروشگاه‌ها روی نقشه',
    idleClass: 'text-gray-600 hover:text-amber-800',
    activeClass:
      'bg-amber-600 text-white shadow-md shadow-amber-600/25 ring-1 ring-amber-700/20',
  },
  {
    id: MAP_GOODS_LAYERS.needs,
    label: 'نیازهای کالا',
    icon: ShoppingBagIcon,
    ariaLabel: 'نمایش نیازهای ثبت‌شده کالا روی نقشه',
    idleClass: 'text-gray-600 hover:text-teal-800',
    activeClass:
      'bg-teal-600 text-white shadow-md shadow-teal-600/25 ring-1 ring-teal-700/20',
  },
];

export default function MapGoodsLayerToggle({
  value = MAP_GOODS_LAYERS.merchants,
  onChange,
  disabled = false,
  compact = false,
  stretch = false,
}) {
  const compactShell = stretch
    ? 'grid h-9 w-full min-w-0 max-w-none grid-cols-2 gap-0.5 rounded-lg border border-gray-200/90 bg-white p-0.5 shadow-sm'
    : 'grid h-9 min-w-[11rem] max-w-[12.5rem] w-auto grid-cols-2 gap-0.5 rounded-lg border border-gray-200/90 bg-white p-0.5 shadow-sm';

  return (
    <div
      className={
        compact
          ? compactShell
          : 'grid h-12 w-full grid-cols-2 gap-1 rounded-2xl border border-gray-200/90 bg-white p-1 shadow-sm md:min-w-[22rem] md:max-w-[22rem]'
      }
      role="group"
      aria-label="لایه نقشه کالا"
    >
      {LAYER_OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            aria-label={option.ariaLabel}
            onClick={() => onChange?.(option.id)}
            className={`inline-flex w-full min-w-0 items-center justify-center whitespace-nowrap rounded-lg font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35 disabled:cursor-not-allowed disabled:opacity-50 ${
              compact
                ? 'gap-1.5 px-2.5 text-xs'
                : 'gap-2 rounded-xl px-2 text-sm md:px-3 md:text-base'
            } ${active ? option.activeClass : option.idleClass}`}
          >
            <Icon className={compact ? 'h-4 w-4 shrink-0' : 'h-5 w-5 shrink-0'} aria-hidden />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
