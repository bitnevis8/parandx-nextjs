'use client';

import { useEffect, useRef, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { REQUEST_INTRO } from '../../copy/friendlyFa';

const DEFAULT_ANIMATION = {
  typeMs: 28,
  deleteMs: 14,
  pauseAfterTypeMs: 1600,
  pauseAfterDeleteMs: 280,
  maxAngle: 0,
};

const DEFAULT_DISPLAY = { mobile: true, desktop: true };

/**
 * @param {'mobile' | 'desktop'} platform — از والد مشخص می‌شود تا با CSS hidden اشتباه نشود
 */
export default function RequestTypewriterQuotes({
  className = '',
  variant = 'default',
  platform,
  fallback = null,
  alignSlot = null,
}) {
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [animation, setAnimation] = useState(DEFAULT_ANIMATION);
  const [displayed, setDisplayed] = useState('');
  const [textAngle, setTextAngle] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const timerRef = useRef(null);

  const enabled =
    platform === 'mobile' ? display.mobile : platform === 'desktop' ? display.desktop : false;

  useEffect(() => {
    let cancelled = false;

    fetch(API_ENDPOINTS.siteSetting.homeRequestTypewriter)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && json.data) {
          const fromApi = json.data.display;
          setDisplay({
            mobile: fromApi?.mobile === true,
            desktop: fromApi?.desktop === true,
          });
          const quoteList = Array.isArray(json.data.quotes)
            ? json.data.quotes.filter((item) => typeof item === 'string' && item.trim())
            : [];
          setQuotes(quoteList.length ? quoteList : REQUEST_INTRO.floatingQuotes);
          if (json.data.animation) {
            setAnimation({ ...DEFAULT_ANIMATION, ...json.data.animation });
          }
        } else {
          setDisplay(DEFAULT_DISPLAY);
          setQuotes(REQUEST_INTRO.floatingQuotes);
        }
        setConfigLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setDisplay(DEFAULT_DISPLAY);
          setQuotes(REQUEST_INTRO.floatingQuotes);
          setConfigLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pickTextAngle = (maxAngle) => {
    if (!maxAngle) return 0;
    return (Math.random() * 2 - 1) * maxAngle;
  };

  useEffect(() => {
    if (!configLoaded || !enabled || !quotes.length) return undefined;

    let cancelled = false;
    let quoteIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const { typeMs, deleteMs, pauseAfterTypeMs, pauseAfterDeleteMs, maxAngle } = animation;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setDisplayed(quotes[0]);
      setTextAngle(pickTextAngle(maxAngle));
      const interval = setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        setDisplayed(quotes[quoteIndex]);
        setTextAngle(pickTextAngle(maxAngle));
      }, pauseAfterTypeMs + pauseAfterDeleteMs);
      return () => clearInterval(interval);
    }

    const step = () => {
      if (cancelled) return;

      const quote = quotes[quoteIndex] || '';

      if (!deleting) {
        charIndex += 1;
        setDisplayed(quote.slice(0, charIndex));
        if (charIndex >= quote.length) {
          timerRef.current = setTimeout(() => {
            deleting = true;
            step();
          }, pauseAfterTypeMs);
        } else {
          timerRef.current = setTimeout(step, typeMs);
        }
        return;
      }

      charIndex -= 1;
      setDisplayed(quote.slice(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        setTextAngle(pickTextAngle(maxAngle));
        timerRef.current = setTimeout(step, pauseAfterDeleteMs);
      } else {
        timerRef.current = setTimeout(step, deleteMs);
      }
    };

    charIndex = 0;
    deleting = false;
    setDisplayed('');
    setTextAngle(pickTextAngle(maxAngle));
    timerRef.current = setTimeout(step, typeMs);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [configLoaded, enabled, quotes, animation]);

  useEffect(() => {
    if (!enabled) return undefined;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!configLoaded || !enabled || !quotes.length) {
    return fallback ?? null;
  }

  const isPlainLabel = variant === 'stepsLabel' || variant === 'aboveCtaPlain';
  const isMobileUi =
    variant === 'mobile' ||
    variant === 'mobileIntro' ||
    variant === 'aboveCtaMobile' ||
    variant === 'aboveCtaPlain' ||
    variant === 'stepsLabel';
  const isAboveCta =
    variant === 'aboveCta' || variant === 'aboveCtaMobile' || variant === 'aboveCtaPlain';
  const isPlainAbove = variant === 'aboveCtaPlain';

  const typewriterBody = (
    <div className={`px-0 py-0 ${className}`.trim()} aria-live="polite" aria-atomic>
      <p
        dir="rtl"
        className={`origin-right text-right transition-transform duration-300 ${
          isPlainLabel
            ? 'min-h-[1.75rem] font-semibold'
            : isPlainAbove
              ? 'min-h-[2.5rem] font-semibold'
              : `font-semibold leading-snug text-teal-800 dark:text-sky-200 ${
                  isAboveCta
                    ? isMobileUi
                      ? 'min-h-[2.75rem] text-[13px] leading-6'
                      : 'min-h-[1.65rem] text-sm sm:text-[15px]'
                    : variant === 'mobileIntro'
                      ? 'min-h-[3.5rem] text-sm leading-7'
                      : isMobileUi
                        ? 'min-h-[2.75rem] text-[13px] leading-6'
                        : 'min-h-[1.5rem] text-sm sm:min-h-[1.65rem] sm:text-[15px]'
                }`
        }`.trim()}
        style={{
          transform: textAngle && !isAboveCta && !isPlainLabel ? `rotate(${textAngle}deg)` : undefined,
        }}
      >
        <span className="inline">{displayed}</span>
        <span
          className={`ms-0.5 inline-block w-[2px] translate-y-px bg-teal-600 dark:bg-sky-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ height: '1em' }}
          aria-hidden
        />
      </p>
    </div>
  );

  if (alignSlot === 'left') {
    return (
      <div className="flex w-full justify-end">
        <div className="w-full max-w-[15.5rem]">{typewriterBody}</div>
      </div>
    );
  }

  if (alignSlot === 'right') {
    return <div className="w-full text-right">{typewriterBody}</div>;
  }

  return typewriterBody;
}
