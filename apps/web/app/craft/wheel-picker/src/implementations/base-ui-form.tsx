"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { monthOptions } from "./data";
import {
  WheelPicker,
  WheelPickerHandle,
  wheelPickerWrapperStyle,
} from "../wheel-picker";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="border text-sm w-full py-1 cursor-pointer border-border rounded hover:bg-accent/20 transition-colors"
      {...props}
    />
  );
}

type ControlWithRef = Field.Control.Props & {
  // Base UI provides a callback ref
  // to wire focus, events, and validity
  // biome-ignore lint/suspicious/noExplicitAny: Base UI callback ref needs to accept any instance
  ref?: any;
};

function BaseUIForm() {
  // Base UI’s native way to track validation errors
  const [errors, setErrors] = React.useState({});

  // Controlled field value
  const [month, setMonth] = React.useState<string>("");

  const pickerRef = React.useRef<WheelPickerHandle | null>(null);

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const value = formData.get("date") as string;
        console.log("submited:", value);
      }}
      onReset={() => {
        pickerRef.current?.reset();
      }}
      className={"flex-1 flex flex-col space-y-6 items-center"}
    >
      <Field.Root
        name="month"
        // validation state is exposed via [data-invalid]
        className={wheelPickerWrapperStyle}
      >
        <Field.Control
          onValueChange={setMonth} // keeps Field.Control and WheelPicker in sync
          value={month}
          required
          render={(controlProps) => {
            const {
              name,
              id,
              ref,
              disabled,
              required,
              onFocus,
              onBlur,
              onChange,
            }: ControlWithRef = controlProps;

            return (
              <>
                <label
                  // Note that no htmlFor is used
                  // WheelPicker handle label via aria-labelledby
                  id="month-label"
                  className="sr-only"
                >
                  Month
                </label>
                <WheelPicker
                  id={"month"}
                  // Note that WheelPicker is intentionally uncontrolled
                  // and exposes an imperative API for external control
                  //
                  // Looping the value through form.state would trigger
                  // a form re-render on every update, which can occur
                  // as frequently as every 50 ms
                  forwardedRef={pickerRef}
                  options={monthOptions}
                  onPick={setMonth} // update controlled value
                  onFocus={onFocus}
                  onBlur={onBlur}
                  required={required}
                  disabled={disabled}
                />

                <input
                  // Mirror the controlled value into a real input so:
                  // 1) Base UI can use native events/validity
                  // 2) the form can submit value
                  id={id}
                  ref={ref} // registers this input with Field.Control
                  name={name}
                  value={month}
                  required={required}
                  disabled={disabled}
                  onChange={onChange} // lets Field.Control observe changes
                  tabIndex={-1}
                  type="text"
                  aria-hidden="true"
                  className="sr-only"
                />
              </>
            );
          }}
        />
      </Field.Root>
      <div className="flex flex-col space-y-1 w-40">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </Form>
  );
}

export { BaseUIForm };
