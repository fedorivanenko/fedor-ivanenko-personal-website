"use client";

import * as React from "react";
import { animated, useReducedMotion, useSprings } from "@react-spring/web";
import { cn } from "./utils";
import { useRotationWheel } from "./use-rotation-wheel";

export interface RotationWheelOption {
  value: string;
  label: React.ReactNode;
}

interface RotationWheelProps {
  options: RotationWheelOption[];
  onPick: (value: string) => void;
  loop?: boolean;
  className?: string;
  itemHeight?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const ANGLE_STEP = 12; // deg between slots
const RAD = (ANGLE_STEP * Math.PI) / 180;
const MIN_SNAP_MS = 50;

function relativePosition(
  i: number,
  active: number,
  n: number,
  loop: boolean,
): number {
  if (!loop) return i - active;
  const raw = (i - active + n) % n;
  return raw > n / 2 ? raw - n : raw;
}

function clickConfig(velocity: number): {
  immediate: boolean;
  tension: number;
  friction: number;
} {
  const dt = velocity > 0 ? 32 / velocity : Infinity;
  if (dt < MIN_SNAP_MS) return { immediate: true, tension: 170, friction: 26 };
  const t = MIN_SNAP_MS / dt;
  const tension = Math.round(170 + t * 630);
  const friction = Math.round(2 * Math.sqrt(tension));
  return { immediate: false, tension, friction };
}

const RotationWheel = React.forwardRef<HTMLDivElement, RotationWheelProps>(
  function RotationWheel(
    {
      options,
      onPick,
      loop = options.length >= 6,
      className,
      itemHeight = "2em",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    forwardedRef,
  ) {
    const n = options.length;

    const { activeIndex, velocity, containerRef, handleKeyDown } =
      useRotationWheel({
        count: n,
        loop,
        onPick: React.useCallback(
          (index: number) => onPick(options[index].value),
          // biome-ignore lint/react-hooks/exhaustiveDeps: options identity may change
          [onPick, options],
        ),
      });

    React.useImperativeHandle(forwardedRef, () => containerRef.current!);

    const reducedMotion = useReducedMotion();
    const [springs] = useSprings(
      n,
      (i) => {
        const rel = relativePosition(i, activeIndex, n, loop);
        const dist = Math.abs(rel);
        const { immediate: velImmediate, tension, friction } = clickConfig(velocity);
        const immediate = dist > 4 || !!reducedMotion || velImmediate;
        return {
          rotateX: rel * ANGLE_STEP,
          opacity: [1, 0.75, 0.5, 0.25][dist] ?? 0,
          scale: rel === 0 ? 1 : 0.9,
          immediate,
          config: { tension, friction },
        };
      },
      [activeIndex],
    );

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          "select-none touch-none cursor-grab relative overflow-hidden outline-none h-full",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        style={{
          perspective: "64rem",
          ["--rad" as string]: RAD,
          ["--h" as string]: itemHeight,
        }}
      >
        {options.map((option, i) => (
          <animated.div
            key={option.value}
            role="option"
            aria-selected={i === activeIndex}
            style={{
              scale: springs[i].scale,
              rotateX: springs[i].rotateX,
              opacity: springs[i].opacity,
              transformOrigin:
                "center center calc(-1 * calc(var(--h) / var(--rad)))",
              backfaceVisibility: "hidden",
            }}
            className="absolute -translate-y-1/2 flex items-center justify-center top-1/2 w-full h-[var(--h)]"
          >
            {option.label}
          </animated.div>
        ))}
      </div>
    );
  },
);

export { RotationWheel };
