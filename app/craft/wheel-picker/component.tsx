"use client";

import * as React from "react";
import { useGesture } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";

type CSSSize = `${number}${"px" | "rem" | "em"}`;

export interface WheelPickerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callbackRef?: (instance: any) => void; //RHF callback to set the focus
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onPick: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  required?: boolean;
  disabled?: boolean;
  height?: CSSSize;
  angleStep?: number;
  treshHold?: number;
  throttle?: number;
  loop?: boolean;
}

const shift = (
  prev: number[],
  loop: boolean,
  dir: number,
  size: number = 1
) => {
  const next = [...prev];
  const clampedSize = Math.min(Math.max(size, 0), next.length);

  if (loop) {
    if (dir === 1) {
      for (let i = 0; i < clampedSize; i++) {
        const first = next.shift()!;
        next.push(first);
      }
    } else {
      for (let i = 0; i < clampedSize; i++) {
        const last = next.pop()!;
        next.unshift(last);
      }
    }
    return next;
  }

  if (dir === 1) {
    const first = next[0];
    if (first >= 0) return next;
    return next.map((n) => n + clampedSize);
  } else {
    const last = next[next.length - 1];
    if (last <= 0) return next;
    return next.map((n) => n - clampedSize);
  }
};

const createPositions = (length: number, centered: boolean): number[] => {
  if (centered) {
    const mid = Math.floor(length / 2);
    return Array.from({ length }, (_, i) => (i <= mid ? i : i - length));
  }
  return Array.from({ length }, (_, i) => i);
};

//Core
function WheelPicker({
  callbackRef,
  value,
  onPick,
  onFocus,
  onBlur,
  required,
  disabled,
  options,
  loop = options.length >= 4,
  treshHold = 32, //px
  angleStep = 12, //deg
  height = "2em",
  throttle = 75, //ms
}: WheelPickerProps) {
  const [wheelState, setWheelState] = React.useState(() => ({
    positions: createPositions(options.length, loop),
    velocity: 0,
  }));

  const wheelPickerRef = React.useRef<HTMLDivElement>(null);
  const setWheelPickerRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      wheelPickerRef.current = element;
      if (callbackRef) callbackRef(element);
    },
    [callbackRef]
  );

  const [springs] = useSprings(
    options.length,
    (i) => {
      const { velocity, positions } = wheelState;
      const v = Math.abs(velocity);
      const pos = positions[i];
      const dist = Math.abs(pos);

      return {
        scale: pos ? 0.9 : 1,
        rotateX: pos * angleStep,
        opacity: [1, 0.75, 0.5, 0.25][dist] ?? 0,
        immediate: dist > 4,
        config: {
          tension: Math.min(500, 250 + v * 250),
          friction: Math.min(100, 20 + v * 10),
        },
      };
    },
    [wheelState]
  );

  const lastUpdate = React.useRef<number>(0);
  const eY = React.useRef<number>(0);
  const prevDir = React.useRef<number>(0);

  // debouncing
  const wheelStateUpdate = ({ dir, vel }: { dir: number; vel: number }) => {
    const now = Date.now();
    if (now - lastUpdate.current >= throttle) {
      setWheelState((prev) => ({
        positions: shift([...prev.positions], loop, dir),
        velocity: vel,
      }));
      lastUpdate.current = now;
      eY.current = 0;
    }
  };

  // update parent form
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const selected = options[wheelState.positions.indexOf(0)].value;
    console.log("pick:", selected);
    onPick(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPick, wheelState.positions]);

  useGesture(
    {
      onWheel: ({
        velocity: [, vY],
        direction: [, dirY],
        delta: [, dY],
        event,
      }) => {
        if (disabled) return;
        event.preventDefault();
        handleMove(dirY, vY, Math.abs(dY));
      },
      onDrag: ({
        movement: [, my],
        direction: [, dirY],
        velocity: [, vY],
        first,
        last,
      }) => {
        if (disabled) return;
        if (first) eY.current = 0;
        handleMove(dirY, vY, Math.abs(my));
        if (last) eY.current = 0;
      },
    },
    { target: wheelPickerRef, eventOptions: { passive: false } }
  );

  function handleMove(dirY: number, vY: number, deltaY: number) {
    eY.current += deltaY;

    if (dirY !== prevDir.current && dirY !== 0) {
      prevDir.current = dirY;
      eY.current = 0;
      return;
    }

    if (eY.current > treshHold) {
      wheelStateUpdate({ dir: dirY, vel: vY });
    }
  }

  // events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        wheelStateUpdate({
          dir: -1,
          vel: 0,
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        wheelStateUpdate({
          dir: 1,
          vel: 0,
        });
        break;
      case "Escape":
        e.preventDefault();
        wheelPickerRef.current?.blur();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    wheelPickerRef.current?.focus();
  };

  const handleWheel = () => {
    if (disabled) return;
    wheelPickerRef.current?.focus();
  };

  return (
    <div
      ref={setWheelPickerRef}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => handleClick()}
      onWheel={() => handleWheel()}
      onKeyDown={(e) => handleKeyDown(e)}
      role="listbox"
      aria-required={required ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      className="select-none text-[inherit] aria-[disabled]:opacity-75 aria-[disabled]:bg-foreground/5 cursor-grab rounded relative flex-1 overflow-hidden outline-none focus:ring-2 focus:ring-accent"
      style={{
        perspective: "64rem",
        ["--rad" as string]: (angleStep * 3.14159) / 180,
        ["--wheel-picker-height" as string]: height,
      }}
    >
      <div className="absolute -translate-y-1/2 inset-x-2 top-1/2 rounded bg-foreground/20 h-[var(--wheel-picker-height)]" />
      {options.map((option, index) => (
        <animated.div
          tabIndex={-1}
          key={option.label}
          role="option"
          aria-selected={value === option.value}
          style={{
            ...springs[index],
            scale: springs[index].scale,
            rotateX: springs[index].rotateX,
            opacity: springs[index].opacity,
            transformOrigin:
              "center center calc(-1 * calc(var(--wheel-picker-height) / var(--rad)))",
            backfaceVisibility: "hidden",
          }}
          className="absolute -translate-y-1/2 flex flex-col items-center justify-center top-1/2 w-full h-[var(--wheel-picker-height)]"
        >
          {option.label}
        </animated.div>
      ))}
    </div>
  );
}

export { WheelPicker };
