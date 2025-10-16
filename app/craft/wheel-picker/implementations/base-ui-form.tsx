"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { monthOptions } from "../data";
import { WheelPicker } from "../component";

type ControlWithRef = Field.Control.Props & {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
};

function BaseUITest() {
  const [errors, setErrors] = React.useState({});
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
    >
      <Field.Root name="date">
        <Field.Control
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
              <div className="flex h-48 gap-1 w-40">
                <WheelPicker
                  value={month}
                  options={monthOptions}
                  onPick={setMonth}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  required={required}
                  disabled={disabled}
                />

                <input
                  ref={ref}
                  id={id}
                  name={name}
                  type="text"
                  value={month}
                  disabled={disabled}
                  onChange={onChange}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only"
                />
              </div>
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

export { BaseUITest };
