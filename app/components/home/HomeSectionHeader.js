'use client';

import { HOME_BLOCK_LEAD, HOME_BLOCK_TITLE, HOME_CARD_HEADER, HOME_ICON_BOX } from './homePageTheme';

/**
 * هدر یکسان برای کارت‌های صفحه اصلی (نقشه، ثبت کار، متخصصین و …)
 */
export default function HomeSectionHeader({
  icon: Icon,
  title,
  description,
  hint = null,
  badge = null,
  action = null,
  titleId,
  iconClassName = '',
  cornerRibbon = null,
  className = '',
}) {
  return (
    <header className={`relative overflow-hidden ${HOME_CARD_HEADER} ${className}`.trim()}>
      {cornerRibbon ? cornerRibbon : null}
      <div className="relative z-[1] flex items-start gap-3 text-right">
        {Icon ? (
          <span className={`${HOME_ICON_BOX} ${iconClassName}`.trim()} aria-hidden>
            <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          {badge ? <div className="mb-1.5">{badge}</div> : null}
          <h2 id={titleId} className={HOME_BLOCK_TITLE}>
            {title}
          </h2>
          {description ? <p className={HOME_BLOCK_LEAD}>{description}</p> : null}
          {hint ? (
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-teal-800/90 dark:text-sky-300 sm:text-[13px]">
              {hint}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
