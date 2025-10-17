"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { monthOptions } from "./data";
import { WheelPicker } from "../wheel-picker";

type ControlWithRef = Field.Control.Props & {
  // Base UI provides a callback ref here
  // used to wire focus, events, and validity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
};

function BaseUIForm() {
  // Base UI’s native way to track validation errors
  const [errors, setErrors] = React.useState({});

  // Controlled field value 
  const [month, setMonth] = React.useState<string>("");

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
      className={'flex-1 flex flex-col space-y-6 items-center'}
    >
      <Field.Root name="date"
        // validation state is exposed via [data-invalid]
        className="border border-border flex data-[invalid]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-transparent transition-all duration-250 rounded h-48 w-40 gap-1"
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
                <WheelPicker
                  value={month}
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
                  onChange={onChange}  // lets Field.Control observe changes
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
      <button
          type="submit"
          className="border w-40 border-border rounded hover:bg-accent/20 transition-colors"
        >
          Submit
        </button>
    </Form>
  );
}

export { BaseUIForm };
