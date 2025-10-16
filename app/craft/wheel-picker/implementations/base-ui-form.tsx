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

    const [data, setData] = React.useState<string | null>(null);

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const value = formData.get("date") as string;
        console.log("submited:", value);
        setData(value)
      }}
      className={'flex-1 flex flex-col space-y-6 items-center'}
    >
      <h2>Base UI Form</h2>
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
              <div className="border border-border flex h-48 gap-1 w-40">
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
      </Field.Root>
      <button
          type="submit"
          className="border w-40 border-border rounded hover:bg-accent/20 transition-colors"
        >
          Submit
        </button>
        <div>
        {"{"}month:{data}
        {"}"}
      </div>
    </Form>
  );
}

export { BaseUITest };
