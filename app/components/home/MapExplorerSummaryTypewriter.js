'use client';

import { useEffect, useRef, useState } from 'react';

function buildSummaryText(copy) {
  if (!copy?.title) return '';
  if (copy.detail) return `${copy.title} · ${copy.detail}`;
  return copy.title;
}

export default function MapExplorerSummaryTypewriter({ copy, className = '' }) {
  const fullText = buildSummaryText(copy);
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!fullText) {
      setDisplayed('');
      setTypingComplete(false);
      return undefined;
    }

    if (hasAnimatedRef.current) {
      setDisplayed(fullText);
      setTypingComplete(true);
      return undefined;
    }

    let cancelled = false;
    let index = 0;
    let timerId = null;

    setDisplayed('');
    setTypingComplete(false);

    const step = () => {
      if (cancelled) return;
      index += 1;
      setDisplayed(fullText.slice(0, index));
      if (index < fullText.length) {
        timerId = setTimeout(step, 24);
      } else {
        hasAnimatedRef.current = true;
        setTypingComplete(true);
      }
    };

    timerId = setTimeout(step, 24);

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [fullText]);

  useEffect(() => {
    if (!fullText || typingComplete) return undefined;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [fullText, typingComplete]);

  if (!fullText) return null;

  return (
    <p
      dir="rtl"
      className={`whitespace-nowrap text-right text-[10px] font-medium leading-none text-slate-800/90 drop-shadow-[0_1px_2px_rgba(255,255,255,0.75)] dark:text-slate-200/92 dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-[11px] ${className}`.trim()}
      aria-live="polite"
      aria-atomic
      role="status"
    >
      <span>{displayed}</span>
      {!typingComplete ? (
        <span
          className={`ms-0.5 inline-block w-[2px] translate-y-px bg-slate-700/80 dark:bg-slate-200/90 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ height: '1em' }}
          aria-hidden
        />
      ) : null}
    </p>
  );
}
