"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { useWheel } from "@use-gesture/react";

export interface WheelPickerOptions {
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
}

function WheelPicker({
  value,
  onPick,
  onFocus,
  onBlur,
  ariaRequired,
  ariaDisabled,
  disabled,
}: WheelPickerProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useWheel(
    ({ delta: [, dy], event }) => {
      event.preventDefault();
      console.log(dy);
    },
    {
      target: ref,
      eventOptions: { passive: false },
    }
  );

  console.log("disbaled:", disabled);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      onFocus={onFocus}
      onBlur={onBlur}
      role="listbox"
      aria-required={ariaRequired}
      aria-disabled={ariaDisabled}
      className="border rounded p-2 w-40"
    >
      {["US", "DE", "FR"].map((option) => (
        <div
          tabIndex={-1}
          key={option}
          role="option"
          aria-selected={value === option}
          className={`cursor-pointer p-1 ${
            value === option ? "bg-accent text-white" : ""
          }`}
          onClick={() => onPick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
}

type ControlWithRef = Field.Control.Props & {
  ref?: React.Ref<HTMLDivElement>;
};

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
        const value = formData.get("country") as string;
        console.log(value);
      }}
    >
      <Field.Root name="country">
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
                />

                <input
                  ref={ref as React.Ref<HTMLInputElement>}
                  disabled={disabled}
                  id={id}
                  name={name}
                  type="text"
                  value={value}
                  required
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
          {(validity) => (validity.validity.valid ? "true" : "false")}
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
