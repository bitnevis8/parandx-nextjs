import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resolvePlaceCategoryIcon } from './mapPlaceCategories';
import { resolveExpertPoleHeightPx } from './expertMapMarkerUi';
import { resolveGoodsGlbModel } from '../config/mapGoods3dIcons';
import { buildGlbPlaceMarkerElement } from './mapGlbMarkerUi';

function createPlaceNameLabel(title) {
  const label = document.createElement('span');
  label.className = 'expert-map-marker-name place-map-marker-name';
  const line = document.createElement('span');
  line.className = 'expert-map-marker-name-line';
  line.textContent = title;
  label.appendChild(line);
  return label;
}

function createPlaceNameLabel3D(title) {
  const label = document.createElement('span');
  label.className = 'expert-map-marker-name expert-map-marker-name--3d place-map-marker-name';
  label.textContent = title;
  return label;
}

function isEmojiIcon(iconName) {
  const value = String(iconName || '').trim();
  return value && !value.endsWith('Icon') && !/^https?:\/\//i.test(value);
}

function isIconUrl(iconName) {
  return typeof iconName === 'string' && /^https?:\/\//i.test(iconName);
}

export function buildPlaceIconHead(iconName, tone, { elevated3D = false } = {}) {
  const headWrap = document.createElement('span');
  headWrap.className = elevated3D
    ? 'expert-map-marker-head expert-map-marker-head--3d'
    : 'expert-map-marker-head';

  const visual = document.createElement('span');
  visual.className = `expert-map-marker-visual expert-map-marker-visual--category place-map-marker-visual place-map-marker-visual--${tone || 'teal'}`;

  if (isIconUrl(iconName)) {
    const img = document.createElement('img');
    img.src = iconName;
    img.alt = '';
    img.className = 'place-map-marker-category-img';
    img.loading = 'lazy';
    img.decoding = 'async';
    visual.appendChild(img);
  } else if (isEmojiIcon(iconName)) {
    const emojiWrap = document.createElement('span');
    emojiWrap.className = 'place-map-marker-emoji text-lg leading-none';
    emojiWrap.setAttribute('aria-hidden', 'true');
    emojiWrap.textContent = iconName;
    visual.appendChild(emojiWrap);
  } else {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'place-map-marker-svg';
    iconWrap.setAttribute('aria-hidden', 'true');
    const Icon = resolvePlaceCategoryIcon(iconName);
    iconWrap.innerHTML = renderToStaticMarkup(createElement(Icon));
    visual.appendChild(iconWrap);
  }

  headWrap.appendChild(visual);

  return headWrap;
}

export function buildCategoryPoleStack(iconName, tone, poleHeightPx) {
  const stack = document.createElement('span');
  stack.className = 'expert-map-marker-pole-stack place-map-marker-pole-stack';

  stack.appendChild(buildPlaceIconHead(iconName, tone, { elevated3D: true }));

  const pole = document.createElement('span');
  pole.className = 'expert-map-marker-pole place-map-marker-pole';
  pole.dataset.tone = tone || 'teal';
  pole.style.height = `${poleHeightPx}px`;
  stack.appendChild(pole);

  const ground = document.createElement('span');
  ground.className = 'expert-map-marker-ground place-map-marker-ground';
  ground.dataset.tone = tone || 'teal';
  ground.setAttribute('aria-hidden', 'true');
  stack.appendChild(ground);

  return stack;
}

/**
 * @param {{ title: string; lat: number; lng: number }} item
 * @param {{ icon: string; title: string; tone?: string }} subCategory
 */
export function buildPlaceMarkerElement(
  item,
  subCategory,
  { show3D = false, poleHeightPx = 30 } = {}
) {
  const glbSrc = subCategory?.glbModel || resolveGoodsGlbModel(subCategory?.slug);
  if (glbSrc) {
    return buildGlbPlaceMarkerElement(
      item,
      { glbSrc, tone: subCategory?.tone || 'teal', title: item.title },
      { show3D, poleHeightPx }
    );
  }

  const wrap = document.createElement('div');
  wrap.className = show3D
    ? 'expert-map-marker-card expert-map-marker-card--3d place-map-marker-card'
    : 'expert-map-marker-card place-map-marker-card';
  wrap.setAttribute('dir', 'rtl');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'expert-map-marker-hit';
  btn.setAttribute('aria-label', item.title);
  btn.title = item.title;

  const iconName = subCategory?.icon || 'MapPinIcon';
  const tone = subCategory?.tone || 'teal';

  if (show3D) {
    const nameLabel = createPlaceNameLabel3D(item.title);
    if (nameLabel) btn.appendChild(nameLabel);
    btn.appendChild(buildCategoryPoleStack(iconName, tone, poleHeightPx));
  } else {
    btn.appendChild(buildPlaceIconHead(iconName, tone));
  }

  wrap.appendChild(btn);

  if (!show3D) {
    wrap.appendChild(createPlaceNameLabel(item.title));
  }

  return { wrap, button: btn };
}

export function resolvePlaceMapViewOptions(map) {
  const pitch = Number(map?.getPitch?.()) || 0;
  const show3D = pitch > 10;
  return {
    show3D,
    poleHeightPx: show3D ? resolveExpertPoleHeightPx(map) : 0,
  };
}
