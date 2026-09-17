// Minimal rect cache (glue for canvas-ui Droplets).
// Caches getBoundingClientRect, refreshes on resize/scroll.
export function createRectCache(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  const refresh = () => {
    rect = el.getBoundingClientRect();
  };
  const ro = new ResizeObserver(refresh);
  ro.observe(el);
  window.addEventListener("scroll", refresh, { passive: true });
  window.addEventListener("resize", refresh);
  return {
    get current() {
      return rect;
    },
    destroy() {
      ro.disconnect();
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    },
  };
}
