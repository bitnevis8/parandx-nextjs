import { EXPERT_MARKER_STYLES } from './mapExpertMarkerConfig';

function isIconUrl(icon) {
  return typeof icon === 'string' && /^https?:\/\//i.test(icon);
}

/** ارتفاع میلهٔ مارکر در ۳D — بین ۲۵ تا ۳۵ پیکسل */
export function resolveExpertPoleHeightPx(map) {
  const zoom = Number(map?.getZoom?.()) || 13;
  const t = Math.min(1, Math.max(0, (zoom - 12) / 6));
  return Math.round(25 + t * 10);
}

function createExpertMarkerName(item) {
  const firstName = String(item.firstName || '').trim();
  const lastName = String(item.lastName || '').trim();
  const fallbackName = String(item.name || '').trim();

  if (!firstName && !lastName && !fallbackName) return null;

  const label = document.createElement('span');
  label.className = 'expert-map-marker-name';

  const addLine = (text) => {
    const line = document.createElement('span');
    line.className = 'expert-map-marker-name-line';
    line.textContent = text;
    label.appendChild(line);
  };

  if (firstName || lastName) {
    if (firstName) addLine(firstName);
    if (lastName) addLine(lastName);
  } else {
    addLine(fallbackName);
  }

  return label;
}

function createExpertMarkerName3D(item) {
  const firstName = String(item.firstName || '').trim();
  const lastName = String(item.lastName || '').trim();
  const fallbackName = String(item.name || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || fallbackName;

  if (!fullName) return null;

  const label = document.createElement('span');
  label.className = 'expert-map-marker-name expert-map-marker-name--3d';
  label.textContent = fullName;
  return label;
}

function appendExpertMarkerName(wrap, item) {
  const label = createExpertMarkerName(item);
  if (label) wrap.appendChild(label);
}

function appendMarkerHead(parent, item, style) {
  const visual = document.createElement('span');
  visual.className = 'expert-map-marker-visual';
  visual.setAttribute('aria-hidden', 'true');

  if (style === EXPERT_MARKER_STYLES.avatar) {
    visual.classList.add('expert-map-marker-visual--avatar');
    const img = document.createElement('img');
    img.src = item.avatarUrl || '/images/default/male.png';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => {
      img.onerror = null;
      img.src = '/images/default/male.png';
    };
    visual.appendChild(img);
  } else if (style === EXPERT_MARKER_STYLES.category) {
    visual.classList.add('expert-map-marker-visual--category');
    if (isIconUrl(item.categoryIcon)) {
      const img = document.createElement('img');
      img.src = item.categoryIcon;
      img.alt = '';
      visual.appendChild(img);
    } else {
      const icon = document.createElement('span');
      icon.className = 'expert-map-marker-category-emoji';
      icon.textContent = item.categoryIcon || '•';
      visual.appendChild(icon);
    }
  } else {
    visual.classList.add('expert-map-marker-visual--pin');
    const pin = document.createElement('span');
    pin.className = 'expert-map-marker-pin';
    visual.appendChild(pin);
  }

  parent.appendChild(visual);
  return visual;
}

function buildExpertMarkerHead(item, style, { elevated3D = false } = {}) {
  const headWrap = document.createElement('span');
  headWrap.className = elevated3D
    ? 'expert-map-marker-head expert-map-marker-head--3d'
    : 'expert-map-marker-head';

  const headStyle =
    elevated3D && item.avatarUrl && item.name ? EXPERT_MARKER_STYLES.avatar : style;
  appendMarkerHead(headWrap, item, headStyle);
  return headWrap;
}

function build3DPoleMarker(btn, item, style, poleHeightPx) {
  const stack = document.createElement('span');
  stack.className = 'expert-map-marker-pole-stack';

  stack.appendChild(buildExpertMarkerHead(item, style, { elevated3D: true }));

  const pole = document.createElement('span');
  pole.className = 'expert-map-marker-pole';
  pole.style.height = `${poleHeightPx}px`;
  stack.appendChild(pole);

  const ground = document.createElement('span');
  ground.className = 'expert-map-marker-ground';
  ground.setAttribute('aria-hidden', 'true');
  stack.appendChild(ground);

  btn.appendChild(stack);
}

function buildFlatMarker(btn, item, style) {
  const head = buildExpertMarkerHead(item, style);
  btn.appendChild(head);
}

export function buildExpertMarkerElement(
  item,
  style = EXPERT_MARKER_STYLES.pin,
  { show3D = false, poleHeightPx = 30 } = {}
) {
  const wrap = document.createElement('div');
  wrap.className = show3D
    ? 'expert-map-marker-card expert-map-marker-card--3d'
    : 'expert-map-marker-card';
  wrap.setAttribute('dir', 'rtl');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'expert-map-marker-hit';
  const markerLabel =
    String(item.name || '').trim() ||
    String(item.categoryTitle || '').trim() ||
    'مارکر';
  btn.setAttribute('aria-label', markerLabel);
  btn.title = markerLabel;

  if (show3D) {
    const nameLabel = createExpertMarkerName3D(item);
    if (nameLabel) btn.appendChild(nameLabel);
    build3DPoleMarker(btn, item, style, poleHeightPx);
  } else {
    buildFlatMarker(btn, item, style);
    appendExpertMarkerName(wrap, item);
  }

  wrap.appendChild(btn);

  return { wrap, button: btn };
}

export function buildExpertMarkerPopupHtml(item) {
  const name = String(item.name || '').trim();
  const href = item.href || '#';
  const categoryLine = item.categoryTitle
    ? `<p class="expert-map-popup-category">${escapeHtml(item.categoryTitle)}</p>`
    : '';
  const nameLine = name
    ? `<p class="expert-map-popup-name">${escapeHtml(name)}</p>`
    : '';
  const linkLabel = item.popupLinkLabel || 'مشاهده پروفایل';

  return `
    <div class="expert-map-popup" dir="rtl">
      ${nameLine}
      ${categoryLine}
      <a href="${escapeHtml(href)}" class="expert-map-popup-link">${escapeHtml(linkLabel)}</a>
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
