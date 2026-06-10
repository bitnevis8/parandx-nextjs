function isIconUrl(icon) {
  return typeof icon === 'string' && /^https?:\/\//i.test(icon);
}

function truncateTitle(title, max = 28) {
  const text = String(title || '').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

/** ارتفاع ستون نور بیکن — در ۳D با زوم بیشتر بلندتر می‌شود */
export function resolveRequestBeaconHeightPx(map, { show3D = false } = {}) {
  if (!show3D) return 18;
  const zoom = Number(map?.getZoom?.()) || 13;
  const t = Math.min(1, Math.max(0, (zoom - 12) / 6));
  return Math.round(22 + t * 12);
}

function appendCategoryVisual(parent, item) {
  const visual = document.createElement('span');
  visual.className = 'request-map-marker-visual';
  visual.setAttribute('aria-hidden', 'true');

  if (isIconUrl(item.categoryIcon)) {
    const img = document.createElement('img');
    img.src = item.categoryIcon;
    img.alt = '';
    visual.appendChild(img);
  } else {
    const icon = document.createElement('span');
    icon.className = 'request-map-marker-category-emoji';
    icon.textContent = item.categoryIcon || '📋';
    visual.appendChild(icon);
  }

  parent.appendChild(visual);
  return visual;
}

function resolveMarkerLabel(item) {
  const subTitle = String(item.subCategoryTitle || item.categoryTitle || '').trim();
  if (subTitle) return subTitle;
  return String(item.title || 'کار').trim();
}

export function buildRequestMarkerElement(item, { beaconHeightPx = 20 } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'request-map-marker-card request-map-marker-card--beacon';
  wrap.setAttribute('dir', 'rtl');

  const markerLabel = resolveMarkerLabel(item);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'request-map-marker-hit';
  btn.setAttribute('aria-label', markerLabel);
  btn.title = markerLabel;

  const label = document.createElement('span');
  label.className = 'request-map-marker-title request-map-marker-title--beacon';
  label.textContent = truncateTitle(markerLabel);
  btn.appendChild(label);

  const stack = document.createElement('span');
  stack.className = 'request-map-marker-beacon-stack';

  const floatWrap = document.createElement('span');
  floatWrap.className = 'request-map-marker-beacon-float';

  const glow = document.createElement('span');
  glow.className = 'request-map-marker-beacon-glow';
  glow.setAttribute('aria-hidden', 'true');
  floatWrap.appendChild(glow);

  const iconHead = document.createElement('span');
  iconHead.className = 'request-map-marker-icon-head';
  appendCategoryVisual(iconHead, item);
  floatWrap.appendChild(iconHead);

  const column = document.createElement('span');
  column.className = 'request-map-marker-beacon-column';
  column.style.height = `${beaconHeightPx}px`;
  floatWrap.appendChild(column);

  stack.appendChild(floatWrap);

  const ground = document.createElement('span');
  ground.className = 'request-map-marker-ground';
  ground.setAttribute('aria-hidden', 'true');
  stack.appendChild(ground);

  btn.appendChild(stack);
  wrap.appendChild(btn);

  return { wrap, button: btn };
}

export function buildRequestMarkerPopupHtml(item) {
  const title = item.title || 'کار ثبت‌شده';
  const href = item.href || '#';
  const categoryLine = item.categoryTitle
    ? `<p class="request-map-popup-category">${escapeHtml(item.categoryTitle)}</p>`
    : '';
  const locationLine = item.locationLabel
    ? `<p class="request-map-popup-location">${escapeHtml(item.locationLabel)}</p>`
    : '';
  const bidLine =
    item.bidCount > 0
      ? `<p class="request-map-popup-bids">${item.bidCount} پیشنهاد</p>`
      : '<p class="request-map-popup-bids request-map-popup-bids--empty">هنوز پیشنهادی نیست</p>';

  return `
    <div class="request-map-popup" dir="rtl">
      <p class="request-map-popup-title">${escapeHtml(title)}</p>
      ${categoryLine}
      ${locationLine}
      ${bidLine}
      <a href="${escapeHtml(href)}" class="request-map-popup-link">مشاهده کار</a>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
