const HEADER_SCROLL_OFFSET = 112;
const HIGHLIGHT_MS = 2800;

export function clearHomePathHighlights() {
  document.querySelectorAll('[data-home-path-active]').forEach((node) => {
    node.removeAttribute('data-home-path-active');
    node.classList.remove('home-path-highlight');
  });
}

/**
 * @param {string | string[]} targetIds
 * @param {{ focusSearch?: boolean }} options
 */
export function focusHomePath(targetIds, options = {}) {
  if (typeof document === 'undefined') return;

  const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
  const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!elements.length) return;

  clearHomePathHighlights();

  const primary = elements[0];
  const top =
    primary.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

  elements.forEach((el) => {
    el.setAttribute('data-home-path-active', 'true');
    el.classList.add('home-path-highlight');
  });

  if (options.focusSearch) {
    window.setTimeout(() => {
      const input =
        document.getElementById('hero-search') ||
        document.getElementById('goods-map-category-search') ||
        document.getElementById('goods-map-category-search-fullscreen');
      if (input) {
        input.focus({ preventScroll: true });
        return;
      }
      window.dispatchEvent(new CustomEvent('goods-map-open-search'));
      window.setTimeout(() => {
        document
          .getElementById('goods-map-category-search')
          ?.focus({ preventScroll: true });
      }, 120);
    }, 450);
  }

  window.setTimeout(() => {
    elements.forEach((el) => {
      el.removeAttribute('data-home-path-active');
      el.classList.remove('home-path-highlight');
    });
  }, HIGHLIGHT_MS);
}
