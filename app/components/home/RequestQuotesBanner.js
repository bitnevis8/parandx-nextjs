'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { REQUEST_INTRO } from '../../copy/friendlyFa';

const DEFAULT_ANIMATION = {
  speedMin: 0.25,
  speedMax: 0.8,
  maxAngle: 14,
  maxRotationSpeed: 0.35,
};

function shuffleQuotes(list) {
  const items = [...list];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

const OPACITY_VARIANTS = [0.55, 0.65, 0.75, 0.85, 0.6, 0.7, 0.8];

function initParticles(container, nodes, reducedMotion, anim) {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const count = nodes.length;
  const speedSpan = Math.max(0, anim.speedMax - anim.speedMin);

  return nodes.map((node, index) => {
    const w = node.offsetWidth;
    const h = node.offsetHeight;
    const maxX = Math.max(0, cw - w);
    const maxY = Math.max(0, ch - h);
    const slot = count > 1 ? index / (count - 1) : 0.5;
    const spreadJitter = count > 0 ? maxX / count : 0;
    const speed = anim.speedMin + Math.random() * speedSpan;

    return {
      el: node,
      w,
      h,
      x: Math.min(maxX, Math.max(0, slot * maxX + (Math.random() - 0.5) * spreadJitter)),
      y: maxY > 0 ? Math.random() * maxY : 0,
      vx: reducedMotion ? 0 : speed * (Math.random() > 0.5 ? 1 : -1),
      vy: reducedMotion ? 0 : speed * (Math.random() > 0.5 ? 1 : -1),
      rot: anim.maxAngle > 0 ? Math.random() * anim.maxAngle * 2 - anim.maxAngle : 0,
      vr: reducedMotion || anim.maxRotationSpeed <= 0 ? 0 : (Math.random() - 0.5) * 2 * anim.maxRotationSpeed,
    };
  });
}

function applyTransform(particle) {
  particle.el.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) rotate(${particle.rot}deg)`;
}

export default function RequestQuotesBanner({
  embedded = false,
  variant = 'float',
  platform,
}) {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const [display, setDisplay] = useState({ mobile: false, desktop: false });
  const [configLoaded, setConfigLoaded] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [animation, setAnimation] = useState(DEFAULT_ANIMATION);

  const enabled =
    platform === 'mobile' ? display.mobile : platform === 'desktop' ? display.desktop : false;

  useEffect(() => {
    let cancelled = false;

    fetch(API_ENDPOINTS.siteSetting.homeRequestBanner)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && json.data) {
          const block = json.data;
          setDisplay({
            mobile: block.display?.mobile === true,
            desktop: block.display?.desktop === true,
          });
          const fromApi = Array.isArray(block.quotes)
            ? block.quotes.filter((item) => typeof item === 'string' && item.trim())
            : [];
          setQuotes(shuffleQuotes(fromApi.length ? fromApi : REQUEST_INTRO.bannerQuotes));
          if (block.animation) {
            setAnimation({ ...DEFAULT_ANIMATION, ...block.animation });
          }
        } else {
          setDisplay({ mobile: false, desktop: false });
          setQuotes(shuffleQuotes(REQUEST_INTRO.bannerQuotes));
        }
        setConfigLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setDisplay({ mobile: false, desktop: false });
          setQuotes(shuffleQuotes(REQUEST_INTRO.bannerQuotes));
          setConfigLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!configLoaded || !enabled || variant === 'chips' || !quotes.length) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setup = () => {
      const nodes = Array.from(container.querySelectorAll('[data-float-quote]'));
      if (!nodes.length) return;

      particlesRef.current = initParticles(container, nodes, reducedMotion, animation);
      particlesRef.current.forEach(applyTransform);
    };

    setup();

    if (reducedMotion) {
      return undefined;
    }

    const tick = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rot += particle.vr;

        if (particle.x <= 0) {
          particle.x = 0;
          particle.vx = Math.abs(particle.vx);
        }
        if (particle.y <= 0) {
          particle.y = 0;
          particle.vy = Math.abs(particle.vy);
        }
        if (particle.x + particle.w >= cw) {
          particle.x = Math.max(0, cw - particle.w);
          particle.vx = -Math.abs(particle.vx);
        }
        if (particle.y + particle.h >= ch) {
          particle.y = Math.max(0, ch - particle.h);
          particle.vy = -Math.abs(particle.vy);
        }

        applyTransform(particle);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(() => {
      setup();
    });
    resizeObserver.observe(container);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [configLoaded, enabled, quotes, animation, variant]);

  const stripClass = embedded
    ? 'flex h-[4.5rem] w-full bg-teal-50/50 dark:bg-sky-950/40 sm:h-[5.25rem]'
    : 'flex h-[5rem] w-full border-b border-gray-200/90 bg-teal-50/30 dark:border-sky-800 dark:bg-sky-950/40 sm:h-[6rem]';

  if (!configLoaded || !enabled || !quotes.length) return null;

  if (variant === 'chips') {
    return (
      <div className="w-full" aria-label="نمونه درخواست‌ها">
        <p className="mb-2 text-xs font-bold text-gray-500 dark:text-sky-400">
          مثلاً می‌تونید بگید:
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide snap-x snap-mandatory">
          {quotes.map((quote) => (
            <span
              key={quote}
              className="inline-flex shrink-0 snap-start items-center rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-teal-800 shadow-sm ring-1 ring-teal-200/90 dark:bg-sky-900 dark:text-sky-100 dark:ring-sky-700"
            >
              {quote}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const imageSlot = (
    <div className="flex w-[5.25rem] shrink-0 items-end justify-center pb-1 ps-2 sm:w-[6.5rem] sm:pb-1.5 sm:ps-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={REQUEST_INTRO.backgroundImage}
        alt=""
        className="pointer-events-none h-auto max-h-[4.5rem] w-full object-contain object-bottom mix-blend-multiply sm:max-h-[5.25rem] dark:mix-blend-lighten"
      />
    </div>
  );

  return (
    <div className={stripClass} aria-hidden>
      {imageSlot}

      <div ref={containerRef} dir="ltr" className="relative min-w-0 flex-1 overflow-hidden">
        {quotes.map((quote, index) => (
          <span
            key={`${quote}-${index}`}
            data-float-quote
            dir="rtl"
            className="absolute left-0 top-0 whitespace-nowrap text-sm font-semibold text-teal-700 dark:text-sky-300 sm:text-base"
            style={{
              opacity: OPACITY_VARIANTS[index % OPACITY_VARIANTS.length],
              willChange: 'transform',
            }}
          >
            {quote}
          </span>
        ))}
      </div>
    </div>
  );
}
