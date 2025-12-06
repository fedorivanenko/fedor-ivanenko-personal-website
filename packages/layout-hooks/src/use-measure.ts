'use client'

import { useEffect, useRef, useMemo } from "react";

export type MeasureOptions = {
  position?: boolean;
  sizes?: boolean;
  skipOffscreen?: boolean;
  threshold?: number;
};

export type Rect = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export type UseMeasureReturn = {
  getRects: () => Rect[];
  subscribe: (fn: () => void) => () => void;
};

const DEFAULT_OPTIONS: MeasureOptions = {
  position: true,
  sizes: true,
  skipOffscreen: false,
  threshold: 0.01
};

export function useMeasure(
  refs: React.RefObject<HTMLElement | null>[],
  containerRef?: React.RefObject<HTMLElement | null>,
  options: MeasureOptions = DEFAULT_OPTIONS
): UseMeasureReturn {
  const rectsRef = useRef<Rect[]>([]);
  const prevRectsRef = useRef<Rect[]>([]);
  const callbacksRef = useRef<Set<() => void>>(new Set());
  const frameRef = useRef(0);
  const visibleRef = useRef<Set<number>>(new Set());

  const {
    position = true,
    sizes = true,
    skipOffscreen = false,
    threshold = 0.01
  } = options;

  const len = refs.length;

  // Pre-allocate rects arrays only when length changes
  if (rectsRef.current.length !== len) {
    rectsRef.current = Array.from({ length: len }, () => ({}));
    prevRectsRef.current = Array.from({ length: len }, () => ({}));
  }

  // Memoize the measure function
  const measureAll = useMemo(() => {
    return () => {
      frameRef.current = 0;

      let px = 0, py = 0;

      if (position && containerRef?.current) {
        const parentRect = containerRef.current.getBoundingClientRect();
        px = parentRect.left;
        py = parentRect.top;
      }

      const rects = rectsRef.current;
      const prevRects = prevRectsRef.current;
      const visible = skipOffscreen ? visibleRef.current : null;
      let hasChanges = false;

      for (let i = 0; i < len; i++) {
        // Skip if offscreen tracking is enabled and element is not visible
        if (visible && !visible.has(i)) continue;

        const el = refs[i].current;
        if (!el) continue;

        const r = el.getBoundingClientRect();
        const rect = rects[i];
        const prev = prevRects[i];

        let changed = false;

        if (position) {
          const newX = r.left - px;
          const newY = r.top - py;

          if (Math.abs((prev.x ?? 0) - newX) > threshold) {
            rect.x = newX;
            prev.x = newX;
            changed = true;
          }
          if (Math.abs((prev.y ?? 0) - newY) > threshold) {
            rect.y = newY;
            prev.y = newY;
            changed = true;
          }
        }

        if (sizes) {
          if (Math.abs((prev.w ?? 0) - r.width) > threshold) {
            rect.w = r.width;
            prev.w = r.width;
            changed = true;
          }
          if (Math.abs((prev.h ?? 0) - r.height) > threshold) {
            rect.h = r.height;
            prev.h = r.height;
            changed = true;
          }
        }

        if (changed) hasChanges = true;
      }

      // Only notify subscribers if something actually changed
      if (hasChanges) {
        const callbacks = callbacksRef.current;

        // Batch notifications if there are many subscribers
        if (callbacks.size > 10) {
          // Use microtask to batch
          queueMicrotask(() => {
            for (const cb of callbacks) cb();
          });
        } else {
          for (const cb of callbacks) cb();
        }
      }
    };
  }, [refs, containerRef, position, sizes, len, threshold, skipOffscreen]);

  useEffect(() => {
    const scheduleUpdate = () => {
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(measureAll);
      }
    };

    const ro = new ResizeObserver(scheduleUpdate);
    let io: IntersectionObserver | null = null;

    // Setup IntersectionObserver for offscreen detection
    if (skipOffscreen) {
      io = new IntersectionObserver(
        (entries) => {
          let needsUpdate = false;
          for (const entry of entries) {
            const idx = refs.findIndex(ref => ref.current === entry.target);
            if (idx === -1) continue;

            const wasVisible = visibleRef.current.has(idx);
            const isVisible = entry.isIntersecting;

            if (isVisible && !wasVisible) {
              visibleRef.current.add(idx);
              needsUpdate = true;
            } else if (!isVisible && wasVisible) {
              visibleRef.current.delete(idx);
            }
          }

          // Measure newly visible elements
          if (needsUpdate) scheduleUpdate();
        },
        {
          rootMargin: '50px', // Start measuring slightly before visible
          threshold: 0
        }
      );

      for (let i = 0; i < len; i++) {
        const el = refs[i].current;
        if (el) {
          io.observe(el);
          // Initially assume all are visible
          visibleRef.current.add(i);
        }
      }
    }

    // Only observe container if position tracking is enabled
    if (position && containerRef?.current) {
      ro.observe(containerRef.current);
    }

    // Only observe children if size tracking is enabled
    if (sizes) {
      for (let i = 0; i < len; i++) {
        const el = refs[i].current;
        if (el) ro.observe(el);
      }
    }

    // Only listen to window resize if we're tracking anything
    if (position || sizes) {
      window.addEventListener("resize", scheduleUpdate, { passive: true });
    }

    measureAll();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      if (skipOffscreen) visibleRef.current.clear();
    };
  }, [measureAll, position, sizes, len, containerRef, skipOffscreen]);

  return useMemo(() => ({
    getRects: () => rectsRef.current,
    subscribe: (fn: () => void) => {
      callbacksRef.current.add(fn);
      return () => void callbacksRef.current.delete(fn);
    },
  }), []);
}