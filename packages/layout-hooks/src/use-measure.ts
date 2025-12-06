'use client'

import { useEffect, useRef } from "react";

export type MeasureOptions = {
  position?: boolean;
  sizes?: boolean;
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

const DEFAULT_OPTIONS: MeasureOptions = { position: true, sizes: true };

export function useMeasure(
  refs: React.RefObject<HTMLElement | null>[],
  containerRef?: React.RefObject<HTMLElement | null>,
  options: MeasureOptions = DEFAULT_OPTIONS
): UseMeasureReturn {
  const rectsRef = useRef<Rect[]>([]);
  const callbacksRef = useRef<Set<() => void>>(new Set());

  const { position = true, sizes = true } = options;

  useEffect(() => {
    let frame = 0;
    const len = refs.length;

    if (rectsRef.current.length !== len) {
      rectsRef.current = new Array(len);
      for (let i = 0; i < len; i++) {
        rectsRef.current[i] = {};
      }
    }

    const measureAll = () => {
      frame = 0;

      let px = 0;
      let py = 0;

      if (containerRef?.current) {
        const parentRect = containerRef.current.getBoundingClientRect();
        px = parentRect.left;
        py = parentRect.top;
      }

      const rects = rectsRef.current;

      for (let i = 0; i < len; i++) {
        const el = refs[i].current;
        if (el) {
          const r = el.getBoundingClientRect();
          const rect = rects[i];

          if (position) {
            rect.x = r.left - px;
            rect.y = r.top - py;
          }

          if (sizes) {
            rect.w = r.width;
            rect.h = r.height;
          }
        }
      }

      const callbacks = callbacksRef.current;
      for (const cb of callbacks) cb();
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(measureAll);
    };

    const ro = new ResizeObserver(scheduleUpdate);

    if (containerRef?.current) {
      ro.observe(containerRef.current);
    }

    if (sizes) {
      for (let i = 0; i < len; i++) {
        const el = refs[i].current;
        if (el) ro.observe(el);
      }
    }

    window.addEventListener("resize", scheduleUpdate);
    measureAll();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [refs, containerRef, position, sizes]);

  return {
    getRects: () => rectsRef.current,
    subscribe: (fn: () => void) => {
      callbacksRef.current.add(fn);
      return () => void callbacksRef.current.delete(fn);
    },
  };
}