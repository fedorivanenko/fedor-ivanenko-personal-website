"use client";

import * as React from "react";
import { useDrag, useWheel } from "@use-gesture/react";

const THRESHOLD = 32; // px — ratchet tooth spacing

export interface UseRotationWheelOptions {
  count: number;
  loop: boolean;
  onPick: (index: number) => void;
}

export interface UseRotationWheelReturn {
  activeIndex: number;
  velocity: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function useRotationWheel({
  count: n,
  loop,
  onPick,
}: UseRotationWheelOptions): UseRotationWheelReturn {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const velRef = React.useRef(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const rotate = React.useCallback(
    (delta: number) => {
      setActiveIndex((prev) =>
        loop
          ? (prev + delta + n) % n
          : Math.max(0, Math.min(n - 1, prev + delta)),
      );
    },
    [loop, n],
  );

  // --- Ratchet accumulator ---
  const acc = React.useRef(0);
  const prevDir = React.useRef(0);

  // --- Inertia ---
  const inertiaTimers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  function cancelInertia() {
    if (inertiaTimers.current.length > 0) {
      inertiaTimers.current.forEach(clearTimeout);
      inertiaTimers.current = [];
    }
  }

  function applyInertia(v0: number, dir: number) {
    cancelInertia();
    let t = 0;
    for (let k = 0; k < 12; k++) {
      const vk = v0 * Math.exp(-k / 6);
      if (vk < 0.02) break;
      t += THRESHOLD / vk;
      const capturedV = vk;
      inertiaTimers.current.push(
        setTimeout(() => {
          velRef.current = capturedV;
          rotate(dir);
        }, t),
      );
    }
  }

  // --- Shared move handler (ratchet) ---
  function handleMove(dir: number, dY: number, velocity: number) {
    if (dir !== 0 && dir !== prevDir.current) {
      prevDir.current = dir;
      acc.current = 0;
      return;
    }
    acc.current += Math.abs(dY);
    if (acc.current >= THRESHOLD) {
      acc.current = 0;
      velRef.current = velocity;
      rotate(dir);
    }
  }

  // --- Gesture bindings ---
  useWheel(
    ({ direction: [, dirY], velocity: [, vY], delta: [, dY], event }) => {
      event.preventDefault();
      handleMove(dirY, dY, Math.abs(vY));
    },
    { target: containerRef, eventOptions: { passive: false } },
  );

  useDrag(
    ({
      direction: [, dirY],
      velocity: [, vY],
      delta: [, dY],
      first: isFirst,
      last,
      event,
    }) => {
      event.preventDefault();
      if (isFirst) {
        acc.current = 0;
        cancelInertia();
      }
      if (last) {
        applyInertia(Math.abs(vY), -dirY);
        return;
      }
      handleMove(-dirY, dY, Math.abs(vY));
    },
    {
      target: containerRef,
      axis: "y",
      filterTaps: true,
      eventOptions: { passive: false },
      pointer: { touch: true, keys: false },
    },
  );

  // --- Keyboard ---
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      cancelInertia();
      velRef.current = e.repeat ? Infinity : 0;
      rotate(e.key === "ArrowDown" ? 1 : -1);
    },
    [rotate],
  );

  // --- onPick debounce ---
  const isFirst = React.useRef(true);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onPick(activeIndex);
      timer.current = null;
    }, 125);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // biome-ignore lint/react-hooks/exhaustiveDeps: intentionally limited
  }, [onPick, activeIndex]);

  // --- Cleanup inertia on unmount ---
  React.useEffect(() => cancelInertia, []);

  return {
    activeIndex,
    velocity: velRef.current,
    containerRef,
    handleKeyDown,
  };
}
