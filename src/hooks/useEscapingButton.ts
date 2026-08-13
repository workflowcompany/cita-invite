import { useEffect, useRef, useState } from "react";

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface Offset {
  x: number;
  y: number;
}

interface UseEscapingButtonOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  yesButtonRef: React.RefObject<HTMLButtonElement | null>;
  noButtonRef: React.RefObject<HTMLButtonElement | null>;
}

function isMobile(): boolean {
  return window.matchMedia("(max-width: 768px)").matches;
}

function getPadding(): number {
  return isMobile() ? 10 : 16;
}

function getYesBuffer(): number {
  return isMobile() ? 14 : 24;
}

function getThreshold(): number {
  return isMobile() ? 90 : 140;
}

function getInitialOffset(): Offset {
  return isMobile() ? { x: 72, y: 36 } : { x: 110, y: 0 };
}

function getFleeDistances(): number[] {
  return isMobile() ? [180, 140, 100, 70, 45] : [220, 170, 120, 80, 50];
}

function overlaps(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function getNoCenterClient(
  container: HTMLElement,
  offset: Offset,
): { x: number; y: number } {
  const c = container.getBoundingClientRect();
  return { x: c.left + c.width / 2 + offset.x, y: c.top + c.height / 2 + offset.y };
}

function offsetToClient(container: HTMLElement, offset: Offset) {
  return getNoCenterClient(container, offset);
}

function getBounds(
  container: HTMLElement,
  yesEl: HTMLElement | null,
  noEl: HTMLElement,
) {
  const cRect = container.getBoundingClientRect();
  const noRect = noEl.getBoundingClientRect();
  const w = noRect.width;
  const h = noRect.height;

  const padding = getPadding();
  const yesBuffer = getYesBuffer();

  let yesEx: Rect | null = null;
  if (yesEl) {
    const y = yesEl.getBoundingClientRect();
    yesEx = {
      left: y.left - cRect.left - yesBuffer,
      top: y.top - cRect.top - yesBuffer,
      right: y.right - cRect.left + yesBuffer,
      bottom: y.bottom - cRect.top + yesBuffer,
    };
  }

  const minCX = padding + w / 2;
  const maxCX = cRect.width - padding - w / 2;
  const minCY = padding + h / 2;
  const maxCY = cRect.height - padding - h / 2;

  return {
    minX: minCX - cRect.width / 2,
    maxX: maxCX - cRect.width / 2,
    minY: minCY - cRect.height / 2,
    maxY: maxCY - cRect.height / 2,
    yesEx,
    w,
    h,
    cRect,
  };
}

function centerFromOffset(container: HTMLElement, offset: Offset) {
  const c = container.getBoundingClientRect();
  return { cx: c.width / 2 + offset.x, cy: c.height / 2 + offset.y };
}

function isValidOffset(
  offset: Offset,
  bounds: ReturnType<typeof getBounds>,
): boolean {
  const { cx, cy } = { cx: bounds.cRect.width / 2 + offset.x, cy: bounds.cRect.height / 2 + offset.y };
  const padding = getPadding();
  if (cx < padding + bounds.w / 2 || cx > bounds.cRect.width - padding - bounds.w / 2) return false;
  if (cy < padding + bounds.h / 2 || cy > bounds.cRect.height - padding - bounds.h / 2) return false;
  if (bounds.yesEx) {
    const btn: Rect = {
      left: cx - bounds.w / 2,
      top: cy - bounds.h / 2,
      right: cx + bounds.w / 2,
      bottom: cy + bounds.h / 2,
    };
    if (overlaps(btn, bounds.yesEx)) return false;
  }
  return true;
}

function offsetFromCenter(cx: number, cy: number, bounds: ReturnType<typeof getBounds>): Offset {
  return { x: cx - bounds.cRect.width / 2, y: cy - bounds.cRect.height / 2 };
}

function clampOffset(offset: Offset, bounds: ReturnType<typeof getBounds>): Offset {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, offset.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, offset.y)),
  };
}

function distOffset(a: Offset, b: Offset): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function computeFleeOffset(
  current: Offset,
  pointerClientX: number,
  pointerClientY: number,
  container: HTMLElement,
  yesEl: HTMLElement | null,
  noEl: HTMLElement,
): Offset {
  const bounds = getBounds(container, yesEl, noEl);
  const center = getNoCenterClient(container, current);
  const ptr = { x: pointerClientX, y: pointerClientY };

  const dx = center.x - ptr.x;
  const dy = center.y - ptr.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len;
  const ny = dy / len;

  const { cx: curCX, cy: curCY } = centerFromOffset(container, current);

  for (const d of getFleeDistances()) {
    const ncx = curCX + nx * d;
    const ncy = curCY + ny * d;
    const off = offsetFromCenter(ncx, ncy, bounds);
    if (isValidOffset(off, bounds) && distOffset(off, current) > 15) return off;
  }

  const padding = getPadding();
  const spots = [
    { cx: padding + bounds.w / 2, cy: padding + bounds.h / 2 },
    { cx: bounds.cRect.width - padding - bounds.w / 2, cy: padding + bounds.h / 2 },
    { cx: padding + bounds.w / 2, cy: bounds.cRect.height - padding - bounds.h / 2 },
    { cx: bounds.cRect.width - padding - bounds.w / 2, cy: bounds.cRect.height - padding - bounds.h / 2 },
  ];

  let best: Offset | null = null;
  let bestScore = -1;

  for (const { cx, cy } of spots) {
    const off = offsetFromCenter(cx, cy, bounds);
    if (!isValidOffset(off, bounds)) continue;
    if (distOffset(off, current) < 15) continue;
    const cc = offsetToClient(container, off);
    const score = Math.hypot(cc.x - ptr.x, cc.y - ptr.y) + distOffset(off, current);
    if (score > bestScore) {
      bestScore = score;
      best = off;
    }
  }

  if (best) return best;

  for (let i = 0; i < 40; i++) {
    const off = {
      x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
    };
    if (isValidOffset(off, bounds) && distOffset(off, current) > 15) return off;
  }

  return clampOffset(
    { x: bounds.minX + bounds.maxX - current.x, y: bounds.minY + bounds.maxY - current.y },
    bounds,
  );
}

export function useEscapingButton({
  containerRef,
  yesButtonRef,
  noButtonRef,
}: UseEscapingButtonOptions) {
  const [offset, setOffset] = useState<Offset>(() => getInitialOffset());
  const [escapeCount, setEscapeCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const offsetRef = useRef<Offset>(getInitialOffset());
  const escapeRef = useRef(0);
  const wasNearRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const fn = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  function flee(clientX: number, clientY: number, count: boolean) {
    const container = containerRef.current;
    const noEl = noButtonRef.current;
    if (!container || !noEl) return;

    const next = computeFleeOffset(
      offsetRef.current,
      clientX,
      clientY,
      container,
      yesButtonRef.current,
      noEl,
    );

    offsetRef.current = next;
    setOffset({ ...next });

    if (count) {
      const n = escapeRef.current + 1;
      escapeRef.current = n;
      setEscapeCount(n);
    }
  }

  function checkProximity(clientX: number, clientY: number) {
    const container = containerRef.current;
    if (!container) return;

    const center = getNoCenterClient(container, offsetRef.current);
    const d = Math.hypot(clientX - center.x, clientY - center.y);

    if (d < getThreshold()) {
      flee(clientX, clientY, !wasNearRef.current);
      wasNearRef.current = true;
    } else {
      wasNearRef.current = false;
    }
  }

  useEffect(() => {
    const scheduleCheck = (clientX: number, clientY: number) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        checkProximity(clientX, clientY);
      });
    };

    const onMove = (e: PointerEvent) => scheduleCheck(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) scheduleCheck(t.clientX, t.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  });

  useEffect(() => {
    const btn = noButtonRef.current;
    if (!btn) return;
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (t) flee(t.clientX, t.clientY, true);
    };
    btn.addEventListener("touchstart", onTouch, { passive: false });
    return () => btn.removeEventListener("touchstart", onTouch);
  }, [escapeCount]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    flee(e.clientX, e.clientY, true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    flee(e.clientX, e.clientY, true);
  };

  const yesScale = Math.min(1 + escapeCount * 0.06, 1.6);
  const noScale = Math.max(1 - escapeCount * 0.04, 0.55);
  const noOpacity = Math.max(1 - escapeCount * 0.03, 0.7);

  return {
    offset,
    escapeCount,
    isFinalCorner: escapeCount >= 10,
    prefersReducedMotion,
    yesScale,
    noScale,
    noOpacity,
    handlePointerDown: onPointerDown,
    handleTouchStart: onTouchStart,
    handleNoClick: onClick,
  };
}
