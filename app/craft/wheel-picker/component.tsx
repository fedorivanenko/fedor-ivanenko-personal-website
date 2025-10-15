"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { useWheel } from "@use-gesture/react";
import { animated, useSprings } from "@react-spring/web";

export interface WheelPickerProps {
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
  settings?: {
    angleStep: number;
    treshHold: number;
    throttle: number;
    loop: boolean;
  };
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

const options = [
  { value: "JAN", label: "January" },
  { value: "FEB", label: "February" },
  { value: "MAR", label: "March" },
  { value: "APR", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUN", label: "June" },
  { value: "JUL", label: "July" },
  { value: "AUG", label: "August" },
  { value: "SEP", label: "September" },
  { value: "OCT", label: "October" },
  { value: "NOV", label: "November" },
  { value: "DEC", label: "December" },
  { value: "THR", label: "Trinteber" },
  { value: "FOU", label: "Fourtember" },
] satisfies WheelPickerProps["options"];

//Core
function WheelPicker({
  value,
  onPick,
  onFocus,
  onBlur,
  required,
  disabled,
  options,
  settings = {
    angleStep: 12, //deg
    treshHold: 32,
    throttle: 75,
    loop: true,
  },
}: WheelPickerProps) {
  const [wheelState, setWheelState] = React.useState(() => ({
    positions: createPositions(options.length, settings.loop),
    velocity: 0,
  }));

  const gestureRef = React.useRef<HTMLDivElement>(null);
  const eY = React.useRef<number>(0);
  const prevDir = React.useRef<number>(0);
  const lastUpdate = React.useRef<number>(0);

  const [springs] = useSprings(
    options.length,
    (i) => {
      const { velocity, positions } = wheelState;
      const v = Math.abs(velocity);
      const pos = positions[i];
      const dist = Math.abs(pos);
  
      return {
        scale: pos ? 0.9 : 1,
        rotateX: pos * settings.angleStep,
        opacity: [1, 0.75, 0.5, 0.25][dist] ?? 0,
        immediate: dist > 4,
        config: {
          tension: Math.min(500, 240 + v * 50),
          friction: Math.min(100, 20 + v * 10),
        },
      };
    },
    [wheelState]
  );

  const wheelStateUpdate = ({
    direction,
    velocity,
  }: {
    direction: number;
    velocity: number;
  }) => {
    const now = Date.now();
    if (now - lastUpdate.current >= settings.throttle) {
      setWheelState((prev) => ({
        positions: shift([...prev.positions], settings.loop, direction),
        velocity: velocity,
      }));
      lastUpdate.current = now;
      eY.current = 0;
    }
  };

  React.useEffect(() => {
    onPick(options[wheelState.positions.indexOf(0)].value);
  }, [wheelState, onPick, options]);

  useWheel(
    ({ velocity: [, vY], direction: [, dirY], delta: [, dY], event }) => {
      if (disabled) return;
      event.preventDefault();
      eY.current += Math.abs(dY);

      if (dirY !== prevDir.current && dirY !== 0) {
        prevDir.current = dirY;
        eY.current = 0;
        return;
      }

      if (eY.current > settings.treshHold) {
        wheelStateUpdate({
          direction: dirY,
          velocity: vY,
        });
      }
    },
    {
      target: gestureRef,
      eventOptions: { passive: false },
    }
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        wheelStateUpdate({
          direction: -1,
          velocity: 0,
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        wheelStateUpdate({
          direction: 1,
          velocity: 0,
        });
        break;
      case "Escape":
        e.preventDefault();
        gestureRef.current?.blur();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    gestureRef.current?.focus();
  };

  const handleWheel = () => {
    if (disabled) return;
    gestureRef.current?.focus();
  };

  return (
    <div
      ref={gestureRef}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => handleClick()}
      onWheel={() => handleWheel()}
      onKeyDown={(e) => handleKeyDown(e)}
      role="listbox"
      aria-required={required ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      className="[--h:12rem] h-[var(--h)] [transform-style:preserve-3d] select-none border border-border cursor-grab rounded w-40 relative mb-12 overflow-hidden outline-none focus:ring-2 focus:ring-blue-500"
      style={{
        perspective: "64rem",
        ["--height" as string]: "2rem",
        ["--step" as string]: (settings.angleStep * Math.PI) / 180,
        ["--r" as string]: "calc(var(--height) / var(--step))",
      }}
    >
      <div className="absolute -translate-y-1/2 inset-x-2 top-1/2 rounded bg-foreground/20 h-[var(--height)]" />
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
            transformOrigin: "center center calc(-1 * var(--r))",
            backfaceVisibility: "hidden",
          }}
          className={`absolute -translate-y-1/2 flex flex-col items-center justify-center top-1/2 w-full h-[var(--height)] `}
        >
          {option.label}
        </animated.div>
      ))}
    </div>
  );
}

type ControlWithRef = Field.Control.Props & {
  ref?: React.Ref<HTMLInputElement>;
};

//Base UI Adapter
function BaseUITest() {
  const [errors, setErrors] = React.useState({});

  const [value, setValue] = React.useState<string>("");

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const value = formData.get("month") as string;
        console.log("submited:", value);
      }}
    >
      <Field.Root name="month">
        <Field.Control
          value={value}
          required
          onValueChange={setValue}
          render={(controlProps) => {
            const {
              name,
              id,
              disabled,
              required,
              ref,
              onFocus,
              onBlur,
              onChange,
            }: ControlWithRef = controlProps;

            return (
              <>
                <WheelPicker
                  value={value}
                  options={options}
                  onPick={setValue}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  required={required}
                  disabled={disabled}
                />

                <input
                  id={id}
                  ref={ref}
                  name={name}
                  type="text"
                  value={value}
                  disabled={disabled}
                  onChange={onChange}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only"
                />
              </>
            );
          }}
        />
        <Field.Error />
        <Field.Validity>
          {(validity) => {
            return <p>{validity.validity.valid ? "true" : "false"}</p>;
          }}
        </Field.Validity>
      </Field.Root>
      <button type="submit">Submit</button>
    </Form>
  );
}

function RHFTest() {
  return null;
}

function TanStackFormTest() {
  return null
}

export { WheelPicker };
export { RHFTest, BaseUITest, TanStackFormTest};
