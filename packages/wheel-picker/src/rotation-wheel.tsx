"use client";

import * as React from "react";
import { useDrag, useWheel } from "@use-gesture/react";
import { animated, useReducedMotion, useSprings } from "@react-spring/web";
import { cn } from "./utils";

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
const THRESHOLD = 32; // px — ratchet tooth spacing
const MIN_SNAP_MS = 50; // below this Δt, skip animation entirely

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

// Spring config that fits within the inter-click window: Δt = THRESHOLD / velocity
// At high velocity Δt shrinks → spring must settle faster → higher tension
// friction = 2√tension keeps the spring critically damped (no overshoot)
function clickConfig(velocity: number): {
  immediate: boolean;
  tension: number;
  friction: number;
} {
  const dt = velocity > 0 ? THRESHOLD / velocity : Infinity;
  if (dt < MIN_SNAP_MS) return { immediate: true, tension: 170, friction: 26 };
  const t = MIN_SNAP_MS / dt; // 0 = slow, 1 = at threshold
  const tension = Math.round(170 + t * 630); // 170 → 800
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
    const [activeIndex, setActiveIndex] = React.useState(0);

    // Velocity signal — written by input layer, read by visual layer via useSprings factory
    const velRef = React.useRef(0);
    const sourceRef = React.useRef<"gesture" | "inertia" | "key">("gesture");

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

    // Visual: spring config derived from both activeIndex (position target) and velRef (timing constraint)
    const reducedMotion = useReducedMotion();
    const [springs] = useSprings(
      n,
      (i) => {
        const rel = relativePosition(i, activeIndex, n, loop);
        const dist = Math.abs(rel);
        const { immediate: velImmediate, tension, friction } = clickConfig(velRef.current);
        const immediate = dist > 4 || !!reducedMotion || velImmediate;
        if (i === 0) {
          console.log(`[rw:spring:${sourceRef.current}] index=${activeIndex} vel=${velRef.current.toFixed(3)} tension=${tension} friction=${friction} immediate=${immediate}`);
        }
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

    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwardedRef, () => ref.current!);

    const acc = React.useRef(0);
    const prevDir = React.useRef(0);
    const inertiaTimers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

    function cancelInertia() {
      if (inertiaTimers.current.length > 0) {
        console.log(`[rw] inertia cancelled (${inertiaTimers.current.length} pending)`);
        inertiaTimers.current.forEach(clearTimeout);
        inertiaTimers.current = [];
      }
    }

    // Schedules steps at Δt_k = THRESHOLD / v_k intervals with exponentially decaying velocity.
    // Same ratchet equation as active gesture — the wheel just keeps spinning and slows down.
    function applyInertia(v0: number, dir: number) {
      cancelInertia();
      let t = 0;
      let steps = 0;
      for (let k = 0; k < 12; k++) {
        const vk = v0 * Math.exp(-k / 6);
        if (vk < 0.02) break;
        t += THRESHOLD / vk;
        steps++;
        const capturedV = vk;
        const capturedK = k;
        inertiaTimers.current.push(
          setTimeout(() => {
            velRef.current = capturedV;
            sourceRef.current = "inertia";
            console.log(`[rw:inertia] step ${capturedK} vel=${capturedV.toFixed(3)} Δt=${Math.round(THRESHOLD / capturedV)}ms`);
            rotate(dir);
          }, t),
        );
      }
      console.log(`[rw:inertia] scheduled ${steps} steps over ~${Math.round(t)}ms (v0=${v0.toFixed(3)})`);
    }

    function handleMove(dir: number, dY: number, velocity: number, source: "wheel" | "drag") {
      if (dir !== 0 && dir !== prevDir.current) {
        prevDir.current = dir;
        acc.current = 0;
        return;
      }
      acc.current += Math.abs(dY);
      if (acc.current >= THRESHOLD) {
        acc.current = 0;
        velRef.current = velocity;
        sourceRef.current = source;
        console.log(`[rw:${source}] click vel=${velocity.toFixed(3)} dt=${Math.round(THRESHOLD / velocity)}ms`);
        rotate(dir);
      }
    }

    useWheel(
      ({ direction: [, dirY], velocity: [, vY], delta: [, dY], event }) => {
        event.preventDefault();
        handleMove(dirY, dY, Math.abs(vY), "wheel");
      },
      { target: ref, eventOptions: { passive: false } },
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
        handleMove(-dirY, dY, Math.abs(vY), "drag");
      },
      {
        target: ref,
        axis: "y",
        filterTaps: true,
        eventOptions: { passive: false },
        pointer: { touch: true, keys: false },
      },
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      cancelInertia();
      // Repeat events arrive faster than any spring can settle → snap immediately.
      // First press has no prior velocity → animate normally.
      velRef.current = e.repeat ? Infinity : 0;
      sourceRef.current = "key";
      console.log(`[rw:key] ${e.key} repeat=${e.repeat}`);
      rotate(e.key === "ArrowDown" ? 1 : -1);
    };

    // Skip initial render, debounce rapid changes
    const isFirst = React.useRef(true);
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    React.useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onPick(options[activeIndex].value);
        timer.current = null;
      }, 125);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
      // biome-ignore lint/react-hooks/exhaustiveDeps: intentionally limited
    }, [onPick, activeIndex]);

    React.useEffect(() => cancelInertia, []);

    return (
      <div
        ref={ref}
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
