export const MAP_CORNER_PANEL_WIDTH = 248;
export const MAP_CORNER_PANEL_GAP = 6;

export function computeMapCornerPanelStyle(
  triggerRect,
  panelHeightEstimate = 240,
  panelWidth = MAP_CORNER_PANEL_WIDTH,
  preferOpenUp = false
) {
  if (!triggerRect || typeof window === 'undefined') return null;

  const width = Math.min(panelWidth, window.innerWidth - 16);
  const right = Math.max(8, window.innerWidth - triggerRect.right);
  const spaceBelow = window.innerHeight - triggerRect.bottom - MAP_CORNER_PANEL_GAP;
  const spaceAbove = triggerRect.top - MAP_CORNER_PANEL_GAP;
  const openDown =
    !preferOpenUp && (spaceBelow >= panelHeightEstimate || spaceBelow >= spaceAbove);

  if (openDown) {
    return {
      position: 'fixed',
      right,
      top: triggerRect.bottom + MAP_CORNER_PANEL_GAP,
      width,
      zIndex: 10020,
    };
  }

  return {
    position: 'fixed',
    right,
    bottom: window.innerHeight - triggerRect.top + MAP_CORNER_PANEL_GAP,
    width,
    zIndex: 10020,
  };
}
