'use client'

import { useLayoutEffect, useRef, useMemo, useState } from "react";

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

  // Create a stable key from refs to detect when the actual ref objects change
  // This prevents stale measurements when refs array is recreated with different refs
  const refsKey = refs.map(r => r.current).join(',');

  // Pre-allocate rects arrays only when length changes
  if (rectsRef.current.length !== len) {
    rectsRef.current = Array.from({ length: len }, () => ({}));
    prevRectsRef.current = Array.from({ length: len }, () => ({}));
  }

  // Memoize the measure function
  // Note: We intentionally don't include 'refs' directly in deps because
  // we want to track ref changes via refsKey instead
  const measureAll = useMemo(() => {
    return () => {
      frameRef.current = 0;

      let px = 0, py = 0;

      // Calculate container offset for relative positioning
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

          // Always update on first measurement (when prev is undefined)
          // This ensures initial values are always captured, even if they're close to 0
          if (prev.x === undefined || Math.abs(prev.x - newX) > threshold) {
            rect.x = newX;
            prev.x = newX;
            changed = true;
          }
          if (prev.y === undefined || Math.abs(prev.y - newY) > threshold) {
            rect.y = newY;
            prev.y = newY;
            changed = true;
          }
        }

        if (sizes) {
          // Same fix for sizes - always update when undefined
          if (prev.w === undefined || Math.abs(prev.w - r.width) > threshold) {
            rect.w = r.width;
            prev.w = r.width;
            changed = true;
          }
          if (prev.h === undefined || Math.abs(prev.h - r.height) > threshold) {
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

        // Notify subscribers synchronously for immediate style updates
        // This prevents visual lag when applying styles in useLayoutEffect
        for (const cb of callbacks) cb();
      }
    };
    // Use refsKey instead of refs to detect actual ref changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refsKey, containerRef, position, sizes, len, threshold, skipOffscreen]);

  useLayoutEffect(() => {

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
              // Don't clear measurements when element goes offscreen
              // Keep last known values for better UX
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

      // Don't assume all elements are visible initially
      // Let IntersectionObserver tell us what's actually visible
      for (let i = 0; i < len; i++) {
        const el = refs[i].current;
        if (el) {
          io.observe(el);
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
      // Store event listener options for proper cleanup
      const resizeOptions: AddEventListenerOptions = { passive: true };
      window.addEventListener("resize", scheduleUpdate, resizeOptions);

      // Store cleanup reference
      const cleanup = () => {
        // Note: Some browsers require the same options object for removal
        // but the spec says only 'capture' matters for removal
        window.removeEventListener("resize", scheduleUpdate);
      };

      // Initial measurement
      measureAll();

      // Schedule second measurement for elements that might appear after mount
      // This catches refs that are populated after initial render
      const initialMeasureTimeout = setTimeout(measureAll, 0);

      return () => {
        clearTimeout(initialMeasureTimeout);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        ro.disconnect();
        io?.disconnect();
        cleanup();
        if (skipOffscreen) visibleRef.current.clear();
      };
    }

    // Initial measurement
    measureAll();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      io?.disconnect();
      if (skipOffscreen) visibleRef.current.clear();
    };
  }, [measureAll, position, sizes, len, containerRef, skipOffscreen]);

  // Return stable functions that don't cause re-renders
  return useMemo(() => ({
    getRects: () => rectsRef.current,
    subscribe: (fn: () => void) => {
      callbacksRef.current.add(fn);
      return () => void callbacksRef.current.delete(fn);
    }
  }), []);
}