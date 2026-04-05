"use client";

import * as React from "react";
import { useDrag, useWheel } from "@use-gesture/react";

const THRESHOLD = 32; // px — ratchet tooth spacing

export interface UseRotationWheelOptions {
  count: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  loop: boolean;
  disabled?: boolean;
}

export interface UseRotationWheelReturn {
  /** Clamped active index (safe even if activeIndex is out of bounds) */
  safeIndex: number;
  velocity: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleOptionClick: (index: number) => void;
}

export function useRotationWheel({
  count: n,
  activeIndex,
  onIndexChange,
  loop,
  disabled = false,
}: UseRotationWheelOptions): UseRotationWheelReturn {
  const safeIndex = n === 0 ? 0 : Math.max(0, Math.min(n - 1, activeIndex));
  const velRef = React.useRef(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const rotate = React.useCallback(
    (delta: number) => {
      if (n === 0 || disabled) return;
      const next = loop
        ? (safeIndex + delta + n) % n
        : Math.max(0, Math.min(n - 1, safeIndex + delta));
      if (next !== safeIndex) {
        onIndexChange(next);
      }
    },
    [loop, n, safeIndex, onIndexChange, disabled],
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
    if (disabled) return;
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
      if (disabled) return;
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
      tap,
      event,
    }) => {
      if (disabled) return;
      event.preventDefault();
      if (tap) return;
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
      filterTaps: false,
      eventOptions: { passive: false },
      pointer: { touch: true, keys: false },
    },
  );

  // --- Keyboard ---
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      cancelInertia();
      velRef.current = e.repeat ? Infinity : 0;
      rotate(e.key === "ArrowDown" ? 1 : -1);
    },
    [rotate, disabled],
  );

  // --- Tap-to-select ---
  const handleOptionClick = React.useCallback(
    (index: number) => {
      if (disabled || n === 0) return;
      if (index >= 0 && index < n && index !== safeIndex) {
        velRef.current = 0;
        onIndexChange(index);
      }
    },
    [disabled, n, safeIndex, onIndexChange],
  );

  // --- Cleanup inertia on unmount ---
  React.useEffect(() => cancelInertia, []);

  return {
    safeIndex,
    velocity: velRef.current,
    containerRef,
    handleKeyDown,
    handleOptionClick,
  };
}
