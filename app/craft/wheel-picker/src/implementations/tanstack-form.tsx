"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import {
  WheelPicker,
  WheelPickerHandle,
  WheelPickerWrapper,
} from "../wheel-picker";
import { formSchema } from "./data";
import { monthOptions } from "./data";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="border text-sm w-full py-1 cursor-pointer border-border rounded hover:bg-accent/20 transition-colors" {...props} />;
}

function TanStackForm() {
  const form = useForm({
    defaultValues: {
      month: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("submitted:", value);
    },
  });

  const pickerRef = useRef<WheelPickerHandle | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onReset={() => {
        form.reset();
        pickerRef.current?.reset();
      }}
      className="flex flex-col items-center space-y-6 flex-1"
    >
      <form.Field name="month">
        {(field) => {
          return (
            <WheelPickerWrapper
              // validation state is not exposed but errors are
              invalid={field.state.meta.errors.length > 0}
              className="w-40 h-48 ring-offset-card"
            >
              <WheelPicker
                // Note that WheelPicker is intentionally uncontrolled
                // and exposes an imperative API for external control
                //
                // Looping the value through form.state would trigger 
                // a form re-render on every update, which can occur
                // as frequently as every 50 ms
                forwardedRef={pickerRef}
                options={monthOptions}
                onPick={field.handleChange} // updates form state
                onBlur={field.handleBlur}
              />
            </WheelPickerWrapper>
          );
        }}
      </form.Field>
      <div className="flex flex-col space-y-1 w-40">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </form>
  );
}

export { TanStackForm };
