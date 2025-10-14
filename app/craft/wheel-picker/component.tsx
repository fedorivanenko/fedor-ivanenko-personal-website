"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { useWheel } from "@use-gesture/react";

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
    treshHold: number;
    throttle: number;
    loop: boolean;
  };
}

const shiftUp = (prev: number[], loop: boolean) => {
  if (loop) {
    const next = [...prev];
    const first = next.shift()!;
    next.push(first);
    return next;
  }
  const first = prev[0];
  if (first >= 0) return prev;
  return prev.map((n) => n + 1);
};

const shiftDown = (prev: number[], loop: boolean) => {
  if (loop) {
    const next = [...prev];
    const last = next.pop()!;
    next.unshift(last);
    return next;
  }
  const last = prev[prev.length - 1];
  if (last <= 0) return prev;
  return prev.map((n) => n - 1);
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
    treshHold: 32,
    throttle: 50,
    loop: true,
  },
}: WheelPickerProps) {
  const [optionPositions, setOptionPositions] = React.useState<number[]>(() =>
    createPositions(options.length, settings.loop)
  );

  const gestureRef = React.useRef<HTMLDivElement>(null);
  const eY = React.useRef<number>(0);
  const prevDir = React.useRef<number>(0);
  const lastUpdate = React.useRef<number>(0);

  React.useEffect(() => {
    onPick(options[optionPositions.indexOf(0)].value);
  }, [optionPositions, onPick, options]);

  useWheel(
    ({ direction: [, dirY], delta: [, dY], event }) => {
      if (disabled) return;
      event.preventDefault();
      eY.current += Math.abs(dY);

      if (dirY !== prevDir.current && dirY !== 0) {
        prevDir.current = dirY;
        eY.current = 0;
        return;
      }

      if (eY.current > settings.treshHold) {
        const now = Date.now();
        if (now - lastUpdate.current >= settings.throttle) {
          setOptionPositions((prev) =>
            dirY > 0
              ? shiftDown([...prev], settings.loop)
              : shiftUp([...prev], settings.loop)
          );
          lastUpdate.current = now;
          eY.current = 0;
        }
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
        setOptionPositions((prev) => shiftDown([...prev], settings.loop));
        break;
      case "ArrowUp":
        e.preventDefault();
        setOptionPositions((prev) => shiftUp([...prev], settings.loop));
        break;
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
      className="border aria-disabled:select-none cursor-grab aria-disabled:cursor-not-allowed rounded p-2 w-40 h-24 relative mb-12 overflow-hidden ring-2 ring-transparent focus:ring-blue-500"
      style={{ perspective: "600px" }}
    >
      {options.map((option, index) => (
        <div
          tabIndex={-1}
          key={option.label}
          role="option"
          aria-selected={value === option.value}
          data-position={optionPositions[index]}
          style={{
            transform: `translateY(${32 * optionPositions[index]}px)`,
            opacity: Math.abs(optionPositions[index]) >= 3 ? 0 : 1,
          }}
          className={`absolute top-8 w-36 left-2 h-8 p-1 transition-all duration-200 ease-out`}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}

type ControlWithRef = Field.Control.Props & {
  ref?: React.Ref<HTMLInputElement>;
};

//Base UI Adapter
function BaseFieldTest() {
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

export { WheelPicker };
export { RHFTest, BaseFieldTest };
