"use client";

import * as React from "react";
import { useGesture } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";
import { cn } from "@/lib/utils";

type CSSSize = `${number}${"px" | "rem" | "em"}`;

export interface WheelPickerHandle {
  rotateTo: (option: WheelPickerOption) => void;
  reset: () => void;
}

export interface WheelPickerOption {
  value: string;
  label: string;
}

export interface WheelPickerProps {
  forwardedRef?: React.Ref<WheelPickerHandle>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callbackRef?: (instance: any) => void; //RHF callback to set the focus
  value: string;
  options: WheelPickerOption[];
  onPick: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  required?: boolean;
  disabled?: boolean;
  height?: CSSSize; // size of the highleter element
  angleStep?: number; // wheel curvage
  treshHold?: {
    wheel: number
    drag: number
  }; // wheel/drag sensivity
  throttle?: number; // 
  loop?: boolean; // infinite loop
  containerClassName?: string
  optionClassName?: string
  highliterClassName?: string
}

const shift = (prev: number[], loop: boolean, dir: number) => {
  const next = [...prev];

  if (loop) {
    if (dir === 1) {
      const first = next.shift()!;
      next.push(first);
    } else {
      const last = next.pop()!;
      next.unshift(last);
    }
    return next;
  }

  if (dir === 1) {
    const first = next[0];
    if (first >= 0) return next;
    return next.map((n) => n + 1);
  } else {
    const last = next[next.length - 1];
    if (last <= 0) return next;
    return next.map((n) => n - 1);
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
  forwardedRef,
  callbackRef,
  value,
  onPick,
  onFocus,
  onBlur,
  required,
  disabled,
  options,
  loop = options.length >= 4,
  treshHold = {
    wheel: 32,
    drag: 32    
  }, //px
  angleStep = 12, //deg
  height = "2em",
  throttle = 75, //ms
  containerClassName,
  optionClassName,
  highliterClassName,
}: WheelPickerProps) {
  const [wheelState, setWheelState] = React.useState(() => ({
    pos: createPositions(options.length, loop),
    vel: 0,
  }));

  const wheelPickerRef = React.useRef<HTMLDivElement>(null);
  //combine inner ref with RHF callback ref
  const setRefs = React.useCallback(
    (element: HTMLDivElement | null) => {
      wheelPickerRef.current = element;
      if (callbackRef) callbackRef(element);
    },
    [callbackRef]
  );

  const [springs] = useSprings(
    options.length,
    (i) => {
      const { vel: velocity, pos: positions } = wheelState;
      const vel = Math.abs(velocity);
      const pos = positions[i];
      const dist = Math.abs(pos);

      return {
        scale: pos ? 0.9 : 1,
        rotateX: pos * angleStep,
        opacity: [1, 0.75, 0.5, 0.25][dist] ?? 0,
        immediate: dist > 4,
        config: {
          tension: Math.min(500, 250 + vel * 250),
          friction: Math.min(100, 20 + vel * 10),
        },
      };
    },
    [wheelState]
  );

  const lastUpdate = React.useRef<number>(0);
  const eY = React.useRef<number>(0);
  const prevDir = React.useRef<number>(0);

  // throttle animation updates
  const wheelStateUpdate = React.useCallback(
    ({ dir, vel }: { dir: number; vel: number }) => {
      const now = Date.now();
      if (now - lastUpdate.current >= throttle) {
        setWheelState((prev) => ({
          pos: shift([...prev.pos], loop, dir),
          vel,
        }));
        lastUpdate.current = now;
        eY.current = 0;
      }
    },
    [loop, throttle, setWheelState]
  );

  // update parent form
  const first = React.useRef(true);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    if (timer.current) clearTimeout(timer.current);

    // debounce to not overload parent form
    timer.current = setTimeout(() => {
      const selected = options[wheelState.pos.indexOf(0)].value;
      onPick(selected);
      timer.current = null;
    }, 125);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPick, wheelState.pos]);

  // imperiative rotation
  const animateSteps = React.useCallback(
    async (dist: number) => {
      const steps = Math.abs(dist);
      const dir = -Math.sign(dist);

      for (let i = 0; i < steps; i++) {
        wheelStateUpdate({ dir, vel: 0 });
        await new Promise((res) => setTimeout(res, throttle + 5));
      }
    },
    [wheelStateUpdate, throttle]
  );

  // expose imperiative methods
  React.useImperativeHandle(
    forwardedRef,
    () => ({
      rotateTo(to) {
        const pos = options.findIndex((opt) => opt.value === to.value);
        if (pos >= 0) {
          animateSteps(wheelState.pos[pos]);
        }
      },
      reset() {
        animateSteps(wheelState.pos[0]);
      },
    }),
    [wheelState.pos, animateSteps, options]
  );

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
        handleMove(dirY, vY, Math.abs(dY), 'wheel');
      },
      onDrag: ({
        direction: [, dirY],
        velocity: [, vY],
        movement: [, my],
        first,
        last,
      }) => {
        if (disabled) return;
        if (first) eY.current = 0;
        handleMove(-dirY, vY, Math.abs(my), 'drag');
        if (last) eY.current = 0;
      },
    },
    { target: wheelPickerRef, eventOptions: { passive: false } }
  );

  function handleMove(dirY: number, vY: number, dY: number, action: 'wheel' | 'drag') {
    eY.current += dY;

    if (dirY !== prevDir.current && dirY !== 0) {
      prevDir.current = dirY;
      eY.current = 0;
      return;
    }
    const tresh = action === "wheel"
    ? treshHold.wheel
    : action === "drag"
      ? treshHold.drag
      : 32;
  
    if (eY.current > tresh) {
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
      ref={setRefs}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => handleClick()}
      onWheel={() => handleWheel()}
      onKeyDown={(e) => handleKeyDown(e)}
      role="listbox"
      aria-required={required ? true : undefined}
      aria-disabled={disabled ? true : undefined}
        className={cn("select-none touch-none text-[inherit] aria-[disabled]:opacity-75 aria-[disabled]:bg-foreground/5 cursor-grab rounded relative flex-1 overflow-hidden outline-none focus:ring-2 focus:ring-accent", containerClassName)}
      style={{
        perspective: "64rem",
        ["--rad" as string]: (angleStep * 3.14159) / 180,
        ["--wheel-picker-height" as string]: height,
      }}
    >
      <div className={cn("absolute -translate-y-1/2 inset-x-2 top-1/2 rounded bg-foreground/20 h-[var(--wheel-picker-height)]", highliterClassName)} />
      {options.map((option, index) => (
        <animated.div
          tabIndex={-1}
          key={option.label}
          role="option"
          aria-selected={value === option.value}
          style={{
            scale: springs[index].scale,
            rotateX: springs[index].rotateX,
            opacity: springs[index].opacity,
            transformOrigin:
              "center center calc(-1 * calc(var(--wheel-picker-height) / var(--rad)))",
            backfaceVisibility: "hidden",
          }}
          className={cn("absolute -translate-y-1/2 flex flex-col items-center justify-center top-1/2 w-full h-[var(--wheel-picker-height)]", optionClassName)}
        >
          {option.label}
        </animated.div>
      ))}
    </div>
  );
}

export { WheelPicker };
