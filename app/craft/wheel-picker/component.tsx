"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { useWheel } from "@use-gesture/react";

export interface WheelPickerOption {
  value: string;
  label: string;
}

export interface WheelPickerProps {
  value: string;
  onPick: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  ariaRequired?: React.AriaAttributes["aria-required"];
  ariaDisabled?: React.AriaAttributes["aria-disabled"];
  disabled?: boolean;
  settings? : WheelPickerSettings
  options : WheelPickerOption[]
}

export interface WheelPickerSettings {
  treshHold: number
  throttle: number
}

const shiftDown = (prev: number[]) => {
  const next = [...prev];
  const last = next.pop()!;
  next.unshift(last);
  return next;
};

const shiftUp = (prev: number[]) => {
  const next = [...prev];
  const first = next.shift()!;
  next.push(first);
  return next;
};

const createCenteredPositions = (length: number): number[] => {
  const mid = Math.floor(length / 2);
  return Array.from({ length }, (_, i) => {
    if (i <= mid) return i;
    return i - length;
  });
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
  { value: "DEC", label: "December" }
] satisfies WheelPickerOption[]

//Core
function WheelPicker({
  value,
  onPick,
  onFocus,
  onBlur,
  ariaRequired,
  ariaDisabled,
  //disabled,
  options,
  settings = {
    treshHold: 32,
    throttle: 50
  }
}: WheelPickerProps) {
  
  const [optionPositions, setOptionPositions] = React.useState<number[]>(
    () => createCenteredPositions(options.length)
  );

  const gestureRef = React.useRef<HTMLDivElement>(null);
  const eY = React.useRef<number>(0)
  const prevDir = React.useRef<number>(0)

  const lastUpdate = React.useRef<number>(0);

  React.useEffect(()=>{
    onPick(options[optionPositions.indexOf(0)].value)
  },[optionPositions, onPick, options])

  useWheel(
    ({ direction: [, dirY], delta: [, dY], event }) => {
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
          setOptionPositions(dirY > 0 ? shiftDown : shiftUp);
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

  const handleKeyDown = (e : React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setOptionPositions(shiftDown)
        break
        case 'ArrowUp':
        e.preventDefault()
        setOptionPositions(shiftUp)
        break
    }
  }

  return (
    <div
      ref={gestureRef}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => gestureRef.current?.focus()}
      onWheel={() => gestureRef.current?.focus()}
      onKeyDown={(e) => handleKeyDown(e)}
      role="listbox"
      aria-required={ariaRequired}
      aria-disabled={ariaDisabled}
      className="border rounded p-2 w-40 h-24 relative mb-12 overflow-hidden focus:ring-1 focus:ring-blue-500"
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
            //rotateX(${optionPositions[index]}deg)
            transform: `translateY(${32 * optionPositions[index]}px)`,
            opacity: Math.abs(optionPositions[index]) >= 3 ? 0 : 1
          }}
          className={`absolute top-8 w-36 left-2 h-8 cursor-pointer p-1 transition-all duration-200 ease-out`}
          //onClick={() => onPick(option.value)}
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
        console.log('submited:', value);
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
              ["aria-disabled"]: ariaDisabled,
              ["aria-required"]: ariaRequired,
              ref,
              onFocus,
              onBlur,
              onChange,
            }: ControlWithRef = controlProps;

            return (
              <>
                <WheelPicker
                  value={value}
                  onPick={setValue}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  ariaDisabled={ariaDisabled}
                  ariaRequired={ariaRequired}
                  disabled={disabled}
                  options={options}
                />

                <input
                  ref={ref}
                  disabled={disabled}
                  id={id}
                  value={value}
                  onChange={onChange}
                  name={name}
                  type="text"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only"
                />
              </>
            );
          }}
        />
        <Field.Error/>
        <Field.Validity>
          {(validity) => {
            return (
              <p>{validity.validity.valid ? "true" : "false"}</p>
            )
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
