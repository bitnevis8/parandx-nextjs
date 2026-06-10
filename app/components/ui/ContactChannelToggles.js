'use client';

import { DevicePhoneMobileIcon, PhoneIcon } from '@heroicons/react/24/outline';
import {
  CHANNEL_ICON_LINK_CLASS,
  PHONE_CHANNEL_DEFS,
  PROFILE_SOCIAL_DEFS,
  getPhoneChannelHref,
  getSocialLinkHref,
  normalizeSocialLinks,
  phoneChannelsForKind,
} from '../../utils/contactChannelsUtils';
import { formatIranPhoneDisplay } from '../../utils/expertProfileUtils';
import { FormField, inputClass } from './dashboard/DashboardUi';

const ICON_BTN =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition active:scale-[0.98]';

function ToggleIconButton({ channel, active, onToggle, title, size = 'md' }) {
  const Icon = channel.Icon;
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-[1.125rem] w-[1.125rem]';
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title || (active ? `${channel.label} — فعال` : `${channel.label} — غیرفعال`)}
      aria-pressed={active}
      className={`inline-flex ${box} shrink-0 cursor-pointer items-center justify-center rounded-lg ring-1 transition ${
        active ? channel.activeClass : channel.inactiveClass
      }`}
    >
      <Icon className={icon} aria-hidden />
      <span className="sr-only">{channel.label}</span>
    </button>
  );
}

function IconLinkButton({ channel, href, iconClassName = 'h-[1.125rem] w-[1.125rem]' }) {
  const Icon = channel.Icon;
  const btnClass = `${ICON_BTN} ${CHANNEL_ICON_LINK_CLASS}`;

  if (!href) {
    return (
      <span className={btnClass} title={channel.label}>
        <Icon className={iconClassName} aria-hidden />
        <span className="sr-only">{channel.label}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target={channel.key === 'mobile' || channel.key === 'email' ? undefined : '_blank'}
      rel={channel.key === 'mobile' || channel.key === 'email' ? undefined : 'noopener noreferrer'}
      className={btnClass}
      title={channel.label}
    >
      <Icon className={iconClassName} aria-hidden />
      <span className="sr-only">{channel.label}</span>
    </a>
  );
}

function PhoneChannelIcons({ entry, linkable, isLandline, size = 'md' }) {
  const channels = entry?.channels || {};
  const defs = phoneChannelsForKind(isLandline).filter((c) => channels[c.key]);
  if (!defs.length) return null;

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-[1.125rem] w-[1.125rem]';

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list" aria-label="راه‌های ارتباط">
      {defs.map((channel) => {
        const href = linkable ? getPhoneChannelHref(channel.key, entry) : null;
        if (linkable && !href) return null;
        return (
          <span key={channel.key} role="listitem">
            <IconLinkButton channel={channel} href={href} iconClassName={iconSize} />
          </span>
        );
      })}
    </div>
  );
}

/** شماره در خط قبلی هدر + ردیف آیکن زیر آن */
export function ContactNumberInline({
  item,
  label,
  linkable = false,
  isLandline = false,
  showLabel = false,
  className = '',
}) {
  const displayNumber = formatIranPhoneDisplay(item?.number) || item?.number || '';
  const KindIcon = isLandline ? PhoneIcon : DevicePhoneMobileIcon;
  const channels = item?.channels || {};
  const hasIcons = phoneChannelsForKind(isLandline).some((c) => channels[c.key]);

  return (
    <div className={className}>
      {showLabel && label ? (
        <p className="mb-0.5 text-[11px] font-medium text-slate-500">{label}</p>
      ) : null}
      {linkable ? (
        <a
          href={`tel:${item.number}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-teal-700 transition hover:text-teal-900"
          dir="ltr"
        >
          <KindIcon className="h-4 w-4 shrink-0" aria-hidden />
          {displayNumber}
        </a>
      ) : (
        <p
          className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-900"
          dir="ltr"
        >
          <KindIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          {displayNumber}
        </p>
      )}
      {hasIcons ? (
        <div className="mt-1.5">
          <PhoneChannelIcons entry={item} linkable={linkable} isLandline={isLandline} size="sm" />
        </div>
      ) : null}
    </div>
  );
}

/** فقط آیکن — بدون عنوان بخش */
export function ExpertSocialLinksRow({ socialLinks, linkable = false, className = '' }) {
  const links = normalizeSocialLinks(socialLinks);
  const items = PROFILE_SOCIAL_DEFS.filter((def) => {
    if (!links[def.key]?.enabled) return false;
    if (linkable) return Boolean(getSocialLinkHref(def.key, links));
    return true;
  });

  if (!items.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`} role="list">
      {items.map((def) => {
        const href = linkable ? getSocialLinkHref(def.key, links) : null;
        return (
          <span key={def.key} role="listitem">
            <IconLinkButton channel={def} href={href} />
          </span>
        );
      })}
    </div>
  );
}

export function ContactChannelEditor({ entry, isLandline = false, onChange }) {
  const channels = entry?.channels || {};
  const defs = phoneChannelsForKind(isLandline);

  const toggleChannel = (key) => {
    onChange({
      channels: { ...channels, [key]: !channels[key] },
    });
  };

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-2.5">
      <p className="text-[11px] font-semibold text-slate-600">پیام‌رسان‌های این شماره</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="فعال‌سازی">
        {defs.map((channel) => (
          <ToggleIconButton
            key={channel.key}
            channel={channel}
            active={Boolean(channels[channel.key])}
            onToggle={() => toggleChannel(channel.key)}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}

export function ExpertSocialLinksEditor({ socialLinks, onChange, className = '' }) {
  const links = normalizeSocialLinks(socialLinks);

  const patch = (key, patchItem) => {
    onChange({
      ...links,
      [key]: { ...links[key], ...patchItem },
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold text-gray-700">اینستاگرام، لینکدین، وب‌سایت و ایمیل</p>
      <p className="text-[11px] text-gray-500">جدا از شماره — فعال کنید و آدرس را وارد کنید</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PROFILE_SOCIAL_DEFS.map((def) => {
          const item = links[def.key];
          const active = item?.enabled;
          return (
            <div
              key={def.key}
              className={`rounded-xl border p-3 transition ${
                active ? 'border-teal-200 bg-teal-50/30' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ToggleIconButton
                  channel={def}
                  active={active}
                  onToggle={() => patch(def.key, { enabled: !active })}
                />
                <p className="text-sm font-medium text-gray-800">{def.label}</p>
              </div>
              {active ? (
                <FormField label={def.urlLabel} className="mt-3 !mb-0">
                  <input
                    type="text"
                    value={item?.url || ''}
                    onChange={(e) => patch(def.key, { url: e.target.value })}
                    className={inputClass}
                    placeholder={def.urlPlaceholder}
                    dir="ltr"
                  />
                </FormField>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** @deprecated */
export function ContactNumberCard(props) {
  return <ContactNumberInline {...props} showLabel={Boolean(props.label)} />;
}

/** @deprecated */
export function ExpertSocialLinksPanel({ socialLinks, linkable, className }) {
  return <ExpertSocialLinksRow socialLinks={socialLinks} linkable={linkable} className={className} />;
}

export function ContactChannelIconBar() {
  return null;
}

export function SocialLinksIconBar(props) {
  return <ExpertSocialLinksRow {...props} />;
}

export function ExpertSocialLinksDisplay({ socialLinks, linkable }) {
  return (
    <div className="px-4 py-3 sm:px-5">
      <ExpertSocialLinksRow socialLinks={socialLinks} linkable={linkable} />
    </div>
  );
}
