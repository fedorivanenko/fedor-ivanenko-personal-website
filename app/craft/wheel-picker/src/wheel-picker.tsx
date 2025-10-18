"use client";

import * as React from "react";
import { useDrag, useWheel } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";
import { cn } from "@/lib/utils";

type CSSSize = `${number}${"px" | "rem" | "em"}`;

// Exposed imperative API methods for external control
export interface WheelPickerHandle {
  // Rotates wheel to a specific option
  rotateTo: (option: WheelPickerOption) => void;
  // Resets wheel position to the first option
  reset: () => void;
}

// Shape of each selectable option in the picker
export interface WheelPickerOption {
  // Option value used for selection and form integration
  value: string;
  // Display label rendered inside the wheel
  label: React.ReactNode;
}

// Props for the WheelPicker component
export interface WheelPickerProps {
  //
  id: string
  
  // Ref exposing the WheelPickerHandle API
  forwardedRef?: React.Ref<WheelPickerHandle>;

  // React Hook Form internal callback for focus management
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callbackRef?: (instance: any) => void;

  // List of selectable options displayed in the wheel
  options: WheelPickerOption[];

  // Callback fired when user selects an option
  onPick: (value: string) => void;

  // Handlers for focus and blur events (a11y and form integration)
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;

  // Marks the picker as required for aria-required
  required?: boolean;

  // Disables user input and animations
  disabled?: boolean;

  // Height of the highlighter (e.g., "1.2em", "32px")
  height?: CSSSize;

  // Angular distance between visible options in degrees (controls curvature)
  angleStep?: number;

  // Threshold (in px) to trigger selection movement for wheel and drag
  tresHold?: {
    wheel: number;
    drag: number;
  };

  // Enables infinite looping (default true if > 6 options)
  loop?: boolean;

  // Optional custom class for the root container
  containerClassName?: string;

  // Optional custom class applied to each option
  optionClassName?: string;

  // Optional custom class for the highlighter element
  highliterClassName?: string;
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
  id,
  forwardedRef,
  callbackRef,
  onPick,
  onFocus,
  onBlur,
  required,
  disabled,
  options,
  loop = options.length >= 6,
  tresHold = {
    wheel: 32, //px
    drag: 24, //px
  },
  angleStep = 12, //deg
  height = "2em",
  containerClassName,
  optionClassName,
  highliterClassName,
}: WheelPickerProps) {
  // minimum interval (ms) between wheel updates to prevent animation jamming
  const throttle = 72; 

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

  const rotateTo = React.useCallback(
    (to: WheelPickerOption) => {
      const pos = options.findIndex((opt) => opt.value === to.value);
      if (pos >= 0) {
        animateSteps(wheelState.pos[pos]);
      }
    },
    [options, wheelState.pos, animateSteps]
  );

  // expose imperiative methods
  React.useImperativeHandle(
    forwardedRef,
    () => ({
      rotateTo,
      reset() {
        animateSteps(wheelState.pos[0]);
      },
    }),
    [wheelState.pos, animateSteps, rotateTo]
  );

  // gestures
  useWheel(
    ({ velocity: [, vY], direction: [, dirY], delta: [, dY], event }) => {
      if (disabled) return;

      event.preventDefault();
      handleMove(dirY, vY, Math.abs(dY), "wheel");
    },
    {
      target: wheelPickerRef,
      eventOptions: { passive: false },
    }
  );

  useDrag(
    ({
      direction: [, dirY],
      velocity: [, vY],
      delta: [, dY],
      first,
      last,
      event,
    }) => {
      if (disabled) return;
      event.preventDefault();
      if (first) eY.current = 0;

      handleMove(-dirY, vY, dY, "drag");

      // inertia
      if (last && vY > 0.1) {
        const steps = Math.min(Math.round(vY * 8), 12);

        for (let i = 0; i < steps; i++) {
          const decay = Math.exp(-i / 6);
          const vel = vY * 4 * decay;
          const delay = throttle + i * i * 6;
          
          setTimeout(() => {
            wheelStateUpdate({ dir: -dirY, vel });
          }, delay);
        }
      }
    },
    {
      target: wheelPickerRef,
      axis: "y",
      filterTaps: true,
      rubberband: 0,
      eventOptions: { passive: false },
      pointer: { touch: true },
    }
  );

  function handleMove(
    dirY: number,
    vY: number,
    dY: number,
    action: "wheel" | "drag"
  ) {
    eY.current += Math.abs(dY);

    if (dirY !== prevDir.current && dirY !== 0) {
      prevDir.current = dirY;
      eY.current = 0;
      return;
    }
    const tresh =
      action === "wheel"
        ? tresHold.wheel
        : action === "drag"
        ? tresHold.drag
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

  const selectedIndex = wheelState.pos.indexOf(0);
  const selectedValue = options[selectedIndex]?.value;

  return (
    <div
      id={id}
      ref={setRefs}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => handleClick()}
      onWheel={() => handleWheel()}
      onKeyDown={(e) => handleKeyDown(e)}
      aria-required={required ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      role="listbox"
      aria-live="polite"
      className={cn(
        "select-none touch-none text-[inherit] aria-[disabled]:opacity-75 aria-[disabled]:bg-foreground/5 cursor-grab rounded relative flex-1 overflow-hidden outline-none focus:ring-2 focus:ring-accent",
        containerClassName
      )}
      style={{
        perspective: "64rem",
        ["--rad" as string]: (angleStep * 3.14159) / 180,
        ["--wheel-picker-height" as string]: height,
      }}
    >
      <div
        className={cn(
          "absolute -translate-y-1/2 inset-x-2 top-1/2 rounded bg-foreground/5 h-[var(--wheel-picker-height)]",
          highliterClassName
        )}
      />
      {options.map((option, index) => (
        <animated.div
          tabIndex={-1}
          key={option.value}
          role="option"
          aria-selected={option.value === selectedValue}
          style={{
            scale: springs[index].scale,
            rotateX: springs[index].rotateX,
            opacity: springs[index].opacity,
            transformOrigin:
              "center center calc(-1 * calc(var(--wheel-picker-height) / var(--rad)))",
            backfaceVisibility: "hidden",
          }}
          className={cn(
            "absolute -translate-y-1/2 flex flex-col items-center justify-center top-1/2 w-full h-[var(--wheel-picker-height)]",
            optionClassName
          )}
          onClick={() => rotateTo(option)}
        >
          {option.label}
        </animated.div>
      ))}
    </div>
  );
}

interface WheelPickerWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  invalid: boolean;
}

const wheelPickerWrapperStyle =
  "border border-border flex data-[invalid]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-transparent transition-all duration-250 rounded";

function WheelPickerWrapper(props: WheelPickerWrapperProps) {
  return (
    <div
      {...(props.invalid ? { "data-invalid": "" } : null)}
      className={cn(wheelPickerWrapperStyle, props.className)}
    >
      {props.children}
    </div>
  );
}

export { WheelPicker, WheelPickerWrapper, wheelPickerWrapperStyle };
