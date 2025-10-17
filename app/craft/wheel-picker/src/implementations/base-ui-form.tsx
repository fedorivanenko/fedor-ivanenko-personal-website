"use client";

import * as React from "react";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { monthOptions } from "./data";
import { WheelPicker } from "../wheel-picker";

type ControlWithRef = Field.Control.Props & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any; //misterious callback from inside the base-ui
};

function BaseUITest() {
  const [data, setData] = React.useState<string | null>(null);
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
        setData(value)
      }}
      className={'flex-1 flex flex-col space-y-6 items-center'}
    >
      <h2>Base UI Form</h2>
      <Field.Root name="date"
        className="border border-border flex data-[invalid]:ring-destructive ring-2 ring-offset-4 ring-offset-background ring-transparent transition-all duration-250 rounded h-48 w-40 gap-1"
      >
        <Field.Control
          onValueChange={setMonth}
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
                  onPick={setMonth}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  required={required}
                  disabled={disabled}
                />

                <input
                  id={id}
                  ref={ref}
                  name={name}
                  value={month}
                  required={required}
                  disabled={disabled}
                  onChange={onChange}
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
        <div>
        {"{"}month:{data}
        {"}"}
      </div>
    </Form>
  );
}

export { BaseUITest };
