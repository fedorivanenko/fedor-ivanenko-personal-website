"use client";

import * as React from "react";
import { animated, useReducedMotion, useSprings } from "@react-spring/web";
import { cn } from "./utils";
import { useRotationWheel } from "./use-rotation-wheel";

export interface RotationWheelOption<T extends string | number = string> {
  value: T;
  label: React.ReactNode;
}

interface RotationWheelProps<T extends string | number = string> {
  options: RotationWheelOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  error?: boolean;
  loop?: boolean;
  className?: string;
  itemHeight?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const ANGLE_STEP = 12;
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

function RotationWheelInner<T extends string | number>(
  {
    options,
    value,
    onChange,
    disabled = false,
    error = false,
    loop = options.length >= 6,
    className,
    itemHeight = "2em",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  }: RotationWheelProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const n = options.length;
  const idPrefix = React.useId();

  // Resolve value → index
  const activeIndex = React.useMemo(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx === -1 ? 0 : idx;
  }, [options, value]);

  const handleIndexChange = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < n) {
        onChange(options[index].value);
      }
    },
    [onChange, options, n],
  );

  const { safeIndex, velocity, containerRef, handleKeyDown, handleOptionClick } =
    useRotationWheel({
      count: n,
      activeIndex,
      onIndexChange: handleIndexChange,
      loop,
      disabled,
    });

  React.useImperativeHandle(forwardedRef, () => containerRef.current!);

  const reducedMotion = useReducedMotion();
  const [springs] = useSprings(
    n,
    (i) => {
      const rel = relativePosition(i, safeIndex, n, loop);
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
    [safeIndex],
  );

  const optionId = (i: number) => `${idPrefix}-option-${i}`;

  if (n === 0) {
    return (
      <div
        ref={containerRef}
        role="listbox"
        aria-disabled="true"
        aria-label={ariaLabel ?? "Selection wheel"}
        className={cn(
          "select-none relative overflow-hidden h-full",
          className,
        )}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={handleKeyDown}
      role="listbox"
      aria-activedescendant={optionId(safeIndex)}
      aria-roledescription="wheel picker"
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? "Selection wheel")}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      aria-invalid={error || undefined}
      className={cn(
        "select-none touch-none relative overflow-hidden outline-none h-full border rounded transition-colors",
        disabled ? "cursor-default opacity-50" : "cursor-grab",
        error ? "border-destructive" : "border-border",
        !disabled && "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      style={{
        perspective: "64rem",
        ["--rad" as string]: RAD,
        ["--h" as string]: itemHeight,
      }}
    >
      {options.map((option, i) => {
        const rel = relativePosition(i, safeIndex, n, loop);
        const dist = Math.abs(rel);
        const isClickable = !disabled && dist > 0 && dist <= 3;

        return (
          <animated.div
            key={String(option.value)}
            id={optionId(i)}
            role="option"
            aria-selected={i === safeIndex}
            onClick={isClickable ? () => handleOptionClick(i) : undefined}
            style={{
              scale: springs[i].scale,
              rotateX: springs[i].rotateX,
              opacity: springs[i].opacity,
              transformOrigin:
                "center center calc(-1 * calc(var(--h) / var(--rad)))",
              backfaceVisibility: "hidden",
              cursor: isClickable ? "pointer" : undefined,
            }}
            className="absolute -translate-y-1/2 flex items-center justify-center top-1/2 w-full h-[var(--h)]"
          >
            {option.label}
          </animated.div>
        );
      })}
    </div>
  );
}

const RotationWheel = React.forwardRef(RotationWheelInner) as <T extends string | number = string>(
  props: RotationWheelProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

export { RotationWheel };
export type { RotationWheelProps };
