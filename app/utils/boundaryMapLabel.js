/** از این زوم به بالا supercluster برچسب‌ها را ریزتر می‌کند (نه cutoff ناگهانی) */
export const BOUNDARY_CLUSTER_MAX_ZOOM = 16;
export const BOUNDARY_CLUSTER_SECTION_MAX_ZOOM = 17;

/** حداکثر تعداد برچسب بدون خوشه‌بندی */
export const BOUNDARY_LABEL_DIRECT_RENDER_LIMIT = 32;

/** برچسب فارسی روی نقشه — با textContent و dir=rtl برای اتصال درست حروف */

export function createBoundaryLabelSpan(name, selected = false) {
  const span = document.createElement('span');
  span.className = `boundary-area-label${selected ? ' boundary-area-label--selected' : ''}`;
  span.setAttribute('dir', 'rtl');
  span.setAttribute('lang', 'fa');
  span.textContent = String(name || '').trim();
  return span;
}

export function createBoundaryLabelHtml(name, selected = false) {
  return createBoundaryLabelSpan(name, selected).outerHTML;
}

export function createBoundaryClusterHtml(count, hint) {
  const wrap = document.createElement('span');
  wrap.className = 'boundary-area-cluster';
  wrap.setAttribute('dir', 'rtl');
  wrap.setAttribute('lang', 'fa');

  const countEl = document.createElement('span');
  countEl.className = 'boundary-area-cluster-count';
  countEl.textContent = String(count);

  const hintEl = document.createElement('span');
  hintEl.className = 'boundary-area-cluster-hint';
  hintEl.textContent = String(hint || '');

  wrap.append(countEl, hintEl);
  return wrap.outerHTML;
}
