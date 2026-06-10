import { buildCategoryPoleStack, buildPlaceIconHead } from './placeMapMarkerUi';
const MODEL_VIEWER_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';

/** برای فایل‌های glTF/GLB فشرده‌شده با EXT_meshopt_compression */
const MESHOPT_DECODER_SRC =
  'https://cdn.jsdelivr.net/npm/meshoptimizer@0.21.0/meshopt_decoder.js';

let modelViewerReady = null;

function configureModelViewerDecoders() {
  if (typeof window === 'undefined') return;

  const ModelViewerElement = customElements.get('model-viewer');
  if (!ModelViewerElement) return;

  if (!ModelViewerElement.meshoptDecoderLocation) {
    ModelViewerElement.meshoptDecoderLocation = MESHOPT_DECODER_SRC;
  }
}

export function ensureModelViewerLoaded() {
  if (typeof window === 'undefined') return Promise.resolve(false);

  if (customElements.get('model-viewer')) {
    configureModelViewerDecoders();
    return Promise.resolve(true);
  }

  if (!modelViewerReady) {
    modelViewerReady = new Promise((resolve) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = MODEL_VIEWER_SRC;
      script.onload = () => {
        configureModelViewerDecoders();
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }
  return modelViewerReady;
}

function buildModelViewerElement(
  glbSrc,
  {
    autoRotate = true,
    map3D = false,
    cameraOrbit,
    rotationPerSecond,
    exposure,
    shadowIntensity,
    fieldOfView,
    modelOrientation,
    autoRotateDelay = 0,
  } = {}
) {
  const viewer = document.createElement('model-viewer');
  viewer.className = 'map-glb-marker-model';
  viewer.src = glbSrc;
  viewer.alt = '';
  viewer.setAttribute('aria-hidden', 'true');
  viewer.setAttribute('loading', 'eager');
  viewer.setAttribute('interaction-prompt', 'none');
  viewer.setAttribute('disable-zoom', '');
  viewer.setAttribute('disable-pan', '');
  viewer.setAttribute('disable-tap', '');
  viewer.setAttribute('camera-controls', 'false');
  viewer.setAttribute(
    'shadow-intensity',
    String(shadowIntensity ?? (map3D ? 1 : 0.85))
  );
  viewer.setAttribute('exposure', String(exposure ?? (map3D ? 1.15 : 1.05)));
  if (autoRotate) viewer.setAttribute('auto-rotate', '');
  const orbit = cameraOrbit || (map3D ? '0deg 68deg auto' : null);
  if (orbit) viewer.setAttribute('camera-orbit', orbit);
  const rotation = rotationPerSecond || (map3D && autoRotate ? '18deg' : null);
  if (rotation && autoRotate) viewer.setAttribute('rotation-per-second', rotation);
  if (Number.isFinite(Number(fieldOfView)) && Number(fieldOfView) > 0) {
    viewer.setAttribute('field-of-view', `${fieldOfView}deg`);
  }
  if (modelOrientation) viewer.setAttribute('orientation', modelOrientation);
  if (autoRotateDelay > 0) {
    viewer.setAttribute('auto-rotate-delay', String(autoRotateDelay));
  }

  viewer.style.width = '100%';
  viewer.style.height = '100%';
  viewer.style.pointerEvents = 'none';
  viewer.style.background = 'transparent';

  return viewer;
}

export function createGlbModelElement(
  glbSrc,
  {
    sizePx = 44,
    autoRotate = true,
    map3D = false,
    cameraOrbit,
    rotationPerSecond,
    exposure,
    shadowIntensity,
    scale = 1,
    fieldOfView,
    modelOrientation,
    autoRotateDelay = 0,
  } = {}
) {
  const wrap = document.createElement('span');
  wrap.className = map3D
    ? 'map-glb-marker-visual map-glb-marker-visual--map3d'
    : 'map-glb-marker-visual';
  wrap.style.width = `${sizePx}px`;
  wrap.style.height = `${sizePx}px`;
  const scaleNum = Number(scale);
  if (Number.isFinite(scaleNum) && scaleNum > 0 && scaleNum !== 1) {
    wrap.style.transform = `scale(${scaleNum})`;
    wrap.style.transformOrigin = 'center bottom';
  }

  ensureModelViewerLoaded().then((ok) => {
    if (!ok) return;
    wrap.appendChild(
      buildModelViewerElement(glbSrc, {
        autoRotate,
        map3D,
        cameraOrbit,
        rotationPerSecond,
        exposure,
        shadowIntensity,
        fieldOfView,
        modelOrientation,
        autoRotateDelay,
      })
    );
  });

  return wrap;
}

function buildGlbHead(glbSrc, tone, { elevated3D = false, sizePx = 44, map3D = false } = {}) {
  const headWrap = document.createElement('span');
  headWrap.className = elevated3D
    ? 'expert-map-marker-head expert-map-marker-head--3d map-glb-marker-head'
    : 'expert-map-marker-head map-glb-marker-head';

  const visual = document.createElement('span');
  visual.className = `expert-map-marker-visual expert-map-marker-visual--category place-map-marker-visual place-map-marker-visual--${tone || 'teal'} map-glb-marker-shell`;
  visual.appendChild(
    createGlbModelElement(glbSrc, {
      sizePx: elevated3D ? (map3D ? sizePx || 72 : 46) : sizePx,
      map3D: elevated3D && map3D,
    })
  );
  headWrap.appendChild(visual);

  return headWrap;
}

function buildMerchantGlbModelOnly(glbSrc, { map3D = false, config = {} } = {}) {
  const sizePx = map3D ? config.sizePx3d || 80 : config.sizePx || 56;
  const wrap = document.createElement('span');
  wrap.className = map3D
    ? 'map-merchant-glb-model map-merchant-glb-model--map3d'
    : 'map-merchant-glb-model';
  wrap.appendChild(
    createGlbModelElement(glbSrc, {
      sizePx,
      map3D,
      autoRotate: config.autoRotate,
      cameraOrbit: config.cameraOrbit,
      rotationPerSecond: config.rotationPerSecond,
      exposure: config.exposure,
      shadowIntensity: config.shadowIntensity,
      scale: config.scale,
      fieldOfView: config.fieldOfView,
      modelOrientation: config.modelOrientation,
      autoRotateDelay: config.autoRotateDelay,
    })
  );
  return wrap;
}

function buildMerchantGlb3DStack(glbSrc, { config = {} } = {}) {
  const stack = document.createElement('span');
  stack.className = 'map-merchant-glb-3d-stack';
  stack.appendChild(buildMerchantGlbModelOnly(glbSrc, { map3D: true, config }));
  return stack;
}

function buildGlb3DPoleStack(glbSrc, tone, poleHeightPx) {
  const stack = document.createElement('span');
  stack.className = 'expert-map-marker-pole-stack map-glb-marker-pole-stack';

  stack.appendChild(buildGlbHead(glbSrc, tone, { elevated3D: true }));

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

/** مارکر فروشگاه با مدل GLB — همان الگوی مارکر مکان‌های ۳D */
export function buildGlbPlaceMarkerElement(
  item,
  { glbSrc, tone = 'teal', title = '' } = {},
  { show3D = false, poleHeightPx = 30 } = {}
) {
  const label = title || item?.title || '';
  const wrap = document.createElement('div');
  wrap.className = show3D
    ? 'expert-map-marker-card expert-map-marker-card--3d place-map-marker-card map-glb-marker-card'
    : 'expert-map-marker-card place-map-marker-card map-glb-marker-card';
  wrap.setAttribute('dir', 'rtl');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'expert-map-marker-hit';
  btn.setAttribute('aria-label', label);
  btn.title = label;

  if (show3D) {
    if (label) {
      const nameLabel = document.createElement('span');
      nameLabel.className =
        'expert-map-marker-name expert-map-marker-name--3d place-map-marker-name';
      nameLabel.textContent = label;
      btn.appendChild(nameLabel);
    }
    btn.appendChild(buildGlb3DPoleStack(glbSrc, tone, poleHeightPx));
  } else {
    btn.appendChild(buildGlbHead(glbSrc, tone));
  }

  wrap.appendChild(btn);

  if (!show3D && label) {
    const nameWrap = document.createElement('span');
    nameWrap.className = 'expert-map-marker-name place-map-marker-name';
    const line = document.createElement('span');
    line.className = 'expert-map-marker-name-line';
    line.textContent = label;
    nameWrap.appendChild(line);
    wrap.appendChild(nameWrap);
  }

  return { wrap, button: btn };
}

/** مارکر فروشگاه — آیکون زیردسته بالای میله (مثل مراکز) */
export function buildMerchantGlbMarkerElement(
  item,
  { show3D = false, poleHeightPx = 30 } = {}
) {
  const label = String(item?.name || item?.title || '').trim();
  const iconName = item?.categoryIcon || '🏪';
  const tone = item?.categoryTone || 'amber';

  const wrap = document.createElement('div');
  wrap.className = show3D
    ? 'expert-map-marker-card expert-map-marker-card--3d place-map-marker-card map-merchant-glb-marker-card map-merchant-glb-marker-card--map3d'
    : 'expert-map-marker-card place-map-marker-card map-merchant-glb-marker-card';
  wrap.setAttribute('dir', 'rtl');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'expert-map-marker-hit map-merchant-glb-hit';
  btn.setAttribute('aria-label', label || 'فروشگاه');
  btn.title = label;

  if (show3D) {
    if (label) {
      const nameLabel = document.createElement('span');
      nameLabel.className =
        'expert-map-marker-name expert-map-marker-name--3d place-map-marker-name';
      nameLabel.textContent = label;
      btn.appendChild(nameLabel);
    }
    btn.appendChild(buildCategoryPoleStack(iconName, tone, poleHeightPx));
  } else {
    btn.appendChild(buildPlaceIconHead(iconName, tone));
  }

  wrap.appendChild(btn);

  if (!show3D && label) {
    const nameWrap = document.createElement('span');
    nameWrap.className = 'expert-map-marker-name place-map-marker-name';
    const line = document.createElement('span');
    line.className = 'expert-map-marker-name-line';
    line.textContent = label;
    nameWrap.appendChild(line);
    wrap.appendChild(nameWrap);
  }

  return { wrap, button: btn };
}

/** پین ثبت آدرس مغازه — مدل GLB؛ در ۳D بدون میله بلند تا در نقشهٔ کوچک پروفایل clip نشود */
export function buildGlbAddressPinElement(glbSrc, { show3D = false } = {}) {
  const wrap = document.createElement('div');
  wrap.className = show3D
    ? 'map-glb-pin-wrap map-glb-pin-wrap--3d map-glb-pin-wrap--flat3d'
    : 'map-glb-pin-wrap';

  wrap.appendChild(
    buildGlbHead(glbSrc, 'amber', {
      elevated3D: show3D,
      sizePx: show3D ? 56 : 52,
    })
  );

  return wrap;
}
